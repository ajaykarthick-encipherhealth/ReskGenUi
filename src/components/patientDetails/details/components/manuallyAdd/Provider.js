import React from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import RegularButton from "../../../../button";
import style from '../../../../../components/button/style.module.css'

const Provider = ({ handleForm, handleSelectChnage, handleDateRange }) => {
  const [form2] = Form.useForm();
  const onFinish=(values)=>{
    handleForm(values, "provider")
  }
  const providerInfoList = [
    { value: "authorizedProvider", label: "Authorized Provider" },
    { value: "noCredential", label: "No Credential" },
    { value: "unAuthorizeProvider", label: "UnAuthorize Provider" },
    { value: "unSigned", label: "Un Signed" },
  ];
  return (
    <Form form={form2} onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="provider">
            <label htmlFor="">Provider</label>
            <Select
             className={style.inputField}
              placeholder="Provider"
              options={[]}
              onChange={(selOption) =>
                handleSelectChnage(selOption, "provider")
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="providerInfo">
            <label htmlFor="">Provider Info</label>
            <Select
              placeholder="Provider Info"
              options={providerInfoList}
              className={style.inputField}
              onChange={(selOption) =>
                handleSelectChnage(selOption, "providerInfo")
              }
              allowClear={true}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="encounterDate">
            <label htmlFor="">Encounter Date</label>
            <DatePicker
              onChange={(date, dateString) => {
                handleDateRange(dateString, "encounterDate");
              }}
              className={style.picker}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="reference">
            <label htmlFor="">Referance</label>
            <Input
              placeholder="reference"
              //   onChange={(e) => handleInputChnage(e, "description")}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="pageNumber">
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
          <RegularButton type="outline" name="Clear" width="30%" />
          <Button htmlType="submit" className={style.submitBtn}>Submit</Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default Provider;
