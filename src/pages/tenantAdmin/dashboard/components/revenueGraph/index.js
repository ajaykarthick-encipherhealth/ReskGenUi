import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
} from "../../../../../stores/tenantAdmin/default/action.js";

const RevenueGraph = ({
  isMultiple,
  hccColor,
  cargapColor,
  getAllHccCodesData,
  getAllHccCodes,
  getAllRafData,
  getAllRaf,
  chartRevenData
}) => {
  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc
    ? Object.values(getAllRaf.premiumByDateForHcc)
    : [];

  const premiumByDateForSuggested = getAllRaf?.premiumByDateForSuggested
    ? Object.values(getAllRaf.premiumByDateForSuggested)
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
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: cargapColor
          ? "Car gap Codes"
          : hccColor
          ? "HCC Codes"
          : "Total Codes",
        type: "line",
        step: "start",
        data: hccColor
          ? premiumByDateForHcc
          : cargapColor
          ? premiumByDateForSuggested
          : [12, 34, 23],
        itemStyle: {
          color: hccColor ? hccColor : cargapColor ? cargapColor : "#E88D67",
        },
      },
      {
        name: "HCC Codes",
        type: "line",
        step: "middle",

        data: isMultiple && premiumByDateForHcc && premiumByDateForSuggested,

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
      state?.tenantAdmin?.tenantAdmindefault?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.tenantAdmindefault?.allRafCounts?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
  }
);
export default enhancer(RevenueGraph);
