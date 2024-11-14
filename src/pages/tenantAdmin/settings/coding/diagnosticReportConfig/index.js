import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import React, { useState, useEffect } from "react";
import Style from "./../../style.module.css";
import RegularButton from "../../../../../components/button";
import ButtonStyles from "../../../../../components/button/style.module.css";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { connect } from "react-redux";

const DiagnosticReportConfig = ({ getCodingDetails, updateSettings, list }) => {
  const [form] = Form.useForm();
  const [medical, setMedical] = useState({
    findComboFromPMH: false,
    considerESRDAsHcc: false,
    indirectComboCodes: false,
    addOnDirectComboCodes: false,
    calculateComboIncludingPastMedicalHistory: false,
  });
 useEffect(() => {
   getCodingDetails({ type: "CODING" });
 }, []);

 useEffect(() => {
   if (list?.response) {
     form.setFieldsValue({
       findComboFromPMH: list?.response?.findComboFromPMH,
       considerESRDAsHcc: list?.response?.considerESRDAsHcc,
       indirectComboCodes: list?.response?.indirectComboCodes,
       addOnDirectComboCodes: list?.response?.addOnDirectComboCodes,
       calculateComboIncludingPastMedicalHistory:
         list.response?.calculateComboIncludingPastMedicalHistory,
     });
     setMedical({
       findComboFromPMH: list?.response?.findComboFromPMH,
       considerESRDAsHcc: list?.response?.considerESRDAsHcc,
       indirectComboCodes: list?.response?.indirectComboCodes,
       addOnDirectComboCodes: list?.response?.addOnDirectComboCodes,
       calculateComboIncludingPastMedicalHistory:
         list.response?.calculateComboIncludingPastMedicalHistory,
     });
   }
 }, [list]);

 const onChange = (value, values) => {
   console.log(values);
   setMedical(values);
 };
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
    <div className="p-3">
      <div>
        <h3>Diagnostic Report Configuration</h3>
      </div>
      <div>
        <div>
          <Form
            id={"chart-audit"}
            onFinish={handleSubmit}
            form={form}
            onValuesChange={onChange}
          >
            <div className="d-flex ">
              <div className=" p-3" style={{ width: "35%" }}>
                <h4>Radiology</h4>

                <div>
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <div className={Style.heading}>
                        Month Count in Radiology
                      </div>
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
                      <div className={Style.heading}>
                        Consider as Valid Radiology
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Form.Item name="indirectComboCodes">
                        <Switch />
                      </Form.Item>
                      <div className={`m-1`}>
                        {medical?.indirectComboCodes ? "Enable" : "Disable"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-3 d-flex align-items-center"
                style={{ width: "3%" }}
              >
                <Divider
                  type="vertical"
                  style={{ height: "100%", borderColor: "#d9d9d9" }}
                />
              </div>

              <div className=" p-3" style={{ width: "35%" }}>
                <h4>Lab</h4>

                <div>
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <div className={Style.heading}>Month Count in Lab </div>
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
                      <div className={Style.heading}>Consider as Valid Lab</div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Form.Item name="findComboFromPMH">
                        <Switch />
                      </Form.Item>
                      <div className={`m-1`}>
                        {medical?.findComboFromPMH ? "Enable" : "Disable"}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <div className={Style.heading}>Future DOS </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Form.Item name="considerESRDAsHcc">
                        <Switch />
                      </Form.Item>
                      <div className={`m-1`}>
                        {medical?.considerESRDAsHcc ? "Enable" : "Disable"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>

        <div></div>
      </div>
    </div>
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
export default enhancer(DiagnosticReportConfig);
