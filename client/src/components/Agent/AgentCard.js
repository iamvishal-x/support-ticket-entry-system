import { Avatar, Button, Input } from "antd";
import "./AgentCard.css";

import React from "react";
import TextArea from "antd/es/input/TextArea";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";

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
  const colorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
  const firstLetterOfName = name?.split("")[0]?.toUpperCase() || "A";
  return (
    <div className="agent-card">
      <div className="agent-card-top">
        <div className="agent-card-top-col-1">
          <Avatar
            style={{
              backgroundColor: colorList[Math.floor(Math.random() * 4) + 1],
              verticalAlign: "middle",
            }}
            size={{ xs: 50, sm: 50, md: 50, lg: 50, xl: 50, xxl: 50 }}
          >
            {name}
          </Avatar>
        </div>
        <div className="agent-card-top-col-2">
          <div className="agent-card-top-col-2-row-1">
            <Input
              className="agent-card-top-name"
              variant="filled"
              value={name}
            />
          </div>
          <div className="agent-card-top-col-2-row-2">
            <Input variant="filled" value={email} />
            <Input variant="filled" value={phone} />
          </div>
        </div>
      </div>

      <div className="agent-card-mid">
        <TextArea
          className="agent-card-mid-text-area"
          value={description || "No description available."}
          variant="filled"
          rows={3}
        />
      </div>

      <div className="agent-card-bottom">
        <div className="agent-card-bottom-row-1">
          <p>Agent Id: {id}</p>
          <p>Created At: {new Date(createdAt).toDateString()}</p>
        </div>
        <div className="agent-card-bottom-row-2">
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
          <Button type="primary" icon={<CheckOutlined />}>
            Set {active ? "Inctive" : "Active"}
          </Button>
        </div>
      </div>
    </div>
  );
};
