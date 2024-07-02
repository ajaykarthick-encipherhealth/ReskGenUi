import React, { useState } from "react";
import { Tooltip, notification } from "antd";
import styles from "../../../../resusablereport/reports/report.module.css";
import TableStyle from "../../../../components/table/table.module.css";
import dayjs from "dayjs";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import { getFlags } from "../../../../components/reuseableFunctions";
import { SVGICON } from "../../../../jsx/constant/theme";
import { patientDetails } from "../../../../stores/authflow/actions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getMaskData } from "../../../../utils/reusable";
import { handleCopyToClipboard } from "../../../../components/commonFunctions";

const ContentGroupCard = ({
  item,
  handleRowCheckboxChange,
  selectedRows,
  auditstatusBodyTemplate,
  processstatusBodyTemplate,
  flag,
  rafSum,
  patientName,
  processedDate,
  patientId,
  validDiseaseCount,
  auditedByFirstName,
  auditedByLastName,
  auditedByProfileImage,
  patientAllocatedFirstName,
  patientAllocatedLastName,
  patientAllocatedProfileImage,
  content,
  page,
}) => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [copied, setCopied] = useState(false);
  // const gotoPatientDetails = (data) => {
  //   if (!data) {
  //     notification.warning({
  //       message: "Data is undefined. Please wait.",
  //     });
  //     return;
  //   }

  //   dispatch(patientDetails(data));

  //   if (data.processedStatus === "COMPLETED") {
  //     const controller = new AbortController();
  //     const currentRole = localStorage.getItem("userRole");
  //     controller.abort();
  //     localStorage.setItem("patientId", data.patientId);
  //     navigate.push({
  //       pathname: `/${currentRole}/patients/details`,
  //       query: page,
  //     });
  //   } else {
  //     notification.warning({
  //       message: data.patientId + " file not processed. Please wait.",
  //     });
  //   }
  // };
  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));

    if (data?.processedStatus === "COMPLETED") {
      const controller = new AbortController();
      const currentRole = localStorage.getItem("userRole");
      let modifiedRole = currentRole;

      if (currentRole === "tenant_admin") {
        modifiedRole = "tenantAdmin";
      } else if (currentRole === "admin") {
        modifiedRole = "admin";
      } else if (currentRole === "reviewer") {
        modifiedRole = "reviewer";
      } else modifiedRole = "supervisor";

      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push({
        pathname: `/${modifiedRole}/patients/details`,
        query: page,
      });
    } else {
      notification.warning({
        message: data?.patientId + " file not processed. Please wait.",
      });
    }
  };

  const handleTableRowClick = (id) => {
    const clickedData = content?.find((item) => item.patientId === id);
    if (clickedData) {
      gotoPatientDetails(clickedData);
    } else {
      notification.warning({
        message: "No data found for this row. Please wait.",
      });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.contentGroup} style={{ cursor: "pointer" }}>
        <div className={styles.inputContainer}>
          <input
            type="checkbox"
            onChange={() => handleRowCheckboxChange(item)}
            className={TableStyle.customChecked}
            checked={selectedRows?.some(
              (selectedRow) => selectedRow.patientId === patientId
            )}
          />
        </div>
        <div
          className={`col-xl-12 ${styles.checkSep}`}
          onClick={() => handleTableRowClick(patientId)}
        >
          <div className="d-flex justify-content-between align-items-center pb-1">
            <div
              className={`col-xl-6 ${styles.pName}`}
              onClick={() =>
                handleCopyToClipboard({
                  text: patientName,
                  setCopied: setCopied,
                })
              }
            >
              {patientName ? getMaskData(patientName) : "---"}
            </div>
            <div className={`col-xl-6 ${styles.dataContainer}`}>
              <span className={styles.raf}>
                <Tooltip title="Raf Score" placement="bottom">
                  {rafSum ? rafSum : "---"}
                </Tooltip>
              </span>
              <span className={styles.avatarAlign}>
                <Tooltip title={flag[0]?.flagDetails?.flagName}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 800 800"
                    fill={
                      flag[0]?.flagDetails?.flagColour
                        ? flag[0]?.flagDetails?.flagColour
                        : "transparent"
                    }
                  >
                    <path
                      d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
                      stroke="#000"
                      strokeWidth="10"
                    />
                  </svg>
                </Tooltip>
              </span>
              <span className={styles.avatarAlign}>
                {auditstatusBodyTemplate}
              </span>
              <span>{processstatusBodyTemplate}</span>
            </div>
          </div>
          <div className="d-flex justify-content-around align-items-center pb-1">
            <Tooltip title={patientId} placement="bottom">
              <div className={`col-xl-2 ${styles.headText}`}>
                <p
                  style={{
                    width: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {patientId ? patientId : ""}
                </p>
              </div>
            </Tooltip>
            <div className={`col-xl-2 ${styles.headText}`}>HCC</div>
            <div className={`col-xl-4 ${styles.headText}`}>SUPERVISOR</div>
            <div className={`col-xl-4 ${styles.headText}`}>REVIEWER</div>
          </div>
          <div className="d-flex justify-content-around align-items-center">
            <Tooltip title="Processed Date" placement="bottom">
              <div className={`col-xl-2 ${styles.text}`}>
                {dateFormate(dayjs, processedDate)}
              </div>
            </Tooltip>
            <div className={`col-xl-2 ${styles.text}`}>
              {validDiseaseCount ? validDiseaseCount : "---"}
            </div>
            <div className={`col-xl-4 ${styles.text}`}>
              {auditedByFirstName ||
              auditedByLastName ||
              auditedByProfileImage ? (
                <div className="d-flex align-items-center">
                  <span className={styles.avatarAlign}>
                    {renderUserPrfoileAvatar(
                      auditedByFirstName,
                      auditedByLastName,
                      auditedByProfileImage,
                      "header"
                    )}
                  </span>
                  <span>
                    {auditedByFirstName} {auditedByLastName}
                  </span>
                </div>
              ) : (
                <div>---</div>
              )}
            </div>
            <div className={`col-xl-4 ${styles.text}`}>
              {patientAllocatedFirstName ||
              patientAllocatedLastName ||
              patientAllocatedProfileImage ? (
                <div className="d-flex align-items-center">
                  <span className={styles.avatarAlign}>
                    {renderUserPrfoileAvatar(
                      patientAllocatedFirstName,
                      patientAllocatedLastName,
                      patientAllocatedProfileImage,
                      "header"
                    )}
                  </span>
                  <span>
                    {patientAllocatedFirstName} {patientAllocatedLastName}
                  </span>
                </div>
              ) : (
                <div>---</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGroupCard;
