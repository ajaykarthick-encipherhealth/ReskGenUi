import { Form, Input, Select } from "antd";
import React from "react";
import { getYears } from "../../../../utils/reusable";
import RegularButton from "../../../../components/button";

const EditSettings = ({ form, handleEditRow }) => {
  return (
    <Form
      form={form}
      onFinish={(e) => {
        console.log(e);
        handleEditRow(e);
      }}
      layout="vertical"
    >
      <Form.Item label={"Code"} name={"code"}>
        <Input type="text" />
      </Form.Item>
      <Form.Item label={"Description"} name={"description"}>
        <Input type="text" />
      </Form.Item>
      <Form.Item label={"Result Code"} name={"resultCode"}>
        <Input type="text" />
      </Form.Item>
      <Form.Item label={"Years"} name={"years"}>
        <Select
          allowClear
          options={getYears()}
          size="large"
          mode="multiple"
          placeholder="Year"
        />
      </Form.Item>
      <Form.Item>
        <div className="d-flex justify-content-center">
          <RegularButton name={"Edit"} onClick={handleEditRow} />
        </div>
      </Form.Item>
    </Form>
  );
};

export default EditSettings;
