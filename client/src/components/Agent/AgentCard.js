import "./AgentCard.css";

import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPerson } from "@fortawesome/free-solid-svg-icons";

export const AgentCard = ({
  name,
  email,
  phone,
  description,
  active,
  createdAt,
  updatedAt,
  id,
}) => {
  return (
    <div className="agent-card">
      <div className="agent-card-top">
        <div className="agent-card-top-profile">
          {/* <FontAwesomeIcon icon={faPerson} /> */}
        </div>
        <div className="agent-card-top-info">
          <p>{name}</p>
          <p className="lowercase">{email}</p>
          <p>{phone}</p>
        </div>
      </div>

      <div className="agent-card-mid">
        {description || "No description available."}
        <p className="agent-card-mid-date">
          Created At: {new Date(createdAt).toString()}
        </p>
      </div>
      <div className="agent-card-bottom">
        <div className="agent-card-bottom-button-wrapper">
          <button className="agent-card-bottom-button">View Tickets</button>
          <button className="agent-card-bottom-button">
            Set {active ? "Inctive" : "Active"}
          </button>
        </div>
      </div>
    </div>
  );
};
