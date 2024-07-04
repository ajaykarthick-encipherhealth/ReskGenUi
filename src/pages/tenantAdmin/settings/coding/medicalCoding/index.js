import React, { useEffect } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Form, Switch } from "antd";
import { connect, useSelector } from "react-redux";
import { actions as codingGuidelinesActions } from "../../../../../stores/tenantAdmin";
import { actions as configurationActions } from "../../../../../stores/tenantAdmin";

const MedicalCoding = ({ getCodingDetails, updateSettings,list }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    getCodingDetails({ type: "CODING" });
  }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        isOIGCodeNeeded: list?.response?.isOIGCodeNeeded,
        captureHistoryCodes: list?.response?.captureHistoryCodes,
        captureHistoryCodesAsIcdCodes:
          list?.response?.captureHistoryCodesAsIcdCodes,
        isSlashConditionsNeedToCapture:
          list?.response?.isSlashConditionsNeedToCapture,
        calculateComboIncludingPastMedicalHistory:
          list.response?.calculateComboIncludingPastMedicalHistory,
        isDownCodeConversionEnabled: list.response?.isDownCodeConversionEnabled,
      });
    }
  }, [list]);

  const onChange = (value, values) => {
    console.log(values);
  };
  const handleSubmit = (values) => {
    updateSettings({ coding: values });
  };
  return (
    <>
      <Form
        id={"chart-audit"}
        onFinish={handleSubmit}
        form={form}
        onValuesChange={onChange}
      >
        <div className="p-3" style={{ height: "65vh" }}>
          <div className="d-flex justify-content-between">
            <div className={Style.title}>Medical Coding</div>
          </div>
          <div className="mt-4">
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need an OIG code"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="isOIGCodeNeeded">
                  <Switch className="switch" />
                </Form.Item>
                <div
                  className={`mx-2 text-${
                    list?.response?.isOIGCodeNeeded ? "info" : "danger"
                  }`}
                >
                  {list?.response?.isOIGCodeNeeded ? "Enable" : "Disable"}
                </div>
              </div>
            </div>

            
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need an Slash Conditions Need to Capture"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="isSlashConditionsNeedToCapture">
                  <Switch className="switch" />
                </Form.Item>
                <div
                  className={`mx-2 text-${
                    list?.response?.isSlashConditionsNeedToCapture
                      ? "info"
                      : "danger"
                  }`}
                >
                  {list?.response?.isSlashConditionsNeedToCapture
                    ? "Enable"
                    : "Disable"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <div>
                {
                  "Do you need an Calculate Combo Including Past Medical History"
                }
              </div>
              <div className="d-flex justify-content-between">
                <Form.Item name="calculateComboIncludingPastMedicalHistory">
                  <Switch className="switch" />
                </Form.Item>
                <div
                  className={`mx-2 text-${
                    list?.response?.calculateComboIncludingPastMedicalHistory
                      ? "info"
                      : "danger"
                  }`}
                >
                  {list?.response?.calculateComboIncludingPastMedicalHistory
                    ? "Enable"
                    : "Disable"}
                </div>
              </div>
            </div>

           
             <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need to consider ESRD conditions as HCC conditions"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="isDownCodeConversionEnabled">
                  <Switch className="switch" />
                </Form.Item>
                <div
                  className={`mx-2 text-${
                    list?.response?.isDownCodeConversionEnabled
                      ? "info"
                      : "danger"
                  }`}
                >
                  {list?.response?.isDownCodeConversionEnabled
                    ? "Enable"
                    : "Disable"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need to enable/disable active headers"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="isDownCodeConversionEnabled">
                  <Switch className="switch" />
                </Form.Item>
                <div
                  className={`mx-2 text-${
                    list?.response?.isDownCodeConversionEnabled
                      ? "info"
                      : "danger"
                  }`}
                >
                  {list?.response?.isDownCodeConversionEnabled
                    ? "Enable"
                    : "Disable"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end p-3">
          <RegularButton
            type={"outline"}
            name={"Restore Changes"}
            onClick={() => console.log("Restore Changes")}
          />
          <RegularButton name={"Save Changes"} onClick={handleSubmit()} />
        </div>
      </Form>
    </>
  );
};
const enhancer = connect((state) => ({
  list: state?.tenantAdmin?.codingGuidelines?.data,
}), {
  getCodingDetails: codingGuidelinesActions.codingGuidelinesAction,
  updateSettings: configurationActions.updateSettingsAction,
});
export default enhancer(MedicalCoding);
