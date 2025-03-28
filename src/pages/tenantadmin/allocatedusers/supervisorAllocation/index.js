import React, {  useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/tenantAdmin/patientAllocations";
import AppTable from "../../../../components/tables";
import { actions as allPatientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import { useRouter } from "next/router";

const SupervisorAllocation = ({
  setSelectedSupervisor,
  supervisorData,
  setPageNo,
  paginationFirst,
  setPaginationFirst,
  pageNo,
  params,
  setSearchText,
  setSelectedOption,
  getRoutedData,
  loading,
  routedData,
  getSupervisorName,
  setViewDetailSupervisor,
}) => {
  const router = useRouter();

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  const handleSupervisorRowClick = (row) => {
    setViewDetailSupervisor(row)
    getRoutedData(params);
    getSupervisorName(row);
    setSelectedSupervisor(row);
  };

  useEffect(() => {
    if (routedData) {
      const { pageNo, selectedOption, searchText, paginationFirst } =
        routedData;
      setPageNo(pageNo ? pageNo : 0);
      setSearchText(searchText);
      setSelectedOption(selectedOption);
      setPaginationFirst(paginationFirst);
    }
  }, [routedData]);
  const columns = [
    {
      name: "NAME",
      value: { first: "firstName", last: "lastName", img: "profileImageUrl" },
      isImage: true,
    },
    {
      name: "AUDIT ALLOCATED",
      value: "totalFileAuditAllocated",
    },
    { name: "AUDIT PROCESSED", value: "totalFileAudited" },
    { name: "AUDIT PENDING", value: "totalFileAuditPending" },
    { name: "AUDIT HOLD", value: "totalFileAuditHold" },
    { name: "AUDIT INVALID", value: "totalFileAuditDeclined" },
  ];

  return (
    <div className="mt-2">
      <div className="mt-2">
        <AppTable
          pageNumber={pageNo}
          setPageNo={setPageNo}
          data={supervisorData?.content}
          column={columns}
          loader={loading}
          onRowClick={handleSupervisorRowClick}
          tableId={"supervisor-allocation-table"}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={supervisorData?.totalElements}
          row={15}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    supervisorData:
      state.tenantAdmin?.patientsAllocation?.supervisorsList?.data?.response,
    allocationListData:
      state.tenantAdmin.patientsAllocation?.allocationList?.data?.response,
    loading: state.tenantAdmin?.patientsAllocation?.supervisorLoaders,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getAllSupervisorList: allActions.getAllSupervisorList,
    allocationList: allActions.getAllAllocationList,
    getAllCheckedReviewers: allActions.getAllCheckedReviewers,
    getRoutedData: allPatientSyncAction.getRoutedData,
    getSupervisorName: allPatientSyncAction.getSupervisorName,
    getSupervisorChecked: allActions.getSelectedSupervisorList,
  }
);

export default connector(SupervisorAllocation);
