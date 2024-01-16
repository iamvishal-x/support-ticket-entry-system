import express from "express";
import { validate } from "express-validation";
import agentValidator from "../middlewares/agentValidators.js";
import agentController from "../controllers/agent.controller.js";
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
  .patch(
    validate(agentValidator.updateAgentSchemaValidator),
    agentController.updateAgent
  );

export default router;
