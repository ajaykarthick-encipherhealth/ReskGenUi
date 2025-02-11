import React, { useEffect } from "react";
import Style from "./../../style.module.css";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { disablePastDate } from "../../../../../components/headerFilters/functions";
import RegularButton from "../../../../../components/button";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import ButtonStyles from "../../../../../components/button/style.module.css";
import { getResponePopup } from "../../../../../utils/reusable";
const ChatAuditConfig = ({ getConfigurationDetails, updateSettings, data }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    getConfigurationDetails({ type: "CHART_AUDIT" });
  }, []);

  useEffect(() => {
    if (data?.response) {
      form.setFieldsValue({
        maxHoldCount: data?.response.maxHoldCount,
        maxAllocationCount: data?.response?.maxAllocationCount,
        maxPendingCount: data?.response?.maxPendingCount,
        priorityBasedOn: data?.response?.priorityBasedOn,
      });
    }
  }, [data]);

  const priorityOptions = [
    {
      label: "Due Date",
      value: "DUE_DATE",
    },
    {
      label: "RAF",
      value: "RAF",
    },
  ];

  const handleSubmit = async (values) => {
    try {
      const res = await updateSettings(values);
      if (res?.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form id={"chart-audit"} onFinish={handleSubmit} form={form}>
      <div className="p-3" style={{ width: "60%" }}>
        <div className={Style.title}>Chart Audit Configuration</div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Max hold count</div>
          </div>
          <div>
            <Form.Item
              name={"maxHoldCount"}
              // rules={[{ required: true, message: "requires" }]}
            >
              <InputNumber
                type="number"
                form
                size="large"
                placeholder="Hold Count"
                style={{ width: "150px", fontSize: "14px" }}
              />
            </Form.Item>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Max allocation count</div>
          </div>
          <div>
            <Form.Item name={"maxAllocationCount"}>
              <InputNumber
                type="number"
                size="large"
                placeholder="Max Count"
                style={{ width: "150px", fontSize: "14px" }}
              />
            </Form.Item>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Max pending count</div>
          </div>
          <div>
            <Form.Item name={"maxPendingCount"}>
              <InputNumber
                type="number"
                size="large"
                placeholder="Max Count"
                style={{ width: "150px", fontSize: "14px" }}
              />
            </Form.Item>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Prioritize chart based on</div>
          </div>
          <div>
            <Form.Item name={"priorityBasedOn"}>
              <Select
                size="large"
                allowClear
                options={priorityOptions}
                style={{ width: "150px", fontSize: "14px" }}
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div
        className="d-flex justify-content-end align-items-end items-end"
        style={{
          width: "95%",
         marginTop:"19pc"
       
        }}
      >
        <Form.Item>
          <RegularButton
            type={"outline"}
            name={"Restore"}
            onClick={() => console.log("Restore Changes")}
          />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            className={ButtonStyles?.btnColor}
            style={{ height: "45px" }}
          >
            Save
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

const enhancer = connect(
  (state) => ({
    data: state?.tenantAdmin?.settings?.configurationSettings?.data,
  }),
  {
    getConfigurationDetails: settingActions.configurationSettingsAction,
    updateSettings: settingActions.updateChatAudit,
  }
);

export default enhancer(ChatAuditConfig);
