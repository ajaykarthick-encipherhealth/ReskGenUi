import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

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
}) => {
  const graphOptions = {
    xAxis: {
      type: "category",
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
        data: [10, 30, 50, 29, 13, 78, 54, 76, 98, 23, 11, 56],
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

export default CodesGraph;
