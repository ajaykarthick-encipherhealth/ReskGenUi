import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Form, Switch } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { getResponePopup } from "../../../../../utils/reusable";

const ComboConfig = ({ getCodingDetails, updateSettings, list }) => {
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
        addOnDirectComboCodes:
          list?.response?.addOnDirectComboCodes,
        calculateComboIncludingPastMedicalHistory:
          list.response?.calculateComboIncludingPastMedicalHistory,
      });
      setMedical({
        findComboFromPMH: list?.response?.findComboFromPMH,
        considerESRDAsHcc: list?.response?.considerESRDAsHcc,
        indirectComboCodes: list?.response?.indirectComboCodes,
        addOnDirectComboCodes:
          list?.response?.addOnDirectComboCodes,
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
    <>
      <Form
        id={"chart-audit"}
        onFinish={handleSubmit}
        form={form}
        onValuesChange={onChange}
      >
        <div className="d-flex flex-column" style={{ height: "100%" }}>
          <div style={{ width: "50%" }}>
            <div className="p-3">
              <div className="d-flex justify-content-between">
                <div className={Style.title}>Combo Configuration</div>
              </div>
              <div className="mt-4">
                <div className="d-flex justify-content-between mt-1">
                  <div>Find Combo From PMH</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item name="findComboFromPMH">
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical?.findComboFromPMH ? "Enable" : "Disable"}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <div>Indirect Combo Codes</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item name="indirectComboCodes">
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical?.indirectComboCodes ? "Enable" : "Disable"}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-1">
                  <div>Add on Direct Combo Codes</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item name="addOnDirectComboCodes">
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical?.addOnDirectComboCodes ? "Enable" : "Disable"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div
            className="d-flex justify-content-end p-2"
            style={{ marginTop: "25pc" }}
          >
            <RegularButton
              type={"outline"}
              name={"Restore"}
              onClick={() => console.log("Restore")}
            />
            <RegularButton name={"Save"} onClick={handleSubmit} />
          </div> */}
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
export default enhancer(ComboConfig);
