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

const DailyTask = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      name: "Decline",
    },
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

  const router=useRouter()
  useEffect(() => {
    WeekDays?.slice(0, 3)?.map((date) => {
      dispatch(getDailyTaskDatas(date,router));
    });
  }, []);

  const showPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const showNext = () => {
    if (currentIndex < card2Data.length - 3) {
      setCurrentIndex(currentIndex + 1);
      const nextDay = WeekDays[currentIndex + 3];
      dispatch(getDailyTaskDatas(nextDay));
      // setWeekDays(prevDays => [...prevDays.slice(1), nextDay]);
    }
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const card2Data = daysOfWeek.map((day, index) => ({
    id: index + 1,
    day,
    pending: dailyStatusData[index]?.pending || 0,
    hold: dailyStatusData[index]?.hold || 0,
    completed: dailyStatusData[index]?.completed || 0,
    decline: dailyStatusData[index]?.decline || 0,
    allocated: dailyStatusData[index]?.allocated || 0,
  }));

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
              name: "Decline",
              itemStyle: {
                color: "#EB5252",
              },
            },
            {
              value: completed,
              name: "Completed",
              itemStyle: {
                color: "#E8FAEA",
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
              name:"Alocated",
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
              <Row style={{ display: "flex", justifyContent: "space-between" }}>
                {card2Data
                  .slice(currentIndex, currentIndex + 3)
                  .map((data, index) => (
                    <Col key={index} span={7} className={styles.sliderdiv}>
                      <h4
                        className={styles.headerTitle}
                        style={{ fontSize: "16px" }}
                      >
                        {data.day}
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
                            <div className={styles.container}>
                              Pending{" "}
                              <div className={styles.subText}>
                                {data.pending}
                              </div>
                            </div>
                            <div className={styles.container}>
                              Hold{" "}
                              <div className={styles.subText}>{data.hold}</div>
                            </div>
                            <div className={styles.container}>
                              Decline
                              <div className={styles.subText}>
                                {data.decline}
                              </div>{" "}
                            </div>
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
