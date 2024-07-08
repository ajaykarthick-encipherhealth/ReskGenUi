import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
} from "../../../../../stores/tenantAdmin/default/action.js";

const CodesGraph = ({
  options,
  borderColor,
  gradientColor1,
  gradientColor2,
  isTwoWaves,
  borderColor2,
  isCargaps,
  isHcc,
  isRadio,
  isRevenue,
  getAllRafData,
  getAllHccCodes,
  getAllHccCodesData,
  getAllRaf,
  chartData,
}) => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [currChartData, setCurrChartData] = useState(new Map());

  useEffect(() => {
    setCurrChartData(new Map());
  }, [chartData]);

  useEffect(() => {
    setCurrChartData(chartData);
  }, [currChartData, isCargaps]);

  useEffect(() => {
    getAllHccCodesData(dateRange.startDate, dateRange.endDate);
    getAllRafData(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const hccDiseaseCountValues = getAllHccCodes?.hccDiseaseCountMap
    ? Object.values(getAllHccCodes.hccDiseaseCountMap)
    : [];

  const suggestedHccDiseaseCountMap =
    getAllHccCodes?.suggestedHccDiseaseCountMap
      ? Object.values(getAllHccCodes.suggestedHccDiseaseCountMap)
      : [];
  const graphOptions = {
    xAxis: {
      type: "category",
      data:
        isHcc || isCargaps
          ? [...currChartData.keys()]
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
      show: true,
    },
    tooltip: {
      show: true,
      trigger: "axis",
      //   formatter: function (params) {
      //     const dataIndex = params[0]?.dataIndex;
      //     const allocatedValue = allocatedValues[dataIndex];
      //     const auditedValue = auditedValues[dataIndex];
      //     return `Allocated: ${auditedValue}<br/>Completed: ${allocatedValue}`;
      //   },
    },

    series: [
      {
        name: isCargaps
          ? "Car Gap Codes"
          : isHcc
          ? "HCC Codes"
          : isRevenue
          ? "Revenue"
          : isTwoWaves && "Radiology",
        data:
          isHcc || isCargaps
            ? [...chartData.keys()].length == 12
              ? hccDiseaseCountValues
              : [...chartData.values()]
            : isCargaps
            ? suggestedHccDiseaseCountMap
            : [12, 32, 45, 10, 20, 30, 40, 50, 60, 70, 12, 44, 56, 67, 34, 23],
        type: "line",
        lineStyle: { color: borderColor },
        smooth: true,
        showSymbol: false,
        areaStyle: gradientColor1 &&
          gradientColor2 && {
            opacity: 0.5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ]),
          },
      },
      {
        name: "Lab",
        data: isTwoWaves && [10, 30, 16, 33, 13, 78, 6, 76, 65, 23, 11, 56],
        type: "line",
        lineStyle: { color: borderColor2 },
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return <ReactECharts option={options ? options : graphOptions} />;
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.tenantAdmindefault?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.tenantAdmindefault?.allRafCounts?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
  }
);

export default enhancer(CodesGraph);
