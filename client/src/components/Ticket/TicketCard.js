import "./TicketCard.css";
import React, { useState } from "react";
import { Avatar, Button, Form, Input, Select } from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {
  AxiosMethods,
  SupportTicketsEndpoint,
  TicketsAvailableDropDownFilters,
  TicketsAvailableSeverity,
  TicketsAvailableStatus,
  TicketsAvailableType,
} from "../../Constants";
import ApiRequest from "../../utils/ApiRequest";

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
  openNotification,
  setRefreshData,
}) => {
  const [form] = Form.useForm();
  const colorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
  const [formEditing, setFormEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({
    topic: topic,
    description: description,
    severity: severity,
    type: type,
    assignedTo: assignedTo,
    status: status,
    resolvedOn: resolvedOn,
    createdAt: createdAt,
    updatedAt: updatedAt,
    id: id,
  });

  const handleActionButton = async (action) => {
    switch (action) {
      case "Cancel":
        form.resetFields();
        setFormEditing(false);
        break;
      case "Resolve":
        await handleUpdate({ status: "resolved" });
        break;
      case "Edit":
        setFormEditing(true);
        break;
      case "Update":
        form.submit();
        break;
      default:
        break;
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await ApiRequest(
        AxiosMethods.PATCH,
        SupportTicketsEndpoint + "/" + id,
        values
      );

      if (response && response.success) {
        setRefreshData(true);
        setFormEditing(false);
        openNotification("Updated successfully", "success");
      }
    } catch (error) {
      openNotification(error.message, "error");
    }
  };

  return (
    <Form
      form={form}
      name="update-ticket"
      layout="inline"
      initialValues={initialValues}
      disabled={!formEditing}
      onFinish={handleUpdate}
    >
      <div className="ticket-card">
        <div className="ticket-card-top">
          <div className="ticket-card-top-col-1">
            <Form.Item
              name="topic"
              rules={[
                {
                  required: true,
                  message: "Please input your topic!",
                },
                {
                  min: 3,
                  message: "Minimum 3 characters",
                },
                {
                  max: 100,
                  message: "Max 100 characters",
                },
              ]}
            >
              <Input className="ticket-card-top-topic" variant="filled" />
            </Form.Item>
            <Form.Item name="type">
              <Select
                style={{
                  width: 130,
                }}
                className="ticket-card-top-type"
                options={TicketsAvailableType.map((type) => {
                  return { label: type.label, value: type.key };
                })}
              />
            </Form.Item>
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
          <Form.Item
            name="description"
            rules={[
              {
                max: 200,
                message: "Description cannot exceed 200 characters",
              },
            ]}
          >
            <TextArea
              className="ticket-card-mid-text-area"
              variant="filled"
              autoSize={{
                minRows: 3,
                maxRows: 5,
              }}
            />
          </Form.Item>
        </div>
        <div className="ticket-card-bottom">
          <div className="ticket-card-bottom-row-1">
            <div className="ticket-card-bottom-row-1-col-1">
              <Form.Item name="severity">
                <Select
                  style={{
                    width: 130,
                  }}
                  className="ticket-card-bottom-severity"
                  options={TicketsAvailableSeverity.map((type) => {
                    return { label: type.label, value: type.key };
                  })}
                />
              </Form.Item>
            </div>
            <div className="ticket-card-bottom-row-1-col-2">
              <p className="ticket-card-bottom-dates-created">
                Created at: {new Date(createdAt).toDateString()}
              </p>
              {status === "resolved" && resolvedOn ? (
                <p className="ticket-card-bottom-dates-resolvedOn">
                  Resolved on: {new Date(resolvedOn).toDateString()}
                </p>
              ) : (
                <p className="ticket-card-bottom-dates-updated">
                  Updated at: {new Date(updatedAt).toDateString()}
                </p>
              )}
            </div>
          </div>

          {status !== "resolved" && !resolvedOn && (
            <div className="ticket-card-bottom-row-2">
              <Button
                danger={formEditing ? true : false}
                type={formEditing ? "primary" : "primary"}
                disabled={false}
                onClick={() =>
                  handleActionButton(formEditing ? "Cancel" : "Resolve")
                }
                icon={!formEditing && <CheckOutlined />}
              >
                {formEditing ? "Cancel" : "Resolve"}
              </Button>
              <Button
                disabled={false}
                onClick={() =>
                  handleActionButton(formEditing ? "Update" : "Edit")
                }
                icon={!formEditing && <EditOutlined />}
              >
                {formEditing ? "Update" : "Edit"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};
