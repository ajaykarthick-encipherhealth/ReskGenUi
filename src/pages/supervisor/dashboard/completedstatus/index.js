import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import styles from "./styles.module.css";
import { Empty, Skeleton, Spin } from "antd";
import { Buttons } from "../../../reviewer/workingstatus";
import Buttonscroller from "../../../../components/buttonSroller";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import Legends from "../../../../components/legends";
import { monthNames, getDays } from "../accuracy";
import YearPicker from "../../../../components/yearpicker";
import spinSTYles from "../../../../styles/auth.module.css";
import { actions as dashboardAction } from '../../../../stores/supervisor/dashboard'
const CompletedStatus = ({completedDatas,getCOmpletedScore,completedChartLoading}) => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [year, setYear] = useState();
  const [month, setMonth] = useState();

  let completedWeeks = new Set();
  let allocatedWeeks = new Set();

  completedWeeks =
    completedDatas?.data?.response?.audit &&
    new Set(Object.keys(completedDatas?.data?.response?.audit).map(Number));

  allocatedWeeks =
    completedDatas?.data?.response?.allocate &&
    new Set(Object.keys(completedDatas?.data?.response?.allocate).map(Number));

  const uniqueWeeks =
    completedWeeks && allocatedWeeks
      ? new Set([...completedWeeks, ...allocatedWeeks])
      : [];

  const weekNames = Array.from(uniqueWeeks)
    .sort((a, b) => a - b)
    .map((week) => `Week ${week}`);

  const handleButtonClick = (index, btn) => {
    setActiveButton(index);
    setCurrentBtn(btn);
  };

  const handleYearChange = (date, dateString) => {
    setSelectedYear(dateString);
    setYear(date);
  };
  const handleMonthChange = (date) => {
    setMonth(date);
    setSelectedMonth(date);
  };

  // Inside your component function
  let xAxisData = [];

  if (currentBtn === "Monthly") {
    xAxisData = monthNames;
  } else if (currentBtn === "Daily") {
    xAxisData = getDays(
      completedDatas?.data?.response?.audit &&
        Object.keys(completedDatas?.data?.response?.audit)?.length
    );
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

  const allocatedValues = xAxisData?.map((day, index) =>
    completedDatas?.data?.response?.allocate
      ? completedDatas?.data?.response?.allocate[index + 1]
      : 0 || 0
  );
  const auditedValues = xAxisData?.map((day, index) =>
    completedDatas?.data?.response?.audit
      ? completedDatas?.data?.response?.audit[index + 1]
      : 0 || 0
  );

  const option = {
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
      show: true,
    },
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: function (params) {
        const dataIndex = params[0]?.dataIndex;
        const allocatedValue = allocatedValues[dataIndex];
        const auditedValue = auditedValues[dataIndex];
        return `Audited: ${auditedValue}<br/>Allocated: ${allocatedValue}`;
      },
    },
    series: [
      {
        data: auditedValues,
        type: "line",
        lineStyle: { color: "#4A3AFF" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#4A3AFF" },
            { offset: 1, color: "#F4EBF4" },
          ]),
        },
      },
      {
        data: allocatedValues,
        type: "line",
        lineStyle: { color: "#FF718B" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#FF718B" },
            { offset: 1, color: "#F4EBF4" },
          ]),
        },
      },
    ],
  };

  const bullets = [
    {
      color: "#4A3AFF",
      name: "Audited",
    },
    {
      color: "#FF718B",
      name: "Allocated",
    },
  ];

  useEffect(() => {
    getCOmpletedScore({
      month: selectedMonth,
      year: selectedYear,
      btn: currentBtn,
    });
  }, [currentBtn, selectedMonth, selectedYear]);
  return (
    <>
      <HeadTitle header="Productivity Status" />
      <div className={styles.card5}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <div className={styles.picker}>
              <YearPicker
                onChangeYear={handleYearChange}
                onChangeMonth={handleMonthChange}
                type={currentBtn}
                bgColor="#F3F3FF"
                val={month}
                val1={year}
              />
            </div>
            <div className={styles.btnScroller}>
              <Buttonscroller
                Buttons={Buttons}
                handleButtonClick={handleButtonClick}
                activeButton={activeButton}
                activeColor="#fff"
                inActiveColor="#000000"
                activeBg="#1E1B39"
                inActiveBg="#F3F3FF"
                containerBg="#F3F3FF"
              />
            </div>
          </div>

          {completedChartLoading ? (
            <div className={spinSTYles.spinStyle}>
                <Skeleton
                active
                paragraph={{ rows: 4 }}
                style={{ padding: "40px" }}
              />
            </div>
          ) : completedDatas?.loading === false &&
            completedDatas?.data?.response ? (
            <>
              <ReactECharts
                option={option}
                style={{ width: "100%", height: "300px", marginTop: "-10px" }}
              />
              <div className={styles.bulletContainer}>
                <Legends bullets={bullets} />
              </div>
            </>
          ) : (
            <div className={spinSTYles.spinStyle}>
              <Empty />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    completedDatas: state.supervisor.dashboard.completedChart,
    completedChartLoading: state.supervisor.dashboard.completedChartLoading,
  }),
  {
    getCOmpletedScore: dashboardAction.completedChartAction,
  }
);
export default enhancer(CompletedStatus);
