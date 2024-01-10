import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";

import {
  Avatar,
  Tooltip,
  notification,
  Select as AntSelect,
  Empty,
} from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useEffect } from "react";

function TrackingTable({
  patinetListAll,
  statusBodyTemplate,
  patientDetails,
}) {
  const [sortDueOrder, setSortDueOrder] = useState("asc");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState(patinetListAll);

  const dispatch = useDispatch();
  const navigate = useRouter();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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
  useEffect(() => {
    setDetailsContent(patinetListAll)
  }, [patinetListAll])

  const renderRows = () => {
    return patinetListAll?.map((data, index) => (
      <tr key={index}>
        <td className={TableStyle.firstTdBorder} onClick={handleTableRowClick}>
          {data.patientId}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}  >
          {data.patientName}
        </td>
        <td className={TableStyle.childBorder}  style={{textAlign:"center"}}>
          <Tooltip title={data.allocatedBy ? data.allocatedBy : "Praveen"}>
            <Avatar
              style={{
                backgroundColor: "#F3C217 ",
                color: "white",
                cursor: "pointer",
              }}
            >
              {data.allocatedBy
                ? data.allocatedBy.slice(0, 2).toUpperCase()
                : "P"}
            </Avatar>
            {/* {data.allocatedBy ? (
              <img
                src={dummyProfileImageUrl}
                alt="User Avatar"
                width={30}
                height={30}
                style={{ borderRadius: "50%" , marginRight:"5px"}}
              />
            ) : (
              <img
                src={nullImg}
                alt="User Avatar"
                width={30}
                height={30}
                style={{ borderRadius: "50%", marginRight:"10px"}}
              />
            )} */}
          </Tooltip>
        </td>
        <td className={TableStyle.childBorder} style={{textAlign:"left"}}>
          {data?.patientAllocated ?  <Tooltip title={data.patientAllocated }>
            <Avatar
              style={{
                backgroundColor: "#04306f ",
                color: "white",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {data.patientAllocated
                ? data.patientAllocated?.slice(0, 2).toUpperCase()
                : null}
            </Avatar>
            {/* {data.allocatedBy ? (
              <img
                src={dummyProfileImageUrl}
                alt="User Avatar"
                width={30}
                height={30}
                style={{ borderRadius: "50%" , marginRight:"5px"}}
              />
            ) : (
              <img
                src={nullImg}
                alt="User Avatar"
                width={30}
                height={30}
                style={{ borderRadius: "50%", marginRight:"10px"}}
              />
            )} */}
            {data.patientAllocated ? (
              <>
                {data.patientAllocated.split("@")[0].charAt(0).toUpperCase() +
                  data.patientAllocated.split("@")[0].slice(1)}
              </>
            ) : (
              <span style={{textAlign:"center"}}>---</span>
            )}
          </Tooltip> : <span style={{textAlign:"center"}}>---</span> }
         
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}  style={{textAlign:"center"}}>
          {data.allocatedOn
            ? moment(data.allocatedOn).format("MM-DD-YYYY")
            : "---"}
        </td>
        <td className={TableStyle.childBorder} onClick={handleTableRowClick}  style={{textAlign:"center"}}>
          {data.dueDate ? moment(data.dueDate).format("MM-DD-YYYY") : "---"}
        </td>

        <td className={TableStyle.lastBorder} onClick={handleTableRowClick} style={{textAlign:"center"}}>
          {statusBodyTemplate(data)}
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
            <th  style={{textAlign:"center"}}>ALLOCATED BY</th>
            <th  style={{textAlign:"left"}}>ALLOCATED TO</th>
            <th  style={{textAlign:"center"}}>ALLOCATED DATE</th>
            <th
             style={{textAlign:"center"}}
              onClick={() => {
                requestSort("dueDate");
                sortTableByDate("dueDate");
              }}
            >
              DUE DATE
              {/* <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortDueOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span> */}
             
            </th>

            <th style={{textAlign:"center"}}>STATUS</th>
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
  );
}

export default TrackingTable;
