import styles from "./report.module.css";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Badge, Modal, DatePicker, Checkbox } from "antd";
import Header from "../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Image from "next/image";
import calender from "../../../images/dashboard/calender.png";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Nav } from "react-bootstrap";
import Select from "react-select";

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
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Paginator } from "primereact/paginator";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SentReportTable from "../../../components/table/sentReport/sentReport";
import ReceivedReport from "../../../components/table/receivedReport/receivedReport";
import CoderReport from "../../../components/table/CoderReport/coderReport";
import { getReportDetails } from "../../../store/actions/ReportActions";
import Spinner from "../../../components/spinner/spinner";

const index = () => {
  const dispatch = useDispatch();

  const controller = new AbortController();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [dates, setDates] = useState(null);
  const [compledtedDate, setCompletedDate] = useState(null);

  const [tenantId, setTenantId] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localUserId, setLocalUserId] = useState("");

  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);

  const [totalElements, setTotalElements] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const { RangePicker } = DatePicker;

  const [modalVisible, setModalVisible] = useState(false);
  const currentDate = dayjs();
  const [startDate, setStartDate] = useState(
    currentDate.startOf("month").format("DD MMM YY")
  );
  const [endDate, setEndDate] = useState(currentDate.format("DD MMM YY"));

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const filterChangePatientId = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };
    _filters["patientId"].value = value;
    setFilters(_filters);
  };

  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");
    setTenantId(tenId);
    setLocalOrgId(orgId);
    setLocalUserId(uId);
    setIsLoading(false);
    dispatch(getReportDetails(pageNo));
    // fetchData();
  }, [pageNo]);
  const handleButtonClick = () => {
    setButtonClicked(true);
  };

  const statusOptions = [
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Declined", value: "declined" },
    { label: "Hold", value: "hold" },
  ];
  const dosOnChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
 
  };

  const onPageChange = (e) => {
    // console.log(dates);
    // console.log(compledtedDate);
    // console.log(e);
    // setPaginationFirst(e.first);
    // setPageNo(e.page);
    // setPageSize(e.rows);
    // setTableLoading(true);
    // getAllList(localUserId, e.page, e.rows);
    setPageNo(e?.pageCount)
  };

  function calculateColor(percentage) {
    // Define your color ranges based on the percentage
    if (percentage <= 10) {
      return "#E03838";
    } else if (percentage <= 30) {
      return "#E07E38";
    } else if (percentage <= 50) {
      return "#E0A738";
    } else if (percentage <= 80) {
      return "#387BE0";
    } else if (percentage <= 100) {
      return "#289A00";
    } else {
      return "#E0A738"; // Default color for percentages greater than 50
    }
  }

  const handleExport = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const getAllList = async (uId, pageNo, pageSize) => {
    var resoureUrl = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
    const response = await axios.post(ENDPOINTS.apiEndoint + resoureUrl);
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
  const handleOk = () => {
    setModalVisible(false);
  };
  const handleDatePickerChange = (dateString) => {
    const formattedDates = dateString?.map((item) =>
      dayjs(item).format("DD MMM YY")
    );

    if (formattedDates.length === 2) {
      const [startDate, endDate] = formattedDates;
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };
  

  const ReportPatientDetails = useSelector((state) => state.report.details);
  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div class="content-body">
          {!ReportPatientDetails ? (
            <Spinner />
          ) : (
            
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption  align-items-center">
                        <div className="row filter-contain">
                          <div className="col-xl-2">
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                onChange={(e) => filterChangePatientId(e)}
                                className="form-control new-form-control"
                                placeholder="Search"
                              />
                            </div>
                          </div>
                          <div className="col-xl-2" style={{ zIndex: "999" }}>
                            <div class="form-group has-search">
                              {/* <InputText
                                  type="text"
                                  onChange={(e) => filterChangePatientName(e)}
                                  className="form-control new-form-control"
                                  placeholder="Status"
                                /> */}
                              <Select
                                onChange={(selectedOption) =>
                                  dosOnChange(selectedOption)
                                }
                                options={statusOptions}
                                className="custom-react-select"
                                isSearchable={false}
                              />
                            </div>
                          </div>
                          <div className="col-xl-2">
                           
                          

                                <div>
                                  <RangePicker
                                  
                                  />
                                </div>
                          
                          </div>
                          <div className="col-xl-6">
                            <div className="row flr">
                              <button
                                onClick={handleExport}
                                className={styles.export}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  className="me-2"
                                >
                                  <path
                                    d="M13.7 7.41699C16.7 7.67533 17.925 9.21699 17.925 12.592V12.7003C17.925 16.4253 16.4333 17.917 12.7083 17.917H7.28332C3.55832 17.917 2.06665 16.4253 2.06665 12.7003V12.592C2.06665 9.24199 3.27498 7.70032 6.22498 7.42532"
                                    stroke="#133DD4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M10 12.4999V3.0166"
                                    stroke="#133DD4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M12.7916 4.87467L9.9999 2.08301L7.20825 4.87467"
                                    stroke="#133DD4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                                Export
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Modal
                        title="Export "
                        visible={isModalVisible}
                        onCancel={closeModal}
                        footer={[
                          <Button key="close" onClick={closeModal}>
                            Submit
                          </Button>,
                        ]}
                        style={{ top: "150px", left: "625px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            margin: "0 5pc",
                          }}
                        >
                          <button
                            key="close"
                            className={styles.excel}
                            onClick={handleButtonClick}
                          >
                            Excel
                          </button>
                          <button
                            key="close"
                            className={styles.excel}
                            onClick={handleButtonClick}
                          >
                            CSV
                          </button>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "16px",
                            margin: "20px 0",
                          }}
                        >
                          <Checkbox>Patient Id </Checkbox>
                          <Checkbox>Patient name </Checkbox>
                          <Checkbox>HCC </Checkbox>
                          <Checkbox>Suggestion </Checkbox>
                          <Checkbox>Deleted </Checkbox>
                          <Checkbox>Total codes </Checkbox>
                          <Checkbox>Completed date </Checkbox>
                          <Checkbox>Comments </Checkbox>
                          <Checkbox>Auditor name </Checkbox>
                          <Checkbox>Flag </Checkbox>
                        </div>
                      </Modal>

                      <div
                        id="task-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                      >
                        <div
                          className="profile-tab "
                          style={{ marginTop: "20px" }}
                        >
                          <div className="custom-tab-1">
                            <Tab.Container defaultActiveKey="validDiseases">
                              <Nav as="ul" className="nav nav-tabs">
                                <Nav.Item as="li" className="nav-item">
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="validDiseases"
                                  >
                                    Coder Report
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li" className="nav-item">
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="comboDiseases"
                                  >
                                    Sent Report
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li" className="nav-item">
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="meatCriteria"
                                  >
                                    Received Report
                                  </Nav.Link>
                                </Nav.Item>
                              </Nav>
                              <Tab.Content>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="validDiseases"
                                >
                                  <CoderReport
                                    setModal={setModal}
                                    reportListAll={ReportPatientDetails?.data}
                                    paginationFirst={paginationFirst}
                                    ReportPatientDetails={ReportPatientDetails}
                                    onPageChange={onPageChange}
                                  />
                                </Tab.Pane>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="nonhcc"
                                ></Tab.Pane>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="comboDiseases"
                                >
                                  <SentReportTable />
                                </Tab.Pane>
                                <Tab.Pane id="my-posts" eventKey="meatCriteria">
                                  <ReceivedReport />
                                </Tab.Pane>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="RafScore"
                                ></Tab.Pane>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="file"
                                ></Tab.Pane>
                              </Tab.Content>
                            </Tab.Container>
                          </div>
                        </div>

                        
                        {modal && (
                          <Modal
                            title="Comments"
                            centered
                            open={modal}
                            onOk={handleCloseModal}
                            onCancel={handleCloseModal}
                            footer={null}
                          >
                            <div className="offcanvas-body">
                              <div className="container-fluid">
                                <div className={styles.heads}>
                                  <span className={styles.headText}>
                                    Hcc codes
                                  </span>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>Visit Data</div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>
                                    Combination codes
                                  </div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>
                                    M.E.A.T criteria
                                  </div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.heads}>
                                  <span className={styles.headText}>
                                    Radiology{" "}
                                  </span>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>Visit Data</div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                                <div className={styles.data}>
                                  <div className={styles.datas}>
                                    Combination codes
                                  </div>
                                  <div className={styles.description}>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Modal>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           )} 
        </div>
      </div>
    </>
  );
};

export default index;
