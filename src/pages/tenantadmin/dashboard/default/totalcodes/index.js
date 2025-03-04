import React, { useEffect } from "react";
import { connect } from "react-redux";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import * as echarts from "echarts";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import { Tooltip } from "antd";
import {
  HccCodes,
  RafCounts,
  getAllRafScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { Skeleton } from "antd";
import {
  getLast30Days,
  getLast7Days,
  formatNumber,
  formatValues,
} from "../../../../../utils/reusable.js";

const index = ({
  getAllHccCodesData,
  getAllHccCodes,
  getAllRaf,
  getAllRafScoreData,
  dateRange,
  totalCodesLoader,
  getAllRafData,
  getAllRafScore,
  selectedOrganization,
  selectedValue,
  revenueChartLoader,
  rafScorechartLoader,
  customDate,
  selectDos,
}) => {
  const hccDiseaseCountValues = getAllHccCodes?.hccDiseaseCountMap;
  const potentialDiseaseCountValues =
    getAllHccCodes?.potentialHccDiseaseCountMap;

  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();
  const resultArrayHCC = formatValues(hccDiseaseCountValues, dates);
  const resultArrayPotential = formatValues(potentialDiseaseCountValues, dates);

  const suggestedHccDiseaseCountMap =
    getAllHccCodes?.suggestedHccDiseaseCountMap;
  const resultArrayCaregaps = formatValues(suggestedHccDiseaseCountMap, dates);
  // const hccDiseaseCountValue = getAllHccCodes?.hccDiseaseCountMap
  //   ? Object.values(getAllHccCodes.hccDiseaseCountMap)
  //   : [];

  // const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc
  //   ? Object.values(getAllRaf.premiumByDateForHcc)
  //   : [];

  // const rafScoreByDateForSuggested =
  //   getAllRafScoreData?.rafScoreByDateForSuggested
  //     ? Object.values(getAllRafScoreData.rafScoreByDateForSuggested)
  //     : [];

  const totalCodes = resultArrayHCC.map(
    (num, index) =>
      num + resultArrayCaregaps[index] + resultArrayPotential[index]
  );

  useEffect(() => {
    getAllHccCodesData(
      dateRange?.startDate,
      dateRange?.endDate,
      selectedOrganization,
      selectDos
    );
    getAllRafScore(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization,
      selectDos
    );
  }, [dateRange, selectedOrganization, selectDos]);

  useEffect(() => {
    getAllRafData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization,
      selectDos
    );
  }, [dateRange, selectedOrganization, selectDos]);

  const options = {
    xAxis: {
      type: "category",
      data:
        selectedValue === "custom"
          ? customDate
          : selectedValue === "last_1_week"
          ? getLast7Days()
          : getLast30Days(),
    },
    yAxis: {
      type: "value",
      show: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Total Codes",
        data: totalCodes,
        color: "#E88D67",
        type: "line",
        lineStyle: { color: "#0095C2" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#FAFFFA" },
            { offset: 1, color: "#84B5FB" },
          ]),
        },
        itemStyle: {
          color: "#0095C2",
        },
      },
      {
        name: "HCC Codes",
        data: resultArrayHCC,
        type: "line",
        lineStyle: { color: "#04B700" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#04B700" },
            { offset: 1, color: "#FAFFFA" },
          ]),
        },
        itemStyle: {
          color: "#04B700",
        },
      },
      {
        name: "Potential Diagnosis Codes",
        data: resultArrayPotential,
        type: "line",
        lineStyle: { color: "#BEB531" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#BEB531" },
            { offset: 1, color: "#FAFFFA" },
          ]),
        },
        itemStyle: {
          color: "#BEB531",
        },
      },
      {
        name: "Care Gap Codes",
        data: resultArrayCaregaps,
        type: "line",
        lineStyle: { color: "#FF9209" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#FF9209" },
            { offset: 1, color: "#FFFDFA" },
          ]),
        },
        itemStyle: {
          color: "#FF9209",
        },
      },
    ],
  };
  const bullets = [
    {
      title: "Total Codes",
      color: "#0095C2",
    },
    {
      title: "HCC Codes",
      color: "#04B700",
    },
    {
      title: "Care Gap Codes",
      color: "#FF9209",
    },
    {
      title: "Potential Diagnosis Codes",
      color: "#beb531",
    },
  ];

  const totalHccRafScore = getAllRaf?.totalHccRafScore || 0;
  const totalSuggestedRafScore = getAllRaf?.totalSuggestedRafScore || 0;
  const totalPotentialRafScore = getAllRaf?.totalPotentialRafScore || 0;
  const totalScore = (
    totalHccRafScore +
    totalSuggestedRafScore +
    totalPotentialRafScore
  ).toFixed(2);

  // const hccDiseaseCountMap = getAllRafScoreData?.totalHccRaf || 0;
  const suggestedCount = getAllRafScoreData?.totalSuggestedRaf || 0;
  // const totalScoreTwo = (hccDiseaseCountMap + suggestedCount).toFixed(2);

  const OverAllRevenue = totalScore;

  return (
    <div className="d-flex justify-content-between">
      <div style={{ width: "33%" }}>
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={styles.header}>Total Codes</div>

            <div className="d-flex gap-4">
              <div>
                {bullets?.map((item) => (
                  <div className="d-flex">
                    <div
                      style={{
                        backgroundColor: item?.color,
                        width: "8px",
                        height: "8px",
                        margin: "8px 5px 0 0px",
                      }}
                    ></div>
                    {item?.title}
                  </div>
                ))}
              </div>
              <div>
                <div className={styles.header}>Total Codes</div>
                <div className={styles.price}>
                  <Tooltip
                    title={
                      getAllHccCodes?.totalCount && getAllHccCodes?.totalCount
                    }
                  >
                    {getAllHccCodes?.totalCount
                      ? formatNumber(getAllHccCodes?.totalCount)
                      : 0}
                  </Tooltip>
                </div>
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
        ) : (
          <div className="totalCodesPies">
            <CodesGraph
              options={options}
              isRadio={true}
              className="codesGraphStyle2"
              customDate={customDate}
              selectedValue={selectedValue}
            />
          </div>
        )}
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#EBF3FF",
          borderRadius: "16px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-1`}>RAF</div>
            <div className="p-1">
              <div className={styles.header}>Overall RAF</div>

              <div className={styles.price}>
                {
                  <Tooltip title={suggestedCount && suggestedCount}>
                    {suggestedCount ? formatNumber(suggestedCount) : 0}
                  </Tooltip>
                  // totalScoreTwo
                }
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
        ) : (
          <div className="totalCodesPies2">
            <RafGraph
              overallData={true}
              rafColor={"#0095C2"}
              rafColor3={"#FF9209"}
              rafColor4={"#BEB531"}
              rafColor2={"#00BC13"}
              selectedValue={selectedValue}
              dateRange={dateRange}
              customDate={customDate}
              selectedOrganization={selectedOrganization}
              selectDos={selectDos}
              className="carecapRAF3"
            />
          </div>
        )}
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#FCEEE9",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-1`}>Revenue</div>
            <div className="p-1">
              <div className={styles.header}>Overall Revenue</div>
              <div className={styles.price}>{`$ ${
                formatNumber(OverAllRevenue) || 0
              }`}</div>
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
        ) : (
          <div className="totalCodesPies2">
            <RevenueGraph
              selectedOrganization={selectedOrganization}
              isMultiple={true}
              selectedValue={selectedValue}
              className="revenueCharts1"
              customDate={customDate}
            />
          </div>
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
    rafScorechartLoader: state?.tenantAdmin?.dashboard?.default?.rafScoreLoader,
    getAllRafScoreData:
      state?.tenantAdmin?.dashboard?.default?.allRafScoreData?.data?.response,
    totalCodesLoader: state?.tenantAdmin?.dashboard?.default?.totalHccLoader,
    revenueChartLoader:
      state?.tenantAdmin?.dashboard?.default?.revenueChartLoader,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: getAllRafScore,
  }
);
export default enhancer(index);
