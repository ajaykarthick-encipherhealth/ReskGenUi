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
import React from "react";
import Style from "./../../style.module.css";
import RegularButton from "../../../../../components/button";
import ButtonStyles from "../../../../../components/button/style.module.css";

const DiagnosticReportConfig = () => {
  return (
    <div className="p-3">
      <div>
        <h3>Diagnostic Report Configuration</h3>
      </div>
      <div>
        <div>
          <Form id={"chart-audit"}>
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
                    <div>
                      <Form.Item name="test">
                        <Switch />
                      </Form.Item>
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
                    <div>
                      <Form.Item name="test3">
                        <Switch />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <div className={Style.heading}>Future DOS </div>
                    </div>
                    <div>
                      <Form.Item name="test2">
                        <Switch />
                      </Form.Item>
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

export default DiagnosticReportConfig;
