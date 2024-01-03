import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import left from "../../../../images/dashboard/left.png";
import right from "../../../../images/dashboard/right.png";
import { Col, Row } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import dayjs from "dayjs";
import { getDailyTaskDatas } from "../../../../store/actions/DashboardActions";
import { useDispatch, useSelector } from "react-redux";
import Legends from "../../../../components/legends";
import { useRouter } from "next/router";
import { getFilteredList, getpatientsList } from "../../../../store/actions/PatientsActions";

const DailyTask = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState();

  const dailyStatusData = useSelector((state) => state.workFlow.dailyTask);
  const currentDate = dayjs();
  const startWeekDate = currentDate.startOf("week");
  const endWeekDate = currentDate.endOf("week");
  const dispatch = useDispatch();

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
      name: "Declined",
    },
    {
      color: "#B4EFBA",
      name: "Completed",
    },
  ];

  const currentWeekDates = [];
  let dateIterator = startWeekDate;

  while (
    dateIterator?.isBefore(endWeekDate) ||
    dateIterator?.isSame(endWeekDate, "day")
  ) {
    currentWeekDates?.push(dateIterator.format("MM-DD-YYYY"));
    dateIterator = dateIterator?.add(1, "day");
  }
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDay);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(weekStart);
      nextDay.setDate(weekStart.getDate() + i);
      weekDates.push({
        day: daysOfWeek[nextDay.getDay()],
        date: dayjs(nextDay).format("MM-DD-YYYY"),
        //nextDay.toISOString().split("T")[0],
        dateString: nextDay.toISOString(),
      });
    }
    return weekDates;
  };

  const currentWeek = getCurrentWeekDates();

  const card2Data = currentWeek?.map((dayInfo, index) => {
    const matchingStatusData = dailyStatusData?.response?.find((data) => {
      return dayjs(data?.response?.date).format("MM-DD-YYYY") === dayInfo?.date;
    });
    return {
      id: index + 1,
      day: dayInfo?.day,
      date: dayInfo.date,
      dateString: dayInfo.dateString,
      pending: matchingStatusData?.response?.pending || 0,
      hold: matchingStatusData?.response?.hold || 0,
      completed: matchingStatusData?.response?.completed || 0,
      decline: matchingStatusData?.response?.declined || 0,
      allocated: matchingStatusData?.response?.allocated || 0,
    };
  });
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];
  const dayBeforeYesterday = new Date(
    new Date().setDate(new Date().getDate() - 2)
  )
    .toISOString()
    .split("T")[0];

  const rearrangedCard2Data = [
    ...card2Data.filter(
      (data) => data.date === dayjs(dayBeforeYesterday).format("MM-DD-YYYY")
    ),
    ...card2Data.filter(
      (data) => data.date === dayjs(yesterday).format("MM-DD-YYYY")
    ),
    ...card2Data.filter(
      (data) => data.date === dayjs(today).format("MM-DD-YYYY")
    ),

    ...card2Data.filter(
      (data) => ![dayBeforeYesterday, yesterday, today].includes(data.date)
    ),
  ];
  const router = useRouter();
  const uniqueCardData = rearrangedCard2Data?.filter(
    (value, index, self) =>
      self.findIndex((v) => v?.dateString === value?.dateString) === index
  );
  const sortedData = uniqueCardData?.sort((a, b) => {
    const dateA = new Date(a.dateString);
    const dateB = new Date(b.dateString);
    return dateA - dateB;
  });
  const uniqueDates = [...new Set(sortedData?.map((date) => date.dateString))];
  const showPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const nextDay = uniqueDates[currentIndex - 1];
      dispatch(getDailyTaskDatas(nextDay));
    }
  };

  const showNext = () => {
    if (currentIndex < card2Data?.length - 3) {
      setCurrentIndex(currentIndex + 1);
      const nextDay = uniqueDates[currentIndex + 3];
      dispatch(getDailyTaskDatas(nextDay));
    }
  };

  const currentDateIndex = sortedData?.find(
    (info) => info?.date === dayjs(currentDate).format("MM-DD-YYYY")
  );

  useEffect(() => {
    {
      rearrangedCard2Data
        .slice(currentIndex, currentIndex + 3)
        .map((data, index) => {
          return dispatch(getDailyTaskDatas(data?.dateString, router));
        });
    }
    if (currentDateIndex?.id > 2 && currentDateIndex?.id < 7) {
      setCurrentIndex(currentDateIndex?.id - 3);
    }
  }, []);

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
                color: "#FFB54D",
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
              {currentIndex < 7 ? (
                <Row
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {sortedData
                    .slice(currentIndex, currentIndex + 3)
                    .map((data, index) => (
                      <Col
                        key={index}
                        span={7}
                        className={styles.sliderdiv}
                        onClick={() => setSelectedDate(currentWeek[index])}
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
                            router.push("/physician/patients");
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
                                        router.push("/physician/patients");
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
                                        ? data?.completed
                                        : "No data"}
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
                "No DateFound"
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
