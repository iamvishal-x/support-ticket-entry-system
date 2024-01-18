import "./CreateTicket.css";
import React from "react";
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

export const CreateTicket = () => {
  return (
    <div className="create-ticket">
      <p>Create Ticket</p>
      <Form
        name="create-ticket"
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
          label="Topic"
          name="topic"
          rules={[
            {
              required: true,
              message: "Please input your topic!",
            },
            {
              max: 50,
              message: "Topic cannot exceed 50 characters",
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
          <Radio.Group defaultValue="low">
            <Radio.Button value="low">Low</Radio.Button>
            <Radio.Button value="medium">Medium</Radio.Button>
            <Radio.Button value="high">High</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="type" label="Type">
          <Radio.Group defaultValue="bug">
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
