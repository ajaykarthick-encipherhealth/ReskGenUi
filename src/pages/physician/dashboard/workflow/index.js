import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import completed from "../../../../images/dashboard/completed.png";
import calender from "../../../../images/dashboard/calender.png";
import Card from "../../../../components/card";
import allocated from "../../../../images/dashboard/allocated.png";
import pending from "../../../../images/dashboard/pending.png";
import hold from "../../../../images/dashboard/hold.png";
import { Col, Row } from "antd";
import HeadTitle from "../../../../components/headtitle";
import holdbg from '../../.../../../../images/dashboard/holdbg.png'
import allocatedbg from '../../.../../../../images/dashboard/allocatedbg.png'
import pendingbg from '../../.../../../../images/dashboard/pendingbg.png'
import completedbg from '../../.../../../../images/dashboard/completedbg.png'

const WorkFlow = () => {
  const card1Data = [
    {
      id: 1,
      icon: allocated,
      title: "Allocated",
      charts: "170 charts",
      days: "last 30 days",
      bg: allocatedbg,
    },
    {
      id: 2,
      icon: pending,
      title: "Pending",
      charts: "60 charts",
      days: "last 3 days",
      bg: pendingbg,
    },
    {
      id: 3,
      icon: hold,
      title: "Hold",
      charts: "80 charts",
      days: "last 7 days",
      bg: holdbg,
    },
    {
      id: 4,
      icon: completed,
      title: "Completed",
      charts: "10 charts",
      days: "last 2 days",
      bg: completedbg,
    },
  ];
  return (
    <div className={styles.card1}>
      <HeadTitle header="Last 30 days work flow " icon={calender} />
      <Card borderRadius="28px">
        <Row className={styles.cardRow}>
          {card1Data?.map((data) => (
              <Col
                span={10}
                style={{ 
                backgroundImage:`url(${data?.bg.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover", 
                width:"100%",
              height:"45%"}}
                className={styles.colData}
              >
               <div style={{}}>
               <div className={styles.header}>
                  <Image src={data?.icon} className={styles.Img} />
                  <div className={styles.heading}>{data.title}</div>
                </div>
                <div className={styles.charts}>{data?.charts}</div>
                <div className={styles.days}>{data.days}</div>
               </div>
              </Col>
            )
          )}
        </Row>
      </Card>
    </div>
  );
};

export default WorkFlow;
