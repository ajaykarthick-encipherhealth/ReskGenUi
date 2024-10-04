import React from "react";
import { Avatar, Steps } from "antd";
import styles from "./styles.module.css";
import { getButtonStatus } from "../../../components/commonFunctions";
import { IMAGES } from "../../../jsx/constant/theme";
import Image from "next/image";
import { UserOutlined } from "@ant-design/icons";
import { renderUserPrfoileAvatar } from "../../../components/headerFilters/functions";

const FeedBackModalContent = ({ modalData }) => {
  const description = "Approved  John Smith 03/21/2024 13.30";

  const stepsData = [
    {
      title: "Your Feedback is Approved",
      description: (
        <div className={` d-flex justify-content-center`}>
          {getButtonStatus(modalData?.status)}
        </div>
      ),
      icon: (
        <Image
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }}
          src={IMAGES.profileImage}
        />
      ),
    },
    {
      title: "Technical Support Team",
      description: (
        <div className={styles.steps}>
          Approved <Avatar icon={<UserOutlined />}></Avatar> Megan Meyers
          03/21/2024 13.30
        </div>
      ),
      icon: (
        <Image
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }}
          src={IMAGES.profileImage}
        />
      ),
    },
    {
      title: "Medical Coding Team",
      description: (
        <div className={styles.steps}>
          Approved <Avatar icon={<UserOutlined />}></Avatar> Megan Meyers
          03/21/2024 13.30
        </div>
      ),
      icon: (
        <Image
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }}
          src={IMAGES.profileImage}
        />
      ),
    },
    {
      title: "Manager",
      description: (
        <div className={styles.steps}>
          Approved <Avatar icon={<UserOutlined />}></Avatar> Megan Meyers
          03/21/2024 13.30
        </div>
      ),
      icon: (
        <Image
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }}
          src={IMAGES.profileImage}
        />
      ),
    },
    {
      title: "Created the Feedback",
      description: "03/21/2024 13.30",
      icon: (
        <Image
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }}
          src={IMAGES.profileImage}
        />
      ),
    },
  ];

  return (
    <div>
      {modalData && (
        <div className="row">
          <div className="col-7">
            <div className={styles.heading}>Patient feedback</div>
            <div className="d-flex justify-content-between mt-2">
              <div className={styles.name}>
                {" "}
                {modalData?.patientId}-{modalData?.patientName}
              </div>
              <div>{getButtonStatus(modalData?.status)}</div>
            </div>
            <div className="row">
              <div className="col-6 mt-3">
                <div className={styles.txt}>Feedback Id</div>
                <div>{modalData?.feedBackId}</div>
              </div>
              <div className="col-6 mt-3">
                <div className={styles.txt}>Managar</div>
                <div className="d-flex align-items-center gap-2">
                  {renderUserPrfoileAvatar(
                    modalData?.firstName,
                    modalData?.lastName,
                    modalData?.profileImageUrl
                  )}
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
              <Steps direction="vertical" current={4} items={stepsData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedBackModalContent;
