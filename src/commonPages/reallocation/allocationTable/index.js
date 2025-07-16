import React, { useState } from "react";
import { connect } from "react-redux";
import { actions as allActions } from "../../../stores/tenantAdmin/patientAllocations";
import AppTable from "../../../components/tables";
import { findItemWithTrueKey } from "../../../utils/reusable";
import { actions as tableAction } from "../../../stores/tableView";
const ReAllocationTable = ({
  setSelectedRowsId,
  selectedRows,
  setSelectedRows,
  pageNo,
  setPageNo,
  paginationFirst,
  setPaginationFirst,
  setSelectedUserName,
  sort,
  setSort,
  data,
  tableLoader,
  getTableData,
  roleId,
  search,
  setCheckedHeader,
  statusBodyTemplate,
  selectedDateRanges,
  searchText,
  selectedOption,
  roleAliasName,
}) => {
  const currentPageIds =
    data?.response?.pageResponse?.content?.map((item) => item.id) || [];
  const [checkedLoader, setCheckedLoader] = useState(false);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  const handleRowCheckboxChange = async ({ e, row, singleCheck, checked }) => {
    if (!singleCheck) {
      if (checked) {
        setCheckedLoader(true);
        setCheckedHeader(true);
        const response = await getTableData({
          fromTenant: true,
          allPatientIds: checked,
          pageId: "21235203-2ce0-4ebc-b6d3-05a9d8e8fc75",
          pageNo: 0,
          pageSize: 15,
          roleId: roleId,
          search,
          searchText,
          selectedOption,
          selectedDateRanges,
          isMasterAudit:roleAliasName === "MASTER_AUDIT" ? true : false,
        });

        if (response?.status === "SUCCESS") {
          const result = response?.response?.patientIds?.map((patient) => ({
            patientId: patient.patientId,
            username: patient.userName,
            roleId :patient.roleId
          }));
          setSelectedRows(result.map((patient) => patient.patientId));
          setSelectedRowsId(result);
          setSelectedUserName(result);
        }
        setCheckedLoader(false);
      } else {
        setSelectedRows([]);
        setSelectedRowsId([]);
        setSelectedUserName([]);
        setCheckedLoader(false);
        setCheckedHeader(false);
      }
    } else {
      setSelectedUserName((prev) => {
        const patientId = row?.patientId;
        const username = row?.currentStatus?.allocatedTo;
        const roleId = row?.currentStatus?.roleId

        if (e.target.checked) {
          const updatedSelection = prev.some(
            (item) => item.patientId === patientId
          );
          return updatedSelection ? prev : [...prev, { patientId, username , roleId }];
        } else {
          return prev.filter((item) => item.patientId !== patientId);
        }
      });

      setSelectedRows((prev) => {
        let updatedSelection = e.target.checked
          ? [...prev, row.patientId]
          : prev.filter((id) => id !== row.patientId);
        setSelectedRowsId(
          updatedSelection.map((id) => ({
            patientId: id,
            patientName: row.patientName,
          }))
        );
        return updatedSelection;
      });
    }
  };
  return (
    <div className="mt-2">
      <AppTable
        data={data?.response?.pageResponse?.content}
        column={data?.response?.metaDataDTO.filter((item) => item.active)}
        loader={tableLoader}
        handleRowCheckboxChange={handleRowCheckboxChange}
        checkBoxLoader={checkedLoader}
        selectedRows={selectedRows}
        setSort={setSort}
        sort={sort}
        tableId={"re-Allocation-Table"}
        first={pageNo === 0 ? 0 : paginationFirst}
        totalRecords={data?.response?.pageResponse?.totalElements}
        row={15}
        onPageChange={onPageChange}
        isCheckBox={findItemWithTrueKey(
          data?.response?.staticDesign,
          "checkBox"
        )}
         checkedHeader={
          selectedRows?.length ===
            data?.response?.pageResponse?.totalElements &&
          data?.response?.pageResponse?.totalElements !== 0
        }
        setCheckedHeader={setCheckedHeader}
        statusBodyTemplate={statusBodyTemplate}
      />
    </div>
  );
};

const connector = connect(
  (state) => ({
    reviewersData:
      state.tenantAdmin?.patientsAllocation?.reviewersList?.data?.response
        ?.patientDtoList,
    loader: state.tenantAdmin?.patientsAllocation?.loader,
  }),
  {
    getTableData: tableAction.tableDynamicChecked,
    getAllReviewerList: allActions.getAllReviewerList,
  }
);

export default connector(ReAllocationTable);
