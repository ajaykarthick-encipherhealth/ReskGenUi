import React, { useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import { Col, Row } from "antd";
import WorkFlow from "./workflow";
import DailyTask from "./dailytask";
import Accuracy from "./accuracy";
import Notifications from "./notifications";
import CompletedStatus from "./completedstatus";
import HoldStatus from "./holdstatus";
import { getWorkFlow } from "../../../store/actions/DashboardActions";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Footer from "../../../jsx/layouts/Footer";

const index = () => {
  const currentDate = dayjs();
  const last30thDate = currentDate.subtract(31, "day");

  const lastDateWithTime = currentDate.endOf("day").toISOString();
  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);
  const dispatch = useDispatch();

  const startDate = DateRanges
    ? DateRanges?.startDate
    : last30thDate.toISOString();
  const lastDate = DateRanges ? DateRanges?.endDate : lastDateWithTime;
  const router = useRouter();
  useEffect(() => {
    dispatch(getWorkFlow(startDate, lastDate, router));
  }, [startDate, lastDate]);

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
            <Footer />
          </Row>
        </div>
      </div>
    </div>
  );
};

export default index;
