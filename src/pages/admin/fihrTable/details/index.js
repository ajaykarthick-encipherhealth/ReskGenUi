import React, { useState, useEffect } from "react";
import { Modal, DatePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import styles from "../fihr.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import reportStyles from "../../report/report.module.css";
import {
  getReceivedDetails,
  getReportDetails,
  getSentDetails,
} from "../../../../store/actions/adminAction/ReportActions";
import { getSelectUserList } from "../../../../store/actions/adminAction/DashboardAction";
import SpinnerDots from "../../../../components/spinner";
import { getActiveTab } from "../../../../store/actions/l2Action/AuditReportAction";
import { disableFutureDate } from "../../../../components/headerFilters/functions";
import Selector from "../../../../components/selector";
import { useRouter } from "next/router";
import DetailsTable from "../../../../components/table/admin/FihrPatient/DetailsTable";

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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
    patientCount: "100",
    status: "computed",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
    patientCount: "100",
    status: "computed",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
    patientId: "#1234",
    patientName:"Ether park",
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
  const router = useRouter();
  const dispatch = useDispatch();
  const ExportResponse = useSelector((state) => state.adminReport?.exportRes);

  const ReportPatientDetails = useSelector(
    (state) => state.adminReport?.details
  );
  const SentReportDetails = useSelector(
    (state) => state.adminReport?.sentDetails
  );

  const ReceivedReportDetails = useSelector(
    (state) => state.adminReport?.receivedDetails
  );
  const [status, setStatus] = useState("");
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredCOder, setFilteredCoder] = useState([]);

  const [pageNo, setPageNo] = useState(0);
  const [sentPageNo, setSentPageNo] = useState(0);
  const [receivedPageNo, setReceivedPageNo] = useState(0);

  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paginationReceivedFirst, setPaginationReceivedFirst] = useState(0);
  const [paginationSentFirst, setPaginationSentFirst] = useState(0);

  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [selectedDates, setSelectedDates] = useState(null);

  const [selectedCoderOptReport, setSelectedCoderOptReport] = useState("");

  const [sentSearch, setSentSearch] = useState("");

  const [sort, setSort] = useState({ sortDir: "", sortField: "" });
  const [selectMemberType, setSelectMemberType] = useState("");

  const [select, setSelect] = useState(null);

  const ReceivedOptions = [];
  ReceivedReportDetails?.data?.response?.content?.map((item) => {
    return ReceivedOptions?.push({ label: item.sender, value: item.sender });
  });
  const SentOptions = [];
  const uniqueRoles = new Set();

  const selectUserList = useSelector(
    (state) => state?.AdminDashboardReducers?.selectedUsers
  );

  SentReportDetails?.data?.response?.data?.forEach((data) => {
    data?.receivedUsers?.forEach((item) => {
      const role = item.role;
      if (!uniqueRoles.has(role)) {
        SentOptions.push({ label: role, value: role });
        uniqueRoles.add(role);
      }
    });
  });

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  useEffect(() => {
    dispatch(getSelectUserList(selectMemberType));
  }, [selectMemberType]);
  useEffect(() => {
    setIsLoading(false);
    if (reportActiveTab === "PDF") {
      dispatch(
        getSentDetails(sentPageNo, startDate, endDate, sentSearch, sort)
      );
    }
    if (ExportResponse) {
      setIsModalVisible(false);
    }
  }, [sentPageNo, startDate, endDate, sentSearch, sort, ExportResponse]);

  useEffect(() => {
    setFilteredCoder(ReportPatientDetails?.response);
  }, [ReportPatientDetails]);
  useEffect(() => {
    if (selectedCoderOptReport && !select) {
      dispatch(
        getSelectUserList(
          selectedCoderOptReport === null &&
            selectedCoderOptReport?.value === "All"
            ? ""
            : selectedCoderOptReport?.value
        )
      );
    }
  }, [selectedCoderOptReport]);

  const optionsUser =
    selectUserList?.data?.response?.map((res) => ({
      value: res.userName,
      label: res.firstName + " " + res.lastName,
    })) || [];

  if (optionsUser.length > 0) {
    optionsUser.unshift({ value: "", label: "All" });
  }

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
                      <div className={styles.topHeader}>details</div>
                      <div className={styles.topHeader}>
                        <button
                          className={`${styles.backButtonStyle}`}
                          onClick={() => {
                            router.back();
                          }}
                        >
                          <Image src={leftArrow} />
                        </button>

                        <div className="col-lg-2 mx-2">
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
                        <div className="col-xl-2 mx-2">
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
                        <div className="col-xl-2 mx-2">
                          <div>
                            <Selector
                              selectlabel={"Select Status"}
                              setSelectedOption={setStatus}
                              selectOptions={statusOptions}
                              defaultSelectValue1={""}
                              // isClose={true}
                            />
                          </div>
                        </div>
                        <div className="col-xl-2 mx-2">
                          <div>
                            <Selector
                              selectlabel={"Year of services"}
                              setSelectedOption={setStatus}
                              selectOptions={statusOptions}
                              defaultSelectValue1={""}
                              // isClose={true}
                            />
                          </div>
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
                          <DetailsTable
                            setModal={setModal}
                            paginationFirst={paginationFirst}
                            modal={modal}
                            reportListAll={filteredCOder}
                            onPageChange={onPageChange}
                            tableData={FIHRData}
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

export default Index;
