export const TicketStatus = {
  new: "new",
  assigned: "assigned",
  resolved: "resolved",
};

export const TicketSeverity = {
  low: "low",
  medium: "medium",
  high: "high",
};

export const TicketType = {
  bug: "bug",
  enhancement: "enhancement",
  feature: "feature",
};

export const TicketFilterByKeysArr = [
  "status",
  "assignedTo",
  "severity",
  "type",
];

export const splitAndFilterString = (str) => {
  const arr = str
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter((x) => x !== "null" && x !== "undefined");

  return arr || [];
};
