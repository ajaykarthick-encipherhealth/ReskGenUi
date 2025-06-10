import { Tooltip } from "antd";
import React from "react";
import styles from './style.module.css'

const statusColors = {
  REJECTED: "text-danger",
  QUERIED: "text-warning",
  APPROVED: "text-success",
  PENDING: "text-warning",
};

const  StatusCard =({
  number,
  queryByName,
  status,
  reason,
  date,
  queriedto,
  queriedByUserName,
  isLast,
  queriedToAliasName,
  queriedByAliasName,
}) =>{
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
        <div className="d-flex gap-3 mb-2">
          <span  className={` fw-semibold ${styles.fontColor} `} >
            Queried by :
          </span>
          {queriedByAliasName ? (
            <span
              style={{
                borderRadius: "5px",
                fontSize: "11px",
              }}
              data-testid="table-custom"
              name="table-custom"
              className="px-2 py-1 w-full  font1 text-ellipsis tableButton cursor-default pointer-events-none"
            >
              {queriedByAliasName?.split("_")?.join(" ")}
            </span>
          ) : (
            ""
          )}
          <span style={{ fontStyle: "italic" }}>
            {queryByName ? queryByName : "---"}
          </span>
        </div>
        <div className="d-flex gap-3 mb-2">
        <span  className={` fw-semibold ${styles.fontColor} `} >
            Queried to :
          </span>
          {queriedToAliasName ? (
            <span
              data-testid="table-custom"
              name="table-custom"
              style={{
                borderRadius: "5px",
                fontSize: "11px",
              }}
              className="px-2 py-1 font1  w-full font1  text-ellipsis tableButton cursor-default pointer-events-none"
            >
              {queriedToAliasName?.split("_")?.join(" ")}
            </span>
          ) : (
            ""
          )}

          <span style={{ fontStyle: "italic" }}>
            {queriedto ? queriedto : "---"}
          </span>
        </div>
        <div>
          <span className="fw-semibold mb-4">Status : </span>
          <span className={` p-2 font-bold ${statusColors[status]}`}> {status}</span>
        </div>
        {reason && (
          <>
            <div className="text-muted  mb-1 mt-2">Reason</div>
            <div

              className= {`${styles.reason} w-2 w-100  p-2 rounded  small `}
            >
              {reason}
            </div>
          </>
        )}
        <div className=" d-flex align-items-end justify-content-end text-muted small mt-2">
          {date ? date : "---"}
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
