import { connect } from "react-redux";
import { Card, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import {
  getDateWeek,
  getDaysInMonth,
  getFormattedChartData,
  getTotalChart,
  useHasMounted,
  useWindowWidth,
  workQueueWidget,
} from "../../component/function";
import AppChart from "../../component/appchart";
import YearPicker from "../../../../components/yearpicker";
import styles from "../../reviewerStyles.module.css";
import Buttonscroller from "../../../../components/buttonSroller";
import { Buttons } from "../../../../pages/reviewer/workingstatus";
import {
  faAngleRight,
  faCalendar,
  faChevronLeft,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import StatusCard from "../../component/statusCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Notifications from "../../component/notifications";
import Holdstatus from "../../component/holdstatus";
import { getColSpan } from "../../component/function";
import { getRowSpan } from "../../component/function";
import { getLocalStored } from "../../../../utils/storages";
import EmptyComponent from "../../component/empty/EmptyComponent";
import { getDashboardItems } from "../../component/function/resubaleGetStorage";
import Headtitle from "../../component/headtitle";
import { formatDateTime, statusFormate } from "../../../../utils/reusable";
import moment from "moment";
import actions from "../../../../stores/admin/dashboard1/actions";
import { getColorValue } from "../../../../utils/reusable";
import CardSkeleton from "../../../../components/skeleton/card";

const data = [
  { status: "Allocated", value: 5 },
  { status: "Completed", value: 8 },
  { status: "InProgress", value: 3 },
  { status: "Reassigned", value: 10 },
];

const generateMockTaskData = (date) => {
  const formattedDate = moment(date).format("MM-DD-YYYY");
  const dayName = moment(date).format("dddd");

  return {
    day: dayName,
    date: formattedDate,
    series: [
      { name: "Allocated", value: 0, color: "#B366FF" },
      {
        name: "Completed",
        value: 0,
        color: "#92D050",
      },
      {
        name: "InProgress",
        value: 0,
        color: "#00B0F0",
      },
      {
        name: "Reassigned",
        value: 0,
        color: "#FF5C5C",
      },
    ],
  };
};

const dummyData = [
  {
    id: 1,
    content: "Test notification 1 from dummy",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Priya",
      lastName: "V",
      role: "Developer",
    },
  },
  {
    id: 2,
    content: "System update scheduled",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Rahul",
      lastName: "Sharma",
      role: "Admin",
    },
  },
];

const dummyHoldData = [
  {
    patientId: "PID-001",
    noteText: "Waiting for test results",
    holdNotes: [{ 2023: "Hold due to pending reports" }],
  },
  {
    patientId: "PID-002",
    noteText: "Insurance issue",
    holdNotes: [{ 2023: "Pending claim review" }],
  },
];

const dailyTaskData5 = [
  "Allocated",
  "Completed",
  "InProgress",
  "ReassignedPending",
  "ReassignedCompleted",
];
const dailyTaskData7 = [
  "Allocated",
  "Completed",
  "InProgress",
  "ReassignedPending",
  "ReassignedCompleted",
  "QueriedApproved",
  "QueriedPending",
];

