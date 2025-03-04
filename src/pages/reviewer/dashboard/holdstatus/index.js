import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { Empty, Modal } from "antd";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import spinSTYles from "../../../../styles/auth.module.css";
import { actions as dashbaordActions } from "../../../../stores/reviewer/dashboard";
import { renderSkeletonHold } from "../../../../components/reuseableFunctions";
import { setStorage } from "../../../../utils/storages";

const HoldStatus = ({ getHoldStatusData, holdStatusData ,getPatientID}) => {
  const [openHoldStatus, setOpenHoldStatus] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setOpenHoldStatus(!openHoldStatus);
  };
  const handleOk = () => {
    setOpenHoldStatus(false);
  };

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
      testValue: item.noteText,
    };
  });

  const TableData = (
    <table className={styles.classTable}>
      <thead className={styles.tableHead}>
        <tr>
          <th>Patient ID</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {processedData?.length > 0 ? (
          processedData?.map((item) => (
            <tr
              key={item?.id}
              className={styles.tabelCell}  
              onClick={() => {
                setStorage("patientId", item?.patientId);
                router.push("/reviewer/patients/details");
              }}
            >
              <td className={styles.description}>{item.patientId}</td>
              <td className={styles.description}>
                {item.testValue ? item.testValue : "---"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2">
              <Empty
                style={{
                  paddingTop: "50px",
                  textAlign: "center",
                  height: "260px",
                }}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
  useEffect(() => {
    getHoldStatusData();
  }, []);

  return (
    <>
      <HeadTitle
        header="Hold Status"
        // icon={calender}
        anchorTag={holdStatusData?.data?.response?.length > 0 ? "anchor" : null}
        handleOpen={holdStatusData?.data?.response?.length > 0 && handleOpen}
      />
      <div className={styles.card6}>
        <Card borderRadius="28px" padding="10px">
          {holdStatusData?.loading ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderSkeletonHold()}
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
        {holdStatusData?.loading ? (
          <div className={spinSTYles.spinStyle}>{renderSkeletonHold()}</div>
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
const enhancer = connect(
  (state) => ({
    holdStatusData: state?.reviewer?.dashboard?.holdStatus,
  }),
  {
    getHoldStatusData: dashbaordActions.holdStatusAction,
  }
);
export default enhancer(HoldStatus);
