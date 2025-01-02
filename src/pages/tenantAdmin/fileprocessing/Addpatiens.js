import React, { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Form, Input, Select, Row, Col } from "antd";

const Addpatients = ({
  addPatientId,
  setAddPatientId,
  validated,
  handleSubmitPatientId,
  handleChangePatientId,
  orgAllList,
}) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    setAddPatientId(false); 
  };
  return (
    <Offcanvas
      onHide={() => setAddPatientId(false)}
      show={addPatientId}
      className="offcanvas-end"
      placement="end"
    >
      <div className="offcanvas-header">
        <h5 className="modal-title" id="#gridSystemModal">
          Add Patient Details
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setAddPatientId(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <Form
            form={form}
            onFinish={handleSubmitPatientId}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            {" "}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Patient ID"
                  name="patientId"
                  rules={[
                    {
                      required: true,
                      message: "Please enter patient ID!",
                    },
                    {
                      pattern: /^\S*$/,
                      message: "Patient ID should not contain spaces!",
                    },
                  ]}
                >
                  <Input placeholder="Enter patient ID" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Patient Name"
                  name="patientName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter patient name!",
                    },
                  ]}
                >
                  <div>
                    {" "}
                    <Input placeholder="Enter patient name" />
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Select Organization"
                  name="organizationId"
                  rules={[
                    {
                      required: true,
                      message: "Please select Organization!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select"
                    options={orgAllList}
                    style={{ height: "42px" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: "flex", gap: "8px" }}>
              <Form.Item>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  {"Submit"}
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  className="btn btn-danger btn-sm light ms-1"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Offcanvas>
  );
};

export default Addpatients;
