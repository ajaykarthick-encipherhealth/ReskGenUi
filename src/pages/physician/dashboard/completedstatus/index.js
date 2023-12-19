import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { Buttons } from "../../workingstatus";
import Buttonscroller from "../../../../components/buttonSroller";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import Legends from "../../../../components/legends";
import { monthNames, getDays } from "../accuracy";
import { useDispatch, useSelector } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import { getCOmpletedScore } from "../../../../store/actions/DashboardActions";
import { useRouter } from "next/router";

const CompletedStatus = () => {
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(
      getCOmpletedScore(
        currentBtn.toUpperCase(),
        currentDate.getDate(),
        selectedMonth,
        selectedYear,
        router
      )
    );
  }, [currentBtn, selectedMonth, selectedYear]);

  const completedDatas = useSelector((state) => state?.workFlow?.completed);
  const CompletedSortedData = completedDatas?.response?.completedData?.sort(
    (a, b) => a._id.month - b._id.month
  );
  const ALlocatedSortedData = completedDatas?.response?.allocatedData?.sort(
    (a, b) => a._id.month - b._id.month
  );

  const allocatedData = CompletedSortedData?.map((item) => item?.count);
  const completedData = ALlocatedSortedData?.map((item) => item?.count);

  const completedWeeks = new Set(
    completedDatas?.response?.completedData?.map((item) => item._id.week)
  );
  const allocatedWeeks = new Set(
    completedDatas?.response?.allocatedData?.map((item) => item._id.week)
  );
  const uniqueWeeks = new Set([...completedWeeks, ...allocatedWeeks]);

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

  let xAxisData = [];
  if (currentBtn === "Monthly") {
    xAxisData = monthNames;
  } else if (currentBtn === "Daily") {
    xAxisData = getDays(currentDate);
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

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
        const allocatedValue = allocatedData[dataIndex];
        const completedValue = completedData[dataIndex];
        return `Completed: ${allocatedValue}<br/>Allocated: ${completedValue}`;
      },
    },
    series: [
      {
        data: allocatedData,
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
        data: completedData,
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
      name: "Completed",
    },
    {
      color: "#FF718B",
      name: "Allocated",
    },
  ];

  return (
    <>
      <HeadTitle header="Productivity Status" />
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

          <ReactECharts
            option={option}
            style={{ width: "100%", height: "300px", marginTop: "-15px" }}
          />
          <div className={styles.bulletContainer}>
            <Legends bullets={bullets} />
          </div>
        </Card>
      </div>
    </>
  );
};

export default CompletedStatus;
