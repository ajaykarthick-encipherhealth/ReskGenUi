import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Buttons } from "../../reviewer/workingstatus";
import Buttonscroller from "../../../components/buttonSroller";
import Card from "../../../components/card";
import YearPicker from "../../../components/yearpicker";
import { getCOmpletedScore } from "../../../store/actions/DashboardActions";
import { Select } from "antd";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import dayjs from "dayjs";
import { getCompletedStatus } from "../../../store/actions/adminAction/DashboardAction";
import Insights from "../insights";


const Atlas = () => {
  const [activeButton, setActiveButton] = useState(0);
  const [currentBtn, setCurrentBtn] = useState("Daily");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectMemberType, setSelectMemberType] = useState("");
  const [isindividual, setIsindividual] = useState(false);
  const [charts, setCharts] = useState(null);
  const [showChart, setShowChart] = useState("daily");
  const [selectUser, setSelectUser] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(
      getCOmpletedScore(
        currentBtn.toUpperCase(),
        currentDate.getDate(),
        selectedMonth,
        selectedYear,
        router
      )
    );
  }, [currentBtn, selectedMonth, selectedYear]);

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

  const handleMonthChange = (date) => {
    setMonth(date);
    setSelectedMonth(date);
  };

  const options = [
    { value: "", label: "All" },
    { value: "REVIEWER", label: "REVIEWER" },
    { value: "SUPERVISOR", label: "SUPERVISOR" },
  ];

  const memberTypeChanges = (e) => {
    setSelectMemberType(e);
    setIsindividual(false);
    setSelectUser([]);
    if (e != "All") {
      setIsindividual(true);
    }
  };

  const onChangeUser = (e) => {
    setSelectUser(e);
    console.log("select user", e.value);
  };

  const optionsUser = [
    { value: "All", label: "All" },
    { value: "praveen01@encipherhealth.onmicrosoft.com", label: "Praveen" },
    {
      value: "michael@encipherhealth.onmicrosoft.com",
      label: "michael@encipherhealth.onmicrosoft.com",
    },
    {
      value: "vignesh@encipherhealth.onmicrosoft.com",
      label: "vignesh@encipherhealth.onmicrosoft.com",
    },
    {
      value: "peter@encipherhealth.onmicrosoft.com",
      label: "peter@encipherhealth.onmicrosoft.com",
    },
    {
      value: "ranjith01@encipherhealth.onmicrosoft.com",
      label: "ranjith01@encipherhealth.onmicrosoft.com",
    },
    {
      value: "henry@encipherhealth.onmicrosoft.com",
      label: "henry@encipherhealth.onmicrosoft.com",
    },
    {
      value: "watson@encipherhealth.onmicrosoft.com",
      label: "watson@encipherhealth.onmicrosoft.com",
    },
    {
      value: "uvais01@encipherhealth.onmicrosoft.com",
      label: "uvais01@encipherhealth.onmicrosoft.com",
    },
    {
      value: "logesh01@encipherhealth.onmicrosoft.com",
      label: "logesh01@encipherhealth.onmicrosoft.com",
    },
    {
      value: "benj@encipherhealth.onmicrosoft.com",
      label: "benj@encipherhealth.onmicrosoft.com",
    },
    {
      value: "vignesh1@encipherhealth.onmicrosoft.com",
      label: "vignesh1@encipherhealth.onmicrosoft.com",
    },
    {
      value: "tarun01@encipherhealth.onmicrosoft.com",
      label: "tarun01@encipherhealth.onmicrosoft.com",
    },
    {
      value: "jeans01@encipherhealth.onmicrosoft.com",
      label: "jeans01@encipherhealth.onmicrosoft.com",
    },
  ];

  useEffect(() => {
    dispatch(
      getCompletedStatus(
        currentBtn.toUpperCase(),
        currentDate.getDate(),
        selectedMonth,
        selectedYear,
        router,
        selectUser,
        selectMemberType
      )
    );
  }, [currentBtn, selectedMonth, selectedYear, selectUser]);

  useEffect(() => {
    if (currentBtn === "Monthly") {
      setShowChart("monthly");
    } else if (currentBtn === "Daily") {
      setShowChart("daily");
    } else if (currentBtn === "Weekly") {
      setShowChart("weekly");
    }
  }, [currentBtn]);

  const dayChartFilter = () => {
    const adjustedMonth = selectedMonth - 1;

    const startDate = dayjs()
      .year(selectedYear)
      .month(adjustedMonth)
      .startOf("month")
      .toDate();

    const endDate = dayjs(startDate).endOf("month").toDate();
    let filter;
    if (selectUser) {
      filter = {
        date: { $gte: startDate, $lte: endDate },
        userName: selectUser,
      };
    } else {
      filter = {
        date: { $gte: startDate, $lte: endDate },
      };
    }

    if (charts) {
      charts.setFilter(filter);
    }
  };

  useEffect(() => {
    if (currentBtn === "Daily" || currentBtn === "Weekly") dayChartFilter();
  }, [selectedYear, selectedMonth]);

  const monthChartFilter = () => {
    setSelectedMonth(null);

    const startYearDate = new Date(selectedYear, 0, 1);
    const endYearDate = new Date(selectedYear, 11, 31);

    let filter;
    if (selectUser) {
      filter = {
        date: { $gte: startYearDate, $lte: endYearDate },
        userName: selectUser,
      };
    } else {
      filter = {
        date: { $gte: startYearDate, $lte: endYearDate },
      };
    }

    if (charts) {
      charts.setFilter(filter);
    }
  };

  useEffect(() => {
    if (currentBtn === "Monthly") monthChartFilter(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-project-0-gdoee",
      showAttribution: false,
      gridLines:false,
    });

    const currentYear = selectedYear;
    const currentMonth = selectedMonth - 1;

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    let filter;

    if (currentBtn === "Daily" || currentBtn === "Weekly") {
      filter = {
        date: { $gte: startDate, $lte: endDate },
      };
    } else if (currentBtn === "Monthly") {
      const startYearDate = new Date(selectedYear, 0, 1);
      const endYearDate = new Date(selectedYear, 11, 31);
      filter = {
        date: { $gte: startYearDate, $lte: endYearDate },
      };
    }

    const chartId =
      showChart === "daily"
        ? "65fc225c-877d-4762-8854-f70afebbbfde"
        : showChart === "monthly"
        ? "65faad57-99b8-48f3-8574-a856c8b9bbc6"
        : "65fc1dd3-4b94-4e9a-8d11-5148af640a27";

    const charts = sdk.createChart({
      chartId: chartId,
      filter: filter,
    });

    setCharts(charts);
  }, [showChart]);

  useEffect(() => {
    const renderCharts = () => {
      if (charts) {
        charts.render(document.getElementById("chartdata"));
      }
    };

    renderCharts();
  }, [charts]);

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
          <div
        style={{
          // width: "75%",
          // position: "relative",
          // left: "50px",
          // height: "450px",
        }}
      >
        <h4>Completed Status</h4>
        <Card borderRadius="28px" padding="10px" height="350px">
          <div className={styles.buttonDiv}>
            <div className={`d-flex ${styles.selectContainer}`}>
              <div className={styles.select}>
                <Select
                  value={
                    selectMemberType?.length === 0 ? "All" : selectMemberType
                  }
                  // placeholder="Select User Type"
                  onChange={(e) => memberTypeChanges(e)}
                  className={`custom_select_type ${styles.custom_select_type}`}
                  options={options}
                  style={{ backgroundColor: "#F3F3FF", width: "140px" }}
                />
              </div>
              {isindividual ? (
                <div className={styles.select}>
                  <Select
                    showSearch
                    value={selectUser}
                    placeholder="Select User"
                    className={`custom_select_user ${styles.custom_select_user}`}
                    onChange={(e) => onChangeUser(e)}
                    options={optionsUser}
                  />
                </div>
              ) : null}
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
            id="chartdata"
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
     
      <Insights />
    </div>
  );
};

export default Atlas;
