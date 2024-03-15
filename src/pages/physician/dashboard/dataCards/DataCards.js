import React from "react";
import styles from "./styles.module.css";
import TopCards from "../topcards/Index";
import disease from "../../../../images/physician/disease.svg";
import Card from "../../../../components/card";
import { Col, Row } from "antd";

const CardData = [
  {
    id: 1,
    icon: disease,
    title: "Total disease found",
    cotunt: "200k",
    bg: "linear-gradient(to right, rgba(232, 121, 249, 1), rgba(211, 176, 217, 1))",
  },
];

const DivData = [
  {
    id: 1,

    title: "Patient visit today",
    cotunt: "200",
    bg: "linear-gradient(to right, rgba(34, 211, 238, 1), rgba(152, 227, 240, 1))",
  },
  {
    id: 2,

    title: "Total completed patients",
    cotunt: "150",
    bg: "linear-gradient(to right, rgba(167, 139, 250, 1), rgba(211, 206, 228, 1))",
  },
  {
    id: 3,

    title: "Upcoming patients count",
    cotunt: "40",
    bg: "linear-gradient(to right, rgba(93, 135, 255, 1), rgba(199, 208, 235, 1))",
  },
];
const DataCards = () => {
  return (
    <div className={styles.maindibv}>
      <div className={styles.rowCon}>
        <TopCards CardData={CardData} width={"100%"} />
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
            <Row gutter={16} style={{ height: "50%" }}>
              {DivData?.map((info, index) => (
                <Col
                  className="gutter-row"
                  span={8}
                  style={{
                    borderRight:
                      (index === 0 || index === 1) &&
                      "1px solid rgba(187, 187, 187, 1)",
                  }}
                >
                  <div>{info?.title}</div>
                </Col>
              ))}
            </Row>
            <Row
              gutter={16}
              style={{
                height: "50%",
                borderTop: "1px solid rgba(187, 187, 187, 1)",
              }}
            >
              {DivData?.map((info, index) => (
                <Col
                  className="gutter-row"
                  span={8}
                  style={{
                    borderRight:
                      (index == 0 || index == 1) &&
                      "1px solid rgba(187, 187, 187, 1)",
                  }}
                >
                  <div>{info?.title}</div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataCards;
