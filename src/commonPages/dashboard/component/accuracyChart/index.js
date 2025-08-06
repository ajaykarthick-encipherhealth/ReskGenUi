import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { getLast30Days, getLast7Days } from "../../../../utils/reusable";

const AccuracyChart = ({
  selectedValue,
  customDate,
  type,
  series,
  yAxisFont1,
  yAxisFont2,
  yAxis1Title,
  yAxis2Title,
  xAxisFontColor,
  LeftYaxisFont,
  rightYaxisFont,
}) => {
  const getXAxisData = () => {
    if (selectedValue === "custom") return customDate;
    if (selectedValue === "last_1_week") return getLast7Days();
    const days = getLast30Days();
    days.push("");
    return days;
  };

  const commonXAxis = {
    type: "category",
    categories: getXAxisData(),
    labels: {
      rotation: -45,
      autoRotation: [-45, -90],
      step: 1,
      overflow: "justify",
      formatter: function () {
        return this.value.length > 10
          ? this.value.slice(0, 10) + "..."
          : this.value;
      },
      style: {
        color: xAxisFontColor,
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    lineColor: "#d9d9d9",
  };

  const commonYAxis = [
    {
      tickPositions: [0, 25, 50, 75, 100],
      title: {
        text: yAxis1Title,
        style: { color: yAxisFont2 },
      },
      labels: {
        format: "{value}%",
        style: {
          color: LeftYaxisFont,
          fontWeight: "500",
          fontSize: "14px",
        },
      },
      opposite: false,
      min: 0,
      max: 100,
      gridLineWidth: 0,
    },
    {
      title: {
        text: yAxis2Title,
        style: { color: yAxisFont1 },
      },
      labels: {
        format: "{value}",
        style: {
          color: rightYaxisFont,
          fontWeight: "500",
        },
      },
      opposite: true,
      tickInterval: 4,
    },
  ];

  const getChartOption = () => {
    switch (type) {
      case "column":
        return {
          chart: { type: "column", height: 300 },
          title: { text: "" },
          xAxis: commonXAxis,
          yAxis: commonYAxis,
          legend: { enabled: false },
          credits: { enabled: false },
          tooltip: { shared: true },
          plotOptions: {
            column: {
              stacking: "normal",
              dataLabels: {  enabled: false, format: "{point.y}" },
              pointWidth: 20,
              borderRadius: 10,
            },
          },
          series,
        };

      case "line":
        return {
          chart: { type: "line", height: 300 },
          title: { text: "" },
          xAxis: commonXAxis,
          yAxis: commonYAxis,
          legend: { enabled: false },
          credits: { enabled: false },
          tooltip: { shared: true },
          series,
        };

      case "bar":
        return {
          chart: { type: "bar", height: 300 },
          title: { text: "" },
          xAxis: {
            categories: getXAxisData(),
            title: { text: null },
            labels: {
              style: {
                color: "green",
                fontWeight: "900",
                fontSize: "12px",
              },
            },
          },
          yAxis: commonYAxis[1],
          legend: { enabled: false },
          credits: { enabled: false },
          tooltip: { shared: true },
          plotOptions: {
            bar: {
              dataLabels: { enabled: true },
              borderRadius: 5,
            },
          },
          series,
        };

      default:
        return {};
    }
  };

  const config = getChartOption();

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={config} />
    </div>
  );
};

export default AccuracyChart;
