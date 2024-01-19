import "./CreateTicket.css";
import React, { useState } from "react";
import { Button, Form, Input, Radio, Space } from "antd";
import ApiRequest from "../../../utils/ApiRequest";
import CONSTANTS from "../../../Constants";
import UTILITY from "../../../utils/utility";

export const CreateTicket = ({ setModal, setRefreshData, openNotification }) => {
  // Uses Ant Design input fields
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    topic: "",
    description: "",
    severity: "low",
    type: "bug",
  };
  /**
   * Gets the field values, filters out values, and raised a new ticket, if successfull, refreshes the list and closes the modal
   * @param {Object} values
   */
  const handleTicketCreation = async (values) => {
    try {
      setIsLoading(true);
      const filteredObject = UTILITY.filterAndTrim(values);

      const response = await ApiRequest(
        CONSTANTS.AxiosMethods.POST,
        CONSTANTS.SupportTicketsEndpoint,
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
    <div className="create-ticket">
      <p>Create Ticket</p>
      <Form
        form={form}
        name="create-ticket"
        labelCol={{
          span: 5,
        }}
        initialValues={initialValues}
        onFinish={handleTicketCreation}
        onFinishFailed={(e) => console.log("error in ticket--", e)}
        autoComplete="off"
      >
        <Form.Item
          label="Topic"
          name="topic"
          rules={[
            {
              required: true,
              type: CONSTANTS.TicketsCreateValidation.topic.type,
              min: CONSTANTS.TicketsCreateValidation.topic.min,
              max: CONSTANTS.TicketsCreateValidation.topic.max,
              whitespace: true,
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
              max: CONSTANTS.TicketsCreateValidation.description.max,
              type: CONSTANTS.TicketsCreateValidation.description.type,
              whitespace: true,
            },
          ]}
        >
          <Input.TextArea showCount maxLength={200} />
        </Form.Item>

        <Form.Item name="severity" label="Severity">
          <Radio.Group>
            {CONSTANTS.TicketsCreateValidation.severity.options.map((option) => (
              <Radio.Button value={option.key}>{option.label}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Radio.Group>
            {CONSTANTS.TicketsCreateValidation.type.options.map((option) => (
              <Radio.Button value={option.key}>{option.label}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Space>
            <Button disabled={isLoading} onClick={handleModalExit}>
              Cancel
            </Button>
            <Button type="primary" disabled={isLoading} htmlType="submit" loading={isLoading}>
              Create Ticket
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
