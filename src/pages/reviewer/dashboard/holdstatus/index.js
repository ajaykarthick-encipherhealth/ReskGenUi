import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { Empty, Modal, Spin } from "antd";
import { getHoldStatusData } from "../../../../store/actions/DashboardActions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import spinSTYles from '../../../../styles/auth.module.css'
import { getPatientID } from "../../../../store/actions/PatientsActions";

const HoldStatus = () => {
  const [openHoldStatus, setOpenHoldStatus] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(getHoldStatusData(router));
  }, []);
  const holdStatusData = useSelector((state) => state.l2Dashboard.holdStatus);

  const handleOpen = () => {
    setOpenHoldStatus(!openHoldStatus);
  };
  const handleOk = () => {
    setOpenHoldStatus(false);
  };
  console.log(holdStatusData?.data?.response)

  const processedData = holdStatusData?.data?.response?.map((item) => {
    let testValue = "no data";

    if (item.holdNotes && item.holdNotes.length > 0) {
      item.holdNotes.forEach((obj) => {
        if (obj["2023"]) {
          testValue = obj["2023"];
        }
      });
    }
    return {
      patientId: item.patientId,
      testValue: testValue,
    };
  });
  const TableData = (
    <table className={styles.classTable}>
      <thead className={styles.tableHead}>
        <tr>
          <th>Patient Id</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {processedData?.length > 0 ? (
          processedData?.map((item, index) => (
            <tr
              key={index}
              className={styles.tabelCell}
              onClick={() => {
                dispatch(getPatientID({ patirntId: item.patientId }));
                router.push("/reviewer/patients/details");
              }}
            >
              <td className={styles.description}>{item.patientId}</td>
              <td className={styles.description}>{item.testValue}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2">
            <Empty/>
            </td>
          </tr>
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
          {holdStatusData?.laoding ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin loading={holdStatusData?.loading} />
            </div>
          ) : (
            <div className={styles.container}> {TableData}</div>
          )}
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
        {holdStatusData?.laoding ? (
          <div
          className={spinSTYles.spinStyle}
          >
            <Spin loading={holdStatusData?.loading} />
          </div>
        ) : (
          <div className={styles.container} style={{ height: "500px" }}>
            {" "}
            {TableData}
          </div>
        )}
      </Modal>
    </>
  );
};

export default HoldStatus;