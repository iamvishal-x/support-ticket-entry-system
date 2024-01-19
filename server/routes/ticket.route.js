const express = require("express");
const { validate } = require("express-validation");
const ticketValidator = require("../middlewares/ticketValidators.js");
const ticketController = require("../controllers/ticket.controller.js");

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
  .delete(validate(ticketValidator.getATicket), ticketController.deleteATicket)
  .patch(
    validate(ticketValidator.updateTicketSchemaValidator),
    ticketController.updateTicket
  );

module.exports = router;
