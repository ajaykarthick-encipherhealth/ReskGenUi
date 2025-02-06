import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../table.module.css";
import { Select as AntSelect, Empty, Popover, Tooltip } from "antd";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
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
import { actions as patientSyncActions } from "../../../stores/tenantAdmin/patientSync";
import Legends from "../../legends";

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
  getRoutedData,
  bullets,
  badges,
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
    const targetTd = e.target.closest("td");
    if (targetTd) {
      getFilteredList(allFilters),
        setStorage("routeBackTo", "/reviewer/patients");
      getRoutedData(params);
      router?.push(
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
              className={`text-center ${TableStyle.childBorder}`}
              onClick={handleTableRowClick}
            >
              {data?.validDiseaseCount ? data?.validDiseaseCount : "---"}
            </td>
          )}
          <td
            className={`text-center ${TableStyle.childBorder}`}
            onClick={handleTableRowClick}
          >
            {data?.allocatedOn
              ? moment(data?.allocatedOn).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td
            className={`text-center ${TableStyle.childBorder}`}
            onClick={handleTableRowClick}
          >
            {data?.dueDate ? moment(data?.dueDate).format("MM-DD-YYYY") : "---"}
          </td>
          <td
            className={`text-center ${TableStyle.childBorder}`}
            onClick={handleTableRowClick}
          >
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
          <td className={TableStyle?.childBorder}>
            <AntSelect
              options={priorityOptions}
              placeholder="Set priority"
              className={`custom-ant-select  ${TableStyle.customAntSelect}`}
              showSearch={false}
              disabled
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

          <td
            className={` text-center ${TableStyle.childBorder}`}
            onClick={handleTableRowClick}
          >
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
            <th>PATIENT ID</th>
            <th>FILE NAME</th>
            {userId != "reviewer@3gencogentai.onmicrosoft.com" && (
              <th className="text-center text-truncate">HCC COUNT</th>
            )}
            <th
              className="text-truncate text-center"
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
              <span style={{ cursor: "pointer" }}>
                {sortAllocateOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate text-center"
              onClick={() => {
                sortFunction(sortDueOrder, setSortDueOrder, setSort, "dueDate");
              }}
            >
              DUE DATE
              <span style={{ cursor: "pointer" }}>
                {sortDueOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th
              className="text-truncate text-center"
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
              <span style={{ cursor: "pointer" }}>
                {sortCompleteOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th className={`${TableStyle.rowStyle} text-truncate`}>
              ALLOCATED BY
            </th>
            <th>PRIORITY</th>
            <th className="text-truncate" style={{ textAlign: "center" }}>
              <div className="d-flex align-items-center justify-content-center gap-2">
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
              </div>
            </th>
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
