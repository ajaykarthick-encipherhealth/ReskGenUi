import React, { useEffect, useState } from "react";
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
  selectAllChecked,
  setSelectAllChecked,
  setSelectedRowsId,
  selectedRowsId,
  selectedChart,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortDueOrder, setSortDueOrder] = useState("asc");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState();

  const dispatch = useDispatch();
  const navigate = useRouter();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

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

  useEffect(() => {
    setDetailsContent(patinetListAll);
  }, [patinetListAll]);

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>

            <th
              onClick={() => {
                requestSort("lastModifiedDate");
                sortTableByDate("completeDate");
              }}
            >
              COMPUTED DATE
              <span style={{ padding: "10px", cursor: "pointer" }}>
                {sortCompleteOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>

            {/* <th>STATUS</th> */}
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
          {detailsContent?.length <= 0 ? (
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
