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

const DailyTask = ({
  dailyStatusDatas,
  getAllDailyTask,
  getDailyTaskData,
  dailytask,
  getRoutedData,
}) => {
  const [selectedDate, setSelectedDate] = useState();
  const [currentDays, setCurrentDays] = useState([]);
  const [responseArray, setReponseArray] = useState([]);
  const allFilters = [
    "Reviewer Status",
    "Select Audited Status",
    "Audited Date",
  ];
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
  const uniqueData = currentDays?.filter((value, index, self) => {
    const firstIndex = self?.findIndex(
      (item) => item?.day === value?.day && item?.date === value?.date
    );
    return index === firstIndex;
  });
  const renderCardSkeleton = () => (
    <Row
      gutter={[16, 16]}
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Col
          key={index}
          xs={24}
          sm={12}
          md={8}
          lg={7}
          className={styles.sliderdiv}
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "12px",
            padding: "5px",
            marginBottom: "16px",
            height: "260px",
          }}
        >
          <Row>
            <Col span={12}>
              <div>
                <Skeleton.Input
                  style={{ width: "100%", height: "200px" }}
                  active
                />
              </div>
            </Col>
            <Col span={12} className={styles.headerTitle}>
              <div>
                {Array.from({ length: bullets.length }).map((_, i) => (
                  <div className={styles.container} key={i}>
                    <Skeleton.Input style={{ width: 30 }} active />
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
  return (
    <>
      <HeadTitle header="Daily Task" />
      <div className={styles.card2}>
        <Card borderRadius="28px" style={{ display: "flex" }}>
          <Row>
            <Col span={1}>
              <div onClick={showPrevious} className={styles.ImgDIv}>
                <FontAwesomeIcon className="font4 mt-5" icon={faChevronLeft} />
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
                          // setStorage(
                          //   "SuperVisorfilter",
                          //   JSON.stringify(allFilters)
                          // );

                          const params = {
                            // AuditedDueDate: JSON.stringify({
                            selectedDates: {
                              AuditedDueDate: [
                                dayjs(data?.date),
                                dayjs(data?.date),
                              ],
                            },
                            selectedDateRange: {
                              AuditedDueDate: {
                                startDate: data?.date
                                  ? `${moment(data?.date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    )}T00:00:00.000Z`
                                  : "",

                                endDate: data?.date
                                  ? `${moment(data?.date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    )}T23:59:59.999Z`
                                  : "",
                              },
                            },
                            activeFilters: ["Audited Due Date"],

                            // })
                          };

                          // setStorage("supervisorDate", JSON.stringify(params));
                          // router?.push(
                          //   {
                          //     pathname: "/supervisor/auditing",
                          //     query: params,
                          //   },
                          //   "/supervisor/auditing"
                          // );
                          getRoutedData(params);
                          // getFilteredList(allFilters);
                          router.push(`/supervisor/auditing`);
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
                                        selectedOption: item?.name
                                          ? item?.name === "AuditPending" ||
                                            item?.name === "AuditDeclined"
                                            ? item?.name
                                                .replace(
                                                  /([a-z])([A-Z])/g,
                                                  "$1_$2"
                                                )
                                                .toUpperCase()
                                            : item?.name.toUpperCase()
                                          : "",
                                        selectedDates: {
                                          AuditedDueDate: [
                                            dayjs(data?.date),
                                            dayjs(data?.date),
                                          ],
                                        },
                                        selectedDateRange: {
                                          AuditedDueDate: {
                                            startDate: data?.date
                                              ? `${moment(
                                                  data?.date,
                                                  "MM-DD-YYYY"
                                                ).format(
                                                  "YYYY-MM-DD"
                                                )}T00:00:00.000Z`
                                              : "",

                                            endDate: data?.date
                                              ? `${moment(
                                                  data?.date,
                                                  "MM-DD-YYYY"
                                                ).format(
                                                  "YYYY-MM-DD"
                                                )}T23:59:59.999Z`
                                              : "",
                                          },
                                        },
                                        activeFilters: [
                                          // "Reviewer Status",
                                          "Select Audited Status",
                                          // "Audited Date",
                                          "Audited Due Date",
                                        ],
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
                                    <div className={styles.statusName}>{item.name}</div>
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
                renderCardSkeleton()
              )}

              <div className={styles.infoCards}>
                <Legends bullets={bullets} />
              </div>
            </Col>
            <Col span={1}>
              <div onClick={showNext} className={styles.ImgDIv}>
                {" "}
                <FontAwesomeIcon className="lead mt-5" icon={faAngleRight} />
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

const connector = connect(
  (state) => ({
    // dailyStatusDatas: state?.workFlow?.dailyTask,
    dailyStatusDatas: state.supervisor?.dashboard?.dailyTask,

    dailytask: state,
    loader: state.admin?.workqueue?.patientsLoading,
  }),
  {
    getAllDailyTask: supervisorAction.dailyTaskAction,
    // getDailyTaskData: supervisorAction.dailyTaskData,
    getRoutedData: allPatientSyncAction.getRoutedData,
  }
);
export default connector(DailyTask);
