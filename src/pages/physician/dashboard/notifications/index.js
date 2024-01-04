import React, { useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { Modal } from "antd";
import { SVGICON } from "../../../../jsx/constant/theme";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";


const Notifications = () => {
  const [openNotifications, setOpenNotification] = useState(false);
  const notificationResponse = useSelector(
    (state) => state?.notificationDatas?.notificationList
  );
  const notificationdata = [
    {
      key: "1",
      message:
        "Needs to validate surgical history for any amputation status and PE for laterality of diagnosis (ulcer, paralysis, atherosclerosis of LE, etc.). ",
      date: "12/15/2023",
      time: "10:36 am",
      person: "Hendry(manager)",
    },
    {
      key: "2",
      message:
        " We need minimal support (stable, continue X medication with dosage, is acceptable) for the diagnosis found in the assessment plan to confirm the diagnosis; if support is not sufficient, query the diagnosis.",
      date: "12/14/2023",
      time: "08:20 am",
      person: "Hendry(manager)",
    },
    {
      key: "3",
      message: "We should give priority to the more specific diagnosis ",
      date: "12/13/2023",
      time: "12:35 pm",
      person: "Hendry(manager)",
    },
    // {
    //   key: "4",
    //   message:
    //     " Needs to validate surgical history for any amputation status and PE for laterality of diagnosis (ulcer, paralysis, atherosclerosis of LE, etc.). ",
    //   date: "18/10/2023",
    //   time: "10:00 am",
    //   person: "Rahul(manager)",
    // },
    // {
    //   key: "5",
    //   message:
    //     " We need minimal support (stable, continue X medication with dosage, is acceptable) for the diagnosis found in the assessment plan to confirm the diagnosis; if support is not sufficient, query the diagnosis.",
    //   date: "18/10/2023",
    //   time: "10:00 am",
    //   person: "Rahul(manager)",
    // },
    // {
    //   key: "6",
    //   message: " We should give priority to the more specific diagnosis",
    //   date: "18/10/2023",
    //   time: "10:00 am",
    //   person: "Rahul(manager)",
    // },
  ];
  const handleOpen = () => {
    setOpenNotification(!openNotifications);
  };
  const handleOk = () => {
    setOpenNotification(false);
  };
  
  const emailSplitFunction = (email) => {
    let emailSplit = email.split("@");
    return capitalizeFirstLetter(emailSplit[0]);
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  const notificationData = notificationResponse?.map((info) => (
    <div className={styles.msgDiv}>
      <div style={{ marginTop: "10px" }}> {SVGICON.dashboardNotification}</div>
      <div className={styles.msgCOntainer}>
        <span className={styles.description}>{info.content}</span>
        <div className={styles.time}>
          {moment(info.createdAt).format("MM-DD-YYYY")}&nbsp; {moment(info.createdAt).format("hh:mm:A")} &nbsp; {emailSplitFunction(info.userFrom.userName)} ({info.userFrom?.role[0]})
        </div>
      </div>
    </div>
  ));
  return (
    <>
      <HeadTitle
        header="Notifications"
        anchorTag="anchor"
        handleOpen={handleOpen}
      />

      <div className={styles.card4}>
        <Card borderRadius="28px" padding="20px">
          <div className={styles.container}>
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
