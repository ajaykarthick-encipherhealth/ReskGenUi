import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import Image from "next/image";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Empty, Spin, Select, Skeleton } from "antd";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../../reviewer/workingstatus";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { connect } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import spinSTYles from "../../../../styles/auth.module.css";
import {
  chartBlockedDates,
  getGraphData,
} from "../../../admin/dashboard/accuracy";
import { renderCardSkeleton } from "../../../reviewer/dashboard/accuracy";
import { actions as dashbaordActions } from "../../../../stores/supervisor/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import CardSkeleton from "../../../../components/skeleton/card";

export const getDateWeek = ({ date, accuracyDatass }) => {
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

const Accuracy = ({
  accuracyDatas,
  getAccuracyScore,
  getUserByIndividual,
  individualDetails,
  accuracyLoading,
}) => {
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const [initialAccuracyData, setInitialAccuracyData] = useState(null);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectMemberType, setSelectMemberType] = useState("TEAM");
  const [selectUser, setSelectUser] = useState([]);
  const [isindividual, setIsindividual] = useState(false);
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [optionsUser, setOptionUser] = useState([]);
  const userOption = () => {
    const res = individualDetails?.data?.response.map((item) => {
      return {
        label: item.firstName + " " + item.lastName,
        value: item.userName,
      };
    });
    setOptionUser(res);
  };
  const numberOfWeeks =
    accuracyDatas?.data?.response &&
    Object?.keys(accuracyDatas?.data?.response)?.length;

  const weekNames = Array.from(
    { length: numberOfWeeks },
    (_, index) => `Week ${index + 1}`
  );
  const router = useRouter();

  const options = [
    { value: "TEAM", label: "TEAM" },
    { value: "INDIVIDUAL", label: "INDIVIDUAL" },
  ];

  const memberTypeChanges = (e) => {
    setSelectMemberType(e);
    setIsindividual(false);
    setSelectUser([]);
    if (e == "INDIVIDUAL") {
      setIsindividual(true);
    }
  };

  const onChangeUser = (e) => {
    setSelectUser([e]);
  };

  useEffect(() => {
    getUserByIndividual();
  }, [selectMemberType]);

  useEffect(() => {
    if (individualDetails?.data?.response) {
      userOption();
    }
  }, [individualDetails]);

  useEffect(() => {
    getAccuracyScore({
      btn: currentBtn.toUpperCase(),
      date: currentDate.getDate(),
      month: selectedMonth,
      year: selectedYear,
      user: selectUser,
    });
    getUserByIndividual();
  }, [currentBtn, selectedMonth, selectedYear, selectMemberType, selectUser]);

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

  const option = {
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
          text: "Changes Count",
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
        min: 0,
        max: 10,
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

          finalData = accuracyDatas?.data?.response?.find(
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
            "NewlyAddedCodesCount: " +
            finalData.newlyAddedCodesCount +
            "<br/>" +
            "IncorrectCodesCount: " +
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
          accuracyDatas?.data?.response?.length > 0
            ? accuracyDatas?.data?.response
            : [],
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
  const numericalData =
    allAverageScore?.length > 0
      ? allAverageScore?.filter((value) => value)?.flat()
      : [];
  const sum =
    numericalData?.length > 0
      ? numericalData?.reduce((acc, value) => acc + value, 0)
      : 0;
  const average = sum > 0 ? sum / numericalData?.length : 0;
  return (
    <>
      <HeadTitle header="Team Quality Score" />
      <div className={styles.card3}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <div className={`d-flex ${styles.selectContainer}`}>
              <div id="member-select" name="member-select" className={styles.select}>
                <Select
                 data-testid="select-member"
                 name="select-member"
                  value={selectMemberType}
                  onChange={(e) => memberTypeChanges(e)}
                  className={`custom_select_type ${styles.custom_select_type}`}
                  options={options}
                  style={{ backgroundColor: "#F3F3FF" }}
                />
              </div>
              {isindividual ? (
                <div  id="users-select" name="users-select" className={styles.select}>
                  <Select
                   id="select-users"
                   name="select-users"
                    showSearch
                    allowClear
                    placeholder="Select User"
                    className={`custom_select_user ${styles.custom_select_user}`}
                    onChange={(e) => onChangeUser(e)}
                    options={optionsUser}
                  />
                </div>
              ) : null}
            </div>
            <div className="d-flex">
              <div className={`mx-3 ${styles.picker}`}>
                <YearPicker
                  onChangeYear={handleYearChange}
                  onChangeMonth={handleMonthChange}
                  type={currentBtn}
                  bgColor="#E6EEFF"
                  val={month}
                  val1={year}
                  id="accuracy-picker1"
                  name="accuracy-picker1"
                  testid="accuracy-picker2"
                  testName="accuracy-picker2"
                />
              </div>
              <div className={styles.btnScroller}>
                <Buttonscroller
                  id="accuracy-btncontainer"
                  name="accuracy-btncontainer"
                  Buttons={Buttons}
                  handleButtonClick={handleButtonClick}
                  activeButton={activeButton}
                  activeColor="#fff"
                  inActiveColor="
                #000000"
                  activeBg="#04306f"
                  //   inActiveBg="
                  // #E6EEFF"
                  containerBg="
                #E6EEFF"
                />
              </div>
            </div>
          </div>
          <div className={styles.header}>
            <div style={{ width: "85%", overflowX: "scroll" }}>
              {accuracyLoading ? (
                <Skeleton
                  active
                  paragraph={{ rows: 4 }}
                  style={{ width: "700px", padding: "20px" }}
                />
              ) : accuracyDatas?.loading === false &&
                accuracyDatas?.data?.response?.length > 0 ? (
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
                <FontAwesomeIcon
                  className={`mt-1 ${styles.Img}`}
                  icon={faGaugeHigh}
                />
                <div className={styles.heading}>Quality</div>
              </div>
              <div className={styles.percentage}>
                <span className={styles.insideTitle}>
                  {accuracyLoading ? (
                    <>
                      <CardSkeleton height={40} />
                    </>
                  ) : (
                    <> {average ? `${Math.floor(average)}%` : `0%`}</>
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    accuracyDatas: state?.supervisor?.dashboard?.accuracy,
    accuracyLoading: state?.supervisor?.dashboard?.accuracyLoading,
    individualDetails: state?.supervisor?.dashboard?.individualUser,
  }),
  {
    getAccuracyScore: dashbaordActions.accuracyAction,
    getUserByIndividual: dashbaordActions.getUserByIndividualAction,
  }
);
export default enhancer(Accuracy);
