import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import { Col, Row, Skeleton, Spin } from "antd";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import dayjs from "dayjs";
import Legends from "../../../../components/legends";
import { useRouter } from "next/router";
import spinSTYles from "../../../../styles/auth.module.css";
import { connect } from "react-redux";
import { actions as supervisorAction } from "../../../../stores/supervisor/dashboard";
import { dailyTaskData } from "../../../../stores/supervisor/dashboard/actions";
import { setStorage } from "../../../../utils/storages";
import moment from "moment";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import CardSkeleton from "../../../../components/skeleton/card";
import { formatDateForIndex } from "../../../../utils/reusable";
import { commonFilterItems } from "../../auditing";

const DailyTask = ({
  dailyStatusDatas,
  getAllDailyTask,
  getDailyTaskData,
  dailytask,
  dailyTaskLoader,
  getRoutedData,
}) => {
  const [selectedDate, setSelectedDate] = useState();
  const [currentDays, setCurrentDays] = useState([]);
  const [responseArray, setReponseArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const bullets = [
    {
      color: "#64B4BE",
      name: "Audited",
    },
    {
      color: "#FFB54D",
      name: "Audit Pending",
    },
    {
      color: "#F4CE14",
      name: "Audit Hold",
    },
    {
      color: "#C26100",
      name: "Re Audit",
    },
    {
      color: "#EB5252",
      name: "Audit Declined",
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
        pending: matchingStatusData?.auditPending || 0,
        hold: matchingStatusData?.auditHold || 0,
        audited: matchingStatusData?.audited || 0,
        reAudited: matchingStatusData?.reAudited || 0,
        allocated: matchingStatusData?.auditAllocated || 0,
        declined: matchingStatusData?.auditDeclined || 0,
      };
    });
    const sorted = processedDays?.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
    return setCurrentDays(sorted);
  };
  const getChartOption = (
    allocated,
    pending,
    hold,
    reAudited,
    audited,
    declined
  ) => {
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
              value: audited,
              name: "Audited",
              itemStyle: {
                color: "#64B4BE",
              },
            },
            {
              value: pending,
              name: "AuditPending",
              itemStyle: {
                color: "#FFB54D",
              },
            },
            {
              value: hold,
              name: "AuditHold",
              itemStyle: {
                color: "#F4CE14",
              },
            },
            {
              value: reAudited,
              name: "ReAudit",
              itemStyle: {
                color: "#C26100",
              },
            },
            {
              value: declined,
              name: "AuditDeclined",
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
              name: "Audit Allocated",
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
                  id="prev-arrow"
                  name="prev-arrow"
                  onClick={showPrevious}
                  className={styles.ImgDIv}
                >
                  <FontAwesomeIcon
                    id="previous-arrow"
                    name="previous-arrow"
                    className="font4 mt-5"
                    icon={faChevronLeft}
                  />
                </div>
              </Col>
              <Col span={22}>
                {currentDays?.length > 0 ? (
                  <Row
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {uniqueData?.slice(0, 3)?.map((data, index) => (
                      <Col
                        key={index}
                        span={7}
                        className={` ${styles.sliderdiv}`}
                      >
                        <h4
                          className={` cursor-pointer ${styles.headerTitle}`}
                          style={{ fontSize: "16px" }}
                          onClick={() => {
                            const params = {
                              selectedDates: {
                                auditedDueDate: [
                                  dayjs(data?.date),
                                  dayjs(data?.date),
                                ],
                              },
                              selectedDateRanges: {
                                auditedDueDate: {
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
                              activeFilters: commonFilterItems.map((item) =>
                                item.title === "auditedDueDate" ||
                                item?.title === "Search"
                                  ? { ...item, active: true }
                                  : item
                              ),
                            };
                            getRoutedData(params);
                            router?.push("/supervisor/auditing");
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
                          <Col span={11}>
                            <div className={styles.container}>
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
                                      onClick={() => {
                                        const params = {
                                          selectedOption: {
                                            Status: item?.name
                                              ? item.name === "Audit Pending" ||
                                                item.name === "Audit Declined"
                                                ? item.name
                                                    .replace(" ", "_")
                                                    .toUpperCase()
                                                : item.name === "Audit Hold" ||
                                                  item.name === "Re Audit"
                                                ? item.name
                                                    .replace(" ", "")
                                                    .toUpperCase()
                                                : item.name.toUpperCase()
                                              : "",
                                          },
                                          selectedDates: {
                                            auditedDueDate: [
                                              dayjs(data?.date),
                                              dayjs(data?.date),
                                            ],
                                          },
                                          selectedDateRanges: {
                                            auditedDueDate: {
                                              startDate: data?.date
                                                ? formatDateForIndex({
                                                    date: moment(
                                                      data?.date,
                                                      "MM-DD-YYYY"
                                                    ),
                                                    index: 0,
                                                  })
                                                : "",
                                              endDate: data?.date
                                                ? formatDateForIndex({
                                                    date: moment(
                                                      data?.date,
                                                      "MM-DD-YYYY"
                                                    ),
                                                    index: 1,
                                                  })
                                                : "",
                                            },
                                          },
                                          activeFilters: commonFilterItems.map(
                                            (item) =>
                                              item.title === "auditedDueDate" ||
                                              item?.title === "Search" ||
                                              item?.title === "Status"
                                                ? { ...item, active: true }
                                                : item
                                          ),
                                        };
                                        getRoutedData(params);
                                        router.push("/supervisor/auditing");
                                      }}
                                    >
                                      <div
                                        className={styles.bgColor}
                                        style={{
                                          backgroundColor: item.color,
                                        }}
                                      ></div>
                                      <div className={styles.statusName}>
                                        {item.name}
                                      </div>
                                      <div className={styles.subText}>
                                        {item.name === "Audit Pending"
                                          ? data.pending
                                          : item.name === "Audited"
                                          ? data?.audited
                                          : item.name === "Audit Hold"
                                          ? data.hold
                                          : item.name === "Re Audit"
                                          ? data?.reAudited
                                          : item.name === "Audit Declined" &&
                                            data.declined}
                                      </div>
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

                <div className={styles.infoCards}>
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
                    className="lead mt-5"
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
    dailyStatusDatas: state.supervisor?.dashboard?.dailyTask,
    loader: state.admin?.workqueue?.patientsLoading,
    dailyTaskLoader: state?.supervisor?.dashboard?.dailyTaskLoader,
  }),
  {
    getAllDailyTask: supervisorAction.dailyTaskAction,
    getRoutedData: allPatientSyncAction.getRoutedData,
  }
);
export default connector(DailyTask);
