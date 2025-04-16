import { DatePicker, Form, Input, Modal, Select, Space } from "antd";
import React from "react";
import RegularButton from "../../../components/button";

const RandomSamplingModal = ({ setIsModalOpen, isModalOpen }) => {
  const [form] = Form.useForm();
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields()
  };
  const onFinish = () => {};
  return (
    <div>
      <Modal
        title="Random Sampling"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="Select Tin"
            name="tin"
            rules={[
              {
                required: true,
                message: "Select the Tin!",
              },
            ]}
          >
            <div className="samplingSelect">
              <Select className="w-75" placeholder="Select Tin" />
            </div>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Enter Percentage!",
              },
            ]}
            label="Enter Percentage"
            name="percentage"
          >
            <Input className="w-75" placeholder="Enter Percentage" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Enter Due Date",
              },
            ]}
            label="Due Date"
            name="duedate"
          >
            <div className="samplingPicker">
              <DatePicker className="w-75" placeholder="Due Date" />
            </div>
          </Form.Item>
          <Form.Item>
            <div className="d-flex align-items-center justify-content-center">
              <RegularButton type="submit" name="Save" width={100} />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RandomSamplingModal;
