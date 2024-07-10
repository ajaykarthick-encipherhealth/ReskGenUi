import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { getLast30Days, getLast7Days } from "../../../../../utils/reusable.js";

const RevenueGraph = ({
  hccColor,
  cargapColor,
  getAllRaf,
  isHcc,
  isCargaps,
  selectedValue,
}) => {
 

  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc
    ? Object.values(getAllRaf.premiumByDateForHcc)
    : [];

  const premiumByDateForSuggested = getAllRaf?.premiumByDateForSuggested
    ? Object.values(getAllRaf.premiumByDateForSuggested)
    : [];

  const combinedData =
    isHcc && isCargaps
      ? [...premiumByDateForHcc, ...premiumByDateForSuggested]
      : [];
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      show: false,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: selectedValue === "last_1_week" ? getLast7Days() : getLast30Days(),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Total Codes",
        type: "line",
        step: "start",
        data: [],
        itemStyle: {
          color: hccColor ? hccColor : cargapColor ? cargapColor : "#E88D67",
        },
      },
      {
        name: "HCC Codes",
        type: "line",
        step: "middle",
        data: premiumByDateForHcc,
        itemStyle: {
          color: "#04B700",
        },
      },
      {
        name: "Car gap Codes",
        type: "line",
        step: "end",
        data: premiumByDateForSuggested,
        itemStyle: {
          color: "#FF9209",
        },
      },
    ],
  };



  return <ReactECharts option={option} />;
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
  }
);
export default enhancer(RevenueGraph);
