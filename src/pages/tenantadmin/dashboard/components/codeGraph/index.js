import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  getAllRafScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import {
  formatValues,
  getLast30Days,
  getLast7Days,
} from "../../../../../utils/reusable.js";

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
  getAllHccCodes,
  selectedValue,
  className,
  customDate,
  getAllLabAndRadiologyChart,
  isLabValues,
  isPotential,
}) => {
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();
  const hccDiseaseCountValues = getAllHccCodes?.hccDiseaseCountMap;
  const radiologyCountValues = getAllLabAndRadiologyChart?.radiologyCountMap;
  const labCountValues = getAllLabAndRadiologyChart?.labCountMap;
  const resultArrayHCC = formatValues(hccDiseaseCountValues, dates);
  const resultArrayRadiology = formatValues(radiologyCountValues, dates);
  const resultArrayLab = formatValues(labCountValues, dates);
  const suggestedHccDiseaseCountMap =
    getAllHccCodes?.suggestedHccDiseaseCountMap;
  const resultArrayCaregaps = formatValues(suggestedHccDiseaseCountMap, dates);

  const graphOptions = {
    xAxis: {
      type: "category",
      boundaryGap: false,
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
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
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
          : isPotential?"Potential Diagnosis Codes":"Radiology",
        data: isHcc||isPotential
          ? resultArrayHCC
          : isCargaps
          ? resultArrayCaregaps
          :isTwoWaves
          ?resultArrayRadiology
          :[] ,
        type: "line",
        lineStyle: { color: borderColor },
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: borderColor,
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
        name: isLabValues ? "Lab" : "",
        data: isLabValues ? resultArrayLab : "",
        type: "line",
        lineStyle: { color: borderColor2 },
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: borderColor2,
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
    ],
  };

  return (
    <div className={`${className}`}>
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
    getAllLabAndRadiologyChart:
      state?.tenantAdmin?.dashboard?.default?.getAllLabAndRadiologyChart?.data
        ?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScoreData: getAllRafScore,
  }
);

export default enhancer(CodesGraph);
