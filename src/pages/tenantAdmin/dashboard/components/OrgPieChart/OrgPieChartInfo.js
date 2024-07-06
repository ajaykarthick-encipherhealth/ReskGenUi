import React from "react";
import ReactECharts from "echarts-for-react";
import styles from "./styles.module.css";

const OrgPieChartInfo = ({data}) => {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "60%",
      //   left: "start",
      width: 20,
      show: false,
    },
    series: [
      {
        // name: "Access From",
        type: "pie",
        radius: ["55%", "60%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: function (params) {
            return `{b|${data?.length}}\n {a|${data?.length<=1?"Organization":"Organizations"}}`;
          },
          backgroundColor: "transparent",

          rich: {
            a: {
              fontSize: 14,
              fontWeight: 500,
              marginTop: 320,
            },
            b: {
              fontSize: 30,
              fontWeight: 700,
            },
          },
        },
        itemStyle: {
          borderRadius: 0,
          borderColor: "#fff",
          borderWidth: 5,
        },
        emphasis: {
          show: false,
          label: {
            show: false,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };
 


  return (
    <>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "380px",marginTop:"-70px" }}
      />
      <div className={styles.bulletsDiv}>
        {data?.map((item) => {
          return (
            <div className={styles.container}>
              <div style={{ display: "flex", width: "100%" }}>
                <div
                  className={styles.bgColor}
                  style={{
                    backgroundColor: item?.itemStyle?.color,
                  }}
                ></div>
                <span className={styles.userNameTitle}>{item.name}</span>
              </div>

              <div className={styles.subText}>{item.value}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OrgPieChartInfo;
