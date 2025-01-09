import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import {
  formatValues,
  getLast30Days,
  getLast7Days,
} from "../../../../../utils/reusable.js";
import { Empty, Skeleton } from "antd";

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
  getAllRaf,
  customDate,
  revenueChartLoader,
}) => {
  const hccDiseaseCountValues = getAllHccCodes?.hccDiseaseCountMap
    ? Object.values(getAllHccCodes.hccDiseaseCountMap)
    : [];

  const suggestedHccDiseaseCountMap =
    getAllHccCodes?.suggestedHccDiseaseCountMap
      ? Object.values(getAllHccCodes.suggestedHccDiseaseCountMap)
      : [];

  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();

  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc;
  const resultArrayHCC = formatValues(premiumByDateForHcc, dates);
  

  const graphOptions = {
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
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
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
          : resultArrayHCC,
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
    <div>
      {revenueChartLoader ? (
          <div>
            <Skeleton.Input
              className="w-100"
              style={{ height: "200px" }}
              active
            />
          </div>
        ) : hccDiseaseCountValues?.length > 0 ? (
          <div className="revenueDollar">
           <ReactECharts option={options ? options : graphOptions} />
          </div>
        ) : (
          <Empty className="mt-3" />
        )}
    
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
          revenueChartLoader:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.loading,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);

export default enhancer(codeGraphRevenue);
