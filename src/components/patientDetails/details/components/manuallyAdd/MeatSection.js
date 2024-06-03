import React, { useState } from "react";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import RegularButton from "../../../../button";

const MeatSection = ({ handleForm, handleSelectChnage, handleDateRange }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} onFinish={(val) => handleForm(val, "MeatSection")}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="monitorHeader" rules={[(require = true)]}>
            <label htmlFor="">Monitor Header</label>
            <Select
              placeholder="Monitor Header"
              onChange={(selOption) => handleSelectChnage(selOption, "section")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="monitor" rules={[(require = true)]}>
            <label htmlFor="">Monitor</label>
            <Select
              placeholder="Monitor"
              onChange={(selOption) => handleSelectChnage(selOption, "section")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="encounterDate" rules={[(require = true)]}>
            <label htmlFor="">Encounter Date</label>
            <DatePicker
              onChange={(date, dateString) => {
                handleDateRange(dateString, "encounterDate");
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="reference" rules={[(require = true)]}>
            <label htmlFor="">Referance</label>
            <Input
              placeholder="reference"
              //   onChange={(e) => handleInputChnage(e, "description")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="pageNumber" rules={[(require = true)]}>
            <label htmlFor="">Page Number</label>
            <Input
              placeholder="Page Number"
              //   onChange={(e) => handleInputChnage(e, "description")}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <div className="w-80 d-flex justify-content-center my-2">
          <RegularButton htmlType="submit" name="Submit" width="30%" />
          <RegularButton type="outline" name="Clear" width="30%" />
        </div>
      </Form.Item>
    </Form>
  );
};

export default MeatSection;
