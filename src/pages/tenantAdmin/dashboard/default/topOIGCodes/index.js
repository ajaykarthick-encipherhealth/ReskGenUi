import React from "react";
import ReusableTable from "../../components/table";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../../stores/tenantAdmin/dashboard/default";
import { useEffect } from "react";

const index = ({ getTopOigCodesData, top0ijHccCodes }) => {
  useEffect(() => {
    getTopOigCodesData();
  }, []);

  return (
    <>
      <div>
        <span style={{ fontSize: "18px", fontWeight: "600" }}>
          Top 10 OIG Codes
        </span>
        <span
          style={{
            color: "#1679AB",
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 0 10px",
          }}
        >
          {top0ijHccCodes?.response?.totalCount}
        </span>
      </div>

      <ReusableTable items={top0ijHccCodes?.response?.topDiseaseDTOList} />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    top0ijHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allTopOigCodes?.data,
  }),
  {
    getTopOigCodesData: allActions?.topOigCodes,
  }
);

export default enhancer(index);
