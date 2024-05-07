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
        { product: "ICD10", 2016: 85.8, 2017: 93.7 },
        { product: "ICD11", 2016: 73.4, 2017: 55.1 },
        { product: "ICD13", 2016: 65.2, 2017: 82.5 },
        { product: "ICD14", 2016: 53.9, 2017: 39.1 },
        { product: "ICD15", 2016: 85.8, 2017: 93.7 },
        { product: "ICD16", 2016: 73.4, 2017: 55.1 },
        { product: "ICD17", 2016: 65.2, 2017: 82.5 },
        { product: "ICD18", 2016: 53.9, 2017: 39.1 },
        { product: "ICD19", 2016: 85.8, 2017: 93.7 },
        { product: "ICD12", 2016: 73.4, 2017: 55.1 },
        { product: "ICD22", 2016: 65.2, 2017: 82.5 },
        { product: "ICD23", 2016: 53.9, 2017: 39.1 },
        { product: "ICD", 2016: 85.8, 2017: 93.7 },
        { product: "ICD0", 2016: 73.4, 2017: 55.1 },
        { product: "ICD2", 2016: 65.2, 2017: 82.5 },
        { product: "ICD6", 2016: 53.9, 2017: 39.1 },
      ],
    },
    xAxis: { type: "category" },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      {
        type: "bar",
        itemStyle: {
          color: "green", // Color for the first bar series
        },
      },
      {
        type: "bar",
        itemStyle: {
          color: "red", // Color for the first bar series
        },
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
