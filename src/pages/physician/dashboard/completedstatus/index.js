import React, { useState } from "react";
import styles from "./styles.module.css";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { Buttons } from "../../workingstatus";
import Buttonscroller from "../../../../components/buttonSroller";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";

const CompletedStatus = () => {
  const [activeButton, setActiveButton] = useState(0);

  const handleButtonClick = (index) => {
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
    },
    yAxis: {
      type: "value",
      show: true,
    },
    legend:{
      show:true
    },
    series: [
      {
        data: [120, 932, 901, 934, 1290, 530, 1320, 1000, 567, 879, 1234, 100],
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
        data: [800, 300, 700, 200, 900, 500, 300, 1000, 300, 500, 800, 1000], // Modified data
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

  return (
    <>
      <HeadTitle header="Completed Status" />
      <div className={styles.card5}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <Buttonscroller
              Buttons={Buttons}
              handleButtonClick={handleButtonClick}
              activeButton={activeButton}
            />
          </div>

          <ReactECharts
            option={option}
            style={{ width: "100%", height: "300px", marginTop: "-25px" }}
          />
        </Card>
      </div>
    </>
  );
};

export default CompletedStatus;
