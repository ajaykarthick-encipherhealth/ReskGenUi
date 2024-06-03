import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Row, Select, Switch, Col } from "antd";
import RegularButton from "../../../../button";
import Provider from "./Provider";
import AddSection from "./AddSection";
import MeatSection from "./MeatSection";
import SelectButton from "../../../../btnSelect";

const ManuallyAdd = ({ handleCloseModal, setIsFileFormShow }) => {
  const [form] = Form.useForm();
  const [selectMeat, setSelectMeat] = useState("M");
  const [isFilled, setIsFilled] = useState([]);
  const [meatDisplay, setMeatDisplay] = useState(false);
  const [inputStr, setInputStr] = useState({
    code: "",
    description: "",
  });
  const [selectedOpt, setSelectedOpt] = useState();
  const [selectedDates, setSelectedDates] = useState();
  const handleSelectChnage = (val, field) => {
    form.setFieldValue({ dos: val });
    setSelectedOpt(([field] = val));
  };
  const handleDateRange = (val, field) => {
    setSelectedDates(([field] = val));
  };
  const handleForm = (values, type) => {
    setIsFileFormShow(false);
    console.log(([type] = values));
  };
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div> Add Valid Code </div>
        <div
          className="cr-pointer"
          onClick={() => {
            handleCloseModal(false);
          }}
        >
          <CloseOutlined />
        </div>
      </div>
      <label htmlFor="">Provider</label>
      <div className="border border-[#06439D] rounded w-100 h-50 p-4">
        <Provider
          handleForm={handleForm}
          handleSelectChange={handleSelectChnage}
          handleDateRange={handleDateRange}
        />
      </div>
      <Form form={form} onFinish={(val) => handleForm(val, "entireForm")}>
        {!meatDisplay ? (
          <>
            <Form.Item name="code">
              <label htmlFor="">Code</label>
              <Input
                placeholder="Code"
                //   onChange={(e) => handleInputChnage(e, "code")}
              />
            </Form.Item>
            <Form.Item name="description">
              <label htmlFor="">Description</label>
              <Input
                placeholder="Description"
                //   onChange={(e) => handleInputChnage(e, "description")}
              />
            </Form.Item>
            <Form.Item name="dos">
              <label htmlFor="">DOS</label>
              <Select
                placeholder="DOS"
                onChange={(selOption) => handleSelectChnage(selOption, "dos")}
              />
            </Form.Item>

            <Form.Item name="npi">
              <div className="d-flex">
                <label htmlFor="">Provider NPI</label>
                <div className="mx-2">
                  <Switch />
                </div>
              </div>
            </Form.Item>

            <label htmlFor="">Provider</label>
            <div className="border border-[#06439D] rounded w-100 h-50 p-4">
              <Provider
                handleForm={handleForm}
                handleSelectChnage={handleSelectChnage}
                handleDateRange={handleDateRange}
              />
            </div>
            <label htmlFor="">Add Section</label>
            <div className="border rounded w-100 h-50 p-4">
              <AddSection
                handleForm={handleForm}
                handleSelectChnage={handleSelectChnage}
                handleDateRange={handleDateRange}
                setMeatDisplay={setMeatDisplay}
              />
            </div>
          </>
        ) : (
          <>
            <label htmlFor="">Meat</label>
            <div className="d-flex">
              <label htmlFor="">Active Header</label>
              <div className="mx-2">
                <Switch />
              </div>
            </div>
            <div className="d-flex justify-content-center mb-2">
              {" "}
              <SelectButton
                select={selectMeat}
                setSelect={setSelectMeat}
                completed={isFilled}
              />
            </div>
            <div className="border rounded w-100 h-50 p-4">
              <MeatSection />
            </div>
          </>
        )}
      </Form>
    </>
  );
};

export default ManuallyAdd;
