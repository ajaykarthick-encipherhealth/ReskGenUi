import React, { useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { Modal, Spin } from "antd";
import { SVGICON } from "../../../../jsx/constant/theme";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Image from "next/image";
import NoNotification from "../../../../images/dashboard/no-notification.png";
import spinSTYles from '../../../../styles/auth.module.css'

const Notifications = () => {
  const [openNotifications, setOpenNotification] = useState(false);
  const notificationResponse = useSelector(
    (state) => state?.notificationDatas?.notificationList
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

  const notificationData =
     notificationResponse?.data?.content?.length > 0 ? (
      notificationResponse?.data?.content?.map((info) => (
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
              {emailSplitFunction(info.userFrom.userName)} (
              {info.userFrom?.role})
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className={styles.no_notificarion_container}>
         {!notificationResponse?.loading && notificationResponse?.data?.content?.length===0 && <Image src={NoNotification} alt="" />}
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
              <Spin loading={notificationResponse?.loading} />
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
          <div
          className={spinSTYles.spinStyle}
          >
            <Spin loading={notificationResponse?.loading} />
          </div>
        ) : (
          <div className={styles.container} style={{ height: "500px" }}>
            {notificationData}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Notifications;
