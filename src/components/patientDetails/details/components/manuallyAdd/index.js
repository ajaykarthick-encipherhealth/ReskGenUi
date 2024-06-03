import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Switch } from "antd";
import Provider from "./Provider";
import AddSection from "./AddSection";
import MeatSection from "./MeatSection";
import SelectButton from "../../../../btnSelect";
import style from "../../../../../components/button/style.module.css";

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

  const handleSelectChange = (val, field) => {
    form.setFieldsValue({ [field]: val });
    setSelectedOpt({ [field]: val });
  };

  const handleDateRange = (val, field) => {
    setSelectedDates({ [field]: val });
  };

  const handleForm = (values, type) => {
    setIsFileFormShow(false);
    console.log("Success:", ([values] = type));
  };
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div className="font-bold text-[16px]"> Add Valid Code </div>
        <div
          className="cr-pointer"
          onClick={() => {
            handleCloseModal(false);
          }}
        >
          <CloseOutlined />
        </div>
      </div>

      <Form
        name="basic"
        onFinish={(value) => handleForm(value, "entireform")}
        autoComplete="off"
      >
        {!meatDisplay ? (
          <>
            <Form.Item name="code" rules={[{ required: true }]}>
              <label htmlFor="">Code</label>
              <Input
                placeholder="Code"

                //   onChange={(e) => handleInputChnage(e, "code")}
              />
            </Form.Item>
            <Form.Item name="description" rules={[{ required: true }]}>
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
                options={[]}
                className={style.inputField}
                onChange={(selOption) => handleSelectChange(selOption, "dos")}
              />
            </Form.Item>
            <Form.Item name="npi">
              <div className="d-flex">
                <div className={style.subHeader}>Provider NPI</div>
                <div className="mx-2 mt-2">
                  <Switch />
                </div>
              </div>
            </Form.Item>
            <Form.Item name="provider" rules={[{ require: true }]} style={{marginTop:"-20px"}}>
              <div className={style.subHeader}>Provider</div>
              <div className="border border-[#06439D] rounded w-100 h-50 p-4">
                <Provider
                  handleForm={handleForm}
                  handleSelectChnage={handleSelectChange}
                  handleDateRange={handleDateRange}
                />
              </div>
            </Form.Item>
            <Form.Item name="addSection">
              <div className={style.subHeader}>Add Section</div>
              <div className="border rounded w-100 h-50 p-4">
                <AddSection
                  handleForm={handleForm}
                  handleSelectChnage={handleSelectChange}
                  handleDateRange={handleDateRange}
                  setMeatDisplay={setMeatDisplay}
                />
              </div>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item name="meat">
              <div className={style.subHeader}>Meat</div>
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
                <MeatSection
                  handleForm={handleForm}
                  handleSelectChnage={handleSelectChange}
                  handleDateRange={handleDateRange}
                  setMeatDisplay={setMeatDisplay}
                />
              </div>
            </Form.Item>
            <Form.Item>
              <div className="w-80 d-flex justify-content-center my-2">
                <Button htmlType="submit" className={style.submitBtn}>
                  Save
                </Button>
              </div>
            </Form.Item>
          </>
        )}
      </Form>
    </>
  );
};

export default ManuallyAdd;
