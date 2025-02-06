import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { getLast30Days, getLast7Days } from "../../../../utils/reusable";
import Image from "next/image";
import styles from "../styles.module.css";
import { connect } from "react-redux";
import { actions as invalidAction } from "../../../../stores/tenantAdmin/dashboard/invalid";

const InvalidChart = ({
  selectedValue,
  header,
  count,
  images,
  background,
  data,
  customDate,
  overAll,
  onClick,
  hideContent,
  values,
  graphName,
}) => {
console.log(values,"values")
  const graphOptions = {
    xAxis: {
      type: "category",
      data:
        selectedValue === "custom"
          ? customDate
          : selectedValue === "last_1_week"
          ? getLast7Days()
          : getLast30Days(),
    },
    yAxis: {
      type: "value",
      show: true,
    },
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#E2ECFE",
        },
      },
    },
    series: [
      {
        name: graphName,
        data: data || [],
        type: "line",
        lineStyle: { color: "#3b82f6" },
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: "#E2ECFE",
        },
        areaStyle: "#3b82f6",
      },
    ],
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="p-2 font4 fontWeight3 d-flex gap-3 ">
          <div
            className={`rounded ${styles.imgbg}`}
            style={{ background: background }}
          >
            <div className="d-flex align-items-center justify-content-center mt-2">
              <Image src={images} alt="no Img" width={25} height={25} />
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center">
            
            {header}

            {hideContent ? (
              <span
                id="maximize-btn"
              name="maximize-btn"
                onClick={() => onClick(values)}
                className="font1 text-decoration-underline cursor-pointer "
                style={{ color: "#3B82F6" }}
              >
                Maximize
              </span>
            ): null}
          </div>
        </div>
        <div className="p-2">
          <div className="d-flex font1 text-muted">Current / Overall</div>
          <div style={{fontSize:"24px"}} className="fontWeight3">
          {count} / {overAll}
          </div>
        </div>
      </div>
      <div className="invalidChart">
        <ReactECharts className="invalidChart" option={graphOptions} />
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    invalidData: state?.tenantAdmin?.dashboard?.invalid?.invalidCounts,
  }),
  {
    getInvalidDashboard: invalidAction?.InvalidCounts,
  }
);
export default enhancer(InvalidChart);
