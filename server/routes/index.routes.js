import express from "express";
import agentRoutes from "./agent.route.js";
import ticketRoutes from "./ticket.route.js";

const router = express.Router();

// Health check route to verify server status
router.get("/health-check", (req, res, next) => res.status(200).send("OK"));

// Agent Routes
router.use("/support-agents", agentRoutes);

// Ticket ROutes
router.use("/support-tickets", ticketRoutes);

export default router;
