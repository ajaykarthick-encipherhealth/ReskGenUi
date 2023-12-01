import React, { use, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card/index";
import calender from "../../../../images/dashboard/calender.png";
import HeadTitle from "../../../../components/headtitle";
import { Modal } from "antd";
import { getHoldStatusData } from "../../../../store/actions/DashboardActions";
import { useDispatch, useSelector } from "react-redux";
import TableStyle from "../../../../components/table/table.module.css"
import { useRouter } from "next/router";

const HoldStatus = () => {
  const [openHoldStatus, setOpenHoldStatus] = useState(false);
  const dispatch = useDispatch();
  const router=useRouter()
  useEffect(() => {
    dispatch(getHoldStatusData(router));
  }, []);
  const holdStatusData = useSelector((state) => state.workFlow.holdStatus);

  const handleOpen = () => {
    setOpenHoldStatus(!openHoldStatus);
  };
  const handleOk = () => {
    setOpenHoldStatus(false);
  };

  const TableData = (
    <table  className={styles.classTable}>
      <thead className={styles.tableHead}>
        <tr>
          <th>Patient Id</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        {holdStatusData?.length > 0 ? (
          holdStatusData?.map((item) => (
            <tr>
              <td className={styles.description}>{item?.patientId}</td>
              <td className={styles.description}>
                {item?.notes ? item?.notes : "no data"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2">No datas found</td>
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
          <div className={styles.container}> {TableData}</div>
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
