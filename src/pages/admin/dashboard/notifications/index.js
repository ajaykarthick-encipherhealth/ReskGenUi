import React, { useState } from "react";
import styles from "./styles.module.css";
import { connect, useSelector } from "react-redux";
import moment from "moment";
import Image from "next/image";
import { Col, Modal, Row, Skeleton, Spin } from "antd";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { SVGICON } from "../../../../jsx/constant/theme";
import NoNotification from "../../../../images/dashboard/no-notification.png";
import spinSTYles from "../../../../styles/auth.module.css";


export const NotifiAvatar = () => {
  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
    <Row gutter={16} align="top" style={{ marginBottom: '16px' }}>
      <Col>
        <Skeleton.Avatar active size="large" shape="circle" />
      </Col>
      <Col flex="auto">
        <Skeleton active title={false} paragraph={{ rows: 2, width: '80%' }} />
      </Col>
    </Row>
    <Row gutter={16} align="top" style={{ marginBottom: '16px' }}>
      <Col>
        <Skeleton.Avatar active size="large" shape="circle" />
      </Col>
      <Col flex="auto">
        <Skeleton active title={false} paragraph={{ rows: 2, width: '60%' }} />
      </Col>
    </Row>
    <Row gutter={16} align="top" style={{ marginBottom: '16px' }}>
      <Col>
        <Skeleton.Avatar active size="large" shape="circle" />
      </Col>
      <Col flex="auto">
        <Skeleton active title={false} paragraph={{ rows: 2, width: '70%' }} />
      </Col>
    </Row>
    <Row gutter={16} align="top" style={{ marginBottom: '16px' }}>
      <Col>
        <Skeleton.Avatar active size="large" shape="circle" />
      </Col>
      <Col flex="auto">
        <Skeleton active title={false} paragraph={{ rows: 2, width: '70%' }} />
      </Col>
    </Row>
  </div>
  );
};
const Notifications = ({ notificationResponse, webSocketNotificationData }) => {
  const notificationResult = webSocketNotificationData
    ? webSocketNotificationData
    : notificationResponse?.data?.response?.notificationList?.content;
  const [openNotifications, setOpenNotifications] = useState(false);
  const handleOpen = () => {
    setOpenNotifications(!openNotifications);
  };
  const handleOk = () => {
    setOpenNotifications(false);
  };

  const notificationData =
    notificationResult?.length > 0 ? (
      notificationResult?.map((info) => (
        <div className={styles.msgDiv} key={info?.id}>
          <div style={{ marginTop: "10px" }}>
            {" "}
            {SVGICON.dashboardNotification}
          </div>
          <div className={styles.msgCOntainer}>
            <span className={styles.description}>{info.content}</span>
            <div className={styles.time}>
              {moment(info?.createdDate).format("MM-DD-YYYY")}&nbsp;{" "}
              {moment(info?.createdDate).format("hh:mm:A")} &nbsp;{" "}
              {`${
                info?.fromUserDetails?.firstName
                  ? info?.fromUserDetails?.firstName
                  : ""
              } (${
                info?.fromUserDetails?.role ? info?.fromUserDetails?.role : ""
              })`}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className={styles.no_notificarion_container}>
        {!notificationResponse?.loading &&
          (!notificationResponse?.data?.response?.notificationList?.content ||
            notificationResponse?.data?.response?.notificationList?.content
              ?.length === 0) && <Image src={NoNotification} alt="" />}
      </div>
    );


  return (
    <>
      <HeadTitle
        header="Notifications"
        anchorTag="anchor"
        handleOpen={handleOpen}
      />

      <div className={styles.card4}>
        <Card borderRadius="28px" padding="20px">
          {notificationResponse?.loading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {NotifiAvatar()}
            </div>
          ) : (
            <div className={styles.container}>{notificationData}</div>
          )}
        </Card>
      </div>
      <Modal
        title="Notifications"
        open={openNotifications}
        footer={null}
        width="50%"
        style={{ height: "400px !important" }}
        closable={true}
        onCancel={handleOk}
      >
        {notificationResponse?.loading ? (
          <div className={spinSTYles.spinStyle}>{NotifiAvatar()}</div>
        ) : (
          <div className={styles.container} style={{ height: "500px" }}>
            {notificationData}
          </div>
        )}
      </Modal>
    </>
  );
};
const enhancer = connect((state) => ({
  notificationResponse: state?.reviewer?.dashboard?.notification,
  webSocketNotificationData:
    state?.webSocket?.webSocketNotificationDetails?.data,
}));
export default enhancer(Notifications);
