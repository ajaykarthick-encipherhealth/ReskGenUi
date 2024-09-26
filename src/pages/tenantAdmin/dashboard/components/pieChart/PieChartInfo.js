import React from "react";
import ReactECharts from "echarts-for-react";
import styles from "./styles.module.css";
import { Col, Row } from "antd";

const index = ({data,header}) => {
  const totalSum = data?.reduce((acc, curr) => acc + curr.value, 0);
  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
    },
    legend: {
      top: "5%",
      left: "60%",
      width: 20,
      show: false,
    },
    series: [
      {
        name: header,
        type: "pie",
        radius: ["60%", "40%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        hoverAnimation: false,
        label: {
          show: true,
          position: "center",
          hoverAnimation: false,
          formatter: function () {
            return `{b|${totalSum}}\n {a|Total}`;
          },
          backgroundColor: "transparent",
          rich: {
            a: {
              fontSize: 17,
              fontWeight: 500,
              marginTop: 320,
            },
            b: {
              fontSize: 17,
              fontWeight: 700,
            },
          },
          silent: true,
        },
        itemStyle: {
          borderRadius: 0,
          borderColor: "#fff",
          borderWidth: 5,
        },
        emphasis: {
          focus: 'series',
         
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };
 
  return (
    <Row>
      <Col span={12}>
        <div
          className={`tenantPie ${styles.container}`}
          style={{ width: "100%" }} 
        >
          <ReactECharts
            option={option}
            style={{ width: "100%", height: "180px",marginLeft:"-10px" }}
          />
        </div>
      </Col>
      <Col span={12} className={styles.headerTitle}>
        <div >
          {data?.map((item) => {
            return (
              <div className={styles.container}>
                <div style={{ display: "flex",width:"90%" , justifyContent:"center", alignItems:"center"}}>
                  <div
                    className={styles.bgColor}
                    style={{
                      backgroundColor: item?.itemStyle?.color,
                    }}
                  ></div>
                  <span className={styles.userNameTitle}>{item.name}</span>
                  <div className={styles.subText}>{item.value}</div>
                </div>

                
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

export default index;