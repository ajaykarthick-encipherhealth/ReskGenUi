import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import Card from "../../../../components/card";
import Buttonscroller from "../../../../components/buttonSroller";
import HeadTitle from "../../../../components/headtitle";
import Legends from "../../../../components/legends";
import buttonStyle from "../../../admin/dashboard/completedStatus/styles.module.css";
import { Buttons } from "../../../reviewer/workingstatus";
import styles from "./styles.module.css";

const GraphData = () => {
  const [activeButton, setActiveButton] = useState(0);
  const handleButtonClick = (index, btn) => {
    setActiveButton(index);
  };
  const option = {
    xAxis: {
      type: "category",
      data: [
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
      ],

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
        formatter: "{value}%",
      },
    },
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: function (params) {
        return `Cogent AI RAF score: ${params[0]?.dataIndex}<br/>Client AI RAF score: ${params[0]?.dataIndex}`;
      },
    },
    series: [
      {
        data: [80, 30, 10, 70, 30, 120, 100, 10, 33, 41, 28, 19],
        type: "line",
        lineStyle: { color: "rgba(48, 112, 245, 1)" },
        smooth: true,
        showSymbol: false,
      },
      {
        data: [10, 20, 30, 40, 50, 16, 50, 40, 20, 86, 58, 17],
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
  return (
    <>
      <Card padding="10px">
        <div className={styles.innerWrapper}>
          <div className={styles.header}>
            {" "}
            <HeadTitle header="RAF Secure" />
          </div>
          <div>
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
        <ReactECharts
          option={option}
          style={{ width: "100%", height: "90%", marginTop: "-15px" }}
        />
        <div className={buttonStyle.bulletContainer}>
          <Legends bullets={bullets} />
        </div>
      </Card>
    </>
  );
};

export default GraphData;
