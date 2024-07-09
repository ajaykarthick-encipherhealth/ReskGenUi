import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";

const RevenueGraph = ({
  isMultiple,
  hccColor,
  cargapColor,
  getAllHccCodesData,
  getAllHccCodes,
  getAllRafData,
  getAllRaf,
  chartRevenData,
  isHcc,
  isCargaps,
}) => {
  const [currChartData, setCurrChartData] = useState(new Map());

  useEffect(() => {
    setCurrChartData(chartRevenData);
  }, [currChartData]);

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
    // title: {
    //   text: "Step Line",
    // },
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
    // toolbox: {
    //   feature: {
    //     saveAsImage: {},
    //   },
    // },
    xAxis: {
      type: "category",
      data:
        isHcc || isCargaps
          ? [...chartRevenData.keys()]
          : [
              "jan",
              "feb",
              "mar",
              "apr",
              "may",
              "jun",
              "jul",
              "aug",
              "sep",
              "oct",
              "nov",
              "dec",
            ],
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

  useEffect(() => {
    getAllHccCodesData();
    getAllRafData();
  }, []);

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
