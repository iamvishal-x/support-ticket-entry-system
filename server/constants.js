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

module.exports = {
  TicketStatus,
  TicketSeverity,
  TicketType,
  TicketFilterByKeysArr,
  TicketPopulateFields,
  splitAndFilterString,
};
