import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Col, Empty, Row, Skeleton, Spin } from "antd";
import styles from "./styles.module.css";
import Card from "../../../../components/card";
import HeadTitle from "../../../../components/headtitle";
import allocatedbg from "../../.../../../../images/dashboard/allocatedbg.webp";
import reAuditbg from "../../.../../../../images/dashboard/reauditbg.webp";
import auditedbg from "../../.../../../../images/dashboard/auditedbg.webp";
import auditHold from "../../.../../../../images/dashboard/auditHoldbg.webp";
import pendingbg from "../../.../../../../images/dashboard/pendingbg.webp";
import auditDecliendbg from "../../.../../../../images/dashboard/declinedbg.webp";
import spinSTYles from "../../../../styles/auth.module.css";
import { getSelectedDaysCount } from "../../../../components/headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faFileCircleCheck,
  faFileCircleExclamation,
  faCirclePause,
  faCircleXmark,
  faUsers,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/supervisor/dashboard";

const WorkFlow = ({ worlFlowData, DateRanges }) => {
  const currentDate = dayjs();
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
      icon: <FontAwesomeIcon icon={faUsers} />,
      title: "Allocated",
      charts: worlFlowData?.data?.response?.auditAllocated,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: allocatedbg,
    },
    {
      id: 2,
      icon: <FontAwesomeIcon icon={faFileCircleCheck} />,
      title: "Audited",
      charts: worlFlowData?.data?.response?.audited,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: auditedbg,
    },
    {
      id: 3,
      icon: <FontAwesomeIcon icon={faFileCircleExclamation} />,
      title: "Re Audit",
      charts: worlFlowData?.data?.response?.reAudited,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: reAuditbg,
    },
    {
      id: 4,
      icon: <FontAwesomeIcon icon={faCirclePause} />,
      title: "Audit Hold",
      charts: worlFlowData?.data?.response?.auditHold,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: auditHold,
    },
    {
      id: 5,
      icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
      title: "Audit Pending",
      charts: worlFlowData?.data?.response?.auditPending,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: pendingbg,
    },
    {
      id: 6,
      icon: <FontAwesomeIcon icon={faCircleXmark} />,
      title: "Audit Declined",
      charts: worlFlowData?.data?.response?.auditDeclined,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: auditDecliendbg,
    },
  ];
  const renderCardSkeleton = () => (
    <Row className={styles.carddiv}>
      {Array.from({ length: 3 }).map((_, index) => (
        <>
          <Col
            key={index}
            span={9}
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "10px",
              width: "150px",
              height: "100px",
            }}
          >
            <Skeleton.Avatar
              size={30}
              style={{
                marginBottom: "16px",
                borderRadius: "50%",
              }}
            />
            <Skeleton active title={{ width: "70%" }} paragraph={{ rows: 0 }} />
          </Col>
          <Col
            key={index}
            span={9}
            style={{
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "10px",
              width: "150px",
              height: "100px",
            }}
          >
            <Skeleton.Avatar
              size={30}
              style={{
                marginBottom: "16px",
                borderRadius: "50%",
              }}
            />
            <Skeleton active title={{ width: "70%" }} paragraph={{ rows: 0 }} />
          </Col>
        </>
      ))}
    </Row>
  );
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
        icon={<FontAwesomeIcon icon={faCalendar} />}
        handleOpen={handleOpen}
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
      />
      <Card borderRadius="28px">
        {worlFlowData?.loading ? (
          renderCardSkeleton()
        ) : worlFlowData?.data?.response ? (
          <Row className={styles.carddiv}>
            {card1Data?.map((data) => (
              <Col
                span={9}
                style={{
                  backgroundImage: `url(${data?.bg.src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className={styles.colData}
              >
                <div className={styles.header}>
                  <div>{data.icon}</div>
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

const connector = connect(
  (state) => ({
    worlFlowData: state?.supervisor?.dashboard?.workFlow,
    loader: state.admin?.workqueue?.patientsLoading,
    DateRanges: state?.admin?.dashboard?.dateRanges,
  }),
  {}
);
export default connector(WorkFlow);
