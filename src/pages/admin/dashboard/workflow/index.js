import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import completed from "../../../../images/dashboard/completed.png";
import calender from "../../../../images/dashboard/calender.png";
import Card from "../../../../components/card";
import allocated from "../../../../images/dashboard/allocation.png";

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
import pendingIcon from "../../.../../../../images/dashboard/Pending_2.png";
import declineIcon from "../../.../../../../images/dashboard/Decline.png";
import reAuditIcon from "../../.../../../../images/dashboard/ReAudit.png";
import auditHoldIcon from "../../.../../../../images/dashboard/Hold_2.png";
import completedbg from "../../.../../../../images/dashboard/completedbg.png";
import TC from "../../.../../../../images/dashboard/TC.png";
import { useRouter } from "next/router";

import auditedIcon from "../../.../../../../images/dashboard/Audit.png";
import tci from "../../.../../../../images/dashboard/tci.png";

import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getSelectedDaysCount } from "../../../../components/headerFilters/functions";
import { workStatusApiAdmin } from "../../../../services/adminServices/DashboardService";

const WorkFlow = () => {
  const currentDate = dayjs();
  const router = useRouter();
  const worlFlowData = useSelector(
    (state) => state?.AdminDashboardReducers?.data
  );

  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);

  const [dateRange, setDateRange] = useState({
    processedStatus: {
      PENDING: 0,
      COMPLETED: 0,
      HOLD: 0,
    },
    auditedStatus: {
      AUDIT_PENDING: 0,
      DECLINED: 0,
      AUDITED: 0,
      AUDITHOLD: 0,
    },
  });

  const [openPicker, setOpenPicker] = useState(false);

  const last30thDate = currentDate?.subtract(31, "day");
  const lastDateWithTime = currentDate?.endOf("day");

  const startDate = DateRanges
    ? new Date(DateRanges?.startDate).toISOString()
    : last30thDate.toISOString().split("T")[0] + "T00:00:00Z";
  const endDate = DateRanges
    ? new Date(DateRanges?.endDate).toISOString()
    : lastDateWithTime.toISOString().split("T")[0] + "T23:59:59.999Z";

  const handleOpen = () => {
    setOpenPicker(!openPicker);
  };

  const card1Data = [
    {
      id: 1,
      icon: tci,
      title: "Total charts",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.PENDING +
          dateRange.processedStatus.COMPLETED +
          dateRange.processedStatus.HOLD
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: TC,
    },
    {
      id: 2,
      icon: allocated,
      title: "Allocated",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.COMPLETED +
          dateRange.processedStatus.PENDING +
          dateRange.processedStatus.HOLD +
          dateRange.processedStatus.DECLINED
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: allocatedbg,
    },
    {
      id: 3,
      icon: pendingIcon,
      title: "Pending",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.PENDING
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: pendingbg,
    },
    {
      id: 4,
      icon: completed,
      title: "Completed",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.COMPLETED
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: completedbg,
    },
    {
      id: 5,
      icon: auditedIcon,
      title: "Audited",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.AUDITED : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditedbg,
    },
    {
      id: 6,
      icon: reAuditIcon,
      title: "Audit Pending",
      charts: dateRange.auditedStatus
        ? dateRange.auditedStatus.AUDIT_PENDING
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: reAuditbg,
    },
    {
      id: 7,
      icon: auditHoldIcon,
      title: "Audit Hold",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.AUDITHOLD : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditHold,
    },
    {
      id: 8,
      icon: declineIcon,
      title: "Declined",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.DECLINED
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditDecliendbg,
    },
  ];

  const getWorkFlowDatas = async () => {
    try {
      const data = await workStatusApiAdmin();
      setDateRange(data.response);
    } catch (error) {
      console.log(error);
    }
  };
  const getWorkFlow = async () => {
    try {
      const data = await workStatusApiAdmin(startDate, endDate, router);
      setDateRange(data.response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWorkFlow();
  }, [startDate, endDate, router]);

  return (
    <div className={styles.card1} style={{ height: "75%" }}>
      <HeadTitle
        header={
          !DateRanges || DateRanges?.clear
            ? `Overall Workflow`
            : `${dayjs(startDate)?.format("MM-DD-YYYY")} - ${dayjs(endDate)
                .subtract(1, "day")
                .format("MM-DD-YYYY")} (Workflow)`
        }
        icon={calender}
        handleOpen={handleOpen}
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
      />
      <Card borderRadius="28px" style={{ height: "75%" }}>
        {worlFlowData?.loading ? (
          <div className={spinSTYles.spinStyle}>
            <Spin loading={worlFlowData?.loading} />
          </div>
        ) : worlFlowData?.data?.response ? (
          <Row className={styles.carddiv} style={{ height: "80%" }}>
            {card1Data?.map((data) => (
              <Col
                span={5}
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
                {/* <div className={styles.days}>{data.days}</div> */}
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
