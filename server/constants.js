require("dotenv/config.js");

const TicketStatus = {
  new: "new",
  assigned: "assigned",
  resolved: "resolved",
};

const TicketSeverity = {
  low: "low",
  medium: "medium",
  high: "high",
};

const TicketType = {
  bug: "bug",
  enhancement: "enhancement",
  feature: "feature",
};

const TicketFilterByKeysArr = ["status", "assignedTo", "severity", "type"];

const TicketPopulateFields = ["assignedTo"];

/**
 * Function to split, filter then transform a comma-seperated string into array with each value being lowercase
 * @param {string} string comma-separated string
 * @returns array
 * */
const splitAndFilterString = (str) => {
  const arr = str
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter((x) => x !== "null" && x !== "undefined");

  return arr || [];
};

const ALLOW_TICKET_RAISE_IF_NO_AGENT = process.env.ALLOW_TICKET_RAISE_IF_NO_AGENT === "true";
const ALLOW_TICKET_RESOLVE_IF_UNASSIGNED =
  process.env.ALLOW_TICKET_RESOLVE_IF_UNASSIGNED === "true";
const ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS =
  process.env.ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS === "true";
const ALLOW_TICKET_DELETE_IF_ASSIGNED = process.env.ALLOW_TICKET_DELETE_IF_ASSIGNED === "true";

module.exports = {
  TicketStatus,
  TicketSeverity,
  TicketType,
  TicketFilterByKeysArr,
  TicketPopulateFields,
  splitAndFilterString,
  ALLOW_TICKET_RAISE_IF_NO_AGENT,
  ALLOW_TICKET_RESOLVE_IF_UNASSIGNED,
  ALLOW_AGENT_DEACTIVATE_OR_DELETE_IF_HAS_TICKETS,
  ALLOW_TICKET_DELETE_IF_ASSIGNED,
};
