import React, { useState } from "react";
import styles from "./styles.module.css";
import ReactECharts from "echarts-for-react";
import { Col, Row } from "antd";
import Card from "../../../../components/card";
const DailyTask = ({ trackChart }) => {
  const bullets = [
    {
      color: "#5da9e4",
      name: "Pending",
    },
    {
      color: "#3C0AD2",
      name: "Hold",
    },
    {
      color: "#EB5252",
      name: "Declined",
    },
    {
      color: "#00BC13",
      name: "Completed",
    },
  ];

  const getChartOption = (allocated, pending, hold, decline, completed) => {
    return {
      tooltip: {
        trigger: "item",
        formatter: (param) => {
          return `
            <div style=display:flex;justify-content:center;align-items:center>
              <span style=width:10px;height:10px;background-color:${param?.data?.itemStyle?.color};margin-right:5px;border-radius:50%;></span>
              ${param?.data?.name}:${param?.data?.value}
            </div>
          `;
        },
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
              value: pending,
              name: "Pending",
              itemStyle: {
                color: "#5da9e4",
              },
            },
            {
              value: hold,
              name: "Hold",
              itemStyle: {
                color: "#3C0AD2",
              },
            },
            {
              value: decline,
              name: "Declined",
              itemStyle: {
                color: "#EB5252",
              },
            },
            {
              value: completed,
              name: "Completed",
              itemStyle: {
                color: "#00BC13",
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
            formatter: `{b|${allocated}}`,
            backgroundColor: "transparent",

            rich: {
              a: {
                fontSize: 12,
              },
              b: {
                fontSize: 14,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: allocated,
              name: "Alocated",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };
  return (
    <>
      {/* <HeadTitle header="" /> */}
      <div className={styles.card2}>
        <Card borderRadius="28px" className="d-flex">
          <Col span={22}>
            <Row className="d-flex justify-content-between">
              <Col span={22} className={styles.sliderdiv}>
                <Row>
                  <Col span={12}>
                    <div className={styles.container}>
                      <ReactECharts
                        option={getChartOption(
                          trackChart?.PENDING +
                            trackChart?.HOLD +
                            trackChart?.DECLINED +
                            trackChart?.COMPLETED,
                          trackChart?.PENDING,
                          trackChart?.HOLD,
                          trackChart?.DECLINED,
                          trackChart?.COMPLETED
                        )}
                        style={{ width: "300px", height: "200px" }}
                      />
                    </div>
                  </Col>
                  <Col span={12} className={styles.headerTitle}>
                    <div  className={` mt-1 ${styles.list}`}>
                    <span className="px-2 mt-1 font3 fontWeight3 ">Coder 1</span>
                      {bullets?.map((item) => {
                        return (
                          <div className={`mt-1 ${styles.container}`}>
                            <div className="d-flex">
                              <div
                                className={`reusableFont ${styles.bgColor}`}
                                style={{
                                  backgroundColor: item.color,
                                  fontSize: "10px",
                                }}
                              ></div>
                              {item?.name}
                            </div>
                            <div className={` reusableFont ${styles.subText}`}>
                              {item?.name === "Pending"
                                ? trackChart?.PENDING
                                : item?.name === "Declined"
                                ? trackChart?.DECLINED
                                : item?.name === "Hold"
                                ? trackChart?.HOLD
                                : item?.name === "Completed" &&
                                  trackChart?.COMPLETED}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Card>
      </div>
    </>
  );
};

export default DailyTask;
