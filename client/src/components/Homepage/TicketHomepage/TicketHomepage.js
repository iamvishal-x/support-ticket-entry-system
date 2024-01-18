import { TicketCard } from "../../Ticket/TicketCard";
import "./TicketHomepage.css";
import React from "react";
import { TicketsViewOptions } from "../../../Constants";

export const TicketHomepage = ({ ticketsViewType, tickets }) => {
  console.log("tickets--", tickets);
  const ticketStatus = ["new", "assigned", "resolved"];
  return (
    <>
      {/* Kanban View */}
      {ticketsViewType === TicketsViewOptions.kanban && (
        <div className="homepage-kanban-container">
          {ticketStatus.map((status, i) => (
            <div className="homepage-kanban">
              <p className="homepage-kanban-heading">{status}</p>
              <div className="homepage-kanban-ticket-card-wrapper">
                {tickets?.length > 0 &&
                  tickets?.map(
                    (ticket, index) =>
                      ticket.status === status && (
                        <TicketCard
                          key={ticket._id}
                          topic={ticket.topic}
                          description={ticket.description}
                          severity={ticket.severity}
                          type={ticket.type}
                          assignedTo={ticket.assignedTo}
                          status={ticket.status}
                          resolvedOn={ticket.resolvedOn}
                          createdAt={ticket.createdAt}
                          updatedAt={ticket.updatedAt}
                          id={ticket._id}
                        />
                      )
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {ticketsViewType === TicketsViewOptions.list && (
        <div className="homepage-list-container">
          {tickets?.length > 0 &&
            tickets?.map((ticket, index) => (
              <TicketCard
                key={ticket._id}
                topic={ticket.topic}
                description={ticket.description}
                severity={ticket.severity}
                type={ticket.type}
                assignedTo={ticket.assignedTo}
                status={ticket.status}
                resolvedOn={ticket.resolvedOn}
                createdAt={ticket.createdAt}
                updatedAt={ticket.updatedAt}
                id={ticket._id}
              />
            ))}
        </div>
      )}
    </>
  );
};