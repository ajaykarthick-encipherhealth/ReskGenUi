import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import { Col, Row, Skeleton, Spin } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import { getDailyTaskDatas } from "../../../../store/actions/l2Action/DashboardAction";
import spinSTYles from "../../../../styles/auth.module.css";
import { GetUserCount } from "../../../../services/adminServices/DashboardService";

const DailyTask = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [currentDays, setCurrentDays] = useState([]);
  const dailyStatusData = useSelector((state) => state?.l2Dashboard?.dailyTask);
  const dispatch = useDispatch();
  const router = useRouter();

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

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDays = (selectedDate, statusData) => {
    const processedDays = selectedDate?.map((dayInfo, index) => {
      const matchingStatusData = statusData?.find((status) => {
        return status?.data?.response?.date === dayInfo?.dateString;
      });
      return {
        id: index + 1,
        day: dayInfo?.day,
        date: dayInfo?.date,
        dateString: matchingStatusData?.data?.response?.date,
        pending: matchingStatusData?.data?.response?.auditPending || 0,
        hold: matchingStatusData?.data?.response?.auditHold || 0,
        audited: matchingStatusData?.data?.response?.audited || 0,
        reAudited: matchingStatusData?.data?.response?.reAudited || 0,
        allocated: matchingStatusData?.data?.response?.auditAllocated || 0,
        declined: matchingStatusData?.data?.response?.auditDeclined || 0,
      };
    });
    const sorted = processedDays?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
    return setCurrentDays(sorted);
  };
  const getChartOption = (res) => {
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

  const uniqueData = currentDays?.filter((value, index, self) => {
    const firstIndex = self?.findIndex(
      (item) => item?.day === value?.day && item?.date === value?.date
    );
    return index === firstIndex;
  });
  console.log(selectedDate,"selectedDate")
  const getUser = async () => {
    try {
      const data = await GetUserCount();
      setRoles(data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const days = [];
    for (let i = 0; i < 3; i++) {
      const today = new Date();
      today.setDate(today.getDate() - i);
      const dayIndex = today.getDay();
      days.push({
        day: daysOfWeek[dayIndex],
        date: dayjs(today)?.format("MM-DD-YYYY"),
        dateString: today?.toISOString(),
      });
    }

    setSelectedDate(days);

    days?.map((data, index) => {
      return dispatch(getDailyTaskDatas(data?.dateString, router));
    });
  }, []);

  useEffect(() => {
    if (dailyStatusData && selectedDate) {
      getDays(selectedDate, dailyStatusData);
    }
  }, [dailyStatusData, selectedDate]);

  return (
    <>
      <HeadTitle header="Total Users" />
      <div className={styles.card2} style={{ height: "75%" }}>
        <Card style={{ borderRadius: "28px", display: "flex" }}>
          <Row>
            <Col span={1}></Col>
            <Col span={22}>
              {currentDays?.length > 0 ? (
                <Row
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {uniqueData?.slice(0, 1)?.map((data, index) => (
                    <Col key={index} span={24}>
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
                            style={{ width: "100%" }}
                          >
                            <ReactECharts
                              option={getChartOption(
                                data?.allocated,
                                data?.pending,
                                data?.hold,
                                data?.reAudited,
                                data?.audited,
                                data?.declined
                              )}
                              style={{ width: "100%", height: "200px" }}
                            />
                          </div>
                        </Col>
                        <Col span={12} className={styles.headerTitle}>
                          <div style={{ paddingLeft: "10px" }}>
                            {bullets?.map((item, bulletIndex) => (
                              <div
                                key={bulletIndex}
                                className={styles.container}
                              >
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
                                    : item.name === "Reviewer"
                                    ? roles.REVIEWER
                                    : data.declined}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div>
                  {!dailyStatusData?.loading && (
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

export default DailyTask;
