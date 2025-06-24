import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../../jsx/layouts/nav/Header";
import visitStyles from "../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FilterOutlined,
  MonitorOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  faFlag,
  faComment,
  faCalendarDays,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
  faClock,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faFile,
  faTimeline,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

import {
  Avatar,
  Tooltip,
  Select,
  Badge,
  notification,
  Drawer,
  Popover,
} from "antd";
import { IMAGES, SVGICON } from "../../../jsx/constant/theme";
import { Button, Offcanvas } from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/router";
import Hcc from "./hcc/index";
import NonHcc from "./non-hcc/index";
import Radiology from "./radiology/index";
import Lab from "./lab/index";
import Timeline from "./timline";
import ReviwerWorkList from "./components/reviwerWorklist";
import SupervisorWorkList from "./components/supervisorWorklist";
import AdminWorkList from "./components/adminWorklist";
import { actions as workflowActions } from "../../../stores/reviewer/workqueue";
import { actions as detailsActions } from "../../../stores/patient/details";
import Comments from "./components/comments";
import Notes from "./components/notes";
import Flag from "./components/flag";
import StatusAction from "./components/statusAction";
import { handleCopyToClipboard } from "../../commonFunctions";
import LogoLoader from "../../logoLoader";
import FileDetails from "./components/fileDetails";
import { PlusCircleOutlined } from "@ant-design/icons";
import ManuallyAddProvider from "./manuallyAddProvider";
import { getAge, getResponePopup } from "../../../utils/reusable";
import { getStorage, setStorage } from "../../../utils/storages";
import { truncateString } from "./components/function/ReusableFunctions";
import SvgFlag from "./components/svg/svg";
import {
  getTimelineList,
  getUserDetails,
} from "../../../stores/patient/details/network";
import { actions as allReportActions } from "../../../stores/admin/report";
import { connect } from "react-redux";
import HeaderComponent from "./components/headerComponent";
import { actions as reviewerWorkQueueAction } from "../../../stores/reviewer/workqueue";
import { allFilters } from "../../../pages/reviewer/patients/headerFilters";
import { actions as allActions } from "../../../stores/tenantAdmin/patientSync";
import CardSkeleton from "../../skeleton/card";
import VersionHistory from "./versionHistory";
import Queried from "./hcc/queried";
export const navigetPageDetails = async (
  pageTitle,
  setSideNavLabelActiveKey,
  setPatientDocumentResult,
  setActiveTab,
  setIsLoadingDos,
  setIsLoading
) => {
  setSideNavLabelActiveKey(pageTitle);
  var patientId = getStorage("patientId");
  var orgId = getStorage("orgId");
  if (pageTitle == "HCC" && patientId) {
    setActiveTab(1);
  }
  if (pageTitle == "NON HCC") {
    setActiveTab(2);
    setIsLoadingDos(false);
  }
  if (pageTitle == "RX") {
    setActiveTab(5);
    setIsLoadingDos(false);
  }
  if (pageTitle == "Radiology") {
    setActiveTab(3);
  }
  if (pageTitle == "Lab Report") {
    setActiveTab(4);
  }
  setIsLoading(false);
};

