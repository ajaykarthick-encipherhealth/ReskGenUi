import React, { useState } from "react";
import AppTable from "../../../tables";
import styles from "../../table.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { renderStatusRoaster } from "../practiceRoasterTable";

const PatientRoasterTable = ({
  pageNumber,
  setPageNumber,
  pagination,
  setPagination,
  patientRoasterData,
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
      name: "Patient Count",
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
        data={patientRoasterData?.content}
        column={columns}
        loader={loading}
        first={pageNumber === 0 ? 0 : pagination}
        totalRecords={patientRoasterData?.totalElements}
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
    patientRoasterData:
      state?.tenantAdmin?.patientSync?.patientRoaster?.data?.response,
    loading: state?.tenantAdmin?.patientSync?.patientLoader,
  }),
  {}
);
export default connector(PatientRoasterTable);

