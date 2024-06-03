import React from "react";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import RegularButton from "../../../../button";

const Provider = ({ handleForm, handleSelectChange, handleDateRange }) => {

  return (
    <Form onFinish={(val) => handleForm(val, "provider")}>
      {/* <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="provider" >
            <label htmlFor="">Provider</label>
            <Select
              placeholder="Provider"
              options={[]}
              onChange={(selOption) =>
                handleSelectChnage(selOption, "provider")
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="providerInfo" >
            <label htmlFor="">Provider Info</label>
            <Select
              placeholder="Provider Info"
              options={[]}
              onChange={(selOption) =>
                handleSelectChnage(selOption, "providerInfo")
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="encounterDate" >
            <label htmlFor="">Encounter Date</label>
            <DatePicker
              onChange={(date, dateString) => {
                handleDateRange(dateString, "encounterDate");
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="reference" >
            <label htmlFor="">Referance</label>
            <Input
              placeholder="reference"
              //   onChange={(e) => handleInputChnage(e, "description")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="pageNumber" >
            <label htmlFor="">Page Number</label>
            <Input
              placeholder="Page Number"
              //   onChange={(e) => handleInputChnage(e, "description")}
            />
          </Form.Item>
        </Col>
      </Row> */}
      <Form.Item name="providerInfo" label="">
        {/* <label htmlFor="">Provider Info</label> */}
        <Select
          placeholder="Provider Info"
          options={[]}
          onChange={(selOption) =>{

              handleSelectChange(selOption, "providerInfo")
          }
          }
        />
      </Form.Item>
      <Form.Item>
        <div className="w-80 d-flex justify-content-center my-2">
          <RegularButton htmlType="submit" name="Submit" width="30%" />
          <RegularButton type="outline" name="Cancel" width="30%" />
        </div>
      </Form.Item>
    </Form>
  );
};

export default Provider;
