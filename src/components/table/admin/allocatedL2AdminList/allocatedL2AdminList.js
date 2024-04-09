import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import {
  LoadingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { Select as AntSelect, Empty, Spin, Popover } from "antd";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";
import Pending from "../../../../../src/images/trackingImages/PendingTrack.png";
import Hold from "../../../../../src/images/trackingImages/HoldTrack.png";
import Completed from "../../../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../../../src/images/trackingImages/DeclineTrack.png";
import Abort from "../../../../../src/images/trackingImages/Abort.png";
import {
  sortFunction,
  renderUserPrfoileAvatar,
} from "../../../headerFilters/functions";
import { extractLatestData } from "../../../../pages/supervisor/auditing";

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
          {data.dueDate ? moment.utc(data.dueDate).format("MM-DD-YYYY") : "---"}
        </td>
        <td className={TableStyle.childBorder}>
          {data.processedDate
            ? moment.utc(data.processedDate).format("MM-DD-YYYY")
            : "---"}
        </td>
        <td className={TableStyle.childBorder} style={{ textAlign: "center" }}>
          {processstatusBodyTemplate(data)}
        </td>
        <td className={TableStyle.lastBorder} style={{ textAlign: "center" }}>
          {loading ? (
            <Spin
              loading={loading}
              indicator={<LoadingOutlined spin />}
              style={{ color: "#1677ff" }}
            />
          ) : (
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
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th style={{ paddingLeft: "60px" }}>REVIEWER</th>
            <th
              style={{ paddingLeft: "20px" }}
              onClick={() => {
                sortFunction(sortDueOrder, setSortDueOrder, setSort, "dueDate");
                setSortCompleteOrder("DESC");
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
                setSortDueOrder("DESC");
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
              {patinetListAll && patinetListAll.length > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <input
                    type="checkbox"
                    onClick={() => setSelectAllChecked(!selectAllChecked)}
                    style={{
                      width: "20px",
                      height: "20px",
                      flexhrink: "0",
                      borderRadius: "4px",
                    }}
                    checked={
                      selectAllChecked &&
                      selectedRowsId.length == selectedChart.length
                    }
                    className={
                      selectAllChecked &&
                      selectedRowsId.length == selectedChart.length
                        ? TableStyle.customChecked2
                        : ""
                    }
                  />
                </div>
              )}
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

export default AllocatedL2AdminList;
