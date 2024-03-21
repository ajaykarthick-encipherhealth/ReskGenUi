import React, { useEffect, useState } from "react";
import { Empty, Popover, Tooltip } from "antd";
import warning from "../../../../images/fihr/warning.svg";
import waningFilled from "../../../../images/fihr/warningFilled.svg";
import TableStyle from "../../table.module.css";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../headerFilters/functions";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";

function FIHRPatinetTable({
  reportListAll,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  selectedRows,
  tableData,
}) {
  const dispatch = useDispatch();
  const router=useRouter()
  const [display, setDisplay] = useState({});
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  const dateFormateAlign = (dates) => {
    return dates?.map((res, index) => {
      if (index < 1) {
        let sectionMapArr = <span>{moment(res).year()}</span>;
        return sectionMapArr;
      } else if (dates.length - 1 == index) {
        let sectionMapArr = (
          <Popover
            content={
              <>
                {dates?.map((item, i) =>
                  i > 0 ? (
                    <div className="text-center">{moment(item).year()}</div>
                  ) : null
                )}
              </>
            }
            placement="bottom"
          >
            <span
              style={{ fontSize: "10px" }}
              className={`border border-success-subtle mx-1 p-1 rounded-circle font`}
            >
              {dates.length - 1}+
            </span>
          </Popover>
        );
        return sectionMapArr;
      }
    });
  };

  const handleRow=(row)=>{
    router?.push("/admin/fihrTable/details")
  }
  return (
    <div className={TableStyle.classContaineer}>
      {reportListAll?.data?.length === 0 ? (
        <Empty />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classTTotalhead}>
            <tr>
              <>
                <th>BATCH ID</th>
                <th>PATIENT COUNT</th>
                <th style={{ paddingLeft: "40px" }}>STATUS </th>
                <th>YEAR OF SERVICE</th>
                <th className={TableStyle.rowAudited}>INITIATED BY </th>
                <th style={{textAlign:"center"}}>BATCH INITIATED DATE </th>
              </>
            </tr>
          </thead>

          <tbody className={TableStyle.bodytable}>
            {tableData?.length > 0 ? (
              tableData?.map((row, index) => (
                <tr key={index} onClick={()=>{handleRow(row)}}>
                  <>
                    <td className={TableStyle.childBorder}>
                      {row?.batchID ? row?.batchID : "---"}
                    </td>

                    <td className={TableStyle.childBorder}>
                      {row?.patientCount ? row?.patientCount : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      <div>
                        <span className="text-capitalize mx-2">
                          {row?.status}
                        </span>
                        <span>
                          <span
                            className="customTooltip"
                            onMouseOver={() => {
                              setDisplay((prevState) => ({
                                ...prevState,
                                [index]: true,
                              }));
                            }}
                          >
                            {row?.failedCount && (
                              <Tooltip
                                title={
                                  <span>
                                    <span className={TableStyle?.toolTipCOnt}>
                                      {row?.failedCount}
                                    </span>
                                    <span>Files Pending</span>
                                  </span>
                                }
                              >
                                <Image
                                  onMouseLeave={() => {
                                    setDisplay((prevState) => ({
                                      ...prevState,
                                      [index]: false,
                                    }));
                                  }}
                                  width={15}
                                  height={15}
                                  src={display[index] ? waningFilled : warning}
                                  alt="noimg"
                                  className={TableStyle.imgContainer}
                                />
                              </Tooltip>
                            )}
                          </span>
                          {row?.statusValue}
                        </span>
                      </div>
                    </td>

                    <td className={TableStyle.childBorder}>
                      {row?.yearOfService
                        ? dateFormateAlign(row?.yearOfService)
                        : "000"}
                    </td>
                    <td
                      className={TableStyle.childBorder}
                      style={{ textAlign: "left", paddingLeft: "110px" }}
                    >
                      {row?.initiatedByFirstName ||
                      row?.initiatedByLastName ||
                      row?.auditedByProfileImage ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {" "}
                          <span style={{ marginRight: "10px" }}>
                            {" "}
                            {renderUserPrfoileAvatar(
                              row?.initiatedByFirstName,
                              row?.initiatedByLastName,
                              row?.auditedByProfileImage,
                              "header"
                            )}
                          </span>
                          <span>
                            {row.initiatedByFirstName} {row.initiatedByLastName}
                          </span>
                        </div>
                      ) : (
                        <div style={{ paddingLeft: "70px" }}>---</div>
                      )}
                    </td>
                    <td className={TableStyle.childBorder} style={{textAlign:"center"}}>
                      {dateFormate(dayjs, row?.initialedDate)}
                    </td>
                  </>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11}>
                  <Empty />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={tableData?.length}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {tableData?.length}
        </div>
      </div>
    </div>
  );
}

export default FIHRPatinetTable;
