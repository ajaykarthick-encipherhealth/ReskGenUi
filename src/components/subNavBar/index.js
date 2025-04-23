import React from "react";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { Progress } from "antd";
import {
  createIdGen,
  handleCopyTextInput,
  priorityStatusRender,
} from "../../utils/reusable";
import { connect } from "react-redux";
import { getStorage } from "../../utils/storages";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SubNavBar = ({ handleBack,hideBackArrow }) => {
  const role = getStorage("userRole");
  const headerData = [];
  const showItems = [
    {
      title: "tin",
      key: headerData?.tinName || "--",
    },
    { title: "progress", key: headerData?.progressPercentage || 0 },
    { title: "providers", key: headerData?.providerCount || 0 },
    { title: "patients", key: headerData?.patientCount || 0 },
    {
      title: "not Assigned",
      key: headerData?.processedStatusCount?.NOT_ASSIGNED || 0,
    },
    {
      title: "downloading",
      key:
        headerData?.processedStatusCount?.DOWNLOADER_ASSIGNED ||
        0 + headerData?.processedStatusCount?.DOWNLOADER_COMPLETED ||
        0,
    },
    {
      title: "coder1",
      key:
        headerData?.processedStatusCount?.CODER_1_ASSIGNED ||
        0 + headerData?.processedStatusCount?.CODER_1_COMPLETED ||
        0,
    },
    {
      title: "coder2",
      key:
        headerData?.processedStatusCount?.CODER_2_ASSIGNED ||
        0 + headerData?.processedStatusCount?.CODER_2_COMPLETED ||
        0,
    },
    { title: "QA", key: headerData?.processedStatusCount?.QA_ASSIGNED || 0 },
    {
      title: "Downloader Not Complete",
      key: headerData?.processedStatusCount?.NOT_COMPLETED || 0,
    },
    {
      title: "complete",
      key: headerData?.processedStatusCount?.COMPLETED || 0,
    },
    { title: "priority", key: priorityStatusRender(headerData?.priority) },
  ];

  // const showItems =
  //   routedData?.tabName?.Status === "Active"
  //     ? tinInfo.slice(0, 12)
  //     : tinInfo?.filter((item) => item?.title !== "priority");

  return (
    <section className={`${styles.tabMainContainer} d-flex align-items-center`}>
      {hideBackArrow &&  <div
        onClick={handleBack}
        className={`${styles.arrowBtn} cursor-pointer mx-3 ` }
        data-testid={createIdGen(`${role} tin backicon`)}
        id={createIdGen(`${role} tin backicon`)}
      >
      <FontAwesomeIcon icon={faArrowLeft} />
      </div>}
     
      <div className={styles.tabContainer}>
      <section
        className="d-flex mx-3 pb-2 gap-3 d-flex align-items-center flex-wrap"
      >
        {showItems?.map((header, index) => (
          <section className={`cr-pointer mx-2 px-2  ${styles.headerContent}`}>
            <div className={`d-flex ${styles.headerTitle} pb-1`}>
              {header?.title?.charAt(0).toUpperCase() + header?.title?.slice(1)}
            </div>
            <div
              className={`d-flex align-items-center justify-content-center `}
              data-testid={createIdGen(`${role} tin copyicon`)}
              id={createIdGen(`${role} tin copyicon`)}
            >
              {index != 1 && header?.key}
              {index == 0 && header?.key !== "" && (
                <FontAwesomeIcon
                  icon={faCopy}
                  className="cr-pointer d-flex align-items-center justify-content-center mx-2"
                  onClick={() => {
                    handleCopyTextInput(header?.key);
                  }}
                />
              )}
              {index == 1 && (
                <div
                  style={{ width: "100px" }}
                  data-testid={createIdGen(`${role} tin percenticon`)}
                  id={createIdGen(`${role} tin percenticon`)}
                >
                  <Progress percent={header?.key} strokeColor="#263E50" />
                </div>
              )}
            </div>
          </section>
        ))}
      </section>
      </div>
    </section>
    
  );
};

const connector = connect((state) => ({}));
export default connector(SubNavBar);
