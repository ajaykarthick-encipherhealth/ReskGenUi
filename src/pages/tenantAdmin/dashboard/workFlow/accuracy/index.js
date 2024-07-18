import React, { useEffect, useState } from "react";
import Buttonscroller from "../../../../../components/buttonSroller";
import ReactECharts from "echarts-for-react";
import accuracy from "../../../../../images/dashboard/accuracy.png";
import Image from "next/image";
import styles from "./styles.module.css";
import HeadTitle from "../../../../../components/headtitle";
import { Empty, Spin } from "antd";
import spinSTYles from "../../../../../styles/auth.module.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { connect } from "react-redux";
import {
  dateFormatForDashboard,
  getAllDatesInRange,
} from "../../../../../utils/reusable";
import moment from "moment";

export const TabButtons = [
  {
    id: 1,
    title: "CogentAI Accuracy",
  },
  {
    id: 2,
    title: "Organization Quality",
  },
];
export const getDateWeek = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeek = firstDayOfMonth.getDay();
  const currentDate = date.getDate();
  const startingWeek = Math.ceil((currentDate + firstDayWeek) / 7);
  return startingWeek;
};

export const getDays = (dataLength) => {
  const totalDaysInMonth = dataLength;
  return Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
};

export const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
export function getHighlightedIndex(
  currentBtn,
  selectedYear,
  selectedMonth,
  currentDate
) {
  let constHighlitedIndex = -1;
  if (currentBtn === "Monthly") {
    if (parseInt(selectedYear) === new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getMonth();
    }
    if (parseInt(selectedYear) < new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getMonth();
    }
    if (parseInt(selectedYear) > new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getMonth();
    } else {
      constHighlitedIndex = selectedMonth - 1;
    }
  } else if (currentBtn === "Daily") {
    if (parseInt(selectedYear) === new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getDate() - 1;
    }
    if (parseInt(selectedYear) < new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getMonth();
    }
    if (parseInt(selectedYear) > new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getMonth();
    } else {
      constHighlitedIndex = selectedMonth - 1;
    }
  } else if (currentBtn === "Weekly") {
    if (parseInt(selectedYear) === new Date().getFullYear()) {
      const currentWeek = getDateWeek(currentDate);
      constHighlitedIndex = currentWeek - 1;
    }
    if (parseInt(selectedYear) < new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getMonth();
    }
    if (parseInt(selectedYear) > new Date().getFullYear()) {
      constHighlitedIndex = currentDate.getMonth();
    } else {
      constHighlitedIndex = selectedMonth - 1;
    }
  }

  return constHighlitedIndex;
}

