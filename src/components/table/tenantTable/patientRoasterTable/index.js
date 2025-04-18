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
  tableLoader,
  data
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
        // data={patientRoasterData?.content}
        // column={columns}
        data={data?.response?.pageResponse?.content}
        column={data?.response?.metaDataDTO.filter((item) => item.active)}
        loader={tableLoader}
        first={pageNumber === 0 ? 0 : pagination}
        totalRecords={data?.response?.pageResponse?.totalElements}
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
      tableLoader:state?.tableView?.tableViewLoading,  
  }),
  {}
);
export default connector(PatientRoasterTable);

