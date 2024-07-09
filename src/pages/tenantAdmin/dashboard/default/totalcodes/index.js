import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import * as echarts from "echarts";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import { Empty } from "antd";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import moment from "moment";
import { Skeleton } from "antd";

const index = ({
  getAllHccCodesData,
  getAllHccCodes,
  getAllRaf,
  getAllRafScoreData,
  dateRange,
  loaderButton,
  totalCodesLoader,
  getAllRafData,
  selectedOrganization
}) => {
  const [currChartData, setCurrChartData] = useState(new Map());
  const [chartData, setChartData] = useState(new Map());
  const [chartData1, setChartData1] = useState(new Map());
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

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await getAllHccCodesData(
        dateRange.startDate,
        dateRange.endDate,
        selectedOrganization
      );
      const records = data?.response?.hccDiseaseCountMap;
      const records1 = data?.response?.suggestedHccDiseaseCountMap;
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
    setCurrChartData(new Map());
  }, [chartData]);

  useEffect(() => {
    setCurrChartData(chartData);
  }, [currChartData]);

  const hccDiseaseCountValues = getAllHccCodes?.hccDiseaseCountMap
    ? Object.values(getAllHccCodes.hccDiseaseCountMap)
    : [];

  const suggestedHccDiseaseCountMap =
    getAllHccCodes?.suggestedHccDiseaseCountMap
      ? Object.values(getAllHccCodes.suggestedHccDiseaseCountMap)
      : [];
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
      setRevenChartData(tempRecords);
    };
    fetchChartData();
  }, [dateRange]);

  const options = {
    xAxis: {
      type: "category",
      data:
        hccDiseaseCountValues || suggestedHccDiseaseCountMap
          ? [...currChartData.keys()]
          : [
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
            ],
    },
    yAxis: {
      type: "value",
      show: true,
    },
    tooltip: {
      show: true,
      trigger: "axis",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Total Codes",
        data: [],
        type: "line",
        lineStyle: { color: "#E88D67" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#E88D67" },
            { offset: 1, color: "#FAFFFA" },
          ]),
        },
      },
      {
        name: "HCC Codes",
        data: hccDiseaseCountValues,
        type: "line",
        lineStyle: { color: "#04B700" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#04B700" },
            { offset: 1, color: "#FAFFFA" },
          ]),
        },
      },
      {
        name: "Car Gap Codes",
        data: suggestedHccDiseaseCountMap,
        type: "line",
        lineStyle: { color: "#FF9209" },
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#FF9209" },
            { offset: 1, color: "#FFFDFA" },
          ]),
        },
      },
    ],
  };
  const bullets = [
    {
      title: "Total Codes",
      color: "#E88D67",
    },
    {
      title: "HCC Codes",
      color: "#04B700",
    },
    {
      title: "Car Gap Codes",
      color: "#FF9209",
    },
  ];

  return (
    <div className="d-flex justify-content-between">
      <div style={{ width: "33%" }}>
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={styles.header}>Total Codes</div>

            <div className="d-flex gap-4">
              <div>
                {bullets?.map((item) => (
                  <div className="d-flex">
                    <div
                      style={{
                        backgroundColor: item?.color,
                        width: "8px",
                        height: "8px",
                        margin: "8px 5px 0 0px",
                      }}
                    ></div>
                    {item?.title}
                  </div>
                ))}
              </div>
              <div>
                <div className={styles.header}>Total Codes</div>
                <div className={styles.price}>{getAllHccCodes?.totalCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* {loaderButton && totalCodesLoader ? (
          <div>
            <Skeleton.Input
              className="w-100"
              style={{ height: "170px" }}
              active
            />
          </div>
        ) : totalCodesLoader ? (
          <div className="d-flex justify-content-center align-items-center">
            {" "}
            <Spin size="large" />
          </div>
        ) : (
          <CodesGraph options={options} isRadio={true} />
        )} */}

        <CodesGraph options={options} isRadio={true} />
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#EBF3FF",
          borderRadius: "16px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-1`}>RAF</div>
            <div className="p-1">
              <div className={styles.header}>Overall RAF</div>

              <div className={styles.price}>
                {getAllRafScoreData?.totalHccRaf}
              </div>
            </div>
          </div>
        </div>
        <RafGraph
          overallData={true}
          chartData={chartData1}
          chartRafData={chartRafData1}
          chartRevenData={chartRevenData1}
          rafColor={"#E88D67"}
          rafColor3={"#FF9209"}
          rafColor2={"#00BC13"}
        />
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#FCEEE9",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className={styles.headers}>
          <div className="d-flex justify-content-between">
            <div className={`${styles.header} p-1`}>Revenue</div>
            <div className="p-1">
              <div className={styles.header}>Overall Revenue</div>
              <div
                className={styles.price}
              >{`$ ${getAllRaf?.totalHccRafScore}`}</div>
            </div>
          </div>
        </div>
        <RevenueGraph isMultiple={true} />
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
      state?.tenantAdmin?.dashboard?.default?.allRafScoreData?.data?.response,
    totalCodesLoader: state?.tenantAdmin?.dashboard?.default?.totalCodesLoader,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);
export default enhancer(index);
