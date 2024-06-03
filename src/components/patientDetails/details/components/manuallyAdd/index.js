import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  notification,
} from "antd";
import Provider from "./Provider";
import AddSection from "./AddSection";
import MeatSection from "./MeatSection";
import SelectButton from "../../../../btnSelect";
import style from "../../../../../components/button/style.module.css";
import ENDPOINTS from "../../../../../utility/enpoints";
import axios from "../../../../../utility/axiosConfig";
import { connect } from "react-redux";
const { Option } = Select;

const ManuallyAdd = ({
  handleCloseModal,
  setIsFileFormShow,
  patientDosResult,
}) => {
  const [form] = Form.useForm();
  const [providerDetails, setProviderDetails] = useState(null);
  const [selectMeat, setSelectMeat] = useState("M");
  const [isFilled, setIsFilled] = useState([]);
  const [meatDisplay, setMeatDisplay] = useState(false);
  const [providerInfoSelectClose, setProviderInfoSelectClose] = useState(false);
  const [providerInfoSelectOpen, setProviderInfoSelectOpen] = useState(false);
  const [inputStr, setInputStr] = useState({
    code: "",
    description: "",
  });
  const [selectedOpt, setSelectedOpt] = useState();
  const [selectedDates, setSelectedDates] = useState();
  const [providerNPI, setProviderNPI] = useState({
    status: false,
    number: "",
  });
  const [dosList, setDosList] = useState(
    patientDosResult?.data?.response?.map((item) => ({
      label: item.dateOfService,
      value: item?.dateOfService,
    })) || []
  );

  const handleInputChange = async (e) => {
    if (e.target?.value?.length === 10) {
      notification.warning({
        message: "Please wait provider details fetch...",
        placement: "top",
        duration: 2,
      });
      try {
        const response = await axios.get(
          ENDPOINTS.apiEndoint +
            `management/provider/getProviderData?npiNumber=${e.target.value}`
        );
        if (response?.data) {
          var initalForm = {
            providerName:
              response?.data?.response?.userName +
              " " +
              response?.data?.response?.credential,
            selectProviderInfo: ["Authorized Provider"],
          };
          setProviderDetails(initalForm);
        }
      } catch (e) {
        setProviderDetails(null);
        notification.error({
          message: e?.message,
          placement: "top",
          duration: 2,
        });
      }
    }
  };
  const handleSelectChange = (val, field) => {
    form.setFieldsValue({ [field]: val });
    setSelectedOpt({ [field]: val });
  };

  const handleDateRange = (val, date, field) => {
    setSelectedDates({ [field]: { date: date, dateString: val } });
  };

  const handleForm = (values, type) => {
    setIsFileFormShow(false);
    console.log("Success:", values, type);
  };
  const onChange = (checked) => {
    setProviderNPI({ status: checked });
  };
  const handleAddDate = () => {
    const newDate = {
      label: selectedDates?.dos?.dateString,
      value: selectedDates?.dos?.dateString,
    };
    setDosList([...dosList,newDate])
    setSelectedDates({dos:{}})
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

      {!meatDisplay ? (
        <>
          <Form
            name="basic"
            onFinish={(value) => handleForm(value, "entireform")}
            autoComplete="off"
          >
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
                mode="tags"
                maxTagCount="responsive"
                className={`ant_select_form hcc_form mb-2`}
                open={
                  providerInfoSelectClose == true
                    ? false
                    : providerInfoSelectOpen
                }
                onClick={() =>
                  providerInfoSelectClose == true
                    ? setProviderInfoSelectClose(false)
                    : setProviderInfoSelectOpen(true)
                }
                placeholder="DOS"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div className={`col-xl-12 my-2`}>
                      <DatePicker
                        className={style.picker}
                        onChange={(date, dateString) => {
                          handleDateRange(dateString, date, "dos");
                        }}
                        value={selectedDates?.dos?.date}
                      />
                    </div>
                    <div>
                      <Button
                        className="save-sm-btn"
                        onClick={handleAddDate}
                        style={{ width: "50px" }}
                      >
                        Add
                      </Button>
                      <Button
                        className="cancel-sm-btn"
                        style={{
                          width: "50px",
                          marginLeft: "5px",
                          marginRight: "10px",
                        }}
                        onClick={() => {
                          setProviderInfoSelectClose(true);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </>
                )}
                onChange={(selOption) => handleSelectChange(selOption, "dos")}
              >
                {dosList?.map((data) => (
                  <Option key={data?.value} value={data?.value}>
                    {data?.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="npi">
              <div className="d-flex">
                <div className={style.subHeader}>Provider NPI</div>
                <div className="mx-2 mt-2">
                  <Switch onChange={onChange} />
                </div>
              </div>
            </Form.Item>
            {providerNPI?.status && (
              <Form.Item name="npiNumber" rules={[{ required: true }]}>
                <label htmlFor="">Provider NPI Number</label>
                <Input
                  placeholder="Provider NPI Number"
                  onChange={(e) => handleInputChange(e, "npiNumber")}
                />
              </Form.Item>
            )}
          </Form>

          <div className={style.subHeader}>Provider</div>
          <div className="border rounded w-100 h-auto p-4">
            <Provider
              handleForm={handleForm}
              handleSelectChnage={handleSelectChange}
              handleDateRange={handleDateRange}
            />
          </div>

          <div className={style.subHeader}>Add Section</div>
          <div className="border rounded w-100 h-auto p-4">
            <AddSection
              handleForm={handleForm}
              handleSelectChnage={handleSelectChange}
              handleDateRange={handleDateRange}
              setMeatDisplay={setMeatDisplay}
            />
          </div>
        </>
      ) : (
        <>
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

          <div className="border rounded w-100 h-auto p-4">
            <MeatSection
              handleForm={handleForm}
              handleSelectChnage={handleSelectChange}
              handleDateRange={handleDateRange}
              setMeatDisplay={setMeatDisplay}
            />
          </div>

          <div className="w-80 d-flex justify-content-center my-2">
            <Button htmlType="submit" className={style.submitBtn}>
              Save
            </Button>
          </div>
        </>
      )}
    </>
  );
};

const enhancer = connect((state) => ({
  patientDosResult: state?.patientDetails?.details?.dosResult,
}));

export default enhancer(ManuallyAdd);
