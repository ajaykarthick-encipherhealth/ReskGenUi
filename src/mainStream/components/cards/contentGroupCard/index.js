import React, { useState } from "react";
import { Badge, Popover, Spin, Tooltip, notification } from "antd";
import styles from "../../../../mainStream/reports/report.module.css";
import TableStyle from "../../../../components/table/table.module.css";
import dayjs from "dayjs";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import { actions as patientSyncActions } from "../../../../stores/tenantAdmin/patientSync";
import { useRouter } from "next/router";
import { getMaskData } from "../../../../utils/reusable";
import { handleCopyToClipboard } from "../../../../components/commonFunctions";
import { LoadingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { getStorage, setStorage } from "../../../../utils/storages";
import { connect } from "react-redux";

const ContentGroupCard = ({
  item,
  handleRowCheckboxChange,
  selectedRows,
  auditstatusBodyTemplate,
  processstatusBodyTemplate,
  flag = [],
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
  loading,
  patientDetails,
  getRoutedData,
}) => {
  const navigate = useRouter();
  const [copied, setCopied] = useState(false);

  const gotoPatientDetails = (data) => {
    patientDetails(data);

    if (data?.processedStatus === "COMPLETED") {
      const controller = new AbortController();
      const currentRole = getStorage("userRole");
      let modifiedRole = currentRole;

      if (currentRole === "tenant_admin" || currentRole === "Tenant_Admin") {
        modifiedRole = "tenantadmin";
      } else if (currentRole === "admin") {
        modifiedRole = "admin";
      } else if (currentRole === "reviewer") {
        modifiedRole = "reviewer";
      } else modifiedRole = "supervisor";

      controller.abort();
      setStorage("patientId", data.patientId);
      setStorage("routeBackTo", `/${modifiedRole}/report`);
      getRoutedData(page);
      navigate.push(`/${modifiedRole}/report/reportdetails`);
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
    <div id="badge" className={`cr-pointer ${styles.card}`}>
      <div
        id="badge"
        className={`report-effect ${styles.contentGroup} my-2`}
        style={{ display: "flex" }}
      >
        <div id="badge" style={{ width: "5%" }}>
          {loading ? (
            <Spin
              indicator={<LoadingOutlined />}
              style={{ fontSize: 20, color: "#04306f", marginTop: "-15px" }}
            />
          ) : (
            <input
              id={selectedRows}
              name={selectedRows}
              type="checkbox"
              onChange={() => handleRowCheckboxChange(item)}
              className={TableStyle.customChecked}
              checked={
                selectedRows?.length > 0 ?
                selectedRows?.some(
                  (selectedRow) => selectedRow === item?.patientId
                ):false
              }
            />
          )}
        </div>
        <div
          id="badge"
          name={patientId}
          className="responsive_report"
          style={{
            width: "95%",
            display: "flex",
            justifyContent: "space-between",
          }}
          onClick={() => handleTableRowClick(patientId)}
        >
          <div id="badge" style={{ width: "67%" }}>
            <div
              className={`${styles.pName} mb-2`}
              onClick={() =>
                handleCopyToClipboard({
                  text: patientName,
                  setCopied: setCopied,
                })
              }
            >
              {patientName ? getMaskData(patientName) : "---"}
            </div>
            <div
              className="d-flex justify-content-between"
              style={{ width: "100%" }}
            >
              <div style={{ width: "40%" }}>
                <Tooltip title={patientId} placement="bottom">
                  <div className={`${styles.headText} -mt-2`}>
                    <p
                      style={{
                        width: "]",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: "-2px",
                      }}
                    >
                      {patientId ? patientId : ""}
                    </p>
                  </div>
                </Tooltip>
                <Tooltip title="Processed Date" placement="bottom">
                  <div className={`${styles.initialText}`}>
                    {dateFormate(dayjs, processedDate)}
                  </div>
                </Tooltip>
              </div>
              <div className={`${styles.headText}`} style={{ width: "30%" }}>
                HCC
                <div className={`${styles.initialText} mt-1`}>
                  {validDiseaseCount ? validDiseaseCount : "---"}
                </div>
              </div>
              <div className={`${styles.headText}`} style={{ width: "30%" }}>
                SUPERVISOR
                <div className={`${styles.initialText} mt-1`}>
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
              </div>
            </div>
          </div>

          <div style={{ width: "33%" }}>
            <div
              className=" d-flex justify-content-between mb-1 "
              style={{ gap: "1px" }}
            >
              <div className={styles.raf}>
                <Tooltip
                  id="rafScore"
                  name="rafScore"
                  title="Raf Score"
                  placement="bottom"
                >
                  {rafSum ? rafSum : "---"}
                </Tooltip>
              </div>

              <Popover
                content={
                  flag.length > 0 ? (
                    <ul
                      style={{
                        padding: 0,
                        listStyle: "none",
                        margin: 0,
                        maxHeight: "150px",
                        overflow: "scroll",
                      }}
                    >
                      {flag.map((f, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faFlag}
                            style={{
                              color: f.flagDetails?.flagColour || "#C0C0C0",
                            }}
                          />
                          {f.flagDetails?.flagName}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, color: "#888" }}>
                      No Flags Available
                    </p>
                  )
                }
                title="Flags"
              >
                <Badge
                  count={flag.length > 1 ? flag.length - 1 : 0}
                  offset={[5, 5]}
                  style={{ backgroundColor: "#04306f", cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    id="flagName"
                    name="flagName"
                    icon={faFlag}
                    style={{
                      color:
                        flag.length > 0
                          ? flag[0]?.flagDetails?.flagColour
                          : "#C0C0C0",
                      fontSize: "20px",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </Popover>

              <div className={styles.avatarAlign}>
                {auditstatusBodyTemplate || "--"}
              </div>
              <div>{processstatusBodyTemplate || "--"}</div>
            </div>
            <div className={`${styles.headText}`}>
              REVIEWER
              <div className={`${styles.initialText} mt-1`}>
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
    </div>
  );
};

const connector = connect((state) => ({ state }), {
  getRoutedData: patientSyncActions.getRoutedData,
});

export default connector(ContentGroupCard);
