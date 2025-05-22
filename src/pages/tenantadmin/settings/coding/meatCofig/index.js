import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Form, Switch } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { getResponePopup } from "../../../../../utils/reusable";

const MeatConfig = ({ getCodingDetails, updateSettings, list }) => {
  const [form] = Form.useForm();
  const [medical, setMedical] = useState({
    considerAssessmentHeaderAsMEAT: false,
    suggestAssessmentHeaderMEAT: false,
  });

  // useEffect(() => {
  //   getCodingDetails({ type: "MEAT" });
  // }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        considerAssessmentHeaderAsMEAT:
          list.response?.meatConfig?.considerAssessmentHeaderAsMEAT,
        suggestAssessmentHeaderMEAT:
          list.response?.meatConfig?.suggestAssessmentHeaderMEAT,
      });
      setMedical({
        considerAssessmentHeaderAsMEAT:
          list.response?.meatConfig?.considerAssessmentHeaderAsMEAT,
        suggestAssessmentHeaderMEAT:
          list.response?.meatConfig?.suggestAssessmentHeaderMEAT,
      });
    }
  }, [list]);

  const onChange = (changedValues, allValues) => {
    setMedical(allValues);
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const payload = {
      type: "MEAT",
      meatConfig: {
        considerAssessmentHeaderAsMEAT:
          values.considerAssessmentHeaderAsMEAT || false,
        suggestAssessmentHeaderMEAT:
          values.suggestAssessmentHeaderMEAT || false,
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
                  <div>Consider Assessment Header as MEAT</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item
                      name="considerAssessmentHeaderAsMEAT"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical.considerAssessmentHeaderAsMEAT
                        ? "Enable"
                        : "Disable"}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <div>Suggest Assessment Header MEAT</div>
                  <div className="d-flex justify-content-between">
                    <Form.Item
                      name="suggestAssessmentHeaderMEAT"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <div className={`m-2`}>
                      {medical.suggestAssessmentHeaderMEAT
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
            style={{ marginTop: "32pc" }}
          >
            <RegularButton
              type="outline"
              name="Restore"
            />
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

export default enhancer(MeatConfig);
