import React, { useState } from "react";
import AppTable from "../../../components/tables";
import RegularButton from "../../../components/button";
import { connect } from "react-redux";
import { findItemWithTrueKey } from "../../../utils/reusable";

const QueryTable = ({ data ,active , setActive,setActiveStatus,tableLoader}) => {
  const buttons = ["Pending", "Approved", "Rejected"];
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };

  return (
    <div className="mt-3">
      <div>
        {buttons.map((btn) => (
          <RegularButton
            key={btn}
            name={btn}
            type={active === btn ? "primary" : "outline"}
            onClick={() => {
              setActive(btn);
              setActiveStatus(btn.toLocaleUpperCase());
            }}            
          />
        ))}
      </div>
      <div className="mt-3">
        <AppTable
          data={data?.response?.pageResponse?.content}
          column={data?.response?.metaDataDTO.filter((item) => item.active)}
          loader={tableLoader}
          pagination={true}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={data?.response?.pageResponse?.totalElements}
          row={15}
          onPageChange={onPageChange}
          isCheckBox={findItemWithTrueKey(data?.response?.staticDesign,"checkBox")}
        />
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    data: state?.tableView?.tableView?.data,
  }),
  {}
);

export default connector(QueryTable);
