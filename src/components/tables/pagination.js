import { Paginator } from "primereact/paginator";
import React from "react";

const AppPagination = ({paginationFirst, totalElements, onPageChange}) => {
  return (
    <div>
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">Total count: {totalElements}</div>
      </div>
    </div>
  );
};

export default AppPagination;
