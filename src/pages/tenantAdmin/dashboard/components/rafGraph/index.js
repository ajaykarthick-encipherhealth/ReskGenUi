import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/default/action.js";
const RafGraph = ({
  rafColor,
  rafColor2,
  rafColor3,
  isCargaps,
  isHcc,
  getAllRafData,
  getAllHccCodes,
  getAllHccCodesData,
  getAllRaf,
  getAllRafScoreData,
  getAllRafScore,
  chartRafData,
}) => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    getAllHccCodesData(dateRange.startDate, dateRange.endDate);
    getAllRafData();
    getAllRafScore(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const rafScoreByDateForSuggested =
    getAllRafScoreData?.rafScoreByDateForSuggested
      ? Object.values(getAllRafScoreData.rafScoreByDateForSuggested)
      : [];

  const rafScoreByDateForHcc = getAllRafScoreData?.rafScoreByDateForHcc
    ? Object.values(getAllRafScoreData.rafScoreByDateForHcc)
    : [];

  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc
    ? Object.values(getAllRaf.premiumByDateForHcc)
    : [];

  const premiumByDateForSuggested = getAllRaf?.premiumByDateForSuggested
    ? Object.values(getAllRaf.premiumByDateForSuggested)
    : [];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        // label: {
        //   backgroundColor: rafColor,
        // },
      },
    },
    legend: {
      show: false,
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data:
          isHcc || isCargaps
            ? [...chartRafData.keys()]
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
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: isCargaps ? "Car gap Codes" : isHcc ? "HCC Codes" : "Total Codes",
        type: "line",
        itemStyle: {
          color: rafColor,
        },
        areaStyle: {
          color: rafColor,
        },
        emphasis: {
          focus: "series",
        },
        // data: rafColor ,

        data: isHcc
          ? [...chartRafData.keys()].length != 12
            ? [...chartRafData.values()]
            : rafScoreByDateForSuggested
          : isCargaps
          ? [...chartRafData.keys()].length != 12
            ? [...chartRafData.values()]
            : rafScoreByDateForHcc
          : [12, 32, 50],
      },

      {
        name: "HCC Codes",
        type: "line",
        itemStyle: {
          color: rafColor2,
        },
        areaStyle: {
          color: rafColor2,
        },
        emphasis: {
          focus: "series",
        },
        data: rafColor2,
      },
      {
        name: "Car gaps Codes",
        type: "line",
        itemStyle: {
          color: rafColor3,
        },
        areaStyle: {
          color: rafColor3,
        },
        emphasis: {
          focus: "series",
        },
        data: rafColor3 && premiumByDateForHcc && premiumByDateForSuggested,
      },
    ],
  };
  return <ReactECharts option={option} />;
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.tenantAdmindefault?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.tenantAdmindefault?.allRafCounts?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.tenantAdmindefault?.allRafScore?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);
export default enhancer(RafGraph);
