import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { useRouter } from "next/router";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import styles from "../fhir.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
import { getActiveTab } from "../../../../store/actions/l2Action/AuditReportAction";
import { disableFutureDate } from "../../../../components/headerFilters/functions";
import Selector from "../../../../components/selector";
import computed from "../../../../images/fihr/computed.svg";
import profile from "../../../../images/fihr/profile.svg";
import person from "../../../../images/fihr/person.svg";
import statusIcon from "../../../../images/fihr/status.svg";
import calender from "../../../../images/fihr/calender.svg";
import DetailedFhirTable from "../../../../components/table/tenantTable/FihrPatient/detailedFhirTable";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const { RangePicker } = DatePicker;

const FIHRData = {
  content: [
    {
      mrnNumber: "#111",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#112",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#113",
      status: "failed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#114",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#115",
      status: "failed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#116",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#117",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#118",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#119",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#110",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#101",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#102",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#103",
      status: "failed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#104",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#105",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#106",
      status: "computed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
    {
      mrnNumber: "#107",
      status: "failed",
      computedDateTime: "2024-03-11T12:16:30.091Z",
    },
  ],
};

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState();
  const [search, setSearch] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const handleHeaderTrigger = async () => {
    setTrigger(!trigger);
    setSelectAll(!selectAll)
    if (!trigger) {
      try {
        const selected = FIHRData?.content?.filter(
          (item) => item?.status === "failed"
        );

        setSelectedRows(selected ? selected : []);
      } catch (error) {}
    } else setSelectedRows([]);
  };

  const headerData = [
    {
      id: 1,
      title: "Batch Name",
      icon: profile,
      name: "Folder Name6",
    },
    {
      id: 2,
      title: "Status",
      icon: statusIcon,
      name: "Completed 270/280",
    },
    {
      id: 3,
      title: "Computed",
      icon: computed,
      name: "269/280",
    },
    {
      id: 4,
      title: "Uploaded By",
      icon: person,
      name: "Nicolas Miles",
    },
    {
      id: 5,
      title: "Upload Date",
      icon: calender,
      name: "03/15/2024",
    },
    {
      id: 6,
      title: "Year Of Service",
      icon: calender,
      name: "2022, 2023, 2024",
    },
  ];
  useEffect(() => {
    if (reportActiveTab) {
      dispatch(getActiveTab(reportActiveTab));
    }
  }, [reportActiveTab, status, search, pageNo, dateRange]);

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div className="content-body">
          {/* {!ReportPatientDetails?.response ? (
            <SpinnerDots />
          ) : ( */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div
                        className={styles.topHeader}
                        style={{ marginBottom: "40px" }}
                      >
                        <button
                          className={`${styles.backButtonStyle}`}
                          onClick={() => {
                            router.back();
                          }}
                        >
                          <Image src={leftArrow} />
                        </button>
                        <div
                          style={{
                            width: "95%",
                            display: "flex",
                            margin: "auto",
                          }}
                        >
                          {headerData?.map((item) => (
                            <div className="col-xl-2" key={item?.id}>
                              <div style={{ display: "flex" }}>
                                <Image src={item?.icon} alt="npimg" />
                                <div className={styles.topTitle}>
                                  {item?.title}
                                </div>
                              </div>
                              <div>{item?.name}</div>
                            </div>
                          ))}
                        </div>
                        <span></span>
                      </div>
                      <div className={styles.topHeader}>
                        <div className="col-lg-2 mx-2">
                          <label htmlFor="search">Search by Name or ID</label>
                          <div className="form-group has-search">
                            <FontAwesomeIcon
                              className="fa fa-search form-control-feedback"
                              icon={faSearch}
                            />
                            <InputText
                              type="text"
                              onChange={(e) => setSearch(e.target.value)}
                              value={""}
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
                        <div className="col-xl-2 mx-2">
                          <label htmlFor="date">Date</label>
                          <div>
                            <RangePicker
                              format="MM-DD-YYYY"
                              onChange={(dates, dateStrings) => {
                                setDateRange(dateStrings);
                              }}
                              disabledDate={(current) =>
                                disableFutureDate(current)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-xl-6 mx-2">
                          <div className="col-xl-4">
                            <Selector
                              selectlabel={"Select Status"}
                              setSelectedOption={setStatus}
                              selectOptions={statusOptions}
                              defaultSelectValue1={""}
                            />
                          </div>
                        </div>
                        <div className={`col-xl-2 ${styles.headerTriggerBtn}`}>
                          <button
                            className={
                              trigger
                                ? styles.triggerButton
                                : styles.inActiveHeaderTriggerBtn
                            }
                            onClick={() => {
                              handleHeaderTrigger();
                            }}
                          >
                            Trigger
                          </button>
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
                          <DetailedFhirTable
                            paginationFirst={paginationFirst}
                            onPageChange={onPageChange}
                            tableData={FIHRData}
                            selectAll={selectAll}
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            setSelectAll={setSelectAll}
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
