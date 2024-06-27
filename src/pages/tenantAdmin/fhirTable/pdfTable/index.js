import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
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
import Selector from "../../../../components/selector";
import DetailedFihrTable from "../../../../components/table/tenantTable/FihrPatient/DetailedFihrTable";
import computed from "../../../../images/fihr/computed.svg";
import profile from "../../../../images/fihr/profile.svg";
import person from "../../../../images/fihr/person.svg";
import statusIcon from "../../../../images/fihr/status.svg";
import calender from "../../../../images/fihr/calender.svg";
import { actions as allActions } from "../../../../stores/tenantAdmin";
import SpinnerDots from "../../../../components/spinner";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Hold", value: "HOLD" },
];

const { RangePicker } = DatePicker;

const Index = ({ getBatchInfo, getBatch, loader,getAllBatches,pdfTabledata }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState();
  const [search, setSearch] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [currentId,setCurrentId]=useState({})

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };

  useEffect(()=>{
    getAllBatches({page:0})
  },[])
  useEffect(() => {
    if (reportActiveTab) {
      dispatch(getActiveTab(reportActiveTab));
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedParams = urlParams.get("params");
    const decodedParams = JSON.parse(atob(encodedParams));
   if(pdfTabledata){
    const filterData=pdfTabledata?.content?.filter(item=>(item?.id===decodedParams?.batchId))
    setCurrentId(...filterData)
   }
    getBatchInfo({ batchId: decodedParams?.batchId });
  }, [reportActiveTab,pdfTabledata]);

  const headerData = [
    {
      id: 1,
      title: "Batch Name",
      icon: profile,
      name: currentId?.name?currentId?.name:"--",
    },
    {
      id: 2,
      title: "Status",
      icon: statusIcon,
      name: currentId?.batchUploadStatus?currentId?.batchUploadStatus:"--",
    },
    {
      id: 3,
      title: "Computed",
      icon: computed,
      name: "--",
    },
    {
      id: 4,
      title: "Uploaded By",
      icon: person,
      name: "--",
    },
    {
      id: 5,
      title: "Upload Date",
      icon: calender,
      name: "--",
    },
    {
      id: 6,
      title: "Year Of Service",
      icon: calender,
      name: currentId?.yearOfService?.length>0?currentId?.yearOfService?.map((item,index)=>`${item}${index/2===0 ? ",":""}`):"--",
    },
  ];

  return (
    <>
      <Header />
      <div className={styles.maincontainer}>
        <div className="content-body">
          {loader ? (
            <SpinnerDots />
          ) : (
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
                          <div className="col-xl-2 mx-2">
                            <div>
                              <Selector
                                selectlabel={"Select Status"}
                                setSelectedOption={setStatus}
                                selectOptions={statusOptions}
                                defaultSelectValue1={""}
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
                            <DetailedFihrTable
                              paginationFirst={paginationFirst}
                              onPageChange={onPageChange}
                              tableData={getBatch}
                            />
                          </div>
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

const connector = connect(
  (state) => ({
    getBatch: state?.tenantAdmin?.getBatch?.data?.response,
    loader: state?.tenantAdmin?.getBatchLoader,
    pdfTabledata: state.tenantAdmin.allBatches?.data?.response,
  }),
  {
    getBatchInfo: allActions.getBatchInfo,
    getAllBatches: allActions.getAllBatches,

  }
);
export default connector(Index);
