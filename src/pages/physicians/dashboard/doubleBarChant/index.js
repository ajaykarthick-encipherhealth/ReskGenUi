import React from "react";
import ReactECharts from "echarts-for-react";

const DoubleBarChant = ({ data }) => {
  const option = {
    legend: {
      show: false,
    },
    tooltip: {},
    dataset: {
      dimensions: ["product", "2016", "2017"],
      source: [
        { product: "ICD10", 2016: 8, 2017: 3 },
        { product: "ICD11", 2016: 7, 2017: 4 },
        { product: "ICD13", 2016: 6, 2017: 2 },
        { product: "ICD14", 2016: 9, 2017: 5 },
        { product: "ICD15", 2016: 8, 2017: 3 },
        { product: "ICD16", 2016: 7, 2017: 4 },
        { product: "ICD17", 2016: 6, 2017: 2 },
        { product: "ICD18", 2016: 9, 2017: 5 },
        { product: "ICD19", 2016: 8, 2017: 3 },
        { product: "ICD12", 2016: 7, 2017: 4 },
        { product: "ICD22", 2016: 6, 2017: 2 },
        { product: "ICD23", 2016: 9, 2017: 5 },
        { product: "ICD", 2016: 8, 2017: 3 },
        { product: "ICD0", 2016: 7, 2017: 4 },
        { product: "ICD2", 2016: 6, 2017: 2 },
        { product: "ICD6", 2016: 9, 2017: 5 },
      ],
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