const Details = ({
  workFgetFlagsowData,
  getFlagsData,
  patientDetailsResult,
  getpatientDetailsData,
  getPatientHccFile,
  getPatientDosList,
  getDosPageNumber,
  getMeatQueryList,
  getPatientIdData,
  patientIdDetailsData,
  getFlagDetailsData,
  flagsDetailsResult,
  getLabFileDetailsClear,
  getLabDetailsClear,
  getRadiologyDetailsClear,
  getRadiologyFileClear,
  getAllProcessYear,
  processedYearResult,
  getPatientRadiologyDosList,
  getRadiologyDetails,
  getPatientLabDosList,
  getLabDetails,
  radiologyDetailsResult,
  labDetailsResult,
  getCurrentDiseaseType,
  // getCurrentProcessYearAction,
  activeLabels,
  isDosSelected,
  isActives,
  getSelectedDos,
  storeFileDetails,
  preStoreFileDetails,
  storePrePatientFileId,
  storeCurrentFile,
  getPatientID,
  selectPatientId,
  getActiveTab,
  getFilteredList,
  getRoutedData,
  routedData,
  getSelectedDosPageNumber,
  loading,
  patientDetailsLoad,
  getFlagCharts,
  getAllRevertDetails,
  getRevertDetails,
  revertLoading,
  confirmRevert,
  getQueryDetails,
  queriedData,
  queriedLoader,
}) => {
  const navigate = useRouter();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dosYear, setDosYear] = useState("");
  const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [validated, setValidated] = useState(false);
  const [patientDetails, setPatientDetails] = useState([]);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [screenWidth, setScreenWidth] = useState();
  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");
  const [isLoadingDos, setIsLoadingDos] = useState(true);
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [isModalComments, setIsModalComments] = useState(false);
  const [flagContainerActive, setFlagContainerActive] = useState("");
  const [flagContainerActiveTitle, setFlagContainerActiveTitle] = useState("");
  const [sideNavLabelActiveKey, setSideNavLabelActiveKey] = useState("HCC");
  const [isSideNavShow, setIsSideNavShow] = useState(false);
  const [timelineData, setTimeLineData] = useState([]);
  const [lastActiveTab, setLastActiveTab] = useState(3);
  const [userDetails, setUserDetails] = useState("");
  const [flagFirstData, setFlagFirstData] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [patientResultReload, setPatientResultReload] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [hccValidCount, setHccValidCount] = useState(0);
  const [hccCounts, setHccCounts] = useState({ isCmsHcc: 0, isRxHcc: 0 });
  const [workListPatientId, setWorkListPatientId] = useState(null);
  const [isFileCheck, setIsFileCheck] = useState(false);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectDosValue, setSelectDosValue] = useState("");
  const [search, setSearch] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const tabList = [
    {
      title: "HCC",
      type: "HCC",
      iconStyle: IMAGES.visitDataHcc,
      defaultComplete: "HCC_DISEASES",
    },
    {
      title: "NON HCC",
      type: "NON HCC",
      iconStyle: IMAGES.visitDataNonHcc,
      defaultComplete: "NON_HCC_DISEASE",
    },
    {
      title: "RX",
      type: "RX",
      iconStyle: IMAGES.visitDataRx,
      defaultComplete: "RX_HCC_DISEASE",
    },
    {
      title: "Radiology",
      type: "Radiology",
      iconStyle: IMAGES.visitDataRadioloy,
      defaultComplete: "RADIOLOGY",
    },
    {
      title: "Lab Report",
      type: "Lab Report",
      iconStyle: IMAGES.visitDataLabreport,
      defaultComplete: "LAB",
    },
  ];
  const handleNavigation = (data) => {
    navigetPageDetails(
      data.type,
      setSideNavLabelActiveKey,
      setPatientDocumentResult,
      setActiveTab,
      setIsLoadingDos,
      setIsLoading
    );
  };

  const getYear = async (patientId) => {
    patientDetailsLoad(true);
    try {
      const res = await getAllProcessYear(patientId, "HCC");
      if (res.status !== "SUCCESS") {
        patientDetailsLoad(false);
      }
    } catch (error) {
      patientDetailsLoad(false);
    }
  };

  useEffect(() => {
    const patientId = getStorage("patientId");
    const fileId = getStorage("fileId");
    if (activeTab == 1 && lastActiveTab > 2) {
      getYear(patientId);
      dosYearDefalutSelect && getPatientListToDetails(patientId);
      if (patientDetailsResult?.data?.response?.fileId != fileId) {
        getPatientHccFile(patientDetailsResult?.data?.response?.fileId);
      }
    }
    var dosYearArr = processedYearResult?.data?.response?.map((res) => {
      return { value: res, label: res };
    });
    if (activeTab == 3) {
      getPatientRadiologyDosList(
        selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId,
        dosYearArr?.[0]?.value || ""
      );
    }
    if (activeTab == 4) {
      getPatientLabDosList(
        selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId,
        dosYearArr?.[0]?.value || ""
      );
    }
    setLastActiveTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    setCount((prevCount) => prevCount + 1);
    if (count == 1 && processedYearResult?.data?.response) {
      getAllProcessYearSelect(processedYearResult);
    }
  }, [processedYearResult]);

  useEffect(() => {
    getSelectedDos("");
    getLabFileDetailsClear();
    getLabDetailsClear();
    getRadiologyDetailsClear();
    getRadiologyFileClear();
  }, []);

  useEffect(() => {
    const orgId = getStorage("orgId");
    const tenId = getStorage("tenantId");
    const patientId = getStorage("patientId");
    const uId = getStorage("userId");
    const userRoleLocal = getStorage("userRole");

    setUserRole(userRoleLocal);
    setLocalOrgId(orgId);
    setLocalTenantId(tenId);
    setLocalUserId(uId);
    setLocalPatientId(
      selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId
    );
    getPatientDetails(
      selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId,
      patientDetailsResult?.data?.response
    );
  }, [patientDetailsResult?.data?.response]);

  useEffect(() => {
    const patientId = getStorage("patientId");
    setLocalPatientId(
      selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId
    );
    if (activeTab == 3 || activeTab == 4) {
      getPatientDetails(
        selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId,
        activeTab == 3
          ? radiologyDetailsResult?.data?.response
          : labDetailsResult?.data?.response
      );
    }
  }, [
    radiologyDetailsResult?.data?.response,
    labDetailsResult?.data?.response,
  ]);

  useEffect(() => {
    if (patientDetailsResult?.data?.response?.fileId) {
      const patientId = getStorage("patientId");
      // if(patientDetailsResult?.data?.response?.fileId != preStoreFileDetails){
      //   storeCurrentFile(patientDetailsResult?.data?.response?.fileId)
      // }
      if (
        isFileCheck == false &&
        patientId == patientDetailsResult?.data?.response.patientId
      ) {
        getPatientHccFile(patientDetailsResult?.data?.response?.fileId);
        storePrePatientFileId(patientDetailsResult?.data?.response?.fileId);
        setIsFileCheck(true);
      }
    } else {
      setIsSpinnerLoading(false);
      // patientDetailsLoad(false)
    }
  }, [patientDetailsResult?.data?.response?.fileDetailDTO?.azureBlobPath]);

  useEffect(() => {
    if (storeFileDetails) {
      if (storeFileDetails != preStoreFileDetails) {
        setStorage("fileId", storeFileDetails);
        getPatientHccFile(storeFileDetails);
        storePrePatientFileId(storeFileDetails);
      }
    }
  }, [storeFileDetails]);

  const getAllProcessYearSelect = async (result) => {
    const patientId = getStorage("patientId");
    var dosYearArr = result?.data?.response?.map((res) => {
      return { value: res, label: res };
    });
    setDosYearDefalutSelect(dosYearArr[0]);
    setSelectedDosValue(dosYearArr[0]?.value);
    setDosYear(dosYearArr);
    setIsLoadingDos(false);
    if (result?.data?.response?.length > 0) {
      if (activeTab == 1) {
        getFlagCharts({ dos: dosYearArr[0]?.value });
        getpatientDetailsData(
          selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId,
          dosYearArr[0]?.value,
          null,
          "",
          userRole
        );
        patientDetailsLoad(false);
        getPatientIdData(
          selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId
        );
        getPatientDosList(
          selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId,
          dosYearArr[0]?.value
        );
        getDosPageNumber(
          selectPatientId?.patirntId ? selectPatientId?.patirntId : patientId,
          dosYearArr[0]?.value
        );
      }
    }
  };

  const getPatientDetails = async (patientId, fileResponse) => {
    setHccValidCount(0);
    if (fileResponse) {
      var result = fileResponse;
      if (patientId == result.patientId) {
        setIsSpinnerLoading(false);
        // patientDetailsLoad(false)
      }
      getMeatQueryList(patientId, result?.processedYear, selectDosValue || "");
      setPatientDocumentResult(result);
      setPatientDetails(result);
      if (result.hccDiseases != null) {
        var validDisArray = [];
        result?.hccDiseases?.map((res, index) => {
          if (res?.isShow != false) {
            validDisArray.push({
              isCmsHcc: res.riskAdjustmentDtoList?.some((item) =>
                item?.cmsHcc?.some((hcc) => hcc.value > 1)
              ),
              isRxHcc: res.riskAdjustmentDtoList?.some((item) =>
                item?.rxHcc?.some((hcc) => hcc.value > 1)
              ),
            });
          }
        });
        setHccValidCount(validDisArray.length);
        const rxHcc = validDisArray.filter((rx) => rx.isRxHcc == true);
        const cmsHcc = validDisArray.filter((rx) => rx.isCmsHcc == true);
        setHccCounts({
          isCmsHcc: cmsHcc.length > 0 ? cmsHcc.length : 0,
          isRxHcc: rxHcc.length > 0 ? rxHcc.length : 0,
        });
        setNewValidDiseaseList(validDisArray);
        getFlagDetailsData(
          patientId,
          result.processedYear,
          result.dateOfService
        );
        getFlagCharts({ dos: result.processedYear });
        setIsLoading(false);
        setPatientResultReload(true);
      } else {
        setPatientResultReload(true);
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setValidated(false);
    setIsModalComments(false);
    setFlagContainerActive("");
  };

  const dosOnChange = async (e) => {
    setDosYearDefalutSelect(e);
    setPatientResultReload(false);
    setIsLoading(true);
    patientDetailsLoad(true);
    getPatientDosList(localPatientId, e);
    getSelectedDos("");
    await getpatientDetailsData(
      localPatientId,
      e,
      null,
      setIsLoading,
      userRole
    );
    patientDetailsLoad(false);
    getFlagCharts({ dos: e });
    // getAllRevertDetails({ dos: e });
  };

  const addComments = async (value) => {
    setFilterDataLoading(true);
    if (value == "Comments" || value == "Notes" || value == "Flag") {
      setFlagContainerActiveTitle(value);
    } else {
      setIsModalComments(true);
    }
    setFlagContainerActive(value);
    if (value == "Filter") {
      setFlagContainerActiveTitle("My Work Queue");
    }
    if (value == "Timeline") {
      setFlagContainerActiveTitle("Timeline");
      const response = await getTimelineList({
        patientId: localPatientId,
        dos: isDosSelected,
      });
      var result = response?.response?.content;
      setTimeLineData(result);
      setFilterDataLoading(false);
    }
    if (value == "Add DOS & Provider") {
      setFlagContainerActiveTitle("Add DOS & Provider");
    }
    if (value == "Version History") {
      setFlagContainerActiveTitle("Version History");
      getAllRevertDetails({ dos: isDosSelected });
    }
    if (value == "Queried") {
      setFlagContainerActiveTitle("Queried");
      getQueryDetails();
    }
  };

  const flagList = [
    {
      name: "Filter",
      icon: <FilterOutlined />,
    },
    {
      name: "Flag",
      icon: <FontAwesomeIcon icon={faFlag} />,
    },
    {
      name: "Timeline",
      icon: <FontAwesomeIcon icon={faTimeline} />,
    },
    {
      name: "Comments",
      icon: <FontAwesomeIcon icon={faComment} />,
    },
    {
      name: "Notes",
      icon: <FontAwesomeIcon icon={faCalendarDays} />,
    },
    {
      name: "Add DOS & Provider",
      icon: <PlusCircleOutlined className="text-dark" />,
    },
    {
      name: "Version History",
      icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    },
    {
      name: "Queried",
      icon: <MonitorOutlined />,
    },
  ];

  const getPatientListToDetails = async (userId, isClear) => {
    setIsLoading(true);
    patientDetailsLoad(true);
    const getYear = await getAllProcessYear(userId, "HCC");
    const year =
      getYear?.response.length > 0 ? getYear?.response[0] : selectedDosValue;
    try {
      getFlagCharts({ dos: year });

      const res = await getpatientDetailsData(
        userId,
        year,
        isClear ? "" : selectDosValue,
        setIsLoading,
        userRole
      );
      if (res.status == "SUCCESS") {
        getPatientIdData(userId);
        getPatientHccFile(res.response?.fileDetailDTO?.fileId);
        setLocalPatientId(userId);
        getPatientDosList(userId, year);
        activeLabels({
          patientId: userId,
          year: year,
          dos: "",
        });
        isClear && getSelectedDos("");
        isClear && setSelectDosValue("");
        isClear && getSelectedDosPageNumber(1);
        patientDetailsLoad(false);
        setIsModalComments(false);
        setFilterModalOpen(false);
        setWorkListPatientId(null);
      } else {
        getResponePopup(res);
        setIsSpinnerLoading(false);
        patientDetailsLoad(false);
      }
    } catch (error) {
      setIsSpinnerLoading(false);
      patientDetailsLoad(false);
    }
  };

  const handleToogleCloseNav = () => {
    if (isSideNavShow == true) {
      setIsSideNavShow(false);
    } else {
      setIsSideNavShow(true);
    }
  };

  const backToPatientData = () => {
    const backRoute = getStorage("routeBackTo");

    getRoutedData(routedData);

    navigate.push(backRoute);

    // navigate.back(

    // )
    setSelectDosValue("");
    getSelectedDosPageNumber(1);
    getPatientID(null);
    getSelectedDos("");
    getCurrentDiseaseType(true);
    patientDetailsLoad(true);
  };
  const splitUserName = (name) => {
    if (name) {
      return name[0];
    }
  };
  const renderUserDetails = async (userId) => {
    var result = "";
    var data = "";

    data = (
      <div className={visitStyles.userDetailsCard}>
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

    setTimeout(async () => {
      const response = await getUserDetails(userId);
      if (response?.response) {
        result = response?.response;
        data = (
          <div className={visitStyles.userDetailsCard}>
            <div className={visitStyles.avatarStyle}>
              <Avatar size={60}>{splitUserName(result?.userName)}</Avatar>
              <span className={visitStyles.userRole}>{result?.role[0]}</span>
            </div>
            <div className={visitStyles.userNameDetails}>
              <FontAwesomeIcon icon={faUserCircle} />
              <span>{result.userName}</span>
            </div>
            <div className={visitStyles.usertimeDetails}>
              <FontAwesomeIcon icon={faClock} />
              {/* <span>{currentTime}</span> */}
              <span>{result.actionCreatedDate}</span>
            </div>
          </div>
        );
      }
      setUserDetails(data);
    }, 1000);

    setUserDetails(data);
  };
  useEffect(() => {
    if (flagFirstData?.flag) {
      getPatientIdData(localPatientId, flagFirstData);
    }
  }, [flagFirstData?.flag]);

  useEffect(() => {
    if (workListPatientId) {
      getPatientListToDetails(workListPatientId, localOrgId, localTenantId);
    }
  }, [workListPatientId]);

  useEffect(() => {
    workFgetFlagsowData();
    if (window) {
      window.addEventListener("resize", () => {
        const width = window.innerWidth;
        setScreenWidth(width);
      });
    }
  }, []);
  useEffect(() => {
    setShowTerminal(false);
  }, []);

  const getActiveLabels = async () => {
    const patientId = getStorage("patientId");
    const res = await activeLabels({
      patientId,
      year: dosYearDefalutSelect.value
        ? dosYearDefalutSelect.value
        : dosYearDefalutSelect,
      dos: isDosSelected,
    });
  };

  useEffect(() => {
    if (dosYearDefalutSelect) {
      getActiveLabels();
    }
  }, [isDosSelected, dosYearDefalutSelect]);

  return (
    <>
      <div className={`show `} style={{ height: "100vh", background: "#fff" }}>
        {/* <NavBar /> */}
        <div className={visitStyles.headerFixed} style={{ height: "100%" }}>
          {/* {isSpinnerLoading ? (
            <LogoLoader />
          ) : ( */}
          <div class="content-body">
            {/* {isLoading ? <LogoLoader /> : null} */}
            <div className={`${visitStyles.container_fluid_patient}`}>
              <div className="row patient-file-container">
                <div className="row p-0">
                  {activeTab == "2" || activeTab == "1" || activeTab == "5"? (
                    <div className="row">
                      <div
                        id="backArrowBtn"
                        name="backArrowBtn"
                        className="col-1 d-flex align-items-center justify-content-start "
                        // style={{ zIndex: "1", marginTop: "20px" }}
                      >
                        <Button
                          onClick={backToPatientData}
                          className={` ${visitStyles.backArrowBtn}`}
                        >
                          <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{
                              color: "rgb(38 50 107)",
                            }}
                          />
                        </Button>
                      </div>
                      <div  style={{position:"relative",left:"-2%"}}className="col-11">
                        {loading || isSpinnerLoading ? (
                          <div className="my-3">
                            <CardSkeleton height={100} />
                          </div>
                        ) : (
                          <HeaderComponent
                            patienIdDetails={
                              patientIdDetailsData?.data?.response
                            }
                            patientDetails={patientDetails}
                            fileResult={patientDocumentResult}
                            hccCounts={hccCounts}
                            hccValidCount={hccValidCount}
                            flagsDetailsResult={flagsDetailsResult}
                            dosOnChange={dosOnChange}
                            setSelectDosValue={setSelectDosValue}
                            getSelectedDos={getSelectedDos}
                            dosYearDefalutSelect={dosYearDefalutSelect}
                            isLoadingDos={isLoadingDos}
                            dosYear={dosYear}
                            setCopied={setCopied}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div
                        className="col-1 d-flex align-items-center justify-content-start"
                        // style={{ zIndex: "1", marginTop: "20px" }}
                      >
                        <Button
                          onClick={backToPatientData}
                          className={` ${visitStyles.backArrowBtn}`}
                        >
                          <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{
                              color: "rgb(38 50 107)",
                            }}
                          />
                        </Button>
                      </div>
                      <div className="col-11">
                        <FileDetails
                          title={activeTab == 3 ? "Radiology" : "LAB"}
                          patienIdDetails={patientIdDetailsData?.data?.response}
                          patientDetails={patientDetails}
                          fileResult={patientDocumentResult}
                          hccCounts={hccCounts}
                          hccValidCount={hccValidCount}
                          flagFirstData={flagFirstData}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={
                      isSideNavShow
                        ? ` mt-3 ${visitStyles.visitDataMain}`
                        : ` mt-3 ${visitStyles.visitDataMainClose}`
                    }
                  >
                    <div
                      id="mySidenav"
                      name="mySidenav"
                      className={`${visitStyles.firstContainer}`}
                    >
                      <div
                        id={isSideNavShow ? "sideTabOpen" : "sideTabClose"}
                        name={isSideNavShow ? "sideTabOpen" : "sideTabClose"}
                        className={
                          isSideNavShow
                            ? `${visitStyles.sideTab}`
                            : `${visitStyles.sideTabClose}`
                        }
                      >
                        <div
                          id="mySidenavContent"
                          name="mySidenavContent"
                          className={`${visitStyles.sideNav}`}
                        >
                          <div
                            className="sideNavscroll"
                            id="sideNavscroll"
                            name="sideNavscroll"
                          >
                            <div
                              className="nav-control"
                              onClick={() => {
                                handleToogleCloseNav();
                              }}
                            >
                              <div
                                id="nav-control"
                                name="nav-control"
                                className={`${visitStyles.sideNavArrow}`}
                              >
                                <span
                                  id="nav-control-faAngle"
                                  name="nav-control-faAngle"
                                  className="line"
                                >
                                  <FontAwesomeIcon
                                    className="fa fa-search form-control-feedback"
                                    icon={
                                      isSideNavShow
                                        ? faAngleDoubleLeft
                                        : faAngleDoubleRight
                                    }
                                    style={{
                                      fontSize: "16px",
                                    }}
                                  />
                                </span>
                              </div>
                            </div>
                            <ul
                              className="ant-badge"
                              id="sideNavList"
                              name="sideNavList"
                            >
                              {tabList.map((data, index) => (
                                <Tooltip
                                  key={index}
                                  title={data.title}
                                  placement="right"
                                >
                                  <li
                                    id={`sideNavItem-${index}`}
                                    name={`sideNavItem-${index}`}
                                    className={`${visitStyles.sideNavLabel}`}
                                    onClick={() => handleNavigation(data)}
                                  >
                                    <a
                                      className={`${
                                        sideNavLabelActiveKey === data.title
                                          ? visitStyles.sideNavLabelActive
                                          : ""
                                      }`}
                                    >
                                      {isActives?.response[
                                        data.defaultComplete
                                      ] ? (
                                        <div className="menu-icon ant-badge">
                                          <Badge
                                            className="ant-badge"
                                            count={
                                              <svg
                                                className="ant-badge"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="10"
                                                  cy="10"
                                                  r="5"
                                                  fill="green"
                                                />
                                              </svg>
                                            }
                                            style={{
                                              background: "transparent",
                                              margin: "8px",
                                            }}
                                            offset={[10, 10]}
                                            size="large"
                                          >
                                            <Image
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                              }}
                                              src={data.iconStyle}
                                              alt={data.title}
                                            />
                                          </Badge>
                                        </div>
                                      ) : (
                                        <div className="menu-icon">
                                          <Image
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                            }}
                                            src={data.iconStyle}
                                            alt={data.title}
                                          />
                                        </div>
                                      )}

                                      <span
                                        className={`${visitStyles.sideNavText}`}
                                      >
                                        {data.title}
                                      </span>
                                    </a>
                                  </li>
                                </Tooltip>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${visitStyles.secondContainer}`}
                      style={{ height: "100%" }}
                    >
                      <>
                        {activeTab == 1 ? (
                          <Hcc
                            patientHccResult={patientDocumentResult}
                            year={dosYearDefalutSelect}
                            setIsLoading={setIsLoading}
                            selectDosValue={selectDosValue}
                            setSelectDosValue={setSelectDosValue}
                            isSpinnerLoading={isSpinnerLoading}
                            search={search}
                            setSearch={setSearch}
                            setFlagContainerActive={setFlagContainerActive}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            activeTab={activeTab}
                          />
                        ) : activeTab == 2 ? (
                          <NonHcc
                            patientNonHccResult={patientDocumentResult}
                            setIsLoading={setIsLoading}
                            selectDosValue={selectDosValue}
                            setSelectDosValue={setSelectDosValue}
                            setSearch={setSearch}
                            setFlagContainerActive={setFlagContainerActive}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                          />
                        ) : activeTab == 3 ? (
                          <Radiology
                            year={
                              dosYearDefalutSelect.value
                                ? dosYearDefalutSelect.value
                                : dosYearDefalutSelect
                            }
                            setDosYearDefalutSelect={setDosYearDefalutSelect}
                          />
                        ) : activeTab == 4 ? (
                          <Lab
                            year={
                              dosYearDefalutSelect?.value
                                ? dosYearDefalutSelect?.value
                                : dosYearDefalutSelect
                            }
                            setDosYearDefalutSelect={setDosYearDefalutSelect}
                          />
                        ) : activeTab == 5 ? (
                          <Hcc
                            patientHccResult={patientDocumentResult}
                            year={dosYearDefalutSelect}
                            setIsLoading={setIsLoading}
                            selectDosValue={selectDosValue}
                            setSelectDosValue={setSelectDosValue}
                            isSpinnerLoading={isSpinnerLoading}
                            search={search}
                            setSearch={setSearch}
                            setFlagContainerActive={setFlagContainerActive}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            activeTab={activeTab}
                          />
                        ) : ""}
                      </>
                    </div>

                    <div className={`${visitStyles.thirdContainer}`}>
                      <div
                        id="flagContainer"
                        name="flagContainer"
                        className={`${visitStyles.flag_container}`}
                      >
                        <ul className="" id="flagList" name="flagList">
                          {flagList?.map((data, index) => {
                            // if (
                            //   data.name === "Version History" &&
                            //   userRole !== "CODER_1" || userRole !== "CODER_2"
                            // ) {
                            //   return null;
                            // }
                            const isEditDisabled =
                              patientIdDetailsData?.data?.response
                                ?.workflow?.[0]?.status !== "PENDING" || patientDetailsResult?.data?.response?.workflow?.[0]
                                ?.status == "COMPLETED";
                            const isFlagDisabled =
                              data.name === "Flag" && !isDosSelected;
                            const isDosDisabled =
                              data.name === "Add DOS & Provider" &&
                              isDosSelected;
                            const isVersionDisabled =
                              data.name === "Version History" && !isDosSelected;
                              const isEditDisabledList = [
                                "Add DOS & Provider",
                              ].includes(data.name);

                              const isDisabled =
                              (isEditDisabled && isEditDisabledList) ||
                              isFlagDisabled ||
                              isDosDisabled ||
                              isVersionDisabled;

                            return (
                              <Tooltip
                                title={data.name}
                                placement="left"
                                key={data.name}
                              >
                                <li
                                  id={`flagListItem-${index}`}
                                  name={`flagListItem-${index}`}
                                  className={
                                    flagContainerActive === data.name
                                      ? `${visitStyles.commentsTagActive}`
                                      : `${visitStyles.commentsTag}`
                                  }
                                  onClick={() => {
                                    if (!isDisabled) {
                                      addComments(data.name);
                                    }
                                  }}
                                  style={
                                    isDisabled
                                      ? {
                                          cursor: "not-allowed",
                                          opacity: 0.5,
                                        }
                                      : {}
                                  }
                                >
                                  {data.name === "Flag" ? (
                                    <Badge
                                      count={
                                        flagsDetailsResult?.response?.length
                                      }
                                      style={{
                                        background: "#04306f",
                                        margin: "-2px",
                                        cursor: "default",
                                      }}
                                      size="large"
                                    >
                                      <i>{data.icon}</i>
                                    </Badge>
                                  ) : (
                                    <i>{data.icon}</i>
                                  )}
                                </li>
                              </Tooltip>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modals */}

                <Drawer
                  id="myworkqueueDrawer"
                  name="myworkqueueDrawer"
                  onClose={handleCloseModal}
                  open={isModalComments}
                  width={
                    flagContainerActiveTitle === "Timeline" || flagContainerActiveTitle === "Version History"
                      ? "460px"
                      : flagContainerActiveTitle === "Add DOS & Provider"
                      ? "1400px"
                       : flagContainerActiveTitle === "Queried"
                      ? "510px"
                      : null
                  }
                  title={flagContainerActiveTitle}
                  placement="right"
                  className="myworkqueueDrawer"
                  closable={false}
                  extra={
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => handleCloseModal()}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  }
                >
                  {flagContainerActive == "Timeline" ? (
                    <Timeline
                      timelineData={timelineData}
                      filterDataLoading={filterDataLoading}
                      splitUserName={splitUserName}
                      userDetails={userDetails}
                      renderUserDetails={renderUserDetails}
                    />
                  ) : flagContainerActive == "Filter" ? (
                    <>
                      {userRole == "admin" ||
                      userRole == "TENANT_ADMIN" ||
                      userRole == "OWNER" ||
                      userRole == "DOWNLOADER" ? (
                        <AdminWorkList
                          localUserId={localUserId}
                          setWorkListPatientId={setWorkListPatientId}
                          setIsModalComments={setIsModalComments}
                          getPatientListToDetails={getPatientListToDetails}
                        />
                      ) : userRole == "supervisor" ? (
                        <SupervisorWorkList
                          localUserId={localUserId}
                          setWorkListPatientId={setWorkListPatientId}
                          setIsModalComments={setIsModalComments}
                          getPatientListToDetails={getPatientListToDetails}
                        />
                      ) : (
                        <ReviwerWorkList
                          localUserId={localUserId}
                          setWorkListPatientId={setWorkListPatientId}
                          setIsModalComments={setIsModalComments}
                          getPatientListToDetails={getPatientListToDetails}
                        />
                      )}
                    </>
                  ) : flagContainerActive === "Add DOS & Provider" ? (
                    <ManuallyAddProvider
                      selectDosValue={selectDosValue}
                      dosYear={dosYear}
                      selectedDosValue={selectedDosValue}
                      dosYearDefalutSelect={dosYearDefalutSelect}
                    />
                  ) : flagContainerActive === "Queried" ? (
                    <Queried
                      queriedData={queriedData}
                      queriedLoader={queriedLoader}
                    />
                  ) : flagContainerActive === "Version History" ? (
                    <VersionHistory
                      getRevertDetails={getRevertDetails}
                      revertLoading={revertLoading}
                      splitUserName={splitUserName}
                      userDetails={userDetails}
                      renderUserDetails={renderUserDetails}
                      confirmRevert={confirmRevert}
                      isDosSelected={isDosSelected}
                      dosYearDefalutSelect={dosYearDefalutSelect}
                      getPatientListToDetails={getPatientListToDetails}
                      setIsModalComments={setIsModalComments}
                      getpatientDetailsData={getpatientDetailsData}
                      patientIdDetailsData={patientIdDetailsData}
                      activeLabels={activeLabels}
                      patientDetailsResult={patientDetailsResult}
                      getPatientDosList={getPatientDosList}
                    />
                  ) : null}
                </Drawer>
              </div>
            </div>

            {/* <Footer/> */}
          </div>
          {/* )} */}
        </div>
      </div>

      {flagContainerActive == "Comments" && (
        <Comments
          setOpen={setFlagContainerActive}
          open={flagContainerActive == "Comments" && true}
        />
      )}
      {flagContainerActive == "Notes" && (
        <Notes
          setOpen={setFlagContainerActive}
          open={flagContainerActive == "Notes" && true}
        />
      )}
      {flagContainerActive == "Flag" && (
        <Flag
          setOpen={setFlagContainerActive}
          open={flagContainerActive == "Flag" && true}
          search={search}
          setSearch={setSearch}
          selectedDosValue={selectedDosValue}
        />
      )}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getFlagsData: state?.reviewer?.workQueue?.flags?.data,
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    patientIdDetailsData: state?.patientDetails.details?.patientIdResult,
    flagsDetailsResult: state?.patientDetails.details?.flagsDetailsResult.data,
    processedYearResult: state?.patientDetails.details?.processedYear,
    radiologyDetailsResult: state?.patientDetails?.details?.radiologyResult,
    labDetailsResult: state?.patientDetails?.details?.labResult,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
    isActives: state.patientDetails.details.activeLabel?.data,
    storeFileDetails: state.patientDetails?.details?.getStoreFileIdDetails,
    preStoreFileDetails:
      state.patientDetails?.details?.getStoreFileIdDetailsPre,
    selectPatientId: state.patientDetails?.details?.selectPatientId,
    hccFileDetails: state?.patientDetails?.details?.hccFileResult,
    routedData: state.tenantAdmin?.patientSync?.routedData,
    loading: state?.patientDetails?.details?.loading,
    getRevertDetails:
      state?.patientDetails?.details?.getRevertDetails?.data?.response,
    revertLoading: state?.patientDetails?.details?.revertLoading,
    queriedData: state?.patientDetails?.details?.getQueriedDetails?.data,
    queriedLoader: state.patientDetails?.details?.getQueryLoader,
  }),
  {
    workFgetFlagsowData: workflowActions.flagsAction,
    getpatientDetailsData: detailsActions.patientDetailsAction,
    getFlagCharts: detailsActions.getFlagCharts,
    getPatientHccFile: detailsActions.patientHccFileAction,
    getPatientDosList: detailsActions.dosDeatilsAction,
    getDosPageNumber: detailsActions.dosPageNumberAction,
    getMeatQueryList: detailsActions.meatQueryAction,
    getPatientIdData: detailsActions.patientIdDetailsAction,
    getFlagDetailsData: detailsActions.getFlagDetailsAction,
    getLabFileDetailsClear: detailsActions.labDetailsActionSetFileEmpty,
    getLabDetailsClear: detailsActions.labDetailsActionSetEmpty,
    getRadiologyDetailsClear: detailsActions.radiologyDetailsActionSetEmpty,
    getRadiologyFileClear: detailsActions.radiologyDetailsActionSetEmpty,
    getAllProcessYear: detailsActions.getAllProcessYearAction,
    getPatientRadiologyDosList: detailsActions.radiologyDosDeatilsAction,
    getRadiologyDetails: detailsActions.radiologyDetailsAction,
    getPatientLabDosList: detailsActions.labDosDeatilsAction,
    getLabDetails: detailsActions.labDetailsAction,
    getCurrentDiseaseType: detailsActions.getCurrentDiseaseType,
    activeLabels: detailsActions.activeLabels,
    getSelectedDos: detailsActions.getSelectedDos,
    // getCurrentProcessYearAction: detailsActions.getCurrentProcessYearAction,
    storePrePatientFileId: detailsActions.stroeFileIdPreAction,
    storeCurrentFile: detailsActions.storeFileIdAction,
    getPatientID: detailsActions.getPatientID,
    getActiveTab: allReportActions.activeTab,
    getFilteredList: reviewerWorkQueueAction.reviewerFilterList,
    getRoutedData: allActions.getRoutedData,
    getSelectedDosPageNumber: detailsActions.getSelectedDosPageNumber,
    patientDetailsLoad: detailsActions.patientDetailsLoad,
    getAllRevertDetails: detailsActions.revertDetails,
    confirmRevert: detailsActions.confirmRevertDetails,
    getQueryDetails: detailsActions.getQuery,
    activeLabels: detailsActions.activeLabels,
    getPatientDosList: detailsActions.dosDeatilsAction,
  }
);
export default enhancer(Details);
