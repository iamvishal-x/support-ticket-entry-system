import "./TicketCard.css";
import React, { useState } from "react";
import { Avatar, Button, Form, Input, Select, Tooltip } from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import CONSTANTS from "../../Constants";
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
  const colorList = {
    new: "#fc7303",
    assigned: "#030ffc",
    resolved: "#1bc508",
  };

  // Initial values for all the fields received from api
  const initialValues = {
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
  };
  const [formEditing, setFormEditing] = useState(false); // Tells if form is in editing state or not

  // Handles call to action buttons functionality
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
      case "Delete":
        await handleDelete();
        break;
      default:
        break;
    }
  };

  /**
   * Gets the field values and updates the ticket, if successful, refreshes the list and disable the editing state
   * @param {Object} values
   */
  const handleUpdate = async (values) => {
    try {
      const response = await ApiRequest(
        CONSTANTS.AxiosMethods.PATCH,
        CONSTANTS.SupportTicketsEndpoint + "/" + id,
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

  /**
   * Delete an Agent
   */
  const handleDelete = async () => {
    try {
      const response = await ApiRequest(
        CONSTANTS.AxiosMethods.DELETE,
        CONSTANTS.SupportTicketsEndpoint + "/" + id
      );
      if (response && response.success) {
        setRefreshData(true);
        setFormEditing(false);
        openNotification("Deleted successfully", "success");
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
      <div className={`ticket-card ticket-card-${status}`}>
        <div className="ticket-card-top">
          <div className="ticket-card-top-col-1">
            <Form.Item
              className="ticket-card-top-col-1-item-1"
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
                { type: "string" },
                {
                  whitespace: true,
                  message: "Whitespace not allowed",
                },
              ]}
            >
              <Input className="ticket-card-top-topic" variant="filled" />
            </Form.Item>

            <Form.Item name="type" className="ticket-card-top-col-1-item-2">
              <Select
                className="ticket-card-top-type"
                options={CONSTANTS.TicketsAvailableType.map((type) => {
                  return { label: type.label, value: type.key };
                })}
              />
            </Form.Item>
          </div>
          <div className="ticket-card-top-col-2">
            <Tooltip
              autoAdjustOverflow={true}
              title={assignedTo?.name || "Unassigned"}
              key={`ticket-card-${id}`}
            >
              <Avatar
                style={{
                  backgroundColor: colorList[status],
                  verticalAlign: "middle",
                }}
                size="medium"
              >
                {assignedTo?.name || "Unassigned"}
              </Avatar>
            </Tooltip>
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
              placeholder={
                description ? description : "No description available"
              }
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
                  options={CONSTANTS.TicketsAvailableSeverity.map((type) => {
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

          <div className="ticket-card-bottom-row-2">
            <div className="ticket-card-bottom-row-2-col-1">
              {!formEditing && (
                <Button
                  danger
                  disabled={false}
                  onClick={() => handleActionButton("Delete")}
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              )}

              {status !== "resolved" && !resolvedOn && (
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
              )}
            </div>

            {status !== "resolved" && !resolvedOn && (
              <div className="ticket-card-bottom-row-2-col-2">
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
      </div>
    </Form>
  );
};
