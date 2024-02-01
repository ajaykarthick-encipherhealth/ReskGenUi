import React, { useEffect } from "react";
import { Badge, Empty, Tooltip } from "antd";
import TableStyle from "../../../../components/table/table.module.css";
import { SVGICON } from "../../../../jsx/constant/theme";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import Footer from "../../../../jsx/layouts/Footer";
import dayjs from "dayjs";
import { dateFormate, sortFunction } from "../../../../components/headerFilters/functions";
import visitStyles from "../../../../styles/visitdata.module.css";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";


function CoderReport({
  setModal,
  modal,
  reportListAll,
  paginationFirst,
  ReportPatientDetails,
  onPageChange,
  comments,
  setComments,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
  sortOrder,
  setSortOrder,
  setSort,
}) {
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

  const processstatusBodyTemplate = (rowData) => {
    switch (rowData.auditedStatus) {
      case "AUDIT_PENDING":
        return (
          <div className="patient-status">
            <span
              className={`badge Auditprocessing-text`}
              style={{ color: "#E28213", background: "#FBE7D0 !important" }}
            >
              Pending
            </span>
          </div>
        );

      case "DECLINED":
        return (
          <div className="patient-status">
            <span className={`badge failed-text`} style={{ color: "red" }}>
              Declined
            </span>
          </div>
        );

      case "AUDITHOLD":
        return (
          <div className="patient-status">
            <span
              className={`badge Audithold-text`}
              style={{ color: "#CE9900" }}
            >
              Audit Hold
            </span>
          </div>
        );
      case "REAUDIT":
        return (
          <div className="patient-status">
            <span className={`badge reAudit-text`} style={{ color: "#964B00" }}>
              Re Audit
            </span>
          </div>
        );
      case "AUDITED":
        return (
          <div className="patient-status">
            <span className={`badge audited-text`} style={{ color: "#377880" }}>
              Audited
            </span>
          </div>
        );
      case null:
        return <div className="patient-status">---</div>;
    }
  };

  const getFlag = (data) => {
    switch (data["2023"][0]?.flag) {
      case "PATIENT_NAME_MISSED":
        return (
          <Tooltip title="PATIENT_NAME_MISSED" placement="bottom">
            <i className={visitStyles.name_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PATIENT_DOB_MISSED":
        return (
          <Tooltip title="PATIENT_DOB_MISSED" placement="bottom">
            <i className={visitStyles.dob_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "MRN_ID_MISMATCH":
        return (
          <Tooltip title="MRN_ID_MISMATCH" placement="bottom">
            <i className={visitStyles.id_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_SIGN_MISSED":
        return (
          <Tooltip title="PROVIDER_SIGN_MISSED" placement="bottom">
            <i className={visitStyles.sign_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_SIGNATURE_MISSED":
        return (
          <Tooltip title="PROVIDER_SIGNATURE_MISSED" placement="bottom">
            <i className={visitStyles.signature_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "PROVIDER_CREDENTIAL_MISSED":
        return (
          <Tooltip title="PROVIDER_CREDENTIAL_MISSED" placement="bottom">
            <i className={visitStyles.cred_missed}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PROVIDER_SIGN_STATUS_PENDING":
        return (
          <Tooltip title="PROVIDER_SIGN_STATUS_PENDING" placement="bottom">
            <i className={visitStyles.sign_status}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "NO_HCC_FOUND":
        return (
          <Tooltip title="NO_HCC_FOUND" placement="bottom">
            <i className={visitStyles.no_hcc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "NO_VALID_DOCUMENT_FOUND":
        return (
          <Tooltip title="NO_VALID_DOCUMENT_FOUND" placement="bottom">
            <i className={visitStyles.no_doc_found}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PATIENT_DISEASED":
        return (
          <Tooltip title="PATIENT_DISEASED" placement="bottom">
            <i className={visitStyles.patient_diseased}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );

      case "PATIENT_INACTIVE":
        return (
          <Tooltip title="PATIENT_INACTIVE" placement="bottom">
            <i className={visitStyles.patient_inactive}>
              {SVGICON.emptyFlagSmallLarge}
            </i>
          </Tooltip>
        );
      case "":
        return (
          <Tooltip title="" placement="bottom">
            <i className={visitStyles.patient_inactive}>{SVGICON.emptyFlag}</i>
          </Tooltip>
        );
    }
  };
  return (
    <div className={TableStyle.classContaineer}>
      {reportListAll?.data?.length === 0 ? (
        <Empty />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classTTotalhead}>
            <tr style={{ textAlign: "center" }}>
              <>
                <th></th>
                <th>PATIENT ID</th>
                <th>PATIENT NAME</th>
                <th
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
                  COMPLETE DATE{" "}
                  {sortOrder === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                </th>
                <th>COMMENTS </th>
                <th>AUDITOR NAME </th>
                <th>RAF SCORE </th>
                <th>HCC </th>
                <th>FLAG </th>
                <th>AUDIT STATUS</th>
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
            {reportListAll?.data?.length > 0 &&
              reportListAll?.data?.map((row, index) => (
                <tr
                  key={index}
                  style={{ padding: " 22px !important", textAlign: "center" }}
                >
               
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
                        {dateFormate(dayjs, row?.processedDate)}
                      </td>
                      <td className={TableStyle.childBorder}>
                        <div
                          disabled={row?.comment ? false : true}
                          onClick={() => {
                            if (row?.comment) {
                              setComments(row?.comment);
                              setModal(!modal);
                            }
                          }}
                        >
                          {row?.comment
                            ? SVGICON.comment
                            : SVGICON.emptyComments}
                        </div>
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.auditedBy ? row?.auditedBy : "---"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.rafSum ? row?.rafSum : "000"}{" "}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.validDiseaseCount
                          ? row?.validDiseaseCount
                          : "000"}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {row?.flag ? (
                          getFlag(row?.flag)
                        ) : (
                          <div style={{ marginLeft: "-10px" }}>---</div>
                        )}
                      </td>
                      <td className={TableStyle.childBorder}>
                        {processstatusBodyTemplate(row)}{" "}
                      </td>
                      <td className={TableStyle.lastBorder}>
                        <input
                          type="checkbox"
                          onChange={() => {
                            handleRowCheckboxChange(row);
                          }}
                          checked={selectedRows?.data?.some(
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
                
                </tr>
              ))}
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
      <Footer />
    </div>
  );
}

export default CoderReport;
