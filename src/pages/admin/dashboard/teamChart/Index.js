import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import HeadTitle from "../../../../components/headtitle";
import styles from "./styles.module.css";
import Card from "../../../../components/card";
import { Empty, Spin } from "antd";
import Selector from "../../../../components/selector";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import spinSTYles from "../../../../styles/auth.module.css";
import { TeamChart } from "../../../../services/adminServices/DashboardService";

const BarChart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const teamChartData = useSelector(
    (state) => state.AdminDashboardReducers.teamData
  );

  const datas = teamChartData?.data ? teamChartData?.data : [];
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
        totalData[did]
      ),
    };
  });

  console.log(series);
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

  const options = {
    xAxis: {
      type: 'category',
      data: ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [30, 60, 10, 40, 70],
        type: 'bar',
        label: {
          show: true, // Show the label
          position: 'top' // Position of the label
        },
        color: [
          "#962DFF",
          // "#BF80FF",
          "#CC99FF",
          // "#D4A8FF",
          "#DBB9FE",
          "#EAD8FE",
          "#F4EDFD",
        ],
      }
    ]
};


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
                  marginTop: "30px",
                }}
              >
                {teamChartData?.loading ? (
                  <div
                    className={spinSTYles.spinStyle}
                    style={{
                      
                      paddingTop: "150px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spin loading={teamChartData?.loading} />
                  </div>
                ) : teamChartData?.data?.response?.length > 0 ? (
                  option && (
                    <ReactECharts
                      option={options}
                      style={{
                        width: "100%",
                        height: "640px",
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
