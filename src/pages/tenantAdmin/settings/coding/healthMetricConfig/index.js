import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Switch,
} from "antd";
import ModalPop from "../../components/modal";
import Image from "next/image";
import delIcon from "../../../../../images/svg/delIcon.svg";
import edit from "../../../../../images/svg/editWithoutBg.svg";
import { connect } from "react-redux";
import ButtonStyles from "../../../../../components/button/style.module.css";
import { useSelector } from "react-redux";
import { getResponePopup, getYears } from "../../../../../utils/reusable";
import FileUpload from "../../../../../components/table/tenantSettingsTable/fileUpload";
import { PlusOutlined } from "@ant-design/icons";
import Search from "../../../../../components/table/tenantSettingsTable/search";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import RegularButtonWithIcon from "../../../../../components/buttonWithIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const types = [
  { label: "BMI", value: "BMI" },
  { label: "PHQ", value: "PHQ" },
  { label: "AUDIT_C", value: "AUDIT_C" },
];

const genders = [
  { label: "MALE", value: "MALE" },
  { label: "FEMALE", value: "FEMALE" },
  { label: "OTHERS", value: "OTHERS" },
  { label: "DEFAULT", value: "DEFAULT" },
];
const HealthMetricConfig = ({
  healthMetricAdd,
  updateSettings,
  getCodingDetails,
  list,
  editHealthMetric,
  addHealthMetric,
  deleteComoridConditions,
}) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [inputStrValue, setInputStrValue] = useState();
  const [healthMetricItems, setHealthMetricsItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDefaultYear, setIsDefaultYear] = useState(true);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectFile, setSelectFile] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editRowValue, setEditRowValue] = useState(null);
  const [select, setSelect] = useState({
    healthMetricType: "",
    gender: "",
    year: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);

  const handleInputChange = (e) => {
    setInputStrValue(e.target.value);
  };

  const healthMetricsOptions = [
    {
      label: "BMI",
      value: "BMI",
    },
    {
      label: "PHQ",
      value: "PHQ",
    },
    {
      label: "AUDIT_C",
      value: "AUDIT_C",
    },
  ];
  const genderOptions = [
    {
      label: "Male",
      value: "MALE",
    },
    {
      label: "Female",
      value: "FEMALE",
    },
    {
      label: "Others",
      value: "OTHERS",
    },
    {
      label: "Default(Not Gender Specific)",
      value: "DEFAULT(NOT GENDER SPECIFIC)",
    },
  ];

  const handleSubmit = async (values) => {
    try {
      const res = await addHealthMetric({ ...values });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setOpenModal(false);
        form.resetFields();
        getCodingDetails({
          type: "HEALTH_METRICS",
          page: page,
          healthMetricType: select.healthMetricType,
          gender: select.gender,
          year: select.year,
        });
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const content = (
    <>
      <Form
        onFinish={isEdit ? "" : handleSubmit}
        onFieldsChange={(e) => console.log(e)}
        form={form}
      >
        <div className="p-3">
          <div className={Style.title}>Health Metric Configuration</div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Health Metric Type</div>
            </div>
            <div>
              <Form.Item
                name={"type"}
                rules={[
                  {
                    required: true,
                    message: "Please select health metric",
                  },
                ]}
              >
                <Select
                  placeholder="Health Metric Type"
                  options={healthMetricsOptions}
                  className={Style.selector2}
                  // disabled={isEdit}
                />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Gender</div>
            </div>
            <div>
              <Form.Item
                name={"gender"}
                rules={[
                  {
                    required: true,
                    message: "Please select gender",
                  },
                ]}
              >
                <Select
                  placeholder="Gender"
                  options={genderOptions}
                  className={Style.selector2}
                  // disabled={isEdit}
                />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Health Metric Limit</div>
            </div>
            <div>
              <Form.Item
                name={"value"}
                rules={[
                  {
                    required: true,
                    message: "Please enter limit",
                  },
                ]}
              >
                <Input
                  placeholder={"Limit"}
                  onChange={(e) => handleInputChange(e, "code")}
                  value={inputStrValue}
                  style={{ padding: "22px" }}
                  className={Style.selector2}
                />
              </Form.Item>
            </div>
          </div>

          {!isChecked && (
            <div className="d-flex justify-content-between mt-4">
              <div>
                <div className={Style.heading}>Year</div>
              </div>
              <div style={{ width: "250px" }}>
                <Form.Item
                  name={"years"}
                  rules={[
                    {
                      required: true,
                      message: "Please select years",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    options={getYears()}
                    size="large"
                    mode="multiple"
                    placeholder="Year"
                    onChange={(value) => {
                      setSelectedYears(value);
                    }}
                    value={selectedYears}
                    // disabled={isEdit}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center">
          {isEdit ? (
            <Button
              htmlType="button"
              className={ButtonStyles.outer}
              style={{ height: "45px" }}
              onClick={() => handleEditRow()}
            >
              Update
            </Button>
          ) : (
            <Form.Item>
              <Button
                htmlType="submit"
                className={ButtonStyles.outer}
                style={{ height: "45px" }}
              >
                Save
              </Button>
            </Form.Item>
          )}
        </div>
      </Form>
      {/* <div className="row mx-1 gap-5 justify-content-center">
        {healthMetricItems?.map((item, index) => {
          return (
            <div className="card  bordered col-5  p-2 bg-light" key={index}>
              <div className="d-flex gap-3">
                <div className="w-100">
                  <div className="d-flex gap-3">
                    <div className="fw-bold" style={{ width: "150px" }}>
                      {"Health Metric Type"}
                    </div>
                    <div>- {item.healthMetricType}</div>
                  </div>
                  <div className="d-flex gap-3">
                    <div className="fw-bold" style={{ width: "150px" }}>
                      {"Gender"}
                    </div>
                    <div>- {item.gender}</div>
                  </div>
                  <div className="d-flex gap-3">
                    <div className="fw-bold" style={{ width: "150px" }}>
                      {"health Metric Limit"}
                    </div>
                    <div>- {item.value}</div>
                  </div>
                </div>
                <div>
                  <Button
                    size="small"
                    type="link"
                    onClick={() => handleEdit(item, index)}
                    style={{ padding: "0px" }}
                  >
                    <Image src={edit} alt="noimg" />
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this Health Metric?"
                    onConfirm={() => handleDelete(index)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button size="small" type="link" style={{ padding: "0px" }}>
                      <Image src={delIcon} alt="noimg" />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </>
  );

  const handleSettingsUpdate = () => {
    updateSettings({ chatAuditConfig: "values" });
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Year",
      dataIndex: "years",
      key: "year",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  useEffect(() => {
    getCodingDetails({
      type: "HEALTH_METRICS",
      page: page,
      healthMetricType: select.healthMetricType,
      gender: select.gender,
      year: select.year,
    });
  }, [select, page]);

  const submitPatientFile = async () => {
    const formData = new FormData();
    formData.append("file", selectFile.originFileObj);
    formData.append("target", "HEALTH_METRICS");
    formData.append("isDefaultYear", isChecked);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // setSelectFile(formData);
    try {
      const res = await axios.post(
        ENDPOINTS.apiEndoint +
          `management/tenantAdmin/codes/upload
      `,
        formData,
        headers
      );
      setSelectFile("");
      if (res.data.status == "SUCCESS") {
        getResponePopup(res);
      } else if (res.data.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      if (error.response.status == 513) {
        getResponePopup({ status: "USER_DEFINED_ERROR" });
      }
    }
  };

  const handleDeleteRow = async (value) => {
    try {
      const res = await deleteComoridConditions({
        id: value.id,
        target: "HEALTH_METRICS",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getCodingDetails({
          type: "HEALTH_METRICS",
          page: page,
          healthMetricType: select.healthMetricType,
          gender: select.gender,
          year: select.year,
        });
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditRow = async (value) => {
    try {
      const res = await addHealthMetric({
        ...editRowValue,
        ...form.getFieldsValue(),
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getCodingDetails({
          type: "HEALTH_METRICS",
          page: page,
          healthMetricType: select.healthMetricType,
          gender: select.gender,
          year: select.year,
        });
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPage(e.page);
  };

  const handleFilter = (e, name) => {
    setSelect((prev) => ({
      ...prev,
      [name]: e,
    }));
  };
  return (
    <>
      <div className="p-3">
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Health Metric Config</div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-start gap-2 mt-4">
            <div>Year</div>
            <div>
              <Switch checked={isChecked} onChange={(e) => setIsChecked(e)} />
            </div>
            <div>Can We calculate for all Processing Year</div>
          </div>

          <div className="d-flex justify-content-start gap-2 mt-4">
            <div className="d-flex">
              <FileUpload
                allowedFormat={"File must be in xlsx or CSV"}
                onChange={(e) => setSelectFile(e.file)}
                fileList={[]}
                accept={".xlsx, .csv"}
              />
              <RegularButton
                name="Upload"
                type={selectFile}
                disabled={!selectFile}
                onClick={submitPatientFile}
              />
            </div>
            <div>
              <Button
                icon={<PlusOutlined />}
                style={{
                  height: "47px",
                }}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Add Manually
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-start  gap-4 ms-3 mt-4">
          <div>
            <Select
              // label={"Default"}
              // isActive={true}
              style={{ width: "150px" }}
              size="large"
              options={types}
              placeholder="Type"
              onChange={(e) => handleFilter(e, "healthMetricType")}
              allowClear
            />
          </div>
          <div>
            <Select
              // label={"Code"}
              // isActive={false}
              style={{ width: "150px" }}
              size="large"
              options={genders}
              placeholder="Gender"
              onChange={(e) => handleFilter(e, "gender")}
              allowClear
            />
          </div>
          <div>
            <Select
              label={"Years"}
              isActive={false}
              style={{ width: "150px" }}
              size="large"
              options={getYears()}
              placeholder="Years"
              onChange={(e) => handleFilter(e, "year")}
              allowClear
            />
          </div>
        </div>
        <div>
          <TenantSettingsTable
            columns={columns}
            data={list?.response?.content}
            handleEdit={(e) => {
              setEditRowValue(e);
              setIsEdit(e);
              // console.log(e);
              form.setFieldsValue({ ...e, healthMetricType: e.type });
              setSelectedYears(e.years);
            }}
            handleDelete={handleDeleteRow}
            paginationFirst={paginationFirst}
            totalElements={list?.response?.totalElements}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      <div className="text-end p-3">
        <RegularButton
          type={"outline"}
          name={"Restore Changes"}
          onClick={() => handleSettingsUpdate()}
        />
        <RegularButton name={"Save Changes"} onClick={() => handleSubmit()} />
      </div>
      <ModalPop
        openModal={openModal}
        content={content}
        setOpenModal={() => {
          setOpenModal(false);
          form.resetFields();
        }}
        width={800}
      />
      <ModalPop
        openModal={isEdit}
        content={content}
        setOpenModal={() => {
          setIsEdit(false);
          form.resetFields();
        }}
        width={800}
      />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
  }),
  {
    healthMetricAdd: settingActions.healthMetricAddAction,
    updateSettings: settingActions.updateSettingsAction,
    editHealthMetric: settingActions.editHealthMetric,
    deleteComoridConditions: settingActions.deleteComoridConditions,
    addHealthMetric: settingActions.addHealthMetric,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);
export default enhancer(HealthMetricConfig);
