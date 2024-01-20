const HttpStatus = require("http-status");
const models = require("../models/index.models.js");
const ApiError = require("../utils/ApiError.js");
const catchAsync = require("../utils/catchAsync.js");
const mongoose = require("mongoose");
const {
  TicketFilterByKeysArr,
  TicketStatus,
  splitAndFilterString,
  TicketPopulateFields,
  ALLOW_TICKET_RAISE_IF_NO_AGENT,
  ALLOW_TICKET_RESOLVE_IF_UNASSIGNED,
  ALLOW_TICKET_DELETE_IF_ASSIGNED,
} = require("../constants.js");

/**
 * Create a new ticket
 * */
const createTicket = catchAsync(async (req, res, next) => {
  const body = req.body;

  // Gives admin the flexibility to control these actions
  if (!ALLOW_TICKET_RAISE_IF_NO_AGENT) {
    const agents = await models.agentSchema.countDocuments();
    if (!agents || agents <= 0)
      throw new ApiError(HttpStatus.BAD_REQUEST, "Please create an agent first");
  }

  const ticket = await models.ticketSchema.create(body);
  if (!ticket) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Ticket creation failed");
  }

  assignTicketsToAgents(); // invoke assign tickets function

  return res.status(HttpStatus.CREATED).json({ success: true, data: ticket });
});

/** Get details of a specific ticket by id */
const getATicket = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  const ticket = await models.ticketSchema.findById(id).populate(TicketPopulateFields);
  if (!ticket) {
    throw new ApiError(HttpStatus.NOT_FOUND, "No ticket found");
  }

  return res.status(HttpStatus.OK).json({ success: true, data: ticket });
});

/** Get details of a specific ticket by id */
const deleteATicket = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  if (!ALLOW_TICKET_DELETE_IF_ASSIGNED) {
    const isAssigned = await models.ticketSchema.findOne({
      _id: id,
      assignedTo: { $exists: true, $nin: [null, undefined] },
    });

    if (isAssigned) {
      throw new ApiError(HttpStatus.BAD_REQUEST, "Assigned tickets cannot be deleted");
    }
  }

  const deletedTicket = await models.ticketSchema.findByIdAndDelete(id);
  if (!deletedTicket) {
    throw new ApiError(HttpStatus.NOT_FOUND, "No ticket found");
  }

  return res.status(HttpStatus.OK).json({ success: true, data: deletedTicket });
});

/**
 * Update a ticket's details by id
 * */
const updateTicket = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  const ticket = await models.ticketSchema.findById(id);
  if (!ticket) {
    throw new ApiError(HttpStatus.NOT_FOUND, "No ticket found");
  }

  // Gives admin the flexibility to control these actions
  if (
    !ALLOW_TICKET_RESOLVE_IF_UNASSIGNED &&
    !ticket.assignedTo &&
    body.status === TicketStatus.resolved
  ) {
    // Todo: Give admin the flexibility to enable or disable it
    throw new ApiError(HttpStatus.BAD_REQUEST, "Ticket not assigned yet. Cannot resolve ticket.");
  }

  if (ticket.resolvedOn && ticket.status === TicketStatus.resolved) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Ticket resolved. Update not allowed");
  }

  if (body.status === TicketStatus.resolved) {
    // Attach resolved on time when a ticket status is updated to resolved
    body["resolvedOn"] = new Date().toISOString();
  }

  const updatedTicket = await models.ticketSchema
    .findByIdAndUpdate(id, { $set: body }, { new: true })
    .populate(TicketPopulateFields);

  return res.status(HttpStatus.OK).json({ success: true, data: updatedTicket });
});

/**
 * Get a list of all tickets with optional filtering and pagination
 * */
const getAllTickets = catchAsync(async (req, res, next) => {
  const mongoQuery = { search: {}, sortBy: {} },
    limit = Math.max(Math.min(req.query.limit || 1000, 1000), 1),
    page = Math.max(req.query.page || 1, 1);

  buildMongoQuery(req, mongoQuery);

  const [tickets, ticketsCount] = await Promise.all([
    models.ticketSchema
      .find(mongoQuery.search)
      .populate(TicketPopulateFields)
      .sort(mongoQuery.sortBy)
      .skip(limit * (page - 1))
      .limit(limit),
    models.ticketSchema.find(mongoQuery.search).countDocuments(),
  ]);

  return res
    .status(HttpStatus.OK)
    .json({ success: true, page, count: ticketsCount, data: tickets });
});

