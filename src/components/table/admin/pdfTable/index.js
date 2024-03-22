import React, { useEffect } from "react";
import { Badge, Empty, Popover, Tooltip } from "antd";
import TableStyle from "../../table.module.css";
import { SVGICON } from "../../../../jsx/constant/theme";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  dateFormate,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

function PdfTable({
  reportListAll,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  selectedRows,
  tableData,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  const dateFormateAlign = (dates) => {
    return dates?.map((res, index) => {
      if (index < 1) {
        var sectionMapArr = <span>{moment(res).year()}</span>;
        return sectionMapArr;
      } else if (dates.length - 1 == index) {
        var sectionMapArr = (
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
                {/* <th
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    sortFunction(
                      sortOrder,
                      setSortOrder,
                      setSort,
                      "processedDate"
                    );
                  }}
                >
                  COMPLETED DATE{" "}
                  {sortOrder === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </th> */}
                <th>STATUS </th>
                <th>YEAR OF SERVICE</th>
                <th className={TableStyle.rowAudited}>INITIATED BY </th>
                <th>BATCH INITIATED DATE </th>
              </>
            </tr>
          </thead>

          <tbody className={TableStyle.bodytable}>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr key={index}>
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
                          {row.status}
                        </span>
                        <span>{row.statusValue}</span>
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
                      {row.initiatedByFirstName ||
                      row.initiatedByLastName ||
                      row.auditedByProfileImage ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {" "}
                          <span style={{ marginRight: "10px" }}>
                            {" "}
                            {renderUserPrfoileAvatar(
                              row.initiatedByFirstName,
                              row.initiatedByLastName,
                              row.auditedByProfileImage,
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
                    <td className={TableStyle.childBorder}>
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
          totalRecords={ReportPatientDetails?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {ReportPatientDetails?.totalElements}
        </div>
      </div>
    </div>
  );
}

export default PdfTable;
