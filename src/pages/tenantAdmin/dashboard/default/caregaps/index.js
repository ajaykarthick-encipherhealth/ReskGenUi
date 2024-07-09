import React, { useState, useEffect } from "react";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  getAllRafScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
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
  const [chartData1, setChartData1] = useState(new Map());
  const [chartRafData1, setRafChartData1] = useState(new Map());
  const [chartRevenData1, setRevenChartData1] = useState(new Map());

  const shortWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getAllHccCodesData(
        dateRange?.startDate,
        dateRange?.endDate
      );
      const records1 = data?.response?.suggestedHccDiseaseCountMap;
      const datediff =
        moment(dateRange?.endDate).diff(moment(dateRange?.startDate), "days") +
        1;
      const tempRecords1 = new Map();
      if (datediff != 7 && datediff != 30) {
        ShortMonth.slice(1).forEach((month) => {
          tempRecords1.set(month, 0);
        });
      }

      if ((!isNaN(datediff) && datediff == 7) || datediff == 30) {
        for (let i = 0; i < datediff; i++) {
          const todayDate = moment();
          const presentDate = todayDate.subtract(i, "days");
          const currMonth = parseInt(presentDate.format("MM"));
          const currDay = presentDate.format("DD");
          tempRecords1.set(ShortMonth[currMonth] + currDay, 0);
        }
        Object.entries(records1).map((record) => {
          const currMonth = parseInt(moment(record[0]).format("MM"));
          const currDay = moment(record[0]).format("DD");
          tempRecords1.set(ShortMonth[currMonth] + currDay, record[1]);
        });
      }
      setChartData1(tempRecords1);
    };
    fetchChartData();
  }, [dateRange]);

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getAllRafScore(dateRange.startDate, dateRange.endDate);
      const records = data.response?.rafScoreByDateForSuggested;
      const records1 = data.response?.rafScoreByDateForHcc;

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
    };
    fetchChartData();
  }, [dateRange]);

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getAllRafData(dateRange.startDate, dateRange.endDate);
      const records = data.response.premiumByDateForHcc;
      const records1 = data.response.premiumByDateForSuggested;

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
      setRevenChartData1(tempRecords1);
      //setRevenChartData(tempRecords);
    };
    fetchChartData();
  }, [dateRange]);

  return (
    <div className="d-flex justify-content-between">
      <div className="remianingLineGraph" style={{ width: "33%" }}>
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={styles.header}>Care Gap Codes</div>
            <div>
              <div className={styles.header}>Total Codes</div>
              <div className={styles.price}>{getAllHccCodes?.totalCount}</div>
            </div>
          </div>
        </div>
        <CodesGraph
          gradientColor1={"#FF9209"}
          gradientColor2={"#FFFDFA"}
          borderColor={"#FF9209"}
          isCargaps={true}
          chartData={chartData1}
        />
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#E2F1F3",
          borderRadius: "16px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-2`}>RAF</div>
            <div className="p-2">
              <div className={styles.header}>Overall RAF</div>
              <div className={styles.price}>
                {getAllRafScoreData?.totalSuggestedRaf}
              </div>
            </div>
          </div>
        </div>
        <RafGraph
          rafColor={"#4AA1AB"}
          isCargaps={true}
          chartData={chartData1}
          chartRafData={chartRafData1}
          chartRevenData={chartRevenData1}
        />
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#DAE0FC",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
          <div className={styles.headers}>
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-1`}>Revenue</div>
          <div className="p-1">
            <div className={styles.header}>Overall Revenue</div>
            <div className={styles.price}>
              {`$ ${getAllRaf?.totalSuggestedRafScore}`}
            </div>
            </div>
          </div>
        </div>
        <RevenueGraph
          isCargaps={true}
          cargapColor="#5A75F2"
          chartRevenData={chartRevenData1}
        />
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    getAllRafScoreData:
      // state?.tenantAdmin?.dashboard?.default?.allRafScore?.data?.response,
      state?.tenantAdmin?.dashboard?.default?.allRafScoreData?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: getAllRafScore,
  }
);

export default enhancer(index);
