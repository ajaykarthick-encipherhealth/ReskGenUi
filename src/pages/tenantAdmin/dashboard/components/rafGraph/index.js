import React from "react";
import ReactECharts from "echarts-for-react";

const RafGraph = ({ rafColor, rafColor2, rafColor3, isCargaps, isHcc }) => {
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
        data: [
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
        name: isCargaps?"Car gap Codes":isHcc?"HCC Codes":"Total Codes",
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
        data: rafColor && [0, 6, 10, 16, 22, 46, 60, 70, 80, 90, 100, 110],
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
        data: rafColor2 && [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 125],
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
        data: rafColor3 && [15, 30, 50, 70, 90, 110, 120, 140, 160, 180, 190],
      },
    ],
  };
  return <ReactECharts option={option} />;
};

export default RafGraph;
