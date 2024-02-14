import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import HeadTitle from "../../../../components/headtitle";
import styles from "./styles.module.css";
import Card from "../../../../components/card";
import { Empty, Spin } from "antd";
import Selector from "../../../../components/selector";
import { useDispatch } from "react-redux";
import { TeamChart } from "../../../../services/adminServices/dashboardService";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import spinSTYles from "../../../../styles/auth.module.css";

const staticDatas = {
  status: "SUCCESS",
  message: "Success!!",
  response: [
    {
      totalFileProcessed: 95,
      totalFileAllocated: 148,
      totalFilePending: 48,
      totalFileHold: 3,
      totalFileDeclined: 10,
      userName: "praveen01@encipherhealth.onmicrosoft.com",
      firstName: "Mason",
      lastName: "Carter",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/a0867bd9-0528-4d34-bdd2-459ea7c2a4b7.png",
    },
    {
      totalFileProcessed: null,
      totalFileAllocated: null,
      totalFilePending: null,
      totalFileHold: null,
      totalFileDeclined: null,
      userName: "jansi01@encipherhealth.onmicrosoft.com",
      firstName: "Jansi",
      lastName: "Patel",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/9c81a14f-7154-4ea9-9190-e52ad210e244.jpeg",
    },
    {
      totalFileProcessed: null,
      totalFileAllocated: null,
      totalFilePending: null,
      totalFileHold: null,
      totalFileDeclined: null,
      userName: "uvais01@encipherhealth.onmicrosoft.com",
      firstName: "Alexander",
      lastName: "Harris",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/8ed49b11-2369-4526-8df9-f6205e957e4c.avif",
    },
    {
      totalFileProcessed: null,
      totalFileAllocated: null,
      totalFilePending: null,
      totalFileHold: null,
      totalFileDeclined: null,
      userName: "vignesh@encipherhealth.onmicrosoft.com",
      firstName: "Gabriel",
      lastName: "Jenkins",
      profileImageUrl:
        "https://cogentaifiles.blob.core.windows.net/profileimages/080e0d00-56fb-4b45-941e-c6787f47dad3.jpg",
    },
  ],
};
const BarChart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const teamChartData = useSelector((state) => state.adminDatas.data);
  const [selectOption, setSelectedOption] = useState();
  const selectorOptions = [
    { label: "Team1", value: "team1" },
    { label: "Team2", value: "team2" },
    { label: "Team3", value: "team3" },
    { label: "Team4", value: "team4" },
  ];
  const datas = teamChartData?.data ? teamChartData?.data : staticDatas;
  const teams = [];
  for (var i = 0; i <= datas?.response?.length; i++) {
    teams?.push(`Team${i}`);
  }

  const rawData = [
    datas?.response?.map((item) =>
      item?.totalFileProcessed ? item.totalFileProcessed : 0
    ),
    datas?.response?.map((item) =>
      item?.totalFileAllocated ? item.totalFileAllocated : 0
    ),
    datas?.response?.map((item) =>
      item?.totalFilePending ? item.totalFilePending : 0
    ),
    datas?.response?.map((item) =>
      item?.totalFileHold ? item.totalFileHold : 0
    ),
    datas?.response?.map((item) =>
      item?.totalFileDeclined ? item.totalFileDeclined : 0
    ),
  ];

  const totalData = [];
  for (let i = 0; i < rawData[0]?.length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData?.length; ++j) {
      sum += rawData[j][i];
    }
    totalData?.push(sum);
  }
  const grid = {
    left: 100,
    right: 100,
    top: 50,
    bottom: 50,
  };
  const series = [
    "totalFileProcessed",
    "totalFileAllocated",
    "totalFilePending",
    "totalFileHold",
    "totalFileDEclined",
  ]?.map((name, sid) => {
    return {
      name,
      type: "bar",
      stack: "total",
      barWidth: "50%",

      label: {
        show: false,
      },
      showSymbol: false,
      data: rawData[sid]?.map((d, did) =>
        totalData[did] <= 0 ? 0 : d / totalData[did]
      ),
    };
  });

  const option = {
    legend: false,
    grid,
    // tooltip: {
    //   trigger: "axis",
    //   axisPointer: {
    //     type: "shadow",
    //   },
    //   formatter: function (params) {
    //     let tooltipContent = "";
    //     params.forEach((param) => {
    //       const seriesName = param.seriesName;

    //       const value = Array.isArray(param.value)
    //         ? param.value.reduce((acc, curr) => acc + curr, 0)
    //         : param.value;
    //       console.log(param.value, value);
    //       const formattedValue = value === 0 ? value : value + "+";
    //       tooltipContent += `${seriesName}: ${formattedValue}<br/>`;
    //     });
    //     return tooltipContent;
    //   },
    // },
    yAxis: {
      type: "value",
    },
    xAxis: {
      type: "category",
      data: teams,
    },
    series: series.map((serie, index) => ({
      ...serie,
      itemStyle: {
        color: [
          "#962DFF",
          // "#BF80FF",
          "#CC99FF",
          // "#D4A8FF",
          "#DBB9FE",
          "#EAD8FE",
          "#F4EDFD",
        ][index],
      },
    })),
  };

  useEffect(() => {
    dispatch(TeamChart(router));
  }, [router]);

  return (
    <>
      <HeadTitle header="Team Chart Status" />
      <div className={styles.card5}>
        <Card borderRadius="28px" padding="0px">
          <div className={styles.buttonDiv}>
            <div className={styles.header}>
              <div
                style={{
                  width: "100%",
                  marginTop:
                    !teamChartData?.loading && !datas?.response
                      ? "0px"
                      : "30px",
                }}
              >
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    position:"relative",
                    top:"-10px",
                    right:"30px"
                  }}
                >
                  <Selector
                    selectlabel=""
                    setSelectedOption={setSelectedOption}
                    selectOptions={selectorOptions}
                    defaultSelectValue1="Select Team"
                  />
                </div> */}

                {!teamChartData?.loading && !datas?.response ? (
                  <div
                    className={spinSTYles.spinStyle}
                    style={{
                      height: "100%",
                      paddingTop: "150px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spin loading={teamChartData?.loading} />
                  </div>
                ) : datas?.response ? (
                  option && (
                    <ReactECharts
                      option={option}
                      style={{
                        width: "100%",
                        height: "340px",
                        marginTop: "-30px",
                        overflowX: "hidden",
                      }}
                    />
                  )
                ) : (
                  <div className={spinSTYles.spinStyle}>
                    <Empty />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default BarChart;
