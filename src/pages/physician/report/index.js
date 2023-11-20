import styles from "./report.module.css";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { ProgressBar } from "primereact/progressbar";

import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";

import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Progress } from 'antd';
import {
  faClose,
  faUpload,
  faCheck,
  faBan,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { patientDetails } from "../../../store/actions/AuthActions";
import { notification } from "antd";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import moment from "moment";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Paginator } from "primereact/paginator";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";

const index = () => {
  const dispatch = useDispatch();

  const controller = new AbortController();
  const signal = controller.signal;

  const navigate = useRouter();
  const [validated, setValidated] = useState(false);
  const [dataValidationList, setDataValidationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;

  const [addPatient, setAddPatient] = useState(false);
  const [addPatientId, setAddPatientId] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [dates, setDates] = useState(null);
  const [compledtedDate, setCompletedDate] = useState(null);

  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
  });
  const [inputValuePatientId, setInputValuePatientId] = useState({
    patientId: "",
    patientName: "",
  });

  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(true);
  const [canMaxPage, setCanMaxPage] = useState(10);

  const [patinetList, setPatinetList] = useState([]);
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [paginationFirst, setPaginationFirst] = useState(0);

  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const statusMessage = {
    subscribed: "Subscribed",
    unsubscribed: "Unsubscribed",
  };

  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
  };
  const filterChangePatientName = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientName"].value = value;
    setFilters(_filters);
  };

  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    // setIsLoading(false);
    getAllList(uId, pageNo, pageSize);
    // fetchData();
  }, []);

  const getAllList = async (uId, pageNo, pageSize) => {
    var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
      var result = response.data.content;
      setTotalElements(response.data.totalElements);

      result.map((res) => {
        resultMap.push({
          patientId: res.patientId,
          patientName: res.patientName,
          fileName: res.fileName,
          computing: res.computing,
          createdAt: res.createdAt,
          lastModifiedDate: res.lastModifiedDate,
          dueDate: res.dueDate,
          processedStatus: res.processedStatus,
          createdAt: res.createdAt,
        });
      });
      var newArray = [];
      newArray = [...patinetListAll, ...resultMap];
      setPatinetListAll(resultMap);

      // console.log(newArray)
      setIsLoading(false);
      setTableLoading(false);
      //     setTimeout(() => {
      //     subscribe(resultMap);
      // }, 3000);
    }
  };

  const addPatientFormId = () => {
    setValidated(false);
    setAddPatientId(true);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = data.patientId;
    inputValue.name = data.patientName;
    setValidated(false);
    setAddPatient(true);
    setIsLoadingBtn(false);
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing == 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push("/physician/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed Please wait",
      });
    }
  };

  const statusBodyTemplate = (rowData) => {
    //   console.log(rowData.computing)
    //   return <span className={`badge badge-success`}>
    //   Processed
    //   <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
    // </span>;

    switch (rowData.computing) {
      case 2:
        return (
          <div className="patient-status">
            <span className={`badge processed-text`}>Processed</span>
          </div>
        );

      case 1:
        return (
          <div className="patient-status">
            <span className={`badge processing-text`}>Processing</span>
          </div>
        );

      case 3:
        return (
          <div className="patient-status">
            <span className={`badge failed-text`}>Failed</span>
          </div>
        );

      case 0:
        return (
          <div className="patient-status">
            <span className={`badge not-started-text`}>Not Started</span>
          </div>
        );
    }
  };

  const processstatusBodyTemplate = (rowData) => {
    //   console.log(rowData.computing)
    //   return <span className={`badge badge-success`}>
    //   Processed
    //   <FontAwesomeIcon className='ml-2 ms-1 ' icon={faCheck} />
    // </span>;

    switch (rowData.processedStatus) {
      case "COMPLETED":
        return (
          <div className="patient-status">
            <span className={`badge badge-success`}>
              COMPLETED
              <FontAwesomeIcon className="ml-2 ms-1 " icon={faCheck} />
            </span>
          </div>
        );

      case "PENDING":
        return (
          <div className="patient-status">
            <span className={`badge badge-primary`}>
              PENDING
              <Spin
                className="ml-2 processingSpin ms-1 text-white"
                size="small"
              />
            </span>
          </div>
        );

      case "DECLINE":
        return (
          <div className="patient-status">
            <span className={`badge badge-danger`}>
              DECLINE
              <FontAwesomeIcon className="ml-2 ms-1 " icon={faClose} />
            </span>
          </div>
        );

      case "NOTCOMPUTED":
        return (
          <div className="patient-status">
            <span className={`badge btn-notstarted`}>
              NOTCOMPUTED
              <FontAwesomeIcon className="ml-2 ms-1 " icon={faBan} />
            </span>
          </div>
        );
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        {rowData.computing == 2 ? (
          <button
            onClick={() => gotoPatientDetails(rowData)}
            className="btn hegiht10 btn-notstarted shadow  sharp me-1 action-btn"
          >
            <EyeOutlined className="text-white" />
          </button>
        ) : (
          <button
            disabled
            className="btn hegiht10 btn-notstarted shadow  sharp me-1 action-btn"
          >
            <EyeInvisibleOutlined className="text-white" />
          </button>
        )}
        <button
          onClick={() => addPatientFile(rowData)}
          className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
        >
          <FontAwesomeIcon icon={faUpload} fontSize={11} />
        </button>
      </div>
    );
  };

  const onPageChange = (e) => {
    console.log(dates);
    console.log(compledtedDate);
    console.log(e);
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
    setTableLoading(true);
    getAllList(localUserId, e.page, e.rows);
    console.log("test");
  };

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div class="content-body">
          {/* {isLoading ? (
            <LoadingSpinner />
          ) : ( */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption  align-items-center">
                        <div className="row filter-contain">
                          <div className="col-xl-3">
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                onChange={(e) => filterChangePatientId(e)}
                                className="form-control new-form-control"
                                placeholder="Patient Id"
                              />
                            </div>
                          </div>
                          <div className="col-xl-3">
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                onChange={(e) => filterChangePatientName(e)}
                                className="form-control new-form-control"
                                placeholder="Patient Name"
                              />
                            </div>
                          </div>
                          <div className="col-xl-3">
                            <div class="form-group has-search">
                              <Calendar
                                className="form-control new-form-control calender-pri-input"
                                value={dates}
                                onChange={(e) => setDates(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                placeholder="Due Date"
                              />
                            </div>
                          </div>

                          <div className="col-xl-3">
                            <Button
                              onClick={addPatientFormId}
                              className={styles.export}
                            >
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        <DataTable
                          value={patinetListAll}
                          paginator={false}
                          rows={10}
                          rowsPerPageOptions={[10, 25, 50, 100]}
                          dataKey="id"
                          filters={filters}
                          filterDisplay="menu"
                          className="custom-table"
                          rowClassName="custom-row"
                        >
                          <Column
                            header="SI.NO"
                            headerStyle={{ width: "3rem" }}
                            body={(data, options) =>
                              paginationFirst + options.rowIndex + 1
                            }
                            bodyStyle={{
                              borderLeft: " 0.2px solid #241571",
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          ></Column>

                          <Column
                            field="patientId"
                            header="Patient Id"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
                          <Column
                            field="patientName"
                            header="Patient Name"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
                          <Column
                            field="fileName"
                            header="File Name"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
                          <Column
                            field="hcc"
                            body={statusBodyTemplate}
                            header="HCC Code"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
                          <Column
                            field="suggestionCodes"
                            body={processstatusBodyTemplate}
                            header="SUGGESTION CODES"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
                          <Column
                            field="deletedCodes"
                            body={(data) =>
                              moment(data.dueDate).format("MM-DD-YYYY")
                            }
                            sortable
                            header="Deleted Codes"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
                          <Column
                            field="totalIcdCodes"
                            body={(data) =>
                              moment(data.dueDate).format("MM-DD-YYYY hh:MM:A")
                            }
                            sortable
                            header="Total ICD Codes"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
 <Column
  field="quality"
  header="Quality"
  body={(data) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
     
       <Progress type="circle" percent={50} size={30} />

    </div>
  )}
  bodyStyle={{
    borderTop: "0.2px solid #241571",
    borderBottom: "0.2px solid #241571",
  }}
/>


                          <Column
                            field="comments"
                            body={(data) => (
                              <div>
                                <input
                                  type="text"
                                  value={data.comments} // Assuming 'comments' is the field in your data
                                  placeholder="Add Comment"
                                  style={{ width: "100%", padding: "5px" }}
                                />
                              </div>
                            )}
                            header="Comments"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                            }}
                          />
                        <Column
                            field="patientName"
                            header="Coder Name"
                            bodyStyle={{
                              borderTop: " 0.2px solid #241571",
                              borderBottom: " 0.2px solid #241571",
                              borderRight: " 0.2px solid #241571",

                            }}
                          />
                        </DataTable>
                        <div className="pagination-container">
                          <Paginator
                            first={paginationFirst}
                            rows={10}
                            totalRecords={totalElements}
                            onPageChange={onPageChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default index;
