import React, { useState } from "react";
import styles from "./workingstatus.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import Card from "../../../components/card";
import arrow from "../../../images/workingstatus/arrow.png";
import Image from "next/image";
import daily from "../../../images/workingstatus/daily.png";
import weekly from "../../../images/workingstatus/weekly.png";
import monthly from "../../../images/workingstatus/monthly.png";
import ReactECharts from "echarts-for-react";
import Buttonscroller from "../../../components/buttonSroller/index";
import YearPicker from "../../../components/yearpicker/index";
import * as echarts from "echarts";
import Footer from "../../../jsx/layouts/Footer";

const index = () => {
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
      show: false,
    },

    series: [
      {
        data: [120, 932, 901, 934, 1290, 530, 1320, 1000, 567, 879, 1234, 100],
        type: "line",
        lineStyle: {
          color: "#BD83B8",
        },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#BD83B8" },
            { offset: 1, color: "#F4EBF4" },
          ]),
        },
      },
    ],
  };

  const onYearChange = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div style={{ backgroundColor: "#F0F6FE" }}>
        <div className={styles.maincontainer}>
          <div className={styles.innerdiv}>
            <div className={styles.div1}>
              <Card borderRadius="30px" Bgcolor="#fff">
                <div className={styles.mainDiv}>
                  <div>
                    <YearPicker type="year" onChange={onYearChange} />
                  </div>
                  <Buttonscroller
                    Buttons={Buttons}
                    handleButtonClick={handleButtonClick}
                    activeButton={activeButton}
                  />
                </div>
                <div>
                  <ReactECharts option={option} style={{ height: "450px" }} />
                </div>
              </Card>
            </div>

            <div className={styles.div2}>
              {cardsData?.map((info) => {
                return (
                  <div className={styles.innerCard}>
                    <Card
                      Bgcolor="#133DD4"
                      padding="0.4px 0"
                      borderRadius="30px"
                    >
                      <div className={styles.innercardDiv}>
                        <Card
                          Bgcolor="#fff"
                          padding="0px 0px 0px 20px"
                          borderRadius="25px"
                        >
                          <div className={styles.cardDetails}>
                            <div>
                              <Image src={info.icon} alt="no img" />
                            </div>
                            <div className={styles.contentDiv}>
                              <span>
                                <h5>{info.title}</h5>
                              </span>
                              <span>{info.day}</span>
                              <span className={styles.status}>
                                {info.status}
                              </span>
                            </div>
                          </div>
                        </Card>
                        <Image
                          src={arrow}
                          className={styles.imgDiv}
                          alt="no img"
                        />
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

const cardsData = [
  {
    id: 1,
    icon: daily,
    title: "Daily",
    files: "30 files",
    day: "Past 1 day",
    status: "Completed",
  },
  {
    id: 2,
    icon: weekly,
    title: "Weekly",
    files: "100 files",
    day: "Past 3 days",
    status: "Completed",
  },
  {
    id: 3,
    icon: monthly,
    title: "Monthly",
    files: "100 files",
    day: "Past 10 days",
    status: "Completed",
  },
];

export const Buttons = [
  {
    id: 1,
    title: "Daily",
  },
  {
    id: 2,
    title: "Weekly",
  },
  {
    id: 3,
    title: "Monthly",
  },
];
export default index;
