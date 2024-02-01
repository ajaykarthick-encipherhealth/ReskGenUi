import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../table.module.css";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Tooltip,
  notification,
  Select as AntSelect,
  Empty,
} from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import AllocatedUserCard from "../../allocatedUserDetails/AllocatedUserCard";
import visitStyles from "../../../styles/visitdata.module.css";
import { SVGICON } from "../../../jsx/constant/theme";
import { getPriorityChange } from "../../../store/actions/PatientsActions";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Paginator } from "primereact/paginator";
import SpinnerDots from "../../spinner";
import {
  priorityOptions,
  sortFunction,
  renderUserPrfoile,
  renderUserPrfoileAvatar,
} from "../../headerFilters/functions";

const { Option } = AntSelect;

function PatientTable({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
  patientDetails,
  paginationFirst,
  totalElements,
  onPageChange,
  setSort,
}) {
  const [sortDueOrder, setSortDueOrder] = useState("ASC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("ASC");
  const [detailsContent, setDetailsContent] = useState(patinetListAll);
  const [sortAllocateOrder, setSortAllocateOrder] = useState("ASC");

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

  const handlePriorityChange = (patientId, selectedValue) => {
    setSelectedPriority((prev) => ({
      ...prev,
      id: patientId,
      value: selectedValue,
    }));
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

  const dummyProfileImageUrl =
    "https://avatars.githubusercontent.com/u/68529028?s=64&v=4";
  const nullImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU";
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
            {data.patientId}
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.patientName}
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.allocatedOn
              ? moment(data.allocatedOn).format("MM-DD-YYYY")
              : "---"}
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.dueDate ? moment(data.dueDate).format("MM-DD-YYYY") : "---"}
          </td>
          <td className={TableStyle.childBorder} onClick={handleTableRowClick}>
            {data.processedDate
              ? moment(data.processedDate).format("MM-DD-YYYY")
              : "---"}
          </td>
         
          <td
                  className={TableStyle.childBorder}
                  style={{ textAlign: "center" }}
                >
                  {data.allocatedByFirstName || data.allocatedBylastName || data?.allocatedByProfileImage ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {" "}
                      <span style={{ marginRight: "10px" }}>
                        {" "}
                        {renderUserPrfoileAvatar(
                          data.allocatedByFirstName,
                          data.allocatedBylastName,
                          data?.allocatedByProfileImage,
                          "header"
                        )}
                      </span>
                      <span>
                        {data.allocatedByFirstName} {data.allocatedBylastName}
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
              defaultValue={data?.priority ? data.priority : "Set Priority"}
              disabled={!data?.priority ? true : false}
              onChange={(value) => {
                handlePriorityChange(data?.patientId, value);
                dispatch(
                  getPriorityChange(
                    data?.patientId,
                    dayjs(data?.lastModifiedDate)?.format("YYYY"),
                    value
                  )
                );
              }}
              style={{ width: "80%" }}
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
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th
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

            <th>ALLOCATED BY</th>
            <th>PRIORITY</th>
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

export default PatientTable;
