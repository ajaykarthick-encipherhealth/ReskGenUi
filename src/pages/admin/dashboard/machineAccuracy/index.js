import React, { useEffect, useState } from "react";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../../reviewer/workingstatus";
import ReactECharts from "echarts-for-react";
import accuracy from "../../../../images/dashboard/accuracy.png";
import Image from "next/image";
import Card from "../../../../components/card/index";
import styles from "./styles.module.css";
import HeadTitle from "../../../../components/headtitle";
import { connect, useDispatch, useSelector } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import { useRouter } from "next/router";
import { Empty, Skeleton, Spin } from "antd";
import spinSTYles from "../../../../styles/auth.module.css";
import {
  getAccuracyDaily,
  getAccuracyMOnthly,
  getAccuracyWeekly,
} from "../../../../services/adminServices/DashboardService";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { getAccuracyScore } from "../../../../store/actions/DashboardActions";
import { renderCardSkeleton } from "../../../reviewer/dashboard/accuracy";

export const TabButtons = [
  {
    id: 1,
    title: "CogentAI Accuracy",
  },
  // {
  //   id: 2,
  //   title: "Organization Quality",
  // },
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

export const getGraphData = (
  param,
  text,
  month,
  year,
  currentBtn,
  currentDate
) => {

  // if (data) {
  // const param = Object.values(data);
  if (
    currentBtn === "Monthly" &&
    parseInt(year) <= parseInt(currentDate.getFullYear())
  ) {
    if (parseInt(year) <= parseInt(currentDate.getFullYear())) {
      return param?.map((item) => 0);
    }
  } else if (currentBtn !== "Monthly") {
    if (parseInt(month) <= parseInt(currentDate?.getMonth() + 1)) {
      return param?.map((item) => 0);
    }
  }
  // } else {
  //   return []
  // }
};
export const chartBlockedDates = (
  year,
  month,
  data,
  val,
  currentBtn,
  currentDate
) => {
  if (data) {
    const param = Object.values(data);
    year = Number(year);
    month = Number(month);
    if (year < currentDate.getFullYear()) {
      return param?.map((item) => item);
    } else if (
      year == currentDate.getFullYear() &&
      month < currentDate.getMonth() + 1 &&
      currentBtn !== "Monthly"
    ) {
      return param?.map((item) => item);
    } else if (
      year == currentDate.getFullYear() &&
      month == currentDate.getMonth() + 1 &&
      currentBtn !== "Monthly"
    ) {
      if (currentBtn == "Daily") {
        return param?.map(
          (item, index) => index < new Date().getDate() && item
        );
      } else if (currentBtn == "Weekly") {
        return param?.map(
          (item, index) => index < getDateWeek(currentDate) && item
        );
      }
    } else if (year == currentDate.getFullYear() && currentBtn == "Monthly") {
      if (parseInt(year) > parseInt(currentDate.getFullYear())) {
        return false;
      } else {
        return param?.map(
          (item, index) => index < new Date().getMonth() + 1 && item
        );
      }
    } else {
      return [];
    }
  }
};
const MachineAccuracy = ({ accuracyDetails }) => {
  const [activeButton, setActiveButton] = useState(0);
  const [initialAccuracyData, setInitialAccuracyData] = useState(null);
  const [initialQualityData, setInitialQualityData] = useState(null);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const [activeTabButton, setActiveTabButton] = useState(0);
  const [currentTabBtn, setCurrentTabBtn] = useState("CogentAI Accuracy");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const dispatch = useDispatch();
  const accuracyDatas = useSelector(
    (state) => state?.AdminDashboardReducers?.accuracy
  );

  const numberOfWeeks =
    accuracyDetails?.data?.response &&
    Object.keys(accuracyDetails?.data?.response)?.length;

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
      accuracyDetails?.data?.response &&
        Object.keys(accuracyDetails?.data?.response)?.length
    );
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

  let highlightIndex = -1;

  if (currentBtn === "Monthly") {
    if (
      parseInt(selectedYear) === parseInt(new Date().getFullYear()) ||
      parseInt(selectedMonth) <= parseInt(currentDate.getMonth() + 1)
    ) {
      highlightIndex = currentDate.getMonth();
    }
  } else if (currentBtn === "Daily") {
    if (
      parseInt(selectedYear) === new Date().getFullYear() &&
      selectedMonth === new Date().getMonth() + 1
    ) {
      highlightIndex = currentDate.getDate() - 1;
    }
  } else if (currentBtn === "Weekly") {
    if (
      parseInt(selectedYear) === new Date().getFullYear() &&
      selectedMonth === new Date().getMonth() + 1
    ) {
      const currentWeek = getDateWeek(currentDate);
      highlightIndex = currentWeek - 1;
    }
  }

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
        gridLineWidth: 0,
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
        const data = Object.keys(accuracyDetails?.data?.response);
        if (
          typeof this.point.category == "string" &&
          this.point.category.startsWith("Week")
        ) {
          const weekIndex = parseInt(this.point.category.substring(4));

          finalData = data?.find((item) => item == weekIndex);
        } else if (
          typeof this.point.category == "string" &&
          monthNames.includes(this.point.category.toUpperCase())
        ) {
          const hoveredMonthIndex = monthNames?.findIndex(
            (month) => month == this.point.category
          );

          finalData = data?.find((item) => item == hoveredMonthIndex + 1);
        } else {
          // console.log(this.x);
          finalData = data?.find((item) => item == this.x);
        }

        if (finalData) {
          return (
            "Average Score: " +
            Object.values(accuracyDetails?.data?.response)[finalData - 1]
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
        name: "totalCorrectCount",
        data: getGraphData(
          initialQualityData,
          "totalCorrectCount",
          selectedMonth,
          selectedYear,
          currentBtn,
          currentDate
        ),
        color: "#0b59f1",
        yAxis: 1,
      },
      {
        name: "Temperature",
        type: "spline",

        data: chartBlockedDates(
          selectedYear,
          selectedMonth,
          accuracyDetails?.data?.response,
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
    const isAdmin = true;
    dispatch(
      getAccuracyScore(currentBtn, selectedMonth, selectedYear, router, isAdmin)
    );
    // }
  }, [currentBtn, selectedMonth, selectedYear, router, currentTabBtn]);
  useEffect(() => {
    if (accuracyDatas?.data?.response) {
      setInitialAccuracyData(accuracyDatas?.data?.response);
    }
    if (accuracyDetails?.data?.response) {
      setInitialQualityData(Object.values(accuracyDetails?.data?.response));
    }
  }, [accuracyDatas, accuracyDetails]);

  // const allAverageScore = chartBlockedDates(
  //   selectedYear,
  //   selectedMonth,
  //   accuracyDetails?.data?.response,
  //   "averageScore",
  //   currentBtn,
  //   currentDate
  // );
  // console.log(allAverageScore);
  // const numericalData = allAverageScore?.filter((value) => value !== false); // Filter out false values
  // const sum = numericalData?.reduce((acc, value) => acc + value, 0); // Sum the numerical values
  // const average = sum / numericalData?.length; // Calculate the average
  const average = 0;
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
          </div>
          <div className={styles.header}>
            <div style={{ width: "85%", overflowX: "scroll" }}>
              {accuracyDatas?.loading || accuracyDetails?.loading ? (
                <div>
                  <Skeleton
                    active
                    paragraph={{ rows: 5 }}
                    style={{ width: "800px", padding: "30px" }}
                  />
                </div>
              ) : accuracyDetails?.loading === false &&
                accuracyDetails?.data?.response ? (
                currentTabBtn === "CogentAI Accuracy" ? (
                  <div className={styles.highchartStyle}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={config}
                      className={styles.hightchartStyles}
                    />
                  </div>
                ) : (
                  // : accuracyDatas?.loading === false &&
                  //   accuracyDatas?.data?.response ? (
                  //   currentTabBtn === "CogentAI Accuracy" ? (
                  //     <ReactECharts
                  //       option={option}
                  //       style={{
                  //         width: "100%",
                  //         height: "340px",
                  //         marginTop: "-30px",
                  //         overflowX: "hidden",
                  //       }}
                  //     />
                  //     <div className={styles.highchartStyle}>
                  //       <HighchartsReact
                  //         highcharts={Highcharts}
                  //         options={config}
                  //         className={styles.hightchartStyles}
                  //       />
                  //     </div>
                  //   )
                  //   :
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
            {accuracyDatas?.loading || accuracyDetails?.loading ? (
              <div className={styles.accuracy}>{renderCardSkeleton(265, 250)}</div>
            ) : (
              <div className={styles.accuracy}>
                <div className={styles.header}>
                  <Image src={accuracy} className={styles.Img} />
                  <div className={styles.heading}>
                    {currentTabBtn === "CogentAI Accuracy"
                      ? "Accuracy"
                      : "Average Score"}
                  </div>
                </div>
                {/* <div className={styles.month}>
   {currentBtn === "Daily"
     ? `Day ${currentDate.getDate()}`
     : currentBtn === "Monthly"
     ? `Month ${monthNames[currentDate.getMonth()]}`
     : `Week ${getDateWeek(currentDate)}`}
   {currentBtn !== "Monthly" && (
     <span className={styles.subTitle}>(Current Month)</span>
   )}
 </div> */}

                <div className={styles.percentage}>
                  <span className={styles.insideTitle}>
                    {/* {currentTabBtn === "CogentAI Accuracy"
       ? initialAccuracyData
         ? currentBtn === "Monthly"
           ? `${initialAccuracyData[currentDate?.getMonth() + 1]}%`
           : currentBtn === "Daily"
           ? `${
               initialAccuracyData[currentDate?.getDate()]
                 ? initialAccuracyData[currentDate?.getDate()]
                 : 0
             }%`
           : `${initialAccuracyData[getDateWeek(currentDate)]}%`
         : "0%"
       : initialQualityData
       ? currentBtn === "Monthly"
         ? `${
             initialQualityData[currentDate?.getMonth()]
               ?.averageScore
           }%`
         : currentBtn === "Daily"
         ? `${
             initialQualityData[currentDate?.getDate() - 1]
               ?.averageScore
               ? initialQualityData[currentDate?.getDate() - 1]
                   ?.averageScore
               : 0
           }%`
         : `${
             initialQualityData[getDateWeek(currentDate) - 1]
               ?.averageScore
           }%`
       : "0%"} */}
                    {average ? `${average?.toFixed(2)}%` : `0%`}
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
    accuracyDetails: state.workFlow.accuracy,
  }),
  {}
);

export default enhancer(MachineAccuracy);
