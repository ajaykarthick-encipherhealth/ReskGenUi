import React, { useEffect, useState } from "react";
import { Empty, Popover } from "antd";
import TableStyle from "../../table.module.css";
import { Paginator } from "primereact/paginator";
import { selectedRow } from "../../../../store/actions/ReportActions";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../headerFilters/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import FhirDrawer from "../../../../pages/tenantAdmin/fhirTable/fhirModal";
import { useRouter } from "next/router";

function PdfTable({
  paginationFirst,
  onPageChange,
  selectedRows,
  tableData,
  setSelectedBatch,
  selectedBatch,
}) {
  const dispatch = useDispatch();
  const router=useRouter()
  const [filelList, setFileList] = useState();
  useEffect(() => {
    dispatch(selectedRow(selectedRows));
  }, [selectedRows]);

  const dateFormateAlign = (dates) => {
    return dates?.map((res, index) => {
      if (index < 1) {
        // let sectionMapArr = <span>{dayjs(res).format("YYYY")}</span>;
        return res;
      } else if (dates.length - 1 == index) {
        let sectionMapArr = (
          <Popover
            content={
              <>
                {dates?.map((item, i) =>
                  i > 0 ? <div className="text-center">{item}</div> : null
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUploadButtonClick = (row) => {
    setIsDrawerOpen(!isDrawerOpen);
    setSelectedBatch(row);
    setFileList();
  };
  return (
    <div className={TableStyle.classContaineer}>
      {tableData?.content?.length === 0 ? (
        <Empty />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classTTotalhead}>
            <tr>
              <>
                <th>BATCH ID</th>
                <th>PATIENT COUNT</th>
                <th>STATUS </th>
                <th>YEAR OF SERVICE</th>
                <th className={TableStyle.rowAudited}>INITIATED BY </th>
                <th>BATCH INITIATED DATE </th>
              </>
            </tr>
          </thead>

          <tbody className={TableStyle.bodytable}>
            {tableData?.content?.length > 0 ? (
              tableData?.content?.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    const encodedParams = btoa(
                      JSON.stringify({
                        batchId: row?.id,
                      })
                    );

                    // router?.push({
                    //   pathname: `/tenantAdmin/fhirTable/pdfTable`,
                    //   search: `params=${encodedParams}`,
                    // });
                  }}
                >
                  <>
                    <td className={TableStyle.childBorder}>
                      {row?.id ? row?.id : "---"}
                    </td>

                    <td className={TableStyle.childBorder}>
                      {row?.totalFileCount ? row?.totalFileCount : "---"}
                    </td>
                    <td className={TableStyle.childBorder}>
                      <div>
                        <span
                          className="text-capitalize mx-2"
                          style={{
                            color:
                              row.batchUploadStatus === "processing"
                                ? "#2D6187"
                                : row.batchUploadStatus === "completed"
                                ? "#008A0E"
                                : "black",
                          }}
                        >
                          {row.batchUploadStatus
                            ? row.batchUploadStatus
                            : "---"}
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
                      <div className="d-flex justify-content-between">
                        {dateFormate(dayjs, row?.initialedDate)}
                        <div name="upload">
                          <button
                            onClick={() => handleUploadButtonClick(row)}
                            className="btn hegiht10  sharp me-1 action-btn"
                            style={{ background: "#04306f" }}
                          >
                            <FontAwesomeIcon
                              icon={faUpload}
                              fontSize={11}
                              style={{ color: "#ffff" }}
                            />
                          </button>
                        </div>
                      </div>
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
          totalRecords={tableData?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {tableData?.totalElements}
        </div>
      </div>
      <FhirDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        uploadType="upload"
        fileList={filelList}
        setFileList={setFileList}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
      />
    </div>
  );
}

export default PdfTable;
