import React, { useState, useEffect } from "react";
import { DatePicker, Input } from "antd";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { useRouter } from "next/router";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import styles from "../fhir.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
// import { getActiveTab } from "../../../../store/actions/l2Action/AuditReportAction";
import { disableFutureDate } from "../../../../components/headerFilters/functions";
import Selector from "../../../../components/selector";
import idCard from "../../../../images/fihr/idCard.svg";
import profile from "../../../../images/fihr/profile.svg";
import person from "../../../../images/fihr/person.svg";
import statusIcon from "../../../../images/fihr/status.svg";
import calender from "../../../../images/fihr/calender.svg";
import DetailedFhirTable from "../../../../components/table/tenantTable/fhirPatient/DetailedFhirTable";
import { actions as activeTab } from "../../../../stores/admin/report";
import { statusOptions3 } from "../pdftable";
const statusOptions = [
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

const Index = ({ getActiveTab, reportActiveTab }) => {
  const router = useRouter();
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
    setSelectAll(!selectAll);
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
      title: "Initiated By",
      icon: person,
      name: "Nicolas Miles",
    },
    {
      id: 4,
      title: "Initiated Date",
      icon: calender,
      name: "03/15/2024",
    },
    {
      id: 5,
      title: "Year Of Service",
      icon: calender,
      name: "2022, 2023, 2024",
    },
    {
      id: 6,
      title: "Group ID",
      icon: idCard,
      name: "232OFH34",
    },
  ];
  useEffect(() => {
    if (reportActiveTab) {
      getActiveTab(reportActiveTab);
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
                        id="back-btn"
                        name="back-btn"
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
                                <Image src={item?.icon} alt="noImage" />
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
                          <div style={{ height: "45px" }}>
                            <Input
                            id="search-name"
                            name="search-name"
                              type="text"
                              onChange={(e) => setSearch(e.target.value)}
                              className={"w-100 new-search-control border-none"}
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
                            />
                          </div>
                        </div>
                        <div className="col-xl-2 mx-2">
                          <label htmlFor="date">Date</label>
                          <div>
                            <RangePicker
                            id="select-date"
                            name="select-date"
                              format="MM-DD-YYYY"
                              onChange={(dates, dateStrings) => {
                                setDateRange(dateStrings);
                              }}
                              disabledDate={(current) =>
                                disableFutureDate(current)
                              }
                              inputReadOnly
                            />
                          </div>
                        </div>
                        <div className="col-xl-6 mx-2">
                          <div className="col-xl-4">
                            <Selector
                              selectlabel={"Select Status"}
                              setSelectedOption={setStatus}
                              selectOptions={statusOptions3}
                              defaultSelectValue1={""}
                            />
                          </div>
                        </div>
                        <div className={`col-xl-2 ${styles.headerTriggerBtn}`}>
                          <button
                          id="header-trigger"
                          name="header-trigger"
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

const enhancer = connect(
  (state) => ({
    organizationList: state?.tenantAdmin?.users?.allOrganization?.data,
    reportActiveTab: state?.admin?.report?.activeTab,
  }),
  {
    getActiveTab: activeTab.activeTab,
  }
);

export default enhancer(Index);
