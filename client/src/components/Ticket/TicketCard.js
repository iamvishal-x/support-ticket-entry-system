import "./TicketCard.css";
import React from "react";
import { Avatar, Button, Input, Select } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

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
          <Input
            className="ticket-card-top-topic"
            variant="filled"
            value={topic}
          />
          <Select
            defaultValue="lucy"
            style={{
              width: 120,
            }}
            className="ticket-card-top-type"
            // onChange={handleChange}
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "Yiminghe",
                label: "yiminghe",
              },
              {
                value: "disabled",
                label: "Disabled",
                disabled: true,
              },
            ]}
          />
        </div>
        <div className="ticket-card-top-col-2">
          <Avatar
            style={{
              backgroundColor: "red",
              verticalAlign: "middle",
            }}
            size="medium"
          >
            {assignedTo?.name || "Unassigned"}
          </Avatar>
        </div>
      </div>
      <div className="ticket-card-mid">
        <TextArea
          className="ticket-card-mid-text-area"
          value={description}
          variant="filled"
          rows={4}
        />
      </div>
      <div className="ticket-card-bottom">
        <div className="ticket-card-bottom-row-1">
          <div className="ticket-card-bottom-row-1-col-1">
            <Select
              defaultValue="lucy"
              style={{
                width: 120,
              }}
              className="ticket-card-bottom-severity"
              // onChange={handleChange}
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "Yiminghe",
                  label: "yiminghe",
                },
                {
                  value: "disabled",
                  label: "Disabled",
                  disabled: true,
                },
              ]}
            />
          </div>
          <div className="ticket-card-bottom-row-1-col-2">
            <p className="ticket-card-bottom-dates-created">
              Created at: {new Date(createdAt).toDateString()}
            </p>
            <p className="ticket-card-bottom-dates-updated">
              Updated at: {new Date(updatedAt).toDateString()}
            </p>
            {status === "resolved" && resolvedOn && (
              <p className="ticket-card-bottom-dates-resolvedOn">
                Resolved on: {resolvedOn}
              </p>
            )}
          </div>
        </div>

        <div className="ticket-card-bottom-row-2">
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
          <Button type="primary" icon={<CheckOutlined />}>
            Resolve
          </Button>
        </div>
      </div>
    </div>
  );
};
