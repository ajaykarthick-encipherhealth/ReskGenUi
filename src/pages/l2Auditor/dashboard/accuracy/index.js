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
import {
  getAccuracyScore,
  getAccuracyScoreNew,
  getUserByIndividual,
} from "../../../../store/actions/l2Action/DashboardAction";
import { Empty, Spin, Select } from "antd";
import spinSTYles from "../../../../styles/auth.module.css";
import moment from "moment";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

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
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectMemberType, setSelectMemberType] = useState("TEAM");
  const [selectUser, setSelectUser] = useState([]);
  const [isindividual, setIsindividual] = useState(false);
  const dispatch = useDispatch();
  const accuracyDatas = useSelector((state) => state?.l2Dashboard?.accuracy);
  const individualUserList = useSelector(
    (state) => state?.l2Dashboard?.individualUser
  );
  const numberOfWeeks =
    accuracyDatas?.data?.response?.mapAccuracy &&
    Object.keys(accuracyDatas?.data?.response?.mapAccuracy)?.length;

  const weekNames = Array.from(
    { length: numberOfWeeks },
    (_, index) => `Week ${index + 1}`
  );
  const router = useRouter();

  const options = [
    { value: "TEAM", label: "TEAM" },
    { value: "INDIVIDUAL", label: "INDIVIDUAL" },
  ];
  const optionsUser = [];

  const individualUserRes = individualUserList?.data?.response?.map((res) =>
    optionsUser.push({
      value: res.userName,
      label: res.firstName + " " + res.lastName,
    })
  );

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
    dispatch(getUserByIndividual());
  }, [selectMemberType]);

  useEffect(() => {
    dispatch(
      getAccuracyScoreNew(
        currentBtn.toUpperCase(),
        currentDate.getDate(),
        selectedMonth,
        selectedYear,
        router,
        selectMemberType,
        selectUser
      )
    );
  }, [currentBtn, selectedMonth, selectedYear, selectMemberType, selectUser]);

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
      accuracyDatas?.data?.response?.mapAccuracy &&
        Object.keys(accuracyDatas?.data?.response?.mapAccuracy)?.length
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
  if (currentBtn && accuracyDatas?.data?.response?.mapAccuracy) {
    data = Object.values(accuracyDatas?.data?.response?.mapAccuracy);
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
    chart: {
      zoomType: "xy",
    },
    title: {
      text: "",
    },

    xAxis: [
      {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        crosshair: true,
        labels: {
          style: {
            color: "gray",
            fontWeight: "500",
          },
        },
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
          // style: {
          // color:"#d9d9d9",
          // },
          // show:false
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
    tooltip: {
      shared: true,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Precipitation",
        type: "column",
        yAxis: 1,
        data: [
          27.6, 28.8, 21.7, 34.1, 29.0, 28.4, 45.6, 51.7, 39.0, 60.0, 28.6,
          32.1,
        ],
        tooltip: {
          valueSuffix: " mm",
        },
      },
      {
        name: "Temperature",
        type: "spline",
        data: [
          -13.6, -14.9, -5.8, -0.7, 3.1, 13.0, 14.5, 10.8, 5.8, -0.7, -11.0,
          -16.4,
        ],
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
            <div className={`d-flex ${styles.selectContainer}`}>
              <div className={styles.select}>
                <Select
                  value={selectMemberType}
                  onChange={(e) => memberTypeChanges(e)}
                  className={`custom_select_type ${styles.custom_select_type}`}
                  options={options}
                  style={{ backgroundColor: "#F3F3FF" }}
                />
              </div>
              {isindividual ? (
                <div className={styles.select}>
                  <Select
                    showSearch
                    placeholder="Select User"
                    className={`custom_select_user ${styles.custom_select_user}`}
                    onChange={(e) => onChangeUser(e)}
                    options={optionsUser}
                  />
                </div>
              ) : null}
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
                  activeBg="#3479FE"
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
              {accuracyDatas?.loading ? (
                <div className={spinSTYles.spinStyle}>
                  <Spin loading={accuracyDatas?.loading} />
                </div>
              ) : accuracyDatas?.loading === false &&
                accuracyDatas?.data?.response?.mapAccuracy ? (
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
                  {accuracyDatas?.data?.response?.mapAccuracy &&
                  accuracyDatas?.data?.response?.mapAccuracy[highlightIndex + 1]
                    ? `${
                        accuracyDatas?.data?.response?.mapAccuracy[
                          highlightIndex + 1
                        ]
                      }%`
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