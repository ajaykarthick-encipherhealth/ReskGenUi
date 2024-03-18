import React, { useState } from "react";
import moment from "moment";
import TableStyle from "../../../../components/table/table.module.css";
import { notification, Select as AntSelect, Empty, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SVGICON } from "../../../../jsx/constant/theme";
import { getPriorityChange } from "../../../../store/actions/PatientsActions";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";

function PatientTable({
  patinetListAll,
  statusBodyTemplate,
  patientDetails,
  setSort,
}) {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [sortDueOrder, setSortDueOrder] = useState("DESC");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("DESC");
  const [sortAuditOrder, setSortAuditOrder] = useState("DESC");

  const priorityOptions = [
    {
      value: "URGENT",
      label: (
        <>
          <i>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>{" "}
        </>
      ),
    },
    {
      value: "HIGH",
      label: (
        <>
          <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>{" "}
        </>
      ),
    },
    {
      value: "NORMAL",
      label: (
        <>
          <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color: "#4466ff " }}>
            Normal
          </span>{" "}
        </>
      ),
    },
    {
      value: "LOW",
      label: (
        <>
          <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>{" "}
        </>
      ),
    },
  ];
  const dummyData = [
    {
      patientId: 1482921,
      patientName: "Alice Smith",
      rafScore: "1.1245",
      dateTime: "Today 9:30 AM",
      priority: "URGENT",
      firstName: "Alice",
      lastName: "Smith",
    },
    {
      patientId: 1482922,
      patientName: "Bob Johnson",
      rafScore: "1.2356",
      dateTime: "Today 10:45 AM",
      priority: "HIGH",
      firstName: "Bob",
      lastName: "Johnson",
    },
    {
      patientId: 1482923,
      patientName: "Eva Martinez",
      rafScore: "1.3142",
      dateTime: "Today 11:20 AM",
      priority: "LOW",
      firstName: "Eva",
      lastName: "Martinez",
    },
    {
      patientId: 1482924,
      patientName: "David Brown",
      rafScore: "1.4567",
      dateTime: "Today 1:00 PM",
      priority: "NORMAL",
      firstName: "David",
      lastName: "Brown",
    },
    {
      patientId: 1482925,
      patientName: "Sophia Lee",
      rafScore: "1.5334",
      dateTime: "Today 2:15 PM",
      priority: "HIGH",
      firstName: "Sophia",
      lastName: "Lee",
    },
    {
      patientId: 1482926,
      patientName: "Michael Johnson",
      rafScore: "1.6723",
      dateTime: "Today 3:30 PM",
      priority: "URGENT",
      firstName: "Michael",
      lastName: "Johnson",
    },
    {
      patientId: 1482927,
      patientName: "Olivia Garcia",
      rafScore: "1.7132",
      dateTime: "Today 4:45 PM",
      priority: "NORMAL",
      firstName: "Olivia",
      lastName: "Garcia",
    },
    {
      patientId: 1482928,
      patientName: "William Martinez",
      rafScore: "1.8256",
      dateTime: "Today 6:00 PM",
      priority: "HIGH",
      firstName: "William",
      lastName: "Martinez",
    },
    {
      patientId: 1482929,
      patientName: "Emily Wilson",
      rafScore: "1.9321",
      dateTime: "Today 7:15 PM",
      priority: "LOW",
      firstName: "Emily",
      lastName: "Wilson",
    },
    {
      patientId: 1482930,
      patientName: "James Taylor",
      rafScore: "2.0145",
      dateTime: "Today 8:30 PM",
      priority: "NORMAL",
      firstName: "James",
      lastName: "Taylor",
    },
    {
      patientId: 1482926,
      patientName: "Michael Johnson",
      rafScore: "1.6723",
      dateTime: "Today 3:30 PM",
      priority: "URGENT",
      firstName: "Michael",
      lastName: "Johnson",
    },
    {
      patientId: 1482927,
      patientName: "Olivia Garcia",
      rafScore: "1.7132",
      dateTime: "Today 4:45 PM",
      priority: "NORMAL",
      firstName: "Olivia",
      lastName: "Garcia",
    },
    {
      patientId: 1482928,
      patientName: "William Martinez",
      rafScore: "1.8256",
      dateTime: "Today 6:00 PM",
      priority: "HIGH",
      firstName: "William",
      lastName: "Martinez",
    },
    {
      patientId: 1482929,
      patientName: "Emily Wilson",
      rafScore: "1.9321",
      dateTime: "Today 7:15 PM",
      priority: "LOW",
      firstName: "Emily",
      lastName: "Wilson",
    },
    {
      patientId: 1482930,
      patientName: "James Taylor",
      rafScore: "2.0145",
      dateTime: "Today 8:30 PM",
      priority: "NORMAL",
      firstName: "James",
      lastName: "Taylor",
    },
  ];



  const handlePriorityChange = (patientId, selectedValue) => {
    setSelectedPriority((prev) => ({
      ...prev,
      id: patientId,
      value: selectedValue,
    }));
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push("/reviewer/patients/details");
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

  const renderRows = () => {
    return dummyData?.length === 0 ? (
      <Empty />
    ) : (
      dummyData?.map((data, index) => (
        <tr key={index}>
          <td
            className={TableStyle.firstTdBorder}
            onClick={handleTableRowClick}
          >
            {data.patientId ? data.patientId : "---"}
          </td>

          <td
            className={TableStyle.childBorder}
            style={{ paddingLeft: "50px" }}
            onClick={handleTableRowClick}
          >
            {data.firstName ||
            data.lastName ||
            data?.patientAllocatedProfileImage ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {" "}
                <span style={{ marginRight: "10px" }}>
                  {" "}
                  {renderUserPrfoileAvatar(
                    data.firstName,
                    data.lastName,
                    data?.patientAllocatedProfileImage,
                    "header"
                  )}
                </span>
                <span>
                  {data.firstName} {data.lastName}
                </span>
              </div>
            ) : (
              <div style={{}}>---</div>
            )}
          </td>
          <td
            className={TableStyle.childBorder}
            style={{ paddingLeft: "50px" }}
            onClick={handleTableRowClick}
          >
            {data?.rafScore ? data?.rafScore : "---"}
          </td>
          <td
            className={TableStyle.childBorder}
            style={{ paddingLeft: "40px" }}
            onClick={handleTableRowClick}
          >
            {data?.dateTime ? data?.dateTime : "---"}{" "}
          </td>

          <td className={TableStyle.childBorder} style={{ width: "200px" }}>
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

          {/* <td className={TableStyle.lastBorder}>{actionBodyTemplate(data)}</td> */}
        </tr>
      ))
    );
  };
  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>MRN NUMBER</th>
            <th className={TableStyle.rowStyle2}>PATIENT NAME</th>
            <th className={TableStyle.rowStyle2}>RAF SCORE</th>
            <th className={TableStyle.rowStyle2}> DATE & TIME</th>

            <th
              onClick={() => {
                sortFunction(
                  sortAuditOrder,
                  setSortAuditOrder,
                  setSort,
                  "auditAllocatedDate"
                );
              }}
              style={{ paddingLeft: "30px" }}
            >
              PRIORITY
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortAuditOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {dummyData?.length <= 0 ? (
            <tr>
              <td colSpan="10">
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
