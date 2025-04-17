import React, { useState } from "react";
import AppTable from "../../../tables";
import { connect } from "react-redux";
import { renderStatusRoaster } from "../practiceRoasterTable";

const ProviderRoasterTable = ({
  pageNumber,
  setPageNumber,
  pagination,
  setPagination,
  providerRoasterData,
  loading,
  handleRoasterBtn,
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
      name: "Provider Count",
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
        loader={loading}
        first={pageNumber === 0 ? 0 : pagination}
        totalRecords={providerRoasterData?.totalElements}
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
    providerRoasterData:
    state?.tenantAdmin?.patientSync?.providerRoaster?.data?.response,
    loading: state?.tenantAdmin?.patientSync?.providerLoader,
  }),
  {}
);
export default connector(ProviderRoasterTable);
