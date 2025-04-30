import React, { useState } from "react";
import AppTable from "../../../components/tables";
import { connect } from "react-redux";
import { actions as allActions } from "../../../stores/tenantAdmin/patientAllocations";
import styles from "../../../components/tables/table.module.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { actions as tableAction } from "../../../stores/tableView";
import { findItemWithTrueKey } from "../../../utils/reusable";

const MoveBackTable = ({
  getTableData,
  tableLoader,
  getAllCheckedReviewers,
  setSelectedRowsId,
  selectedRows,
  setSelectedRows,
  pageNo,
  setPageNo,
  paginationFirst,
  setPaginationFirst,
  sort,
  setSort,
  data,
  roleId,
  selectedRole,
  statusBodyTemplate,
}) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedLoader, setCheckedLoader] = useState(false);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  const handleRowCheckboxChange = async ({ e, row, singleCheck, checked }) => {
    if (!singleCheck) {
      if (checked) {
        setCheckedLoader(true);
        const response = await getTableData({
          fromTenant: true,
          allPatientIds: checked,
          pageId: "937b0477-f0cd-46e7-b8ab-fefb38f91859",
          pageNo: 0,
          pageSize: 15,
          roleId: roleId,
          selectedRole: selectedRole,
        });

        if (response?.status === "SUCCESS") {
          const result = response?.response?.patientIds?.map((patient) => ({
            patientId: patient.patientId,
            patientName: patient.patientName,
          }));
          setSelectedRows(result?.map((patient) => patient.patientId));
          setSelectedRowsId(result);
        }
        setCheckedLoader(false);
      } else {
        setSelectedRows([]);
        setSelectedRowsId([]);
        setCheckedLoader(false);
      }
    } else {
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
    <div className="mt-3">
      <div className="mt-3">
        <AppTable
          data={data?.response?.pageResponse?.content}
          column={data?.response?.metaDataDTO.filter((item) => item.active)}
          loader={tableLoader}
          handleRowCheckboxChange={handleRowCheckboxChange}
          checkBoxLoader={checkedLoader}
          selectedRows={selectedRows}
          setSort={setSort}
          sort={sort}
          tableId={"reviewer-Allocation-Table"}
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
          statusBodyTemplate={statusBodyTemplate}
        />
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    reviewersData:
      state.tenantAdmin?.patientsAllocation?.reviewersList?.data?.response
        ?.patientDtoList,
    loader: state.tenantAdmin?.patientsAllocation?.loader,
    data: state?.tableView?.tableView?.data,
  }),
  {
    getAllCheckedReviewers: allActions.getAllCheckedListForReviewer,
    getTableData: tableAction.tableDynamicChecked,
  }
);

export default connector(MoveBackTable);
