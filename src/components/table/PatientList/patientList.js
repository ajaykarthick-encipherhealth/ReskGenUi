import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../table.module.css";
import { Select as AntSelect, Empty, Tooltip } from "antd";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  priorityOptions,
  sortFunction,
  renderUserPrfoileAvatar,
} from "../../headerFilters/functions";
import { truncateString } from "../../patientDetails/details/components/function/ReusableFunctions";
import { actions as supervisorActions } from "../../../stores/supervisor/auditedQueue";
import { connect } from "react-redux";
import { setStorage } from "../../../utils/storages";
import { actions as reviewerWorkQueueAction } from "../../../stores/reviewer/workqueue";
import { allFilters } from "../../../pages/reviewer/patients/headerFilters";
import { actions as patientSyncActions } from '../../../stores/tenantAdmin/patientSync'

function PatientTable({
  patinetListAll,
  statusBodyTemplate,
  patientDetails,
  setSort,
  getFilteApi,
  page,
  setSelectedPriority,
  sortDueOrder,
  setSortDueOrder,
  sortCompleteOrder,
  setSortCompleteOrder,
  sortAllocateOrder,
  setSortAllocateOrder,
  userId,
  params,
  gotoPatientDetails,
  supervisorActions,
  activeFilters,
  getFilteredList,
  getRoutedData
}) {
  const router = useRouter();
  const handlePriorityChange = async (
    patientId,
    selectedValue,
    lastModifiedDate
  ) => {
    const res = await supervisorActions({
      patientId: patientId,
      year: dayjs(lastModifiedDate).format("YYYY"),
      priority: selectedValue,
    });
    if (res.status === "SUCCESS") {
      getFilteApi({ pageNo: page.pageNo });
    }
  };

  const handleTableRowClick = (e) => {
    // /reviewer/patients/details
    const targetTd = e.target.closest("td");
    if (targetTd) {
      getFilteredList(allFilters),
      setStorage("routeBackTo", "/reviewer/patients/details");
      getRoutedData(params);
      router?.push(
        { pathname: "/reviewer/patients/details", query: params },
        "/reviewer/patients/details"
      );
      const dataIndex = targetTd.parentElement.rowIndex - 1;
      const clickedData = patinetListAll[dataIndex];
      gotoPatientDetails(clickedData);
    }
  };
  const renderRows = () => {
    return patinetListAll?.length === 0 ? (
      <Empty />
    ) : (
      patinetListAll?.map((data, index) => (
        <tr key={index}>
          <td
            className={TableStyle.firstTdBorder}
            onClick={handleTableRowClick}
          >
            <Tooltip title={data?.patientId}>
              {" "}
              {truncateString(data?.patientId, 20)}
            </Tooltip>
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            <Tooltip title={data?.fileName}>
              {" "}
              {truncateString(data?.fileName, 20)}
            </Tooltip>
          </td>
          {userId != "reviewer@3gencogentai.onmicrosoft.com" && (
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
              style={{ paddingLeft: "30px" }}
            >
              {data?.validDiseaseCount ? data?.validDiseaseCount : "---"}
            </td>
          )}
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data?.allocatedOn
              ? moment(data?.allocatedOn).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data?.dueDate ? moment(data?.dueDate).format("MM-DD-YYYY") : "---"}
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data?.processedDate
              ? moment(data?.processedDate).format("MM-DD-YYYY")
              : "---"}
          </td>

          <td
            className={TableStyle.childBorder}
            style={{ textAlign: "center" }}
            onClick={handleTableRowClick}
          >
            {data?.allocatedByFirstName ||
            data?.allocatedBylastName ||
            data?.allocatedByProfileImage ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {" "}
                <span style={{ marginRight: "10px" }}>
                  {" "}
                  {renderUserPrfoileAvatar(
                    data?.allocatedByFirstName,
                    data?.allocatedBylastName,
                    data?.allocatedByProfileImage,
                    "header"
                  )}
                </span>
                <span>
                  {data?.allocatedByFirstName} {data?.allocatedBylastName}
                </span>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>---</div>
            )}
          </td>
          <td className={TableStyle.childBorder}>
            <AntSelect
              options={priorityOptions}
              placeholder="Set priority"
              className={`custom-ant-select ${TableStyle.customAntSelect}`}
              showSearch={false}
              value={data?.priority ? data?.priority : "Set Priority"}
              onChange={(value) => {
                handlePriorityChange(
                  data?.patientId,
                  value,
                  data?.lastModifiedDate
                );
              }}
            />
          </td>

          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {statusBodyTemplate(data)}
          </td>
        </tr>
      ))
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th style={{ paddingLeft: "60px" }}>PATIENT ID</th>
            <th style={{ paddingLeft: "60px" }}>FILE NAME</th>
            {userId != "reviewer@3gencogentai.onmicrosoft.com" && (
              <th>HCC COUNT</th>
            )}
            <th
              className="text-truncate"
              onClick={() => {
                sortFunction(
                  sortAllocateOrder,
                  setSortAllocateOrder,
                  setSort,
                  "allocatedOn"
                );
              }}
            >
              ALLOCATED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortAllocateOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate"
              onClick={() => {
                sortFunction(sortDueOrder, setSortDueOrder, setSort, "dueDate");
              }}
            >
              DUE DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortDueOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate"
              onClick={() => {
                sortFunction(
                  sortCompleteOrder,
                  setSortCompleteOrder,
                  setSort,
                  "processedDate"
                );
              }}
            >
              COMPLETED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortCompleteOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>

            <th className={TableStyle.rowStyle}> ALLOCATED BY</th>
            <th style={{ paddingLeft: "35px" }}>PRIORITY</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {patinetListAll?.length <= 0 ? (
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
  supervisorActions: supervisorActions.getPriorityChange,
  getFilteredList: reviewerWorkQueueAction.reviewerFilterList,
  getRoutedData: patientSyncActions.getRoutedData,
});
export default connector(PatientTable);
