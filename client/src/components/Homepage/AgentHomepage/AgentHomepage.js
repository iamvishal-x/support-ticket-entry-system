import React from "react";
import "./AgentHomepage.css";
import { AgentCard } from "../../Agent/AgentCard";

export const AgentHomepage = ({ agents, openNotification, setRefreshData }) => {
  return (
    <div className="homepage-agent-container">
      <div className="homepage-agent-container-grid">
        {agents &&
          agents.length > 0 &&
          agents.map((agent) => (
            <AgentCard
              key={agent._id}
              name={agent.name}
              email={agent.email}
              phone={agent.phone}
              description={agent.description}
              active={agent.active}
              createdAt={agent.createdAt}
              updatedAt={agent.updatedAt}
              id={agent._id}
              openNotification={openNotification}
              setRefreshData={setRefreshData}
            />
          ))}
      </div>
    </div>
  );
};
