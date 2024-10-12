import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ReactECharts from "echarts-for-react";
import { Col, Row, Skeleton, Spin } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import { actions as allActions } from "../../../../stores/admin/dashboard";
import { connect } from "react-redux";

const DailyTask = ({ dailyTaskAction, dailyStatusData, loading }) => {
  const [roles, setRoles] = useState({
    REVIEWER: 0,
    SUPERVISOR: 0,
    ADMIN: 0,
  });

  const bullets = [
    {
      color: "#7599FF",
      name: "Reviewer",
    },
    {
      color: "#64C8FF",
      name: "Supervisor",
    },
    {
      color: "#FA896B",
      name: "Admin",
    },
  ];

  const getChartOption = () => {
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
              value: roles?.REVIEWER,
              name: "Reviewer",
              itemStyle: {
                color: "#7599FF",
              },
            },
            {
              value: roles?.SUPERVISOR,
              name: "Supervisor",
              itemStyle: {
                color: "#64C8FF",
              },
            },
            {
              value: roles?.ADMIN,
              name: "Admin",
              itemStyle: {
                color: "#FA896B",
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
              roles?.REVIEWER + roles?.SUPERVISOR + roles?.ADMIN
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
              value: roles?.REVIEWER + roles?.SUPERVISOR + roles?.ADMIN,
              name: "Total",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };

  const getUser = async () => {
    try {
      const data = await dailyTaskAction();
      setRoles(data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <HeadTitle header="Total Users" />
      <div className={styles.card2} style={{ height: "75%" }}>
        <Card height="200px" style={{ borderRadius: "28px", display: "flex" }}>
          <Row>
            <Col span={1}></Col>
            <Col span={22}>
              {dailyStatusData ? (
                <Row
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {/* {?.slice(0, 1)?.map((data, index) => ( */}
                  <Col span={24}>
                    <h4
                      className={styles.headerTitle}
                      style={{ fontSize: "16px" }}
                    >
                      {/* Add your header title here if needed */}
                    </h4>

                    <Row>
                      <Col span={12}>
                        <div
                          className={styles.container}
                          style={{
                            width: "100%",
                            margin: "-20px 0 0px -10px",
                          }}
                        >
                          <ReactECharts
                            option={getChartOption()}
                            style={{ width: "100%", height: "200px" }}
                          />
                        </div>
                      </Col>
                      <Col span={12} className={styles.headerTitle}>
                        <div
                          style={{ paddingLeft: "10px", marginTop: "-20px" }}
                        >
                          {bullets?.map((item, bulletIndex) => (
                            <div key={bulletIndex} className={styles.container}>
                              <div style={{ display: "flex" }}>
                                <div
                                  className={styles.bgColor}
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                {item.name}
                              </div>
                              <div className={styles.subText}>
                                {item.name === "Admin"
                                  ? roles.ADMIN
                                  : item.name === "Supervisor"
                                  ? roles.SUPERVISOR
                                  : roles.REVIEWER}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* ))} */}
                </Row>
              ) : (
                <div>
                  {loading && (
                    <div className="skeletonantd d-flex justify-content-center align-items-center">
                      <Skeleton.Avatar active size="large" shape="circle" />
                    </div>
                  )}
                </div>
              )}
            </Col>
            <Col span={1}></Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

const connector = connect(
  (state) => ({
    dailyStatusData: state.admin.dashboard?.dailyTask?.data?.response,
    loading: state.admin.dashboard.dailyTaskLoading,
  }),
  {
    dailyTaskAction: allActions.dailyTaskAction,
  }
);
export default connector(DailyTask);
