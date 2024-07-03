import React from "react";
import CodesGraph from "../../components/codeGraph";
import Image from "next/image";
import codescaptured from "../../../../../images/tenantAdmin/codecaptured.svg";
import processing from "../../../../../images/tenantAdmin/processing.svg";
import failed from "../../../../../images/tenantAdmin/failed.svg";
import completed from "../../../../../images/tenantAdmin/completed.svg";
import upload from "../../../../../images/tenantAdmin/upload.svg";

const Files = () => {
  const options = {
    xAxis: {
      type: "category",
      data: [
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
        name: "Upload",
        data: [10, 30, 16, 33, 13, 78, 6, 76, 65, 23, 11, 56],
        type: "line",
        lineStyle: { color: "#3B3486" },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "Processing",
        data: [10, 76, 98, 76, 24, 87, 23, 11, 56, 99, 3, 22],
        type: "line",
        lineStyle: { color: "#4A3AFF" },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "Completed",
        data: [10, 30, 50, 29, 13, 78, 54, 76, 98, 13, 11, 56],
        type: "line",
        lineStyle: { color: "#00BC13" },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "Failed",
        data: [10, 76, 98, 76, 24, 87, 23, 81, 56, 99, 3, 22],
        type: "line",
        lineStyle: { color: "#FF8551" },
        smooth: true,
        showSymbol: false,
      },
    ],
  };
  const cardData = [
    {
      id: 1,
      title: "Upload",
      count: "12434",
      icon: upload,
      color: "#ECEBFF",
      iconBg: "#D0CCFF",
    },
    {
      id: 2,
      title: "Processing",
      count: "62345",
      icon: processing,
      color: "#EAE9F6",
      iconBg: "#DCDAF1",
    },
    {
      id: 3,
      title: "Completed",
      count: "62345",
      icon: completed,
      color: "#D6FFDA",
      iconBg: "#ADFFB5",
    },
    {
      id: 4,
      title: "Failed",
      count: "62345",
      icon: failed,
      color: "#FFEAE0",
      iconBg: "#FFDBCC",
    },
   
  ];
  return (
    <div className="">
      <div className="d-flex justify-content-between" style={{ width: "100%" }}>
        {cardData?.map((item, index) => (
          <div
            className="rounded-lg w-30"
            style={{
              backgroundColor: item?.color,
              width: "20%",
              height: "70px",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <div className="d-flex justify-content-between">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: item?.iconBg,
                  borderRadius: "10px",
                  margin: "0 10px 0 0",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Image src={item?.icon} />
              </div>
              <div>
                <div style={{ fontSize: "16px" }}>{item?.title}</div>
                <div style={{ fontSize: "18px", fontWeight: "700" }}>
                  {item?.count}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CodesGraph options={options} />
    </div>
  );
};

export default Files;
