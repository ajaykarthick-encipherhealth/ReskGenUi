import React, { useState, useEffect, useCallback, use } from "react";
import { DatePicker, Input, Popover, Select } from "antd";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCircleNotch,
  faSearch,
  faLaptopMedical,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { useRouter } from "next/router";
import leftArrow from "../../../../images/svg/leftArrow.svg";
import styles from "../fhir.module.css";
import Header from "../../../../jsx/layouts/nav/Header";
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
import { actions as allReportActions } from "../../../../stores/admin/report";
import { actions as patientAction } from "../../../../stores/tenantAdmin/patients";
import { getStorage, removeStorage } from "../../../../utils/storages";
import {
  faUser,
  faCalendar,
  faCircleUser,
  faCircleDot,
} from "@fortawesome/free-regular-svg-icons";
import { formatDateTime, getResponePopup } from "../../../../utils/reusable";
export const statusOptions = [
  { label: "Computed", value: "COMPUTED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Failed", value: "FAILED" },
];
export const statusOptions2 = [
  { label: "Processed", value: "PROCESSED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Failed", value: "FAILED" },
];
export const statusOptions3 = [
  { label: "Processing", value: "PROCESSING" },
  { label: "Failed", value: "FAILED" },
];

const DetailedViewPdfTable = ({
  getBatchInfo,
  getBatch,
  loader,
  getAllBatches,
  pdfTabledata,
  getActiveTab,
  reportActiveTab,
  params,
  setViewDetailedBatch,
  webSocketData,
  viewDetailedBatch,
  routedData,
  getRoutedData,
  paramsFilter,
  setParamsFilter,
  setSelectedDates,
  setSelecteddateRanges,
  setListSearch,
  setSelectedOptions,
  setListPageNo,
  setListSearchVal,
  initialTableData,
  getRetreggerPatient
}) => {
  const router = useRouter();
  const [socketData, setSocketData] = useState();
  const [searchVal, setSearchVal] = useState(null);
  const [search, setSearch] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [currentId, setCurrentId] = useState({});
  const [batchPageNo, setBatchPageNo] = useState(0);
  // const [socketData, setSocketData] = useState(pdfTabledata);
  const [batchId, setBatchId] = useState(null);
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  const debouncedSearch = useCallback(
    debounce((text, setSearchVal, field) => {
      setSearchVal(text);
      // setSearchVal((prev) => {
      //   const existingIndex = prev.findIndex((item) => item.field === field);
      //   if (existingIndex !== -1) {
      //     return prev.map((item, index) => {
      //       if (index === existingIndex) {
      //         return { ...item, search: text };
      //       }
      //       return item;
      //     });
      //   } else {
      //     return [...prev, { search: text, field: field }];
      //   }
      // });
    }, 1000),
    []
  );

  const getRetregger = async (data) => {
    try {
      const res = await getRetreggerPatient({ patientId: data.patientId });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        getBatchInfo({
          batchId: batchId,
          page: pageNo,
          search: searchVal || "",
        });
      }
    } catch (error) {}
  };

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

  useEffect(() => {
    // const decodedParams = router.query;
    if (routedData) {
      setSearchVal(routedData?.searchVal);
      setSearch({
        searchVal: routedData?.searchVal,
        name: "initialSearch",
      });
      setPageNo(routedData?.pageNo || 0);
      setBatchId(routedData?.batchId);
    }
  }, []);
  // useEffect(() => {
  //   getAllBatches({ page: batchPageNo });
  // }, [batchPageNo]);
  // useEffect(() => {
  //   if (
  //     webSocketData &&
  //     webSocketData?.webSocketType === "BATCH_STATUS" &&
  //     pdfTabledata?.content
  //   ) {
  //     const updatedTableData = socketData?.content?.map((item) => {
  //       if (item.patientId === webSocketData?.patientId) {
  //         return {
  //           ...item,
  //           batchUploadStatus: webSocketData?.batchUploadStatus || "PROCESSING",
  //         };
  //       }
  //       return item;
  //     });
  //     setSocketData((prevState) => ({
  //       ...prevState,
  //       content: updatedTableData,
  //     }));
  //   } else {
  //     setSocketData(pdfTabledata);
  //   }
  // }, [webSocketData, socketData?.content, pdfTabledata?.content]);

  const handleBack = () => {
    getActiveTab("PDF");
    // removeStorage("patientSyncEncodedValue");
    // router.push("/tenantadmin/patientSync");
    setSelectedDates(params?.selectedDates);
    setSelecteddateRanges(params?.selectedDateRanges);
    setListSearch(params?.search);
    setSelectedOptions(params?.selectedOptions);
    setListPageNo(params?.pageNo);
    setViewDetailedBatch({ status: false, data: null });
    getRoutedData("");
    setListSearchVal(params?.search?.searchVal);
    setSocketData();
  };
  useEffect(() => {
    if (reportActiveTab) {
      getActiveTab(reportActiveTab);
    }
    if (params) {
      const decodedParams = params;
      setBatchId(decodedParams?.batchId);
      setBatchPageNo(decodedParams?.pageNo);
      if (pdfTabledata) {
        const filterData =
          initialTableData?.content?.length > 0
            ? initialTableData?.content?.filter(
                (item) => item?.id === decodedParams?.batchId
              )
            : [];
        setCurrentId(...filterData);
      }
    }
  }, [reportActiveTab, pdfTabledata, params]);
  useEffect(() => {
    setParamsFilter("check");
    if (batchId && paramsFilter) {
      getBatchInfo({
        batchId: batchId,
        page: pageNo,
        search: searchVal || "",
      });
    }
  }, [batchId, pageNo, searchVal]);
  const headerData = [
    {
      id: 1,
      title: "Batch Details",
      icon: <FontAwesomeIcon icon={faUser} color="#241571" className="mx-2" />,
      name: (
        <>
          {currentId?.name ? currentId?.name : "--"}
          {/* <br />
          <Popover content={currentId?.id} placement="top">
            {currentId?.id ? currentId?.id.slice(0, 8) + ".." : "--"}
          </Popover> */}
        </>
      ),
    },
    {
      id: 2,
      title: "Count",
      icon: (
        <FontAwesomeIcon icon={faListOl} color="#241571" className="mx-2" />
      ),
      name: (
        <>
          {
            <Popover
              content={
                <>
                  Computed:
                  {currentId?.totalFileCount > 0
                    ? currentId?.totalSuccessCount
                    : 0}
                  <br />
                  Failed:
                  {currentId?.totalFileCount > 0
                    ? currentId?.totalFailedCount
                    : 0}
                  <br />
                  {/* Processing:
                  {currentId?.totalFileCount > 0
                    ? currentId?.totalFileCount -
                      (currentId?.totalSuccessCount +
                        currentId?.totalFailedCount)
                    : 0} */}
                </>
              }
            >
              {currentId?.totalFileCount}

              <FontAwesomeIcon
                icon={faCircleInfo}
                style={{ color: "#04306f" }}
                placement="rightBottom"
                className="mx-1 cursor-pointer"
              />
            </Popover>
          }
        </>
      ),
    },
    {
      id: 3,
      title: "Year Of Services",
      icon: (
        <FontAwesomeIcon icon={faCalendar} color="#241571" className="mx-2" />
      ),
      name: (
        <div>
          {currentId?.yearOfService?.length > 0
            ? currentId?.yearOfService?.map(
                (item, index) =>
                  `${item}${
                    index < currentId.yearOfService.length - 1 ? "," : ""
                  } `
              )
            : "---"}
        </div>
      ),
    },
    {
      id: 3,
      title: "EMR",
      icon: (
        <FontAwesomeIcon
          icon={faLaptopMedical}
          color="#241571"
          className="mx-2"
        />
      ),
      name: currentId?.emrType ? currentId?.emrType : "---",
    },
    {
      id: 3,
      title: "Source",
      icon: (
        <FontAwesomeIcon icon={faCircleDot} color="#241571" className="mx-2" />
      ),
      name: currentId?.source ? currentId?.source : "---",
    },
    {
      id: 4,
      title: "Initiated By",
      icon: (
        <FontAwesomeIcon icon={faCircleUser} color="#241571" className="mx-2" />
      ),
      name: currentId?.createdBy ? (
        <Popover content={currentId?.createdBy}>
          {currentId?.createdBy.slice(0, 15) + "..."}
        </Popover>
      ) : (
        "---"
      ),
    },
    {
      id: 5,
      title: "Batch Initiated",
      icon: (
        <FontAwesomeIcon icon={faCalendar} color="#241571" className="mx-2" />
      ),
      name: currentId?.createdDate
        ? formatDateTime(currentId?.createdDate)
        : "---",
    },
    {
      id: 6,
      title: "Status",
      icon: (
        <FontAwesomeIcon
          icon={faCircleNotch}
          color="#241571"
          className="mx-2"
        />
      ),
      name: currentId?.batchUploadStatus ? currentId?.batchUploadStatus : "---",
    },
  ];

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
                          id="back-btn"
                          name="back-btn"
                          className={`${styles.backButtonStyle} mx-2`}
                          onClick={() => {
                            handleBack();
                          }}
                        >
                          <Image src={leftArrow} />
                        </button>
                        <div className="w-100 d-flex gap-4 flex-wrap justify-between">
                          {headerData?.map((item) => (
                            <div key={item?.id}>
                              <div style={{ display: "flex" }}>
                                <div
                                  className={`text-truncate ${styles.topTitle}`}
                                >
                                  {item?.icon}
                                  {item?.title}
                                </div>
                              </div>
                              <div className="px-2 text-center">
                                {item?.name}
                              </div>
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
                              id="initialSearch"
                              onChange={(e) => getNameSearch(e)}
                              value={search?.searchVal || ""}
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
                              autoComplete="off"
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
                            // loader={loader}
                            params={{
                              searchVal: searchVal,
                              pageNo: pageNo,
                              viewDetailedBatch,
                              batchId,
                            }}
                            currentId={currentId}
                            socketData={socketData}
                            setSocketData={setSocketData}
                            getRetregger={getRetregger}
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
    getBatch: state.tenantAdmin?.patientSync?.getBatch?.data?.response,
    loader: state?.tenantAdmin?.patientSync?.getBatchLoader,
    pdfTabledata: state.tenantAdmin?.patientSync?.allBatches?.data?.response,
    reportActiveTab: state.admin?.report?.activeTab,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
    routedData: state.tenantAdmin?.patientSync?.routedData,
  }),
  {
    getBatchInfo: allActions.getBatchInfo,
    getAllBatches: allActions.getAllBatches,
    getActiveTab: allReportActions.activeTab,
    getRoutedData: allActions.getRoutedData,
    getRetreggerPatient: patientAction.getRetreggerPatient,
  }
);
export default connector(DetailedViewPdfTable);
