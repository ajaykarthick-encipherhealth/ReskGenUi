import React, { useEffect, useState } from "react";
import { Badge } from "antd";
import TableStyle from "../table.module.css";
import moment from "moment";
import { SVGICON } from "../../../jsx/constant/theme";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";

function CoderReport({
  setModal,
  reportListAll,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);
  
  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    const updatedRows = selectAll ? [] : reportListAll;
    setSelectedRows(updatedRows);
  };

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow.patientId === row.patientId
    );

    let updatedRows;

    if (isSelected) {
      updatedRows = selectedRows.filter(
        (selectedRow) => selectedRow.patientId !== row.patientId
      );
    } else {
      updatedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedRows);
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classTTotalhead}>
          <tr>
            <>
              <th></th>
              <th>PATIENT ID</th>
              <th>PATIENT NAME</th>
              <th>HCC </th>
              <th>COMPLETE DATE </th>
              <th>COMMENTS </th>
              <th>AUDITOR NAME </th>
              <th>RAF SCORE </th>
              <th>Flag </th>
              <th>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <input
                    type="checkbox"
                    onChange={handleHeaderCheckboxChange}
                    style={{
                      paddingTop: "10px",
                      width: "20px",
                      height: "20px",
                      flexhrink: "0",
                      borderRadius: "4px",
                      backgroundColor: "pink",
                    }}
                    checked={selectAll}
                  />
                </div>
              </th>
            </>
          </tr>
        </thead>

        <tbody className={TableStyle.bodytable}>
          {reportListAll?.length > 0 &&
            reportListAll?.map((row, index) => (
              <tr key={index} style={{ padding: " 22px!important" }}>
                {row?.auditedBy && (
                  <td className={TableStyle.firstTdBorder}>
                    <Badge.Ribbon
                      text="Audited"
                      color="#58bad7"
                      placement="start"
                    ></Badge.Ribbon>
                  </td>
                )}
                {row?.auditedBy ? (
                  <>
                    <td
                      style={{
                        borderTop: "0.2px solid #e1e1e1",
                        borderBottom: "  0.2px solid #e1e1e1",
                      }}
                      className={TableStyle.childBorder}
                    >
                      {row?.patientId ? row?.patientId : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.patientName ? row?.patientName : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.validDisease ? row?.validDisease : "000"}
                    </td>
                    <td
                      onClick={setModal(false)}
                      className={TableStyle.childBorder}
                    >
                      {row?.processedDate ? (
                        moment(row?.processedDate).format("MM-DD-YYYY")
                      ) : (
                        <span color="#6e6e6e">MM-DD-YYYY</span>
                      )}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.comments ? SVGICON.comment : SVGICON.emptyComments}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.auditedBy ? row?.auditedBy : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>---</td>
                    <td className={TableStyle.childBorder}>
                      {row?.flag ? SVGICON.filledFlag : SVGICON.emptyFlag}
                    </td>
                    <td className={TableStyle.lastBorder}>
                      <input
                        type="checkbox"
                        onChange={() => {
                          handleRowCheckboxChange(row);
                        }}
                        checked={selectedRows.some(
                          (selectedRow) =>
                            selectedRow.patientId === row.patientId
                        )}
                        style={{
                          width: "20px",
                          height: "20px",
                          flexhrink: "0",
                          borderRadius: "4px",
                          backgroundColor: "pink",
                        }}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className={TableStyle.firstTdBorder}></td>
                    <td
                      style={{
                        borderTop: "0.2px solid #e1e1e1",
                        borderBottom: "  0.2px solid #e1e1e1",
                      }}
                      className={TableStyle.childBorder}
                    >
                      {row?.patientId ? row?.patientId : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.patientName ? row?.patientName : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.validDiseaseCount ? row?.validDiseaseCount : "000"}
                    </td>
                    <td
                      onClick={setModal(false)}
                      className={TableStyle.childBorder}
                    >
                      {row?.processedDate
                        ? moment(row?.processedDate).format("MM-DD-YYYY")
                        : "MM-DD-YYYY"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.comments ? SVGICON.comment : SVGICON.emptyComments}
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.auditedBy ? row?.auditedBy : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>---</td>
                    <td className={TableStyle.childBorder}>
                      {row?.flag ? SVGICON.filledFlag : SVGICON.emptyFlag}
                    </td>
                    <td className={TableStyle.lastBorder}>
                      <input
                        type="checkbox"
                        onChange={() => {
                          handleRowCheckboxChange(row);
                        }}
                        checked={selectedRows.some(
                          (selectedRow) =>
                            selectedRow.patientId === row.patientId
                        )}
                        style={{
                          width: "20px",
                          height: "20px",
                          flexhrink: "0",
                          borderRadius: "4px",
                          backgroundColor: "pink",
                        }}
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={ReportPatientDetails?.length}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {ReportPatientDetails?.length}
        </div>
      </div>
    </div>
  );
}

export default CoderReport;
