import React from "react";
import Style from "./../../style.module.css";
import { DatePicker, Input, Select } from "antd";
import { disablePastDate } from "../../../../../components/headerFilters/functions";
import RegularButton from "../../../../../components/button";

const FileProcessingConfig = () => {
  return (
    <>
      <div className="p-3" style={{ height: "80vh" }}>
        <div className={Style.title}>File Processing Configuration</div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>File Processing Scope</div>
          </div>
          <div>
            <Select
              placeholder="Prospective"
              options={[]}
              className={Style.selector}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Processing Type</div>
          </div>
          <div>
            <Select
              placeholder="Year"
              options={[]}
              className={Style.selector}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Rules Following Year</div>
          </div>
          <div>
            <Select
              placeholder="Rule"
              options={[]}
              className={Style.selector}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <div className={Style.heading}>Processing Years</div>
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

export default FileProcessingConfig;
