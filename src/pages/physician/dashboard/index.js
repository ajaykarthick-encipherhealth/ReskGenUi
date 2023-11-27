import React from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import { Col, Row } from "antd";
import WorkFlow from "./workflow";
import DailyTask from "./dailytask";
import Accuracy from "./accuracy";
import Notifications from "./notifications";
import CompletedStatus from "./completedstatus";
import HoldStatus from "./holdstatus";

const index = () => {
  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
          <Row className={styles.RowCon}>
            <Col span={5}>
              <WorkFlow />
            </Col>
            <Col span={18} offset={1}>
              <DailyTask />
            </Col>
          </Row>
          <Row className={styles.RowCon}>
            <Col span={14}>
              <Accuracy />
            </Col>
            <Col span={9} offset={1}>
              <Notifications />
            </Col>
          </Row>
          <Row className={styles.RowCon}>
            <Col span={14}>
              <CompletedStatus />
            </Col>
            <Col span={9} offset={1}>
              <HoldStatus />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default index;
