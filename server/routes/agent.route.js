const express = require("express");
const { validate } = require("express-validation");
const agentValidator = require("../middlewares/agentValidators.js");
const agentController = require("../controllers/agent.controller.js");
const router = express.Router();

router
  .route("/")
  .post(
    validate(agentValidator.createAgentSchemaValidator),
    agentController.createAgent
  )
  .get(
    validate(agentValidator.getAllAgentsQuery),
    agentController.getAllAgents
  );

router
  .route("/:id")
  .get(validate(agentValidator.getAnAgent), agentController.getAnAgent)
  .delete(validate(agentValidator.getAnAgent), agentController.deleteAnAgent)
  .patch(
    validate(agentValidator.updateAgentSchemaValidator),
    agentController.updateAgent
  );

module.exports = router;
