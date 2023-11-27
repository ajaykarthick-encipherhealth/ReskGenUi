import React, { useState } from "react";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../workingstatus";
import ReactECharts from "echarts-for-react";
import accuracy from "../../../../images/dashboard/accuracy.png";
import Image from "next/image";
import Card from "../../../../components/card/index";
import styles from "./styles.module.css";
import HeadTitle from "../../../../components/headtitle";

const Accuracy = () => {
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
    },

    series: [
      {
        data: [20, 92, 10, 34, 12, 50, 32, 100, 67, 89, 14, 90],
        type: "bar",
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0],
          // color: "#C2D5FF",
          color: function (params) {
            // Set a specific color for November (assuming it's the current month)
            return params.dataIndex === 10 ? '#3479FE' : '#C2D5FF';
          },
        },
        lineStyle: {
          color: "#BD83B8",
        },
        showSymbol: false,
      },
    ],
  };
  return (
    <>
      <HeadTitle header="Accuracy Score" />
      <div className={styles.card3}>
        <Card borderRadius="28px" padding="10px">
          <div className={styles.buttonDiv}>
            <Buttonscroller
              Buttons={Buttons}
              handleButtonClick={handleButtonClick}
              activeButton={activeButton}
            />
          </div>
          <div className={styles.header}>
            <div style={{width:"75%"}}>
              <ReactECharts
                option={option}
                style={{
                  width: "100%",
                  height: "350px",
                  marginTop: "-30px",
                }}
              />
            </div>
            <div className={styles.accuracy}>
              <div className={styles.header}>
                <Image src={accuracy} className={styles.Img} />
                <div className={styles.heading}>Accuracy</div>
              </div>
              <div className={styles.month}>Month July</div>
              <div className={styles.percentage}>97 %</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Accuracy;
