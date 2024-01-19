import React, { useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { Modal } from "antd";
import { SVGICON } from "../../../../jsx/constant/theme";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Image from "next/image";
import NoNotification from "../../../../images/dashboard/no-notification.png";

const Notifications = () => {
  const [openNotifications, setOpenNotification] = useState(false);
  const notificationResponse = useSelector(
    (state) => state?.notificationDatas?.notificationList.content
  );

  const handleOpen = () => {
    setOpenNotification(!openNotifications);
  };
  const handleOk = () => {
    setOpenNotification(false);
  };

  const emailSplitFunction = (email) => {
    let emailSplit = email.split("@");
    return capitalizeFirstLetter(emailSplit[0]);
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const notificationData = notificationResponse?.length>0 ? (
    notificationResponse?.map((info) => (
      <div className={styles.msgDiv}>
        <div style={{ marginTop: "10px" }}>
          {" "}
          {SVGICON.dashboardNotification}
        </div>
        <div className={styles.msgCOntainer}>
          <span className={styles.description}>{info.content}</span>
          <div className={styles.time}>
            {moment(info.createdAt).format("MM-DD-YYYY")}&nbsp;{" "}
            {moment(info.createdAt).format("hh:mm:A")} &nbsp;{" "}
            {emailSplitFunction(info.userFrom.userName)} ({info.userFrom?.role})
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className={styles.no_notificarion_container}>
      <Image src={NoNotification} alt="" />
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
          {notificationResponse?.length != 0 ? (
            <div className={styles.container}>{notificationData}</div>
          ) : (
            <div className={styles.no_notificarion_container}>
              <Image src={NoNotification} alt="" />
            </div>
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
        <div className={styles.container} style={{ height: "500px" }}>
          {notificationData}
        </div>
      </Modal>
    </>
  );
};

export default Notifications;
