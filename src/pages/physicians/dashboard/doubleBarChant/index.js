import React from "react";
import ReactECharts from "echarts-for-react";

const DoubleBarChant = ({ data }) => {
  const option = {
    legend: {
      show: true,
      top: 'bottom'
    },
    tooltip: {},
    dataset: {
      dimensions: ["Diagnosis Code", "Meat Present Count", "Meat Absent Count"],
      source: data,
    },
    xAxis: { type: "category" },
    yAxis: {
      show: false
    },
    series: [
      {
        type: "bar",
        itemStyle: {
          color: "#00ab00",
        },
        label: {
          show: true,
          position: 'top'
        }
      },
      {
        type: "bar",
        itemStyle: {
          color: "#fe5b5b",
        },
        label: {
          show: true,
          position: 'top'
        }
      },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default DoubleBarChant;
