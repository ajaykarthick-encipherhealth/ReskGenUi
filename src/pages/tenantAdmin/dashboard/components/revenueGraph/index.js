import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import {
  getLast30Days,
  getLast7Days,
  formatValues,
} from "../../../../../utils/reusable.js";

const RevenueGraph = ({
  getAllRaf,
  isHcc,
  isCargaps,
  selectedValue,
  isMultiple,
  className,
  customDate,
}) => {
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();
  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc;

  const resultArrayHCC = formatValues(premiumByDateForHcc, dates);
  const premiumByDateForSuggested = getAllRaf?.premiumByDateForSuggested;
  const resultArrayCaregaps = formatValues(premiumByDateForSuggested, dates);
  const totalCodes = resultArrayHCC.map((num, index) => num + resultArrayCaregaps[index]);


  const option = {
    tooltip: {
      show: true,
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
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
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
    },
    series: [
      {
        name: isHcc
          ? "Hcc Codes"
          : isCargaps
          ? "Care Gap Codes"
          : "Total Codes",
        type: "line",
        step: "start",
        data: isHcc ? resultArrayHCC : isCargaps ? resultArrayCaregaps : totalCodes,
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

        data: isMultiple ? resultArrayHCC : [""],

        itemStyle: {
          color: "#04B700",
        },
      },
      {
        name: "Care Gap Codes",
        type: "line",
        step: "end",
        data: isMultiple ? resultArrayCaregaps : [""],
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
    revenueChartLoader:
      state?.tenantAdmin?.dashboard?.default?.revenueChartLoader,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
  }
);
export default enhancer(RevenueGraph);
