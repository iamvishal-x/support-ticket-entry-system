const SupportTicketsEndpoint = "/support-tickets";
const SupportAgentsEndpoint = "/support-agents";

const AxiosMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

const SidebarNavigationOptions = {
  tickets: "tickets",
  agents: "agents",
};
const TicketsViewOptions = { list: "list", kanban: "kanban" };

const TicketsAvailableSearchBy = [{ label: "Search All", value: "" }];
const AgentsAvailableSearchBy = [
  { label: "Search All", value: "" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Description", value: "description" },
  { label: "Phone", value: "phone" },
];

const TicketsAvailableStatus = [
  { label: "New", key: "new" },
  { label: "Assigned", key: "assigned" },
  { label: "Resolved", key: "resolved" },
];
const TicketsAvailableSeverity = [
  { label: "Low", key: "low" },
  { label: "Medium", key: "medium" },
  { label: "High", key: "high" },
];
const TicketsAvailableType = [
  { label: "Bug", key: "bug" },
  { label: "Feature", key: "feature" },
  { label: "Enhancement", key: "enhancement" },
];

const TicketsAvailableDropDownFilters = [
  {
    label: "Status",
    value: "status",
    options: TicketsAvailableStatus,
  },
  {
    label: "Severity",
    value: "severity",
    options: TicketsAvailableSeverity,
  },
  {
    label: "Type",
    value: "type",
    options: TicketsAvailableType,
  },
];

const TicketsAvailableSortByOptions = [
  { label: "Created At Desc", value: "createdAtDesc" },
  { label: "Created At Asc", value: "createdAtAsc" },
  { label: "Updated At Desc", value: "updatedAtDesc" },
  { label: "Updated At Asc", value: "updatedAtAsc" },
  { label: "Topic Desc", value: "topicDesc" },
  { label: "Topic Asc", value: "topicAsc" },
  { label: "Resolved On Desc", value: "resolvedOnDesc" },
  { label: "Resolved On Asc", value: "resolvedOnAsc" },
];
const AgentsAvailableSortByOptions = [
  { label: "Created At Desc", value: "createdAtDesc" },
  { label: "Created At Asc", value: "createdAtAsc" },
  { label: "Updated At Desc", value: "updatedAtDesc" },
  { label: "Updated At Asc", value: "updatedAtAsc" },
  { label: "Phone Desc", value: "phoneDesc" },
  { label: "Phone Asc", value: "phoneAsc" },
  { label: "Active Desc", value: "activeDesc" },
  { label: "Active Asc", value: "activeAsc" },
];

const TicketsCreateValidation = {
  topic: { min: 3, max: 100, type: "string", default: "" },
  description: { max: 100, type: "string" },
  severity: {
    default: TicketsAvailableSeverity[0].key,
    options: TicketsAvailableSeverity,
    type: "string",
  },
  type: {
    default: TicketsAvailableType[0].key,
    options: TicketsAvailableType,
    type: "string",
  },
  status: {
    default: TicketsAvailableStatus[0].key,
    options: TicketsAvailableStatus.map((x) => x.key === TicketsAvailableStatus[0].key),
    type: "string",
  },
};

const AgentsCreateValidation = {
  name: { min: 2, max: 24, type: "string", default: "" },
  email: { type: "email", default: "", max: 50 },
  phone: { type: "string", max: 12, min: 8, default: "", pattern: /^[0-9]+$/ },
  description: { max: 200, default: "", type: "string" },
  active: { default: true, type: "boolean" },
};

export default {
  SupportTicketsEndpoint,
  SupportAgentsEndpoint,
  AxiosMethods,
  SidebarNavigationOptions,
  TicketsViewOptions,
  TicketsAvailableSearchBy,
  AgentsAvailableSearchBy,
  TicketsAvailableStatus,
  TicketsAvailableSeverity,
  TicketsAvailableType,
  TicketsAvailableDropDownFilters,
  TicketsAvailableSortByOptions,
  AgentsAvailableSortByOptions,
  TicketsCreateValidation,
  AgentsCreateValidation,
};
