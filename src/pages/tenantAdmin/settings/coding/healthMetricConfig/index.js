import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Popconfirm,
  Select,
  Switch,
} from "antd";
import ModalPop from "../../components/modal";
import Image from "next/image";
import delIcon from "../../../../../images/svg/delIcon.svg";
import edit from "../../../../../images/svg/editWithoutBg.svg";
import { connect } from "react-redux";
import { actions as healthMetricActions } from "../../../../../stores/tenantAdmin";
import ButtonStyles from "../../../../../components/button/style.module.css";
import { useSelector } from "react-redux";
import { getYears } from "../../../../../utils/reusable";
import { actions as configurationActions } from "../../../../../stores/tenantAdmin";
import FileUpload from "../../../../../components/table/tenantSettingsTable/fileUpload";
import { PlusOutlined } from "@ant-design/icons";
import Search from "../../../../../components/table/tenantSettingsTable/search";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";
import { actions as codingGuidelinesActions } from "../../../../../stores/tenantAdmin";

const HealthMetricConfig = ({
  healthMetricAdd,
  updateSettings,
  getCodingDetails,
  list,
}) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [inputStrValue, setInputStrValue] = useState();
  const [healthMetricItems, setHealthMetricsItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDefaultYear, setIsDefaultYear] = useState(true);
  const [selectedYears, setSelectedYears] = useState([]);
  const [search, setSearch] = useState(null);

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

  const handleSubmit = (values) => {
    if (selectedIndex) {
      healthMetricItems[selectedIndex] = values;
      setHealthMetricsItems([...healthMetricItems]);
    } else {
      if (healthMetricItems?.length)
        setHealthMetricsItems([...healthMetricItems, values]);
      else setHealthMetricsItems([values]);
    }
    form.resetFields();
  };

  const handleEdit = (values, index) => {
    form.setFieldsValue(values);
    setSelectedIndex(index);
  };
  const handleDelete = (index) => {
    healthMetricItems.splice(index, 1);
    setHealthMetricsItems([...healthMetricItems]);
  };

  const handleAddHealthMetric = () => {
    let values = {
      healthMetrics: healthMetricItems,
      isDefaultYear: isDefaultYear,
      year: selectedYears,
    };
    !isDefaultYear ? (values.year = selectedYears) : delete values.year;
    healthMetricAdd(healthMetricItems);
    setHealthMetricsItems([]);
  };
  const handleSwitch = (checked) => {
    setIsDefaultYear(checked);
  };

  const content = (
    <>
      <Form onFinish={handleSubmit} form={form}>
        <div className="p-3">
          <div className={Style.title}>Health Metric Configuration</div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Health Metric Type</div>
            </div>
            <div>
              <Form.Item name={"healthMetricType"}>
                <Select
                  placeholder="Health Metric Type"
                  options={healthMetricsOptions}
                  className={Style.selector2}
                />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Gender</div>
            </div>
            <div>
              <Form.Item name={"gender"}>
                <Select
                  placeholder="Gender"
                  options={genderOptions}
                  className={Style.selector2}
                />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Health Metric Limit</div>
            </div>
            <div>
              <Form.Item name={"value"}>
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

          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Default Year</div>
            </div>
            <div>
              <Switch
                defaultChecked={isDefaultYear}
                // className="directCodeSwitch"
                onChange={handleSwitch}
              />
            </div>
          </div>
          {!isDefaultYear && (
            <div className="d-flex justify-content-between mt-4">
              <div>
                <div className={Style.heading}>Year</div>
              </div>
              <div>
                <Select
                  allowClear
                  options={getYears()}
                  size="large"
                  mode="multiple"
                  placeholder="Year"
                  className={Style.selector2}
                  onChange={(value) => {
                    setSelectedYears(value);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center">
          <Form.Item>
            <Button
              htmlType="submit"
              className={ButtonStyles.outer}
              style={{ height: "45px" }}
            >
              Save
            </Button>
          </Form.Item>
          {healthMetricItems?.length ? (
            <RegularButton
              name={"Submit"}
              // loading={loading}
              onClick={() => handleAddHealthMetric()}
            />
          ) : (
            <></>
          )}
        </div>
      </Form>
      <div className="row mx-1 gap-5 justify-content-center">
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
      </div>
    </>
  );

  const handleSettingsUpdate = () => {
    updateSettings({ chatAuditConfig: "values" });
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "healthMetricType",
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
  ];

  useEffect(() => {
    getCodingDetails({ type: "HEALTH_METRICS" });
  }, []);

  return (
    <>
      <div className="p-3">
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Health Metric Config</div>
        </div>
        <div className="d-flex justify-content-start gap-2 mt-4">
          <div>Year</div>
          <div>
            <Checkbox />
          </div>
          <div>Can We calculate for all Processing Year</div>
        </div>

        <div className="d-flex justify-content-start gap-2 mt-4">
          <div>
            <FileUpload allowedFormat={"File must be in xlsx or CSV"} />
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

        <div className="d-flex justify-content-start  gap-4 mt-4">
          <div>
            <Select label={"Default"} isActive={true} />
          </div>
          <div>
            <Select label={"Code"} isActive={false} />
          </div>

          <div className="ms-auto mx-4">
            <Search setSearch={setSearch} />
          </div>
        </div>
        <div>
          <TenantSettingsTable columns={columns} data={list?.response} />
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
        setOpenModal={setOpenModal}
        width={800}
      />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.codingGuidelines?.data,
  }),
  {
    healthMetricAdd: healthMetricActions.healthMetricAddAction,
    updateSettings: configurationActions.updateSettingsAction,
    getCodingDetails: codingGuidelinesActions.codingGuidelinesAction,
  }
);
export default enhancer(HealthMetricConfig);
