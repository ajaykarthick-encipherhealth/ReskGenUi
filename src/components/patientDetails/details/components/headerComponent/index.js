import React from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import styles from "../fileDetails/styles.module.css";
import Details from "../fileDetails/fileDetails";
import Flag from "./flag";
import Codes from "../fileDetails/codes";
import { Select } from "antd";
import StatusAction from "../statusAction";

const HeaderComponent = ({
  fileResult,
  patienIdDetails,
  patientDetails,
  flagsDetailsResult,
  hccCounts,
  hccValidCount,
  dosOnChange,
  setSelectDosValue,
  getSelectedDos,
  dosYearDefalutSelect,
  isLoadingDos,
  dosYear,
  setCopied,
}) => {
  return (
    <div id="hcc-header-container" name="hcc-header-container" className={`row mt-3 ${styles.HccContainer}`}>
      <div id="hcc-header" name="hcc-header" className="col-5" style={{ padding: "0px" }}>
        <Details fileResult={patienIdDetails} fromHcc={true} setCopied = {setCopied}/>
      </div>
      <div className="col-3" style={{ padding: "0px" }} id="flag-details" name="flag-details">
        <Flag 
          patienIdDetails={patienIdDetails}
          patientDetails={patientDetails}
          flagsDetailsResult={flagsDetailsResult}
        />
      </div>
      <div className="col-2" style={{ padding: "0px" }}>
        <Codes
          hccCounts={hccCounts}
          hccValidCount={hccValidCount}
          fromHcc={true}
        />
      </div>
      <div className="col-1 d-grid " style={{ padding: "0px" }}>
        <div id="status-action-container" name="status-action-container">
          <StatusAction />
        </div>
        <div className="mt-1" id="year-select" name="year-select">
          {!isLoadingDos ? (
            <>
              <Select
              data-testid="year-select-test"
              name="year-select-test"
                placeholder="Year"
                value={dosYearDefalutSelect}
                onChange={(e) => {
                  dosOnChange(e);
                  setSelectDosValue("");
                  getSelectedDos("");
                }}
                className={`w-100 custom_select_type ${visitStyles.custom_select_type}`}
                options={dosYear}
                style={{
                  backgroundColor: "#F3F3FF",
                  width: "100% !important",
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
