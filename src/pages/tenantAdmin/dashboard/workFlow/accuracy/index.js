import React, { useEffect, useState } from "react";
import Buttonscroller from "../../../../../components/buttonSroller";
import accuracy from "../../../../../images/dashboard/accuracy.png";
import Image from "next/image";
import styles from "./styles.module.css";
import HeadTitle from "../../../../../components/headtitle";
import { Empty, Spin } from "antd";
import spinSTYles from "../../../../../styles/auth.module.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Skeleton } from "antd";
import { connect } from "react-redux";
import {
  getAllDatesInRange,
  getLast30Days,
  getLast7Days,
} from "../../../../../utils/reusable";
import AccuracyChart from "./chart";

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
const Accuracy = ({
  getAccuracyWorkflow,
  dateRange,
  selectedOrganization,
  selectedValue,
  customDate,
  getAccuracyWorkflowLoader,
}) => {
  const [activeTabButton, setActiveTabButton] = useState(0);
  const [currentTabBtn, setCurrentTabBtn] = useState("CogentAI Accuracy");

  const [xdata, setXData] = useState([]);
  const [OrgTotalCode, setOrgTotalCode] = useState([]);
  const [OrgRevScore, setOrgRevScore] = useState([]);
  const [AccuracyTotalCode, setAccuracyTotalCode] = useState([]);
  const [AccEngineScore, setAccEngineScore] = useState([]);
  const [averageReviewerScore, setAverageReviewerScore] = useState(0);
  const [averageEngineScore, setAverageEngineScore] = useState(0);

  const handleTabButtonClick = (index, btn) => {
    setActiveTabButton(index);
    setCurrentTabBtn(btn);
  };

  useEffect(() => {
    const fetchDates = async () => {
      const dates = getAllDatesInRange(
        dateRange.startDate,
        dateRange.endDate,
        selectedOrganization
      );
      setXData(dates);
      setOrgTotalCode([]);
      setOrgRevScore([]);
      setAccuracyTotalCode([]);
      setAccEngineScore([]);
    };

    fetchDates();
  }, [dateRange, selectedOrganization]);

  useEffect(() => {
    if (getAccuracyWorkflow?.response && xdata) {
      const OrgTotalCode = [];
      const OrgRevScore = [];
      const AccuracyTotalCode = [];
      const AccEngineScore = [];

      let reviewerTotalScore = 0;
      let reviewerCount = 0;
      let machineTotalScore = 0;
      let machineCount = 0;

      xdata.forEach((date) => {
        const foundItem = getAccuracyWorkflow.response.find(
          (item) => item.date === date
        );

        const totalNewlyAddedCodesCount = foundItem
          ? foundItem.totalNewlyAddedCodesCount
          : 0;

        OrgTotalCode.push(totalNewlyAddedCodesCount);
        OrgRevScore.push(foundItem ? foundItem.reviewerAvgScore : 100);
        AccuracyTotalCode.push(totalNewlyAddedCodesCount);
        AccEngineScore.push(foundItem ? foundItem.machineAvgScore : 100);

        if (foundItem) {
          reviewerTotalScore += foundItem.reviewerAvgScore;
          reviewerCount++;
          machineTotalScore += foundItem.machineAvgScore;
          machineCount++;
        }
      });

      const averageReviewerScore =
        reviewerCount > 0 ? reviewerTotalScore / reviewerCount : 0;
      const averageEngineScore =
        machineCount > 0 ? machineTotalScore / machineCount : 0;

      setOrgTotalCode(OrgTotalCode);
      setOrgRevScore(OrgRevScore);
      setAccuracyTotalCode(AccuracyTotalCode);
      setAccEngineScore(AccEngineScore);
      setAverageReviewerScore(averageReviewerScore);
      setAverageEngineScore(averageEngineScore);
    }
  }, [getAccuracyWorkflow?.response, xdata]);

  let data = [];

  const totalCodes = AccuracyTotalCode;
  const config = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: (() => {
        if (selectedValue === "custom") {
          return customDate;
        } else if (selectedValue === "last_1_week") {
          return getLast7Days();
        } else {
          const last30Days = getLast30Days();
          last30Days.push("");
          return last30Days;
        }
      })(),
      crosshair: true,
      labels: {
        formatter: function () {
          const categories = this.axis.categories;
          const index = categories.indexOf(this.value);
          const totalCategories = categories.length;

          if (selectedValue === "last_1_week") {
            return this.value.length > 10
              ? this.value.slice(0, 10) + "..."
              : this.value;
          } else {
            if (
              index === 0 ||
              index === totalCategories - 1 ||
              index === Math.floor(totalCategories / 2)
            ) {
              return this.value.length > 10
                ? this.value.slice(0, 10) + "..."
                : this.value;
            }
            if (index % 2 === 0) {
              return this.value.length > 10
                ? this.value.slice(0, 10) + "..."
                : this.value;
            }
            return "";
          }
        },
        style: {
          color: "gray",
          fontWeight: "900",
          fontSize: "12px",
          whiteSpace: "nowrap",
        },
        rotation: 0,
        align: "center",
        x: 2,
        y: 20,
        step:
          selectedValue === "last_1_week"
            ? 1
            : selectedValue === "custom"
            ? 15
            : 2,
      },
      lineColor: "#d9d9d9",
      minPadding: 0.1,
      maxPadding: 0.1,
    },
    yAxis: [
      {
        tickPositions: [0, 25, 50, 75, 100],
        title: {
          text: "Accuracy Changes Count",
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
        name: "Total Codes Count",
        data: AccuracyTotalCode,
        color: "#0b59f1",
        yAxis: 1,
      },
      {
        name: "Engine Score",
        type: "spline",
        data: AccEngineScore,
        tooltip: {
          valueSuffix: "",
        },
        yAxis: 0,
      },
    ],
  };
  
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
                inActiveColor="#000000"
                activeBg="#043069"
                inActiveBg="#E6EEFF"
                containerBg="#E6EEFF"
                width="150px"
              />
            </div>
          </div>
        </div>
        <div className={styles.header}>
          <div style={{ width: "85%", overflowX: "scroll" }}>
            {getAccuracyWorkflowLoader ? (
              <Skeleton.Input
                className="w-100"
                style={{ height: "288px" }}
                active
              />
            ) : totalCodes.length > 0 ? (
              <>
                {currentTabBtn === "CogentAI Accuracy" ? (
                  <div className={styles.highchartStyle}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={config}
                      className={styles.hightchartStyles}
                    />
                  </div>
                ) : (
                  <AccuracyChart
                    selectedValue={selectedValue}
                    OrgTotalCode={OrgTotalCode}
                    OrgRevScore={OrgRevScore}
                    dateRange={dateRange}
                    customDate={customDate}
                  />
                )}
              </>
            ) : (
              <Empty className="mt-3" />
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
            <div className={styles.percentage}>
              <span className={styles.insideTitle}>
                {currentTabBtn === "CogentAI Accuracy" ? (
                  <>{`${averageEngineScore.toFixed(2)}%`}</>
                ) : (
                  <>{`${averageReviewerScore.toFixed(2)}%`}</>
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
    getAccuracyWorkflowLoader:
      state?.tenantAdmin?.dashboard?.workFlow?.getAccuracyWorkflowLoader,
    getAccuracyWorkflow:
      state?.tenantAdmin?.dashboard?.workFlow?.getAccuracyWorkflow?.data,
  }),
  {}
);

export default enhancer(Accuracy);
