import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { notification, Select as AntSelect, Empty, Tooltip } from "antd";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";
import {
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";

function AddPatientListTable({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
  patientDetails,
  sortOrder,
  setSortOrder,
  setSort,
  page,
  sortCompleteOrder,
  setSortCompleteOrder,
}) {
  const [detailsContent, setDetailsContent] = useState(patinetListAll);

  const dispatch = useDispatch();
  const navigate = useRouter();

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data?.patientId);
      var role = localStorage.getItem("role");
      if (role == "tenant_admin") {
        navigate.push({
          pathname: "/tenantAdmin/patients/details",
          query: page,
        });
      } else {
        navigate.push({ pathname: "/admin/patients/details", query: page });
      }
      // localStorage.setItem('paginations', JSON.stringify(page))
    } else {
      notification.warning({
        message: data.patientId + " file not processed. Please wait.",
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

  const renderRows = () => {
    return patinetListAll?.length === 0 ? (
      <tr>
        <td colSpan="9">
          <Empty />
        </td>
      </tr>
    ) : (
      <>
        {patinetListAll?.map((data, index) => (
          <tr
            key={index}
            onClick={() => {
              dispatch(
                selectedRoWDetails({
                  patientId: data?.patientId,
                  processStageId: data?.processStageId,
                })
              );
            }}
          >
            <td
              className={TableStyle.firstTdBorder}
              onClick={handleTableRowClick}
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
            >
              {data.emr ? data.emr : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data.totalPages ? data.totalPages : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              style={{ textAlign: "left" }}
              onClick={handleTableRowClick}
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
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data.computedDate
                ? moment(data.computedDate).format("MM-DD-YYYY, h:mm a")
                : "---"}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data.createdDate
                ? moment(data.createdDate).format("MM-DD-YYYY, h:mm a")
                : "---"}
            </td>
            <td
              style={{ marginLeft: "10px" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {statusBodyTemplate(data)}
            </td>
            <td
              className={TableStyle.lastBorder}
              style={{ textAlign: "center" }}
            >
              {actionBodyTemplate(data)}
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
            <th>PATIENT ID</th>
            <th className="text-truncate">FILE NAME</th>
            <th className="text-truncate">EMR TYPE</th>
            <th className="text-truncate">TOTAL PAGES</th>
            <th style={{ textAlign: "center" }} className="text-truncate">CREATED BY</th>

            <th
              style={{
                cursor: "pointer",
                paddingLeft: "15px",
                textAlign: "center",
              }}
              onClick={() => {
                sortFunction(sortOrder, setSortOrder, setSort, "computedDate");
              }}
              className="text-truncate"
            >
              COMPUTED DATE{" "}
              {sortOrder === "ASC" ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )}
            </th>
            <th
              onClick={() => {
                sortFunction(
                  sortCompleteOrder,
                  setSortCompleteOrder,
                  setSort,
                  "createdDate"
                );
              }}
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
                {sortCompleteOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>

            <th style={{ paddingLeft: "55px" }}>STATUS</th>
            <th>UPLOAD</th>
          </tr>
        </thead>

        <tbody>
          {detailsContent?.length <= 0 ? (
            <tr>
              <td colSpan="9">
                <Empty />
              </td>
            </tr>
          ) : (
            renderRows()
          )}
        </tbody>
      </table>
      <div></div>
    </div>
  );
}

export default AddPatientListTable;
