import React from "react";
import "./CreateAgent.css";
import { Button, Form, Input, InputNumber, Radio, Space } from "antd";
import { AxiosMethods, SupportAgentsEndpoint } from "../../../Constants";
import ApiRequest from "../../../utils/ApiRequest";

export const CreateAgent = ({ setModal, setRefreshData, openNotification }) => {
  const [form] = Form.useForm();

  const handleAgentCreation = async (values) => {
    try {
      const filteredObject = Object.keys(values).reduce((acc, curr) => {
        if (values[curr]) {
          return { ...acc, [curr]: values[curr].trim() };
        }
        return acc;
      }, {});

      const response = await ApiRequest(
        AxiosMethods.POST,
        SupportAgentsEndpoint,
        filteredObject
      );

      if (response && response.success) {
        handleModalExit();
      }
    } catch (error) {
      console.log("creation agent------", error);
      openNotification(error.message, "error");
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
        initialValues={{
          ["active"]: "true",
          ["description"]: "",
          ["name"]: "",
          ["phone"]: "",
          ["email"]: "",
        }}
        onFinish={handleAgentCreation}
        onFinishFailed={(e) => console.log("e---", e)}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
            {
              min: 2,
              message: "Name should be of minimum 3 characters",
            },
            {
              max: 24,
              message: "Name cannot exceed 24 characters",
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
              required: true,
              message: "Please input your email!",
            },
            {
              max: 50,
              message: "Email cannot exceed 50 characters",
            },
            {
              type: "email",
              message: "Email is not a valid email!",
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
              required: true,
              message: "Please input your phone!",
            },
            {
              min: 8,
              message: "Phone should be of minimum 8 digits",
            },
            {
              max: 12,

              message: "Phone should be of max 12 digits",
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
            <Button onClick={handleModalExit}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Create Agent
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
