import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { Buttons, ButtonsGroup2 } from "../../../physician/workingstatus";
import Buttonscroller from "../../../../components/buttonSroller";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import Legends from "../../../../components/legends";
import { monthNames, getDays } from "../accuracy";
import { useDispatch, useSelector } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import { useRouter } from "next/router";
import { Empty, Spin, Select } from "antd";
import {
  getCOmpletedScore,
  getCompletedScoreNew,
  getUserByIndividual,
} from "../../../../store/actions/l2Action/DashboardAction";
import spinSTYles from "../../../../styles/auth.module.css";
const CompletedStatus = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const completedDatas = useSelector((state) => state?.workFlow?.completed);
  const individualUserList = useSelector(
    (state) => state?.l2Dashboard?.individualUser
  );

  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const [selectMemberType, setSelectMemberType] = useState("TEAM");
  const [selectUser, setSelectUser] = useState([]);
  const [isindividual, setIsindividual] = useState(false);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

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

  let completedWeeks = new Set();
  let allocatedWeeks = new Set();

  completedWeeks =
    completedDatas?.data?.response?.mapAccuracy &&
    new Set(
      Object.keys(completedDatas?.data?.response?.mapAccuracy).map(Number)
    );

  allocatedWeeks =
    completedDatas?.data?.response?.mapAccuracy &&
    new Set(
      Object.keys(completedDatas?.data?.response?.mapAccuracy).map(Number)
    );

  const uniqueWeeks =
    completedWeeks && allocatedWeeks
      ? new Set([...completedWeeks, ...allocatedWeeks])
      : [];

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

  // Inside your component function
  let xAxisData = [];

  if (currentBtn === "Monthly") {
    xAxisData = monthNames;
  } else if (currentBtn === "Daily") {
    xAxisData = getDays(currentDate);
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

  const allocatedValues = xAxisData?.map((day, index) =>
    completedDatas?.data?.response?.allocate
      ? completedDatas?.data?.response?.allocate[index + 1]
      : 0 || 0
  );
  const auditedValues = xAxisData?.map((day, index) =>
    completedDatas?.data?.response?.mapAccuracy
      ? completedDatas?.data?.response?.mapAccuracy[index + 1]
      : 0 || 0
  );

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
        const auditedValue = auditedValues[dataIndex];
        return `Audited: ${auditedValue}`;
      },
    },
    series: [
      {
        data: auditedValues,
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
    ],
  };

  const bullets = [
    {
      color: "#4A3AFF",
      name: "Audited",
    },
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
      getCompletedScoreNew(
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
  return (
    <>
      <HeadTitle header="Productivity Status" />
      <div className={styles.card5}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
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
                placeholder="Select User"
                  className={`custom_select_user ${styles.custom_select_user}`}
                  onChange={(e) => onChangeUser(e)}
                  options={optionsUser}
                />
              </div>
            ) : null}
            <div className={styles.picker}>
              <YearPicker
                onChange={handleYearChange}
                type={"year"}
                bgColor="#F3F3FF"
              />
              {currentBtn !== "Month" && (
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

          {completedDatas?.loading ? (
            <div className={spinSTYles.spinStyle}>
              <Spin loading={completedDatas?.loading} />
            </div>
          ) : completedDatas?.loading === false &&
            completedDatas?.data?.response ? (
            <ReactECharts
              option={option}
              style={{ width: "100%", height: "300px", marginTop: "-15px" }}
            />
          ) : (
            <div className={spinSTYles.spinStyle}>
              <Empty />
            </div>
          )}
          <div className={styles.bulletContainer}>
            <Legends bullets={bullets} />
          </div>
        </Card>
      </div>
    </>
  );
};

export default CompletedStatus;
