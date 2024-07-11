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
  className,
  selectedOrganization,
}) => {
  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc
    ? Object.values(getAllRaf.premiumByDateForHcc)
    : [];

  const premiumByDateForSuggested = getAllRaf?.premiumByDateForSuggested
    ? Object.values(getAllRaf.premiumByDateForSuggested)
    : [];

    let combinedData = premiumByDateForHcc.map((value, index) => value + premiumByDateForSuggested[index]);

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
        name: isHcc ? "Hcc Codes" : isCargaps ? "Car Gap Codes" : "Total Codes",
        type: "line",
        step: "start",
        data: isHcc
          ? premiumByDateForHcc
          : isCargaps
          ? premiumByDateForSuggested
          : combinedData, //REVEN Total Codes
        itemStyle: {
          color: isHcc ? "#02BBDE" : isCargaps ? "#5A75F2" : "#E88D67",
        },
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
        name: "Care Gap Codes",
        type: "line",
        step: "end",
        data: isMultiple ? premiumByDateForSuggested : [],
        itemStyle: {
          color: "#FF9209",
        },
      },
    ],
  };

  return (
    <div className={`${className}`}>
      <ReactECharts option={option} />{" "}
    </div>
  );
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
