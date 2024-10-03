import React from "react";
import { Avatar, Steps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import ResuableModal from "../../../components/modal";
import { allButtons } from "../../../utils/reusable";
import { renderUserPrfoileAvatar } from "../../../components/headerFilters/functions";
import { getButtonStatus } from "../../../components/commonFunctions";

const FeedBackModalContent = ({
  isModalOpen,
  modalData,
  handleOk,
  handleCancel,
}) => {
  const description = "Approved  John Smith 03/21/2024 13.30";

  const stepsData = [
    {
      title: "Your Feedback is Approved",
      description: (
        <div className={` d-flex justify-content-center`}>
          {getButtonStatus(modalData?.status)}
        </div>
      ),
       icon: <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Technical Support Team",
      description,
       icon: <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Medical Coding Team",
      description,
      icon: <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Manager",
      description,
     icon: <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Created the Feedback",
      description,
      icon: <Avatar icon={<UserOutlined />} />,
    },
  ];

  return (
    <ResuableModal
      isModalOpen={isModalOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
      width={900}
    >
      {modalData && (
        <div className="row">
          <div className="col-7">
            <div className={styles.heading}>Patient feedback</div>
            <div className="d-flex justify-content-between mt-2">
              {modalData?.PATIENT}
              <div>{getButtonStatus(modalData?.status)}</div>
            </div>
            <div className="row">
              <div className="col-6 mt-3">
                <div className={styles.txt}>Feedback Id</div>
                <div>{modalData?.feedBackId}</div>
              </div>
              <div className="col-6 mt-3">
                <div className={styles.txt}>Created by</div>
                <div className="d-flex align-items-center">
                  {/* {renderUserPrfoileAvatar({
                    firstName: modalData?.firstName,
                    lastName: modalData?.lastName,
                    imageUrl: modalData?.imageUrl,
                    field: null,
                  })} */}
                  {modalData?.firstName} {modalData?.lastName}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 mt-3">
                <div className={styles.txt}>Code</div>
                <div>{modalData?.diagnosisCode}</div>
              </div>
              <div className="col-6 mt-3">
                <div className={styles.txt}>Description</div>
                <div>{modalData?.description}</div>
              </div>
              <div className={`mt-5 ${styles.txt}`}>Reason</div>
              <div className={styles.para}>{modalData?.reason}</div>
            </div>
          </div>
          <div className={`col-5 ${styles.modalborder}`}>
            <div className={styles.heading}>Activity</div>
            <div className="mt-3 customstepper">
              <Steps direction="vertical" current={1} items={stepsData} />
            </div>
          </div>
        </div>
      )}
    </ResuableModal>
  );
};

export default FeedBackModalContent;
