import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import completed from "../../../../images/dashboard/completed.png";
import calender from "../../../../images/dashboard/calender.png";
import Card from "../../../../components/card";
import allocated from "../../../../images/dashboard/allocated.png";
import pending from "../../../../images/dashboard/pending.png";
import hold from "../../../../images/dashboard/hold.png";
import { Col, Row, Spin } from "antd";
import HeadTitle from "../../../../components/headtitle";
import holdbg from "../../.../../../../images/dashboard/holdbg.png";
import allocatedbg from "../../.../../../../images/dashboard/allocatedbg.png";
import pendingbg from "../../.../../../../images/dashboard/pendingbg.png";
import completedbg from "../../.../../../../images/dashboard/completedbg.png";
import { useSelector } from "react-redux";

const WorkFlow = () => {
  const worlFlowData = useSelector((state) => state?.workFlow?.data);
  const [openPicker, setOpenPicker] = useState(false);
  const handleOpen = () => {
    setOpenPicker(!openPicker);
  };
  const card1Data = [
    {
      id: 1,
      icon: allocated,
      title: "Allocated",
      charts: worlFlowData?.data?.response?.allocated,
      days: "Last 30 days",
      bg: allocatedbg,
    },
    {
      id: 2,
      icon: pending,
      title: "Pending",
      charts: worlFlowData?.data?.response?.pending,
      days: "Last 30 days",
      bg: pendingbg,
    },
    {
      id: 3,
      icon: hold,
      title: "Hold",
      charts: worlFlowData?.data?.response?.hold,
      days: "Last 30 days",
      bg: holdbg,
    },
    {
      id: 4,
      icon: completed,
      title: "Completed",
      charts: worlFlowData?.data?.response?.completed,
      days: "Last 30 days",
      bg: completedbg,
    },
  ];

  return (
    <div className={styles.card1}>
      <HeadTitle
        header="Last 30 days work flow "
        icon={calender}
        handleOpen={handleOpen}
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
      />
      <Card borderRadius="28px">
        {worlFlowData?.loading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin loading={worlFlowData?.loading} />
          </div>
        ) : (
          worlFlowData?.data?.response && (
            <Row className={styles.carddiv}>
              {card1Data?.map((data) => (
                <Col
                  span={10}
                  style={{
                    backgroundImage: `url(${data?.bg.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  className={styles.colData}
                >
                  <div className={styles.header}>
                    <Image src={data?.icon} className={styles.Img} />
                    <div className={styles.heading}>{data.title}</div>
                  </div>
                  <div className={styles.charts}>{`${
                    data?.charts ? data?.charts : "0"
                  }  Charts`}</div>
                  <div className={styles.days}>{data.days}</div>
                </Col>
              ))}
            </Row>
          )
        )}
      </Card>
    </div>
  );
};

export default WorkFlow;
