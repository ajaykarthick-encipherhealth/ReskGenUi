import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Col, Empty, Row, Spin } from "antd";
import styles from "./styles.module.css";
import calender from "../../../../images/dashboard/calender.png";
import Card from "../../../../components/card";
import allocated from "../../../../images/dashboard/allocation.png";
import HeadTitle from "../../../../components/headtitle";
import allocatedbg from "../../.../../../../images/dashboard/allocatedbg.png";
import reAuditbg from "../../.../../../../images/dashboard/reAuditbg.png";
import auditedbg from "../../.../../../../images/dashboard/auditedbg.png";
import auditHold from "../../.../../../../images/dashboard/auditHold.png";
import pendingbg from "../../.../../../../images/dashboard/pendingbg.png";
import auditDecliendbg from "../../.../../../../images/dashboard/auditDeclinedbg.png";
import spinSTYles from "../../../../styles/auth.module.css";
import pendingIcon from "../../.../../../../images/trackingImages/AuditPending.png";
import declineIcon from "../../.../../../../images/trackingImages/AuditDeclined.png";
import reAuditIcon from "../../.../../../../images/trackingImages/reAuditTrack.png";
import auditHoldIcon from "../../.../../../../images/trackingImages/AuditHoldTrack.png";
import auditedIcon from "../../.../../../../images/trackingImages/AuditedTrack.png";
import { getSelectedDaysCount } from "../../../../components/headerFilters/functions";

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
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: allocatedbg,
    },
    {
      id: 2,
      icon: auditedIcon,
      title: "Audited",
      charts: worlFlowData?.data?.response?.audited,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditedbg,
    },
    {
      id: 3,
      icon: reAuditIcon,
      title: "Re Audit",
      charts: worlFlowData?.data?.response?.reAudited,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: reAuditbg,
    },
    {
      id: 4,
      icon: auditHoldIcon,
      title: "Audit Hold",
      charts: worlFlowData?.data?.response?.auditHold,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditHold,
    },
    {
      id: 5,
      icon: pendingIcon,
      title: "Audit Pending",
      charts: worlFlowData?.data?.response?.auditPending,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: pendingbg,
    },
    {
      id: 6,
      icon: declineIcon,
      title: "Audit Declined",
      charts: worlFlowData?.data?.response?.auditDecliend,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditDecliendbg,
    },
  ];

  return (
    <div className={styles.card1}>
      <HeadTitle
        header={
          !DateRanges || DateRanges?.clear
            ? `Last 3 days work flow`
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
