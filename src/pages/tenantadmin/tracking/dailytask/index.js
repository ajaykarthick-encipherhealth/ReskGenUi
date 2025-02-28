import React from "react";
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

  const getChartOption = (trackChart, pending, hold, decline, completed) => {
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
              value: pending || 0,
              name: "Pending",
              itemStyle: {
                color: "#5da9e4",
              },
            },
            {
              value: hold || 0,
              name: "Hold",
              itemStyle: {
                color: "#3C0AD2",
              },
            },
            {
              value: decline || 0,
              name: "Declined",
              itemStyle: {
                color: "#EB5252",
              },
            },
            {
              value: completed || 0,
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
            formatter: `{b|${
              pending || 0 + hold || 0 + decline || 0 + completed || 0
            }}`,
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
              value: pending || 0 + hold || 0 + decline || 0 + completed || 0,
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
        <Card borderRadius="28px" style={{ display: "flex" }}>
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
                        style={{
                          width: "250px",
                          height: "200px",
                          marginLeft: "-10px",
                        }}
                      />
                    </div>
                  </Col>
                  <Col span={12} className={styles.headerTitle}>
                    <div style={{ paddingLeft: "10px" }}>
                      {bullets?.map((item) => {
                        return (
                          <div className={styles.container}>
                            <div
                              className={styles.fontSize}
                              style={{ display: "flex", fontSize: "12px" }}
                            >
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
