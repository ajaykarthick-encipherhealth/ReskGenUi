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
      color: "#AD94FA",
      name: "Hold",
    },
    {
      color: "#EB5252",
      name: "Declined",
    },
    {
      color: "#B4EFBA",
      name: "Completed",
    },
  ];

  const getChartOption = (allocated, pending, hold, decline, completed) => {
    return {
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
                color: "#AD94FA",
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
                color: "#B4EFBA",
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
                fontSize: 18,
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
        <Card borderRadius="28px" style={{ display: "flex" }}>
          <Col span={22}>
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
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
                    <div style={{ paddingLeft: "10px" }}>
                      {bullets?.map((item) => {
                        return (
                          <div className={styles.container}>
                            <div style={{ display: "flex" }}>
                              <div
                                className={styles.bgColor}
                                style={{
                                  backgroundColor: item.color,
                                }}
                              ></div>
                              {item?.name}
                            </div>
                            <div className={styles.subText}>
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
