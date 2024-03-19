import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Empty, Spin } from "antd";
import styles from "./styles.module.css";
import spinSTYles from '../../../../styles/auth.module.css'
import Card from "../../../../components/card";
import Buttonscroller from "../../../../components/buttonSroller";
import HeadTitle from "../../../../components/headtitle";
import Legends from "../../../../components/legends";
import buttonStyle from "../../../admin/dashboard/completedStatus/styles.module.css";
import { Buttons } from "../../../reviewer/workingstatus";
import { useDispatch, useSelector } from "react-redux";
import { GraphContent } from "../../../../services/physicianService/DashbaordServices";
import YearPicker from "../../../../components/yearpicker";
import { getDays, monthNames } from "../../../reviewer/dashboard/accuracy";

const GraphData = () => {
  const dispatch = useDispatch();
  const graphInfo = useSelector(
    (state) => state?.physicianDashbaord?.graphData
  );
  const ClientRafScore = graphInfo?.data?.response?.clientRafScore?.sort(
    (a, b) => a._id.month - b._id.month
  );
  const CogentAiRafScore = graphInfo?.data?.response?.cogentAiRafScore?.sort(
    (a, b) => a._id.month - b._id.month
  );
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const ClientRaf = ClientRafScore?.map((item) => item?.count);
  const CogentAiRaf = CogentAiRafScore?.map((item) => item?.count);

  const clientWeeks = new Set(
    graphInfo?.data?.response?.clientRafScore?.map((item) => item?._id?.week)
  );
  const cogentWeeks = new Set(
    graphInfo?.data?.response?.cogentAiRafScore?.map((item) => item?._id?.week)
  );

  const uniqueWeeks = new Set([...clientWeeks, ...cogentWeeks]);

  const weekNames = Array.from(uniqueWeeks)
    .sort((a, b) => a - b)
    .map((week) => `Week ${week}`);

  let xAxisData = [];
  if (currentBtn === "Monthly") {
    xAxisData = monthNames;
  } else if (currentBtn === "Daily") {
    xAxisData = getDays(
      graphInfo?.data?.response?.cogentAiRafScore &&
        Object.keys(graphInfo?.data?.response?.cogentAiRafScore)?.length
    );
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

  const handleButtonClick = (index, btn) => {
    setActiveButton(index);
    setCurrentBtn(btn);
  };
  const option = {
    xAxis: {
      type: "category",
      data: xAxisData,

      axisLine: {
        lineStyle: {
          color: "#d9d9d9",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "gray",
        fontWeight: "500",
      },
    },
    yAxis: {
      type: "value",
      show: true,
      axisLabel: {
        formatter: "{value}",
      },
    },
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: function (params) {
        const dataIndex = params[0]?.dataIndex;
        const ClientRafVal = ClientRaf[dataIndex];
        const CogentAiRafVal = CogentAiRaf[dataIndex];
        return `Completed: ${ClientRafVal}<br/>Allocated: ${CogentAiRafVal}`;
      },
    },
    series: [
      {
        data: CogentAiRaf,
        type: "line",
        lineStyle: { color: "rgba(48, 112, 245, 1)" },
        smooth: true,
        showSymbol: false,
      },
      {
        data: ClientRaf,
        type: "line",
        lineStyle: { color: "rgba(60, 154, 146, 1)" },
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  const bullets = [
    {
      color: "rgba(48, 112, 245, 1)",
      name: "Cogent AI RAF score",
    },
    {
      color: "rgba(60, 154, 146, 1)",
      name: "Client AI RAF score",
    },
  ];
  const handleYearChange = (date, dateString) => {
    setYear(dateString);
    setSelectedYear(dateString);
  };
  const handleMonthChange = (date) => {
    setMonth(date);
    const selectedDate = new Date(date);
    const monthNumber = (selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    setSelectedMonth(monthNumber);
  };
  useEffect(() => {
    dispatch(GraphContent("ID-001", currentBtn, selectedMonth, selectedYear));
  }, [currentBtn, selectedMonth, selectedYear]);

  return (
    <>
      <Card padding="10px">
        <div className={styles.innerWrapper}>
          <div className={styles.header}>
            {" "}
            <HeadTitle header="RAF Secure" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <YearPicker
              onChangeYear={handleYearChange}
              onChangeMonth={handleMonthChange}
              type={currentBtn}
              bgColor="#F3F3FF"
              val={month}
              val1={year}
            />
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
        {graphInfo?.loading &
        (
          <div className={spinSTYles.spinStyle}>
            <Spin loading={graphInfo?.loading} />
          </div>
        )}
        {!graphInfo?.loading && graphInfo?.data?.response ? (
          <>
            <ReactECharts
              option={option}
              style={{ width: "100%", height: "90%", marginTop: "-15px" }}
            />
            <div className={buttonStyle.bulletContainer}>
              <Legends bullets={bullets} />
            </div>
          </>
        ) : (
          <div className={spinSTYles.spinStyle}>
            <Empty />
          </div>
        )}
      </Card>
    </>
  );
};

export default GraphData;
