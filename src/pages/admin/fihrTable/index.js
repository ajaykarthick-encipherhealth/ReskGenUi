import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Nav } from "react-bootstrap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import styles from "./fihr.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";
import { disableFutureDate } from "../../../components/headerFilters/functions";
import Selector from "../../../components/selector";
import FIHRPatinetTable from "../../../components/table/admin/FihrPatient";
import PdfTable from "../../../components/table/admin/pdfTable";
import RegularButton from "../../../components/button";
import FhirDrawer from "./fhirModal";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const { RangePicker } = DatePicker;

const FIHRData = [
  {
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
    batchID: "#1234",
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
];

const Index = () => {
  const dispatch = useDispatch();
  const patientDetails = useSelector((state) => state.adminReport?.details);
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [filteredCOder, setFilteredCoder] = useState([]);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleUploadButtonClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const handleTabs = (name) => {
    dispatch(getActiveTab(name));
  };

  useEffect(() => {
    setFilteredCoder(patientDetails?.response);
  }, [patientDetails]);

  useEffect(() => {
    if (reportActiveTab) {
      dispatch(getActiveTab(reportActiveTab));
    }
  }, [reportActiveTab]);

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div class="content-body">
          {/* {!ReportPatientDetails?.response ? (
            <SpinnerDots />
          ) : ( */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="d-flex">
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
                                onChange={(e) => getNameSearch(e.target.value)}
                                value={""}
                                className="form-control new-form-control"
                                placeholder="Search"
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 mx-2">
                            <label>Date</label>
                            <div>
                              <RangePicker
                                format="MM-DD-YYYY"
                                onChange={(dates, dateStrings) => {
                                  setDateRange(dateStrings);
                                  handleReceivedDatePicker(dates, dateStrings);
                                }}
                                disabledDate={(current) =>
                                  disableFutureDate(current)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 mx-2">
                            <div>
                              <Selector
                                selectlabel={"Select Status"}
                                setSelectedOption={""}
                                selectOptions={[]}
                                defaultSelectValue1={""}
                                // isClose={true}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className={styles.btnContainer}
                          onClick={handleUploadButtonClick}
                        >
                          <RegularButton name={"Upload"} />
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
                                reportActiveTab === "PDF" ? "pdf" : "fihr"
                              }
                            >
                              <Nav as="ul" className="nav nav-tabs">
                                <Nav.Item
                                  as="li"
                                  className="nav-item"
                                  onClick={() => {
                                    handleTabs("FIHR");
                                  }}
                                >
                                  <Nav.Link to="#my-posts" eventKey="fihr">
                                    FIHR
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
                                <Tab.Pane id="my-posts" eventKey="fihr">
                                  <FIHRPatinetTable
                                    reportListAll={filteredCOder}
                                    paginationFirst={paginationFirst}
                                    onPageChange={onPageChange}
                                    tableData={FIHRData}
                                  />
                                </Tab.Pane>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="nonhcc"
                                ></Tab.Pane>
                                <Tab.Pane id="my-posts" eventKey="pdf">
                                  <PdfTable
                                    reportListAll={filteredCOder}
                                    paginationFirst={paginationFirst}
                                    ReportPatientDetails={
                                      patientDetails?.response
                                    }
                                    onPageChange={onPageChange}
                                    tableData={FIHRData}
                                  />
                                </Tab.Pane>
                              </Tab.Content>
                            </Tab.Container>
                          </div>
                        </div>
                        {isDrawerOpen && (
                          <FhirDrawer
                            isDrawerOpen={isDrawerOpen}
                            setIsDrawerOpen={setIsDrawerOpen}
                          />
                        )}
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

export default Index;
