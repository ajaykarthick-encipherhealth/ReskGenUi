import React, { useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { Modal } from "antd";
import {  SVGICON } from "../../../../jsx/constant/theme";

const Notifications = () => {
  const [openNotifications, setOpenNotification] = useState(false);
   const notificationdata = [
    {
      key: "1",
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
      date: "18/10/2023",
      time: "10:00 am",
      person: "Rahul(manager)",
    },
    {
      key: "2",
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
      date: "18/10/2023",
      time: "10:00 am",
      person: "Rahul(manager)",
    },
    {
      key: "3",
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
      date: "18/10/2023",
      time: "10:00 am",
      person: "Rahul(manager)",
    },
    {
      key: "4",
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
      date: "18/10/2023",
      time: "10:00 am",
      person: "Rahul(manager)",
    },
    {
      key: "3",
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
      date: "18/10/2023",
      time: "10:00 am",
      person: "Rahul(manager)",
    },
    {
      key: "4",
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
      date: "18/10/2023",
      time: "10:00 am",
      person: "Rahul(manager)",
    },
  ];
  const handleOpen = () => {
    setOpenNotification(!openNotifications);
  };
  const handleOk = () => {
    setOpenNotification(false);
  };
  const notificationData = notificationdata.map((info) => (
      <div className={styles.msgDiv}>
       <div style={{marginTop:"10px"}}> {SVGICON.dashboardNotification}</div>
        <div className={styles.msgCOntainer}>
          <span className={styles.description}>{info.message}</span>
          <div>
            {info.date}&nbsp;.{info.time} &nbsp;.{info.person}
          </div>
        </div>
      </div>
    )
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
        <div  className={styles.container}>
          {notificationData}
          </div>
        </Card>
      </div>
      <Modal
        title="Notifications"
        open={openNotifications}
        footer={null}
        width="50%"
        height="400px"
        closable={true}
        onCancel={handleOk}
      >
        {notificationData}
      </Modal>
    </>
  );
};


export default Notifications;
