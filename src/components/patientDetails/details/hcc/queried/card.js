import React from "react";

const statusColors = {
  REJECTED: "text-danger",
  QUERIED: "text-warning",
  APPROVED: "text-success",
  PENDING:"text-warning",
};

function StatusCard({ number, name, status, reason, date }) {

  return (
    <div className="d-flex gap-2 mb-4">
      <div
        className=" mt-2 rounded-circle   d-flex align-items-center justify-content-center"
        style={{
          width: 25,
          height: 23,
          background: "#E3D0F1",
          color: "#7F83BD",
          border: "1px solid #E3D0F1",
        }}
      >
        {number}
      </div>
      <div style={{border:"1px solid #BBE6E3"}} className={` rounded p-3 w-100 `}>
        <div className="fw-semibold mb-2">
          {name} <span className={` p-2 ${statusColors[status]}`}>{status}</span>
        </div>
        {reason && (
          <>
            <div  className="text-muted mall mb-1">Reason</div>
            <div style={{border:"1px solid #BBE6E3" , height:"100px",overflow:"scroll"}} className="w-2 w-100  p-2 rounded  small">{reason}</div>
          </>
        )}
        <div className="text-muted small mt-2">{date}</div>
      </div>
    </div>
  );
}

export default StatusCard;
