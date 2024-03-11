import React, { useEffect, useState } from "react";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../../physician/workingstatus";
import ReactECharts from "echarts-for-react";
import accuracy from "../../../../images/dashboard/accuracy.png";
import Image from "next/image";
import Card from "../../../../components/card/index";
import styles from "./styles.module.css";
import HeadTitle from "../../../../components/headtitle";
import { useDispatch, useSelector } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import { useRouter } from "next/router";
import { Empty, Spin, Select } from "antd";
import spinSTYles from "../../../../styles/auth.module.css";
import moment from "moment";
import {
  getAccuracyDaily,
  getAccuracyMOnthly,
  getAccuracyWeekly,
} from "../../../../services/adminServices/DashboardService";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { getAccuracyScore } from "../../../../store/actions/DashboardActions";

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
  var currentWeek = moment().isoWeek().toString();
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

const Accuracy = () => {
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const [activeTabButton, setActiveTabButton] = useState(0);
  const [currentTabBtn, setCurrentTabBtn] = useState("CogentAI Accuracy");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const dispatch = useDispatch();
  const accuracyDatas = useSelector(
    (state) => state?.AdminDashboardReducers?.accuracy
  );
  const QualityAccuracyDatas = useSelector(
    (state) => state?.workFlow?.accuracy
  );

  const numberOfWeeks =
    accuracyDatas?.data?.response &&
    Object.keys(accuracyDatas?.data?.response)?.length;

  const weekNames = Array.from(
    { length: numberOfWeeks },
    (_, index) => `Week ${index + 1}`
  );
  const router = useRouter();

  const handleButtonClick = (index, btn) => {
    setActiveButton(index);
    setCurrentBtn(btn);
  };

  const handleTabButtonClick = (index, btn) => {
    setActiveTabButton(index);
    setCurrentTabBtn(btn);
    // setActiveButton(0);
    // setCurrentBtn("Daily");
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
    xAxisData = getDays(
      accuracyDatas?.data?.response &&
        Object.keys(accuracyDatas?.data?.response)?.length
    );
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

  let highlightIndex = -1;
  if (currentBtn === "Monthly") {
    highlightIndex = currentDate.getMonth();
  } else if (currentBtn === "Daily") {
    highlightIndex = currentDate.getDate() - 1;
  } else if (currentBtn === "Weekly") {
    const currentWeek = getDateWeek(currentDate);

    highlightIndex = currentWeek - 1;
  }

  let data = [];
  if (currentBtn && accuracyDatas?.data?.response) {
    data = Object.values(accuracyDatas?.data?.response);
  }

  const chartBlockedDates = (year, month, param, val, currentBtn) => {
    year = Number(year);
    month = Number(month);
    if (year < currentDate.getFullYear()) {
      return param?.data?.response.map((item) => item[val]);
    } else if (
      year == currentDate.getFullYear() &&
      month < currentDate.getMonth() + 1
    ) {
      return param?.data?.response.map((item) => item[val]);
    } else if (
      year == currentDate.getFullYear() &&
      month == currentDate.getMonth() + 1
    ) {
      if (currentBtn == "Daily") {
        return param?.data?.response.map(
          (item, index) => index < new Date().getDate() && item[val]
        );
      } else if (currentBtn == "Weekly") {
        return param?.data?.response.map(
          (item, index) => index < getDateWeek(currentDate) && item[val]
        );
      } else if(currentBtn == "Monthly"){
        return param?.data?.response.map(
          (item, index) => index < new Date().getMonth()+1 && item[val]
        );
      }
     
    } else {
      return false;
    }
  };

  const chartBlocked = (year, month, param) => {
    year = Number(year);
    month = Number(month);
    if (year < currentDate.getFullYear()) {
      return param.map((item) => item);
    } else if (
      year == currentDate.getFullYear() &&
      month < currentDate.getMonth() + 1
    ) {
      return param.map((item) => item);
    } else if (
      year == currentDate.getFullYear() &&
      month == currentDate.getMonth() + 1
    ) {
      return param.map((item, index) => index < new Date().getDate() && item);
    } else {
      return false;
    }
  };

  const option = {
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    tooltip: {
      show: true,

      formatter: function (params) {
        let tooltipContent = "";

        if (Array.isArray(params)) {
          params.forEach((item) => {
            const allocatedValue = Number(item.data).toFixed(2);
            tooltipContent += `accuracy: ${allocatedValue}%<br>`;
          });
        } else if (params.data) {
          const allocatedValue = Number(params.data).toFixed(2);
          tooltipContent += `accuracy: ${allocatedValue}%<br>`;
        }

        return tooltipContent;
      },
    },
    series: [
      {
        data: chartBlocked(selectedYear, selectedMonth, data),
        type: "bar",
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0],
          color: function (params) {
            return params.dataIndex === highlightIndex ? "#3479FE" : "#C2D5FF";
          },
        },
        lineStyle: {
          color: "#BD83B8",
        },
        showSymbol: false,
      },
    ],
  };

  const config = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },

    xAxis: {
      categories: xAxisData,
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
        // primary yAxis (right)
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
      },
      {
        // Secondary yAxis (right)
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
        // min: 0,
        // max: 10,
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
      formatter: function () {
        let finalData;
        if (
          typeof this.point.category === "string" &&
          this.point.category.startsWith("Week")
        ) {
          const weekIndex = parseInt(this.point.category.substring(4));

          finalData = QualityAccuracyDatas?.data?.response?.find(
            (item) => item?.weekOfMonth === weekIndex
          );
        } else if (
          typeof this.point.category === "string" &&
          monthNames.includes(this.point.category.toUpperCase())
        ) {
          const hoveredMonthIndex = monthNames?.findIndex(
            (month) => month === this.point.category
          );

          finalData = QualityAccuracyDatas?.data?.response?.find(
            (item) => item?.monthOfYear === hoveredMonthIndex + 1
          );
        } else {
          finalData = QualityAccuracyDatas?.data?.response?.find(
            (item) => item?.dayOfMonth === this.x
          );
        }

        if (finalData) {
          return (
            "Average Score: " +
            finalData.averageScore +
            "<br/>" +
            "Total Correct: " +
            finalData.totalCorrectCount +
            "<br/>" +
            "Total Wrong: " +
            finalData.totalWrongCount
          );
        } else {
          return "No data available";
        }
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
      // {
      //   name: "averageScore",
      //   data: accuracyDatas?.data?.response.map((item) => item.averageScore),
      //   color: "#cc0000",
      // },
      {
        name: "totalCorrectCount",
        data: QualityAccuracyDatas?.data?.response?.map(
          (item) => item?.totalCorrectCount
        ),
        color: "#0b59f1",
        yAxis: 1,
      },
      {
        name: "totalWrongCount",
        data: QualityAccuracyDatas?.data?.response?.map(
          (item) => item.totalWrongCount
        ),
        color: "red",
        yAxis: 1,
      },
      {
        name: "Temperature",
        type: "spline",
        // data: QualityAccuracyDatas?.data?.response.map(
        //   (item) => item?.averageScore
        // ),
        data: chartBlockedDates(
          selectedYear,
          selectedMonth,
          QualityAccuracyDatas,
          "averageScore",
          currentBtn
        ),
        tooltip: {
          valueSuffix: "",
        },
        yAxis: 0,
      },
    ],
  };
  useEffect(() => {
    console.log(currentTabBtn, currentBtn, "test");
    if (currentTabBtn === "CogentAI Accuracy") {
      if (currentBtn === "Daily") {
        dispatch(getAccuracyDaily(selectedYear, selectedMonth));
      }
      if (currentBtn === "Weekly") {
        dispatch(getAccuracyWeekly(selectedYear, selectedMonth));
      }
      if (currentBtn === "Monthly") {
        dispatch(getAccuracyMOnthly(selectedYear));
      }
    } else {
      const isAdmin = true;
      dispatch(
        getAccuracyScore(
          currentBtn,
          selectedMonth,
          selectedYear,
          router,
          isAdmin
        )
      );
    }
  }, [currentBtn, selectedMonth, selectedYear, router, currentTabBtn]);

  return (
    <>
      <HeadTitle header="Accuracy and Quality Insights" />
      <div className={styles.card3}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <div className={`d-flex ${styles.selectContainer}`}>
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
            <div className="d-flex">
              <div className={styles.picker}>
                <YearPicker
                  onChange={handleYearChange}
                  type={"year"}
                  bgColor="#E6EEFF"
                />
                {currentBtn !== "Monthly" && (
                  <YearPicker
                    onChange={handleMonthChange}
                    type={"month"}
                    bgColor="#E6EEFF"
                  />
                )}
              </div>
              <div className={styles.btnScroller}>
                <Buttonscroller
                  Buttons={Buttons}
                  handleButtonClick={handleButtonClick}
                  activeButton={activeButton}
                  activeColor="#fff"
                  inActiveColor="
                #000000"
                  activeBg="#04306f"
                  inActiveBg="
                #E6EEFF"
                  containerBg="
                #E6EEFF"
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
              ) : accuracyDatas?.loading === false &&
                accuracyDatas?.data?.response ? (
                currentTabBtn === "CogentAI Accuracy" ? (
                  <ReactECharts
                    option={option}
                    style={{
                      width: "100%",
                      height: "340px",
                      marginTop: "-30px",
                      overflowX: "hidden",
                    }}
                  />
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
              </div>

              <div className={styles.percentage}>
                <span className={styles.insideTitle}>
                  {currentTabBtn === "CogentAI Accuracy"
                    ? accuracyDatas?.data?.response &&
                      accuracyDatas?.data?.response[highlightIndex + 1]
                      ? `${Math.round(
                          accuracyDatas?.data?.response[highlightIndex + 1]
                        )}%`
                      : "0%"
                    : QualityAccuracyDatas?.data?.response &&
                      QualityAccuracyDatas?.data?.response[highlightIndex]
                    ? `${Math.round(
                        QualityAccuracyDatas?.data?.response[highlightIndex]
                          ?.averageScore
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Accuracy;
