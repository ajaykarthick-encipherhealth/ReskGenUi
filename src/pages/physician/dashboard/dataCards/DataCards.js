import React from "react";
import Image from "next/image";
import { Col, Row, Spin } from "antd";
import styles from "./styles.module.css";
import spinSTYles from "../../../../styles/auth.module.css";
import TopCards from "../topcards/Index";
import Card from "../../../../components/card";

const DataCards = ({ cardDataInfo, loading, DivData }) => {
  return (
    <div className={styles.maindibv}>
      <div className={styles.rowCon}>
        <TopCards CardData={cardDataInfo} width={"100%"} loading={loading} />
      </div>
      <div className={styles.containerDiv}>
        <Card
          borderRadius="10px"
          width="100%"
          height="300px"
          display="flex"
          padding="0px 10px"
        >
          <div style={{ width: "100%" }}>
            <Row gutter={16} style={{ height: "45%" }}>
              {loading  ? (
                <div className={spinSTYles.spinStyle}>
                  <Spin loading={loading} />
                </div>
              ) : (
                DivData?.slice(0, 3).map((info, index) => (
                  <Col
                    className="gutter-row"
                    span={8}
                    style={{
                      borderRight:
                        (index === 0 || index === 1) && "1px solid #d9d9d9",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "22px", fontWeight: "700" }}>
                          {info?.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            color: "rgba(140, 144, 151, 1)",
                            padding: "5px 0",
                          }}
                        >
                          {info?.subTitle}
                        </div>
                        <div style={{ fontSize: "32px", fontWeight: "700" }}>
                          {info?.count}
                        </div>
                      </div>
                      <div>
                        <Image
                          src={info?.icon}
                          alt="noimg"
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                  </Col>
                ))
              )}
            </Row>
            <Row
              gutter={16}
              style={{
                height: "45%",
                borderTop: "1px solid #d9d9d9",
              }}
            >
              {loading  ? (
                <div className={spinSTYles.spinStyle}>
                  <Spin loading={loading} />
                </div>
              ) : (
                DivData?.slice(3).map((info, index) => (
                  <Col
                    className="gutter-row"
                    span={8}
                    style={{
                      borderRight:
                        (index == 0 || index == 1) && "1px solid #d9d9d9",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "22px", fontWeight: "700" }}>
                          {info?.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            color: "rgba(140, 144, 151, 1)",
                            padding: "10px 0",
                          }}
                        >
                          {info?.subTitle}
                        </div>
                        <div style={{ fontSize: "32px", fontWeight: "700" }}>
                          {info?.count}
                        </div>
                      </div>
                      <div>
                        <Image
                          src={info?.icon}
                          alt="noimg"
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                  </Col>
                ))
              )}
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataCards;
