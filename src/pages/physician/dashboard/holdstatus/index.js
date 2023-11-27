import React, { use, useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import calender from "../../../../images/dashboard/calender.png";
import HeadTitle from "../../../../components/headtitle";
import { Modal } from "antd";

const HoldStatus = () => {
  const [openHoldStatus, setOpenHoldStatus] = useState(false);
  const holddata = [
    {
      key: "1",
      patient_id: "CE23769",
      reason:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    },
    {
      key: "2",
      patient_id: "CE23769",
      reason:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    },
    {
      key: "3",
      patient_id: "CE23769",
      reason:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    },
    {
      key: "4",
      patient_id: "CE23769",
      reason:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    },
  ];
  const handleOpen = () => {
    setOpenHoldStatus(!openHoldStatus);
  };
  const handleOk = () => {
    setOpenHoldStatus(false);
  };

  const TableData = (
    <table>
      <thead className={styles.tableHead}>
        <tr >
          <th>Patient Id</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        {holddata?.map((item) =>  (
            <tr>
              <td className={styles.description}>{item.patient_id}</td>
              <td className={styles.description}>{item.reason}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
  return (
    <>
      <HeadTitle
        header="Hold Status"
        // icon={calender}
        anchorTag="anchor"
        handleOpen={handleOpen}
      />
      <div className={styles.card6}>
        <Card borderRadius="28px" padding="10px">
         <div  className={styles.container}> {TableData}</div>
        </Card>
      </div>

      <Modal
        title="Hold Status"
        open={openHoldStatus}
        footer={null}
        width="50%"
        height="400px"
        closable={true}
        onCancel={handleOk}
      >
        {TableData}
      </Modal>
    </>
  );
};

export default HoldStatus;
