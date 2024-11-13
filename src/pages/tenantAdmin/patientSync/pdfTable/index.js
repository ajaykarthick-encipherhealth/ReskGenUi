import React, { useState, useEffect, useCallback, use } from "react";
import { DatePicker, Input, Popover, Select } from "antd";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faSearch } from "@fortawesome/free-solid-svg-icons";
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
import { getStorage, removeStorage } from "../../../../utils/storages";
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
}) => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState(null);
  const [search, setSearch] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [currentId, setCurrentId] = useState({});
  const [batchPageNo, setBatchPageNo] = useState(0);
  const [socketData, setSocketData] = useState(pdfTabledata);
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
  const getNameSearch = (event) => {
    const value = event.target.value;
    const field = event.target.name;
    setSearch({
      name: event.target.name,
      searchVal: value,
    });
    debouncedSearch(value, setSearchVal, field);
  };

  useEffect(() => {
    const encodedParams = JSON.parse(getStorage("patientSyncEncodedValue"));
    if (encodedParams) {
      try {
        const decodedParams = JSON.parse(atob(encodedParams));
        setSearchVal(decodedParams?.searchVal);
        setSearch({
          searchVal: decodedParams?.searchVal,
          name: "initialSearch",
        });
        setPageNo(decodedParams?.pageNo);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  useEffect(() => {
    getAllBatches({ page: batchPageNo });
  }, [batchPageNo]);
  useEffect(() => {
    if (
      webSocketData &&
      webSocketData?.webSocketType === "BATCH_STATUS" &&
      pdfTabledata?.content
    ) {
      const updatedTableData = socketData?.content?.map((item) => {
        if (item.patientId === webSocketData?.patientId) {
          return {
            ...item,
            batchUploadStatus: webSocketData?.batchUploadStatus || "PROCESSING",
          };
        }
        return item;
      });
      setSocketData((prevState) => ({
        ...prevState,
        content: updatedTableData,
      }));
    } else {
      setSocketData(pdfTabledata);
    }
  }, [webSocketData, socketData?.content, pdfTabledata?.content]);

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
          socketData?.content?.length > 0
            ? socketData?.content?.filter(
                (item) => item?.id === decodedParams?.batchId
              )
            : [];
        setCurrentId(...filterData);
      }
    }
  }, [reportActiveTab, pdfTabledata, params]);
  useEffect(() => {
    if(batchId){
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
      icon: profile,
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
      icon: statusIcon,
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
      icon: calender,
      name: (
        <div className="text-start">
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
      icon: computed,
      name: currentId?.emrType ? currentId?.emrType : "---",
    },
    {
      id: 3,
      title: "Source",
      icon: computed,
      name: currentId?.source ? currentId?.source : "---",
    },
    {
      id: 4,
      title: "Initiated By",
      icon: person,
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
      icon: calender,
      name: currentId?.createdDate
        ? dayjs(currentId?.createdDate).format("MM/DD/YYYY")
        : "---",
    },
    {
      id: 6,
      title: "Status",
      icon: calender,
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
                          className={`${styles.backButtonStyle} mx-2`}
                          onClick={() => {
                            getActiveTab("PDF");
                            removeStorage("patientSyncEncodedValue");
                            router.push("/tenantAdmin/patientSync");
                            setSearch();
                            setSearchVal(null);
                            setViewDetailedBatch({ status: false, data: null });
                          }}
                        >
                          <Image src={leftArrow} />
                        </button>
                        <div className="w-100 d-flex justify-between">
                          {headerData?.map((item) => (
                            <div style={{ width: "20%" }} key={item?.id}>
                              <div style={{ display: "flex" }}>
                                {/* <Image src={item?.icon} alt="npimg" /> */}
                                <div className={styles.topTitle}>
                                  {item?.title}
                                </div>
                              </div>
                              <div className="px-2">{item?.name}</div>
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
                            loader={loader}
                            params={{
                              searchVal: searchVal,
                              pageNo: pageNo,
                              viewDetailedBatch: viewDetailedBatch,
                            }}
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
  }),
  {
    getBatchInfo: allActions.getBatchInfo,
    getAllBatches: allActions.getAllBatches,
    getActiveTab: allReportActions.activeTab,
  }
);
export default connector(DetailedViewPdfTable);
