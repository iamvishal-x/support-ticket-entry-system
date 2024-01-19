import { TicketCard } from "../../Ticket/TicketCard";
import "./TicketHomepage.css";
import React from "react";
import CONSTANTS from "../../../Constants";
import { Empty } from "antd";

export const TicketHomepage = ({
  ticketsViewType,
  tickets,
  openNotification,
  setRefreshData,
}) => {
  const ticketStatus = CONSTANTS.TicketsAvailableStatus.map(
    (status) => status.key
  );

  const renderKanbanBoard = () => {
    return (
      <div className="homepage-kanban-container">
        {ticketStatus.map((status, i) => (
          <div className="homepage-kanban" key={i + 1}>
            <p className="homepage-kanban-heading">{status}</p>
            <div className="homepage-kanban-ticket-card-wrapper">
              {tickets?.length > 0 ? (
                tickets.map(
                  (ticket) =>
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
                        openNotification={openNotification}
                        setRefreshData={setRefreshData}
                      />
                    )
                )
              ) : (
                <Empty description="No tickets found" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="homepage-list-container">
        {tickets?.length > 0 ? (
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
              openNotification={openNotification}
              setRefreshData={setRefreshData}
            />
          ))
        ) : (
          <Empty description="No tickets found" />
        )}
      </div>
    );
  };

  return (
    <>
      {ticketsViewType === CONSTANTS.TicketsViewOptions.kanban
        ? renderKanbanBoard()
        : renderListView()}
    </>
  );
};
