import React, { useEffect, useState } from "react";
import HeadTitle from "../../../../components/headtitle";
import styles from "./styles.module.css";
import Card from "../../../../components/card";
import { Empty, Skeleton, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import spinSTYles from "../../../../styles/auth.module.css";
import { TeamChart } from "../../../../services/adminServices/DashboardService";
import dynamic from "next/dynamic";
import { renderCardSkeleton } from "../../../reviewer/dashboard/accuracy";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const BarChart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const teamChartData = useSelector(
    (state) => state?.AdminDashboardReducers?.teamData
  );

  const datas = teamChartData?.data ? teamChartData?.data : [];

  const teams = datas?.response?.map((info) => {
    const firstNameInitial = info?.firstName;
    return `${firstNameInitial}`;
  });
  const colors = ["#F4EDFD", "#EAD8FE", "#DBB9FE", "#962DFF", "#CC99FF"];
  let series = [
    {
      data: datas?.response?.map((item) =>
        item?.totalFileAllocated ? item.totalFileAllocated : 0
      ),
      type: "bar",
      stack: "a",
      name: "totalFileAllocated",
    },
    {
      data: datas?.response?.map((item) =>
        item?.totalFileProcessed ? item.totalFileProcessed : 0
      ),
      type: "bar",
      stack: "a",
      name: "totalFileProcessed",
    },

    {
      data: datas?.response?.map((item) =>
        item?.totalFilePending ? item.totalFilePending : 0
      ),
      type: "bar",
      stack: "a",
      name: "totalFilePending",
    },
    {
      data: datas?.response?.map((item) =>
        item?.totalFileDeclined ? item.totalFileDeclined : 0
      ),
      type: "bar",
      stack: "a",
      name: "totalFileDeclined",
      barWidth: 30,
    },
  ];
  const stackInfo = {};
  for (let i = 0; i < series[0].data?.length; ++i) {
    for (let j = 0; j < series?.length; ++j) {
      const stackName = series[j]?.stack;
      if (!stackName) {
        continue;
      }
      if (!stackInfo[stackName]) {
        stackInfo[stackName] = {
          stackStart: [],
          stackEnd: [],
        };
      }
      const info = stackInfo[stackName];
      const data = series[j]?.data[i];
      if (data && data !== "-") {
        if (info.stackStart[i] == null) {
          info.stackStart[i] = j;
        }
        info.stackEnd[i] = j;
      }
    }
  }
  for (let i = 0; i < series?.length; ++i) {
    const data = series[i].data;
    const info = stackInfo[series[i]?.stack];
    for (let j = 0; j < series[i]?.data?.length; ++j) {
      data[j] = {
        value: data[j],
        itemStyle: {
          color: colors[i],
        },
      };
    }
  }
  const option = {
    plotOptions: {
      series: {
        stacking: "normal",
        dataSorting: {
          enabled: true,
          sortKey: "y",
        },
      },
    },
    yAxis: {
      type: "category",
      data: teams,
      axisLabel: {
        rotate: 0,
        interval: 0,
      },
    },
    xAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
    },
    series: series,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
  };

  const series2 = [
    {
      name: "Total File Declined",
      data: datas?.response?.map((item) =>
        item?.totalFileDeclined ? item.totalFileDeclined : 0
      ),
      color: "#EB5252",
    },
    {
      name: "Total File Pending",
      data: datas?.response?.map((item) =>
        item?.totalFilePending ? item.totalFilePending : 0
      ),
      color: "#5da9e4",
    },
    {
      name: "Total File Hold",
      data: datas?.response?.map((item) =>
        item?.totalFileHold ? item.totalFileHold : 0
      ),
      color: "#4474c5",
    },
    {
      name: "Total File Completed",
      data: datas?.response?.map((item) =>
        item?.totalFileProcessed ? item.totalFileProcessed : 0
      ),
      color: "#06c213",
    },
  ];

  const options2 = {
    grid: {
      show: false,
    },
    bar: {
      width: "30px",
    },
    chart: {
      type: "bar",
      horizontal: true,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: false,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
        dataSorting: {
          enabled: true,
          sortKey: "y",
        },
      },
    },
    xaxis: {
      type: "text",
      categories: teams,
      labels: {
        show: true,
      },
    },
    yaxis: {
      lables: {
        show: true,
      },
      categories: teams,
    },
    legend: {
      show: false,
      position: "bottom",
      // offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
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
            <div className={styles.select}></div>
            <div className={styles.header}>
              <div
                style={{
                  width: "100%",
                  bottom: "0",
                }}
                className={styles.chartContainer}
              >
                {teamChartData?.loading ? (
                  renderCardSkeleton(426, 650, 30)
                ) : teamChartData?.data?.response?.length > 0 ? (
                  option && (
                    <ReactApexChart
                      options={options2}
                      series={series2}
                      type="bar"
                      height={630}
                    />
                  )
                ) : (
                  <div
                    className={spinSTYles.spinStyle}
                    style={{ height: "600px", alignItems: "center" }}
                  >
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
