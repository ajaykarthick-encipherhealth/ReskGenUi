import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/default/action.js";
import moment from "moment";

const index = ({
  getAllHccCodesData,
  getAllHccCodes,
  getAllRafData,
  getAllRaf,
  getAllRafScoreData,
  getAllRafScore,
  dateRange,
}) => {
  const [chartData, setChartData] = useState(new Map());
  const [chartData1, setChartData1] = useState(new Map());

  const [chartRafData, setRafChartData] = useState(new Map());
  const [chartRafData1, setRafChartData1] = useState(new Map());

  const [chartRevenData, setRevenChartData] = useState(new Map());
  const [chartRevenData1, setRevenChartData1] = useState(new Map());

  const ShortMonth = [
    "",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const shortWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getAllHccCodesData(
        dateRange.startDate,
        dateRange.endDate
      );
      const records = data.response.hccDiseaseCountMap;
      const records1 = data.response.suggestedHccDiseaseCountMap;
      const datediff =
        moment(dateRange?.endDate).diff(moment(dateRange?.startDate), "days") +
        1;

      const tempRecords = new Map();
      const tempRecords1 = new Map();
      if (datediff != 7 && datediff != 30) {
        ShortMonth.slice(1).forEach((month) => {
          tempRecords.set(month, 0);
          tempRecords1.set(month, 0);
        });
      }

      if ((!isNaN(datediff) && datediff == 7) || datediff == 30) {
        for (let i = 0; i < datediff; i++) {
          const todayDate = moment();
          const presentDate = todayDate.subtract(i, "days");
          const currMonth = parseInt(presentDate.format("MM"));
          const currDay = presentDate.format("DD");
          tempRecords.set(ShortMonth[currMonth] + currDay, 0);
          tempRecords1.set(ShortMonth[currMonth] + currDay, 0);
        }

        Object.entries(records).map((record) => {
          const currMonth = parseInt(moment(record[0]).format("MM"));
          const currDay = moment(record[0]).format("DD");
          tempRecords.set(ShortMonth[currMonth] + currDay, record[1]);
        });
        Object.entries(records1).map((record) => {
          const currMonth = parseInt(moment(record[0]).format("MM"));
          const currDay = moment(record[0]).format("DD");
          tempRecords1.set(ShortMonth[currMonth] + currDay, record[1]);
        });
      }

      setChartData1(tempRecords1);
      setChartData(tempRecords);
    };
    fetchChartData();
  }, [dateRange]);

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getAllRafScore(dateRange.startDate, dateRange.endDate);
      const records = data.response.rafScoreByDateForSuggested;
      const records1 = data.response.rafScoreByDateForHcc;

      const datediff =
        moment(dateRange?.endDate).diff(moment(dateRange?.startDate), "days") +
        1;

      const tempRecords = new Map();
      const tempRecords1 = new Map();
      if (datediff != 7 && datediff != 30) {
        ShortMonth.slice(1).forEach((month) => {
          tempRecords.set(month, 0);
          tempRecords1.set(month, 0);
        });
      }

      if ((!isNaN(datediff) && datediff == 7) || datediff == 30) {
        for (let i = 0; i < datediff; i++) {
          const todayDate = moment();
          const presentDate = todayDate.subtract(i, "days");
          const currMonth = parseInt(presentDate.format("MM"));
          const currDay = presentDate.format("DD");
          tempRecords.set(ShortMonth[currMonth] + currDay, 0);
          tempRecords1.set(ShortMonth[currMonth] + currDay, 0);
        }

        Object.entries(records).map((record) => {
          const currMonth = parseInt(moment(record[0]).format("MM"));
          const currDay = moment(record[0]).format("DD");
          tempRecords.set(ShortMonth[currMonth] + currDay, record[1]);
        });
        Object.entries(records1).map((record) => {
          const currMonth = parseInt(moment(record[0]).format("MM"));
          const currDay = moment(record[0]).format("DD");
          tempRecords1.set(ShortMonth[currMonth] + currDay, record[1]);
        });
      }
      setRafChartData1(tempRecords1);
      setRafChartData(tempRecords);
    };
    fetchChartData();
  }, [dateRange]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllRafData();
      const tempRecords = new Map();
      const records = data?.response?.premiumByDateForHcc;
      for (let i = 6; i >= 0; i--) {
        const todayDate = moment();
        const presentDate = todayDate.subtract(i, "days");
        const presentDayinWeek = presentDate.day();
        tempRecords.set(shortWeek[presentDayinWeek], 0);
      }
    };
    fetchData();
  }, [dateRange]);

  return (
    <div className="d-flex justify-content-between">
      <div className="remianingLineGraph" style={{ width: "33%" }}>
        <div className={styles.headers}>
          <div className="d-flex justify-content-between ">
            <div className={styles.header}>HCC Codes</div>
            <div>
              <div className={styles.header}>Total Codes</div>
              <div className={styles.price}>{getAllHccCodes?.totalCount}</div>
            </div>
          </div>
        </div>
        <CodesGraph
          gradientColor1={"#04B700"}
          gradientColor2={"#FAFFFA"}
          borderColor={"#04B700"}
          isHcc={true}
          chartData={chartData}
          chartData1={chartData1}
        />
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#F0ECFE",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-1`}>RAF</div>
            <div className="p-1">
              <div className={styles.header}>Overall RAF</div>
              <div className={styles.price}>{getAllRafScoreData}</div>
            </div>
          </div>
        </div>
        <RafGraph
          rafColor={"#8E68F7"}
          isHcc={true}
          chartRafData={chartRafData}
          // chartRafData1={chartRafData1}
        />
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#EBFCFF",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-1`}>Revenue</div>
            <div className="p-1">
              <div className={styles.header}>Overall Revenue</div>
              <div className={styles.price}>{getAllRaf?.totalHccRafScore}</div>
            </div>
          </div>
        </div>
        <RevenueGraph
          isHcc={true}
          hccColor="#02BBDE"
          chartRevenData={chartRevenData}
        />
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.tenantAdmindefault?.allHccCodes?.data?.response,

    getAllRaf:
      state?.tenantAdmin?.tenantAdmindefault?.allRafCounts?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.tenantAdmindefault?.allRafScore?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);

export default enhancer(index);
