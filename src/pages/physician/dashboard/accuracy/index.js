import React, { useEffect, useState } from "react";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../workingstatus";
import ReactECharts from "echarts-for-react";
import accuracy from "../../../../images/dashboard/accuracy.png";
import Image from "next/image";
import Card from "../../../../components/card/index";
import styles from "./styles.module.css";
import HeadTitle from "../../../../components/headtitle";
import { useDispatch, useSelector } from "react-redux";
import { getAccuracyScore } from "../../../../store/actions/DashboardActions";
import YearPicker from "../../../../components/yearpicker";
import { useRouter } from "next/router";
import { Empty, Spin } from "antd";
import spinSTYles from "../../../../styles/auth.module.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export const getISOWeekNumber = (date) => {
  const currentDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setDate(
    currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7)
  );
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((currentDate - startOfYear) / 86400000 + 1) / 7
  );

  return weekNumber;
};
export const getDateWeek = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeek = firstDayOfMonth.getDay();
  const currentDate = date.getDate();
  const startingWeek = Math.ceil((currentDate + firstDayWeek) / 7);
  return startingWeek;
};

export const getDays = (datasLength) => {
  const totalDaysInMonth = datasLength;
  if (datasLength) {
    return Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  } else {
    return [];
  }
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
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const dispatch = useDispatch();
  const accuracyDatas = useSelector((state) => state?.workFlow?.accuracy);
  const numberOfWeeks =
    accuracyDatas?.data?.response &&
    Object.keys(accuracyDatas?.data?.response)?.length;

  const weekNames = Array.from(
    { length: numberOfWeeks },
    (_, index) => `Week ${index + 1}`
  );

  const router = useRouter();
  useEffect(() => {
    dispatch(getAccuracyScore(currentBtn, selectedMonth, selectedYear, router));
  }, [currentBtn, selectedMonth, selectedYear]);

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
  // const option = {
  //   xAxis: {
  //     type: "category",
  //     data: xAxisData,
  //   },
  //   yAxis: {
  //     type: "value",
  //   },
  //   tooltip: {
  //     show: true,

  //     formatter: function (params) {
  //       let tooltipContent = "";

  //       if (Array.isArray(params)) {
  //         params.forEach((item) => {
  //           const allocatedValue = Number(item.data).toFixed(2);
  //           tooltipContent += `accuracy: ${allocatedValue}%<br>`;
  //         });
  //       } else if (params.data) {
  //         const allocatedValue = Number(params.data).toFixed(2);
  //         tooltipContent += `accuracy: ${allocatedValue}%<br>`;
  //       }

  //       return tooltipContent;
  //     },
  //   },
  //   series: [
  //     {
  //       data: data,
  //       type: "bar",
  //       itemStyle: {
  //         barBorderRadius: [10, 10, 0, 0],
  //         color: function (params) {
  //           return params.dataIndex === highlightIndex ? "#3479FE" : "#C2D5FF";
  //         },
  //       },
  //       lineStyle: {
  //         color: "#BD83B8",
  //       },
  //       showSymbol: false,
  //     },
  //   ],
  // };
  const option = {
    title: {
      text: "",
    },
    xAxis: [
      {
        categories: ["2019", "2020", "2021"],
        crosshair: true,
        labels: {
          style: {
            color: "gray",
            fontWeight: "500",
          },
        },
        lineColor: "#d9d9d9",
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value}°C",
          style: {
            color: "gray",
            fontWeight: "500",
          },
        },
        title: {
          text: "",
          style: {
            color: "gray",
            fontWeight: "500",
          },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: "",
        },
        labels: {
          format: "{value} mm",
          style: {
            color: "gray",
            fontWeight: "500",
          },
        },
        opposite: true,
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
        return (
          "<b>" +
          this.key +
          "</b><br/>" +
          this.series.name +
          ": " +
          this.y +
          "<br/>" +
          "Total: " +
          this.point.stackTotal
        );
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },
    series: [
      {
        name: "Road",
        type: "column",
        yAxis: 1,
        data: [434, 290, 307],
        tooltip: {
          valueSuffix: " mm",
        },
      },
      {
        name: "Rail",
        type: "column",
        yAxis: 1,
        data: [272, 153, 156],
        tooltip: {
          valueSuffix: " mm",
        },
      },
      {
        name: "Air",
        type: "column",
        yAxis: 1,
        data: [13, 7, 8],
        tooltip: {
          valueSuffix: " mm",
        },
      },
      {
        name: "Sea",
        type: "column",
        yAxis: 1,
        data: [55, 35, 41],
        tooltip: {
          valueSuffix: " mm",
        },
      },
      {
        name: "Temperature",
        type: "spline",
        data: [13.6, 14.9, 5.8],
        tooltip: {
          valueSuffix: "°C",
        },
      },
    ],
  };

  return (
    <>
      <HeadTitle header="Accuracy Score" />
      <div className={styles.card3}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
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
                activeBg="#3479FE"
                inActiveBg="
                #E6EEFF"
                containerBg="
                #E6EEFF"
              />
            </div>
          </div>
          <div className={styles.header}>
            <div style={{ width: "85%", overflowX: "scroll" }}>
              {accuracyDatas?.loading ? (
                <div className={spinSTYles.spinStyle}>
                  <Spin loading={accuracyDatas?.loading} />
                </div>
              ) : accuracyDatas?.loading === false &&
                accuracyDatas?.data?.response ? (
                option && (
                  <div className={styles.highchartStyle}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={option}
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
                <div className={styles.heading}>Accuracy</div>
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
                  {accuracyDatas?.data?.response
                    ? `${accuracyDatas?.data?.response[highlightIndex + 1]}%`
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
