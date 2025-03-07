import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, Form, Input, Modal, Select, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Nav } from "react-bootstrap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "react-circular-progressbar/dist/styles.css";
import styles from "./fhir.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { disableFutureDate } from "../../../components/headerFilters/functions";
import FHIRPatinetTable from "../../../components/table/tenantTable/fhirPatient/index";
import DetailedViewPdfTable from "./pdftable";
import PdfTable from "../../../components/table/tenantTable/pdfTable";
import RegularButton from "../../../components/button";
import { actions as allActions } from "../../../stores/tenantAdmin/patientSync";
import { actions as allReportActions } from "../../../stores/admin/report";
import { debounce } from "../../../components/input";
import { statusOptions, statusOptions2 } from "./pdftable";
import moment from "moment";
import PdfDrawer from "./modals/PdfDrawer";
import FhirDrawer from "./modals/FhirDrawer";
import UploadFile from "./uploadfile";
import { connect } from "react-redux";
import { actions as patientSyncAction } from "../../../stores/tenantAdmin/patientSync";
import UploadModal from "./uploadfile/uploadModal";
import { useRouter } from "next/router";
import { disabledDate, formatDateForIndex } from "../../../utils/reusable";
import { useRef } from "react";

const { RangePicker } = DatePicker;

const FHIRData = [
  {
    batchID: "#111",
    batchName: "Batch Name1",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#222",
    batchName: "Batch Name2",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#333",
    batchName: "Batch Name3",
    patientCount: "100",
    status: "completed",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#444",
    batchName: "Batch Name4",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#555",
    batchName: "Batch Name5",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
    failedCount: "200",
  },
  {
    batchID: "#666",
    batchName: "Batch Name6",
    patientCount: "100",
    status: "failed",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#777",
    batchName: "Batch Name7",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#888",
    batchName: "Batch Name8",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#999",
    batchName: "Batch Name9",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
    failedCount: "200",
  },
  {
    batchID: "#101",
    batchName: "Batch Name10",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#102",
    patientCount: "100",
    batchName: "Batch Name11",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#103",
    patientCount: "100",
    batchName: "Batch Name12",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#104",
    patientCount: "100",
    batchName: "Batch Name13",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },

  {
    batchID: "#105",
    batchName: "Batch Name14",
    patientCount: "100",
    status: "failed",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#106",
    batchName: "Batch Name15",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#107",
    batchName: "Batch Name16",
    patientCount: "100",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#108",
    patientCount: "100",
    batchName: "Batch Name17",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
  {
    batchID: "#109",
    patientCount: "100",
    batchName: "Batch Name18",
    status: "processing",
    statusValue: "200/23",
    yearOfService: [
      "2024-03-11T12:16:30.091Z",
      "2023-03-11T12:16:30.091Z",
      "2022-03-11T12:16:30.091Z",
    ],
    initiatedByFirstName: "John",
    initiatedByLastName: "Jacobs",
    initialedDate: "2024-03-11T12:16:30.091Z",
  },
];

const Index = ({
  getAllBatches,
  pdfTableData,
  pdfLoader,
  getActiveTab,
  reportActiveTab,
  routedData,
  webSocketData,
}) => {
    const pickerRef = useRef()
  const router = useRouter();
  const [filteredCOder, setFilteredCoder] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState();
  const [searchVal, setSearchVal] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [search, setSearch] = useState();
  const [selectedDateRanges, setSelecteddateRanges] = useState([]);
  const [isOpenFhirDrawer, setIsOpenFhirDrawer] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [openUpload, setOpenUpload] = useState({ status: false, data: null });
  const [form] = Form.useForm();
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadAction, setUploadAction] = useState(null);
  const [viewDetailedBatch, setViewDetailedBatch] = useState({
    status: false,
    data: null,
  });
  const[socketData,setSocketData]=useState(null)
  const [paramsFilter, setParamsFilter] = useState(null);
  const handleUploadButtonClick = (e) => {
    setIsDrawerOpen(!isDrawerOpen);
    setUploadType(e.target.name);
    setSelectedBatch();
  };
  const handleFhirUpload = (e) => {
    setIsOpenFhirDrawer(!isOpenFhirDrawer);
    setUploadType(e.target.name);
    setSelectedBatch();
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const handleTabs = (name) => {
    getActiveTab(name);
    setSearch();
    setSearchVal(null);
    setSelectedDates(null);
    setSelecteddateRanges([]);
  };
  const debouncedSearch = useCallback(
    debounce((text, setSearchVal, field) => {
      setSearchVal(text);
    }, 1000),
    []
  );
  const getNameSearch = (event) => {
    const value = event.target.value;
    const field = event.target.name;
    setSearch({
      name: event.target.name,
      searchVal: value,
    });
    setPageNo(0);
    setPaginationFirst(0);
    debouncedSearch(value, setSearchVal, field);
  };
  const handleRangePicker = (date, dateString, tabName) => {
    // const formattedDates = dateString?.map((date, index) => {
    //   const formattedDate =
    //     index === 1
    //       ? date &&
    //         `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T23:59:59.999Z`
    //       : date &&
    //         `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T00:00:00.000Z`;
    //   return formattedDate;
    // });
    const formattedDates = dateString?.map((date, index) =>
      formatDateForIndex({ date:date, index:index })
    );

    setSelectedDates((prevOptions) => ({
      ...prevOptions,
      [tabName]: date,
    }));
    setSelecteddateRanges((prevOptions) => ({
      ...prevOptions,
      [tabName]: { from: formattedDates[0], to: formattedDates[1] },
    }));
  };

  const dosOnChange = (selectedOption, name) => {
    const nameString = name?.split(" ").join("");
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [nameString]: selectedOption,
    }));
  };
  useEffect(() => {
    if (routedData) {
      setParamsFilter("check");
      setViewDetailedBatch(routedData?.viewDetailedBatch);
    }
  }, []);
  useEffect(() => {
    setFilteredCoder(null);
    if (reportActiveTab) {
      getActiveTab(reportActiveTab);
    }
  }, []);

  useEffect(() => {
    if (reportActiveTab === "PDF") {
      getAllBatches({
        page: pageNo,
        search: searchVal || "",
        startDate: selectedDateRanges?.PDF?.from,
        endDate: selectedDateRanges?.PDF?.to,
        batchUploadStatus: selectedOptions?.PDF,
      });
    }
  }, [
    reportActiveTab,
    pageNo,
    selectedDateRanges,
    searchVal,
    selectedOptions,
    viewDetailedBatch?.status,
  ]);
  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType === "BATCH_STATUS") {
      const updatedTableData = pdfTableData?.content?.map((item) => {
        if (item?.id === webSocketData?.id) {
          return {
            ...item,
            batchUploadStatus: webSocketData?.batchUploadStatus||"PROCESSING",
          };
        }
        return item;
      });
      setSocketData((prevState) => ({
        ...prevState,
        content: updatedTableData,
      }));
    } 
    // else {
    //   setSocketData(pdfTableData);
    // }
  }, [webSocketData,pdfTableData]);
  return (
    <>
      <Header />
      {viewDetailedBatch?.status ? (
        <DetailedViewPdfTable
          params={{
            batchId: viewDetailedBatch?.data?.id,
            pageNo: pageNo,
            viewDetailedBatch,
            selectedDateRanges,
            selectedOptions,
            search,
            selectedDates,
          }}
          setViewDetailedBatch={setViewDetailedBatch}
          viewDetailedBatch={viewDetailedBatch}
          paramsFilter={paramsFilter}
          setParamsFilter={setParamsFilter}
          setSelectedDates={setSelectedDates}
          setSelecteddateRanges={setSelecteddateRanges}
          setListSearch={setSearch}
          setSelectedOptions={setSelectedOptions}
          setListPageNo={setPageNo}
          setListSearchVal={setSearchVal}
          initialTableData={
            socketData?.content?.length > 0 ? socketData : pdfTableData
          }
        />
      ) : (
        <div className={styles.maincontainer}>
          <div class="content-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="">
                    <div className="card-body p-0">
                      <div className="table-responsive active-projects task-table">
                        <div
                          className="d-flex justify-content-between"
                          style={{ width: "100%", margin: "auto" }}
                        >
                          <div className="d-flex flex-wrap col-10 ">
                            <div className="default-filter-size col-2 col-xl-2 col-md-4 mx-1">
                              <label>Search by Name or ID</label>
                              <div style={{ height: "45px" }}>
                                <Input
                                  type="text"
                                  name="initialSearch"
                                  id="initialSearch"
                                  onChange={(e) => getNameSearch(e)}
                                  value={search?.searchVal || ""}
                                  className={
                                    "w-100 new-search-control border-none"
                                  }
                                  placeholder="Search"
                                  maxLength={25}
                                  onKeyDown={(e) => {
                                    // Prevent input of backslash ("\")
                                    if (e.key === "\\") {
                                      e.preventDefault();
                                    }
                                  }}
                                  prefix={
                                    <FontAwesomeIcon
                                      className="searchPrefix"
                                      icon={faSearch}
                                    />
                                  }
                                  allowClear={true}
                                  autoComplete="off"
                                />
                              </div>
                            </div>
                            <div className="default-filter-size col-2 col-xl-2 col-md-3 mx-1">
                              <label>Date</label>
                              <div class="form-group has-search">
                                <RangePicker
                                 ref={pickerRef}
                                  id="select-date"
                                  name="select-date"
                                  format="MM-DD-YYYY"
                                  value={
                                    selectedDates
                                      ? selectedDates[reportActiveTab]
                                      : undefined
                                  }
                                  onChange={(dates, dateStrings) => {
                                    if (!dates || dates.length === 0) {
                                      setTimeout(() => pickerRef.current?.focus(), 100);
                                    }
                                    handleRangePicker(
                                      dates,
                                      dateStrings,
                                      reportActiveTab
                                    );
                                  }}
                                  onCalendarChange={(val) => {
                                    setSelectedDates((prev) => ({
                                      ...prev,
                                      [reportActiveTab]: val,
                                    }));
                                  }}
                                  disabledDate={(currentDate) => {
                                    const selectedRange = selectedDates
                                      ? selectedDates[reportActiveTab]
                                      : [];
                                    return disabledDate(
                                      currentDate,
                                      selectedRange
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="default-filter-size col-2 col-xl-2 col-md-3 mx-1">
                              <label>Status</label>
                              <div className={`custom-react-select`}>
                                <Select
                                  id="select-status"
                                  name="select-status"
                                  placeholder={"Select"}
                                  options={
                                    reportActiveTab === "FHIR"
                                      ? statusOptions
                                      : statusOptions2
                                  }
                                  onChange={(selectedOption) => {
                                    dosOnChange(
                                      selectedOption,
                                      reportActiveTab
                                    );
                                  }}
                                  value={selectedOptions[reportActiveTab]}
                                  allowClear
                                />
                              </div>
                            </div>
                            {!reportActiveTab ||
                              (reportActiveTab === "FHIR" && (
                                <div className=" default-filter-size col-xl-2 col-md-4 mx-1">
                                  <label>Initiated By</label>
                                  <div className={`custom-react-select`}>
                                    <Select
                                      id="initiated-by"
                                      name="initiated-by"
                                      placeholder={"Select"}
                                      options={statusOptions}
                                      onChange={(selectedOption) => {
                                        dosOnChange(
                                          selectedOption,
                                          reportActiveTab
                                        );
                                      }}
                                      allowClear
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="d-flex mx-1 col-2 justify-content-end">
                            {!reportActiveTab || reportActiveTab === "FHIR" ? (
                              <div
                                className={styles.btnContainer}
                                name="upload"
                                onClick={handleFhirUpload}
                              >
                                <RegularButton
                                  name={"Upload"}
                                  width={"150px"}
                                  type="outlined"
                                />
                              </div>
                            ) : (
                              <>
                                {/* <div
                                className={styles.btnContainer}
                                name="upload trigger"
                                onClick={handleUploadButtonClick}
                              >
                                <RegularButton
                                  name={"Upload"}
                                  width={"150px"}
                                />
                              </div> */}
                                <div
                                  className={
                                    "w-100 d-flex justify-content-end align-items-end"
                                  }
                                  onClick={handleUploadButtonClick}
                                  name="upload"
                                >
                                  <RegularButton name={"Create Batch"} />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div
                          id="task-tbl_wrapper"
                          className="dataTables_wrapper no-footer"
                        >
                          <div
                            className="profile-tab "
                            style={{ marginTop: "20px" }}
                          >
                            <div className="custom-tab-1">
                              <Tab.Container
                                defaultActiveKey={
                                  reportActiveTab === "PDF" ? "pdf" : "fhir"
                                }
                              >
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("FHIR");
                                    }}
                                  >
                                    <Nav.Link
                                      id="fhir"
                                      name="fhir"
                                      to="#my-posts"
                                      eventKey="fhir"
                                    >
                                      FHIR
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item
                                    as="li"
                                    className="nav-item"
                                    onClick={() => {
                                      handleTabs("PDF");
                                    }}
                                  >
                                    <Nav.Link
                                      id="pdf"
                                      name="pdf"
                                      to="#my-posts"
                                      eventKey="pdf"
                                    >
                                      PDF
                                    </Nav.Link>
                                  </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane id="my-posts" eventKey="fhir">
                                    <FHIRPatinetTable
                                      paginationFirst={paginationFirst}
                                      onPageChange={onPageChange}
                                      tableData={FHIRData}
                                    />
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="pdf">
                                    <PdfTable
                                      paginationFirst={paginationFirst}
                                      setSelectedBatch={setSelectedBatch}
                                      onPageChange={onPageChange}
                                      tableData={
                                        socketData?.content?.length > 0
                                          ? socketData
                                          : pdfTableData
                                      }
                                      selectedBatch={selectedBatch}
                                      loader={pdfLoader}
                                      openUpload={openUpload}
                                      setOpenUpload={setOpenUpload}
                                      pageNo={pageNo}
                                      setViewDetailedBatch={
                                        setViewDetailedBatch
                                      }
                                      viewDetailedBatch={viewDetailedBatch}
                                      pdfTableData={pdfTableData}
                                    />
                                  </Tab.Pane>
                                </Tab.Content>
                              </Tab.Container>
                            </div>
                          </div>

                          {isDrawerOpen && (
                            <PdfDrawer
                              isDrawerOpen={isDrawerOpen}
                              setIsDrawerOpen={setIsDrawerOpen}
                              uploadType={uploadType}
                              setUploadType={setUploadType}
                              selectedBatch={selectedBatch}
                              setFileList={setFileList}
                              fileList={fileList}
                              pageNo={pageNo}
                            />
                          )}

                          <FhirDrawer
                            isDrawerOpen={isOpenFhirDrawer}
                            setIsDrawerOpen={setIsOpenFhirDrawer}
                            uploadType={uploadType}
                            setUploadType={setUploadType}
                            selectedBatch={selectedBatch}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <UploadModal
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        setUploadAction={setUploadAction}
        setFileLoading={setFileLoading}
        fileList={fileList}
        setFileList={setFileList}
        fileLoading={fileLoading}
        uploadAction={uploadAction}
        pageNo={pageNo}
        singleUpload={false}
      />
    </>
  );
};
const connector = connect(
  (state) => ({
    pdfTableData: state.tenantAdmin?.patientSync?.allBatches?.data?.response,
    pdfLoader: state.tenantAdmin?.patientSync?.batchLoader,
    reportActiveTab: state.admin?.report?.activeTab,
    uploadFilesLoader: state?.tenantAdmin?.patientSync?.uploadFilesLoader,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
  }),
  {
    getAllBatches: allActions.getAllBatches,
    getActiveTab: allReportActions.activeTab,
    uploadFiles: allActions.upoloadFiles,
    getRoutedData: patientSyncAction.getRoutedData,
  }
);
export default connector(Index);
