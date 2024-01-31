import React, { useEffect, useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { notification, Select as AntSelect, Empty } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";
import {
  processstatusBodyTemplate,
  sortFunction,
  renderUserPrfoileAvatar
} from "../../../headerFilters/functions";
import SpinnerDots from "../../../spinner";


function AllocatedL2AdminList({
  patinetListAll,
  selectAllChecked,
  setSelectAllChecked,
  setSelectedRowsId,
  selectedRowsId,
  selectedChart,
  setSort,
  isLoading
}) {
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortDueOrder, setSortDueOrder] = useState("ASC");
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
        <td
                  className={TableStyle.childBorder}
                  style={{ textAlign: "center" }}
                >
                  {data.patientAllocatedFirstName || data.patientAllocatedLastName || data?.patientAllocatedProfileImage ? (
                    <div style={{ display: "flex", aligndatas: "center" }}>
                      {" "}
                      <span style={{ marginRight: "10px" }}>
                        {" "}
                        {renderUserPrfoileAvatar(
                          data.patientAllocatedFirstName,
                          data.patientAllocatedLastName,
                          data?.patientAllocatedProfileImage,
                          "header"
                        )}
                      </span>
                      <span>
                        {data.patientAllocatedFirstName} {data.patientAllocatedLastName}
                      </span>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>---</div>
                  )}
                </td>        <td className={TableStyle.childBorder}>
              {data.dueDate
            ? moment.utc(data.dueDate).format("MM-DD-YYYY")
            : "---"}</td>

        <td className={TableStyle.childBorder}>
          {data.processedDate
            ? moment.utc(data.processedDate).format("MM-DD-YYYY")
            : "---"}
        </td>
        <td className={TableStyle.childBorder}>
          {processstatusBodyTemplate(data)}
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
      {isLoading?<SpinnerDots/>:
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th>L1 AUDITOR</th>
            <th
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

            <th>STATUS</th>
            {/* <th>Upload</th> */}
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
}
      <div></div>
    </div>
  ); // const updatedRows = selectAll ? [] : reportListAll;
  // setSelectedRows(updatedRows);;
}

export default AllocatedL2AdminList;
