import Joi from "joi";
import {
  TicketSeverity,
  TicketStatus,
  TicketType,
  TicketFilterByKeysArr,
} from "../constants.js";

const createTicketSchemaValidator = {
  body: Joi.object({
    topic: Joi.string().required().min(3).max(100),
    description: Joi.string().allow("").default("").max(200).optional(),
    severity: Joi.string()
      .valid(...Object.values(TicketSeverity))
      .default(TicketSeverity.low)
      .optional(),
    type: Joi.string()
      .valid(...Object.values(TicketType))
      .default(TicketType.bug)
      .optional(),
    status: Joi.string()
      .valid(TicketStatus.new)
      .default(TicketStatus.new)
      .optional(),
  })
    .required()
    .not({})
    .messages({ "any.invalid": "Invalid Ticket Body" }),
};

const updateTicketSchemaValidator = {
  params: Joi.object({
    id: Joi.string()
      .not("", null, 0)
      .required()
      .messages({ "any.invalid": "Invalid Id Passed" }),
  }),
  body: Joi.object({
    topic: Joi.string().optional().not("", null, 0).min(3).max(100),
    description: Joi.string().default("").not(null, 0).optional().max(200),
    severity: Joi.string()
      .valid(...Object.values(TicketSeverity))
      .default(TicketSeverity.low)
      .optional(),
    type: Joi.string()
      .valid(...Object.values(TicketType))
      .default(TicketType.bug)
      .optional(),
    status: Joi.string()
      .optional()
      .valid(TicketStatus.resolved)
      .default(TicketStatus.resolved),
  })
    .required()
    .not({})
    .messages({ "any.invalid": "Invalid Ticket Body" }),
};

const getATicket = {
  params: Joi.object({
    id: Joi.string().required(),
  }).messages({ "any.invalid": "Invalid id passed" }),
};

const getAllTicketsQuery = {
  query: Joi.object({
    search: Joi.string().optional().allow(""),
    limit: Joi.string().optional(),
    page: Joi.string().optional(),
    sortBy: Joi.string().optional(),
    ...TicketFilterByKeysArr.reduce((acc, key) => {
      acc[key] = Joi.string().optional();
      return acc;
    }, {}),
  }),
};

export default {
  createTicketSchemaValidator,
  updateTicketSchemaValidator,
  getATicket,
  getAllTicketsQuery,
};
