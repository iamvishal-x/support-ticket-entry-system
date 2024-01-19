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
  const customValidateMessages = {
    whitespace: "Blank character not allowed",
    string: {
      range: "Only ${min}-${max} characters allowed",
    },
    types: { email: "Invalid email" },
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
      className="agent-card-form"
      name="update-agent"
      layout="inline"
      validateMessages={customValidateMessages}
      initialValues={initialValues}
      onFinish={handleUpdate}
    >
      <div className={`agent-card agent-card-${active ? "active" : "inactive"}`}>
        <div className="agent-card-top">
          <div className="agent-card-top-col-1">
            <Avatar
              style={{
                backgroundColor: colorList[Math.floor(Math.random() * 4) + 1],
                verticalAlign: "middle",
              }}
              size={{ xs: 40, sm: 40, md: 40, lg: 40, xl: 40, xxl: 40 }}
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
                    type: CONSTANTS.AgentsCreateValidation.name.type,
                    required: true,
                    min: CONSTANTS.AgentsCreateValidation.name.min,
                    max: CONSTANTS.AgentsCreateValidation.name.max,
                    whitespace: true,
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
                    type: CONSTANTS.AgentsCreateValidation.email.type,
                    required: true,
                    whitespace: true,
                  },
                  {
                    max: CONSTANTS.AgentsCreateValidation.email.max,
                    message: "Max 50 characters allowed",
                  },
                ]}
              >
                <Input disabled={!formEditing} variant="filled" value={email} />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[
                  {
                    type: CONSTANTS.AgentsCreateValidation.phone.type,
                    required: true,
                    min: CONSTANTS.AgentsCreateValidation.phone.min,
                    max: CONSTANTS.AgentsCreateValidation.phone.max,
                    whitespace: true,
                  },
                  {
                    pattern: CONSTANTS.AgentsCreateValidation.phone.pattern,
                    message: "Invalid phone number",
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
                type: CONSTANTS.AgentsCreateValidation.description.type,
                max: CONSTANTS.AgentsCreateValidation.description.max,
                whitespace: true,
              },
            ]}
          >
            <Input.TextArea
              disabled={!formEditing}
              className="agent-card-mid-text-area"
              variant="filled"
              placeholder="No description available."
              autoSize={{
                minRows: 2,
                maxRows: 3,
              }}
            />
          </Form.Item>
        </div>

        <div className="agent-card-bottom">
          <div className="agent-card-bottom-row-1">
            <p>Created On: {new Date(createdAt).toDateString()}</p>
          </div>
          <div className="agent-card-bottom-row-2">
            <Button
              danger
              disabled={false}
              onClick={() => handleActionButton(formEditing ? "Cancel" : "Delete")}
              icon={!formEditing && <DeleteOutlined />}
            >
              {formEditing ? "Cancel" : "Delete"}
            </Button>
            <Button
              disabled={false}
              onClick={() => handleActionButton(formEditing ? "Update" : "Edit")}
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
