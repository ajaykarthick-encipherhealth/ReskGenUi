import React, { useState } from "react";
import { connect } from "react-redux";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { Select as AntSelect, Empty, Spin } from "antd";
import { priorityStatus, sortFunction } from "../../../headerFilters/functions";
import { actions as adminActions } from "../../../../stores/admin/users";
import { actions as allActions } from "../../../../stores/admin/workqueue";
import { formatDateTime } from "../../../../utils/reusable";
function AllocatedAdminList({
  patinetListAll,
  selectAllChecked,
  setSelectAllChecked,
  setSelectedRowsId,
  selectedRowsId,
  selectedChart,
  setSort,
  loading,
  sortCompleteOrder,
  setSortCompleteOrder,
  selectedRoWDetails,
  reviewerResponse,
  setSelectedRows,
  selectedRows
}) {
  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow.patientId === row.patientId
    );

    let updatedRows;

    if (isSelected) {
      updatedRows = selectedRows.filter(
        (selectedRow) => selectedRow.patientId !== row.patientId
      );
    } else {
      updatedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedRows);
  };

  const renderRows = () => {
    return patinetListAll?.length > 0 ? (
      patinetListAll?.map((data, index) => (
        <tr
          style={{ height: "35px" }}
          key={index}
          onClick={() => {
            selectedRoWDetails({
              patientId: data?.patientId,
              processStageId: data?.processStageId,
            });
          }}
        >
          <td className={TableStyle.firstTdBorder}>
            {data.patientId ? data.patientId : "---"}
          </td>
          <td className={TableStyle.childBorder}>
            {data.patientName ? data.patientName : "---"}
          </td>

          <td className={TableStyle.childBorder}>
            {data.computedDate
              ? formatDateTime({date: data.computedDate})
              : "---"}
          </td>
          <td className={TableStyle.lastBorder}>
            {data?.priority ? priorityStatus(data?.priority) : "---"}
          </td>
          <td
            className={TableStyle.lastBorder}
            style={{ textAlign: "center", width: "40px" }}
          >
            {loading ? (
              <Spin
                indicator={<LoadingOutlined />}
                style={{ fontSize: 18, color: "#04306f", marginTop: "-15px" }}
              />
            ) : (
              <input
                type="checkbox"
                id={data?.patientId}
                name={data?.patientId}
                onChange={(event) => {
                  handleRowCheckboxChange(data);
                  if (event.target.checked) {
                    setSelectedRowsId((prev) => {
                      const currentIds = prev?.map((item) => item);
                      if (!currentIds.includes(data?.patientId)) {
                        return [...prev, data?.patientId];
                      } else {
                        return prev.filter(
                          (item) => item?.id !== data?.patientId
                        );
                      }
                    });
                  } else {
                    setSelectedRowsId((prev) =>
                      prev.filter((id) => id !== data?.patientId)
                    );
                  }
                }}
                checked={selectedRowsId?.some(
                  (item) => item === data?.patientId
                )}
                className={TableStyle.customChecked}
              />
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5}>
          <Empty />
        </td>
      </tr>
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>

            <th
              id="computedDate"
              name="computedDate"
              onClick={() => {
                sortFunction(
                  sortCompleteOrder,
                  setSortCompleteOrder,
                  setSort,
                  "computedDate"
                );
              }}
            >
              COMPUTED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortCompleteOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
            <th style={{ paddingLeft: "0px" }}>PRIORITY</th>

            <th>
              <div
                style={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {loading ? (
                  <Spin
                    indicator={<LoadingOutlined />}
                    style={{
                      fontSize: 18,
                      color: "#ffff",
                      marginTop: "-15px",
                    }}
                  />
                ) : (
                  <input
                    id="checkall-header"
                    name="checkall-header"
                    type="checkbox"
                    onClick={() => {
                      setSelectAllChecked(!selectAllChecked);
                    }}
                  
                    // checked={
                    //   selectedRowsId?.length ===
                    //   reviewerResponse?.totalElements
                    // }
                    checked={
                      selectedRowsId?.length ===
                        reviewerResponse?.totalElements &&
                      reviewerResponse?.totalElements !== 0
                    }
                    disabled={reviewerResponse?.totalElements === 0}
                    className={`${
                      selectedRowsId?.length ===
                        reviewerResponse?.totalElements &&
                      reviewerResponse?.totalElements !== 0
                        ? TableStyle.customChecked2
                        : ""
                    } ${TableStyle.checkInput} `}
                  />
                )}
              </div>
            </th>
          </tr>
        </thead>

        <tbody>{renderRows()}</tbody>
      </table>
      <div></div>
    </div>
  );
}
const connector = connect(
  (state) => ({
    reviewerResponse:
      state.admin.patientAllocate?.allocatedList?.data?.response
        ?.patientDtoList,
  }),
  {
    selectedRoWDetails: adminActions.selectedRoWDetails,
    patientDetails: allActions.getPatientDetails,
  }
);
export default connector(AllocatedAdminList);
