import React from "react";
import { useEffect } from "react";
import { rafScore } from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { connect } from "react-redux";
import ReactECharts from "echarts-for-react";
import styles from "../../styles.module.css";
import CodesGraph from "../../components/codeGraph";
import { Skeleton, Spin } from "antd";
import CodeGraphRevenue from "../../components/codeGraphRevenue/index.js";


const index = ({ rafScoreData, overAllRafScore, rafLoader ,dateRange,selectedOrganization,}) => {

  useEffect(() => {
    rafScoreData( dateRange.startDate,
      dateRange.endDate,
      selectedOrganization);
  }, [dateRange,selectedOrganization]);

  const speedometerOptions = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
      {
        name: "Pressure",
        type: "gauge",
        min: 0,
        max: 1000,
        progress: {
          show: true,
          roundCap: true,
          width: 5,
          itemStyle: {
            color: "#FF407D",
            shadowBlur: 5,
            shadowColor: "#FF407D",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        },
        detail: {
          show: true,
          formatter: "{value}",
          fontSize: 20,
          offsetCenter: [0, "10%"],
        },
        pointer: {
          show: false,
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 5,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          distance: -40,
          formatter: function (value) {
            // Only show the min and max labels
            if (value === 0 || value === 1000) {
              return value.toString();
            }
            return "";
          },
          fontSize: 12,
        },
        data: [
          {
            value: overAllRafScore?.response,
            name: "",
          },
        ],
      },
    ],
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div
        className="speedometerChart"
        style={{ width: "33%", height: "auto" }}
      >
        <div className={styles.header}>Raf Score Count</div>
        {rafLoader ? (
          <div className="skeletonantd d-flex justify-content-center align-items-center">
            <Skeleton.Avatar active size="large" shape="circle" />
          </div>
        ) : (
          <ReactECharts option={speedometerOptions} />
        )}
      </div>
      <div className="revenueChart" style={{ width: "65%" }}>
        <div className={styles.header}>
          <div className="py-1">Revenue</div>
          <div className={styles.price}>$ 3189k</div>
          <div className={styles.revenue}>$ 3.1k Increase</div>
        </div>
        <CodeGraphRevenue
          gradientColor1={"#5D94FE"}
          gradientColor2={"#FAFCFF"}
          borderColor={"#3479FE"}
          isRevenue={true}
          className
        />
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    overAllRafScore: state?.tenantAdmin?.dashboard?.default?.allRafScore?.data,
    rafLoader: state?.tenantAdmin?.dashboard?.default?.rafScoreLoader,
  }),

  {
    rafScoreData: rafScore,
  }
);

export default enhancer(index);
