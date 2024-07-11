import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "../../styles.module.css";
import CodesGraph from "../../components/codeGraph";
import Image from "next/image";
import processing from "../../../../../images/tenantAdmin/processing.svg";
import failed from "../../../../../images/tenantAdmin/failed.svg";
import completed from "../../../../../images/tenantAdmin/completed.svg";
import upload from "../../../../../images/tenantAdmin/upload.svg";
import codeCaptured from "../../../../../images/tenantAdmin/codecaptured.svg";
import { actions as defaultActions } from "../../../../../stores/tenantAdmin/dashboard/default";
import { Empty, Skeleton, Spin } from "antd";

const Files = ({
  getAllComputing,
  getAllComputingStatus,
  getComputingStatus,
  getAllComputingTile,
  top10DiseasesData,
  computingTileStatusLoader,
  computingStatusLoader,
  dateRange,
  selectedOrganization,
  selectedValue,
  activeBtn,
  classNames

}) => {
  const dates = [];
  function getLast7Days() {
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const pastDate = new Date(currentDate);
      pastDate.setDate(currentDate.getDate() - i);
      dates.push(
        pastDate.toLocaleString("default", { month: "short" }) +
          pastDate.getDate()
      );
    }

    return dates.reverse();
  }
  const date_thirty_days = [];

  function getLast30Days() {
    const currentDate = new Date();

    for (let i = 0; i < 30; i++) {
      const pastDate = new Date(currentDate);
      pastDate.setDate(currentDate.getDate() - i);
      date_thirty_days.push(
        pastDate.toLocaleString("default", { month: "short" }) +
          pastDate.getDate()
      );
    }

    return date_thirty_days.reverse();
  }

  getLast7Days();
  getLast30Days();

  const options = {
    xAxis: {
      type: "category",
      data: selectedValue === "last_1_week" ? dates : date_thirty_days,
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
        name: "Upload",
        data: getAllComputingStatus?.NOT_UPLOADED?.map((x) => x.count),
        type: "line",
        lineStyle: { color: "#3B3486" },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "Completed",
        color: "#00BC13",
        data: getAllComputingStatus?.COMPUTED?.map((x) => x.count),
        type: "line",
        lineStyle: { color: "#00BC13" },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "Processing",
        data: getAllComputingStatus?.PROCESSING?.map((x) => x.count),
        color: "#3B3486",
        type: "line",
        lineStyle: { color: "#3B3486" },
        smooth: true,
        showSymbol: false,
      },

      {
        name: "Failed",
        color: "#FF8551",
        data: getAllComputingStatus?.FAILED?.map((x) => x.count),
        type: "line",
        lineStyle: { color: "#FF8551" },
        smooth: true,
        showSymbol: false,
      },
    ],
  };
  let cardData = [
    {
      id: 1,
      title: "Upload",
      count: getAllComputingTile?.NOT_UPLOADED,
      icon: upload,
      color: "#ECEBFF",
      iconBg: "#D0CCFF",
    },
    {
      id: 2,
      title: "Processing",
      count: getAllComputingTile?.PROCESSING,
      icon: processing,
      color: "#EAE9F6",
      iconBg: "#DCDAF1",
    },
    {
      id: 3,
      title: "Completed",
      count: getAllComputingTile?.COMPUTED,
      icon: completed,
      color: "#D6FFDA",
      iconBg: "#ADFFB5",
    },
    {
      id: 4,
      title: "Failed",
      count: getAllComputingTile?.FAILED,
      icon: failed,
      color: "#FFEAE0",
      iconBg: "#FFDBCC",
    },
  ];

  if (activeBtn == "default") {
    cardData = [
      ...cardData,
      {
        id: 5,
        title: "Codes",
        count: top10DiseasesData?.totalCount,
        icon: codeCaptured,
        color: "#FFEAE0",
        iconBg: "#FFDBCC",
      },
    ];
  }

  useEffect(() => {
    getComputingStatus(
      dateRange?.startDate,
      dateRange?.endDate,
      selectedOrganization
    );
    getAllComputing(
      dateRange?.startDate,
      dateRange?.endDate,
      selectedOrganization
    );
  }, [dateRange, selectedOrganization]);
  

  return (
    <div className="" style={{ marginTop: "20px" }}>
      <div className="d-flex justify-content-between" style={{ width: "100%" }}>
        {cardData?.map((item, index) => (
          <div
            className="rounded-lg w-30"
            style={{
              backgroundColor: item?.color,
              width: "19%",
              height: "80px",
              display: "flex",
              // justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              borderRadius: "10px",
              padding:"5px"
              
            }}
          >
            {computingTileStatusLoader ? (
              <div>
                <Skeleton.Input
                  className="w-100"
                  style={{ height: "60px" }}
                  active
                />
              </div>
            ) :  (
              <div className="d-flex w-100 mt-3">
                <div
                  style={{
                    width: "48px",
                    height: "47px",
                    backgroundColor: item?.iconBg,
                    borderRadius: "10px",
                    margin: "0 10px 16px",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <Image src={item?.icon} />
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight:"900"}}>{item?.title}</div>
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    {item?.count}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {computingStatusLoader ? (
        <div>
          <Skeleton.Input
            className="w-100 mt-2"
            style={{ height: "312px" }}
            active
            
          />
        </div>
      ) : getAllComputingStatus?.COMPUTED?.length > 0 ? (
        <div >
          <CodesGraph options={options} className={`${classNames}`} />
        </div>
      ) : (
        <div className={styles.centered_container}>
        <Empty />
      </div>
      )}
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllComputingStatus:
      state?.tenantAdmin?.dashboard?.default?.allComputingStatus?.data
        ?.response,
    getAllComputingTile:
      state?.tenantAdmin?.dashboard?.default?.allComputingTileStatus?.data
        ?.response,
    top10DiseasesData:
      state?.tenantAdmin?.dashboard?.default?.allTop10Diseases?.data?.response,
    computingTileStatusLoader:
      state?.tenantAdmin?.dashboard?.default?.computingTileStatusLoader,
    computingStatusLoader:
      state?.tenantAdmin?.dashboard?.default?.allComputingStatus?.loading
      ,
  }),
  {
    getAllComputing: defaultActions.ComputingStatus,
    getComputingStatus: defaultActions.computingTileStatus,
    getTop10DiseasesData: defaultActions.top10Diseases,
  }
);

export default enhancer(Files);
