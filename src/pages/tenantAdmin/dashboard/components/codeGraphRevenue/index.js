import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { getLast30Days, getLast7Days } from "../../../../../utils/reusable.js";

const codeGraphRevenue = ({
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
  getAllHccCodes,
  selectedValue,
}) => {
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
      data: selectedValue === "last_1_week" ? getLast7Days() : getLast30Days(),
    },

    yAxis: {
      type: "value",
      show: true,
    },
   
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
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
        data: isHcc
          ? hccDiseaseCountValues
          : isCargaps
          ? suggestedHccDiseaseCountMap
          : [12, 32, 45, 10, 20, 30, 40, 50, 60, 70, 12, 44, 56, 67, 34, 23],
        type: "line",
        lineStyle: { color: borderColor },
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: isHcc ? gradientColor1 : isCargaps ? "orange" : "",
        },
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
  return (
    <div className="revenueDollar">
      {" "}
      <ReactECharts option={options ? options : graphOptions} />
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.dashboard?.default?.allRafScore?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);

export default enhancer(codeGraphRevenue);
