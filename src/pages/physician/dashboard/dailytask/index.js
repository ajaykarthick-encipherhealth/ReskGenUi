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
import { getpatientsList } from "../../../../store/actions/PatientsActions";

const DailyTask = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [cardDetails,setCardDetails]=useState([])
  const dailyStatusData = useSelector((state) => state.workFlow.dailyTask);
  const currentDate = dayjs();
  const startWeekDate = currentDate.startOf("week");
  const endWeekDate = currentDate.endOf("week");
  const dispatch = useDispatch();

  const bullets = [
    {
      color: "#FFB54D",
      name: "Pending",
      title: "pending",
    },
    {
      color: "#AD94FA",
      name: "Hold",
      title: "hold",
    },
    {
      color: "#EB5252",
      name: "Declined",
      title: "declined",
    },
    {
      color: "#B4EFBA",
      name: "Completed",
      title: "completed",
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

  const currentWeekDates = [];
  let dateIterator = startWeekDate;

  while (
    dateIterator?.isBefore(endWeekDate) ||
    dateIterator?.isSame(endWeekDate, "day")
  ) {
    currentWeekDates?.push(dateIterator.format("YYYY-MM-DD"));
    dateIterator = dateIterator?.add(1, "day");
  }
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
        date: nextDay.toISOString().split("T")[0],
        dateString: nextDay.toISOString(),
      });
    }
    return weekDates;
  };

  const currentWeek = getCurrentWeekDates();

  const card2Data = currentWeek?.map((dayInfo, index) => {
    const matchingStatusData = dailyStatusData?.find((data) => {
      return dayjs(data?.response?.date).format("YYYY-MM-DD") === dayInfo?.date;
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

  const WeekDays = currentWeekDates?.map((date) => {
    const formattedDate = dayjs(date)
      .startOf("day")
      .add(6, "hour")
      .add(39, "minute")
      .add(22, "second")
      .add(786, "millisecond")
      .toISOString();
    return formattedDate;
  });

  const router = useRouter();
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
    ...card2Data.filter((data) => data.date === dayBeforeYesterday),
    ...card2Data.filter((data) => data.date === yesterday),
    ...card2Data.filter((data) => data.date === today),

    ...card2Data.filter(
      (data) => ![dayBeforeYesterday, yesterday, today].includes(data.date)
    ),
  ];
  useEffect(() => {
    rearrangedCard2Data?.slice(0, 3)?.map((data) => {
      dispatch(getDailyTaskDatas(data.dateString, router));
    });
  }, []);

  const showPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); 
    }
  };

  const showNext = () => {
    const maxIndex = card2Data.length - 3; 

    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isNextDisabled = () => {
    const today=new Date()
    const currentDateIndex = currentWeek.findIndex((day) => day.date === today);

    return currentDateIndex >= 16;
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
  const handleDays = (status) => {
    if (status) {
      const url = `processedStatus=${status?.toUpperCase()}&processedStart=${selectedDate}T00%3A00%3A00.000Z&processedEnd=${selectedDate}T23%3A07%3A59.016Z`;
      dispatch(getpatientsList(0, url));
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
                {rearrangedCard2Data
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
                          const url = `processedStart=${selectedDate}T00%3A00%3A00.000Z&processedEnd=${selectedDate}T23%3A07%3A59.016Z`;
                          dispatch(getpatientsList(0, url));
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
                              const matchingStatus = dailyStatusData.find(
                                (status) =>
                                  status.response[item?.title.toLowerCase()] !==
                                  undefined
                              );

                              return (
                                <div
                                  className={styles.container}
                                  onClick={() => {
                                    handleDays(item?.name);
                                  }}
                                >
                                  <div style={{ display: "flex" }}>
                                    <div
                                      className={styles.bgColor}
                                      style={{
                                        backgroundColor: item.color,
                                      }}
                                    ></div>
                                    {item.name}
                                  </div>
                                  <div className={styles.subText}>
                                    {item.title === "pending"
                                      ? data.pending
                                      : item.title === "declined"
                                      ? data?.decline
                                      : item.title === "hold"
                                      ? data.hold
                                      : item.title === "completed"
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
              <div className={styles.infoCards}>
                <Legends bullets={bullets} />
              </div>
            </Col>
            <Col span={1}>
              <div onClick={showNext} className={styles.ImgDIv} disabled={isNextDisabled()}>
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
