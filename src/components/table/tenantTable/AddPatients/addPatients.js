import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import TableStyle from "../../table.module.css";
import { notification, Empty, Tooltip, Popover, Badge } from "antd";
import {
  renderUserPrfoileAvatar,
} from "../../../headerFilters/functions";
import { getStorage, setStorage } from "../../../../utils/storages";
import SvgFlag from "../../../patientDetails/details/components/svg/svg";
import { actions as adminActions } from "../../../../stores/admin/users";
import { actions as allActions } from "../../../../stores/admin/workqueue";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import { connect } from "react-redux";
import Legends from "../../../legends";
import { formatDateTime } from "../../../../utils/reusable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

function AddPatientListTable({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
  patientDetails,
  sort,
  setSort,
  page,
  selectedRoWDetails,
  getRoutedData,
  bullets,
  badges,
  getRetregger
}) {
  const [detailsContent, setDetailsContent] = useState(patinetListAll);
  const navigate = useRouter();

  const gotoPatientDetails = (data) => {
    patientDetails(data);
    if (data?.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data?.patientId);
      var role = getStorage("userRole");
      if (role == "tenant_admin") {
        setStorage("routeBackTo", "/tenantadmin/patients");
        getRoutedData(page);
        navigate.push({
          pathname: "/tenantadmin/patients/details",
        });
      } else {
        const encodedValue = btoa(JSON.stringify(page))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, ""); // Remove padding '='
        setStorage("AdminPatientsEncodedValue", encodedValue);
        navigate.push({
          pathname: "/admin/patients/details",
        });
      }
    } else {
      notification.warning({
        message: data?.patientId + " file not processed. Please wait.",
      });
    }
  };

  const handleTableRowClick = (e) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      const dataIndex = targetTd.parentElement.rowIndex - 1;
      const clickedData = patinetListAll[dataIndex];
      gotoPatientDetails(clickedData);
    }
  };
  const handleSort = (field) => {
    setSort((prev) => {
      const newSortDir = prev[field]?.sortDir === "DESC" ? "ASC" : "DESC";
      return {
        ...prev,
        [field]: { sortDir: newSortDir, sortField: field },
        sort: { sortDir: newSortDir, sortField: field },
      };
    });
  };
  const renderRows = () => {
    return patinetListAll?.length === 0 || !patinetListAll? (
      <tr>
        <td colSpan="11">
          <Empty />
        </td>
      </tr>
    ) : (
      <>
        {patinetListAll?.map((data, index) => (
          <tr
            key={index}
            id={data?.patientId}
            name={data?.patientId}
            onClick={() => {
              selectedRoWDetails({
                patientId: data?.patientId,
                processStageId: data?.processStageId,
              });
            }}
          >
            <td
              id={data?.patientId}
              name={data?.patientId}
              className={TableStyle.firstTdBorder}
              onClick={handleTableRowClick}
            >
              {data?.flagList && data.flagList.length > 0 ? (
                (() => {
                  const sortedFlags = [...data.flagList].sort((a, b) => {
                    if (a.priority === null) return 1;
                    if (b.priority === null) return -1;
                    return a.priority - b.priority;
                  });

                  const priorityFlag = sortedFlags[0];

                  return (
                    <Popover
                      content={
                        <div style={{ height: "auto", overflow: "scroll" }}>
                          <strong>Flag details</strong>
                          {data.flagList.map((flag, flagIndex) => (
                            <div key={flagIndex}>
                              <span className="p-1">
                                <SvgFlag fillColor={flag?.flagColour} />
                              </span>
                              {flag?.flagName.replaceAll("_", " ")}
                            </div>
                          ))}
                        </div>
                      }
                      placement="right"
                    >
                      <Badge
                        count={data.flagList.length}
                        offset={[5, 5]}
                        size="small"
                        style={{
                          right: "2px",
                          marginTop: "2px",
                          background: "#04306f",
                          cursor: "default",
                        }}
                      >
                        <SvgFlag
                          fillColor={priorityFlag?.flagColour || "transparent"}
                        />
                      </Badge>
                    </Popover>
                  );
                })()
              ) : (
                <Tooltip title="No flag found">
                  <span>
                    <SvgFlag fillColor={"transparent"} />
                  </span>
                </Tooltip>
              )}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {data.patientId ? (
                <Tooltip title={data.patientId}>
                  <div
                    style={{
                      width: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {data.patientId}
                  </div>
                </Tooltip>
              ) : (
                "---"
              )}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
              id={data?.batchName}
              name={data?.batchName}
            >
              {data.batchName ? data.batchName : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {data.fileName ? (
                <Tooltip title={data.fileName}>
                  <div
                    style={{
                      width: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {data.fileName}
                  </div>
                </Tooltip>
              ) : (
                "---"
              )}
              {/* {data.fileName ? data.fileName : "---"} */}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {data.emr ? data.emr : "---"}
            </td>
            <td
              className={`${TableStyle.childBorder} text-center`}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {data.totalPages ? data.totalPages : "---"}
            </td>
            <td
              className={`text-truncate ${TableStyle.childBorder}`}
              style={{ textAlign: "left" }}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {data.createdByFirstName ||
              data.createdByLastName ||
              data.createdByProfileImage ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>
                    {renderUserPrfoileAvatar(
                      data.createdByFirstName,
                      data.createdByLastName,
                      data.createdByProfileImage,
                      "header"
                    )}
                  </span>
                  <span>
                    {data.createdByFirstName} {data.createdByLastName}
                  </span>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>---</div>
              )}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={`text-truncate ${TableStyle.childBorder}`}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {data.computedDate
                ? formatDateTime({
                    date: data.computedDate,
                    formatType: "dateTime",
                  })
                : "---"}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={`text-truncate ${TableStyle.childBorder}`}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {data.createdDate
                ? formatDateTime({
                    date: data.createdDate,
                    formatType: "dateTime",
                  })
                : "---"}
            </td>
            <td
              style={{ marginLeft: "10px" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
              id={data?.patientId}
              name={data?.patientId}
            >
              {statusBodyTemplate(data)}
            </td>
            <td
              className={TableStyle.lastBorder}
              style={{ textAlign: "center" }}
            >
              {actionBodyTemplate(data)}
            </td>
            <td
              className={TableStyle.lastBorder}
              style={{ textAlign: "center" }}
            >
              {data?.isRequestForRetry && (
                <div onClick={() => getRetregger(data)} className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    style={{ fontSize: "large", color: "#df3a3a" }}
                  />{" "}
                </div>
              )}
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>Flag </th>
            <th className="px-3">PATIENT ID</th>
            <th className="px-3">BATCH NAME</th>
            <th className="text-truncate px-3">FILE NAME</th>
            <th className="text-truncate px-3">EMR TYPE</th>
            <th className="text-truncate px-3 text-center">TOTAL PAGES</th>
            <th className="text-truncate px-3">CREATED BY</th>

            <th
              style={{
                cursor: "pointer",
                textAlign: "center",
              }}
              id="computed-date"
              name="computed-date"
              onClick={() => handleSort("computedDate")}
              className="text-truncate"
            >
              COMPUTED DATE
              {sort?.computedDate?.sortDir === "ASC" ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )}
            </th>
            <th
              onClick={() => handleSort("createdDate")}
              id="created-date"
              name="created-date"
              style={{ textAlign: "center" }}
              className="text-truncate"
            >
              CREATED DATE
              <span
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                  paddingLeft: "15px",
                }}
              >
                {sort?.createdDate?.sortDir === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th style={{ paddingLeft: "55px" }}>
              <span className="d-flex gap-2">
                STATUS
                <span style={{ cursor: "pointer" }}>
                  <Popover
                    content={
                      <>
                        <Legends
                          bullets={bullets}
                          display="block"
                          padding="0 0px 10px 0"
                        />
                        {badges?.length > 0 &&
                          badges?.map((data) => (
                            <div style={{ marginBottom: "10px" }}>
                              <Image src={data.src} width={20} height={30} />
                              <span style={{ marginLeft: "5px" }}>
                                {data?.name}
                              </span>
                            </div>
                          ))}
                      </>
                    }
                    trigger={["click"]}
                    placement="bottom"
                  >
                    <InfoCircleFilled
                      style={{ color: "#fff", fontSize: "14px" }}
                    />
                  </Popover>
                </span>
              </span>
            </th>
            <th>UPLOAD</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {patinetListAll?.length==0 ? (
            <tr>
              <td colSpan="11">
                <Empty />
              </td>
            </tr>
          ) : (
            renderRows()
          )}
        </tbody>
      </table>
    </div>
  );
}
const connector = connect((state) => ({}), {
  selectedRoWDetails: adminActions.selectedRoWDetails,
  patientDetails: allActions.getPatientDetails,
  getRoutedData: allPatientSyncAction.getRoutedData,
});
export default connector(AddPatientListTable);
