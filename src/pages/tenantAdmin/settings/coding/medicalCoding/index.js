import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Form, Switch } from "antd";
import { connect, useSelector } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { getResponePopup } from "../../../../../utils/reusable";

const MedicalCoding = ({ getCodingDetails, updateSettings,list }) => {
  const [form] = Form.useForm();
  const [medical, setMedical] = useState({
    isOIGCodeNeeded: false,
    considerESRDAsHcc: false,
    activeHeadersEnabled: false,
    isSlashConditionsNeedToCapture: false,
    calculateComboIncludingPastMedicalHistory: false
  })

  useEffect(() => {
    getCodingDetails({ type: "CODING" });
  }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        isOIGCodeNeeded: list?.response?.isOIGCodeNeeded,
        considerESRDAsHcc: list?.response?.considerESRDAsHcc,
        activeHeadersEnabled: list?.response?.activeHeadersEnabled,
        isSlashConditionsNeedToCapture:
          list?.response?.isSlashConditionsNeedToCapture,
        calculateComboIncludingPastMedicalHistory:
          list.response?.calculateComboIncludingPastMedicalHistory,
      });
      setMedical({
        isOIGCodeNeeded: list?.response?.isOIGCodeNeeded,
        considerESRDAsHcc: list?.response?.considerESRDAsHcc,
        activeHeadersEnabled: list?.response?.activeHeadersEnabled,
        isSlashConditionsNeedToCapture:
          list?.response?.isSlashConditionsNeedToCapture,
        calculateComboIncludingPastMedicalHistory:
          list.response?.calculateComboIncludingPastMedicalHistory,
      });
    }
  }, [list]);

  const onChange = (value, values) => {
    console.log(values);
    setMedical(values);
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
        <div style={{ width: "50%" }}>
        <div className="p-3">
          <div className="d-flex justify-content-between">
            <div className={Style.title}>Medical Coding</div>
          </div>
          <div className="mt-4">
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need an OIG code"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="isOIGCodeNeeded">
                  <Switch />
                </Form.Item>
                <div
                  className={`m-2`}
                >
                  {medical?.isOIGCodeNeeded? "Yes" : "No"}
                </div>
              </div>
            </div>

            
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need an Slash Conditions Need to Capture"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="isSlashConditionsNeedToCapture">
                  <Switch />
                </Form.Item>
                <div
                  className={`m-2`}
                >
                  {medical?.isSlashConditionsNeedToCapture
                    ? "Yes"
                    : "No"}
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
                  <Switch />
                </Form.Item>
                <div
                  className={`m-2`}
                >
                  {medical?.calculateComboIncludingPastMedicalHistory
                    ? "Yes"
                    : "No"}
                </div>
              </div>
            </div>

           
             <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need to consider ESRD conditions as HCC conditions"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="considerESRDAsHcc">
                  <Switch />
                </Form.Item>
                <div
                  className={`m-2`}
                >
                  {medical?.considerESRDAsHcc
                    ? "Yes"
                    : "No"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need to enable/disable active headers"}</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="activeHeadersEnabled">
                  <Switch />
                </Form.Item>
                <div
                  className={`m-2`}
                >
                  {medical?.activeHeadersEnabled
                    ? "Yes"
                    : "No"}
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
        </div></div>
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
