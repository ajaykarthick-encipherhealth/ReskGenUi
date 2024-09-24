import React, { useState } from "react";
import styles from "./styles.module.css";
import ReactECharts from "echarts-for-react";
import { Col, Row } from "antd";
import Card from "../../../../components/card";
const DailyTask = ({ trackChart }) => {
  const bullets = [
    {
      color: "#0078D4",
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

  const getChartOption = (trackChart, pending, hold, decline, completed) => {
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
            formatter: `{b|${pending + hold + decline + completed}}`,
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
              value: pending + hold + decline + completed,
              name: "Allocated",
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
        <div className="p-1 rounded" style={{ background: "#fff",maxHeight: "150px" }}>
          <Col span={22}>
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
              <Col span={22} className={styles.sliderdiv}>
                <Row>
                  <Col span={12}>
                    <div className={styles.container}>
                      <ReactECharts
                        option={getChartOption(
                          trackChart,
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
        </div>
      </div>
    </>
  );
};

export default DailyTask;
