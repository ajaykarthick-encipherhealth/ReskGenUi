import { Tooltip } from "antd";
import React from "react";

const statusColors = {
  REJECTED: "text-danger",
  QUERIED: "text-warning",
  APPROVED: "text-success",
  PENDING:"text-warning",
};

function StatusCard({
  number,
  name,
  status,
  reason,
  date,
  queriedto,
  queriedByUserName,
  isLast,
}) {
  return (
    <div className="d-flex position-relative gap-2 mb-4">
        {!isLast && (
        <div
          className="position-absolute "
          style={{
            top: 30,
            bottom: 0,
            left: 14,
            width: "2px",
            backgroundColor: "#E3D0F1",
            zIndex: 0,
            height:250
          }}
        />
      )}
      <Tooltip title={queriedByUserName}>
        <div
          className=" mt-2 rounded-circle cursor-pointer  d-flex align-items-center justify-content-center"
          style={{
            width: 35,
            height: 30,
            background: "#E3D0F1",
            color: "#7F83BD",
            border: "1px solid #E3D0F1",
          }}
        >
          {number}
        </div>
      </Tooltip>

      <div
        style={{ border: "1px solid #BBE6E3" }}
        className={` rounded p-3 w-100 `}
      >
      
        <div className="fw-semibold mb-2">
          <sapn> Queried to :</sapn> {queriedto ? queriedto : "---"}{" "}
        </div>
        <div>
          <span className="fw-semibold mb-4">Status : </span>
          <span className={` p-2 ${statusColors[status]}`}> {status}</span>
        </div>
        {reason && (
          <>
            <div className="text-muted mall mb-1 mt-2">Reason</div>
            <div
              style={{
                border: "1px solid #BBE6E3",
                height: "100px",
                overflow: "scroll",
              }}
              className="w-2 w-100  p-2 rounded  small"
            >
              {reason}
            </div>
          </>
        )}
        <div className="text-muted small mt-2">{date?date:"---"}</div>
      </div>
    </div>
  );
}

export default StatusCard;
