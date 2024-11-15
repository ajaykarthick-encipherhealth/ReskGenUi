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
import { getResponePopup } from "../../../../../utils/reusable";

const DiagnosticReportConfig = ({ getCodingDetails, updateSettings, list }) => {
  const [form] = Form.useForm();
  const [medical, setMedical] = useState({
    monthCountInRadiology: 0,
    monthCountInLab: 0,
    considerAsValidDiseaseLab: false,
    considerAsValidDiseaseRadiology: false,
    futureDosEnabled: false,
  });

  useEffect(() => {
    getCodingDetails({ type: "DIAGNOSTIC_REPORT" });
  }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        monthCountInRadiology:
          list.response?.diagnosticReportConfig?.monthCountInRadiology,
        monthCountInLab: list.response?.diagnosticReportConfig?.monthCountInLab,
        considerAsValidDiseaseLab:
          list.response?.diagnosticReportConfig?.considerAsValidDiseaseLab,
        considerAsValidDiseaseRadiology:
          list.response?.diagnosticReportConfig?.considerAsValidDiseaseRadiology,
        futureDosEnabled: list.response?.diagnosticReportConfig?.futureDosEnabled,
      });
      setMedical({
        monthCountInRadiology:
          list?.response?.diagnosticReportConfig?.monthCountInRadiology,
        monthCountInLab: list?.response?.diagnosticReportConfig?.monthCountInLab,
        considerAsValidDiseaseLab:
          list?.response?.diagnosticReportConfig?.considerAsValidDiseaseLab,
        considerAsValidDiseaseRadiology:
          list?.response?.diagnosticReportConfig?.considerAsValidDiseaseRadiology,
        futureDosEnabled: list?.response?.diagnosticReportConfig?.futureDosEnabled,
      });
    }
  }, [list]);

  const onChange = (changedValues, allValues) => {
    setMedical(allValues);
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const payload = {
      type: "DIAGNOSTIC_REPORT",
      diagnosticReportConfig: {
        monthCountInRadiology: values.monthCountInRadiology || 0,
        monthCountInLab: values.monthCountInLab || 0,
        considerAsValidDiseaseLab: values.considerAsValidDiseaseLab || false,
        considerAsValidDiseaseRadiology:
          values.considerAsValidDiseaseRadiology || false,
        futureDosEnabled: values.futureDosEnabled || false,
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
    <div className="p-3">
      <h3>Diagnostic Report Configuration</h3>
      <Form
        id="chart-audit"
        onFinish={handleSubmit}
        form={form}
        onValuesChange={onChange}
      >
        <div className="d-flex">
          <div className="p-3" style={{ width: "35%" }}>
            <h4>Radiology</h4>
            <div className="d-flex justify-content-between mt-4">
              <div className={Style.heading}>Month Count in Radiology</div>
              <Form.Item name="monthCountInRadiology">
                <InputNumber
                  type="number"
                  size="large"
                  placeholder="Radiology Count"
                  style={{ width: "150px", fontSize: "14px" }}
                />
              </Form.Item>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <div className={Style.heading}>Consider as Valid Radiology</div>
              <div className="d-flex justify-content-between">
                <Form.Item
                  name="considerAsValidDiseaseRadiology"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <div className="m-1">
                  {medical.considerAsValidDiseaseRadiology
                    ? "Enable"
                    : "Disable"}
                </div>
              </div>
            </div>
          </div>
          <div
            className="p-3 d-flex align-items-center"
            style={{ width: "3%" }}
          >
            {" "}
            <Divider
              type="vertical"
              style={{ height: "100%", borderColor: "#d9d9d9" }}
            />
          </div>

          <div className="p-3" style={{ width: "35%" }}>
            <h4>Lab</h4>
            <div className="d-flex justify-content-between mt-4">
              <div className={Style.heading}>Month Count in Lab</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="monthCountInLab">
                  <InputNumber
                    type="number"
                    size="large"
                    placeholder="Lab Count"
                    style={{ width: "150px", fontSize: "14px" }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <div className={Style.heading}>Consider as Valid Lab</div>
              <div className="d-flex justify-content-between">
                <Form.Item
                  name="considerAsValidDiseaseLab"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <div className="m-1">
                  {medical.considerAsValidDiseaseLab ? "Enable" : "Disable"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <div className={Style.heading}>Future DOS</div>
              <div className="d-flex justify-content-between">
                <Form.Item name="futureDosEnabled" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <div className="m-1">
                  {medical.futureDosEnabled ? "Enable" : "Disable"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <RegularButton
            type="outline"
            name="Restore"
            onClick={() => getCodingDetails({ type: "DIAGNOSTIC_REPORT" })}
          />
          <RegularButton name="Save" onClick={handleSubmit} />
        </div>
      </Form>
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
