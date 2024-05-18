import React from "react";
import { Paginator } from "primereact/paginator";
const Pagination = ({ first, totalRecords, onPageChange }) => {
  return (
    <div className="pagination-container">
      <Paginator
        first={first}
        rows={8}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
      <div className="total-pages">
        Total count: {totalRecords ? totalRecords : "0"}
      </div>
    </div>
  );
};

export default Pagination;
