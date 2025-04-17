import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions as allActions } from  '../../../stores/tenantAdmin/patientAllocation'
import styles from '../../../components/tables/table.module.css'
import AppTable from '../../../components/tables'
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { actions as allPatientSyncAction } from '../../../stores/tenantAdmin/patientSync'
const ReviewerAllocation = ({
  reviewersData,
  loader,
  getAllCheckedReviewers,
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
  batchCount,
  data
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
        const response = await getAllCheckedReviewers({
          fromTenant: true,
          allPatientIds: checked,
          batchCount: batchCount,
        });
  
        if (response?.status === "SUCCESS") {
          const result = response?.response?.patientIds?.map((patient) => ({
            patientId: patient.patientId,
            patientName: patient.patientName,
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
      }
    } else {
      setSelectedUserName((prev) => {
        let updatedSelection = e.target.checked
          ? [...prev, { patientId: row.patientId, patientName: row.patientName }]
          : prev.filter((user) => user.patientId !== row.patientId);
        return updatedSelection;
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
  console.log(data?.response?.pageResponse?.totalElements, "datatest");
  
  const columns = [
    { name: "PATIENT Id", value: "patientId" },
    { name: "PATIENT NAME", value: "patientName" },
    {
      name: "COMPUTED DATE",
      value: "computedDate",
      isDate: true,
      sortable: true,
    },
    { name: "PRIORITY", value: "priority" },
    {
      name: (
        <div>
          {reviewersData?.content?.length > 0 ? (
            <div className="w-full d-flex justify-content-center">
              {checkedLoader ? (
                <Spin
                  indicator={<LoadingOutlined className="text-white font2" />}
                  className={`mx-4 ${styles.spinnerStyle}`}
                />
              ) : (
                <input
                  type="checkbox"
                  onChange={(e) => {
                    let checked = !selectAllChecked;
                    setSelectAllChecked(checked);
                    if (selectedRows?.length < reviewersData?.totalElements) {
                      checked = true;
                      setSelectAllChecked(true);
                    }
                    handleRowCheckboxChange({
                      e,
                      row: null,
                      singleCheck: false,
                      checked,
                    });
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    flexShrink: "0",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  checked={
                    selectedRows?.length === reviewersData?.totalElements
                  }
                  className={`mx-4 ${styles.checkBox} ${
                    selectedRows?.length === reviewersData?.totalElements
                      ? styles.customChecked2
                      : ""
                  }`}
                />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      ),
      value: "patientId",
      isCheckbox: true,
    },
  ];
  return (
    <div className="mt-2">
      <AppTable
        // data={reviewersData?.content}
        // column={columns}
        data={data?.response?.pageResponse?.content}
        column={data?.response?.metaDataDTO.filter((item) => item.active)}
        loader={loader}
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
    getAllCheckedReviewers: allActions.getAllCheckedListForReviewer,
    getSupervisorName: allPatientSyncAction.getSupervisorName,
    getAllReviewerList: allActions.getAllReviewerList,
  }
);

export default connector(ReviewerAllocation);
