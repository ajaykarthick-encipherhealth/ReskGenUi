import React, { useState } from "react";
import styles from "./styles.module.css";
import dayjs from "dayjs";
import Card from "../../../../components/card";
import { Col, Empty, Row, Skeleton, Spin } from "antd";
import HeadTitle from "../../../../components/headtitle";
import allocatedbg from "../../.../../../../images/dashboard/allocatedbg.webp";
import pendingbg from "../../.../../../../images/dashboard/pendingbg.webp";
import completedbg from "../../.../../../../images/dashboard/completedbg.webp";
import { connect } from "react-redux";
import spinSTYles from "../../../../styles/auth.module.css";
import { getSelectedDaysCount } from "../../../../components/headerFilters/functions";
import declinedBg from "../../.../../../../images/dashboard/declinedbg.webp";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
 import { faCalendar, faCircleCheck ,faClockRotateLeft,faUsers} from "@fortawesome/free-solid-svg-icons";

const WorkFlow = ({ worlFlowData ,DateRanges,workFlowLoader}) => {
  const currentDate = dayjs();
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
      icon:<FontAwesomeIcon icon={faUsers} /> ,
      title: "Allocated",
      charts: worlFlowData?.data?.response?.allocated,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: allocatedbg,
    },
    {
      id: 2,
      icon:<FontAwesomeIcon icon={faCircleCheck} />,
      title: "Completed",
      charts: worlFlowData?.data?.response?.completed,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: completedbg,
    },
    {
      id: 3,
      icon:  <FontAwesomeIcon icon={faClockRotateLeft} />,
      title: "Pending",
      charts: worlFlowData?.data?.response?.pending,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: pendingbg,
    },
    {
      id: 4,
      icon:  <FontAwesomeIcon icon={faClockRotateLeft} />,
      title: "Declined",
      charts: worlFlowData?.data?.response?.declined,
      days: `Last ${
        DateRanges && !DateRanges?.clear ? getSelectedDaysCount(DateRanges) : 3
      } days`,
      bg: declinedBg,
    },
   
  ];
  const renderCardSkeleton = () => (
    <Row className={styles.carddiv}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Col
          key={index}
          span={10}
          style={{
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}
          className={styles.colData}
        >
          <Skeleton.Avatar
            size={30} 
            style={{
              marginBottom: '16px',
              borderRadius: '50%', 
            }}
          />
          <Skeleton active title={{ width: '70%' }} paragraph={{ rows: 1 }} />
        </Col>
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
        defaultDateRange={DateRanges}
      />
      <Card borderRadius="28px">
        {workFlowLoader ? (
          renderCardSkeleton()
        ) : worlFlowData?.data?.response ? (
          <Row className={styles.carddiv}>
            {card1Data?.map((data) => (
              <Col
                key={data?.id}
                span={9}
                style={{
                  backgroundImage: `url(${data?.bg.src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className={styles.colData}
              >
                <div className={styles.header}>
                  <div className="mt-1">{data?.icon}</div>
                  {/* <Image src={data?.icon} className={styles.Img} /> */}
                  <div className={styles.heading}>{data.title}</div>
                </div>
                <div className={styles.charts}>{`${
                  data?.charts ? data?.charts : "0"
                } Charts`}</div>
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
  workFlowLoader:state?.reviewer?.dashboard?.workFlowLoader,
  DateRanges:state?.admin?.dashboard?.dateRanges,
}));
 export default enhancer(WorkFlow);
