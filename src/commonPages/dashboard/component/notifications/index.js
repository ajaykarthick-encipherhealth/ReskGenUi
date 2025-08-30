import React, { useState } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import moment from "moment";
import { Col, Modal, Row, Skeleton, Spin } from "antd";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import NoNotification from "../../../../images/dashboard/no-notification.webp";
import spinSTYles from "../../../../styles/auth.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { truncateString } from "../../../../components/patientDetails/details/components/function/ReusableFunctions";
import { capitalizeFirstLetter } from "../../../../components/headerFilters/functions";

export const NotifiAvatar = () => {
  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {[80, 60, 70, 70].map((width, index) => (
        <Row
          gutter={16}
          align="top"
          style={{ marginBottom: "16px" }}
          key={index}
        >
          <Col>
            <Skeleton.Avatar active size="large" shape="circle" />
          </Col>
          <Col flex="auto">
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 2, width: `${width}%` }}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
};

const Notifications = ({
  notificationResponse,
  notificationLoading,
  webSocketNotificationData,
  useDummyData = false,
  dummyNotificationData = [],
}) => {
  const notificationResult = useDummyData
    ? dummyNotificationData
    : webSocketNotificationData
    ? webSocketNotificationData
    : notificationResponse?.data?.response?.notificationList?.content;

  const [openNotifications, setOpenNotifications] = useState(false);

  const handleOpen = () => setOpenNotifications(!openNotifications);
  const handleOk = () => setOpenNotifications(false);

  const notificationData =
    notificationResult?.length > 0 ? (
      notificationResult.map((info) => (
        <div className={styles.msgDiv} key={info?.id}>
          <div style={{ marginTop: "10px" }}>
            <FontAwesomeIcon icon={faBell} className={styles.notifyIconColor} />
          </div>
          <div className={`${styles.msgCOntainer} m-2`}>
            <span className={styles.description}>
              {truncateString(info.content, 40)}
            </span>
            <div className={styles.time}>
              {moment(info?.createdDate).format("MM-DD-YYYY")} &nbsp;
              {moment(info?.createdDate).format("hh:mm A")} &nbsp;
              {/* {`${info?.fromUserDetails?.firstName ?? ""} ${
                info?.fromUserDetails?.lastName ?? ""
              }`} */}
              {`(${capitalizeFirstLetter(
                info?.fromUserDetails?.firstName
              )} ${capitalizeFirstLetter(
                info?.fromUserDetails?.lastName
              )})`.trim()}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className={styles.no_notificarion_container}>
        {!notificationLoading && (
          <div className="my-2 d-flex align-items-center justify-content-center">
            <Image
              className={styles.img}
              src={NoNotification}
              alt="no-notification"
            />
          </div>
        )}
      </div>
    );

  return (
    <>
      <HeadTitle
        header="Rebuttal Notifications"
        anchorTag={
          notificationResponse?.data?.response?.notificationList?.content
            ?.length > 0
            ? "anchor"
            : null
        }
        handleOpen={handleOpen}
      />

      <div className={styles.card4}>
        {notificationLoading && !useDummyData ? (
          NotifiAvatar()
        ) : (
          <div className={styles.container}>{notificationData}</div>
        )}
      </div>
      <Modal
        title="Notifications"
        open={openNotifications}
        footer={null}
        width="50%"
        closable={true}
        onCancel={handleOk}
      >
        {notificationLoading && !useDummyData ? (
          <div className={spinSTYles.spinStyle}>{NotifiAvatar()}</div>
        ) : notificationResult?.length <= 0 ? (
          <div className="d-flex align-items-center justify-content-center">
            <Image
              className={styles.img}
              src={NoNotification}
              alt="no-notification"
            />
          </div>
        ) : (
          <div className={styles.container} style={{ height: "500px" }}>
            {notificationResult?.map((info) => (
              <div className={styles.msgDiv} key={info?.id}>
                <div style={{ marginTop: "10px" }}>
                  <FontAwesomeIcon
                    icon={faBell}
                    className={styles.notifyIconColor}
                  />
                </div>
                <div className={`${styles.msgCOntainer} m-2`}>
                  <span className="send_details">{info.content}</span>
                  <div className={styles.time}>
                    {moment(info?.createdDate).format("MM-DD-YYYY")} &nbsp;
                    {moment(info?.createdDate).format("hh:mm A")} &nbsp;
                    {/* {`${info?.fromUserDetails?.firstName ?? ""} ${
                      info?.fromUserDetails?.lastName ?? ""
                    }`} */}
                    {`(${capitalizeFirstLetter(
                      info?.fromUserDetails?.firstName
                    )} ${capitalizeFirstLetter(
                      info?.fromUserDetails?.lastName
                    )})`.trim()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Notifications;
