import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Col, Row } from "antd";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import WorkFlow from "./workflow";
import DailyTask from "./dailytask";
import Accuracy from "./accuracy";
import Notifications from "./notifications";
import CompletedStatus from "./completedstatus";
import HoldStatus from "./holdstatus";
import { getWorkFlow } from "../../../store/actions/l2Action/DashboardAction";

const Index = () => {
  const currentDate = dayjs();
  const router = useRouter();
  const dispatch = useDispatch();
  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);

  const last30thDate = currentDate?.subtract(31, "day");
  const lastDateWithTime = currentDate?.endOf("day")

  const startDate = DateRanges
    ? new Date(DateRanges?.startDate).toISOString()
    : last30thDate.toISOString().split("T")[0] + "T00:00:00Z";
  const endDate = DateRanges
    ? new Date(DateRanges?.endDate).toISOString()
    : lastDateWithTime.toISOString().split("T")[0] + "T23:59:59.999Z";

  useEffect(() => {
    dispatch(getWorkFlow(startDate, endDate, router));
  }, [startDate, endDate]);

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />

      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
          <Row className={styles.RowCon} gutter={8}>
            <Col span={7} className={styles.column1}>
              <WorkFlow />
            </Col>
            <Col span={18} offset={1} className={styles.first_column}>
              <DailyTask />
            </Col>
          </Row>
          <Row className={styles.RowCon}>
            <Col span={14} className={styles.column2}>
              <Accuracy />
            </Col>
            <Col span={9} offset={1} className={styles.columns}>
              <Notifications />
            </Col>
          </Row>
          <Row className={styles.RowCon}>
            <Col span={14} className={styles.column2}>
              <CompletedStatus />
            </Col>
            <Col span={9} offset={1} className={styles.columns}>
              <HoldStatus />
            </Col>
          </Row>
          <Row className={styles.lastRow}>
          
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Index;
