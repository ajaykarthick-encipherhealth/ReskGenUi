import React, { useState } from "react";
import AppTable from "../../../components/tables";
import { connect } from "react-redux";
import { actions as allActions } from  '../../../stores/tenantAdmin/patientAllocations'
import styles from '../../../components/tables/table.module.css'
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const MoveBackTable = ({ reviewersData,
  loader,
  getAllCheckedReviewers,
  setSelectedRowsId,
  selectedRows,
  setSelectedRows,
  pageNo,
  setPageNo,
  paginationFirst,
  setPaginationFirst,
  sort,
  setSort,data}) => {

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
        });
  
        if (response?.status === "SUCCESS") {
          const result = response?.response?.patientIds?.map((patient) => ({
            patientId: patient.patientId,
            patientName: patient.patientName,
          }));
          setSelectedRows(result.map((patient) => patient.patientId));
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
  
  // const columns = [
  //   { name: "PATIENT Id", value: "patientId" },
  //   { name: "PATIENT NAME", value: "patientName" },
  //   {
  //     name: "COMPUTED DATE",
  //     value: "computedDate",
  //     isDate: true,
  //     sortable: true,
  //   },
  //   { name: "PRIORITY", value: "priority" },
  //   {
  //     name: (
  //       <div>
  //         {reviewersData?.content?.length > 0 ? (
  //           <div className="w-full d-flex justify-content-center">
  //             {checkedLoader ? (
  //               <Spin
  //                 indicator={<LoadingOutlined className="text-white font2" />}
  //                 className={`mx-4 ${styles.spinnerStyle}`}
  //               />
  //             ) : (
  //               <input
  //                 type="checkbox"
  //                 onChange={(e) => {
  //                   let checked = !selectAllChecked;
  //                   setSelectAllChecked(checked);
  //                   if (selectedRows?.length < reviewersData?.totalElements) {
  //                     checked = true;
  //                     setSelectAllChecked(true);
  //                   }
  //                   handleRowCheckboxChange({
  //                     e,
  //                     row: null,
  //                     singleCheck: false,
  //                     checked,
  //                   });
  //                 }}
  //                 style={{
  //                   width: "20px",
  //                   height: "20px",
  //                   flexShrink: "0",
  //                   borderRadius: "4px",
  //                   cursor: "pointer",
  //                 }}
  //                 checked={
  //                   selectedRows?.length === reviewersData?.totalElements
  //                 }
  //                 className={`mx-4 ${styles.checkBox} ${
  //                   selectedRows?.length === reviewersData?.totalElements
  //                     ? styles.customChecked2
  //                     : ""
  //                 }`}
  //               />
  //             )}
  //           </div>
  //         ) : (
  //           ""
  //         )}
  //       </div>
  //     ),
  //     value: "patientId",
  //     isCheckbox: true,
  //   },
  // ];

  return (
    <div className="mt-3">
      <div className="mt-3">
      <AppTable
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
  }
);

export default connector(MoveBackTable);

