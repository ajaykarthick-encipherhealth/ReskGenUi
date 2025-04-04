import React from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import styles from "../fileDetails/styles.module.css";
import Details from "../fileDetails/fileDetails";
import Flag from "./flag";
import Codes from "../fileDetails/codes";
import { Select } from "antd";
import StatusAction from "../statusAction";
import { connect } from "react-redux";
import PieChart from "./chart";

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
  getFlagCounts,
  setSelectedDate,
}) => {
  return (
    <div className={`row mt-3 ${styles.HccContainer}`}>
      <div className="col-4" style={{ padding: "0px" }}>
        <Details
          fileResult={patienIdDetails}
          fromHcc={true}
          setCopied={setCopied}
        />
      </div>
      <div className="col-4" style={{ padding: "0px" }}>
        <Flag
          patienIdDetails={patienIdDetails}
          patientDetails={patientDetails}
          flagsDetailsResult={flagsDetailsResult}
          getFlagCounts={getFlagCounts}
        />
        {/* <PieChart /> */}
      </div>
      <div className="col-2" style={{ padding: "0px" }}>
        <Codes
          hccCounts={hccCounts}
          hccValidCount={hccValidCount}
          fromHcc={true}
        />
      </div>
      <div className="col-1 d-grid " style={{ padding: "0px" }}>
        <div>
          <StatusAction />
        </div>
        <div className="mt-1">
          {!isLoadingDos ? (
            <>
              <Select
                placeholder="Year"
                value={dosYearDefalutSelect}
                onChange={(e) => {
                  dosOnChange(e);
                  setSelectDosValue("");
                  getSelectedDos("");
                  setSelectedDate(null)
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

const enhancer = connect(
  (state) => ({
    getFlagCounts:
      state?.patientDetails.details?.getFlagChartsList?.data?.response,
  }),
  {}
);

export default enhancer(HeaderComponent);
