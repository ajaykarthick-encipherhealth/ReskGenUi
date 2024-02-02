import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import completed from "../../../../images/dashboard/completed.png";
import calender from "../../../../images/dashboard/calender.png";
import Card from "../../../../components/card";
import allocated from "../../../../images/dashboard/allocated.png";
import pending from "../../../../images/dashboard/pending.png";
import hold from "../../../../images/dashboard/hold.png";
import { Col, Empty, Row, Spin } from "antd";
import HeadTitle from "../../../../components/headtitle";
import holdbg from "../../.../../../../images/dashboard/holdbg.png";
import allocatedbg from "../../.../../../../images/dashboard/allocatedbg.png";
import reAuditbg from "../../.../../../../images/dashboard/reAuditbg.png";
import auditedbg from "../../.../../../../images/dashboard/auditedbg.png";
import auditHold from "../../.../../../../images/dashboard/auditHold.png";
import pendingbg from "../../.../../../../images/dashboard/pendingbg.png";
import auditDecliendbg from "../../.../../../../images/dashboard/auditDeclinedbg.png";
import spinSTYles from "../../../../styles/auth.module.css";
import pendingIcon from "../../.../../../../images/dashboard/pendingIcon.png";
import declineIcon from "../../.../../../../images/dashboard/declineIcon.png";
import reAuditIcon from "../../.../../../../images/dashboard/reAuditIcon.png";
import auditHoldIcon from "../../.../../../../images/dashboard/auditHoldIcon.png";
import auditedIcon from "../../.../../../../images/dashboard/auditedHold.png";

import { useSelector } from "react-redux";
import dayjs from "dayjs";

const WorkFlow = () => {
  const currentDate = dayjs();
  const worlFlowData = useSelector((state) => state?.l2Dashboard?.data);
  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);
  const [openPicker, setOpenPicker] = useState(false);

  const last30thDate = currentDate?.subtract(31, "day");
  const lastDateWithTime = currentDate?.endOf("day");

  const startDate = DateRanges
    ? new Date(DateRanges?.startDate).toISOString()
    : last30thDate.toISOString().split("T")[0];
  const endDate = DateRanges
    ? new Date(DateRanges?.endDate).toISOString()
    : lastDateWithTime.toISOString().split("T")[0];

  const handleOpen = () => {
    setOpenPicker(!openPicker);
  };
  const card1Data = [
    {
      id: 1,
      icon: allocated,
      title: "Allocated",
      charts: worlFlowData?.data?.response?.auditAllocated,
      days: "Last 30 days",
      bg: allocatedbg,
    },
    {
      id: 2,
      icon: auditedIcon,
      title: "Audited",
      charts: worlFlowData?.data?.response?.audited,
      days: "Last 30 days",
      bg: auditedbg,
    },
    {
      id: 3,
      icon: reAuditIcon,
      title: "Re Audit",
      charts: worlFlowData?.data?.response?.reAudited,
      days: "Last 30 days",
      bg: reAuditbg,
    },
    {
      id: 4,
      icon: auditHoldIcon,
      title: "Audit Hold",
      charts: worlFlowData?.data?.response?.auditHold,
      days: "Last 30 days",
      bg: auditHold,
    },
    {
      id: 5,
      icon: pendingIcon,
      title: "Pending",
      charts: worlFlowData?.data?.response?.auditPending,
      days: "Last 30 days",
      bg: pendingbg,
    },
    {
      id: 6,
      icon: declineIcon,
      title: "Declined",
      charts: worlFlowData?.data?.response?.auditDecliend,
      days: "Last 30 days",
      bg: auditDecliendbg,
    },
  ];

  return (
    <div className={styles.card1}>
      <HeadTitle
        header={
          !DateRanges || DateRanges?.clear
            ? `Last 30 days work flow`
            : `${dayjs(startDate)?.format("MM-DD-YYYY")} - ${dayjs(endDate)
                .subtract(1, "day")
                .format("MM-DD-YYYY")}`
        }
        icon={calender}
        handleOpen={handleOpen}
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
      />
      <Card borderRadius="28px">
        {worlFlowData?.loading ? (
          <div className={spinSTYles.spinStyle}>
            <Spin loading={worlFlowData?.loading} />
          </div>
        ) : worlFlowData?.data?.response ? (
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
        ) : (
          <div className={spinSTYles.spinStyle}>
            <Empty />
          </div>
        )}
      </Card>
    </div>
  );
};

export default WorkFlow;
