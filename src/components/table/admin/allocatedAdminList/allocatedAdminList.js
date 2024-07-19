import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { Select as AntSelect, Empty, Spin } from "antd";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";
import { priorityStatus, sortFunction } from "../../../headerFilters/functions";

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
  setSortCompleteOrder
}) {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
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
            dispatch(
              selectedRoWDetails({
                patientId: data?.patientId,
                processStageId: data?.processStageId,
              })
            );
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
              ? moment.utc(data.computedDate).format("MM-DD-YYYY")
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
                onChange={() => {
                  handleRowCheckboxChange(data);
                  setSelectedRowsId((prev) => {
                    const currentIds = prev?.map((item) => item.id);
                    if (!currentIds.includes(data?.patientId)) {
                      return [
                        ...prev,
                        { id: data?.patientId, name: data?.patientName },
                      ];
                    } else {
                      return prev.filter(
                        (item) => item?.id !== data?.patientId
                      );
                    }
                  });
                }}
                checked={selectedRowsId?.some(
                  (item) => item?.id === data?.patientId
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
                    type="checkbox"
                    onClick={() => {
                      setSelectAllChecked(!selectAllChecked);
                    }}
                    style={{
                      width: "20px",
                      height: "20px",
                      flexhrink: "0",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    checked={
                      selectAllChecked &&
                      selectedRowsId?.length === selectedChart?.length
                    }
                    className={
                      selectAllChecked &&
                      selectedRowsId?.length == selectedChart?.length
                        ? TableStyle.customChecked2
                        : ""
                    }
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

export default AllocatedAdminList;
