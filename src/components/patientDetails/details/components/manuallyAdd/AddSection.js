import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import React, { useState } from "react";
import RegularButton from "../../../../button";
import style from "../../../../../components/button/style.module.css";
import { disableFutureDate } from "../../../../headerFilters/functions";
import moment from "moment";

const AddSection = ({
  id,
  section,
  selectMeat = "",
  date,
  isEditPage
}) => {
  return (
    <div className="mx-2 p-3 pt-4 border rounded">
      <div className="row ">
        <div className="col-6">
          <Form.Item
            label={
              <label>
                Encounter Date <span style={{ color: "red" }}>*</span>
              </label>
            }
            name={`encounterDate_${section?.replaceAll(" ", "-")}${
              selectMeat ? "_" + selectMeat : selectMeat
            }_${id}`}
            rules={[
              {
                required: true,
                message: "Please enter Encounter Date",
              },
            ]}
          >
           <Select options={date} size="large" className={`ant_select_form hcc_form mb-2`} allowClear/>
          </Form.Item>
        </div>
        <div className="col-6">
          <Form.Item
            label={
              <label>
                Page Number <span style={{ color: "red" }}>*</span>
              </label>
            }
            name={`pageNumber_${section?.replaceAll(" ", "-")}${
              selectMeat ? "_" + selectMeat : selectMeat
            }_${id}`}
            rules={[
              {
                required: true,
                message: "Please enter Page Number",
              },
            ]}
          >
            <Input name="pageNumber" type="number" />
          </Form.Item>
        </div>
        <div className="col-12">
          <Form.Item
            label={
              <label>
                Reference <span style={{ color: "red" }}>*</span>
              </label>
            }
            name={`referance_${section?.replaceAll(" ", "-")}${
              selectMeat ? "_" + selectMeat : selectMeat
            }_${id}`}
            rules={[
              {
                required: true,
                message: "Please enter Referance",
              },
            ]}
          >
            <Input name="referance" />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default AddSection;
