import React, { useState } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import {
  LoadingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { Select as AntSelect, Empty, Spin, Popover } from "antd";
import Pending from "../../../../../src/images/trackingImages/pending.webp";
import Hold from "../../../../../src/images/trackingImages/hold.webp";
import Completed from "../../../../../src/images/trackingImages/completed.webp";
import Declined from "../../../../../src/images/trackingImages/declined.webp";
import Abort from "../../../../../src/images/trackingImages/abort.webp";
import {
  sortFunction,
  renderUserPrfoileAvatar,
} from "../../../headerFilters/functions";
import { extractLatestData } from "../../../../pages/supervisor/auditing";
import { actions as adminActions } from "../../../../stores/admin/users";
import { actions as allActions } from "../../../../stores/admin/workqueue";
import { formatDateTime } from "../../../../utils/reusable";
function AllocatedL2AdminList({
  patinetListAll,
  selectAllChecked,
  setSelectAllChecked,
  setSelectedRowsId,
  selectedRowsId,
  selectedChart,
  setSort,
  loading,
  sort,
  setSortDueOrder,
  sortDueOrder,
  setSortCompleteOrder,
  sortCompleteOrder,
  selectedRoWDetails,
  setSupervisorPageSize,
  totalElements,
  setBatchCount,
}) {
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
  const processstatusBodyTemplate = (rowData) => {
    const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <Popover placement="bottom" title="Status: COMPLETED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image
                src={Completed}
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </Popover>
        );

      case "PENDING":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );

      case "DECLINED":
        return (
          <Popover
            placement="bottom"
            title="Status: DECLINED"
            content={`Reason: ${
              declinedDataFromDeclined ? declinedDataFromDeclined : "---"
            }`}
          >
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Declined} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "NOTCOMPUTED":
        return (
          <Popover placement="bottom" title="Status: NOT COMPUTED">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "HOLD":
        return (
          <Popover placement="bottom" title="Status: HOLD">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Hold} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case "ABORTED_BY_CRON":
        return (
          <Popover placement="bottom" title="Status: ABORTED BY CRON">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Abort} style={{ height: "30px", width: "30px" }} />
            </div>
          </Popover>
        );
      case null:
        return (
          <Popover placement="bottom" title="Status: PENDING">
            <div className="patient-status" style={{ textAlign: "center" }}>
              <Image src={Pending} style={{ height: "15%", width: "15%" }} />
            </div>
          </Popover>
        );
    }
  };
  const renderRows = () => {
    return patinetListAll?.map((data, index) => (
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
        <td className={TableStyle.firstTdBorder}>{data.patientId}</td>
        <td className={TableStyle.childBorder}>{data.patientName}</td>
        <td className={TableStyle.childBorder} style={{ textAlign: "center" }}>
          {data.patientAllocatedFirstName ||
          data.patientAllocatedLastName ||
          data?.patientAllocatedProfileImage ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
        </td>{" "}
        <td className={TableStyle.childBorder}>
          {data.dueDate ? formatDateTime({date: data.dueDate}) : "---"}
        </td>
        <td className={TableStyle.childBorder}>
          {data.processedDate ? formatDateTime({date: data.processedDate}) : "---"}
        </td>
        <td className={TableStyle.childBorder} style={{ textAlign: "center" }}>
          {processstatusBodyTemplate(data)}
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
              id={data?.patientId}
              name={data?.patientId}
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
                    return prev.filter((item) => item?.id !== data?.patientId);
                  }
                });
              }}
              checked={selectedRowsId.some(
                (item) => item.id === data.patientId
              )}
              className={TableStyle.customChecked}
            />
          )}
        </td>
      </tr>
    ));
  };

  return (
    // <div className={TableStyle.classContaineer}>
    <table className={TableStyle.classTable}>
      <thead className={TableStyle.classThead}>
        <tr>
          <th>PATIENT ID</th>
          <th>PATIENT NAME</th>
          <th style={{ paddingLeft: "60px" }}>REVIEWER</th>
          <th
            id="dueDate"
            name="dueDate"
            style={{ paddingLeft: "20px" }}
            onClick={() => {
              sortFunction(sortDueOrder, setSortDueOrder, setSort, "dueDate");
              // setSortCompleteOrder("DESC");
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
            id="completedDate"
            name="completedDate"
            onClick={() => {
              sortFunction(
                sortCompleteOrder,
                setSortCompleteOrder,
                setSort,
                "processedDate"
              );
              // setSortDueOrder("DESC");
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

          <th style={{ textAlign: "center" }}>STATUS</th>
          {/* <th>Upload</th> */}
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
                  id="selectAll"
                  name="selectAll"
                  type="checkbox"
                  onClick={() => {
                    setSupervisorPageSize(totalElements);
                    // setBatchCount(totalElements)
                    setSelectAllChecked(!selectAllChecked);
                  }}
                  checked={
                    selectAllChecked &&
                    selectedRowsId.length == selectedChart.length &&
                    patinetListAll?.length === selectedRowsId.length
                  }
                  // checked={
                  //   selectAllChecked &&
                  //   selectedRowsId.length === selectedChart.length &&
                  //   patinetListAll?.length === selectedRowsId.length &&
                  //   selectedRowsId.length !== 0
                  // }
                  disabled={totalElements === 0}
                  className={`${
                    (selectAllChecked &&
                      selectedRowsId.length == selectedChart.length &&
                      patinetListAll?.length === selectedRowsId.length) ||
                    (totalElements === selectedRowsId.length &&
                      totalElements !== 0)
                      ? TableStyle.customChecked2
                      : ""
                  }  ${TableStyle.checkInput}`}
                />
              )}
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        {!patinetListAll || patinetListAll?.length <= 0 ? (
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
    // </div>
  );
}

const connector = connect((state) => ({}), {
  selectedRoWDetails: adminActions.selectedRoWDetails,
  patientDetails: allActions.getPatientDetails,
});
export default connector(AllocatedL2AdminList);
