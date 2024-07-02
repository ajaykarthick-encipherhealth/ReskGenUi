import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { Col, Empty, Row, Spin } from "antd";
import { useRouter } from "next/router";
import completed from "../../../../images/trackingImages/CompletedTrack.png";
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
import pendingIcon from "../../.../../../../images/trackingImages/PendingTrack.png";
import declineIcon from "../../.../../../../images/trackingImages/DeclineTrack.png";
import reAuditIcon from "../../.../../../../images/trackingImages/AuditPending.png";
import auditHoldIcon from "../../.../../../../images/trackingImages/AuditHoldTrack.png";
import completedbg from "../../.../../../../images/dashboard/completedbg.png";
import TC from "../../.../../../../images/dashboard/TC.png";
import auditedIcon from "../../.../../../../images/trackingImages/AuditedTrack.png";
import tci from "../../.../../../../images/dashboard/tci.png";
import { getSelectedDaysCount } from "../../../../components/headerFilters/functions";
import { workStatusApiAdmin } from "../../../../services/adminServices/DashboardService";
import Hold from "../../.../../../../images/trackingImages/HoldTrack.png";
import HoldBg from "../../.../../../../images/dashboard/holdbg.png";
import AuditedDecline from "../../.../../../../images/trackingImages/AuditDeclined.png";

const WorkFlow = () => {
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
  const [chartValue, setChartValue] = useState({
    totalAuditedAssigned: 0,
    totalPatients: 0,
    totalPatientsAllocated: 0,
  });

  const [openPicker, setOpenPicker] = useState(false);

  const startDate = DateRanges?.startDate
    ? new Date(DateRanges?.startDate).toISOString()
    : "";
  const endDate = DateRanges?.endDate
    ? new Date(DateRanges?.endDate).toISOString()
    : "";

  const handleOpen = () => {
    setOpenPicker(!openPicker);
  };

  const card1Data = [
    // {
    //   id: 1,
    //   icon: tci,
    //   title: "Total charts",
    //   charts: chartValue.totalPatients ? chartValue.totalPatients : "0",
    //   days: `${
    //     DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
    //   } days`,
    //   bg: TC,
    // },
    {
      id: 2,
      icon: allocated,
      title: "Allocated",
      charts: chartValue.totalPatientsAllocated
        ? chartValue.totalPatientsAllocated
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: allocatedbg,
    },

    {
      id: 3,
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
      id: 4,
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
    // {
    //   id: 5,
    //   icon: Hold,
    //   title: "Hold",
    //   charts: dateRange.processedStatus ? dateRange.processedStatus.HOLD : "0",
    //   days: `${
    //     DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
    //   } days`,
    //   bg: HoldBg,
    // },
    {
      id: 5,
      icon: declineIcon,
      title: "Declined",
      charts: dateRange.processedStatus
        ? dateRange.processedStatus.DECLINED
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: TC,
    },
    {
      id: 6,
      icon: auditedIcon,
      title: "Audited",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.AUDITED : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditedbg,
    },
    {
      id: 7,
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
      id: 8,
      icon: auditHoldIcon,
      title: "Audit Hold",
      charts: dateRange.auditedStatus ? dateRange.auditedStatus.AUDITHOLD : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditHold,
    },

    {
      id: 9,
      icon: AuditedDecline,
      title: "Audit Declined",
      charts: dateRange.auditedStatus
        ? dateRange.auditedStatus.AUDIT_DECLINED
        : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: auditDecliendbg,
    },
  ];
  const card2Data = [
    {
      id: 1,
      icon: tci,
      title: "Total charts",
      charts: chartValue.totalPatients ? chartValue.totalPatients : "0",
      days: `${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: TC,
    },
  ];

  const getWorkFlow = async () => {
    try {
      const data = await workStatusApiTenantAdmin(startDate, endDate, router);
      setDateRange(data.response?.processedStatusCount);
      setChartValue(data.response);
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
        isAdmin={true}
      />
      <Card borderRadius="28px" style={{ width: "100%", height: "75%" }}>
        {worlFlowData?.loading ? (
          <div className={spinSTYles.spinStyle}>
            <Spin loading={worlFlowData?.loading} />
          </div>
        ) : worlFlowData?.data?.response ? (
          <Row
            className={styles.carddiv}
            style={{ width: "100%", height: "100%" }}
          >
            <Col span={4}>
              <Row style={{ width: "100%", height: "100%" }}>
                {card2Data?.map((data) => (
                  <>
                    <Col
                      span={22}
                      style={{
                        backgroundImage: `url(${data?.bg.src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        height: "90%",
                        width: "100%",
                      }}
                      className={styles.colData}
                    >
                      <div className={styles.totalChartDiv}>
                        <div className={styles.header}>
                          <Image src={data?.icon} className={styles.Img} />
                          <div className={styles.heading}>{data.title}</div>
                        </div>
                        <div
                          className={styles.charts}
                          style={{ marginTop: "30px" }}
                        >{`${data?.charts ? data?.charts : "0"} Charts`}</div>
                      </div>

                      {/* <div className={styles.days}>{data.days}</div> */}
                    </Col>
                  </>
                ))}
              </Row>
            </Col>
            <Col span={20} style={{ height: "100%" }}>
              <Row className={styles.rowDiv}>
                {card1Data?.map((data) => (
                  <>
                    <Col
                      span={5}
                      style={{
                        backgroundImage: `url(${data?.bg.src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                      className={styles.colData}
                    >
                      <div className={styles.subCardDiv}>
                        <div className={styles.header}>
                          <Image src={data?.icon} className={styles.Img} />
                          <div className={styles.heading}>{data.title}</div>
                        </div>
                        <div className={styles.charts}>{`${
                          data?.charts ? data?.charts : "0"
                        }  Charts`}</div>
                      </div>
                      {/* <div className={styles.days}>{data.days}</div> */}
                    </Col>
                  </>
                ))}
              </Row>
            </Col>
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
