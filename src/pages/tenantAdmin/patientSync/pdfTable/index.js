import React, { useState, useEffect, useCallback } from "react";
import { DatePicker, Input, Popover, Select } from "antd";
import { useSelector, useDispatch, connect } from "react-redux";
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
import computed from "../../../../images/fihr/computed.svg";
import profile from "../../../../images/fihr/profile.svg";
import person from "../../../../images/fihr/person.svg";
import statusIcon from "../../../../images/fihr/status.svg";
import calender from "../../../../images/fihr/calender.svg";
import { actions as allActions } from "../../../../stores/tenantAdmin/patientSync";
import { debounce } from "../../../../components/input";
import moment from "moment";
import dayjs from "dayjs";
import DetailedPdfTable from "../../../../components/table/tenantTable/pdfTable/detailPdfTable";

export const statusOptions = [
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const { RangePicker } = DatePicker;

const Index = ({
  getBatchInfo,
  getBatch,
  loader,
  getAllBatches,
  pdfTabledata,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [searchVal, setSearchVal] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [search, setSearch] = useState();
  const [selectedDateRanges, setSelecteddateRanges] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [currentId, setCurrentId] = useState({});

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
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
    getAllBatches({ page: 0 });
  }, []);
  useEffect(() => {
    if (reportActiveTab) {
      dispatch(getActiveTab(reportActiveTab));
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedParams = urlParams.get("params");
    const decodedParams = JSON.parse(atob(encodedParams));
    if (pdfTabledata) {
      const filterData = pdfTabledata?.content?.filter(
        (item) => item?.id === decodedParams?.batchId
      );
      setCurrentId(...filterData);
    }
    const coderSearchString = searchVal.find(
      (item) => item.field === "initialSearch"
    )?.search;

    getBatchInfo({
      batchId: decodedParams?.batchId,
      page: pageNo,
      search: coderSearchString ? coderSearchString : "",
      startDate: selectedDateRanges?.batch?.from,
      endDate: selectedDateRanges?.batch?.to,
      fileStatus: selectedOptions?.batch,
    });
  }, [
    reportActiveTab,
    pdfTabledata,
    pageNo,
    selectedDateRanges,
    searchVal,
    selectedOptions,
  ]);

  const headerData = [
    {
      id: 1,
      title: "Batch Name",
      icon: profile,
      name: currentId?.name ? currentId?.name : "--",
    },
    {
      id: 2,
      title: "Status",
      icon: statusIcon,
      name: currentId?.batchUploadStatus ? currentId?.batchUploadStatus : "---",
    },
    {
      id: 3,
      title: "Computed",
      icon: computed,
      name: "---",
    },
    {
      id: 4,
      title: "Initiated By",
      icon: person,
      name: currentId?.createdBy ? (
        <Popover content={currentId?.createdBy}>
          {currentId?.createdBy.slice(0, 20) + "..."}
        </Popover>
      ) : (
        "---"
      ),
    },
    {
      id: 5,
      title: "Initiated Date",
      icon: calender,
      name: currentId?.createdDate
        ? dayjs(currentId?.createdDate).format("MM/DD/YYYY")
        : "---",
    },
    {
      id: 6,
      title: "Year Of Service",
      icon: calender,
      name: (
        <div className="text-start">
          {currentId?.yearOfService?.length > 0
            ? currentId?.yearOfService?.map(
                (item, index) => `${item}${(index + 1) / 2 === 0 ? "," : ""}`
              )
            : "---"}
        </div>
      ),
    },
  ];
  console.log(currentId);
  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div
                        className={`${styles.topHeader} mx-2`}
                        style={{ marginBottom: "40px" }}
                      >
                        <button
                          className={`${styles.backButtonStyle} mx-2`}
                          onClick={() => {
                            router.push("/tenantAdmin/patientSync");
                            dispatch(getActiveTab("PDF"));
                            setSearch();
                            setSearchVal([]);
                            setSelectedDates(null);
                            setSelecteddateRanges([]);
                          }}
                        >
                          <Image src={leftArrow} />
                        </button>
                        <div className="w-100 d-flex justify-between">
                          {headerData?.map((item) => (
                            <div style={{ width: "20%" }} key={item?.id}>
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
                      </div>
                      <div className={styles.topHeader}>
                        <div className="col-lg-2 mx-2">
                          <label htmlFor="search">Search by Name or ID</label>
                          <div style={{ height: "45px" }}>
                            <Input
                              type="text"
                              name="initialSearch"
                              onChange={(e) => getNameSearch(e)}
                              value={search ? search?.searchVal : ""}
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
                              value={
                                selectedDates
                                  ? selectedDates[reportActiveTab]
                                  : undefined
                              }
                              format="MM-DD-YYYY"
                              onChange={(dates, dateStrings) => {
                                handleRangePicker(dates, dateStrings, "batch");
                              }}
                              disabledDate={(current) =>
                                disableFutureDate(current)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-xl-2 mx-2">
                          <label>Status</label>
                          <div className={`custom-react-select1`}>
                            <Select
                              placeholder={"Select Status"}
                              options={statusOptions}
                              onChange={(selectedOption) => {
                                dosOnChange(selectedOption, "batch");
                              }}
                              allowClear
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
                          <DetailedPdfTable
                            paginationFirst={paginationFirst}
                            onPageChange={onPageChange}
                            tableData={getBatch}
                            loader={loader}
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
      </div>
    </>
  );
};

const connector = connect(
  (state) => ({
    getBatch: state?.tenantAdmin?.patientSync?.getBatch?.data?.response,
    loader: state?.tenantAdmin?.patientSync?.getBatchLoader,
    pdfTabledata: state.tenantAdmin?.patientSync?.allBatches?.data?.response,
  }),
  {
    getBatchInfo: allActions.getBatchInfo,
    getAllBatches: allActions.getAllBatches,
  }
);
export default connector(Index);