/**
 *  Build the MongoDB query for filtering tickets on basis of user's input
 * */
const buildMongoQuery = (req, mongoQuery) => {
  const sortByOptions = {
    createdAtAsc: { createdAt: 1 },
    createdAtDesc: { createdAt: -1 },
    updatedAtAsc: { updatedAt: 1 },
    updatedAtDesc: { updatedAt: -1 },
    topicAsc: { topic: 1 },
    topicDesc: { topic: -1 },
    resolvedOnAsc: { resolvedOn: 1 },
    resolvedOnDesc: { resolvedOn: -1 },
  };

  mongoQuery["sortBy"] = sortByOptions[req.query.sortBy] || sortByOptions["createdAtDesc"];

  const andQuery = TicketFilterByKeysArr.reduce((acc, key) => {
    const value = req.query[key];
    if (value) {
      acc.push({ [key]: { $in: splitAndFilterString(value) } });
    }
    return acc;
  }, []);

  if (req.query.search && req.query.search.trim()) {
    const regex = { $regex: req.query.search.trim(), $options: "i" };
    andQuery.push({ $or: [{ topic: regex }, { description: regex }] });
  }
  if (andQuery.length) {
    mongoQuery["search"]["$and"] = andQuery;
  }
};

/**
 * Assign unassigned tickets to available agents in round robin format
 * */
const assignTicketsToAgents = catchAsync(async () => {
  // Get Unassigned Tickets, Available Agents, and Last Assigned Ticket
  const [unassignedTickets, agents, lastAssignedTicket] = await Promise.all([
    models.ticketSchema
      .find({
        status: TicketStatus.new,
        $or: [{ assignedTo: { $exists: false } }, { assignedTo: null }],
      })
      .lean()
      .sort({ createdAt: 1 }),
    models.agentSchema.find({ active: true }).sort({ _id: 1 }).lean(), // sorting agents by _id to get the agents in asc order, in mongo _id is in incremental format
    models.ticketSchema
      .find({ status: TicketStatus.assigned })
      .populate(TicketPopulateFields)
      .sort({ createdAt: -1 })
      .limit(1)
      .lean()
      .then((x) => x.pop()),
  ]);

  // If no agents or no tickets available then return
  if (!agents.length || !unassignedTickets.length) {
    console.error(
      `No active agents or unassigned tickets found. \n
       ActiveAgents: ${agents.length}, unassignedTickets: ${unassignedTickets.length}`
    );
  }

  // If Unassinged tickets and Agents are available
  // Loop through the usassigned tickets while checking whom the last raised ticket was assigned
  // If found, get the Agent's index from sorted Agents array and assign the next ticket to
  // next available agent, else start from first agent again
  const assignedTicketsQuery = [];
  if (agents.length && unassignedTickets.length) {
    let lastAgentIndex = agents.findIndex((x) => {
      console.log("index", String(x._id) === String(lastAssignedTicket?.assignedTo?._id));
      return String(x._id) === String(lastAssignedTicket?.assignedTo?._id);
    });

    if (!lastAgentIndex) lastAgentIndex = 0;

    unassignedTickets.forEach((ticket) => {
      lastAgentIndex += 1;
      if (!agents[lastAgentIndex]) lastAgentIndex = 0; // checks for next agent -> if no agent then set agent[0];
      assignedTicketsQuery.push({
        updateOne: {
          filter: { _id: ticket._id },
          update: {
            $set: {
              assignedTo: agents[lastAgentIndex]._id,
              status: TicketStatus.assigned,
            },
          },
        },
      });
    });

    if (!assignedTicketsQuery.length) {
      console.error("No tickets or agents to assign");
    }

    // Use MongoDB's bulkWrite method to update the tickets
    const result = await models.ticketSchema.bulkWrite(assignedTicketsQuery);
    console.log(result);
    return;
  }
});

const unassignTickets = catchAsync(async (id) => {
  const updatedTickets = await models.ticketSchema.updateMany(
    {
      assignedTo: id,
      status: TicketStatus.assigned,
    },
    { $set: { assignedTo: null, status: TicketStatus.new } }
  );

  if (updatedTickets.matchedCount && updatedTickets.modifiedCount) {
    assignTicketsToAgents();
  }
});

module.exports = {
  createTicket,
  getATicket,
  updateTicket,
  getAllTickets,
  assignTicketsToAgents,
  unassignTickets,
  deleteATicket,
};