export const getGraphData = (param, text) => {
  return param?.map((item) => item[text]);
};
export const chartBlockedDates = () => {};
const Accuracy = ({ getAccuracyWorkflow, dateRange, selectedOrganization }) => {
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const [activeTabButton, setActiveTabButton] = useState(0);
  const [currentTabBtn, setCurrentTabBtn] = useState("CogentAI Accuracy");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const accuracyDatas = {
    data: {
      response: [
        {
          dayOfMonth: 1,
          averageScore: 100,
          totalCorrectCount: 20,
          totalWrongCount: 10,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 2,
          averageScore: 100,
          totalCorrectCount: 30,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 3,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 4,
          averageScore: 100,
          totalCorrectCount: 50,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 5,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 6,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 7,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 8,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 9,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 10,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 11,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 12,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 13,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 14,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 15,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 16,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 17,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 18,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 19,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 20,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 21,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 22,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 23,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 24,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 25,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 26,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 27,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 28,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 29,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 30,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 31,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
      ],
    },
  };
  const QualityAccuracyDatas = {
    data: {
      response: [
        {
          dayOfMonth: 1,
          averageScore: 100,
          totalCorrectCount: 30,
          totalWrongCount: 10,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 2,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 3,
          averageScore: 100,
          totalCorrectCount: 50,
          totalWrongCount: 10,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 4,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 5,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 6,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 7,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 8,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 9,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 10,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 11,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 12,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 13,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 14,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 15,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 16,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 17,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 18,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 19,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 20,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 21,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 22,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 23,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 24,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 25,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 26,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 27,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 28,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 29,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 30,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
        {
          dayOfMonth: 31,
          averageScore: 100,
          totalCorrectCount: 0,
          totalWrongCount: 0,
          weekOfMonth: null,
          monthOfYear: null,
        },
      ],
    },
  };

  const handleTabButtonClick = (index, btn) => {
    setActiveTabButton(index);
    setCurrentTabBtn(btn);
  };

  const [xdata, setXData] = useState([]);
  const [valueOne, setValueOne] = useState([]);
  const [valueTwo, setValueTwo] = useState([]);
  const [valueThree, setValueThree] = useState([]);
  const [valueFour, setValueFour] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      const dates = await getAllDatesInRange(
        dateRange.startDate,
        dateRange.endDate
      );
      setXData(dates);
      setValueOne([]);
      setValueTwo([]);
      setValueThree([]);
      setValueFour([]);
    };

    fetchDates();
  }, [dateRange, selectedOrganization]);

  useEffect(() => {
    if (getAccuracyWorkflow?.response && xdata) {
      const valueOne = [];
      const valueTwo = [];
      const valueThree = [];
      const valueFour = [];

      xdata.forEach((date) => {
        const foundItem = getAccuracyWorkflow.response.find(
          (item) => item.date === date
        );
        valueOne.push(foundItem ? foundItem.totalNewlyAddedCodesCount : 0);
        valueTwo.push(foundItem ? foundItem.reviewerAvgScore : 100);
        valueThree.push(foundItem ? foundItem.totalNewlyAddedCodesCount : 0);
        valueFour.push(foundItem ? foundItem.reviewerAvgScore : 100);
      });

      setValueOne(valueOne);
      setValueTwo(valueTwo);
      setValueThree(valueThree);
      setValueFour(valueFour);
    }
  }, [getAccuracyWorkflow?.response, xdata]);

  const getData = async (dates) => {
    const dat = await getAccuracyWorkflow?.response?.map((item) => item.date);
    dates.map((item) => {
      if (dat.includes(item)) {
        const d = getAccuracyWorkflow?.response?.find(
          (ite) => ite.date == item
        );
        setValueOne((pre) => [...pre, d.totalNewlyAddedCodesCount]);
        setValueTwo((pre) => [...pre, d.reviewerAvgScore]);
      } else {
        setValueOne((pre) => [...pre, 0]);
        setValueTwo((pre) => [...pre, 100]);
      }
    });
  };

  let data = [];

  if (currentBtn && accuracyDatas?.data?.response) {
    data = Object.values(accuracyDatas?.data?.response);
  }

  const config = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: xdata.map((date) => dateFormatForDashboard(date)),
      crosshair: true,
      labels: {
        style: {
          color: "gray",
          fontWeight: "500",
        },
      },
      lineColor: "#d9d9d9",
    },
    yAxis: [
      {
        title: {
          text: "Organization Quality",
          style: {
            color: "#2dafff",
          },
        },
        labels: {
          format: "{value}%",
          style: {
            color: "gray",
            fontWeight: "500",
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
      formatter: function () {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points.forEach((point) => {
          let seriesName = point.series.name;
          let value = point.y;
          if (seriesName === "totalNewlyAddedCodesCount") {
            tooltip += ` <span style="color:${point.color}">\u25CF</span> ${seriesName}: ${value}<br/>`;
          } else {
            tooltip += `<span style="color:${point.color}">\u25CF</span> ${seriesName}: ${value}<br/>`;
          }
        });

        return tooltip;
      },
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
        name: "totalNewlyAddedCodesCount",
        data: valueOne,
        color: "#0b59f1",
        yAxis: 1,
      },
      // {
      // name: "totalWrongCount",
      // data: getGraphData(
      // QualityAccuracyDatas?.data?.response,
      // "totalWrongCount",
      // selectedMonth,
      // selectedYear,
      // currentBtn,
      // currentDate
      // ),
      // color: "red",
      // yAxis: 1,
      // },
      {
        name: "reviewerAvgScore",
        type: "spline",
        data: valueTwo,
        tooltip: {
          valueSuffix: "",
        },
        yAxis: 0,
      },
    ],
  };
  const config2 = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },

    xAxis: {
      categories: xdata.map((date) => dateFormatForDashboard(date)),
      crosshair: true,
      labels: {
        style: {
          color: "gray",
          fontWeight: "500",
        },
      },
      lineColor: "#d9d9d9",
    },
    yAxis: [
      {
        title: {
          text: "Accuracy Quality",
          style: {
            color: "#2dafff",
          },
        },
        labels: {
          format: "{value}%",
          style: {
            color: "gray",
            fontWeight: "500",
          },
        },
        opposite: false,
        min: 0,
        max: 100,
        gridLineWidth: 0,
      },
      {
        title: {
          text: "Accuracy Changes Count",
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
      formatter: function () {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points.forEach((point) => {
          let seriesName = point.series.name;
          let value = point.y;
          if (seriesName === "totalNewlyAddedCodesCount") {
            tooltip += `<span style="color:${point.color}">\u25CF</span> ${seriesName}: ${value}<br/>`;
          } else {
            tooltip += `<span style="color:${point.color}">\u25CF</span> ${seriesName}: ${value}<br/>`;
          }
        });

        return tooltip;
      },
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
        name: "totalNewlyAddedCodesCount",
        data: valueThree,
        color: "#0b59f1",
        yAxis: 1,
      },
      // {
      // name: "totalWrongCount",
      // data: getGraphData(
      // QualityAccuracyDatas?.data?.response,
      // "totalWrongCount",
      // selectedMonth,
      // selectedYear,
      // currentBtn,
      // currentDate
      // ),
      // color: "red",
      // yAxis: 1,
      // },
      {
        name: "machineAvgScore",
        type: "spline",
        data: valueFour,
        tooltip: {
          valueSuffix: "",
        },
        yAxis: 0,
      },
    ],
  };

  const allAverageScore = chartBlockedDates(
    selectedYear,
    selectedMonth,
    accuracyDatas?.data?.response,
    "averageScore",
    currentBtn,
    currentDate
  );
  const numericalData = allAverageScore?.filter((value) => value !== false); // Filter out false values
  const sum = numericalData?.reduce((acc, value) => acc + value, 0); // Sum the numerical values
  const averageAccuracy = sum / numericalData?.length; // Calculate the average

  const allAverageQualityScore = chartBlockedDates(
    selectedYear,
    selectedMonth,
    QualityAccuracyDatas?.data?.response,
    "averageScore",
    currentBtn,
    currentDate
  );
  const numericalQualityData = allAverageQualityScore?.filter(
    (value) => value !== false
  ); // Filter out false values
  const qualiotySum = numericalQualityData?.reduce(
    (acc, value) => acc + value,
    0
  ); // Sum the numerical values
  const averageQuality = qualiotySum / numericalQualityData?.length; // Calculate the average
  return (
    <>
      <div className={styles.card3}>
        <div className="d-flex justify-content-between">
          <div style={{ width: "50%" }}>
            <HeadTitle
              header="Accuracy and Quality Insights"
              fontSize="20px"
              margin="0px"
            />
          </div>
          <div className="d-flex">
            <div className={styles.btnScroller}>
              <Buttonscroller
                Buttons={TabButtons}
                handleButtonClick={handleTabButtonClick}
                activeButton={activeTabButton}
                activeColor="#fff"
                inActiveColor="
#000000"
                activeBg="#043069"
                inActiveBg="
#E6EEFF"
                containerBg="
#E6EEFF"
                width="150px"
              />
            </div>
          </div>
        </div>
        <div className={styles.header}>
          <div style={{ width: "85%", overflowX: "scroll" }}>
            {accuracyDatas?.loading || QualityAccuracyDatas?.loading ? (
              <div className={spinSTYles.spinStyle}>
                <Spin loading={accuracyDatas?.loading} />
              </div>
            ) : getAccuracyWorkflow?.response ? (
              currentTabBtn === "CogentAI Accuracy" ? (
                // <ReactECharts
                // option={option}
                // style={{
                // width: "100%",
                // height: "340px",
                // marginTop: "-30px",
                // overflowX: "hidden",
                // }}
                // />
                <div className={styles.highchartStyle}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={config2}
                    className={styles.hightchartStyles}
                  />
                </div>
              ) : (
                <div className={styles.highchartStyle}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={config}
                    className={styles.hightchartStyles}
                  />
                </div>
              )
            ) : (
              <div className={spinSTYles.spinStyle}>
                <Empty />
              </div>
            )}
          </div>
          <div className={styles.accuracy}>
            <div className={styles.header}>
              <Image src={accuracy} className={styles.Img} />
              <div className={styles.heading}>
                {currentTabBtn === "CogentAI Accuracy"
                  ? "Accuracy"
                  : "Average Score"}
              </div>
            </div>
            <div className={styles.month}>
              {currentBtn === "Daily"
                ? `Day ${currentDate.getDate()}`
                : currentBtn === "Monthly"
                ? `Month ${monthNames[currentDate.getMonth()]}`
                : `Week ${getDateWeek(currentDate)}`}
              {currentBtn !== "Monthly" && (
                <span className={styles.subTitle}></span>
              )}
            </div>
            <div className={styles.percentage}>
              <span className={styles.insideTitle}>
                {currentTabBtn === "CogentAI Accuracy" ? (
                  <>
                    {averageAccuracy ? `${averageAccuracy?.toFixed(2)}%` : "0%"}
                  </>
                ) : (
                  <>
                    {averageQuality ? `${averageQuality?.toFixed(2)}%` : "0%"}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getAccuracyWorkflow:
      state?.tenantAdmin?.dashboard?.workFlow?.getAccuracyWorkflow?.data,
  }),
  {}
);

export default enhancer(Accuracy);
