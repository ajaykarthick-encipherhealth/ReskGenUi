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

const MeatConfig = () => {
  return (
    <div className="p-3">
      <div>
        <h3>Combo Configuration</h3>
      </div>
      <div>
        <div>
          <Form id={"chart-audit"}>
            <div className="d-flex ">
              <div className=" p-3" style={{ width: "35%" }}>
                <div>
                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <div className={Style.heading}>Conflict Proxy </div>
                    </div>
                    <div>
                      <Form.Item name="test1">
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

export default MeatConfig;
