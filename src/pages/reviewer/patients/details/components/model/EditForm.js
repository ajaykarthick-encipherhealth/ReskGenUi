import { Button, Col, Form, Input, Row, Select } from "antd";
import React from "react";

const EditForm = () => {
  const [form] = Form.useForm();
  const handleForm = (values) => {
    console.log(values);
  };
  return (
    <Form form={form} onFinish={handleForm}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Diagnosis Code"
            name="diagnosisCode"
            rules={[
              {
                required: true,
                message: "Please enter code!",
              },
            ]}
          >
            <div>
              <Input placeholder="Enter diagnosis code" />
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Header"
            name="header"
            rules={[
              {
                required: true,
                message: "Please enter header!",
              },
            ]}
          >
            <div>
              <Input placeholder="Enter header" />
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Search String"
            name="searchString"
            rules={[
              {
                required: true,
                message: "Please enter search string!",
              },
            ]}
          >
            <div>
              <Input placeholder="Enter diagnosis serach string" />
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Page Number"
            name="pagenumber"
            rules={[
              {
                required: true,
                message: "Please enter pagenumber!",
              },
            ]}
          >
            <div>
              <Input placeholder="Enter page number" />
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default EditForm;
