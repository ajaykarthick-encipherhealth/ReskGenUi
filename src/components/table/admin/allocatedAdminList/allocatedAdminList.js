import React, { useEffect, useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { notification, Select as AntSelect, Empty } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";
import { sortFunction } from "../../../headerFilters/functions";

function AllocatedAdminList({
  patinetListAll,
  selectAllChecked,
  setSelectAllChecked,
  setSelectedRowsId,
  selectedRowsId,
  selectedChart,
  setSort,
}) {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortCompleteOrder, setSortCompleteOrder] = useState("ASC");

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
    return patinetListAll?.map((data, index) => (
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
        <td className={TableStyle.firstTdBorder}>{data.patientId}</td>
        <td className={TableStyle.childBorder}>{data.patientName}</td>
        
        <td className={TableStyle.childBorder}>
          {data.computedDate
            ? moment.utc(data.computedDate).format("MM-DD-YYYY")
            : "---"}
        </td>
        <td className={TableStyle.lastBorder} style={{ textAlign: "center" }}>
          <input
            type="checkbox"
            onChange={() => {
              handleRowCheckboxChange(data);
              setSelectedRowsId((prev) => {
                const currentIds = prev.map((item) => item.id);
                if (!currentIds.includes(data.patientId)) {
                  return [
                    ...prev,
                    { id: data.patientId, name: data.patientName },
                  ];
                } else {
                  return prev.filter((item) => item.id !== data.patientId);
                }
              });
            }}
            checked={selectedRowsId.some((item) => item.id === data.patientId)}
            style={{
              width: "20px",
              height: "20px",
              flexhrink: "0",
              borderRadius: "4px",
              backgroundColor: "pink",
            }}
          />
        </td>
      </tr>
    ));
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
            <th>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <input
                  type="checkbox"
                  onClick={() => setSelectAllChecked(!selectAllChecked)}
                  style={{
                    paddingTop: "10px",
                    width: "20px",
                    height: "20px",
                    flexhrink: "0",
                    borderRadius: "4px",
                    backgroundColor: "pink",
                  }}
                  checked={
                    selectAllChecked &&
                    selectedRowsId.length == selectedChart.length
                  }
                />
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

export default AllocatedAdminList;
