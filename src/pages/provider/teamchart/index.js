import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../components/card";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { TeamChart } from "../../../services/adminServices/DashboardService";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const Teamchart = () => {
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
    const firstNameInitial = info?.firstName;
    return `${firstNameInitial}`;
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
    for (let j = 0; j < series[i]?.data?.length; ++j) {
      data[j] = {
        value: data[j],
        itemStyle: {
          // borderRadius: [bottomBorder, topBorder, topBorder, bottomBorder],
          color: colors[i],
        },
      };
    }
  }

  useEffect(() => {
    dispatch(TeamChart(router));
  }, [router]);

  const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-project-0-gdoee",
    showAttribution: false,
  });
  const teamChart = sdk.createChart({
    chartId: "65f93b7c-05d4-46ea-8c27-7b2e54f9d0cd",
  });

  useEffect(() => {
    teamChart.render(document.getElementById("teamchart"));
  }, []);

  return (
    <>
      <h4>Team chart status</h4>
      <div className={styles.card5}>
        <Card borderRadius="30px" padding="0px">
          <div className={styles.buttonDiv}>
            <div className={styles.select}>
              {/* <Select
                showSearch
                value={selectUser}
                placeholder="Select Team"
                className={`custom_select_user ${styles.custom_select_user}`}
                onChange={(e) => onChangeUser(e)}
                options={optionsUser}
              /> */}
            </div>
            <div
              id="teamchart"
              className="mt-3 p-4"
              style={{
                height: 370,
                width: 1000,
              }}
            ></div>
            <div className={styles.header}>
              {/* <div
                style={{
                  width: "100%",
                  bottom: "0",
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
                      height={630}
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
              </div> */}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Teamchart;
