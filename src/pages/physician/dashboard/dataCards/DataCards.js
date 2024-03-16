import React from "react";
import { Col, Row } from "antd";
import styles from "./styles.module.css";
import TopCards from "../topcards/Index";
import disease from "../../../../images/physician/disease.svg";
import Card from "../../../../components/card";
import cont1 from '../../../../images/physician/cont1.svg'
import cont2 from '../../../../images/physician/cont2.svg'
import cont3 from '../../../../images/physician/cont3.svg'
import cont4 from '../../../../images/physician/cont4.svg'
import cont5 from '../../../../images/physician/cont5.svg'
import cont6 from '../../../../images/physician/cont6.svg'
import Image from "next/image";

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
    title: "Top 5 Condition",
    subTitle: "",
    count: "50 k",
    icon: cont1,
    bg: "linear-gradient(to right, rgba(34, 211, 238, 1), rgba(152, 227, 240, 1))",
  },
  {
    id: 2,
    title: "I10",
    subTitle: "Hypertension",
    count: "10k",
    icon: cont2,
    bg: "linear-gradient(to right, rgba(167, 139, 250, 1), rgba(211, 206, 228, 1))",
  },
  {
    id: 3,
    title: "A01",
    subTitle: "Typhoid and paratyphoid fever",
    count: "10k",
    icon: cont3,
    bg: "linear-gradient(to right, rgba(93, 135, 255, 1), rgba(199, 208, 235, 1))",
  },
  {
    id: 4,
    title: "A03",
    subTitle: "Shigellosis",
    count: "50 k",
    icon: cont4,
    bg: "linear-gradient(to right, rgba(34, 211, 238, 1), rgba(152, 227, 240, 1))",
  },
  {
    id: 5,
    title: "A02",
    subTitle: "Other salmonella infections",
    count: "10k",
    icon: cont5,
    bg: "linear-gradient(to right, rgba(167, 139, 250, 1), rgba(211, 206, 228, 1))",
  },
  {
    id: 6,
    title: "A04",
    subTitle: "Other bacterial intestinal infections",
    count: "10k",
    icon: cont6,
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
            <Row gutter={16} style={{ height: "45%" }}>
              {DivData?.slice(0, 3).map((info, index) => (
                <Col
                  className="gutter-row"
                  span={8}
                  style={{
                    borderRight:
                      (index === 0 || index === 1) &&
                      "1px solid #d9d9d9",
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
                      <div  style={{fontSize:"22px",fontWeight:"700"}}>{info?.title}</div>
                      <div style={{fontSize:"12px",fontWeight:"400",color:'rgba(140, 144, 151, 1)',padding:"5px 0"}}>{info?.subTitle}</div>
                      <div style={{fontSize:"32px",fontWeight:"700"}}>{info?.count}</div>
                    </div>
                    <div><Image src={info?.icon} alt="noimg" width={50} height={50}/></div>
                  </div>
                </Col>
              ))}
            </Row>
            <Row
              gutter={16}
              style={{
                height: "45%",
                borderTop: "1px solid #d9d9d9",
              }}
            >
              {DivData?.slice(3).map((info, index) => (
                <Col
                  className="gutter-row"
                  span={8}
                  style={{
                    borderRight:
                      (index == 0 || index == 1) &&
                      "1px solid #d9d9d9",
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
                      <div style={{fontSize:"22px",fontWeight:"700"}}>{info?.title}</div>
                      <div style={{fontSize:"12px",fontWeight:"400",color:'rgba(140, 144, 151, 1)',padding:"10px 0"}}>{info?.subTitle}</div>
                      <div style={{fontSize:"32px",fontWeight:"700"}}>{info?.count}</div>
                    </div>
                    <div><Image src={info?.icon} alt="noimg" width={50} height={50}/></div>
                  </div>
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
