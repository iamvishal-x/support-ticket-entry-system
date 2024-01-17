import "./TicketCard.css";
import React from "react";

export const TicketCard = ({
  topic,
  description,
  severity,
  type,
  assignedTo,
  status,
  resolvedOn,
  createdAt,
  updatedAt,
  id,
}) => {
  return (
    <div className="ticket-card">
      <div className="ticket-card-top">
        <div className="ticket-card-top-col-1">
          <p className="ticket-card-topic">{topic}</p>
          <p className="ticket-card-type">{type}</p>
        </div>
        <p className="ticket-card-top-col-2">{assignedTo || "Unassigned"}</p>
      </div>
      <div className="ticket-card-mid">{description}</div>
      <div className="ticket-card-bottom">
        <p className="ticket-card-bottom-severity">{severity}</p>

        <div className="ticket-card-bottom-dates">
          <p className="ticket-card-bottom-dates-created">
            Created at: {createdAt}
          </p>
          <p className="ticket-card-bottom-dates-updated">
            Updated at: {updatedAt}
          </p>
          {status === "resolved" && resolvedOn && (
            <p className="ticket-card-bottom-dates-resolvedOn">
              Resolved on: {resolvedOn}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
