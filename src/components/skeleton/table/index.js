import { Skeleton } from "antd";
import React from "react";

const TableSkeleton = () => {
  return (
    <div>
      <div className="skeleton-table">
        <div className="skeleton-header">
          <Skeleton.Input style={{ width: 2000 }} active />
        </div>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton-row">
            <Skeleton.Input style={{ width: 2000 }} active />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
