import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
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
import { actions as supervisorAction } from "../../../stores/supervisor/dashboard";

const Index = ({ getAllWorkFlow }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);

  const currentDate = new Date();

  const threeDaysAgo = new Date(currentDate);
  threeDaysAgo.setDate(currentDate.getDate() - 2);

  const endOfToday = new Date(currentDate);
  endOfToday.setHours(23, 59, 59, 999);

  const startDate = DateRanges
    ? new Date(DateRanges.startDate).toISOString()
    : threeDaysAgo.toISOString().split("T")[0] + "T00:00:00Z";

  const endDate = DateRanges
    ? new Date(DateRanges.endDate).toISOString()
    : endOfToday.toISOString().split("T")[0] + "T23:59:59.999Z";

  useEffect(() => {
    getAllWorkFlow({ startDate, endDate });
  }, [startDate, endDate]);

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />

      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
          <Row className={styles.RowCon} gutter={8}>
            <Col span={7} className={styles.column1}>
              <WorkFlow getAllWorkFlow={getAllWorkFlow} />
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
          <Row className={styles.lastRow}></Row>
        </div>
      </div>
    </div>
  );
};

const connector = connect(() => ({}), {
  getAllWorkFlow: supervisorAction.supervisorWorkFlowAction,
});
export default connector(Index);
