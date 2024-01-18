import "./CreateTicket.css";
import React from "react";
import { Button, Form, Input, Radio, Space } from "antd";
import ApiRequest from "../../../utils/ApiRequest";
import { AxiosMethods, SupportTicketsEndpoint } from "../../../Constants";

export const CreateTicket = ({
  setModal,
  setRefreshData,
  openNotification,
}) => {
  const [form] = Form.useForm();

  const handleTicketCreation = async (values) => {
    try {
      const filteredObject = Object.keys(values).reduce((acc, curr) => {
        if (values[curr]) {
          return { ...acc, [curr]: values[curr].trim() };
        }
        return acc;
      }, {});

      const response = await ApiRequest(
        AxiosMethods.POST,
        SupportTicketsEndpoint,
        filteredObject
      );

      if (response && response.success) {
        handleModalExit();
      }
    } catch (error) {
      console.log("creation------", error);
      openNotification(error.message, "error");
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
        initialValues={{
          ["topic"]: "",
          ["description"]: "",
          ["severity"]: "low",
          ["type"]: "bug",
        }}
        onFinish={handleTicketCreation}
        onFinishFailed={(e) => console.log("e---", e)}
        autoComplete="off"
      >
        <Form.Item
          label="Topic"
          name="topic"
          rules={[
            {
              required: true,
              message: "Please input your topic!",
            },
            {
              min: 3,
              message: "Topic should be of minimum 3 characters",
            },
            {
              max: 100,
              message: "Topic cannot exceed 100 characters",
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
              max: 200,
              message: "Description cannot exceed 200 characters",
            },
          ]}
        >
          <Input.TextArea showCount maxLength={200} />
        </Form.Item>

        <Form.Item name="severity" label="Severity">
          <Radio.Group>
            <Radio.Button value="low">Low</Radio.Button>
            <Radio.Button value="medium">Medium</Radio.Button>
            <Radio.Button value="high">High</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Radio.Group>
            <Radio.Button value="bug">Bug</Radio.Button>
            <Radio.Button value="feature">Feature</Radio.Button>
            <Radio.Button value="enhancement">Enhancement</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Space>
            <Button onClick={handleModalExit}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Create Ticket
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};