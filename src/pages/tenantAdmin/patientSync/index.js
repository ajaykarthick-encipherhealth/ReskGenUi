import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Nav } from "react-bootstrap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import styles from "./fhir.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";
import { disableFutureDate } from "../../../components/headerFilters/functions";
import FHIRPatinetTable from "../../../components/table/tenantTable/fhirPatient/index";
import PdfTable from "../../../components/table/tenantTable/pdfTable";
import RegularButton from "../../../components/button";
import { connect } from "react-redux";
import { actions as allActions } from "../../../stores/tenantAdmin/patientSync";
import { debounce } from "../../../components/input";
import { statusOptions } from "./pdfTable";
import moment from "moment";
import PdfDrawer from "./modals/PdfDrawer";
import FhirDrawer from "./modals/FhirDrawer";

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

const Index = ({ getAllBatches, pdfTableData, pdfLoader }) => {
  const dispatch = useDispatch();
  const patientDetails = useSelector((state) => state.adminReport?.details);
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState();
  const [searchVal, setSearchVal] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [search, setSearch] = useState();
  const [selectedDateRanges, setSelecteddateRanges] = useState([]);
  const [isOpenFhirDrawer, setIsOpenFhirDrawer] = useState(false);
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
    dispatch(getActiveTab(name));
    setSearch();
    setSearchVal([]);
    setSelectedDates(null);
    setSelecteddateRanges([]);
  };
  const debouncedSearch = useCallback(
    debounce((text, setSearchVal, field) => {
      setSearchVal((prev) => {
        const existingIndex = prev.findIndex((item) => item.field === field);
        if (existingIndex !== -1) {
          return prev.map((item, index) => {
            if (index === existingIndex) {
              return { ...item, search: text };
            }
            return item;
          });
        } else {
          return [...prev, { search: text, field: field }];
        }
      });
    }, 1000),
    []
  );
  const getNameSearch = (event) => {
    const value = event.target.value;
    const field = event.target.name;
    setSearch({
      name: event.target.name,
      searchval: value,
    });
    debouncedSearch(value, setSearchVal, field);
  };
  const handleRangePicker = (date, dateString, tabName) => {
    const formattedDates = dateString?.map((date, index) => {
      const formattedDate =
        index === 1
          ? date &&
            `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T23:59:59.999Z`
          : date &&
            `${moment(date, "MM-DD-YYYY").format("YYYY-MM-DD")}T00:00:00.000Z`;
      return formattedDate;
    });
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
    setFilteredCoder(patientDetails?.response);
  }, [patientDetails]);

  useEffect(() => {
    const coderSearchString = searchVal.find(
      (item) => item.field === "initialSearch"
    )?.search;

    if (reportActiveTab) {
      dispatch(getActiveTab(reportActiveTab));
    }
    if (reportActiveTab === "PDF") {
      getAllBatches({
        page: pageNo,
        search: coderSearchString ? coderSearchString : "",
        startDate: selectedDateRanges?.PDF?.from,
        endDate: selectedDateRanges?.PDF?.to,
        batchUploadStatus: selectedOptions?.PDF,
      });
    }
  }, [reportActiveTab, pageNo, selectedDateRanges, searchVal, selectedOptions]);

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div
                        className="d-flex justify-content-between"
                        style={{ width: "98%", margin: "auto" }}
                      >
                        <div className="d-flex">
                          <div className="col-lg-4 mx-2">
                            <label>Search by Name or ID</label>
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                name="initialSearch"
                                onChange={(e) => getNameSearch(e)}
                                value={search ? search?.searchVal : ""}
                                className="form-control new-form-control"
                                placeholder="Search"
                                maxLength={25}
                                onKeyDown={(e) => {
                                  // Prevent input of backslash ("\")
                                  if (e.key === "\\") {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 mx-2">
                            <label>Date</label>
                            <div class="form-group has-search">
                              <RangePicker
                                format="MM-DD-YYYY"
                                value={
                                  selectedDates
                                    ? selectedDates[reportActiveTab]
                                    : undefined
                                }
                                onChange={(dates, dateStrings) => {
                                  // setDateRange(dateStrings);
                                  handleRangePicker(
                                    dates,
                                    dateStrings,
                                    reportActiveTab
                                  );
                                }}
                                disabledDate={(current) =>
                                  disableFutureDate(current)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 mx-2">
                            <label>Status</label>
                            <div className={`custom-react-select1`}>
                              <Select
                                placeholder={"Select"}
                                options={statusOptions}
                                onChange={(selectedOption) => {
                                  dosOnChange(selectedOption, reportActiveTab);
                                }}
                                allowClear
                              />
                            </div>
                          </div>
                          {!reportActiveTab || reportActiveTab==="FHIR" && (
                             <div className="col-xl-4 mx-2">
                             <label>Initiated By</label>
                             <div className={`custom-react-select1`}>
                               <Select
                                 placeholder={"Select"}
                                 options={statusOptions}
                                 onChange={(selectedOption) => {
                                   dosOnChange(selectedOption, reportActiveTab);
                                 }}
                                 allowClear
                               />
                             </div>
                           </div>
                          )}
                        </div>
                        <div className="d-flex mx-1">
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
                              <div
                                className={styles.btnContainer}
                                name="upload trigger"
                                onClick={handleUploadButtonClick}
                              >
                                <RegularButton
                                  name={"Upload"}
                                  width={"150px"}
                                />
                              </div>
                              <div
                                className={styles.btnContainer}
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
                                  <Nav.Link to="#my-posts" eventKey="fhir">
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
                                  <Nav.Link to="#my-posts" eventKey="pdf">
                                    PDF
                                  </Nav.Link>
                                </Nav.Item>
                              </Nav>
                              <Tab.Content>
                                <Tab.Pane id="my-posts" eventKey="fhir">
                                  <FHIRPatinetTable
                                    reportListAll={filteredCOder}
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
                                    tableData={pdfTableData}
                                    selectedBatch={selectedBatch}
                                    loader={pdfLoader}
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
    </>
  );
};
const connector = connect(
  (state) => ({
    pdfTableData: state.tenantAdmin?.patientSync?.allBatches?.data?.response,
    pdfLoader: state.tenantAdmin?.patientSync?.batchLoader,
  }),
  {
    getAllBatches: allActions.getAllBatches,
  }
);
export default connector(Index);
