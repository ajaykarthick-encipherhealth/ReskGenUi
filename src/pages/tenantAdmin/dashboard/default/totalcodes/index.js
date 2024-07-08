import React, { useEffect } from "react";
import { connect } from "react-redux";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import * as echarts from "echarts";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";

const index = ({
  getAllHccCodesData,
  getAllHccCodes,
  getAllRafData,
  getAllRaf,
  getAllRafScoreData,
  getAllRafScore,
}) => {
  const options = {
    xAxis: {
      type: "category",
      data: [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ],
    },
    yAxis: {
      type: "value",
      show: true,
    },
    tooltip: {
      show: true,
      trigger: "axis",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Total Codes",
        data: [10, 30, 16, 33, 13, 78, 6, 76, 65, 23, 11, 56],
        type: "line",
        lineStyle: { color: "#E88D67" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#E88D67" },
            { offset: 1, color: "#FAFFFA" },
          ]),
        },
      },
      {
        name: "HCC Codes",
        data: [10, 76, 98, 76, 24, 87, 23, 11, 56, 99, 3, 22],
        type: "line",
        lineStyle: { color: "#04B700" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#04B700" },
            { offset: 1, color: "#FAFFFA" },
          ]),
        },
      },
      {
        name: "Car Gap Codes",
        data: [10, 30, 50, 29, 13, 78, 54, 76, 98, 23, 11, 56],
        type: "line",
        lineStyle: { color: "#FF9209" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#FF9209" },
            { offset: 1, color: "#FFFDFA" },
          ]),
        },
      },
    ],
  };
  const bullets = [
    {
      title: "Total Codes",
      color: "#E88D67",
    },
    {
      title: "HCC Codes",
      color: "#04B700",
    },
    {
      title: "Car Gap Codes",
      color: "#FF9209",
    },
  ];

  useEffect(() => {
    getAllHccCodesData();
    getAllRafData();
    getAllRafScore();
  }, []);

  return (
    <div className="d-flex justify-content-between">
      <div style={{ width: "33%" }}>
        <div className={styles.headers}>
        <div className="d-flex justify-content-between">
          <div className={styles.header}>Total Codes</div>

          <div className="d-flex">
            <div>
              {bullets?.map((item) => (
                <div className="d-flex">
                  <div
                    style={{
                      backgroundColor: item?.color,
                      width: "8px",
                      height: "8px",
                      margin: "8px 5px 0 0px",
                    }}
                  ></div>
                  {item?.title}
                </div>
              ))}
            </div>
            <div>
              <div className={styles.header}>Total Codes</div>
              <div className={styles.price}>{getAllHccCodes?.totalCount}</div>
            </div>
          </div>
        </div>
        </div>
        <CodesGraph options={options} isRadio={true} />
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#EBF3FF",
          borderRadius: "16px",
        }}
      >
         <div className={styles.headers}>
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-1`}>RAF</div>
          <div className="p-1">
            <div className={styles.header}>Overall RAF</div>
            <div className={styles.price}>
              {getAllRafScoreData?.totalHccRaf}
            </div>
          </div>
          </div>
        </div>
        <RafGraph
          rafColor={"#E88D67"}
          rafColor3={"#FF9209"}
          rafColor2={"#00BC13"}
        />
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#FCEEE9",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
          <div className={styles.headers}>
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-1`}>Revenue</div>
          <div className="p-1">
            <div className={styles.header}>Overall Revenue</div>
            <div className={styles.price}>{getAllRaf?.totalHccRafScore}</div>
          </div>
        </div>
        </div>
        <RevenueGraph isMultiple={true} />
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.dashboard?.default?.allRafScore?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);
export default enhancer(index);
