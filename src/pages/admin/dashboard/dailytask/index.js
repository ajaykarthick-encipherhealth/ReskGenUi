import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import left from "../../../../images/dashboard/left.png";
import right from "../../../../images/dashboard/right.png";
import { Col, Empty, Row, Spin } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import Legends from "../../../../components/legends";
import { useRouter } from "next/router";
import { getFilteredList } from "../../../../store/actions/PatientsActions";
import { getDailyTaskDatas } from "../../../../store/actions/l2Action/DashboardAction";
import spinSTYles from "../../../../styles/auth.module.css";
import { GetUserCount } from "../../../../services/adminServices/DashboardService";
const DailyTask = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [currentDays, setCurrentDays] = useState([]);

  const dailyStatusData = useSelector((state) => state.l2Dashboard.dailyTask);
  const dispatch = useDispatch();
  const [roles, setRoles] = useState({
    L1AUDITOR: 0,
    L2AUDITOR: 0,
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

  const router = useRouter();
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

  const showPrevious = () => {
    const lastData = currentDays[0];
    const date = dayjs(lastData?.date).subtract(1, "date");
    const datas = [
      {
        id: currentDays?.length + 1,
        day: dayjs(date).format("dddd"),
        date: date?.format("MM-DD-YYYY"),
        dateString: date?.toISOString(),
      },
    ];
    setSelectedDate((prev) => [...prev, ...datas]);
    datas?.map((data, index) => {
      return dispatch(getDailyTaskDatas(data?.dateString, router));
    });
  };

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
    console.log(res);
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
              value: roles?.L1AUDITOR,
              name: "Reviewer",
              itemStyle: {
                color: "#7599FF",
              },
            },
            {
              value: roles?.L2AUDITOR,
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
            formatter: `{b|${roles?.L1AUDITOR + roles?.L2AUDITOR + roles?.ADMIN}}`,
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
              value: roles?.L1AUDITOR + roles?.L2AUDITOR + roles?.ADMIN,
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
  return (
    <>
      <HeadTitle header=" &nbsp;" />
      <div className={styles.card2} style={{ height: "75%" }}>
        <Card borderRadius="28px" style={{ display: "flex" }}>
          <Row>
            <Col span={1}></Col>
            <Col span={30}>
              {currentDays?.length > 0 ? (
                <Row
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {uniqueData?.slice(0, 1)?.map((data, index) => (
                    <Col
                      key={index}
                      span={70}

                      // onClick={() => setSelectedDate(currentWeek[index])}
                    >
                      <h4
                        className={styles.headerTitle}
                        style={{ fontSize: "16px" }}
                        // onClick={() => {
                        //   dispatch(
                        //     getFilteredList({
                        //       dayDate: data?.dateString,
                        //     })
                        //   );
                        //   router?.push("/l2Auditor/user");
                        // }}
                      >
                        {/* <div className={styles.headerDisplay}>
                          <span> {data.day}</span>
                          <span className={styles.dateDisplay}>
                            {" "}
                            {`(${data.date})`}{" "}
                          </span>
                        </div> */}
                      </h4>

                      <Row>
                        <Col span={12}>
                          <div
                            className={styles.container}
                            style={{ width: "308%" }}
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
                            {bullets?.map((item) => {
                              return (
                                <div className={styles.container}>
                                  <div
                                    style={{ display: "flex" }}
                                    // onClick={() => {
                                    //   dispatch(
                                    //     getFilteredList({
                                    //       date: data?.dateString,
                                    //       status: item?.name,
                                    //     })
                                    //   );
                                    //   router?.push("/physician/patients");
                                    // }}
                                  >
                                    <div
                                      className={styles.bgColor}
                                      style={{
                                        backgroundColor: item.color,
                                      }}
                                    ></div>
                                    {item.name}
                                  </div>
                                  <div className={styles.subText}>
                                    {item.name === "Admin"
                                      ? roles.ADMIN
                                      : item.name === "Supervisor"
                                      ? roles.L2AUDITOR
                                      : item.name === "Reviewer"
                                      ? roles.L1AUDITOR
                                      : data.declined}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className={spinSTYles.spinStyle}>
                  <Spin loading={dailyStatusData?.loading} />
                </div>
              )}

              {/* <div className={styles.infoCards}>
                <Legends bullets={bullets} />
              </div> */}
            </Col>
            <Col span={1}></Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default DailyTask;
