import React from "react";
import "./AgentHomepage.css";
import { AgentCard } from "../../Agent/AgentCard";
import { Empty } from "antd";

export const AgentHomepage = ({ agents, openNotification, setRefreshData }) => {
  return (
    <div className="homepage-agent-container">
      {!agents || agents.length <= 0 ? (
        <Empty description="No agent found" />
      ) : (
        <div className="homepage-agent-container-grid">
          {agents.map((agent) => (
            <AgentCard
              {...agent}
              key={agent._id}
              id={agent._id}
              openNotification={openNotification}
              setRefreshData={setRefreshData}
            />
          ))}
        </div>
      )}
    </div>
  );
};
