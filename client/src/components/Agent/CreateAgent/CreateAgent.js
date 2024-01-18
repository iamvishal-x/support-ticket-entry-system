import React from "react";
import "./CreateAgent.css";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
} from "antd";

export const CreateAgent = () => {
  return (
    <div className="create-agent">
      <p>Create Agent</p>
      <Form
        name="create-agent"
        labelCol={{
          span: 5,
        }}
        initialValues={{
          remember: true,
        }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
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
              max: 30,
              message: "Name cannot exceed 30 characters",
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
              message: "Email cannot exceed 30 characters",
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
          <Radio.Group defaultValue="true">
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
            <Button htmlType="cancel">Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
