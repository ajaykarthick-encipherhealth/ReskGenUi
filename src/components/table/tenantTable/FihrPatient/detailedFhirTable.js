import React, { useState } from "react";
import { Empty } from "antd";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import Image from "next/image";
import refresh from "../.././../../images/fihr/detailedFhirRefresh.svg";
import styles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
import TableStyle from "../../table.module.css";
import PropTypes from "prop-types";
import SpinnerDots from "../../../spinner";
import reportStyles from "../../../../mainStream/reports/report.module.css";
import { getColors } from "../pdfTable/detailPdfTable";

const DetailedFhirTable = ({
  paginationFirst,
  onPageChange,
  tableData,
  loader,
}) => {
  DetailedFhirTable.propTypes = {
    paginationFirst: PropTypes.any.isRequired,
    onPageChange: PropTypes.func.isRequired,
    tableData: PropTypes.array.isRequired,
  };

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleHeaderCheckboxChange = async () => {
    setSelectAll(!selectAll);

    if (!selectAll) {
      try {
        const selected = tableData?.content?.filter(
          (item) => item?.status === "failed"
        );

        setSelectedRows(selected ? selected : []);
      } catch (error) {}
    } else setSelectedRows([]);
  };

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows?.some(
      (selectedRow) => selectedRow?.mrnNumber === row?.mrnNumber
    );
    let updatedRows;
    if (isSelected) {
      updatedRows = selectedRows?.filter(
        (selectedRow) => selectedRow?.mrnNumber !== row?.mrnNumber
      );
    } else {
      updatedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedRows);
  };
 
  return (
    <div className={TableStyle.classContaineer}>
      {loader ? (
        <SpinnerDots />
      ) : (
        <>
          <table className={TableStyle.classTable}>
            <thead className={TableStyle.classTTotalhead}>
              <tr>
                <th>MRN NUMBER</th>
                <th>COMPUTED DATE TIME</th>
                <th style={{ padding: "0px 0px 0 40px" }}>STATUS</th>
                <th style={{ width: "10%" }}>
                  <div
                    className="d-flex"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ margin: "0px 5px 0 0" }}> ALL</div>
                    <input
                      type="checkbox"
                      onChange={handleHeaderCheckboxChange}
                      className={
                        reportStyles.checkAlign +
                        (selectAll ? " " + TableStyle.customFhirChecked : "")
                      }
                      checked={selectAll}
                    />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className={TableStyle.bodytable}>
              {tableData?.content?.length > 0 ? (
                tableData?.content?.map((row) => (
                  <tr key={row?.mrnNumber} style={{ height: "40px" }}>
                    <td className={TableStyle.childBorder}>
                      {row?.mrnNumber ? row?.mrnNumber : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      <div
                        className="text-capitalize mx-2"
                        style={{
                          fontSize: "16px",
                          display: "flex",
                          margin: "auto",
                          justifyContent: "start",
                          color: getColors(row?.status)?.textColor,
                        }}
                      >
                        <Image
                          src={getColors(row?.status)?.imageSrc}
                          width={18}
                          height={18}
                          style={{ margin: "3px 5px 0 0px" }}
                        />
                        {row?.status}
                        {row?.status === "failed" && (
                          <div className={styles.refreshBtn}>
                            <Image src={refresh} width={15} height={15} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={TableStyle.childBorder}>
                      {row?.computedDateTime
                        ? dayjs(row?.computedDateTime).format(
                            "MM/DD/YYYY hh:mm A"
                          )
                        : "---"}
                    </td>
                    <td
                      className={TableStyle.childBorder}
                      style={{ textAlign: "center" }}
                    >
                      {row?.status === "failed" && (
                        <input
                          type="checkbox"
                          onChange={() => handleRowCheckboxChange(row)}
                          className={TableStyle.customChecked}
                          checked={selectedRows?.some(
                            (selectedRow) =>
                              selectedRow?.mrnNumber === row?.mrnNumber
                          )}
                        />
                      )}
                    </td>
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
          <div className="pagination-container">
            <Paginator
              first={paginationFirst}
              rows={15}
              totalRecords={20}
              onPageChange={onPageChange}
            />
            <div className="total-pages">Total count: {20}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailedFhirTable;
