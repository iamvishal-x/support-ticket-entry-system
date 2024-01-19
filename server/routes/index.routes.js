const express = require("express");
const agentRoutes = require("./agent.route.js");
const ticketRoutes = require("./ticket.route.js");

const router = express.Router();

// Health check route to verify server status
router.get("/health-check", (req, res, next) => res.status(200).send("OK"));

// Agent Routes
router.use("/support-agents", agentRoutes);

// Ticket ROutes
router.use("/support-tickets", ticketRoutes);

module.exports = router;
