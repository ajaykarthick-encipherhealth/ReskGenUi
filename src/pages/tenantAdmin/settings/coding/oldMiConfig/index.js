import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Form, Switch } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { getResponePopup } from "../../../../../utils/reusable";

const OldMiConfig = ({ getCodingDetails, updateSettings, list }) => {
  const [form] = Form.useForm();
  const [medical, setMedical] = useState({
    captureOldMiConditions: false,
  });
  useEffect(() => {
    getCodingDetails({ type: "OLD_MI" });
  }, []);
  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        captureOldMiConditions:
          list.response?.oldMiConfig?.captureOldMiConditions,
      });
      setMedical({
        captureOldMiConditions:
          list.response?.oldMiConfig?.captureOldMiConditions,
      });
    }
  }, [list]);

  const onChange = (changedValues, allValues) => {
    setMedical(allValues);
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const payload = {
      type: "OLD_MI",
      oldMiConfig: {
        captureOldMiConditions: values.captureOldMiConditions || false,
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
    <>
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
                <div className={Style.title}>OldMi Configuration</div>
              </div>
              <div className="mt-4">
                <div className="d-flex justify-content-between mt-1">
                  <div>OldMiConfig</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item
                      name="captureOldMiConditions"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical.captureOldMiConditions
                        ? "Enable"
                        : "Disable"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="d-flex justify-content-end p-2"
            style={{ marginTop: "25pc" }}
          >
            <RegularButton type="outline" name="Restore" />
            <RegularButton name="Save" />
          </div>
        </div>
      </Form>
    </>
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

export default enhancer(OldMiConfig);
