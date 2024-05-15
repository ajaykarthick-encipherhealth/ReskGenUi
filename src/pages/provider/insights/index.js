import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Buttonscroller from "../../../components/buttonSroller";
import { Buttons } from "../../reviewer/workingstatus";
import Card from "../../../components/card";
import YearPicker from "../../../components/yearpicker";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import dayjs from "dayjs";
import Teamchart from "../teamchart";

export const TabButtons = [
  {
    id: 1,
    title: "CogentAI Accuracy",
  },
  {
    id: 2,
    title: "Organization Quality",
  },
];
export const getDateWeek = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeek = firstDayOfMonth.getDay();
  const currentDate = date.getDate();
  const startingWeek = Math.ceil((currentDate + firstDayWeek) / 7);
  return startingWeek;
};

export const getDays = (dataLength) => {
  const totalDaysInMonth = dataLength;
  return Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
};

export const monthNames = [
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

const Insights = () => {
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const [activeTabButton, setActiveTabButton] = useState(0);
  const [currentTabBtn, setCurrentTabBtn] = useState("CogentAI Accuracy");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [viewchart, setViewchart] = useState("day");
  const [atlaschart, setAtlasChart] = useState(null);
  const [viewsChart, setViewsChart] = useState("day");

  const accuracyDatas = useSelector(
    (state) => state?.AdminDashboardReducers?.accuracy
  );

  const numberOfWeeks =
    accuracyDatas?.data?.response &&
    Object.keys(accuracyDatas?.data?.response)?.length;

  const weekNames = Array.from(
    { length: numberOfWeeks },
    (_, index) => `Week ${index + 1}`
  );
  const router = useRouter();

  const handleButtonClick = (index, btn) => {
    setActiveButton(index);
    setCurrentBtn(btn);
  };

  const handleTabButtonClick = (index, btn) => {
    setActiveTabButton(index);
    setCurrentTabBtn(btn);
  };

  const handleYearChange = (date, dateString) => {
    if (dateString) {
      const year = new Date(dateString).getFullYear();
      setYear(year);
      setYear(date);
      setSelectedYear(year);
      setSelectedYear(dateString);
    } else {
      setYear(null);
      setSelectedYear(null);
    }
  };

  const handleMonthChange = (date) => {
    setMonth(date);
    setSelectedMonth(date);
  };
  let xAxisData = [];
  if (currentBtn === "Monthly") {
    xAxisData = monthNames;
  } else if (currentBtn === "Daily") {
    xAxisData = getDays(
      accuracyDatas?.data?.response &&
        Object.keys(accuracyDatas?.data?.response)?.length
    );
  } else if (currentBtn === "Weekly") {
    xAxisData = weekNames;
  }

  let highlightIndex = -1;
  if (currentBtn === "Monthly") {
    if (parseInt(selectedYear) === new Date().getFullYear()) {
      highlightIndex = currentDate.getMonth();
    }
  } else if (currentBtn === "Daily") {
    if (
      parseInt(selectedYear) === new Date().getFullYear() &&
      selectedMonth === new Date().getMonth() + 1
    ) {
      highlightIndex = currentDate.getDate() - 1;
    }
  } else if (currentBtn === "Weekly") {
    if (parseInt(selectedYear) === new Date().getFullYear()) {
      const currentWeek = getDateWeek(currentDate);
      highlightIndex = currentWeek - 1;
    }
  }

  let data = [];
  if (currentBtn && accuracyDatas?.data?.response) {
    data = Object.values(accuracyDatas?.data?.response);
  }

  useEffect(() => {
    if (currentTabBtn === "CogentAI Accuracy") {
      if (currentBtn === "Monthly") {
        setViewchart("month");
      } else if (currentBtn === "Daily") {
        setViewchart("day");
      } else if (currentBtn === "Weekly") {
        setViewchart("week");
      }
    }
    if (currentTabBtn === "Organization Quality") {
      if (currentBtn === "Monthly") {
        setViewsChart("month");
      } else if (currentBtn === "Daily") {
        setViewsChart("day");
      } else if (currentBtn === "Weekly") {
        setViewsChart("week");
      }
    }
  }, [currentBtn, currentTabBtn]);

  const dayFilter = () => {
    const adjustedMonth = selectedMonth - 1;

    const startDate = dayjs()
      .year(selectedYear)
      .month(adjustedMonth)
      .startOf("month")
      .toDate();

    const endDate = dayjs(startDate).endOf("month").toDate();

    const filter = { dueDate: { $gte: startDate, $lte: endDate } };
    if (atlaschart) {
      atlaschart.setFilter(filter);
    }
  };

  useEffect(() => {
    if (currentBtn === "Daily" || currentBtn === "Weekly") dayFilter();
  }, [selectedYear, selectedMonth]);

  const monthFilter = () => {
    setSelectedMonth(null);
    const startYearDate = new Date(selectedYear, 0, 1);
    const endYearDate = new Date(selectedYear, 11, 31);
    const filter = {
      dueDate: { $gte: startYearDate, $lte: endYearDate },
    };

    if (atlaschart) {
      atlaschart.setFilter(filter);
    }
  };

  useEffect(() => {
    if (currentBtn === "Monthly") monthFilter(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-project-0-gdoee",
      showAttribution: false,
    });

    let filter;

    if (currentBtn === "Daily" || currentBtn === "Weekly") {
      const currentYear = selectedYear;
      const currentMonth = selectedMonth - 1;

      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      filter = {
        dueDate: { $gte: startDate, $lte: endDate },
      };
    } else if (currentBtn === "Monthly") {
      const startYearDate = new Date(selectedYear, 0, 1);
      const endYearDate = new Date(selectedYear, 11, 31);
      filter = {
        dueDate: { $gte: startYearDate, $lte: endYearDate },
      };
    }

    let chartId;

    if (currentTabBtn === "CogentAI Accuracy") {
      chartId =
        viewchart === "day"
          ? "660aa505-54a3-4e6a-8ea3-6d6df33a7205"
          : viewchart === "month"
          ? "660bea4e-8ef8-4382-843d-4af945b9725c"
          : "660a9e51-82f7-4796-8e2e-8f6f26420ea2";
    } else if (currentTabBtn === "Organization Quality") {
      chartId =
        viewsChart === "day"
          ? "660bb6a6-cd05-4385-81aa-959223ca896c"
          : viewsChart === "month"
          ? "660b99d1-8f76-4bad-8185-4fc6572725e5"
          : "660bb271-2f26-4038-8e97-d9960da30519";
    } else {
      chartId = "";
    }

    if (chartId) {
      const chart = sdk.createChart({
        chartId: chartId,
        filter: filter,
      });

      setAtlasChart(chart);
    }
  }, [viewchart, viewsChart, currentTabBtn, currentBtn]);

  useEffect(() => {
    const renderCharts = () => {
      if (atlaschart) {
        atlaschart.render(document.getElementById("chartfilterdata"));
      }
    };

    renderCharts();
  }, [atlaschart]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h4 className="mt-3">Accuracy and Quality Insights</h4>
          <div className={styles.card3}>
            <Card borderRadius="28px" padding="10px">
              <div className={styles.buttonDiv}>
                <div className={`d-flex ${styles.selectContainer}`}>
                  <div className={styles.btnScroller}>
                    <Buttonscroller
                      Buttons={TabButtons}
                      handleButtonClick={handleTabButtonClick}
                      activeButton={activeTabButton}
                      activeColor="#fff"
                      inActiveColor="
               #000000"
                      activeBg="#043069"
                      inActiveBg="
                #E6EEFF"
                      containerBg="
                #E6EEFF"
                      width="150px"
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <div className={styles.picker}>
                    <YearPicker
                      onChangeYear={handleYearChange}
                      onChangeMonth={handleMonthChange}
                      type={currentBtn}
                      bgColor="#E6EEFF"
                      val={month}
                      val1={year}
                    />
                  </div>
                  <div className={styles.btnScroller}>
                    <Buttonscroller
                      Buttons={Buttons}
                      handleButtonClick={handleButtonClick}
                      activeButton={activeButton}
                      activeColor="#fff"
                      inActiveColor="
                #000000"
                      activeBg="#04306f"
                      inActiveBg="
                #E6EEFF"
                      containerBg="
                #E6EEFF"
                    />
                  </div>
                </div>
              </div>
              <div
                id="chartfilterdata"
                style={{
                  height: 300,
                  width: 1200,
                }}
              ></div>
            </Card>
          </div>
        </div>
        <Teamchart />
      </div>
    </div>
  );
};

export default Insights;
