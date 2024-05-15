import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import Image from "next/image";
import { Select } from "antd";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../../reviewer/workingstatus";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { useDispatch, useSelector } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import {
  getAccuracyScoreNew,
  getUserByIndividual,
} from "../../../../store/actions/l2Action/DashboardAction";
import {
  chartBlockedDates,
  getGraphData,
} from "../../../admin/dashboard/accuracy";
import dayjs from "dayjs";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

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

const CompletedStatus = () => {
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
  const [chart, setChart] = useState(null);
  const [scoreChart, setScoreChart] = useState("daily");
  const dispatch = useDispatch();
  const accuracyDatas = useSelector((state) => state?.l2Dashboard?.accuracy);
  const individualDetails = useSelector(
    (state) => state?.l2Dashboard?.individualUser
  );
  const router = useRouter();

  const options = [
    { value: "TEAM", label: "TEAM" },
    { value: "INDIVIDUAL", label: "INDIVIDUAL" },
  ];

  const optionsUser = [
    { value: "Benjamin Mitchell", label: "Benjamin Mitchell" },
    { value: "Isabella Turner", label: "Isabella Turner" },
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
    dispatch(getUserByIndividual());
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

    useEffect(() => {
    if (currentBtn === "Monthly") {
      setScoreChart("monthly");
    } else if (currentBtn === "Daily") {
      setScoreChart("daily");
    } else if (currentBtn === "Weekly") {
      setScoreChart("weekly");
    }
  }, [currentBtn]);

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-project-1-hubxull",
      showAttribution: false,
      gridLines: false,
    });

    const chartId =
      scoreChart === "daily"
        ? "a955ceae-61d9-4e15-8252-1522897c5144"
        : scoreChart === "monthly"
        ? "6641f125-8094-43c1-8f44-4fed98bbdc26"
        : "3f8aa334-1264-4aa9-b0ff-1b3260d43950";

    const chart = sdk.createChart({
      chartId: chartId,
    });

    setChart(chart);
  }, [scoreChart]);

  useEffect(() => {
    const renderCharts = () => {
      if (chart) {
        chart.render(document.getElementById("demo-chart"));
      }
    };
    renderCharts();
  }, [chart]);
  return (
    <>
      <HeadTitle header="Team Quality Score" />
      <div className={styles.card5}>
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
          <div
            id="demo-chart"
            style={{
              height: 250,
              width: 1200,
            }}
          ></div>
          {/* <div className={styles.header}>
            <div style={{ width: "85%", overflowX: "scroll" }}>
              {accuracyDatas?.loading ? (
                <div className={spinSTYles.spinStyle}>
                  <Spin loading={accuracyDatas?.loading} />
                </div>
              ) : accuracyDatas?.loading === false &&
                accuracyDatas?.data?.response?.mapAccuracy?.length > 0 ? (
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
                <div className={styles.heading}>Quality</div>
              </div>
              <div className={styles.month}>
                {currentBtn === "Daily"
                  ? `Day ${currentDate.getDate()}`
                  : currentBtn === "Monthly"
                  ? `Month ${monthNames[currentDate.getMonth()]}`
                  : `Week ${getDateWeek(currentDate)}`}
                {currentBtn !== "Monthly" && (
                  <span className={styles.subTitle}>(Current Month)</span>
                )}
              </div>
              <div className={styles.percentage}>
                <span className={styles.insideTitle}>
                  {initialAccuracyData &&
                  initialAccuracyData[currentDate?.getMonth()]
                    ? `${Math.round(
                        initialAccuracyData[currentDate?.getMonth()]
                          ?.averageScore
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div> */}
        </Card>
      </div>
    </>
  );
};

export default CompletedStatus;
