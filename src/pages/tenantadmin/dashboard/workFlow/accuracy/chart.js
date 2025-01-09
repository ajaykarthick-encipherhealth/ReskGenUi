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
        rotation: 0,
        step: (() => {
          const categories = (() => {
            if (selectedValue === "custom") {
              return customDate;
            } else if (selectedValue === "last_1_week") {
              return getLast7Days();
            } else {
              const last30Days = getLast30Days();
              last30Days.push("");
              return last30Days;
            }
          })();

          if (selectedValue === "last_1_week") {
            return 1;
          } else if (selectedValue === "custom") {
            return categories.length > 50
              ? Math.ceil(categories.length / 25)
              : 2;
          } else if (selectedValue === "last_1_month") {
            return 2;
          }

          return 1;
        })(),
        formatter: function () {
          const categories = this.axis.categories;
          const index = categories.indexOf(this.value);
          const totalCategories = categories.length;

          if (selectedValue === "last_1_week") {
            return this.value.length > 10
              ? this.value.slice(0, 10) + "..."
              : this.value;
          } else {
            if (
              index === 0 ||
              index === totalCategories - 1 ||
              index === Math.floor(totalCategories / 2)
            ) {
              return this.value.length > 10
                ? this.value.slice(0, 10) + "..."
                : this.value;
            }
            if (index % 2 === 0) {
              return this.value.length > 10
                ? this.value.slice(0, 10) + "..."
                : this.value;
            }
            return "";
          }
        },
        style: {
          color: "gray",
          fontWeight: "900",
          fontSize: "12px",
          whiteSpace: "nowrap",
        },
      },
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
