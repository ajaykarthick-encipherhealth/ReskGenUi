import React, { useState } from "react";
import { useRouter } from "next/router";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import moment from "moment";
import TableStyle from "../../table.module.css";
import {
  notification,
  Select as AntSelect,
  Empty,
  Popover,
  Tooltip,
  Badge,
} from "antd";
import {
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";
import { getStorage, setStorage } from "../../../../utils/storages";
import SvgFlag from "../../../patientDetails/details/components/svg/svg";
import { truncateString } from "../../../patientDetails/details/components/function/ReusableFunctions";
import { actions as adminActions } from "../../../../stores/admin/users";
import { actions as allActions } from "../../../../stores/admin/workqueue";
import { connect } from "react-redux";
import { actions as patientSyncActions } from "../../../../stores/tenantAdmin/patientSync";
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
  selectedRoWDetails,
  getRoutedData,
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
      var role = getStorage("role");
      if (role == "tenant_admin") {
        setStorage("routeBackTo", "/tenantAdmin/patients");
        getRoutedData(page);
        navigate.push({
          pathname: "/tenantAdmin/patients/details",
        });
      } else {
        const encodedValue = btoa(JSON.stringify(page))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, ""); // Remove padding '='

        // const encodedValue = btoa(JSON.stringify(page));
        setStorage("AdminPatientsEncodedValue", encodedValue);
        navigate.push({
          pathname: "/admin/patients/details",
          // query: {
          //   params: encodedValue,
          // },
        });
      }
      // setStorage('paginations', JSON.stringify(page))
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
              selectedRoWDetails({
                patientId: data?.patientId,
                processStageId: data?.processStageId,
              });
            }}
          >
            <td
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
            >
              {data?.patientId ? (
                <Tooltip placement="top" title={data?.patientId}>
                  {truncateString(data?.patientId, 20)}
                </Tooltip>
              ) : (
                "---"
              )}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data?.fileName ? (
                <Tooltip placement="top" title={data?.fileName}>
                  {truncateString(data?.fileName, 30)}
                </Tooltip>
              ) : (
                "---"
              )}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data?.totalPages ? data?.totalPages : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              style={{ textAlign: "left" }}
              onClick={handleTableRowClick}
            >
              {data?.createdByFirstName ||
              data?.createdByLastName ||
              data?.createdByProfileImage ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>
                    {renderUserPrfoileAvatar(
                      data?.createdByFirstName,
                      data?.createdByLastName,
                      data?.createdByProfileImage,
                      "header"
                    )}
                  </span>
                  <span>
                    {data?.createdByFirstName} {data?.createdByLastName}
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
              {data?.computedDate
                ? moment(data?.computedDate).format("MM-DD-YYYY, h:mm a")
                : "---"}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data?.createdDate
                ? moment(data?.createdDate).format("MM-DD-YYYY, h:mm a")
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
            <th>Flag </th>
            <th>PATIENT ID</th>
            <th className="text-start px-3">FILE NAME</th>
            <th className="text-truncate">TOTAL PAGES</th>
            <th style={{ textAlign: "center" }} className="text-truncate">
              CREATED BY
            </th>

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

const connector = connect((state) => ({}), {
  selectedRoWDetails: adminActions.selectedRoWDetails,
  patientDetails: allActions.getPatientDetails,
  getRoutedData: patientSyncActions.getRoutedData,
});
export default connector(AddPatientListTable);
