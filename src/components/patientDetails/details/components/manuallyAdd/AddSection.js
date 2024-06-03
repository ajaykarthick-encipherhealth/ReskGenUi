import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import React from "react";
import RegularButton from "../../../../button";

const AddSection = ({ handleForm, handleSelectChnage, handleDateRange,setMeatDisplay }) => {
  const [form] = Form.useForm();
  const handleFinish=(value)=>{
    handleForm(value, "addSection")
    setMeatDisplay(true)
  }
  return (
    <Form form={form} onFinish={(val) => handleForm(val, "addSection")}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="section" rules={[(require = true)]}>
            <label htmlFor="">Section</label>
            <Select
              placeholder="Section"
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
      </Row>
      <Row gutter={24}>
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
          <RegularButton htmlType="submit" name="Next" width="30%" />
          <RegularButton type="outline" name="Cancel" width="30%" />
        </div>
      </Form.Item>
    </Form>
  );
};

export default AddSection;
