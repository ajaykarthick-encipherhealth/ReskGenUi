import React, { useState } from "react";
import AppTable from "../../../tables";
import { connect } from "react-redux";
import { renderStatusRoaster } from "../practiceRoasterTable";

const TinRoasterTable = ({
  pageNumber,
  setPageNumber,
  pagination,
  setPagination,
  tinRoasterData,
  tableLoader,
  handleRoasterBtn,
  data,
  setSort,
  sort,
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
      name: "Tin Count",
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
        data={data?.response?.pageResponse?.content}
        column={data?.response?.metaDataDTO.filter((item) => item.active)}
        loader={tableLoader}
        first={pageNumber === 0 ? 0 : pagination}
        totalRecords={data?.response?.pageResponse?.totalElements}
        row={15}
        onPageChange={onPageChange}
        statusBodyTemplate={renderStatusRoaster}
        handleRoasterBtn={handleRoasterBtn}
        setSort={setSort}
        sort={sort}
      />
    </div>
  );
};
const connector = connect(
  (state) => ({
    tinRoasterData: state?.tenantAdmin?.patientSync?.tinRoaster?.data?.response,
    tableLoader:state?.tableView?.tableViewLoading,   
  }),
  {}
);
export default connector(TinRoasterTable);
