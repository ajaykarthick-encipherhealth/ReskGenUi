import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import left from "../../../../images/dashboard/left.png";
import right from "../../../../images/dashboard/right.png";
import { Col, Row, Spin } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import dayjs from "dayjs";
import { useDispatch, connect } from "react-redux";
import Legends from "../../../../components/legends";
import { useRouter } from "next/router";
import { getFilteredList } from "../../../../store/actions/PatientsActions";
import spinSTYles from "../../../../styles/auth.module.css";
import { actions as dashbaordActions } from "../../../../stores/reviewer/dashboard";

const DailyTask = ({ dailyStatusData, DailyStatusData }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [currentDays, setCurrentDays] = useState([]);
  const dispatch = useDispatch();

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
        date: dayjs(today).format("MM-DD-YYYY"),
        dateString: today?.toISOString(),
      });
    }

    setSelectedDate(days);

    days?.map((data, index) => {
      return DailyStatusData({ date: data?.dateString });
    });
  }, []);

  useEffect(() => {
    if (dailyStatusData) {
      getDays(selectedDate, dailyStatusData?.data?.response);
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
      return DailyStatusData({ date: data?.dateString });
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
        pending: matchingStatusData?.data?.response?.pending || 0,
        hold: matchingStatusData?.data?.response?.hold || 0,
        completed: matchingStatusData?.data?.response?.completed || 0,
        decline: matchingStatusData?.data?.response?.declined || 0,
        allocated: matchingStatusData?.data?.response?.allocated || 0,
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
  const showNext = () => {
    if (currentDays?.length > 3) {
      const updatedData = currentDays.shift();
      const datas = currentDays.map(({ id, day, date, dateString }) => ({
        id,
        day,
        date,
        dateString,
      }));
      setSelectedDate(datas);
    }
  };

  const uniqueData = currentDays?.filter((value, index, self) => {
    const firstIndex = self?.findIndex(
      (item) => item?.day === value?.day && item?.date === value?.date
    );
    return index === firstIndex;
  });

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
                  {uniqueData?.slice(0, 3)?.map((data, index) => (
                    <Col key={data?.id} span={7} className={styles.sliderdiv}>
                      <h4
                        className={styles.headerTitle}
                        style={{ fontSize: "16px" }}
                        onClick={() => {
                          dispatch(
                            getFilteredList({
                              dayDate: data?.date,
                            })
                          );
                          router?.push("/reviewer/patients");
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
                                      router?.push("/reviewer/patients");
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
                                    {item.name === "Pending" && data.pending}
                                    {item.name === "Declined" && data?.decline}
                                    {item.name === "Hold"
                                      ? data.hold
                                      : item.name === "Completed" &&
                                        data?.completed}
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
const enhancer = connect(
  (state) => ({
    dailyStatusData: state?.reviewer,
  }),
  {
    DailyStatusData: dashbaordActions.dailyTaskAction,
  }
);
export default enhancer(DailyTask);
