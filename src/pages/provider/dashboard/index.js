import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Buttons } from "../../../../src/pages/reviewer/workingstatus";
import Buttonscroller from "../../../../src/components/buttonSroller";
import HeadTitle from "../../../../src/components/card/index";
import Card from "../../../../src/components/card/index";
import Header from "../../../jsx/layouts/nav/Header";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import YearPicker from "../../../../src/components/yearpicker";
import dayjs from "dayjs";
import Atlas from "../atlas";

const CompletedStatus = () => {
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [viewchart, setViewchart] = useState("day");
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [chart, setchart] = useState(null);
  const dayFilter = () => {
    const adjustedMonth = selectedMonth - 1;
    const startDate = dayjs()
      .year(selectedYear)
      .month(adjustedMonth)
      .startOf("month")
      .toDate();

    const endDate = dayjs(startDate).endOf("month").toDate();

    const filter = { createdDate: { $gte: startDate, $lte: endDate } };
    if (chart) {
      chart.setFilter(filter);
    }
    console.log("chartchart2", chart);
  };

  useEffect(() => {
    if (currentBtn === "Daily" || currentBtn === "Weekly") dayFilter();
  }, [selectedYear, selectedMonth]);

  const monthFilter = () => {
    setSelectedMonth(null);
    const startYearDate = new Date(selectedYear, 0, 1);
    const endYearDate = new Date(selectedYear, 11, 31);

    const filter = {
      createdDate: { $gte: startYearDate, $lte: endYearDate },
    };

    if (chart) {
      chart.setFilter(filter);
    }
    console.log("chartchart1", chart);
  };

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-project-0-gdoee",
      showAttribution: false,
    });

    const currentYear = selectedYear;
    const currentMonth = selectedMonth - 1;

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    let filter;

    if (currentBtn === "Daily" || currentBtn === "Weekly") {
      filter = {
        createdDate: { $gte: startDate, $lte: endDate },
      };
    } else if (currentBtn === "Monthly") {
      const startYearDate = new Date(selectedYear, 0, 1);
      const endYearDate = new Date(selectedYear, 11, 31);
      filter = {
        createdDate: { $gte: startYearDate, $lte: endYearDate },
      };
    }

    const chartId =
      viewchart === "day"
        ? "65ec335a-9b59-4944-82bb-78cb56e41036"
        : viewchart === "month"
        ? "65ec1a38-c122-4dea-89e2-a526faba5329"
        : "65ec37bb-9b59-4f60-8b5c-78cb56f18191";

    const chart = sdk.createChart({
      chartId: chartId,
      filter: filter,
    });

    setchart(chart);
  }, [viewchart]);

  useEffect(() => {
    const renderCharts = () => {
      if (chart) {
        chart.render(document.getElementById("chart-data"));
      }
    };
    renderCharts();
  }, [chart]);
  useEffect(() => {
    if (currentBtn === "Monthly") {
      setViewchart("month");
    } else if (currentBtn === "Daily") {
      setViewchart("day");
    } else if (currentBtn === "Weekly") {
      setViewchart("week");
    }
  }, [currentBtn]);

  const handleButtonClick = (index, btn) => {
    setActiveButton(index);
    setCurrentBtn(btn);
  };

  const handleYearChange = (date, dateString) => {
    if (dateString) {
      const year = new Date(dateString).getFullYear();
      setYear(year);
      setYear(date);
      setSelectedYear(year);
    } else {
      setYear(null);
      setSelectedYear(null);
    }
  };

  useEffect(() => {
    if (currentBtn === "Monthly") monthFilter(selectedYear);
  }, [selectedYear]);

  const handleMonthChange = (date) => {
    const selectedDate = new Date(date);
    setMonth(date);
    setSelectedMonth(month);
    setSelectedMonth(year);

    const monthNumber = (selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    if (currentBtn === "Monthly") {
      setSelectedMonth();
    } else {
      setSelectedMonth(monthNumber);
    }
  };

  return (
    <>
      <Header />

      <HeadTitle header="Completed Status" />
      <div style={{ marginTop: "5%" }}>
        <div
          style={{
            width: "75%",
            position: "relative",
            left: "50px",
            // height: "450px",
          }}
        >
          <h4>Sample chart</h4>
          <Card borderRadius="28px" padding="10px">
            <div
              className={styles.buttonDiv}
              style={{ position: "relative", left: "-88px" }}
            >
              <div className={`d-flex ${styles.selectContainer}`}>
                <div className={styles.select}>
                  {/* <Select
                  value={
                    selectMemberType?.length === 0 ? "Select User" : selectMemberType
                  }
                  // placeholder="Select User Type"
                  onChange={(e) => memberTypeChanges(e)}
                  className={`custom_select_type ${styles.custom_select_type}`}
                  options={options}
                  style={{ backgroundColor: "#F3F3FF", width: "140px" }}
                /> */}
                </div>
              </div>
              <div className={styles.picker}>
                <YearPicker
                  onChangeYear={handleYearChange}
                  onChangeMonth={handleMonthChange}
                  type={currentBtn}
                  bgColor="#F3F3FF"
                  val={month}
                  val1={year}
                />
              </div>
              <div className={styles.btnScroller}>
                <Buttonscroller
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  Buttons={Buttons}
                  handleButtonClick={handleButtonClick}
                  activeButton={activeButton}
                  activeColor="#fff"
                  inActiveColor="#000000"
                  activeBg="#1E1B39"
                  inActiveBg="#F3F3FF"
                  containerBg="#F3F3FF"
                />
              </div>
            </div>
          </Card>
        </div>
        <Atlas />
      </div>
    </>
  );
};

export default CompletedStatus;
