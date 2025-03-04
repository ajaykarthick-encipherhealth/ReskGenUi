import React from "react";
import { useEffect } from "react";
import { rafScore } from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { connect } from "react-redux";
import ReactECharts from "echarts-for-react";
import styles from "../../styles.module.css";
import { Skeleton } from "antd";
import CodeGraphRevenue from "../../components/codeGraphRevenue/index.js";
import { formatNumber } from "../../../../../utils/reusable.js";

const index = ({
  rafScoreData,
  overAllRafScore,
  rafLoader,
  dateRange,
  selectedOrganization,
  getAllRaf,
  selectedValue,
  customDate,
  selectDos,
}) => {
  // Function to round up to the nearest 1000
  const getMaxValue = (value) => Math.ceil(value / 1000) * 1000;

  const responseValue = parseFloat(overAllRafScore?.response ?? 0);
  const maxValue = getMaxValue(responseValue);

  const speedometerOptions = {
    tooltip: {
      formatter: "{a} <br/>{b} {c}",
    },
    series: [
      {
        name: "RAF Score",
        type: "gauge",
        min: 0,
        max: maxValue,
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
          formatter: function (value) {
            return value.toFixed(2);
          },
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
            if (value === 0 || value === maxValue) {
              return value.toString();
            }
            return "";
          },
          fontSize: 12,
        },
        data: [
          {
            value: parseFloat(overAllRafScore?.response?.toFixed(2)),
            name: "",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    rafScoreData(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization,
      selectDos
    );
  }, [dateRange, selectedOrganization, selectDos]);

  const totalRev = getAllRaf?.totalHccRafScore;

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div
        className="speedometerChart"
        style={{ width: "33%", height: "auto" }}
      >
        <div className={styles.headers}>
          <div className={styles.header}> Total HCC Raf Score </div>
        </div>
        {rafLoader ? (
          <div className="skeletonantd d-flex justify-content-center align-items-center">
            <Skeleton.Avatar active size="large" shape="circle" />
          </div>
        ) : (
          <ReactECharts
            selectedValue={selectedValue}
            option={speedometerOptions}
          />
        )}
      </div>
      <div className="revenueChart" style={{ width: "65%" }}>
        <div className={styles.header}>
          <div className="py-1">Revenue</div>
          <div className={styles.price}>{`$ ${
            formatNumber(totalRev) || "0.00"
          }`}</div>
          {/* <div className={styles.revenue}>$ 3.1k Increase</div> */}
        </div>
        <CodeGraphRevenue
          gradientColor1={"#5D94FE"}
          gradientColor2={"#FAFCFF"}
          borderColor={"#3479FE"}
          isRevenue={true}
          className
          customDate={customDate}
          selectedValue={selectedValue}
        />
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    overAllRafScore: state?.tenantAdmin?.dashboard?.default?.allRafScore?.data,
    rafLoader: state?.tenantAdmin?.dashboard?.default?.rafScoreLoader,
  }),

  {
    rafScoreData: rafScore,
  }
);

export default enhancer(index);
