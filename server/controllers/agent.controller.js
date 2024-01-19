const models = require("../models/index.models.js");
const HttpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync.js");
const ApiError = require("../utils/ApiError.js");
const mongoose = require("mongoose");
const ticketController = require("./ticket.controller.js");
const { TicketStatus } = require("../constants.js");
require("dotenv/config.js");

const ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS =
  process.env.ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS === "true";

/**
 * Create a new agent
 * */
const createAgent = catchAsync(async (req, res, next) => {
  const body = req.body;

  const agent = await models.agentSchema.create(body);

  if (!agent) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Agent creation failed");
  }

  ticketController.assignTicketsToAgents(); // Invoke assign tickets function

  return res.status(HttpStatus.CREATED).json({ success: true, data: agent });
});

/**
 * Get details of a specific agent by id
 * */
const getAnAgent = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  const agent = await models.agentSchema.findById(id);

  if (!agent) {
    throw new ApiError(HttpStatus.NOT_FOUND, "No agent found");
  }

  return res.status(HttpStatus.OK).json({ success: true, data: agent });
});

/**
 * Get details of a specific agent by id
 * */
const deleteAnAgent = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  if (!ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS) {
    const tickets = await models.ticketSchema.countDocuments({
      assignedTo: id,
      status: { $ne: TicketStatus.resolved },
    });

    if (tickets && tickets > 0) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        "Delete failed, Agent has active tickets"
      );
    }
  }

  const agent = await models.agentSchema.findByIdAndDelete(id);

  if (!agent) {
    throw new ApiError(HttpStatus.NOT_FOUND, "No agent found");
  }
  if (ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS && agent) {
    ticketController.unassignTickets(agent._id);
  }

  return res.status(HttpStatus.OK).json({ success: true, data: agent });
});

/**
 * Update an agent's details by id
 * */
const updateAgent = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  // Gives admin the flexibility to control these actions
  if (
    !ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS &&
    body.active === false
  ) {
    const tickets = await models.ticketSchema.countDocuments({
      assignedTo: id,
      status: { $ne: TicketStatus.resolved },
    });

    if (tickets && tickets > 0) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        "Update failed, Agent has active tickets"
      );
    }
  }

  const updatedAgent = await models.agentSchema.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );

  if (!updatedAgent) throw new ApiError(HttpStatus.NOT_FOUND, "No agent found");

  if (ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS && !updatedAgent.active) {
    ticketController.unassignTickets(updatedAgent._id);
  }

  if (updatedAgent.active) {
    ticketController.assignTicketsToAgents();
  }

  return res.status(HttpStatus.OK).json({ success: true, data: updatedAgent });
});

/**
 * Get a list of all agents with optional filtering and pagination
 * */
const getAllAgents = catchAsync(async (req, res, next) => {
  const mongoQuery = { search: {}, sortBy: {} },
    limit = Math.max(Math.min(req.query.limit || 1000, 1000), 1),
    page = Math.max(req.query.page || 1, 1);

  buildMongoQuery(req, mongoQuery);

  const [agents, agentsCount] = await Promise.all([
    models.agentSchema
      .find(mongoQuery.search)
      .sort(mongoQuery.sortBy)
      .skip(limit * (page - 1))
      .limit(limit),
    models.agentSchema.find(mongoQuery.search).countDocuments(),
  ]);

  return res
    .status(HttpStatus.OK)
    .json({ success: true, page, count: agentsCount, data: agents });
});

/**
 * Build the MongoDB query for filtering agents based on user input
 * */
const buildMongoQuery = (req, mongoQuery) => {
  const sortByOptions = {
    createdAtAsc: { createdAt: 1 },
    createdAtDesc: { createdAt: -1 },
    updatedAtAsc: { updatedAt: 1 },
    updatedAtDesc: { updatedAt: -1 },
    phoneAsc: { phone: 1 },
    phoneDesc: { phone: -1 },
    activeAsc: { active: 1 },
    activeDesc: { active: -1 },
  };
  const allowedSearchByFields = ["name", "email", "description", "phone"];

  const searchValue = req.query.search?.trim() || "";
  const searchBy = allowedSearchByFields.includes(req.query.searchBy?.trim())
    ? req.query.searchBy?.trim()
    : null;
  const isPhoneNumber = Math.abs(parseInt(searchValue)) || null;
  const regex = { $regex: searchValue, $options: "i" };

  if ((searchBy && !searchValue) || (searchBy === "phone" && !isPhoneNumber)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, `Invalid search combination`);
  }

  if (searchBy === "phone" && isPhoneNumber) {
    mongoQuery["search"] = { [searchBy]: isPhoneNumber };
  } else if (searchBy) {
    mongoQuery["search"] = { [searchBy]: regex };
  } else {
    mongoQuery["search"]["$or"] = [
      { name: regex },
      { email: regex },
      { description: regex },
    ];
  }

  mongoQuery["sortBy"] =
    sortByOptions[req.query.sortBy] || sortByOptions["createdAtDesc"];
};

module.exports = {
  createAgent,
  getAnAgent,
  deleteAnAgent,
  updateAgent,
  getAllAgents,
};
