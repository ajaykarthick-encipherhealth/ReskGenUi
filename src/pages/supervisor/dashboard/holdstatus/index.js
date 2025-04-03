import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { Empty, Modal, Spin } from "antd";
import Card from "../../../../components/card/index";
import HeadTitle from "../../../../components/headtitle";
import { connect} from "react-redux";
import spinSTYles from "../../../../styles/auth.module.css";
import { renderSkeletonHold } from "../../../../components/reuseableFunctions";
import { actions as dashbaordActions } from "../../../../stores/supervisor/dashboard";

const HoldStatus = ({ holdStatusData, getHoldStatusData }) => {
  const [openHoldStatus, setOpenHoldStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
   getHoldStatusData(router);
  }, []);

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
          <th className="font2 bold text-start p-2 text-white">Patient ID</th>
          <th className="font2 bold text-start p-2 text-white">Reason</th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {processedData?.length > 0 ? (
          processedData?.map((item, index) => (
            <tr
              key={index}
              className={styles.tabelCell}
              onClick={() => {
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
  return (
    <>
      <HeadTitle
        header="Hold Status"
        anchorTag={holdStatusData?.data?.response?.length > 0 ? "anchor" : null}
        handleOpen={handleOpen}
        holdStatusData={holdStatusData}
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
              {renderSkeletonHold()}{" "}
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
          <div className={spinSTYles.spinStyle}>
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

const enhancer = connect(
  (state) => ({
    holdStatusData: state?.supervisor?.dashboard?.holdStatus
  }),
  {
    getHoldStatusData: dashbaordActions.holdStatusAction,
  }
);
export default enhancer(HoldStatus);
