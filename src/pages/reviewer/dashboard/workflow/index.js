import React, { useState } from "react";
import styles from "./styles.module.css";
import dayjs from "dayjs";
import Image from "next/image";
import completed from "../../../../images/trackingImages/CompletedTrack.png";
import calender from "../../../../images/dashboard/calender.png";
import Card from "../../../../components/card";
import allocated from "../../../../images/dashboard/allocated.png";
import pending from "../../../../images/trackingImages/PendingTrack.png";
import hold from "../../../../images/dashboard/HoldTrack.png";
import { Col, Empty, Row, Spin } from "antd";
import HeadTitle from "../../../../components/headtitle";
import holdbg from "../../.../../../../images/dashboard/holdbg.png";
import allocatedbg from "../../.../../../../images/dashboard/allocatedbg.png";
import pendingbg from "../../.../../../../images/dashboard/pendingbg.png";
import completedbg from "../../.../../../../images/dashboard/completedbg.png";
import { useSelector, connect } from "react-redux";
import spinSTYles from "../../../../styles/auth.module.css";
import { getSelectedDaysCount } from "../../../../components/headerFilters/functions";

const WorkFlow = ({ worlFlowData }) => {
  const currentDate = dayjs();
  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);
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
      icon: allocated,
      title: "Allocated",
      charts: worlFlowData?.data?.response?.allocated,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: allocatedbg,
    },
    {
      id: 2,
      icon: pending,
      title: "Pending",
      charts: worlFlowData?.data?.response?.pending,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: pendingbg,
    },
    {
      id: 3,
      icon: hold,
      title: "Hold",
      charts: worlFlowData?.data?.response?.hold,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: holdbg,
    },
    {
      id: 4,
      icon: completed,
      title: "Completed",
      charts: worlFlowData?.data?.response?.completed,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 30
      } days`,
      bg: completedbg,
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
        {worlFlowData?.loading && (
          <div className={spinSTYles.spinStyle}>
            <Spin loading={worlFlowData?.loading} />
          </div>
        )}
        {!worlFlowData?.loading && worlFlowData?.data?.response ? (
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
          !worlFlowData?.loading && (
            <div className={spinSTYles.spinStyle}>
              <Empty />
            </div>
          )
        )}
      </Card>
    </div>
  );
};
const enhancer = connect((state) => ({
  worlFlowData: state?.reviewer?.dashboard?.workFlow,
}));
export default enhancer(WorkFlow);
