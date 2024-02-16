import React, { useEffect } from "react";
import { Col, Row } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import CompletedStatus from "./completedStatus";
import DeliveryStatus from "./deliveryStatus";

import { getWorkFlow } from "../../../store/actions/adminAction/DashboardAction";

import WorkFlow from "./workflow";
import DailyTask from "./dailytask";
import Accuracy from "./accuracy";

import BarChart from "./teamChart/Index";
import SpeedoMeter from "./speedometer";
import Notifications from "./notifications";

const index = () => {
  const currentDate = dayjs();
  const router = useRouter();
  const dispatch = useDispatch();
  const DateRanges = useSelector((state) => state?.AdminDashboardReducers?.dateRange);
  const last30thDate = currentDate?.subtract(31, "day");
  const lastDateWithTime = currentDate?.endOf("day");

  const startDate = DateRanges
    ? new Date(DateRanges?.startDate).toISOString()
    : "";
  const endDate = DateRanges
    ? new Date(DateRanges?.endDate).toISOString()
    : ""



  useEffect(() => {
    dispatch(getWorkFlow(startDate, endDate, router));
  }, [startDate, endDate]);

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
          <Row className={styles.RowCon}>
            <Col span={18}>
              <Row className={styles.RowCon}>
                <Col span={15}>
                  <WorkFlow />
                </Col>
                <Col span={7} offset={1}>
                  <DailyTask />
                </Col>
              </Row>

              <Row>

              <Col span={23}>
                <Accuracy />
              </Col>

              </Row>
            </Col>
            <Col span={6}>
              <BarChart />
            </Col>
          </Row>
          <Row >
            <Col span={17} className={styles.first_column}>
              <DeliveryStatus />
            </Col>
            <Col span={6} className={styles.column1}>
              <SpeedoMeter />
            </Col>
          </Row>
          <Row >
            <Col span={17} className={styles.first_column}>
              <CompletedStatus />
            </Col>
            <Col span={6} className={styles.column1}>
              <Notifications />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default index;
