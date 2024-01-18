export const SupportTicketsEndpoint = "/support-tickets?";
export const SupportAgentsEndpoint = "/support-agents?";
export const AxiosMethods = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
};
export const SidebarNavigationOptions = {
  tickets: "tickets",
  agents: "agents",
};
export const TicketsViewOptions = { list: "list", kanban: "kanban" };

export const TicketsAvailableSearchBy = [{ label: "Search All", value: "" }];
export const AgentsAvailableSearchBy = [
  { label: "Search All", value: "" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Description", value: "description" },
  { label: "Phone", value: "phone" },
];

export const TicketsAvailableDropDownFilters = [
  {
    label: "Status",
    value: "status",
    options: [
      { label: "New", key: "new" },
      { label: "Assigned", key: "assigned" },
      { label: "Resolved", key: "resolved" },
    ],
  },
  {
    label: "Severity",
    value: "severity",
    options: [
      { label: "Low", key: "low" },
      { label: "Medium", key: "medium" },
      { label: "High", key: "high" },
    ],
  },
  {
    label: "Type",
    value: "type",
    options: [
      { label: "Bug", key: "bug" },
      { label: "Feature", key: "feature" },
      { label: "Enhancement", key: "enhancement" },
    ],
  },
];

export const TicketsAvailableSortByOptions = [
  { label: "Created At Desc", value: "createdAtDesc" },
  { label: "Created At Asc", value: "createdAtAsc" },
  { label: "Updated At Desc", value: "updatedAtDesc" },
  { label: "Updated At Asc", value: "updatedAtAsc" },
  { label: "Topic Desc", value: "topicDesc" },
  { label: "Topic Asc", value: "topicAsc" },
  { label: "Resolved On Desc", value: "resolvedOnDesc" },
  { label: "Resolved On Asc", value: "resolvedOnAsc" },
];

export const AgentsAvailableSortByOptions = [
  { label: "Created At Desc", value: "createdAtDesc" },
  { label: "Created At Asc", value: "createdAtAsc" },
  { label: "Updated At Desc", value: "updatedAtDesc" },
  { label: "Updated At Asc", value: "updatedAtAsc" },
  { label: "Phone Desc", value: "phoneDesc" },
  { label: "Phone Asc", value: "phoneAsc" },
  { label: "Active Desc", value: "activeDesc" },
  { label: "Active Asc", value: "activeAsc" },
];
