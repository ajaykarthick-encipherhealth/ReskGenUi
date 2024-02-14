import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { Buttons } from "../../../physician/workingstatus";
import Buttonscroller from "../../../../components/buttonSroller";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import Legends from "../../../../components/legends";
import { monthNames, getDays } from "../accuracy";
import { useDispatch, useSelector } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import { useRouter } from "next/router";
import { Empty, Spin } from "antd";
import {
  getDeliveryStatus,
  getCOmpletedScore,
} from "../../../../store/actions/l2Action/DashboardAction";
import spinSTYles from "../../../../styles/auth.module.css";
const DeliveryStatus = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const completedDatas = useSelector(
    (state) => state?.l2Dashboard?.deliveryStatus
  );
  // const datatTest = useSelector((state) => state?.l2Dashboard?.deliveryStatus);
  console.log(completedDatas);
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

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
  };
  const handleMonthChange = (date) => {
    const selectedDate = new Date(date);
    const monthNumber = (selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    setSelectedMonth(monthNumber);
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
        return `Total charts: ${auditedValue}<br/>Completed charts: ${allocatedValue}`;
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
      name: "Total charts",
    },
    {
      color: "#FF718B",
      name: "Completed charts",
    },
  ];

  useEffect(() => {
    dispatch(
      getDeliveryStatus(
        currentBtn.toUpperCase(),
        currentDate.getDate(),
        selectedMonth,
        selectedYear,
        router
      )
    );
  }, [currentBtn, selectedMonth, selectedYear]);
  return (
    <>
      <HeadTitle header="Delivery Status" />
      <div className={styles.card5}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <div className={styles.picker}>
              <YearPicker
                onChange={handleYearChange}
                type={"year"}
                bgColor="#F3F3FF"
              />
              {currentBtn !== "Monthly" && (
                <YearPicker
                  onChange={handleMonthChange}
                  type={"month"}
                  bgColor="#F3F3FF"
                />
              )}
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

          {completedDatas?.loading ? (
            <div className={spinSTYles.spinStyle}>
              <Spin loading={completedDatas?.loading} />
            </div>
          ) : completedDatas?.loading === false &&
            completedDatas?.data?.response ? (
            <>
              <ReactECharts
                option={option}
                style={{ width: "100%", height: "300px", marginTop: "-15px" }}
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

export default DeliveryStatus;
