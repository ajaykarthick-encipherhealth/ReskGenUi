import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import left from "../../../../images/dashboard/left.png";
import right from "../../../../images/dashboard/right.png";
import { Col, Empty, Row } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import dayjs from "dayjs";
import { getDailyTaskDatas } from "../../../../store/actions/l2Action/DashboardAction";

import { useDispatch, useSelector } from "react-redux";
import Legends from "../../../../components/legends";
import { useRouter } from "next/router";
import { getFilteredList } from "../../../../store/actions/PatientsActions";

const DailyTask = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [currentDays, setCurrentDays] = useState([]);

  const dailyStatusData = useSelector((state) => state.workFlows.dailyTask);
  const dispatch = useDispatch();

  const bullets = [
    {
      color: "#64B4BE",
      name: "Audited",
    },
    {
      color: "#FFB54D",
      name: "Pending",
    },
    {
      color: "#F4CE14",
      name: "Hold",
    },
    {
      color: "#C26100",
      name: "ReAudit",
    },
    {
      color: "#EB5252",
      name: "Declined",
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

  const router = useRouter;
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 3; i++) {
      const today = new Date();
      today.setDate(today.getDate() - i);
      const dayIndex = today.getDay();
      days.push({
        day: daysOfWeek[dayIndex],
        date: dayjs(today).format("MM-DD-YYYY"),
        dateString: today?.toISOString(),
      });
    }

    setSelectedDate(days);

    days?.map((data, index) => {
      return dispatch(getDailyTaskDatas(data?.dateString, router));
    });
  }, []);

  useEffect(() => {
    if (dailyStatusData) {
      getDays(selectedDate, dailyStatusData);
    }
  }, [dailyStatusData]);

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
        return status?.response?.date === dayInfo?.dateString;
      });
      return {
        id: index + 1,
        day: dayInfo?.day,
        date: dayInfo?.date,
        dateString: matchingStatusData?.response?.date,
        pending: matchingStatusData?.response?.pending || 0,
        hold: matchingStatusData?.response?.hold || 0,
        completed: matchingStatusData?.response?.completed || 0,
        decline: matchingStatusData?.response?.declined || 0,
        allocated: matchingStatusData?.response?.allocated || 0,
      };
    });
    const sorted = processedDays?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
    return setCurrentDays(sorted);
  };
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
              name: "Audited",
              itemStyle: {
                color: "#64B4BE",
              },
            },
            {
              value: pending,
              name: "Pending",
              itemStyle: {
                color: "#FFB54D",
              },
            },
            {
              value: hold,
              name: "Hold",
              itemStyle: {
                color: "#F4CE14",
              },
            },
            {
              value: decline,
              name: "ReAudit",
              itemStyle: {
                color: "#C26100;",
              },
            },
            {
              value: completed,
              name: "Declined",
              itemStyle: {
                color: "#EB5252",
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
  const showNext = () => {
    if (currentDays?.length > 3) {
      const updatedData = currentDays?.shift();
      const datas = [];
      const valyes = currentDays?.map((item) => {
        datas?.push({
          id: item?.id,
          day: item?.day,
          date: item?.date,
          dateString: item?.dateString,
        });
      });
      setSelectedDate(datas);
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
              {currentDays?.length > 0 ? (
                <Row
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {currentDays?.slice(0, 3)?.map((data, index) => (
                    <Col
                      key={index}
                      span={7}
                      className={styles.sliderdiv}
                      // onClick={() => setSelectedDate(currentWeek[index])}
                    >
                      <h4
                        className={styles.headerTitle}
                        style={{ fontSize: "16px" }}
                        onClick={() => {
                          dispatch(
                            getFilteredList({
                              dayDate: data?.dateString,
                            })
                          );
                          router?.push("/physician/patients");
                        }}
                      >
                        <div className={styles.headerDisplay}>
                          <span> {data.day}</span>
                          <span className={styles.dateDisplay}>
                            {" "}
                            {`(${data.date})`}{" "}
                          </span>
                        </div>
                      </h4>
                      <Row>
                        <Col span={12}>
                          <div className={styles.container}>
                            <ReactECharts
                              option={getChartOption(
                                data?.allocated,
                                data?.pending,
                                data?.hold,
                                data?.decline,
                                data?.completed
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
                                    onClick={() => {
                                      dispatch(
                                        getFilteredList({
                                          date: data?.dateString,
                                          status: item?.name,
                                        })
                                      );
                                      router?.push("/physician/patients");
                                    }}
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
                                    {item.name === "Pending"
                                      ? data.pending
                                      : item.name === "Declined"
                                      ? data?.decline
                                      : item.name === "Hold"
                                      ? data.hold
                                      : item.name === "Completed"
                                      && data?.completed
                                      }
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
               <Empty/>
              )}

              <div className={styles.infoCards}>
                <Legends bullets={bullets} />
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