const getCharts = ({
  selectedRole,
  type,
  chartType,
  pagesLoader,
  visibleTasks,
  handlePrevious,
  handleNext,
  accuracyState,
  productivityState,
  handleButtonClick,
  handleMonthChange,
  handleYearChange,
  userSummaryResponse,
  userSummaryLoading,
  dailyTaskLoading,
  userDailySummaryLoading,
  accuracyResponse,
  accuracyLoading,
  productivityResponse,
  productivityLoading,
  currentDate,
  dashboardNotification,
  dashboardNotificationLoading,
  windowWidth,
}) => {
  switch (type) {
    case "WorkFlow":
      const chart5Data = [
        { status: "Allocated", value: userSummaryResponse?.allocatedCount },
        { status: "InProgress", value: userSummaryResponse?.pendingCount },
        { status: "Completed", value: userSummaryResponse?.completedCount },
        {
          status: "ReassignedPending",
          value: userSummaryResponse?.reassignedPendingCount,
        },
        {
          status: "ReassignedCompleted",
          value: userSummaryResponse?.reassignedCompletedCount,
        },
      ];
      const userSummaryData = chart5Data;
      if (chartType === "card") {
        return userSummaryLoading ? (
          <CardSkeleton count={1} height={200} />
        ) : (
          <div className="container">
            <div className="row g-2">
              {userSummaryData.map((item, idx) => (
                <div className={idx === 0 ? "col-12" : "col-6"} key={idx}>
                  <StatusCard
                    key={idx}
                    status={item.status}
                    value={item.value}
                    coderName={selectedRole}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
      const defaultColors = [
        getColorValue("1"),
        getColorValue("2"),
        getColorValue("3"),
        getColorValue("4"),
        getColorValue("5"),
      ];
      const formattedChartData = userSummaryData.map((item, index) => ({
        name: item.status,
        value: item.value,
        color: defaultColors[index % defaultColors.length],
      }));

      const {
        categories: fileChartCategories,
        formattedSeries: fileChartFormatted,
        height: fileChartHeight,
      } = getFormattedChartData(formattedChartData, chartType);

      return pagesLoader || userSummaryLoading ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategories}
          series={fileChartFormatted}
          height={fileChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(chart5Data)}
        />
      );
    case "DailyTask5":
      return (
        <div className="d-flex gap-3 justify-content-between flex-wrap">
          <div className="d-flex justify-content-between align-items-center w-100">
            <FontAwesomeIcon
              className="font5 mt-5"
              icon={faChevronLeft}
              id="prev-arrow"
              name="prev-arrow"
              onClick={handlePrevious}
              style={{ cursor: "pointer" }}
            />
            {dailyTaskLoading || pagesLoader || userDailySummaryLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton.Node
                      active={true}
                      style={{
                        width: windowWidth > 1290 ? 300 : 200,
                        height: 250,
                      }}
                    />
                  ))
              : visibleTasks?.slice(0, 3).map((task, index) => {
                  const categories = task.series.map((s) => s.name);
                  const values = task.series.map((s) => s.value);
                  const colors = task.series.map((s) => s.color);
                  const formattedSeries =
                    chartType === "bar" || chartType === "line"
                      ? [
                          {
                            name: "Tasks",
                            data: values,
                            colorBy: "data",
                            itemStyle: {
                              color: (params) => colors[params.dataIndex],
                            },
                          },
                        ]
                      : task.series;
                  let filteredSeries;

                  if (chartType === "bar" || chartType === "line") {
                    const baseSeries = formattedSeries[0];

                    const filtered = task.series
                      .map((item, index) => ({
                        name: item.name,
                        value: baseSeries.data[index],
                        color: colors[index],
                      }))
                      .filter((item) => dailyTaskData5.includes(item.name));

                    filteredSeries = [
                      {
                        name: "Tasks",
                        data: filtered.map((item) => item.value),
                        itemStyle: {
                          color: (params) => filtered[params.dataIndex].color,
                        },
                        label: {
                          show: true,
                          formatter: (params) =>
                            `${filtered[params.dataIndex].name}: ${
                              params.value
                            }`,
                        },
                      },
                    ];
                  } else {
                    filteredSeries = formattedSeries.filter((item) =>
                      dailyTaskData5.includes(item.name)
                    );
                  }
                  const filteredCategories = categories.filter((item) =>
                    dailyTaskData5.includes(item)
                  );

                  return (
                    <div
                      key={index}
                      className="border rounded p-3 cr-pointer"
                      style={{
                        width: "28%",
                        minWidth: 250,
                        boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                        transition: "box-shadow 0.3s ease-in-out",
                      }}
                    >
                      <div className="fw-bold text-center mb-2">
                        {task.day} ({task.date})
                      </div>

                      <AppChart
                        type={chartType}
                        categories={filteredCategories}
                        series={filteredSeries}
                        height={240}
                        showLegend={true}
                        showLegendBarLine={false}
                        radius={["40%", "70%"]}
                        isDailyChart={true}
                        xAxisRotated={true}
                        total={getTotalChart(task.series)}
                      />
                    </div>
                  );
                })}

            <FontAwesomeIcon
              id="next-arrowIcon"
              name="next-arrowIcon"
              className="font5 mt-5"
              icon={faAngleRight}
              onClick={handleNext}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="d-flex justify-content-center w-100 my-2 gap-4 flex-wrap">
            {visibleTasks[0]?.series
              ?.filter((item) => dailyTaskData5.includes(item.name))
              ?.map((item) => (
                <div key={item.name} className="d-flex align-items-center">
                  <div
                    style={{
                      backgroundColor: item.color,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  ></div>
                  <span>{statusFormate(item.name)}</span>
                </div>
              ))}
          </div>
        </div>
      );
    case "DailyTask7":
      return (
        <div className="d-flex gap-3 justify-content-between flex-wrap">
          <div className="d-flex justify-content-between align-items-center w-100">
            <FontAwesomeIcon
              className="font5 mt-5"
              icon={faChevronLeft}
              id="prev-arrow"
              name="prev-arrow"
              onClick={handlePrevious}
              style={{ cursor: "pointer" }}
            />
            {dailyTaskLoading || pagesLoader || userDailySummaryLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton.Node
                      active={true}
                      style={{
                        width: windowWidth > 1290 ? 300 : 200,
                        height: 250,
                      }}
                    />
                  ))
              : visibleTasks?.slice(0, 3).map((task, index) => {
                  const categories = task.series.map((s) => s.name);
                  const values = task.series.map((s) => s.value);
                  const colors = task.series.map((s) => s.color);

                  const formattedSeries =
                    chartType === "bar" || chartType === "line"
                      ? [
                          {
                            name: "Tasks",
                            data: values,
                            colorBy: "data",
                            itemStyle: {
                              color: (params) => colors[params.dataIndex],
                            },
                          },
                        ]
                      : task.series;
                  let filteredSeries;

                  if (chartType === "bar" || chartType === "line") {
                    const baseSeries = formattedSeries[0];

                    const filtered = task.series
                      .map((item, index) => ({
                        name: item.name,
                        value: baseSeries.data[index],
                        color: colors[index],
                      }))
                      .filter((item) => dailyTaskData7.includes(item.name));

                    filteredSeries = [
                      {
                        name: "Tasks",
                        data: filtered.map((item) => item.value),
                        itemStyle: {
                          color: (params) => filtered[params.dataIndex].color,
                        },
                        label: {
                          show: true,
                          formatter: (params) =>
                            `${filtered[params.dataIndex].name}: ${
                              params.value
                            }`,
                        },
                      },
                    ];
                  } else {
                    filteredSeries = formattedSeries.filter((item) =>
                      dailyTaskData7.includes(item.name)
                    );
                  }
                  const filteredCategories = categories.filter((item) =>
                    dailyTaskData7.includes(item)
                  );

                  return (
                    <div
                      key={index}
                      className="border rounded p-3 cr-pointer"
                      style={{
                        width: "28%",
                        minWidth: 250,
                        boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                        transition: "box-shadow 0.3s ease-in-out",
                      }}
                    >
                      <div className="fw-bold text-center mb-2">
                        {task.day} ({task.date})
                      </div>

                      <AppChart
                        type={chartType}
                        categories={filteredCategories}
                        series={filteredSeries}
                        height={240}
                        showLegend={true}
                        showLegendBarLine={false}
                        radius={["40%", "70%"]}
                        isDailyChart={true}
                        xAxisRotated={true}
                        total={getTotalChart(task.series)}
                      />
                    </div>
                  );
                })}

            <FontAwesomeIcon
              id="next-arrowIcon"
              name="next-arrowIcon"
              className="font5 mt-5"
              icon={faAngleRight}
              onClick={handleNext}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="d-flex justify-content-center w-100 my-2 gap-4 flex-wrap">
            {visibleTasks[0]?.series
              ?.filter((item) => dailyTaskData7.includes(item.name))
              ?.map((item) => (
                <div key={item.name} className="d-flex align-items-center">
                  <div
                    style={{
                      backgroundColor: item.color,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  ></div>
                  <span>{statusFormate(item.name)}</span>
                </div>
              ))}
          </div>
        </div>
      );
    case "Accuracy":
      const accuracyData = new Array(31).fill(0);
      const accuracySelectedYear = accuracyState.selectedYear;
      const accuracySelectedMonth = accuracyState.selectedMonth;

      let accuracyDayCategories = [];

      const MONTH_NAMES = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      if (accuracyState.currentBtn === "Daily") {
        accuracyDayCategories = Array.from(
          {
            length: getDaysInMonth(accuracySelectedYear, accuracySelectedMonth),
          },
          (_, i) => i + 1
        );
        accuracyResponse?.accuracyData?.forEach(({ day, accuracy }) => {
          if (day >= 1 && day <= 31) {
            accuracyData[day - 1] = accuracy;
          }
        });
      } else if (accuracyState.currentBtn === "Weekly") {
        const maxWeek = Math.max(
          ...accuracyResponse?.accuracyData
            .map((item) => item.week)
            .filter((week) => week > 0)
        );
        accuracyDayCategories = Array.from(
          { length: maxWeek },
          (_, i) => `Week ${i + 1}`
        );
        accuracyResponse?.accuracyData?.forEach(({ week, accuracy }) => {
          if (week >= 1) {
            accuracyData[week - 1] = accuracy;
          }
        });
      } else if (accuracyState.currentBtn === "Monthly") {
        const uniqueMonths = [
          ...new Set(accuracyResponse?.accuracyData.map((item) => item.month)),
        ];
        accuracyDayCategories = uniqueMonths
          .sort((a, b) => a - b)
          .map((month) => MONTH_NAMES[month - 1]);
        accuracyResponse?.accuracyData?.forEach(({ month, accuracy }) => {
          if (month >= 1 && month <= 12) {
            accuracyData[month - 1] = accuracy;
          }
        });
      }
      accuracyResponse?.accuracyData?.forEach(({ month, accuracy }) => {
        if (month >= 1 && month <= 12) {
          accuracyData[month - 1] = accuracy;
        }
      });

      const rawAccuracyData = accuracyResponse?.accuracyData || [];

      // const filteredAccuracies = rawAccuracyData
      //   .filter((entry) => {
      //     if (accuracyState.currentBtn === "Daily") {
      //       return entry.day <= new Date().getDate();
      //     } else if (accuracyState.currentBtn === "Weekly") {
      //       return entry.week <= getDateWeek(currentDate);
      //     } else if (accuracyState.currentBtn === "Monthly") {
      //       return entry.month <= currentDate.getMonth() + 1;
      //     }
      //     return false;
      //   })
      //   .map((entry) => entry.accuracy)
      //   .filter((accuracy) => typeof accuracy === "number" && accuracy > 0);

      // const averageAccuracy =
      //   filteredAccuracies.length > 0
      //     ? filteredAccuracies.reduce((a, b) => a + b, 0) /
      //       filteredAccuracies.length
      //     : 0;
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth() + 1;
      const todayDay = today.getDate();
      const getWeekOfMonth = (date = new Date()) => {
        const day = date.getDate();
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthStartDay = monthStart.getDay() || 7;

        return Math.ceil((day + monthStartDay - 1) / 7);
      };

      const currentWeekOfMonth = getWeekOfMonth(today);
      const numericalData =
        rawAccuracyData?.length > 0 &&
        rawAccuracyData.filter((item) => {
          if (!item || item === false) return false;
          const { year, month, day, week } = item;
          if (year > todayYear) return false;
          if (year < todayYear || (year === todayYear && month < todayMonth)) {
            return true;
          }
          if (
            year === todayYear &&
            month === todayMonth &&
            week < currentWeekOfMonth
          ) {
            return true;
          }
          if (
            year === todayYear &&
            month === todayMonth &&
            week === currentWeekOfMonth &&
            day <= todayDay
          ) {
            return true;
          }
          return false;
        });

      const sum =
        numericalData &&
        numericalData?.reduce((acc, value) => acc + value.accuracy, 0);

      const averageAccuracy =
        numericalData?.length > 0 ? sum / numericalData.length : 0;
      return (
        <>
          <div className={`d-flex justify-content-end gap-4 w-100`}>
            <div className="d-flex justify-content-between">
              <YearPicker
                onChangeYear={(date, dateString) =>
                  handleYearChange("Accuracy", date, dateString)
                }
                onChangeMonth={(date) => handleMonthChange("Accuracy", date)}
                type={accuracyState.currentBtn}
                bgColor="#F3F3FF"
                val={accuracyState.month}
                val1={accuracyState.year}
                id="accuracy-picker1"
                selectid="accuracy-select"
              />
            </div>
            <div className={styles.btnScroller}>
              <Buttonscroller
                id="accuracy-btncontainer"
                Buttons={Buttons}
                activeColor="#fff"
                handleButtonClick={(index, btn) =>
                  handleButtonClick("Accuracy", index, btn)
                }
                activeButton={accuracyState.activeButton}
                inActiveColor="#000000"
                activeBg="#2472FF"
                containerBg="#E6EEFF"
              />
            </div>
          </div>
          {accuracyLoading ? (
            <div className="my-4">
              <CardSkeleton count={1} height={210} />
            </div>
          ) : (
            <div className="row">
              <div className="col-9">
                <AppChart
                  type={chartType}
                  categories={accuracyDayCategories}
                  series={[
                    {
                      name: "Accuracy",
                      data: accuracyData,
                      color: "#2CAFFE",
                    },
                  ]}
                />
              </div>
              <div className="col-3 my-4">
                <div
                  style={{
                    height: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                    border: "0.5px solid #3479FE",
                    backgroundColor: "#F0F6FF",
                  }}
                  className="w-100"
                >
                  <div className="mt-5">
                    <div className="d-flex justify-content-center py-2">
                      <FontAwesomeIcon
                        className={`mt-1 ${styles.Img}`}
                        icon={faGaugeHigh}
                      />
                      <div className={styles.heading}>Average Quality</div>
                    </div>
                    <div className={styles.percentage}>
                      <div className={styles.insideTitle}>
                        {averageAccuracy
                          ? `${Math.floor(averageAccuracy)}%`
                          : `0%`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    case "Notifications":
      return (
        <Notifications
          notificationResponse={dashboardNotification}
          notificationLoading={dashboardNotificationLoading}
        />
      );
    case "CompletedStatus":
      let productivityAllocatedData = new Array(31).fill(0);
      let productivityCompletedData = new Array(31).fill(0);
      const productivitySelectedYear = accuracyState.selectedYear;
      const productivitySelectedMonth = accuracyState.selectedMonth;

      let productivityDayCategories = [];

      const MONTH_NAMES1 = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      if (productivityState.currentBtn === "Daily") {
        productivityDayCategories = Array.from(
          {
            length: getDaysInMonth(
              productivitySelectedYear,
              productivitySelectedMonth
            ),
          },
          (_, i) => i + 1
        );
        productivityResponse?.productivityAllocatedCount?.forEach(
          ({ day, count }) => {
            if (day >= 1 && day <= 31) {
              productivityAllocatedData[day - 1] = count;
            }
          }
        );
        productivityResponse?.productivityCompletedCount?.forEach(
          ({ day, count }) => {
            if (day >= 1 && day <= 31) {
              productivityCompletedData[day - 1] = count;
            }
          }
        );
      } else if (productivityState.currentBtn === "Weekly") {
        const maxWeek = Math.max(
          ...productivityResponse?.productivityAllocatedCount
            .map((item) => item.week)
            .filter((week) => week > 0)
        );
        productivityDayCategories = Array.from(
          { length: maxWeek },
          (_, i) => `Week ${i + 1}`
        );
        productivityResponse?.productivityAllocatedCount?.forEach(
          ({ week, count }) => {
            if (week >= 1) {
              productivityAllocatedData[week - 1] = count;
            }
          }
        );
        productivityResponse?.productivityCompletedCount?.forEach(
          ({ week, count }) => {
            if (week >= 1) {
              productivityCompletedData[week - 1] = count;
            }
          }
        );
      } else if (productivityState.currentBtn === "Monthly") {
        const uniqueMonths = [
          ...new Set(
            productivityResponse?.productivityAllocatedCount.map(
              (item) => item.month
            )
          ),
        ];
        productivityDayCategories = uniqueMonths
          .sort((a, b) => a - b)
          .map((month) => MONTH_NAMES1[month - 1]);
        productivityResponse?.productivityAllocatedCount?.forEach(
          ({ month, count }) => {
            if (month >= 1 && month <= 12) {
              productivityAllocatedData[month - 1] = count;
            }
          }
        );
        productivityResponse?.productivityCompletedCount?.forEach(
          ({ month, count }) => {
            if (month >= 1 && month <= 12) {
              productivityCompletedData[month - 1] = count;
            }
          }
        );
      }
      productivityResponse?.productivityAllocatedCount?.forEach(
        ({ month, count }) => {
          if (month >= 1 && month <= 12) {
            productivityAllocatedData[month - 1] = count;
          }
        }
      );

      productivityResponse?.productivityCompletedCount?.forEach(
        ({ day, count }) => {
          if (day >= 1 && day <= 31) {
            productivityCompletedData[day - 1] = count;
          }
        }
      );
      return (
        <>
          <div className={`d-flex justify-content-end gap-4 w-100`}>
            <div className="d-flex justify-content-between">
              <YearPicker
                type={productivityState.currentBtn}
                bgColor="#F3F3FF"
                onChangeYear={(date, dateString) =>
                  handleYearChange("Productivity", date, dateString)
                }
                onChangeMonth={(date) =>
                  handleMonthChange("Productivity", date)
                }
                val={productivityState.month}
                val1={productivityState.year}
                selectid="productivity-select"
                id="productivity-picker1"
              />
            </div>
            <div className={styles.btnScroller}>
              <Buttonscroller
                Buttons={Buttons}
                activeColor="#fff"
                handleButtonClick={(index, btn) =>
                  handleButtonClick("Productivity", index, btn)
                }
                activeButton={productivityState.activeButton}
                inActiveColor="#000000"
                activeBg="#2472FF"
                containerBg="#F3F3FF"
                id="productivity-btncontainer"
              />
            </div>
          </div>
          {productivityLoading ? (
            <div className="my-4">
              <CardSkeleton count={1} height={210} />
            </div>
          ) : (
            <AppChart
              type={chartType}
              categories={productivityDayCategories}
              series={[
                {
                  name: "Completed",
                  data: productivityAllocatedData,
                  color: getColorValue("8"),
                },
                {
                  name: "Allocated",
                  data: productivityCompletedData,
                  color: getColorValue("3"),
                },
              ]}
            />
          )}
        </>
      );
    // case "HoldStatus":
    //   return <Holdstatus useDummyData={true} dummyHoldData={dummyHoldData} />;
    case "WorkFlowChart7":
      const chart7Data = [
        { status: "Allocated", value: userSummaryResponse?.allocatedCount },
        { status: "InProgress", value: userSummaryResponse?.pendingCount },
        { status: "Completed", value: userSummaryResponse?.completedCount },
        {
          status: "QueryPending",
          value: userSummaryResponse?.queryPendingCount,
        },
        {
          status: "QueryApproved",
          value: userSummaryResponse?.queryApprovedCount,
        },
        {
          status: "ReassignedPending",
          value: userSummaryResponse?.reassignedPendingCount,
        },
        {
          status: "ReassignedCompleted",
          value: userSummaryResponse?.reassignedCompletedCount,
        },
      ];
      const userSummaryDatas = chart7Data;

      if (chartType === "card") {
        return userSummaryLoading ? (
          <CardSkeleton count={1} height={200} />
        ) : (
          <div className="container">
            <div className="row g-2">
              {userSummaryDatas.map((item, idx) => (
                <div className={idx === 0 ? "col-12" : "col-4"} key={idx}>
                  <StatusCard
                    key={idx}
                    status={item.status}
                    value={item.value}
                    coderName={selectedRole}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
      const defaultColor = [
        getColorValue("1"),
        getColorValue("2"),
        getColorValue("3"),
        getColorValue("4"),
        getColorValue("5"),
        getColorValue("6"),
        getColorValue("7"),
      ];
      const formattedChartDatas = userSummaryDatas.map((item, index) => ({
        name: item.status,
        value: item.value,
        color: defaultColor[index % defaultColor.length],
      }));

      const {
        categories: fileChartCategorie,
        formattedSeries: fileChartFormatteds,
        height: fileChartHeights,
      } = getFormattedChartData(formattedChartDatas, chartType);

      return pagesLoader || userSummaryLoading ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategorie}
          series={fileChartFormatteds}
          height={fileChartHeights}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated={true}
          total={getTotalChart(chart7Data)}
        />
      );
    default:
      break;
  }
};

function WorkQueue({
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  dispatch,
  data,
  selectedRole,
  pagesLoader,
  userSummaryResponse,
  userSummaryLoading,
  userDailySummaryResponse,
  userDailySummaryLoading,
  accuracyResponse,
  accuracyLoading,
  productivityResponse,
  productivityLoading,
  dashboardNotification,
  dashboardNotificationLoading,
}) {
  const showDashboard = getSelectedWidgets
    .filter((item) => item?.active)
    .sort((a, b) => a?.orderValue - b?.orderValue);
  const { dashboardLayout = null, userName = "" } = getLocalStored();
  const currentDate = new Date();
  const [taskDataList, setTaskDataList] = useState({});
  const [visibleDates, setVisibleDates] = useState([
    moment().subtract(2, "days"),
    moment().subtract(1, "days"),
    moment(),
  ]);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [dailyTaskLoading, setDailyTaskLoading] = useState(false);

  const fetchAndUpdate = async (dates) => {
    const results = await Promise.all(
      dates.map(async (date) => {
        const key = date.format("YYYY-MM-DD");
        const fetched = await getDailySummaryApiCall(date);
        return { key, data: fetched, date };
      })
    );

    const newEntries = {};
    results.forEach(({ key, data }) => {
      newEntries[key] = data;
    });

    setTaskDataList((prev) => ({
      ...prev,
      ...newEntries,
    }));

    return results;
  };

  const updateVisibleTasksFromDates = async (dates) => {
    setDailyTaskLoading(true);

    setTimeout(async () => {
      const results = await fetchAndUpdate(dates);

      const tasks = results.map(({ key, data, date }) => ({
        dateKey: key,
        day: date.format("dddd"),
        date: date.format("MM-DD-YYYY"),
        series: [
          {
            name: "Allocated",
            value: data?.allocatedCount || 0,
            color: getColorValue("1"),
          },
          {
            name: "Completed",
            value: data?.completedCount || 0,
            color: getColorValue("2"),
          },
          {
            name: "InProgress",
            value: data?.pendingCount || 0,
            color: getColorValue("7"),
          },
          {
            name: "ReassignedPending",
            value: data?.reassignedPendingCount || 0,
            color: getColorValue("4"),
          },
          {
            name: "ReassignedCompleted",
            value: data?.reassignedCompletedCount || 0,
            color: getColorValue("5"),
          },
          {
            name: "QueriedApproved",
            value: data?.queryApprovedCount || 0,
            color: getColorValue("3"),
          },
          {
            name: "QueriedPending",
            value: data?.queryPendingCount || 0,
            color: getColorValue("6"),
          },
        ],
      }));

      setVisibleTasks(tasks);
      setDailyTaskLoading(false);
    }, 300);
  };

  useEffect(() => {
    updateVisibleTasksFromDates(visibleDates);
  }, [visibleDates]);

  const handlePrevious = () => {
    const newDate = moment(visibleDates[0]).subtract(1, "day");
    const updated = [...visibleDates];
    updated.pop();
    updated.unshift(newDate);
    setVisibleDates(updated);
  };

  const handleNext = () => {
    const newDate = moment(visibleDates[visibleDates.length - 1]).add(1, "day");
    const tomorrow = moment().add(1, "day").startOf("day");

    if (newDate.isBefore(tomorrow)) {
      const updated = [...visibleDates];
      updated.shift();
      updated.push(newDate);
      setVisibleDates(updated);
    }
  };

  const [accuracyState, setAccuracyState] = useState({
    activeButton: 0,
    selectedMonth: currentDate.getMonth() + 1,
    selectedYear: currentDate.getFullYear(),
    year: undefined,
    month: undefined,
    currentBtn: "Daily",
  });

  const [productivityState, setProductivityState] = useState({
    activeButton: 0,
    selectedMonth: currentDate.getMonth() + 1,
    selectedYear: currentDate.getFullYear(),
    year: undefined,
    month: undefined,
    currentBtn: "Daily",
  });
  const [openPicker, setOpenPicker] = useState(false);
  const [DateRanges, setDateRanges] = useState({
    clear: true,
    startDate: null,
    endDate: null,
  });

  const getInitialApiCall = async () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    try {
      const apiKeys = [
        {
          key: "workQueueSummary",
          params: {
            roleId: 4,
            username: userName,
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c030"],
        },
        {
          key: "workQueueProductivity",
          params: {
            roleId: 4,
            year: currentYear.toString(),
            month: currentMonth.toString(),
            range: "DAILY",
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c034"],
        },
        {
          key: "workQueueAccuracy",
          params: {
            roleId: 4,
            year: currentYear.toString(),
            month: currentMonth.toString(),
            range: "DAILY",
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c032"],
        },
        {
          key: "dashboardNotification",
          params: {
            page: 0,
            limit: 100,
            rebuttal: true,
          },
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c033"],
        },
      ];
      const apiKeysNew = apiKeys.filter((item) =>
        item.widgetId?.some((id) =>
          showDashboard.some((widget) => widget.widgetId === id)
        )
      );
      for (const item of apiKeysNew) {
        const actionKey = `${item.key}Action`;
        if (typeof actions[actionKey] === "function") {
          await dispatch(actions[actionKey](item.params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const getSummaryApiCall = async (startDate, endDate) => {
    const currentDate = new Date();

    const defaultEndDate = new Date(currentDate);
    defaultEndDate.setDate(defaultEndDate.getDate());

    const defaultStartDate = new Date(currentDate);
    defaultStartDate.setDate(defaultStartDate.getDate() - 2);

    try {
      const actionKey = `workQueueSummaryAction`;
      if (typeof actions[actionKey] === "function") {
        const payload = {
          roleId: 4,
          username: userName,
        };

        if (startDate && endDate) {
          payload.startDate = startDate.toISOString();
          payload.endDate = endDate.toISOString();
        } else {
          payload.startDate = defaultStartDate.toISOString();
          payload.endDate = defaultEndDate.toISOString();
        }
        await dispatch(actions[actionKey](payload));
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getDailySummaryApiCall = async (date) => {
    try {
      const actionKey = `workQueueDailySummaryAction`;
      if (typeof actions[actionKey] === "function") {
        const payload = {
          roleId: 4,
          username: userName,
        };

        if (date) {
          payload.date = date.toISOString();
        }
        const res = await dispatch(actions[actionKey](payload));
        return res?.response;
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getAccuracyApiCall = async (month, year, range) => {
    try {
      const actionKey = `workQueueAccuracyAction`;
      if (typeof actions[actionKey] === "function") {
        const payload = {
          roleId: 4,
          username: userName,
        };
        if (month && year) {
          payload.month = month;
          payload.year = year;
          payload.range = range;
        }

        await dispatch(actions[actionKey](payload));
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const getProductivityApiCall = async (month, year, range) => {
    try {
      const actionKey = `workQueueProductivityAction`;
      if (typeof actions[actionKey] === "function") {
        const payload = {
          roleId: 4,
          username: userName,
        };
        if (month && year) {
          payload.month = month;
          payload.year = year;
          payload.range = range;
        }
        await dispatch(actions[actionKey](payload));
      } else {
        console.warn(`Action not found for key: ${actionKey}`);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    getInitialApiCall();
  }, []);

  useEffect(() => {
    if (DateRanges.clear) {
      getSummaryApiCall();
    } else if (DateRanges.startDate && DateRanges.endDate) {
      getSummaryApiCall(DateRanges.startDate, DateRanges.endDate);
    }
  }, [DateRanges]);

  useEffect(() => {
    if (
      accuracyState.selectedMonth &&
      accuracyState.selectedYear &&
      accuracyState.currentBtn
    ) {
      getAccuracyApiCall(
        accuracyState.selectedMonth,
        accuracyState.selectedYear,
        accuracyState.currentBtn.toUpperCase()
      );
    }
  }, [
    accuracyState.selectedMonth,
    accuracyState.selectedYear,
    accuracyState.currentBtn,
  ]);

  useEffect(() => {
    if (
      productivityState.selectedMonth &&
      productivityState.selectedYear &&
      productivityState.currentBtn
    ) {
      getProductivityApiCall(
        productivityState.selectedMonth,
        productivityState.selectedYear,
        productivityState.currentBtn.toUpperCase()
      );
    }
  }, [
    productivityState.selectedMonth,
    productivityState.selectedYear,
    productivityState.currentBtn,
  ]);

  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  const handleOpen = () => {
    setOpenPicker(!openPicker);
  };
  const handleButtonClick = (type, index, btn) => {
    if (type === "Accuracy") {
      setAccuracyState((prev) => ({
        ...prev,
        activeButton: index,
        currentBtn: btn,
      }));
    } else {
      setProductivityState((prev) => ({
        ...prev,
        activeButton: index,
        currentBtn: btn,
      }));
    }
  };

  const handleYearChange = (type, date, dateString) => {
    const update = {
      year: date,
      selectedYear: dateString,
    };

    type === "Accuracy"
      ? setAccuracyState((prev) => ({ ...prev, ...update }))
      : setProductivityState((prev) => ({ ...prev, ...update }));
  };

  const handleMonthChange = (type, date) => {
    const update = {
      month: date,
      selectedMonth: date,
    };

    type === "Accuracy"
      ? setAccuracyState((prev) => ({ ...prev, ...update }))
      : setProductivityState((prev) => ({ ...prev, ...update }));
  };

  return (
    <>
      {getSelectedWidgetsLoader ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            padding: 20,
          }}
          className="container-fluid"
        >
          <CardSkeleton count={9} height={300} />
        </div>
      ) : showDashboard.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            height: "100%",
          }}
          className="container-fluid"
        >
          {showDashboard?.map((item, id) => {
            const style = {
              gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
              gridRow: `span ${getRowSpan(item.size)}`,
              height: "100%",
            };

            return (
              <div className="dynamicChart" key={id} style={style}>
                <Card style={{ borderRadius: "20px" }}>
                  {item.widgetName === "WorkFlow" && (
                    <Headtitle
                      header={
                        !DateRanges || DateRanges?.clear
                          ? `Last 3 days work flow`
                          : `${formatDateTime({
                              date: DateRanges?.startDate,
                            })} - ${formatDateTime({
                              date: moment(DateRanges?.endDate)
                                .subtract(1, "day")
                                .toDate(),
                            })}`
                      }
                      icon={<FontAwesomeIcon icon={faCalendar} />}
                      fontSize={"16px"}
                      handleOpen={handleOpen}
                      openPicker={openPicker}
                      setOpenPicker={setOpenPicker}
                      defaultDateRange={DateRanges}
                      getDateRange={(dates) => {
                        if (dates) {
                          setDateRanges({
                            clear: false,
                            startDate: new Date(dates.startDate),
                            endDate: new Date(dates.endDate),
                          });
                        } else {
                          setDateRanges({
                            clear: true,
                            startDate: null,
                            endDate: null,
                          });
                        }
                      }}
                    />
                  )}
                  {item.widgetName !== "WorkFlow" &&
                    item.title !== "Notifications" &&
                    item.title !== "Hold Status" && (
                      <div className="fw-bold mb-2 fs-5">{item.title}</div>
                    )}

                  {getCharts({
                    selectedRole,
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    pagesLoader: getSelectedWidgetsLoader,
                    visibleTasks,
                    handlePrevious,
                    handleNext,
                    accuracyState,
                    productivityState,
                    handleButtonClick,
                    handleMonthChange,
                    handleYearChange,
                    userSummaryResponse,
                    userSummaryLoading,
                    dailyTaskLoading,
                    userDailySummaryLoading,
                    accuracyResponse,
                    accuracyLoading,
                    productivityResponse,
                    productivityLoading,
                    currentDate,
                    dashboardNotification,
                    dashboardNotificationLoading,
                    windowWidth,
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyComponent />
      )}
    </>
  );
}

const enhancer = connect((state) => ({
  data: state.admin?.dashboard1,
  userSummaryResponse:
    state.admin?.dashboard1?.workQueueSummary?.data?.response,
  userSummaryLoading: state.admin?.dashboard1?.workQueueSummaryLoader,
  userDailySummaryResponse:
    state.admin?.dashboard1?.workQueueDailySummary?.data?.response,
  userDailySummaryLoading: state.admin?.dashboard1?.workQueueDailySummaryLoader,
  accuracyResponse: state.admin?.dashboard1?.workQueueAccuracy?.data?.response,
  accuracyLoading: state.admin?.dashboard1?.workQueueAccuracyLoader,
  productivityResponse:
    state.admin?.dashboard1?.workQueueProductivity?.data?.response,
  productivityLoading: state.admin?.dashboard1?.workQueueProductivityLoader,
  dashboardNotification: state.admin?.dashboard1?.dashboardNotification,
  dashboardNotificationLoading:
    state.admin?.dashboard1?.dashboardNotificationLoader,
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard1.getWidgetsListLoader,
}));

export default enhancer(WorkQueue);
