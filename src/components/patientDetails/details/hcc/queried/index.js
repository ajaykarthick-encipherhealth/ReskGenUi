import React from "react";
import StatusCard from "./card";
import { Empty } from "antd";
import TableSkeleton from "../../../../skeleton/table";
import { convertUsFormat } from "../../../../../utils/reusable";

const Index = ({ queriedData, queriedLoader }) => {
  return (
    <div
      style={{ background: "#F5F9FE", height: "100%", overflowY: "scroll" }}
      className="container py-5"
    >
      <div>
        {queriedLoader ? (
          <TableSkeleton />
        ) : queriedData?.response?.length === 0 ? (
          <Empty />
        ) : (
          queriedData?.response?.map((item, index) => (
            <StatusCard
              key={index}
              number={item.queryByName.charAt(0).toUpperCase()}
              name={item.queryByName.toUpperCase()}
              status={item.approvalStatus}
              reason={item.queryReason}
              date={convertUsFormat(item.performedOn)}
              queriedto={item.queryToName}
              queriedByUserName={item.queriedBy}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
