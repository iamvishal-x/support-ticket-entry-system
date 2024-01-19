import { Avatar, Button, Form, Input, Switch } from "antd";
import "./AgentCard.css";

import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ApiRequest from "../../utils/ApiRequest";
import CONSTANTS from "../../Constants";

export const AgentCard = ({
  name,
  email,
  phone,
  description,
  active,
  createdAt,
  updatedAt,
  id,
  openNotification,
  setRefreshData,
}) => {
  const [form] = Form.useForm();
  const colorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];

  // Initial values for all the fields received from api
  const initialValues = {
    name,
    active,
    description,
    phone: String(phone),
    email,
  };

  const [formEditing, setFormEditing] = useState(false); // Tells if form is in editing state or not

  // Handles call to action buttons functionality
  const handleActionButton = async (action) => {
    switch (action) {
      case "Cancel":
        form.resetFields();
        setFormEditing(false);
        break;
      case "Delete":
        await handleDelete();
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

  /**
   * Gets the field values and updates the agent details, if successful, refreshes the list and disable the editing state
   * @param {Object} values
   */
  const handleUpdate = async (values) => {
    try {
      const response = await ApiRequest(
        CONSTANTS.AxiosMethods.PATCH,
        CONSTANTS.SupportAgentsEndpoint + "/" + id,
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
        CONSTANTS.SupportAgentsEndpoint + "/" + id
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
      name="update-agent"
      layout="inline"
      initialValues={initialValues}
      onFinish={handleUpdate}
    >
      <div
        className={`agent-card agent-card-${active ? "active" : "inactive"}`}
      >
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
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                  },
                  {
                    min: 2,
                    message: "Minimum 3 characters",
                  },
                  {
                    max: 24,
                    message: "Maximum 24 characters",
                  },
                ]}
              >
                <Input
                  disabled={!formEditing}
                  className="agent-card-top-name"
                  variant="filled"
                  value={name}
                />
              </Form.Item>
              <Form.Item name="active">
                <Switch
                  disabled={!formEditing}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
              </Form.Item>
            </div>
            <div className="agent-card-top-col-2-row-2">
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                  {
                    max: 50,
                    message: "Maximum exceed 50 characters",
                  },
                  {
                    type: "email",
                    message: "Email is not a valid email!",
                  },
                ]}
              >
                <Input disabled={!formEditing} variant="filled" value={email} />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[
                  {
                    min: 8,
                    message: "Minimum 8 digits",
                  },
                  {
                    max: 12,
                    message: "Max 12 digits",
                  },
                  {
                    required: true,
                    message: "Enter phone",
                  },
                ]}
              >
                <Input disabled={!formEditing} variant="filled" value={phone} />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="agent-card-mid">
          <Form.Item
            name="description"
            rules={[
              {
                max: 200,
                message: "Description cannot exceed 200 characters",
              },
            ]}
          >
            <Input.TextArea
              disabled={!formEditing}
              className="agent-card-mid-text-area"
              variant="filled"
              placeholder="No description available."
              autoSize={{
                minRows: 3,
                maxRows: 5,
              }}
            />
          </Form.Item>
        </div>

        <div className="agent-card-bottom">
          <div className="agent-card-bottom-row-1">
            <p>Agent Id: {id}</p>
            <p>Created At: {new Date(createdAt).toDateString()}</p>
          </div>
          <div className="agent-card-bottom-row-2">
            <Button
              danger
              disabled={false}
              onClick={() =>
                handleActionButton(formEditing ? "Cancel" : "Delete")
              }
              icon={!formEditing && <DeleteOutlined />}
            >
              {formEditing ? "Cancel" : "Delete"}
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
        </div>
      </div>
    </Form>
  );
};
