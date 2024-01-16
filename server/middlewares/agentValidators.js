import Joi from "joi";

const createAgentSchemaValidator = {
  body: Joi.object({
    name: Joi.string().required().trim().min(2).max(24),
    email: Joi.string().trim().email().lowercase().required().max(50),
    phone: Joi.string()
      .required()
      .min(8)
      .max(12)
      .pattern(/^[0-9]+$/) // Pattern to check if phone number is bw 0-9
      .message("Phone number should be between 0-9"),
    description: Joi.string()
      .trim()
      .lowercase()
      .allow("")
      .default("")
      .max(1000),
    active: Joi.boolean().default(true),
  })
    .required()
    .not({})
    .messages({ "any.invalid": "Invalid Agent Body" }),
};

const updateAgentSchemaValidator = {
  params: Joi.object({
    id: Joi.string()
      .not("", null)
      .required()
      .messages({ "any.invalid": "Invalid id passed" }),
  }),
  body: Joi.object({
    name: Joi.string().not("", null).trim().optional().min(2).max(24),
    email: Joi.string()
      .not("", null)
      .trim()
      .email()
      .lowercase()
      .optional()
      .max(50),
    phone: Joi.string()
      .not("", 0, null)
      .min(8)
      .max(12)
      .pattern(/^[0-9]+$/) // Pattern to check if phone number is bw 0-9
      .message("Phone number should be between 0-9")
      .optional(),
    description: Joi.string().trim().lowercase().allow("").optional().max(1000),
    active: Joi.boolean().optional(),
  })
    .required()
    .not({})
    .messages({ "any.invalid": "Invalid Agent Body" }),
};

const getAnAgent = {
  params: Joi.object({
    id: Joi.string().required(),
  }).messages({ "any.invalid": "Invalid id passed" }),
};

const getAllAgentsQuery = {
  query: Joi.object({
    search: Joi.string().optional().allow(""),
    limit: Joi.string().optional(),
    page: Joi.string().optional(),
    sortBy: Joi.string().optional(),
    searchBy: Joi.string().optional(),
  }),
};

export default {
  createAgentSchemaValidator,
  updateAgentSchemaValidator,
  getAnAgent,
  getAllAgentsQuery,
};
