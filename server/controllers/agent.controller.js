import models from "../models/index.models.js";
import HttpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

const createAgent = catchAsync(async (req, res, next) => {
  const body = req.body;

  const agent = await models.agentSchema.create(body);

  if (!agent) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Agent creation failed");
  }

  return res.status(HttpStatus.CREATED).json({ success: true, data: agent });
});

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

const updateAgent = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid id");
  }

  const updatedAgent = await models.agentSchema.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );

  if (!updatedAgent) throw new ApiError(HttpStatus.NOT_FOUND, "No agent found");

  return res.status(HttpStatus.OK).json({ success: true, data: updatedAgent });
});

const getAllAgents = catchAsync(async (req, res, next) => {
  const mongoQuery = { search: {}, sortBy: {} },
    limit = Math.max(Math.min(req.query.limit || 10, 100), 0),
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

  const searchValue = req.query.search?.trim() || null;
  const searchBy = allowedSearchByFields.includes(req.query.searchBy?.trim())
    ? req.query.searchBy?.trim()
    : null;
  const isPhoneNumber = Math.abs(parseInt(searchValue)) || null;
  const regex = { $regex: searchValue, $options: "i" };

  if (
    (searchBy && !searchValue) ||
    (isPhoneNumber && searchBy !== "phone") ||
    (!isPhoneNumber && searchBy === "phone")
  ) {
    throw new ApiError(HttpStatus.BAD_REQUEST, `Invalid search combination`);
  }

  if (isPhoneNumber) {
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

export default {
  createAgent,
  getAnAgent,
  updateAgent,
  getAllAgents,
};
