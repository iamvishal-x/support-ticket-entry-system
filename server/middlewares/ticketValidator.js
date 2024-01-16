import Joi from "joi";

const addTicketSchemaValidator = {
  body: Joi.object({
    topic: Joi.string().required().trim(),
    description: Joi.string().trim().default("").optional(),
    severity: Joi.string()
      .valid("Low", "Medium", "High")
      .required()
      .default("Low")
      .optional(),
    type: Joi.string()
      .valid("Bug", "Enhancement", "Feature")
      .required()
      .default("Bug"),
    status: Joi.string()
      .valid("New", "Assigned", "Resolved")
      .required()
      .default("New")
      .optional(),
    resolvedOn: Joi.date().not("", null).optional(),
  })
    .required()
    .not({})
    .messages({ "any.invalid": "Invalid Ticket Body" }),
};

const updateTicketSchemaValidator = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    topic: Joi.string().trim().optional().not("", null, 0),
    description: Joi.string().trim().default("").not("", null, 0).optional(),
    severity: Joi.string()
      .not("", null, 0)
      .valid("Low", "Medium", "High")
      .default("Low")
      .optional(),
    type: Joi.string()
      .valid("Bug", "Enhancement", "Feature")
      .default("Bug")
      .not("", null, 0),
    status: Joi.string()
      .valid("New", "Assigned", "Resolved")
      .default("New")
      .optional()
      .not("", null, 0),
    resolvedOn: Joi.date().not("", null).optional(),
  })
    .required()
    .not({})
    .messages({ "any.invalid": "Invalid Ticket Body" }),
};

export default {
  addTicketSchemaValidator,
  updateTicketSchemaValidator,
};
