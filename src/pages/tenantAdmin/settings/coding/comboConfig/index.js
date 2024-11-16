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
    calculateComboIncludingPastMedicalHistory: false,
    enableIndirectCode: false,
    directCombinationAddonRegex: false
  });

  useEffect(() => {
    getCodingDetails({ type: "COMBO" });
  }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        calculateComboIncludingPastMedicalHistory:
          list.response.calculateComboIncludingPastMedicalHistory,
        enableIndirectCode: list.response.enableIndirectCode,
        directCombinationAddonRegex: list.response.directCombinationAddonRegex,
      });
      setMedical({
        calculateComboIncludingPastMedicalHistory:
          list.response.calculateComboIncludingPastMedicalHistory,
        enableIndirectCode: list.response.enableIndirectCode,
        directCombinationAddonRegex: list.response.directCombinationAddonRegex
      });
    }
  }, [list]);

  const onChange = (changedValues, allValues) => {
    setMedical(allValues);
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const payload = {
      type: "COMBO",
      comboConfig: {
        calculateComboIncludingPastMedicalHistory:
          values.calculateComboIncludingPastMedicalHistory || false,
        enableIndirectCode: values.enableIndirectCode || false,
        directCombinationAddonRegex:
          values.directCombinationAddonRegex || false,
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
                <div className={Style.title}>Meat Configuration</div>
              </div>
              <div className="mt-4">
                <div className="d-flex justify-content-between mt-1">
                  <div>Find Combo from PMH</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item
                      name="calculateComboIncludingPastMedicalHistory"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical.calculateComboIncludingPastMedicalHistory
                        ? "Enable"
                        : "Disable"}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <div> Find Indirect Combo Codes</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item
                      name="enableIndirectCode"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical.enableIndirectCode ? "Enable" : "Disable"}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <div> Add on Direct Combo Codes</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item
                      name="directCombinationAddonRegex"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical.directCombinationAddonRegex
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
            style={{ marginTop: "28pc" }}
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

export default enhancer(ComboConfig);
