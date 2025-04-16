import React, { useState } from "react";
import AppTable from "../../../tables";
import { connect } from "react-redux";
import styles from "../../table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  InfoCircleOutlined,
} from "@ant-design/icons";
export const renderStatusRoaster = (rowData) => {
  const isFailed = rowData.status === "FAILED";
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      <span
        className={`${styles.statusLabel}`}
        style={{
          backgroundColor:
            rowData.status === "SUCCESS"
              ? "#90EE90 "
              : rowData.status === "FAILED"
              ? "#e88d8d"
              : "",
          color:
            rowData.status === "SUCCESS"
              ? "#376e37"
              : rowData.status === "FAILED"
              ? "red"
              : "",
        }}
      >
        {rowData.status}
      </span>

    </div>
  );
};

const PracticeRoasterTable = ({
  pageNumber,
  setPageNumber,
  pagination,
  setPagination,
  practiceRoasterData,
  loading,
  handleRoasterBtn,
}) => {
  const onPageChange = (e) => {
    setPagination(e.first);
    setPageNumber(e.page);
  };
  const columns = [
    {
      name: "File Name",
      value: "fileName",
    },
    {
      name: "Practice Count",
      value: "count",
    },
    {
      name: "Upload Date",
      value: "lastModifiedDate",
      isDate: true,
      isDateAndTime: true,
    },
    {
      name: "Status",
      value: "status",
      batchStatus: true,
    },
    {
      name: "",
      value: "",
      isUpload: true,
    },
  ];

  return (
    <div>
      <AppTable
        data={practiceRoasterData?.content}
        column={columns}
        loader={loading}
        first={pageNumber === 0 ? 0 : pagination}
        totalRecords={practiceRoasterData?.totalElements}
        row={15}
        onPageChange={onPageChange}
        statusBodyTemplate={renderStatusRoaster}
        handleRoasterBtn={handleRoasterBtn}
      />
    </div>
  );
};

const connector = connect(
  (state) => ({
    practiceRoasterData:
      state?.tenantAdmin?.patientSync?.practiceRoaster?.data?.response,
    loading: state?.tenantAdmin?.patientSync?.practiceLoader,
  }),
  {}
);
export default connector(PracticeRoasterTable);
