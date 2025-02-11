import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Form, Switch } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { getResponePopup } from "../../../../../utils/reusable";

const ConflictConfig = ({ getCodingDetails, updateSettings, list }) => {
  const [form] = Form.useForm();
  const [medical, setMedical] = useState({
    conflictConditionDontHide: false,
  });

  useEffect(() => {
    getCodingDetails({ type: "CONFLICT" });
  }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        conflictConditionDontHide:
          list.response?.conflictConfig?.conflictConditionDontHide,
      });
      setMedical({
        conflictConditionDontHide:
          list.response?.conflictConfig?.conflictConditionDontHide,
      });
    }
  }, [list]);

  const onChange = (changedValues, allValues) => {
    setMedical(allValues);
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const payload = {
      type: "CONFLICT",
      conflictConfig: {
        conflictConditionDontHide: values.conflictConditionDontHide || false,
      },
    };

    try {
      const res = await updateSettings(payload);
      if (res?.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      id="chart-audit"
      onFinish={handleSubmit}
      form={form}
      onValuesChange={onChange}
    >
      <div className="d-flex flex-column" style={{ height: "100%" }}>
        <div style={{ width: "50%" }}>
          <div className="p-3">
            <div className="d-flex justify-content-between">
              <div className={Style.title}>Conflict Configuration</div>
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between mt-1">
                <div>Conflict Proxy</div>
                <div className="d-flex justify-content-between">
                  <Form.Item
                    name="conflictConditionDontHide"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <div className={`m-2`}>
                    {medical.conflictConditionDontHide ? "Enable" : "Disable"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="d-flex justify-content-end p-2"
          style={{ marginTop: "35pc" }}
        >
          <RegularButton type="outline" name="Restore" />
          <RegularButton name="Save" />
        </div>
      </div>
    </Form>
  );
};

const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
  }),
  {
    getCodingDetails: settingActions.codingGuidelinesAction,
    updateSettings: settingActions.updateMedical,
  }
);

export default enhancer(ConflictConfig);
