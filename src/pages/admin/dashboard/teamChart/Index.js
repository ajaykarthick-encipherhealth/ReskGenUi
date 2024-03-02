import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import HeadTitle from "../../../../components/headtitle";
import styles from "./styles.module.css";
import Card from "../../../../components/card";
import { Empty, Spin, Select } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import spinSTYles from "../../../../styles/auth.module.css";
import { TeamChart } from "../../../../services/adminServices/DashboardService";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const BarChart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const teamChartData = useSelector(
    (state) => state.AdminDashboardReducers.teamData
  );
  const [selectUser, setSelectUser] = useState([]);

  const selectUserList = useSelector(
    (state) => state?.AdminDashboardReducers?.selectedUsers
  );

  const datas = teamChartData?.data ? teamChartData?.data : [];
  const teams = datas?.response?.map((info) => {
    const firstNameInitial = info?.firstName?.charAt(0) || "";
    const lastNameInitial = info?.lastName?.charAt(0) || "";
    return `${firstNameInitial}${lastNameInitial}`;
  });
  const colors = [
    "#F4EDFD",
    // "#D4A8FF",
    "#EAD8FE",
    "#DBB9FE",
    "#962DFF",

    // "#BF80FF",
    "#CC99FF",
  ];
  var series = [
    {
      data: datas?.response?.map((item) =>
        item?.totalFileAllocated ? item.totalFileAllocated : 0
      ),
      // data: [120, 330, 20, 50, 20, 120, 330, 20, 50, 20],
      type: "bar",
      stack: "a",
      name: "totalFileAllocated",
    },
    {
      data: datas?.response?.map((item) =>
        item?.totalFileProcessed ? item.totalFileProcessed : 0
      ),
      // data: [120, 330, 90, 150, 20, 120, 330, 20, 50, 20],
      type: "bar",
      stack: "a",
      name: "totalFileProcessed",
    },

    {
      data: datas?.response?.map((item) =>
        item?.totalFilePending ? item.totalFilePending : 0
      ),
      // data: [120, 30, 220, 50, 120, 120, 330, 20, 50, 20],
      type: "bar",
      stack: "a",
      name: "totalFilePending",
    },
    {
      data: datas?.response?.map((item) =>
        item?.totalFileDeclined ? item.totalFileDeclined : 0
      ),
      // data: [120, 300, 160, 250, 90, 120, 330, 20, 50, 20],
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
      const isEnd = info.stackEnd[j] === i;
      const topBorder = isEnd ? 20 : 0;
      const bottomBorder = 0;
      data[j] = {
        value: data[j],
        itemStyle: {
          // borderRadius: [bottomBorder, topBorder, topBorder, bottomBorder],
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
      color: "#eab077",
    },
    {
      name: "Total File Allocated",
      data: datas?.response?.map((item) =>
        item?.totalFileAllocated ? item.totalFileAllocated : 0
      ),
      color: "#00BC13",
    },
    {
      name: "Total File Processed",
      data: datas?.response?.map((item) =>
        item?.totalFileProcessed ? item.totalFileProcessed : 0
      ),
      color: "#ED9331",
    },
  ];

  const options2 = {
    grid: {
      show: false,
    },
    bar: {
      widhth: "30px",
    },
    // colors: ["#00BC13", "#ED9331", "#DBB9FE", , "#F4EDFD"],
    chart: {
      type: "bar",
      height: "1000px",
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
        horizontal: false,
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
      label: false,
    },
    yaxis: {
      labels: {
        show: false,
      },
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

  const onChangeUser = (e) => {
    setSelectUser([e]);
  };

  const optionsUser = [];

  const individualUserRes = selectUserList?.data?.response?.map((res) =>
    optionsUser.push({
      value: res.userName,
      label: res.firstName + " " + res.lastName,
    })
  );

  useEffect(() => {
    dispatch(TeamChart(router));
  }, [router]);

  return (
    <>
      <HeadTitle header="Team Chart Status" />
      <div className={styles.card5}>
        <Card borderRadius="28px" padding="0px">
          <div className={styles.buttonDiv}>
            <div className={styles.select}>
              <Select
                showSearch
                value={selectUser}
                placeholder="Select Team"
                className={`custom_select_user ${styles.custom_select_user}`}
                onChange={(e) => onChangeUser(e)}
                options={optionsUser}
              />
            </div>
            <div className={styles.header}>
              <div
                style={{
                  width: "100%",
                }}
                className={styles.chartContainer}
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
                    <ReactApexChart
                      options={options2}
                      series={series2}
                      type="bar"
                      height={780}
                    />
                    // <ReactECharts
                    //   option={option}
                    //   style={{
                    //     width: "100%",
                    //     height: "680px",
                    //     marginTop: "-30px",
                    //     overflowY: "hidden",
                    //   }}
                    // />
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
