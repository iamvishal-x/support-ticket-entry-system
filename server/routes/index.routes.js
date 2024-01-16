import express from "express";
import agentRoutes from "./agent.route.js";
const router = express.Router();

// Health check route to verify server status
router.get("/health-check", (req, res, next) => res.status(200).send("OK"));
router.use("/support-agents", agentRoutes);

export default router;
