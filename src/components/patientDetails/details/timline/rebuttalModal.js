import React, { useState } from "react";
import { Modal, Input, Tag, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { getLocalStored } from "../../../../utils/storages";
import { actions as userActions } from "../../../../stores/patient/details";
import { connect } from "react-redux";
import { getResponePopup } from "../../../../utils/reusable";
import styles from "./styles.module.css";


const RebuttalModal = ({
  item,
  setRebuttalStatus,
  getActionList,
  setCompleteStatus,
  rebuttalStatusLoader,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [justification, setJustification] = useState("");
  const { roleId = null } = getLocalStored();
  const [selectedItem, setSelectedItem] = useState(null);
  
  const handleAgreeClick = async () => {
    const obj = {
      id: item?.id,
      rebuttalStatus: "AGREED",
      dateOfServices: item?.dos,
    };

    try {
      const response = await setRebuttalStatus(obj);
      if(response?.status == "SUCCESS"){
        getActionList();
        getResponePopup(response);
      }else{
        getResponePopup(response);
      }

    } catch (error) {
      getResponePopup(error);
    }
  };
  const handleCompleteClick = async () => {
    const obj = {
      id: item?.id,
    };

    try {
      const response = await setCompleteStatus(obj);
      if(response?.status == "SUCCESS"){
            getActionList();
            getResponePopup(response);
      }else{
        getResponePopup(response);
      }
  
    } catch (error) {
      getResponePopup(error);
    }
  };

  const handleDisagreeClick = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setJustification("");
  };

  const handleOk = async () => {
    if (!justification.trim()) return;

    const obj = {
      id: selectedItem?.id,
      rebuttalStatus: "DISAGREED",
      reason: justification,
      dateOfServices: selectedItem?.dos,
    };

    try {
      const response = await setRebuttalStatus(obj);
      if(response?.status == "SUCCESS"){
        getActionList();
        getResponePopup(response);
      }
      else{
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    }

    setIsModalVisible(false);
    setJustification("");
    setSelectedItem(null);
  };

  const content = <span>{item?.rebuttalReason || "No reason provided"}</span>;
  return (
    <>
      <div>
        <>
          {item?.previousCoderRoleId === roleId &&
          item?.rebuttalStatus === "PENDING" ? (
            <>
              <button
                className={`${styles.agree}  btn-sm me-2`}
                onClick={handleAgreeClick}
              >
                Agree
              </button>
              <button
                className={`${styles.disagree}  btn-sm me-2`}
                onClick={() => handleDisagreeClick(item)}
              >
                Disagree
              </button>
            </>
          ) : item?.previousCoderRoleId === roleId &&
            item?.rebuttalStatus !== "PENDING" ? (
            <Tag color={item.rebuttalStatus === "AGREED" ? "green" : "red"}>
              {item.rebuttalStatus}
            </Tag>
          ) : item?.currentCoderRoleId === roleId &&
            item?.isMarkedAsComplete === false ? (
            <>
              <button
                className={`${styles.markAsCompleted} btn-sm px-2 me-2`}
                onClick={handleCompleteClick}
              >
                Mark as completed
              </button>
              <Popover
                content={content}
                title="Rebuttal Reason"
                trigger="hover"
              >
                <button
                  className={`${styles.rebuttalButton} btn-sm px-2 me-2`}
                >
                  <FontAwesomeIcon icon={faCircleInfo} /> Rebuttal
                </button>
              </Popover>
            </>
          ) : item?.currentCoderRoleId === roleId &&
            item?.isMarkedAsComplete === true ? (
            <Popover content={content} title="Rebuttal Reason" trigger="hover">
              <button
                className={`${styles.rebuttalButton} btn-sm px-2 me-2`}
              >
                <FontAwesomeIcon icon={faCircleInfo} /> Rebuttal
              </button>
            </Popover>
          ) : null}
        </>
      </div>
      <Modal
        title="Disagreement Justification"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={rebuttalStatusLoader ? "Loading..." : "Submit"}
        cancelText="Cancel"
      >
        <p>Please provide a justification for disagreement:</p>
        <Input.TextArea
          rows={4}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Enter your reason here..."
        />
      </Modal>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    rebuttalStatusLoader: state?.patientDetails?.details?.rebuttalStatusLoader,
  }),
  {
    setRebuttalStatus: userActions.rebuttalStatusAction,
    setCompleteStatus: userActions.markAsCompletedAction,
  }
);
export default enhancer(RebuttalModal);