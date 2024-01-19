import React, { useState } from "react";
import "./CreateAgent.css";
import { Button, Form, Input, Radio, Space } from "antd";
import CONSTANTS from "../../../Constants";
import ApiRequest from "../../../utils/ApiRequest";
import UTILITY from "../../../utils/utility";

export const CreateAgent = ({ setModal, setRefreshData, openNotification }) => {
  // Uses Ant Design input fields
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    active: "true",
  };

  /**
   * Gets the field values, filters out values, and raised a new ticket, if successfull, refreshes the list and closes the modal
   * @param {Object} values
   */
  const handleAgentCreation = async (values) => {
    try {
      setIsLoading(true);
      const filteredObject = UTILITY.filterAndTrim(values);

      const response = await ApiRequest(
        CONSTANTS.AxiosMethods.POST,
        CONSTANTS.SupportAgentsEndpoint,
        filteredObject
      );

      if (response && response.success) {
        handleModalExit();
      }
    } catch (error) {
      openNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalExit = () => {
    form.resetFields();
    setRefreshData(true);
    setModal(false);
  };

  return (
    <div className="create-agent">
      <p>Create Agent</p>
      <Form
        form={form}
        name="create-agent"
        labelCol={{
          span: 5,
        }}
        initialValues={initialValues}
        onFinish={handleAgentCreation}
        onFinishFailed={(e) => console.log("error in agent--", e)}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: CONSTANTS.AgentsCreateValidation.email.type,
              required: true,
              whitespace: true,
              max: CONSTANTS.AgentsCreateValidation.email.max,
            },
            {
              message: "Max 50 characters allowed",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone"
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
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              type: CONSTANTS.AgentsCreateValidation.description.type,
              max: CONSTANTS.AgentsCreateValidation.description.max,
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea showCount maxLength={200} />
        </Form.Item>
        <Form.Item name="active" label="Agent Active">
          <Radio.Group>
            <Radio.Button value="true">Yes</Radio.Button>
            <Radio.Button value="false">No</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Space>
            <Button onClick={handleModalExit} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
              Create Agent
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
