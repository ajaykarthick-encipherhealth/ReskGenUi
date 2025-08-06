import React from "react";
import styles from "./styles.module.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { getLast30Days, getLast7Days } from "../../../../../utils/reusable";

const AccuracyChart = ({
  selectedValue,
  OrgTotalCode,
  OrgRevScore,
  dateRange,
  customDate,
}) => {
  const config2 = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "category",
      categories: (() => {
        if (selectedValue === "custom") {
          return customDate;
        } else if (selectedValue === "last_1_week") {
          return getLast7Days();
        } else {
          const last30Days = getLast30Days();
          last30Days.push("");
          return last30Days;
        }
      })(),
      labels: {
        rotation: -45, 
        step: 1, 
        overflow: "justify", 
        formatter: function () {
          return this.value.length > 10
            ? this.value.slice(0, 10) + "..."
            : this.value;
        },
        style: {
          color: "gray",
          fontWeight: "900",
          fontSize: "12px",
          whiteSpace: "nowrap",
        },
      },
      minPadding: 0.2, 
      maxPadding: 0.2,
      lineColor: "#d9d9d9",
    },

    yAxis: [
      {
        tickPositions: [0, 25, 50, 75, 100],
        title: {
          text: "Organization Changes Count",
          style: {
            color: "#2dafff",
          },
        },
        labels: {
          format: "{value}%",
          style: {
            color: "gray",
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
          text: "Organization Changes Count",
          style: {
            color: "#0b59f1",
          },
        },
        labels: {
          format: "{value}",
          style: {
            color: "gray",
            fontWeight: "500",
          },
        },
        opposite: true,
        tickInterval: 4,
      },
    ],
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
          format: "{point.y}",
        },
        pointWidth: 20,
        borderRadius: 10,
      },
    },
    series: [
      {
        name: "Total Codes Count",
        data: OrgTotalCode,
        color: "#0b59f1",
        yAxis: 1,
      },
      {
        name: "Reviewer Score",
        type: "spline",
        data: OrgRevScore,
        tooltip: {
          valueSuffix: "",
        },
        yAxis: 0,
      },
    ],
  };

  return (
    <>
      <div>
        <div className={styles.highchartStyle}>
          <HighchartsReact
            highcharts={Highcharts}
            options={config2}
            selectedValue={selectedValue}
            dateRange={dateRange}
            customDate={customDate}
          />
        </div>
      </div>
    </>
  );
};

export default AccuracyChart;
