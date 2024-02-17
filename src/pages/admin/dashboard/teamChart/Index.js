import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import HeadTitle from "../../../../components/headtitle";
import styles from "./styles.module.css";
import Card from "../../../../components/card";
import { Empty, Spin } from "antd";
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

  const colors = [
    "#962DFF",
    // "#BF80FF",
    "#CC99FF",
    // "#D4A8FF",
    "#DBB9FE",
    "#EAD8FE",
    "#F4EDFD",
  ];
  var series = [
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
      barWidth:30
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
          borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder],
          color: colors[i],
        },
      };
    }
  }
  const option = {
    xAxis: {
      type: "category",
      data: teams,
    },
    yAxis: {
      type: "value",
    },
    series: series,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
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
                      option={option}
                      style={{
                        width: "100%",
                        height: "680px",
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
