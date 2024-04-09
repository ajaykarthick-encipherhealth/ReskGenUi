import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { Empty, Spin, Select } from "antd";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { Buttons } from "../../../reviewer/workingstatus";
import Buttonscroller from "../../../../components/buttonSroller";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import Legends from "../../../../components/legends";
import { monthNames, getDays } from "../accuracy";
import { useDispatch, useSelector } from "react-redux";
import YearPicker from "../../../../components/yearpicker";
import {
  getCompletedStatus,
  getSelectUserList,
} from "../../../../store/actions/adminAction/DashboardAction";
import spinSTYles from "../../../../styles/auth.module.css";

const CompletedStatus = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const managersList=useSelector(state=>state?.AdminDashboardReducers?.selectedUsers)
  const completedDatas = useSelector(
    (state) => state?.AdminDashboardReducers?.completedStatus
  );

  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectUser, setSelectUser] = useState([]);
  const [isindividual, setIsindividual] = useState(false);
  const [selectMemberType, setSelectMemberType] = useState("");
  const [year, setYear] = useState();
  const [month, setMonth] = useState();

  let completedWeeks = new Set();
  let allocatedWeeks = new Set();

  completedWeeks =
    completedDatas?.data?.response?.allocatedChartMap &&
    new Set(
      Object.keys(completedDatas?.data?.response?.allocatedChartMap).map(Number)
    );

  allocatedWeeks =
    completedDatas?.data?.response?.completedMap &&
    new Set(
      Object.keys(completedDatas?.data?.response?.completedMap).map(Number)
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
    setYear(date);
  };
  const handleMonthChange = (date) => {
    const selectedDate = new Date(date);
    setMonth(date);
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
      completedDatas?.data?.response?.allocatedChartMap &&
        Object.keys(completedDatas?.data?.response?.allocatedChartMap)?.length
    );
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

  const allocatedValues = xAxisData?.map((day, index) =>
    completedDatas?.data?.response?.completedMap
      ? completedDatas?.data?.response?.completedMap[index + 1]
      : 0 || 0
  );
  const auditedValues = xAxisData?.map((day, index) =>
    completedDatas?.data?.response?.allocatedChartMap
      ? completedDatas?.data?.response?.allocatedChartMap[index + 1]
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
        const allocatedValue = allocatedValues[dataIndex];
        const auditedValue = auditedValues[dataIndex];
        return `Allocated: ${auditedValue}<br/>Completed: ${allocatedValue}`;
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
      {
        data: allocatedValues,
        type: "line",
        lineStyle: { color: "#FF718B" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#FF718B" },
            { offset: 1, color: "#F4EBF4" },
          ]),
        },
      },
    ],
  };

  const bullets = [
    {
      color: "#4A3AFF",
      name: "Allocated",
    },
    {
      color: "#FF718B",
      name: "Completed",
    },
  ];

  const options = [
    { value: "", label: "ALL" },
    { value: "REVIEWER", label: "REVIEWER" },
    { value: "SUPERVISOR", label: "SUPERVISOR" },
  ];

  const memberTypeChanges = (e) => {
    setSelectMemberType(e);
    setIsindividual(false);
    setSelectUser([]);
    if (e != "All") {
      setIsindividual(true);
    }
  };

  const onChangeUser = (e) => {
    setSelectUser([e]);
  };


  useEffect(() => {
    dispatch(getSelectUserList(selectMemberType));
  }, [selectMemberType]);

  useEffect(() => {
    dispatch(
      getCompletedStatus(
        currentBtn.toUpperCase(),
        currentDate.getDate(),
        selectedMonth,
        selectedYear,
        router,
        selectUser,
        selectMemberType
      )
    );
  }, [currentBtn, selectedMonth, selectedYear, selectUser]);
  const optionsUser = managersList?.data?.response?.map(item=>(
    {value:item?.managerId,label:`${item?.firstName}  ${item?.lastName}`}
  ));

  return (
    <>
      <HeadTitle header="Completed Status" />
      <div className={styles.card5}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <div className={`d-flex ${styles.selectContainer}`}>
              <div className={styles.select}>
                <Select
                  value={
                    selectMemberType?.length === 0 ? "All" : selectMemberType
                  }
                  // placeholder="Select User Type"
                  onChange={(e) => memberTypeChanges(e)}
                  className={`custom_select_type ${styles.custom_select_type}`}
                  options={options}
                  style={{ backgroundColor: "#F3F3FF", width: "140px" }}
                />
              </div>
              {isindividual ? (
                <div className={styles.select}>
                  <Select
                    showSearch
                    value={selectUser}
                    placeholder="Select User"
                    className={`custom_select_user ${styles.custom_select_user}`}
                    onChange={(e) => onChangeUser(e)}
                    options={optionsUser}
                  />
                </div>
              ) : null}
            </div>
            <div className={styles.picker}>
              <YearPicker
                onChangeYear={handleYearChange}
                onChangeMonth={handleMonthChange}
                type={currentBtn}
                bgColor="#F3F3FF"
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
            <>
              <ReactECharts
                option={option}
                style={{ width: "100%", height: "300px", marginTop: "-10px" }}
              />
              <div className={styles.bulletContainer}>
                <Legends bullets={bullets} />
              </div>
            </>
          ) : (
            <div className={spinSTYles.spinStyle}>
              <Empty />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default CompletedStatus;
