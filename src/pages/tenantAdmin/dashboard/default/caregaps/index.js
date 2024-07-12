import React, { useState, useEffect } from "react";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import { connect } from "react-redux";
import { Empty, Spin } from "antd";
import { Skeleton } from "antd";
import {
  HccCodes,
  RafCounts,
  getAllRafScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";

const index = ({
  getAllHccCodes,
  getAllRaf,
  getAllRafScoreData,
  selectedValue,
  totalCodesLoader,
  revenueChartLoader,
  rafScorechartLoader,
}) => {
  const suggestedHccDiseaseCountMap =
    getAllHccCodes?.suggestedHccDiseaseCountMap
      ? Object.values(getAllHccCodes.suggestedHccDiseaseCountMap)
      : [];

  const premiumByDateForSuggested = getAllRaf?.premiumByDateForSuggested
    ? Object.values(getAllRaf.premiumByDateForSuggested)
    : [];

  const rafScoreByDateForSuggested =
    getAllRafScoreData?.rafScoreByDateForSuggested
      ? Object.values(getAllRafScoreData.rafScoreByDateForSuggested)
      : [];

  console.log(getAllRafScoreData?.rafScoreByDateForSuggested, "SELVA");
  return (
    <div className="d-flex justify-content-between">
      <div className="remianingLineGraph" style={{ width: "33%" }}>
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={styles.header}>Care Gap Codes</div>
            <div>
              <div className={styles.header}>Total Codes</div>
              <div className={styles.price}>
                {getAllHccCodes?.suggestedCount || 0}
              </div>
            </div>
          </div>
        </div>

        {totalCodesLoader ? (
          <div>
            <Skeleton.Input
              className="w-100"
              style={{ height: "288px" }}
              active
            />
          </div>
        ) : suggestedHccDiseaseCountMap?.length > 0 ? (
          <div className="totalCodesPies">
            <CodesGraph
              gradientColor1={"#FF9209"}
              gradientColor2={"#FFFDFA"}
              borderColor={"#FF9209"}
              isCargaps={true}
              selectedValue={selectedValue}
              className="codesGraphStyle1"
            />
          </div>
        ) : (
          <Empty className="mt-3" />
        )}
      </div>
      <div
        className=""
        style={{
          width: "33%",
          backgroundColor: "#E2F1F3",
          borderRadius: "16px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-2`}>RAF</div>
            <div className="p-2">
              <div className={styles.header}>Overall RAF</div>
              <div className={styles.price}>
                {getAllRafScoreData?.totalSuggestedRaf || 0}
              </div>
            </div>
          </div>
        </div>
        {rafScorechartLoader ? (
          <div>
            <Skeleton.Input
              className="w-100"
              style={{ height: "288px" }}
              active
            />
          </div>
        ) : rafScoreByDateForSuggested?.length > 0 ? (
          <div>
            <RafGraph
              rafColor={"#4AA1AB"}
              isCargaps={true}
              selectedValue={selectedValue}
            />
          </div>
        ) : (
          <Empty className="mt-3" />
        )}
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#DAE0FC",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-1`}>Revenue</div>
            <div className="p-1">
              <div className={styles.header}>Overall Revenue</div>
              <div className={styles.price}>
                {`$ ${getAllRaf?.totalSuggestedRafScore || 0} `}
              </div>
            </div>
          </div>
        </div>

        {revenueChartLoader ? (
          <div>
            <Skeleton.Input
              className="w-100"
              style={{ height: "288px" }}
              active
            />
          </div>
        ) : premiumByDateForSuggested?.length > 0 ? (
          <div className="totalCodesPies">
            <div className="totalCodesPies2">
              <RevenueGraph
                isCargaps={true}
                cargapColor="#5A75F2"
                selectedValue={selectedValue}
                className="revenueCharts3"
              />
            </div>
          </div>
        ) : (
          <Empty className="mt-3" />
        )}
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    rafScorechartLoader:
      state?.tenantAdmin?.dashboard?.default?.allRafScore?.loading,
    getAllRafScoreData:
      state?.tenantAdmin?.dashboard?.default?.allRafScoreData?.data?.response,
    totalCodesLoader:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.loading,
    revenueChartLoader:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.loading,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: getAllRafScore,
  }
);

export default enhancer(index);
