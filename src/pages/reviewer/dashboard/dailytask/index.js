import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import { Col, Row, Skeleton, Spin } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import dayjs from "dayjs";
import { connect } from "react-redux";
import Legends from "../../../../components/legends";
import { useRouter } from "next/router";
import { actions as ReviewerAction } from "../../../../stores/reviewer/dashboard";
import { getStorage, setStorage } from "../../../../utils/storages";
import { actions as ReviewerWorkQueueAction } from "../../../../stores/reviewer/workqueue";
import { allFilters } from "../../patients/headerFilters";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import CardSkeleton from "../../../../components/skeleton/card";
import { formatDateForIndex } from "../../../../utils/reusable";
import { commonFilterItems } from "../../patients";

const DailyTask = ({
  getAllDailyTask,
  routedData,
  dailyStatusDatas,
  getRoutedData,
  dailyTaskLoader,
}) => {
  const [selectedDate, setSelectedDate] = useState();
  const [currentDays, setCurrentDays] = useState([]);
  const [responseArray, setReponseArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const proxyRole = getStorage("proxyRole")
  const bullets = [
    {
      color: "#B4EFBA",
      name: "Completed",
    },
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
      return getAllDailyTask({ date: data?.dateString });
    });
  }, []);

  useEffect(() => {
    if (dailyStatusDatas && selectedDate) {
      responseArray.push(dailyStatusDatas?.data?.response);
      getDays(selectedDate, dailyStatusDatas);
    }
  }, [dailyStatusDatas, selectedDate]);
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
      return getAllDailyTask({ date: data?.dateString });
    });
  };

  const getDays = (selectedDate, statusData) => {
    const processedDays = selectedDate?.map((dayInfo, index) => {
      const matchingStatusData = responseArray?.find((status) => {
        return status?.date === dayInfo?.dateString;
      });
      return {
        id: index + 1,
        day: dayInfo?.day,
        date: dayInfo?.date,
        dateString: matchingStatusData?.date,
        pending: matchingStatusData?.pending || 0,
        hold: matchingStatusData?.hold || 0,
        completed: matchingStatusData?.completed || 0,
        decline: matchingStatusData?.declined || 0,
        allocated: matchingStatusData?.allocated || 0,
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
    setLoading(true);
    if (currentDays?.length > 3) {
      const updatedData = currentDays?.shift();
      const datas = [];
      const values = currentDays?.map((item) => {
        datas?.push({
          id: item?.id,
          day: item?.day,
          date: item?.date,
          dateString: item?.dateString,
        });
      });
      setSelectedDate(datas);
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
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
          {dailyTaskLoader || loading ? (
            <div className="mt-4">
              <CardSkeleton count={1} height={270} />
            </div>
          ) : (
            <Row>
              <Col span={1}>
                <div
                  id="previous-arrow"
                  name="previous-arrow"
                  onClick={showPrevious}
                  className={styles.ImgDIv}
                >
                  <FontAwesomeIcon
                    className="font5 mt-5"
                    icon={faChevronLeft}
                    id="prev-arrow"
                    name="prev-arrow"
                  />
                </div>
              </Col>

              <Col span={22}>
                {currentDays?.length > 0 ? (
                  <Row
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {uniqueData?.slice(0, 3)?.map((data, index) => (
                      <Col key={index} span={7} className={styles.sliderdiv}>
                        <h4
                          className={styles.headerTitle}
                          style={{ fontSize: "16px" }}
                          onClick={() => {
                            const params = {
                              selectedDates: {
                                dueDate: [dayjs(data?.date), dayjs(data?.date)],
                              },
                              selectedDateRanges: {
                                dueDate: {
                                  startDate: formatDateForIndex({
                                    date: data?.date,
                                    index: 0,
                                  }),
                                  endDate: formatDateForIndex({
                                    date: data?.date,
                                    index: 1,
                                  }),
                                },
                              },
                              activeFilters: commonFilterItems?.map((item) =>
                                item.title === "dueDate"
                                  ? { ...item, active: true }
                                  : item
                              ),
                              activeStatus:"PENDING",
                            };
                            getRoutedData(params);
                            router?.push("/reviewer/patients");
                          }}
                        >
                          <div className={styles.headerDisplay}>
                            <span> {data.day}</span>
                            <span className={styles.dateDisplay}>
                              {`(${data.date})`}
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
                            <div>
                              {bullets?.map((item) => {
                                return (
                                  <div className={`${styles.container}`}>
                                    <div
                                      style={{ display: "flex" }}
                                      // onClick={() => {
                                      //   const params = {
                                      //     selectedDates: {
                                      //       dueDate: [
                                      //         dayjs(data?.date),
                                      //         dayjs(data?.date),
                                      //       ],
                                      //     },
                                      //     selectedOption: {
                                      //       Status: item?.name.toUpperCase(),
                                      //     },
                                      //     selectedDateRanges: {
                                      //       dueDate: {
                                      //         startDate: formatDateForIndex({
                                      //           date: data?.date,
                                      //           index: 0,
                                      //         }),
                                      //         endDate: formatDateForIndex({
                                      //           date: data?.date,
                                      //           index: 1,
                                      //         }),
                                      //       },
                                      //     },
                                      //     activeFilters: commonFilterItems?.map(
                                      //       (item) =>
                                      //         item.title === "dueDate" ||
                                      //         item.title === "Status" ||
                                      //         item?.title === "Search"
                                      //           ? { ...item, active: true }
                                      //           : item
                                      //     ),
                                      //   };
                                      //   getRoutedData(params);
                                      //   router?.push("/reviewer/patients");
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
                                      {item.name === "Pending" && data.pending}
                                      {item.name === "Declined" &&
                                        data?.decline}
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
                  <></>
                )}
                <div className={` mt-3 ${styles.infoCards}`}>
                  <Legends bullets={bullets} />
                </div>
              </Col>

              <Col span={1}>
                <div
                  id="next-arrow"
                  name="next-arrow"
                  onClick={showNext}
                  className={styles.ImgDIv}
                >
                  <FontAwesomeIcon
                    id="next-arrowIcon"
                    name="next-arrowIcon"
                    className="font5 mt-5"
                    icon={faAngleRight}
                  />
                </div>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </>
  );
};

const connector = connect(
  (state) => ({
    dailyStatusDatas: state?.reviewer?.dashboard?.dailyTask,
    loader: state.admin?.workqueue?.patientsLoading,
    dailyTaskLoader: state?.reviewer?.dashboard?.dailyTaskLoader,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getAllDailyTask: ReviewerAction.dailyTaskAction,
    getFilteredList: ReviewerWorkQueueAction.reviewerFilterList,
    getRoutedData: allPatientSyncAction.getRoutedData,
  }
);
export default connector(DailyTask);
