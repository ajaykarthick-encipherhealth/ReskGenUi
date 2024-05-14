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


const CompletedStatusChart = () => {
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
  };
  console.log(currentDate);

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
      baseUrl: "https://charts.mongodb.com/charts-project-1-hubxull",
      showAttribution: false,
      gridLines: false,
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
        ? "5d367e3c-dff4-475b-953c-56837b824617"
        : viewchart === "month"
        ? "663dbcc7-b117-4e8d-8526-509d68af7d3a"
        : "403f8f1b-8f3f-4b00-9d27-81eefa4dd585";

    const chart = sdk.createChart({
      chartId: chartId,
      filter: filter,
      options: {
        gridlines: {
          enabled: false,
        },
      },
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
    setMonth(date);
    setSelectedMonth(date);
  };

  return (
    <>
      <Header />

      <HeadTitle header="Completed Status" />
      <div style={{ marginTop: "5%" }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div>
             
                <h4>File Processing chart </h4>
                <Card borderRadius="28px" padding="10px">
                  <div className={styles.buttonDiv}>
                    <div className={`d-flex ${styles.selectContainer}`}>
                      <div className={styles.select}></div>
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
                  <div
                    id="chart-data"
                    style={{
                      height: 300,
                      width: 1200,
                    }}
                  ></div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <Atlas />
      </div>
    </>
  );
};

export default CompletedStatusChart;
