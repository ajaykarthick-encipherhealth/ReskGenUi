import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { notification, Select as AntSelect, Empty } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";

function AllocatedAdminList({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
  patientDetails,
}) {
  const [sortDueOrder, setSortDueOrder] = useState("asc");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState(patinetListAll);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const dispatch = useDispatch();
  const navigate = useRouter();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState({
    id: "meat-01",
    value: "HIGH",
  });

  const handleHeaderCheckboxChange = () => {
    // setSelectAll(!selectAll);
    // const updatedRows = selectAll ? [] : reportListAll;
    // setSelectedRows(updatedRows);
  };

  const handleAvatarHover = (data) => {
    setHoveredAvatar(data);
  };

  const handleAvatarClick = (data) => {
    gotoPatientDetails(data);
  };

  const requestSort = (key) => {
    console.log(key);
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push("/physician/patients/details");
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

  const TickMark = () => (
    <div style={{ marginLeft: "5pc", textAlign: "end" }}>✓</div>
  );

  const sortTableByDate = (value) => {
    const sortedContent = [...detailsContent];
    if (value === "dueDate") {
      if (sortDueOrder === "asc") {
        sortedContent.sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)));
        setSortDueOrder("desc");
      } else {
        sortedContent.sort((a, b) => dayjs(b.dueDate).diff(dayjs(a.dueDate)));
        setSortDueOrder("asc");
      }
    }
    if (value === "completeDate") {
      if (sortCompleteOrder === "asc") {
        sortedContent.sort((a, b) =>
          dayjs(a.lastModifiedDate).diff(dayjs(b.lastModifiedDate))
        );
        setSortCompleteOrder("desc");
      } else {
        sortedContent.sort((a, b) =>
          dayjs(b.lastModifiedDate).diff(dayjs(a.lastModifiedDate))
        );
        setSortCompleteOrder("asc");
      }
    }
    setDetailsContent(sortedContent);
  };

  const renderRows = () => {
    return detailsContent?.map((data, index) => (
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
        <td className={TableStyle.firstTdBorder} onClick={handleTableRowClick}>
          {data.patientId}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {data.patientName}
        </td>

        {/* <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {data.processedDate
            ? moment(data.processedDate).format("MM-DD-YYYY")
            : "---"}
        </td> */}

        {/* <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
          {statusBodyTemplate(data)}
        </td> */}
        {/* <td className={TableStyle.childBorder}>{actionBodyTemplate(data)}</td> */}
        <td className={TableStyle.lastBorder} style={{ textAlign: "center" }}>
          <input
            type="checkbox"
            onChange={() => {
              handleRowCheckboxChange(row);
            }}
            //   checked={selectedRows?.data?.some(
            //     (selectedRow) =>
            //       selectedRow.patientId === row.patientId
            //   )}
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

            {/* <th
              onClick={() => {
                requestSort("lastModifiedDate");
                sortTableByDate("completeDate");
              }}
            >
              PROCESSED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortCompleteOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th> */}

            {/* <th>STATUS</th> */}
            {/* <th>Upload</th> */}
            <th>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <input
                  type="checkbox"
                  onChange={handleHeaderCheckboxChange}
                  style={{
                    paddingTop: "10px",
                    width: "20px",
                    height: "20px",
                    flexhrink: "0",
                    borderRadius: "4px",
                    backgroundColor: "pink",
                  }}
                  //   checked={selectAll}
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {detailsContent.length <= 0 ? (
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
  ); // const updatedRows = selectAll ? [] : reportListAll;
  // setSelectedRows(updatedRows);;
}

export default AllocatedAdminList;
