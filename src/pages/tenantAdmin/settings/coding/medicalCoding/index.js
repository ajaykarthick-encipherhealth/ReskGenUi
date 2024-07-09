import React, { useEffect } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Form, Switch } from "antd";
import { connect, useSelector } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { getResponePopup } from "../../../../../utils/reusable";

const MedicalCoding = ({ getCodingDetails, updateSettings,list }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    getCodingDetails({ type: "CODING" });
  }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        isOIGCodeNeeded: list?.response?.isOIGCodeNeeded,
        // captureHistoryCodes: list?.response?.captureHistoryCodes,
        // captureHistoryCodesAsIcdCodes:
        //   list?.response?.captureHistoryCodesAsIcdCodes,
        considerESRDAsHcc: list?.response?.considerESRDAsHcc,
        activeHeadersEnabled: list?.response?.activeHeadersEnabled,
        isSlashConditionsNeedToCapture:
          list?.response?.isSlashConditionsNeedToCapture,
        calculateComboIncludingPastMedicalHistory:
          list.response?.calculateComboIncludingPastMedicalHistory,
        // isDownCodeConversionEnabled: list.response?.isDownCodeConversionEnabled,
      });
    }
  }, [list]);

  const onChange = (value, values) => {
    console.log(values);
    form.setFieldsValue(values);
  };
  const handleSubmit = async(values) => {
    try {
      const res = await updateSettings(values);
      if (res?.status == "SUCCESS") {
        getResponePopup(res)
      }
    } catch (error) {
      console.log(error);
    }
   
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
                <Form.Item name="considerESRDAsHcc">
                  <Switch className="switch" />
                </Form.Item>
                <div
                  className={`mx-2 text-${
                    list?.response?.considerESRDAsHcc
                      ? "info"
                      : "danger"
                  }`}
                >
                  {list?.response?.considerESRDAsHcc
                    ? "Enable"
                    : "Disable"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need to enable/disable active headers"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="activeHeadersEnabled">
                  <Switch className="switch" />
                </Form.Item>
                <div
                  className={`mx-2 text-${
                    list?.response?.activeHeadersEnabled
                      ? "info"
                      : "danger"
                  }`}
                >
                  {list?.response?.activeHeadersEnabled
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
          <RegularButton name={"Save Changes"} onClick={handleSubmit} />
        </div>
      </Form>
    </>
  );
};
const enhancer = connect((state) => ({
  list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
}), {
  getCodingDetails: settingActions.codingGuidelinesAction,
  updateSettings: settingActions.updateMedical,
});
export default enhancer(MedicalCoding);
