import express from "express";
import { validate } from "express-validation";
import ticketValidator from "../middlewares/ticketValidators.js";
import ticketController from "../controllers/ticket.controller.js";

const router = express.Router();

router
  .route("/")
  .post(
    validate(ticketValidator.createTicketSchemaValidator),
    ticketController.createTicket
  )
  .get(
    validate(ticketValidator.getAllTicketsQuery),
    ticketController.getAllTickets
  );

router.route("/assignTickets").get(ticketController.assignTicketsToAgents);

router
  .route("/:id")
  .get(validate(ticketValidator.getATicket), ticketController.getATicket)
  .patch(
    validate(ticketValidator.updateTicketSchemaValidator),
    ticketController.updateTicket
  );

export default router;
