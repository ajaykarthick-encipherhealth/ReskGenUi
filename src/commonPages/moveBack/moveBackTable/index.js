import React, { useState } from "react";
import AppTable from "../../../components/tables";
import RegularButton from "../../../components/button";

const MoveBackTable = ({data}) => {
  const columns = [
    {
      name: "Tin",
      value: "patientId",
      isShow: true,
      filterKey: "Search",
    },
    {
      name: "Progress",
      value: "batchName",
      isShow: true,
      filterKey: "batch",
    },
    {
      name: "Providers",
      value: "fileName",
      isShow: true,
    },
    {
      name: "Patients",
      value: "validDiseaseCount",
      isShow: true,
    },
    {
      name: "Not Assigned",
      value: "allocatedOn",
      isShow: true,
      filterKey: "allocatedDate",
    },
    {
      name: "Downloading",
      value: "dueDate",

      isDate: true,
      isShow: true,
      filterKey: "dueDate",
    },
    {
      name: "Coder 1",
      value: "processedDate",
      isDate: true,
      isShow: true,
      filterKey: "completedDate",
    },

    {
      name: "Coder 2",
      isShow: true,
    },
    {
      name: "QA",
      value: "",
      isShow: true,
      filterKey: "Priority",
    },
    {
      name: "Downloader Not Complete",
      value: "statusProxy",
      isShow: true,
      filterKey: "Status",
    },
    {
      name: "Complete",
      value: "statusProxy",
      isShow: true,
      filterKey: "Status",
    },
    {
      name: "priority",
      value: "",
      isShow: true,
      filterKey: "",
    },
  ];

  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };

  return (
    <div className="mt-3">
      <div className="mt-3">
        <AppTable
          data={data?.response?.pageResponse?.content}
          column={data?.response?.metaDataDTO.filter((item) => item.active)}
          //   loader={loading}
          pagination={true}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={data?.response?.pageResponse?.totalElements}
          row={15}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default MoveBackTable;
