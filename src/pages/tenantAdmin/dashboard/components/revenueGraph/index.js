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
  rafColor2,
  rafColor3,
  isMultiple,
  selectedOrganization,
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
        name: isHcc ? "Hcc Codes" : isCargaps ? "Car Gapcodes" : "Total Codes",
        type: "line",
        step: "start",
        data: isHcc
          ? premiumByDateForHcc
          : isCargaps
          ? premiumByDateForSuggested
          : [12, 32, 45, 10, 20, 30, 40, 50, 60, 70, 12, 44, 56, 67, 34, 23],
      },
      {
        name: "HCC Codes",
        type: "line",
        step: "middle",
        emphasis: {
          focus: "series",
        },

        data: isMultiple ? premiumByDateForHcc : [],

        itemStyle: {
          color: "#04B700",
        },
      },
      {
        name: "Car gap Codes",
        type: "line",
        step: "end",
        data: isMultiple ? premiumByDateForSuggested : [],
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
