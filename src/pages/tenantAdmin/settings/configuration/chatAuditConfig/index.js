import React from "react";
import Style from "./../../style.module.css";
import { DatePicker, Input } from "antd";
import { disablePastDate } from "../../../../../components/headerFilters/functions";
import RegularButton from "../../../../../components/button";


const ChatAuditConfig = () => {

  return (
    <>
      <div className="p-3" style={{height:"80vh"}}>
        <div className={Style.title}>Chat Audit Configuration</div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Max hold count</div>
            <div className={Style.subHeading}>
              Upon reaching a maximum hold count of 4, conclude the current
              chart and seamlessly transition to the next
            </div>
          </div>
          <div>
            <Input
              type="number"
              size="large"
              placeholder="Hold Count"
              style={{ width: "150px", fontSize: "14px" }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Max allocation count</div>
            <div className={Style.subHeading}>
              Allocate a maximum of 1000 charts for a single day
            </div>
          </div>
          <div>
            <Input
              type="number"
              size="large"
              placeholder="Max Count"
              style={{ width: "150px", fontSize: "14px" }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Max pending count</div>
            <div className={Style.subHeading}>
              The maximum number of pending chart counts for a single day is 20
            </div>
          </div>
          <div>
            <Input
              type="number"
              size="large"
              placeholder="Max Count"
              style={{ width: "150px", fontSize: "14px" }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Prioritize chart based on</div>
            <div className={Style.subHeading}>
              Chart priority is determined by due date or RAF score
            </div>
          </div>
          <div>
            <DatePicker
              className={Style.picker}
              onChange={(date, dateS) => {
                // if (dateS) {
                //   setAllocateDate(dateS);
                // } else {
                //   setAllocateDate("");
                // }
              }}
              disabledDate={(current) => disablePastDate(current)}
            />
          </div>
        </div>
      </div>
      <div className="text-end p-3">
          <RegularButton
            type={"outline"}
            name={"Restore Changes"}
            onClick={() => console.log("Restore Changes")}
          />
          <RegularButton
            name={"Save Changes"}
            onClick={() => console.log("Save Changes")}
          />
        </div>
    </>
  );
};

export default ChatAuditConfig;
