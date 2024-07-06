import React, { useEffect } from "react";
import Style from "./../../style.module.css";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { disablePastDate } from "../../../../../components/headerFilters/functions";
import RegularButton from "../../../../../components/button";
import { connect, useSelector } from "react-redux";
import { actions as configurationActions } from "../../../../../stores/tenantAdmin";
import { getYears } from "../../../../../utils/reusable";
import ButtonStyles from "../../../../../components/button/style.module.css";

const FileProcessingConfig = ({
  getFileProcessingConfig,
  updateSettings,
  data,
}) => {
  const [form] = Form.useForm();

  const fileProcessingScopes = [
    {
      label: "PROSPECTIVE",
      value: "PROSPECTIVE",
    },
    {
      label: "RETROSPECTIVE",
      value: "RETROSPECTIVE",
    },
    {
      label: "CONCURRENT",
      value: "CONCURRENT",
    },
  ];

  const fileProcessingTypes = [
    {
      label: "YEAR",
      value: "YEAR",
    },
    {
      label: "DOS",
      value: "DOS",
    },
  ];
  useEffect(() => {
    getFileProcessingConfig({ type: "FILE_PROCESSING" });
  }, []);

  useEffect(() => {
    if (data?.response) {
      form.setFieldsValue({
        fileProcessingScope: data?.response.fileProcessingScope,
        processingType: data?.response?.processingType,
        rulesFollowingYear: data?.response?.rulesFollowingYear,
        processingYears: data?.response?.processingYears,
      });
    }
  }, [data]);
  const handleSubmit = (values) => {
    updateSettings({ fileProcessingConfig: values });
  };

  return (
    <>
      <Form
        id={"chart-audit"}
        onChange={{}}
        onFinish={handleSubmit}
        form={form}
      >
        <div className="p-3" style={{ height: "65vh" }}>
          <div className={Style.title}>File Processing Configuration</div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>File Processing Scope</div>
            </div>
            <div>
              <Form.Item name={"fileProcessingScope"}>
                <Select
                  placeholder="Prospective"
                  options={fileProcessingScopes}
                  className={Style.selector}
                  allowClear
                />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Processing Type</div>
            </div>
            <div>
              <Form.Item name={"processingType"}>
                <Select
                  placeholder="Year"
                  options={fileProcessingTypes}
                  className={Style.selector}
                  allowClear
                />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Rules Following Year</div>
            </div>
            <div>
              <Form.Item name={"rulesFollowingYear"}>
                <Select
                  placeholder="Rule"
                  options={getYears()}
                  className={Style.selector}
                  allowClear
                />
              </Form.Item>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>
              <div className={Style.heading}>Processing Years</div>
            </div>
            <div style={{ width: "300px" }}>
              <Form.Item name={"processingYears"}>
                <Select
                  placeholder="Rule"
                  mode="multiple"
                  options={getYears()}
                  size="large"
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end p-3">
          <RegularButton
            type={"outline"}
            name={"Restore Changes"}
            onClick={() => console.log("Restore Changes")}
          />
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className={ButtonStyles?.btnColor}
              style={{ height: "45px" }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};
const enhancer = connect(
  (state) => ({
    data: state?.tenantAdmin?.configurationSettings?.data,
  }),
  {
    getFileProcessingConfig: configurationActions.configurationSettingsAction,
    updateSettings: configurationActions.updateSettingsAction,
  }
);

export default enhancer(FileProcessingConfig);
