import React from "react";
import ReactECharts from "echarts-for-react";

const DoubleBarChant = ({ data }) => {
  const option = {
    legend: {
      show: false,
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
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      {
        type: "bar",
        itemStyle: {
          color: "#00ab00", // Color for the first bar series
        },
        label: {
          show: true,
          position: 'top' // Display count at the top
        }
      },
      {
        type: "bar",
        itemStyle: {
          color: "#fe5b5b", // Color for the first bar series
        },
        label: {
          show: true,
          position: 'top' // Display count at the top
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
