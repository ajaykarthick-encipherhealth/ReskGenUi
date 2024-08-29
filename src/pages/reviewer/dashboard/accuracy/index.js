import React, { useEffect, useState } from "react";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../workingstatus";
import accuracy from "../../../../images/dashboard/accuracy.png";
import Image from "next/image";
import Card from "../../../../components/card/index";
import styles from "./styles.module.css";
import HeadTitle from "../../../../components/headtitle";
import { connect } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import { Col, Empty, Row, Skeleton, Spin } from "antd";
import spinSTYles from "../../../../styles/auth.module.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { actions as dashbaordActions } from "../../../../stores/reviewer/dashboard";
import {
  chartBlockedDates,
  getGraphData,
  getHighlightedIndex,
} from "../../../admin/dashboard/accuracy";

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
export const renderCardSkeleton = (width, height, borderRadius) => (
  <Row style={{ display: "flex", justifyContent: "space-between" }}>
    {Array.from({ length: 1 }).map((_, index) => (
      <Row>
        <Col span={12}>
          <div className={styles.container}>
            <Skeleton.Input
              style={{
                width: width,
                height: height,
                borderRadius: borderRadius,
              }}
              active
            />
          </div>
        </Col>
      </Row>
    ))}
  </Row>
);
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

const Accuracy = ({ accuracyDatas, getAccuracyScore, accuracyLoading }) => {
  const [activeButton, setActiveButton] = useState(0);
  const [initialAccuracyData, setInitialAccuracyData] = useState(null);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const numberOfWeeks =
    accuracyDatas?.data?.response &&
    Object.keys(accuracyDatas?.data?.response)?.length;

  const weekNames = Array.from(
    { length: numberOfWeeks },
    (_, index) => `Week ${index + 1}`
  );

  useEffect(() => {
    getAccuracyScore({
      btn: currentBtn,
      month: selectedMonth,
      year: selectedYear,
    });
  }, [currentBtn, selectedMonth, selectedYear]);

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

  const options = {
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
          text: "Quality",
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
          text: "Reviewer Changes Count",
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
        min: 0, // Set the minimum value
        max: 10, // Set the maximum value
        tickInterval: 4, // Set the tick interval to 1
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

          finalData = accuracyDatas?.data?.response?.find(
            (item) => item?.weekOfMonth === weekIndex
          );
        } else if (
          typeof this.point.category === "string" &&
          monthNames.includes(this.point.category.toUpperCase())
        ) {
          const hoveredMonthIndex = monthNames?.findIndex(
            (month) => month === this.point.category
          );

          finalData =
            accuracyDatas?.data?.response?.length > 0 &&
            accuracyDatas?.data?.response?.find(
              (item) => item?.monthOfYear === hoveredMonthIndex + 1
            );
        } else {
          finalData = accuracyDatas?.data?.response?.find(
            (item) => item?.dayOfMonth === this.x
          );
        }

        if (finalData) {
          return (
            "Average Score: " +
            finalData.averageScore +
            "<br/>" +
            "Total Correct: " +
            finalData.newlyAddedCodesCount +
            "<br/>" +
            "Total Wrong: " +
            finalData.incorrectCodesCount
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
      {
        name: "newlyAddedCodesCount",
        data: getGraphData(
          accuracyDatas?.data?.response,
          "newlyAddedCodesCount",
          selectedMonth,
          selectedYear,
          currentBtn,
          currentDate
        ),
        color: "#0b59f1",
        yAxis: 1,
      },
      {
        name: "incorrectCodesCount",
        data: getGraphData(
          accuracyDatas?.data?.response,
          "incorrectCodesCount",
          selectedMonth,
          selectedYear,
          currentBtn,
          currentDate
        ),

        color: "red",
        yAxis: 1,
      },
      {
        name: "Temperature",
        type: "spline",
        data: chartBlockedDates(
          selectedYear,
          selectedMonth,
          accuracyDatas?.data?.response,
          "averageScore",
          currentBtn,
          currentDate
        ),
        tooltip: {
          valueSuffix: "",
        },
        yAxis: 0,
      },
    ],
  };
  useEffect(() => {
    if (accuracyDatas?.data?.response) {
      setInitialAccuracyData(accuracyDatas?.data?.response);
    }
  }, [accuracyDatas]);
  const allAverageScore = chartBlockedDates(
    selectedYear,
    selectedMonth,
    accuracyDatas?.data?.response,
    "averageScore",
    currentBtn,
    currentDate
  );
  const numericalData = allAverageScore?.length>0 && allAverageScore?.filter((value) => value !== false); // Filter out false values
  const sum = numericalData&& numericalData?.reduce((acc, value) => acc + value, 0); // Sum the numerical values
  const average = sum / numericalData?.length; // Calculate the average

  return (
    <>
      <HeadTitle header="System Quality Score" />
      <div className={styles.card3}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <div className={styles.picker}>
              <YearPicker
                onChangeYear={handleYearChange}
                onChangeMonth={handleMonthChange}
                type={currentBtn}
                bgColor="#E6EEFF"
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
          <div className={styles.header}>
            <div style={{ width: "85%", overflowX: "scroll" }}>
              {accuracyDatas?.loading && accuracyLoading && (
                <div className={styles.highchartStyle}>
                  <Skeleton
                    active
                    paragraph={{ rows: 4 }}
                    style={{ width: "700px", padding: "40px" }}
                  />
                </div>
              )}
              {!accuracyDatas?.loading &&
              !accuracyLoading &&
              accuracyDatas?.data?.response ? (
                options && (
                  <div className={styles.highchartStyle}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={options}
                      className={styles.hightchartStyles}
                    />
                  </div>
                )
              ) : accuracyLoading ? (
                <div className={spinSTYles.highchartStyle}>
                  <Skeleton
                    active
                    paragraph={{ rows: 4 }}
                    style={{ width: "700px", padding: "40px" }}
                  />
                </div>
              ) : (
                <div className={spinSTYles.spinStyle}>{<Empty />}</div>
              )}
            </div>
            {accuracyLoading ? (
              <div className={styles.accuracy}>
                {renderCardSkeleton(220, 250)}
              </div>
            ) : (
              <div className={styles.accuracy}>
                <div className={styles.header}>
                  <Image src={accuracy} className={styles.Img} />
                  <div className={styles.heading}>Average Quality</div>
                </div>

                {/* <div className={styles.month}>
                {currentBtn === "Daily" && `Day ${currentDate.getDate()}`}
                {currentBtn === "Monthly" &&
                  `Month ${monthNames[currentDate.getMonth()]}`}
                {currentBtn === "Weekly" && `Week ${getDateWeek(currentDate)}`}
                {currentBtn !== "Monthly" && (
                  <span className={styles.subTitle}>(Current Month)</span>
                )}
              </div> */}

                <div className={styles.percentage}>
                  <span className={styles.insideTitle}>
                    {/* {initialAccuracyData
                    ? currentBtn === "Monthly"
                      ? `${
                          initialAccuracyData[currentDate?.getMonth()]
                            ?.averageScore
                        }%`
                      : currentBtn === "Daily"
                      ? `${
                          initialAccuracyData[currentDate?.getDate() - 1]
                            ?.averageScore
                            ? initialAccuracyData[currentDate?.getDate() - 1]
                                ?.averageScore
                            : 0
                        }%`
                      : `${
                          initialAccuracyData[getDateWeek(currentDate) - 1]
                            ?.averageScore
                        }%`
                    : "0%"} */}
                    {average ? `${average?.toFixed(2)}%` : "0%"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    accuracyDatas: state?.reviewer?.dashboard?.accuracy,
    accuracyLoading: state?.reviewer?.dashboard?.accuracyLoading,
  }),
  {
    getAccuracyScore: dashbaordActions.accuracyAction,
  }
);
export default enhancer(Accuracy);
