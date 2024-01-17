import HttpStatus from "http-status";
import models from "../models/index.models.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import mongoose from "mongoose";
import {
  TicketFilterByKeysArr,
  TicketStatus,
  splitAndFilterString,
  TicketPopulateFields,
} from "../constants.js";

const createTicket = catchAsync(async (req, res, next) => {
  const body = req.body;

  const ticket = await models.ticketSchema.create(body);
  if (!ticket) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Ticket creation failed");
  }

  return res.status(HttpStatus.CREATED).json({ success: true, data: ticket });
});

const getATicket = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  const ticket = await models.ticketSchema
    .findById(id)
    .populate(TicketPopulateFields);
  if (!ticket) {
    throw new ApiError(HttpStatus.NOT_FOUND, "No ticket found");
  }

  return res.status(HttpStatus.OK).json({ success: true, data: ticket });
});

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

  if (!ticket.assignedTo && body.status === TicketStatus.resolved) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "Ticket not assigned yet. Cannot resolve ticket."
    );
  }

  if (ticket.resolvedOn && ticket.status === TicketStatus.resolved) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "Ticket resolved. Update not allowed"
    );
  }

  if (body.status === TicketStatus.resolved) {
    body["resolvedOn"] = new Date().toISOString();
  }

  const updatedTicket = await models.ticketSchema
    .findByIdAndUpdate(id, { $set: body }, { new: true })
    .populate(TicketPopulateFields);

  return res.status(HttpStatus.OK).json({ success: true, data: updatedTicket });
});

const getAllTickets = catchAsync(async (req, res, next) => {
  const mongoQuery = { search: {}, sortBy: {} },
    limit = Math.max(Math.min(req.query.limit || 10, 100), 0),
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

  mongoQuery["sortBy"] =
    sortByOptions[req.query.sortBy] || sortByOptions["createdAtDesc"];

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

const assignTicketsToAgents = catchAsync(async (req, res, next) => {
  const [unassignedTickets, agents] = await Promise.all([
    models.ticketSchema
      .find({
        $or: [{ assignedTo: { $exists: false } }, { assignedTo: null }],
      })
      .sort({ createdAt: 1 }),
    models.agentSchema.find({ active: true }).sort({ createdAt: 1 }),
  ]);

  if (!agents.length || !unassignedTickets.length) {
    console.error(
      `No active agents or unassigned tickets found. \n
       ActiveAgents: ${agents.length}, unassignedTickets: ${unassignedTickets.length}`
    );
  }

  // if (unassignedTickets.length && agents.length) {
  // }
});

export default {
  createTicket,
  getATicket,
  updateTicket,
  getAllTickets,
  assignTicketsToAgents,
};
