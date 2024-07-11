import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import styles from "./styles.module.css";
import { Button, Modal, Skeleton } from "antd";

const OrgPieChartInfo = ({ data, loaderButton, orgLoader }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
            return `{b|${data?.length}}\n {a|${
              data?.length <= 1 ? "Organization" : "Organizations"
            }}`;
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
      {loaderButton && orgLoader ? (
        <div className="skeletonantd d-flex justify-content-center align-items-center">
          <Skeleton.Avatar active size="large" shape="circle" />
        </div>
      ) : orgLoader ? (
        <div className="d-flex justify-content-center align-items-center">
          {" "}
          <Spin size="large" />
        </div>
      ) : (
        <ReactECharts
          option={option}
          style={{ width: "100%", height: "380px", marginTop: "-70px" }}
        />
      )}

      {loaderButton && orgLoader ? (
        <Skeleton active />
      ) : orgLoader ? (
        <div className="d-flex justify-content-center align-items-center">
          {" "}
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              type="link"
              onClick={() => {
                showModal();
                console.log("click");
              }}
            >
              view all
            </Button>
          </div>
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
      )}
      <Modal
        title="Organzation"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ height: "500px", overflow: "auto" }}>
          {data?.map((item) => {
            return (
              <div
                className={styles.container}
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
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
      </Modal>
    </>
  );
};

export default OrgPieChartInfo;
