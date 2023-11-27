import React, { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import left from "../../../../images/dashboard/left.png";
import right from "../../../../images/dashboard/right.png";
import { Col, Row } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";

const DailyTask = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const card2Data = [
    { id: 1, day: "Monday", lock: false, pending: 8, hold: 4, decline: 2 },
    { id: 2, day: "Tuesday", lock: false, pending: 8, hold: 4, decline: 2 },
    { id: 3, day: "Wednesday", lock: true, pending: 8, hold: 4, decline: 2 },
    { id: 4, day: "Thursday", lock: false, pending: 8, hold: 4, decline: 2 },
    { id: 5, day: "Friday", lock: false, pending: 8, hold: 4, decline: 2 },
    { id: 6, day: "Saturday", lock: false, pending: 8, hold: 4, decline: 2 },
    { id: 7, day: "Sunday", lock: true, pending: 8, hold: 4, decline: 2 },
  ];
  const bullets = [
    {
      color: "#FFB54D",
      name: "Pending",
    },
    {
      color: "#AD94FA",
      name: "Hold",
    },
    {
      color: "#EB5252",
      name: "Decline",
    },
  ];
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        label: {
          show: false,
          position: "inside",
          formatter: "{b}: {c}",
        },
        data: [
          {
            value: 1048,
            name: "Pending",
            itemStyle: {
              color: "#FFB54D",
            },
          },
          {
            value: 735,
            name: "Hold",
            itemStyle: {
              color: "#AD94FA",
            },
          },
          {
            value: 580,
            name: "Decline",
            itemStyle: {
              color: "#EB5252",
            },
          },
          {
            value: 580,
            name: "",
            itemStyle: {
              color: "#E8FAEA",
            },
          },
        ],
      },
      {
        type: "pie",
        radius: ["0%", "30%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: "{a|Allocated}\n \n{b|50}",
          backgroundColor: "transparent",

          rich: {
            a: {
              fontSize: 12,
            },
            b: {
              fontSize: 18,
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 50,
            itemStyle: {
              color: "#fff",
            },
          },
        ],
      },
    ],
  };
  const showPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const showNext = () => {
    if (currentIndex < card2Data.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  return (
    <>
      <HeadTitle header="Daily Task" />
      <div className={styles.card2}>
        <Card borderRadius="28px" style={{ display: "flex" }}>
          <Row>
            <Col span={1}>
              <div onClick={showPrevious} className={styles.ImgDIv}>
                <Image src={left} />
              </div>
            </Col>
            <Col span={22}>
              <Row style={{ display: "flex", justifyContent: "space-between" }}>
                {card2Data
                  .slice(currentIndex, currentIndex + 3)
                  .map((data, index) => (
                    <Col key={index} span={7} className={styles.sliderdiv}>
                      <h4
                        className={styles.headerTitle}
                        style={{ fontSize: "16px" }}
                      >
                        {data.day}
                      </h4>
                      <Row>
                        <Col span={12}>
                          <div className={styles.container}>
                            <ReactECharts
                              option={option}
                              style={{ width: "400px", height: "200px" }}
                            />
                          </div>
                        </Col>
                        <Col span={12} className={styles.headerTitle}>
                          <div style={{ paddingLeft: "10px" }}>
                            <div className={styles.container}>
                              Pending{" "}
                              <div className={styles.subText}>
                                {data.pending}
                              </div>
                            </div>
                            <div className={styles.container}>
                              Hold{" "}
                              <div className={styles.subText}>{data.hold}</div>
                            </div>
                            <div className={styles.container}>
                              Decline
                              <div className={styles.subText}>
                                {data.decline}
                              </div>{" "}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  ))}
              </Row>
              <div className={styles.infoCards}>
                {bullets?.map((item) => (
                  <div className={styles.insideCard}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        margin: "5px 5px 0 0",
                      }}
                    ></div>
                    {item.name}
                  </div>
                ))}
              </div>
            </Col>
            <Col span={1}>
              <div onClick={showNext} className={styles.ImgDIv}>
                {" "}
                <Image src={right} />
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default DailyTask;
