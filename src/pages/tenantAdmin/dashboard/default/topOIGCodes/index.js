import React from "react";
import ReusableTable from "../../components/table";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../../stores/tenantAdmin/dashboard/default";
import { useEffect } from "react";
import { Skeleton, Spin } from "antd";

const index = ({
  getTopOigCodesData,
  top0ijHccCodes,
  dateRange,
  selectedOrganization,
  top0ijCodesLoader,
  loaderButton,
}) => {
  useEffect(() => {
    getTopOigCodesData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
  }, [dateRange]);
  
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
      {loaderButton && top0ijCodesLoader ? (
        <div>
          <Skeleton.Input
            className="w-100"
            style={{ height: "460px" }}
            active
          />
        </div>
      ) : top0ijCodesLoader ? (
        <div className="d-flex justify-content-center align-items-center">
          {" "}
          <Spin size="large" />
        </div>
      ) : (
        <ReusableTable items={top0ijHccCodes?.response?.topDiseaseDTOList} />
      )}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    top0ijHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allTopOigCodes?.data,
    top0ijCodesLoader: state?.tenantAdmin?.dashboard?.default?.topTenOigCodes,
  }),
  {
    getTopOigCodesData: allActions?.topOigCodes,
  }
);

export default enhancer(index);
