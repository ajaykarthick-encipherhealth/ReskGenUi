import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../../jsx/layouts/nav/Header";
import { useSelector, useDispatch, connect } from "react-redux";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import visitStyles from "../../../styles/visitdata.module.css";
import moment from "moment";
import TableStyle from "../../../components/table/table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterOutlined } from "@ant-design/icons";
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
} from "@fortawesome/free-solid-svg-icons";

import { Avatar, Tooltip, Select, Badge, notification, Drawer } from "antd";
import { IMAGES, SVGICON } from "../../../jsx/constant/theme";
import { Button, Offcanvas } from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/router";
import Hcc from "./hcc/index";
import NonHcc from "./non-hcc/index";
import Radiology from "./radiology/index";
import Lab from "./lab/index";
import SpinnerDots from "../../../components/spinner";
import { getPatientID } from "../../../store/actions/PatientsActions";
import Timeline from "./timline";
import ReviwerWorkList from "./components/reviwerWorklist";
import SupervisorWorkList from "./components/supervisorWorklist";
import AdminWorkList from "./components/adminWorklist";
import { getAllSectionColor } from "../../../store/actions/ReviewerAction/PatientDetailsAction";
import { actions as workflowActions } from "../../../stores/reviewer/workqueue";
import { actions as detailsActions } from "../../../stores/patient/details";
import styles from "../details/hcc/styles.module.css";
import Comments from "./components/comments";
import Notes from "./components/notes";
import Flag from "./components/flag";
import StatusAction from "./components/statusAction";
import { handleCopyToClipboard } from "../../commonFunctions";
import LogoLoader from "../../logoLoader";
import FileDetails from "./components/fileDetails";
import { PlusCircleOutlined } from "@ant-design/icons";
import ManuallyAddProvider from "./manuallyAddProvider";
import { getAge } from "../../../utils/reusable";

export const navigetPageDetails = async (
  pageTitle,
  setSideNavLabelActiveKey,
  setPatientDocumentResult,
  setActiveTab,
  setIsLoadingDos,
  setIsLoading
) => {
  setSideNavLabelActiveKey(pageTitle);
  var patientId = localStorage.getItem("patientId");
  var orgId = localStorage.getItem("orgId");
  if (pageTitle == "HCC" && patientId) {
    setActiveTab(1);
    // const response = await axios.get(
    //   ENDPOINTS.apiEndoint +
    //     `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    // );
    // if (response.data) {
    //   var result = response.data.response;
    //   setPatientDocumentResult(result);
    // }
    // setActiveTab(1);
  }
  if (pageTitle == "NON HCC") {
    setActiveTab(2);
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
  getCurrentProcessYearAction,
  activeLabels,
  isDosSelected,
  isActives,
  getSelectedDos,
}) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
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
  const [patienIdDetails, setPatienIdDetails] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [flagFirstData, setFlagFirstData] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);
  const [patientResultReload, setPatientResultReload] = useState(false);
  const selectPatientId = useSelector((state) => state.patients?.patiendId);
  const [userRole, setUserRole] = useState("");
  const [hccValidCount, setHccValidCount] = useState(0);
  const [hccCounts, setHccCounts] = useState({ isCmsHcc: 0, isRxHcc: 0 });
  const [workListPatientId, setWorkListPatientId] = useState(null);
  const [isFileCheck, setIsFileCheck] = useState(false);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectDosValue, setSelectDosValue] = useState("");
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
  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    if (activeTab == 1) {
      getAllProcessYear(patientId, "HCC");
    }
    // if (activeTab == 3) {
    //   getAllProcessYear(patientId, "RADIOLOGY");
    // }
    // if (activeTab == 4) {
    //   getAllProcessYear(patientId, "LAB");
    // }
    var dosYearArr = processedYearResult?.data?.response?.map((res) => {
      return { value: res, label: res };
    });
    if (activeTab == 3) {
      // getRadiologyDetails(
      //   selectPatientId ? selectPatientId?.patirntId : patientId,
      //   dosYearArr[0]?.value,
      //   null,
      //   setIsSpinnerLoading
      // );
      getPatientRadiologyDosList(
        selectPatientId ? selectPatientId?.patirntId : patientId,
        dosYearArr[0]?.value
      );
    }
    if (activeTab == 4) {
      // getLabDetails(
      //   selectPatientId ? selectPatientId?.patirntId : patientId,
      //   dosYearArr[0]?.value,
      //   null,
      //   setIsSpinnerLoading
      // );
      getPatientLabDosList(
        selectPatientId ? selectPatientId?.patirntId : patientId,
        dosYearArr[0]?.value
      );
    }
  }, [activeTab]);

  useEffect(() => {
    setCount((prevCount) => prevCount + 1);
    if (count == 1 && processedYearResult?.data?.response) {
      getAllProcessYearSelect(processedYearResult);
    }
  }, [processedYearResult]);

  useEffect(() => {
    getLabFileDetailsClear();
    getLabDetailsClear();
    getRadiologyDetailsClear();
    getRadiologyFileClear();
  }, []);

  useEffect(() => {
    const orgId = localStorage.getItem("orgId");
    const tenId = localStorage.getItem("tenantId");
    const patientId = localStorage.getItem("patientId");
    const uId = localStorage.getItem("userId");
    const userRoleLocal = localStorage.getItem("userRole");

    setUserRole(userRoleLocal);
    setLocalOrgId(orgId);
    setLocalTenantId(tenId);
    setLocalUserId(uId);
    setLocalPatientId(selectPatientId ? selectPatientId?.patirntId : patientId);
    getPatientDetails(
      selectPatientId ? selectPatientId?.patirntId : patientId,
      patientDetailsResult?.data?.response
    );
  }, [patientDetailsResult?.data?.response]);

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    setLocalPatientId(selectPatientId ? selectPatientId?.patirntId : patientId);
    if (activeTab == 3 || activeTab == 4) {
      getPatientDetails(
        selectPatientId ? selectPatientId?.patirntId : patientId,
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
      const patientId = localStorage.getItem("patientId");
      if (
        isFileCheck == false &&
        patientId == patientDetailsResult?.data?.response.patientId
      ) {
        getPatientHccFile(
          patientDetailsResult?.data?.response?.fileDetailDTO?.azureBlobPath
        );
        setIsFileCheck(true);
      }
    } else {
      setIsSpinnerLoading(false);
    }
  }, [patientDetailsResult?.data?.response?.fileDetailDTO?.azureBlobPath]);

  const getAllProcessYearSelect = async (result) => {
    const patientId = localStorage.getItem("patientId");

    var dosYearArr = result?.data?.response?.map((res) => {
      return { value: res, label: res };
    });
    setDosYearDefalutSelect(dosYearArr[0]);
    setSelectedDosValue(dosYearArr[0]?.value);
    setDosYear(dosYearArr);
    setIsLoadingDos(false);
    if (result?.data?.response?.length > 0) {
      if (activeTab == 1) {
        getpatientDetailsData(
          selectPatientId ? selectPatientId?.patirntId : patientId,
          dosYearArr[0]?.value,
          null,
          setIsSpinnerLoading,
          userRole
        );
        getPatientIdData(
          selectPatientId ? selectPatientId?.patirntId : patientId
        );
        getPatientDosList(
          selectPatientId ? selectPatientId?.patirntId : patientId,
          dosYearArr[0]?.value
        );
        getDosPageNumber(
          selectPatientId ? selectPatientId?.patirntId : patientId,
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
      }
      getMeatQueryList(patientId, result?.processedYear);
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
        // getFlagListLastDetails(patientId, result.processedYear);
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
    getPatientDosList(localPatientId, e);
    getSelectedDos("");
    getpatientDetailsData(localPatientId, e, null, setIsLoading, userRole);
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
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/actioneventaudit?patientid=${localPatientId}&pageno=${0}&pagesize=${100}`
      );
      var result = response.data.response.content;
      setTimeLineData(result);
      setFilterDataLoading(false);
    }
    if (value == "Add DOS & Provider") {
      setFlagContainerActiveTitle("Add DOS & Provider");
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
  ];

  const getPatientListToDetails = (userId, orgId, tenantId) => {
    setIsLoading(true);
    getpatientDetailsData(
      userId,
      selectedDosValue,
      null,
      setIsLoading,
      userRole
    );
    getPatientIdData(userId);
    setLocalPatientId(userId);
  };

  const handleToogleCloseNav = () => {
    if (isSideNavShow == true) {
      setIsSideNavShow(false);
    } else {
      setIsSideNavShow(true);
    }
  };

  const backToPatientData = () => {
    dispatch(getPatientID(null));

    getCurrentDiseaseType(true);
    const user = localStorage.getItem("userRole");
    if (user && user.toLowerCase() === "admin") {
      const { user: _, ...queryWithoutUser } = navigate.query;
      const queryString = new URLSearchParams(queryWithoutUser).toString();
      if (navigate.query.isAdminTracking) {
        const url = queryString
          ? `/admin/tracking?${queryString}`
          : "/admin/tracking";
        navigate.push(url);
      } else {
        const url = queryString
          ? `/admin/patients?${queryString}`
          : "/admin/patients";
        navigate.push(url);
      }
    } else if (user && user.toLowerCase() === "tenant_admin") {
      if (user && user.toLowerCase() === "tenant_admin") {
        const { user: _, ...queryWithoutUser } = navigate.query;
        const queryString = new URLSearchParams(queryWithoutUser).toString();
        if (navigate.query.isTenantAdminTracking) {
          const url = queryString
            ? `/tenantAdmin/tracking?${queryString}`
            : "/tenantAdmin/tracking";
          navigate.push(url);
        } else {
          const url = queryString
            ? `/tenantAdmin/patients?${queryString}`
            : "/tenantAdmin/patients";
          navigate.push(url);
        }
      }
    } else if (user && user.toLowerCase() === "supervisor") {
      const { user: _, ...queryWithoutUser } = navigate.query;
      const queryString = new URLSearchParams(queryWithoutUser).toString();
      //  console.log(navigate.query)
      if (navigate.query.isSupervisorAuited === "true") {
        // const url = queryString
        //   ? `/supervisor/auditing?${queryString}`
        //   : "/supervisor/auditing";
        navigate.push(
          {
            pathname: `/supervisor/auditing?userId=${queryWithoutUser?.userName}`,
            query: queryString ? queryString : "",
          },
          `/supervisor/auditing?userId=${queryWithoutUser?.userName}`
        );
      } else if (navigate.query.isSupervisorUser === "true") {
        // const url = queryString
        //   ? `/supervisor/user/userQueue?${queryString}`
        //   : "/supervisor/user/userQueue";
        navigate.push(
          {
            pathname: `/supervisor/user/userQueue`,
            query: queryString ? queryString : "",
          },
          `/supervisor/user/userQueue?userId=${queryWithoutUser?.userName}`
        );
      } else {
        navigate.back();
      }
    } else if (user && user.toLowerCase() === "reviewer") {
      const { user: _, ...queryWithoutUser } = navigate.query;
      const queryString = new URLSearchParams(queryWithoutUser).toString();
      if (navigate.query && queryString) {
        // const url = queryString ? `/reviewer/patients` : "/reviewer/patients";
        navigate.push(
          {
            pathname: "/reviewer/patients",
            query: queryString ? queryString : "",
          },
          "/reviewer/patients"
        );
      } else {
        navigate.back();
      }
    } else {
      navigate.back();
    }
    setSelectDosValue("");
  };

  const splitUserName = (name) => {
    if (name) {
      return name[0];
    }
  };

  const getFlagListLastDetails = async (patientId, year) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/flagdetails/get?patientId=${
          patientId ? patientId : ""
        }&processedYear=${year}`
    );
    if (response.data.response.length != 0) {
      setFlagFirstData(response?.data?.response[0]);
    }
    // setFilterDataLoading(false);
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
      const response = await axios.get(
        ENDPOINTS.apiEndoint + `dbservice/user/get?userName=${userId}`
      );

      if (response.data) {
        result = response.data.response;
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

  const getMastData = (value) => {
    if (value) {
      return value.split("").splice(0, 3).join("") + "xxxx";
    }
  };

  const getActiveLabels = async () => {
    const patientId = localStorage.getItem("patientId");
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
      <div
        className={`show ${sideMenu ? "menu-toggle" : ""}`}
        style={{ height: "100vh", background: "#fff" }}
      >
        <NavBar />
        <div className={visitStyles.headerFixed} style={{ height: "100%" }}>
          {isSpinnerLoading ? (
            <LogoLoader />
          ) : (
            <div class="content-body">
              {isLoading ? <LogoLoader /> : null}
              {/* {sectionColorList?.loading == true ? (
              <SpinnerDots />
            ) : ( */}
              <div className={`${visitStyles.container_fluid_patient}`}>
                <div className="row patient-file-container">
                  <div className="col-xl-12">
                    <div className="row">
                      {activeTab == 1 || activeTab == 2 ? (
                        <>
                          <div
                            className="col-xl-1 col-sm-12"
                            style={{ zIndex: "1" }}
                          >
                            <Button
                              onClick={backToPatientData}
                              className={`ms-2 ${visitStyles.backArrowBtn}`}
                            >
                              <FontAwesomeIcon
                                icon={faArrowLeft}
                                style={{
                                  color: "rgb(38 50 107)",
                                }}
                              />
                            </Button>
                          </div>
                          <div
                            className={`${
                              !screenWidth || screenWidth > 1500
                                ? "col-xl-7"
                                : "col-xl-10"
                            } col-sm-12`}
                          >
                            <div
                              className={`${visitStyles.patient_info_details}`}
                            >
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-xl-2 col-sm-12">
                                    <FontAwesomeIcon icon={faIdCardClip} />
                                    <label>Patient ID</label>
                                    {/* <Tooltip
                                  placement="bottom"
                                  title={patientDocumentResult.patientId}
                                > */}
                                    <h6
                                      onClick={() =>
                                        handleCopyToClipboard({
                                          text: patientDocumentResult.patientId,
                                          setCopied: setCopied,
                                        })
                                      }
                                      className="ageDtails"
                                      style={{
                                        paddingLeft: "25px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {getMastData(
                                        patientDocumentResult.patientId
                                      )}
                                    </h6>
                                    {/* </Tooltip> */}
                                  </div>
                                  <div className="col-xl-2 col-sm-12">
                                    <FontAwesomeIcon icon={faUserCircle} />

                                    <label>Patient Name</label>
                                    {/* <Tooltip
                                  placement="bottom"
                                  title={patientDocumentResult.patientId}
                                > */}
                                    <h6 className="ageDtails">
                                      {getMastData(
                                        patientIdDetailsData?.data?.response
                                          ?.firstName
                                      )}
                                    </h6>
                                    {/* </Tooltip> */}
                                  </div>
                                  <div className="col-xl-2 col-sm-12">
                                    <FontAwesomeIcon icon={faFile} />

                                    <label>File Name</label>
                                    <h6 className="ageDtails">
                                      {
                                        patientDocumentResult?.fileDetailDTO
                                          ?.fileName
                                      }
                                    </h6>
                                  </div>
                                  <div className="col-xl-1 col-sm-12">
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    <label>Age</label>
                                    <h6
                                      className="ageDtails"
                                      style={{ paddingLeft: "20px" }}
                                    >
                                      {getAge(
                                        patientIdDetailsData?.data?.response
                                          ?.dob
                                      )}
                                    </h6>
                                  </div>
                                  <div className="col-xl-2 col-sm-12">
                                    <FontAwesomeIcon icon={faVenusMars} />
                                    <label>Gender</label>
                                    <h6
                                      className="ageDtails"
                                      style={{ paddingLeft: "25px" }}
                                    >
                                      {
                                        patientIdDetailsData?.data?.response
                                          ?.gender
                                      }
                                    </h6>
                                  </div>
                                  <div className="col-xl-2 col-sm-12">
                                    <i className={visitStyles.dob_icon}>
                                      {SVGICON.DatebirthIcon}
                                    </i>
                                    <label>DOB</label>
                                    <h6 className="ageDtails">
                                      {
                                        patientIdDetailsData?.data?.response
                                          ?.dob
                                      }
                                    </h6>
                                  </div>
                                  <div className="col-xl-1 col-sm-12">
                                    <div
                                      className={`${visitStyles.priorityStatus} p-0`}
                                    >
                                      {patienIdDetails?.priority == "URGENT" ? (
                                        <div
                                          className={
                                            visitStyles.priorityStatusIcon
                                          }
                                        >
                                          <i>{SVGICON.alert}</i>
                                          <span
                                            style={{
                                              fontSize: "13px",
                                              fontWeight: 500,
                                              color: "red",
                                            }}
                                          >
                                            Urgent
                                          </span>
                                        </div>
                                      ) : patienIdDetails?.priority ==
                                        "HIGH" ? (
                                        <div
                                          className={
                                            visitStyles.priorityStatusIcon
                                          }
                                        >
                                          <i className={TableStyle.highFlag}>
                                            {SVGICON.alert}
                                          </i>
                                          <span
                                            style={{
                                              fontSize: "13px",
                                              fontWeight: 500,
                                              color: "#cf940a",
                                            }}
                                          >
                                            High
                                          </span>
                                        </div>
                                      ) : patienIdDetails?.priority ==
                                        "NORMAL" ? (
                                        <div
                                          className={
                                            visitStyles.priorityStatusIcon
                                          }
                                        >
                                          <i className={TableStyle.normalFlag}>
                                            {SVGICON.alert}
                                          </i>
                                          <span
                                            style={{
                                              fontSize: "13px",
                                              fontWeight: 500,
                                              color: "#4466ff ",
                                            }}
                                          >
                                            Normal
                                          </span>
                                        </div>
                                      ) : (
                                        <div
                                          className={
                                            visitStyles.priorityStatusIcon
                                          }
                                        >
                                          <i className={TableStyle.lowFlag}>
                                            {SVGICON.alert}
                                          </i>
                                          <span
                                            style={{
                                              fontSize: "13px",
                                              fontWeight: 500,
                                              color: "#87909e",
                                            }}
                                          >
                                            Low
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${
                              !screenWidth || screenWidth > 1500
                                ? "col-xl-1"
                                : "col-xl-2"
                            } col-sm-12`}
                          >
                            <div className={visitStyles.priorityStatus}>
                              <div className={`${visitStyles.hccCountHeader} `}>
                                <label>CMS</label>

                                <h6 className="ageDtails">
                                  {hccCounts.isCmsHcc}
                                </h6>
                              </div>
                              {localUserId !=
                                "reviewer@3gencogentai.onmicrosoft.com" && (
                                <>
                                  <div
                                    className={`${visitStyles.hccCountHeader} `}
                                  >
                                    <label>RX</label>

                                    <h6 className="ageDtails">
                                      {hccCounts.isRxHcc}
                                    </h6>
                                  </div>
                                  <div
                                    className={`${visitStyles.hccCountHeader} `}
                                  >
                                    <label>TOTAL</label>

                                    <h6 className="ageDtails">
                                      {hccValidCount}
                                    </h6>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            className={`${
                              !screenWidth || screenWidth > 1500
                                ? "col-xl-1"
                                : "col-xl-2"
                            } col-sm-12 px-4 d-flex`}
                          >
                            <div className={`${visitStyles.rafscoreheader} `}>
                              <label>Score</label>
                              {patientDetails?.rafScore?.rafVersionDTO
                                ?.overAllScore != null ? (
                                <h6 className="ageDtails">
                                  {patientDetails?.rafScore?.rafVersionDTO?.overAllScore?.toFixed(
                                    3
                                  )}
                                </h6>
                              ) : (
                                <h6 className="ageDtails">0.00</h6>
                              )}
                            </div>
                            <span
                              className={`${visitStyles.commentsName} ${visitStyles.statusFLag}`}
                            >
                              {/* {flagFirstData.flag} */}
                              {flagFirstData?.flag == "PATIENT_NAME_MISSED" ? (
                                <Tooltip
                                  title="PATIENT_NAME_MISSED"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.name_missed}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag ==
                                "PATIENT_DOB_MISSED" ? (
                                <Tooltip
                                  title="PATIENT_DOB_MISSED"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.dob_missed}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag == "MRN_ID_MISMATCH" ? (
                                <Tooltip
                                  title="MRN_ID_MISMATCH"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.id_missed}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag ==
                                "PROVIDER_SIGN_MISSED" ? (
                                <Tooltip
                                  title="PROVIDER_SIGN_MISSED"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.sign_missed}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag ==
                                "PROVIDER_SIGNATURE_MISSED" ? (
                                <Tooltip
                                  title="PROVIDER_SIGNATURE_MISSED"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.signature_missed}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag ==
                                "PROVIDER_CREDENTIAL_MISSED" ? (
                                <Tooltip
                                  title="PROVIDER_CREDENTIAL_MISSED"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.cred_missed}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag ==
                                "PROVIDER_SIGN_STATUS_PENDING" ? (
                                <Tooltip
                                  title="PROVIDER_SIGN_STATUS_PENDING"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.sign_status}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag == "NO_HCC_FOUND" ? (
                                <Tooltip
                                  title="NO_HCC_FOUND"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.no_hcc_found}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag ==
                                "NO_VALID_DOCUMENT_FOUND" ? (
                                <Tooltip
                                  title="NO_VALID_DOCUMENT_FOUND"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.no_doc_found}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag == "PATIENT_DECEASED" ? (
                                <Tooltip
                                  title="PATIENT_DECEASED"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.patient_diseased}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : flagFirstData?.flag == "PATIENT_INACTIVE" ? (
                                <Tooltip
                                  title="PATIENT_INACTIVE"
                                  placement="bottom"
                                >
                                  <i className={visitStyles.patient_inactive}>
                                    {SVGICON.emptyFlagSmallLarge}
                                  </i>
                                </Tooltip>
                              ) : null}
                            </span>
                          </div>

                          <div className="col-xl-1 col-sm-2">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-xl-12 col-sm-12">
                                  {!isLoadingDos ? (
                                    <>
                                      <Select
                                        placeholder="Year"
                                        value={dosYearDefalutSelect}
                                        onChange={(e) => {
                                          dosOnChange(e);
                                          setSelectDosValue("");
                                          getSelectedDos("");
                                        }}
                                        className={`custom_select_type ${visitStyles.custom_select_type}`}
                                        options={dosYear}
                                        style={{
                                          backgroundColor: "#F3F3FF",
                                          width: "120px",
                                        }}
                                      />
                                      {/* <Select
                                    onChange={(e) => dosOnChange(e)}
                                    options={dosYear}
                                    className={`custom-react-select ${visitStyles.dosSelectPicker}`}
                                    defaultValue={dosYearDefalutSelect}
                                    isSearchable={false}
                                  /> */}
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${
                              !screenWidth || screenWidth > 1500
                                ? "col-xl-1"
                                : "col-xl-2"
                            } col-sm-12`}
                          >
                            <StatusAction />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="col-xl-1 col-sm-12"
                            style={{ zIndex: "1", marginTop: "20px" }}
                          >
                            <Button
                              onClick={backToPatientData}
                              className={`ms-2 ${visitStyles.backArrowBtn}`}
                            >
                              <FontAwesomeIcon
                                icon={faArrowLeft}
                                style={{
                                  color: "rgb(38 50 107)",
                                }}
                              />
                            </Button>
                          </div>
                          <div className="col-xl-11">
                            <FileDetails
                              title={activeTab == 3 ? "Radiology" : "LAB"}
                              patienIdDetails={patienIdDetails}
                              patientDetails={patientDetails}
                              fileResult={patientDocumentResult}
                              hccCounts={hccCounts}
                              hccValidCount={hccValidCount}
                              flagFirstData={flagFirstData}
                            />
                          </div>
                        </>
                      )}
                      <div
                        className={
                          isSideNavShow
                            ? `${visitStyles.visitDataMain}`
                            : `${visitStyles.visitDataMainClose}`
                        }
                      >
                        <div className={`${visitStyles.firstContainer}`}>
                          <div
                            className={
                              isSideNavShow
                                ? `${visitStyles.sideTab}`
                                : `${visitStyles.sideTabClose}`
                            }
                          >
                            <div className={`${visitStyles.sideNav}`}>
                              <div className="sideNavscroll">
                                <div
                                  className="nav-control"
                                  onClick={() => {
                                    handleToogleCloseNav();
                                  }}
                                >
                                  <div
                                    className={`${visitStyles.sideNavArrow}`}
                                  >
                                    <span className="line">
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
                                {/* <ul>
                                  {tabList.map((data, index) => (
                                    <Tooltip
                                      title={data.title}
                                      placement="right"
                                    >
                                      <li
                                        className={`${visitStyles.sideNavLabel}`}
                                        onClick={() =>
                                          navigetPageDetails(
                                            data.type,
                                            setSideNavLabelActiveKey,
                                            setPatientDocumentResult,
                                            setActiveTab,
                                            setIsLoadingDos,
                                            setIsLoading
                                          )
                                        }
                                      >
                                        <a
                                          className={` ${
                                            sideNavLabelActiveKey === data.title
                                              ? visitStyles.sideNavLabelActive
                                              : ""
                                          }`}
                                        >
                                          <div className="menu-icon">
                                            <Image src={data.iconStyle} />
                                          </div>
                                          <span
                                            className={`${visitStyles.sideNavText}`}
                                          >
                                            {data.title}
                                          </span>
                                        </a>
                                      </li>
                                    </Tooltip>
                                  ))}
                                </ul> */}
                                <ul>
                                  {tabList.map((data, index) => (
                                    <Tooltip
                                      key={index}
                                      title={data.title}
                                      placement="right"
                                    >
                                      <li
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
                                            <div className="menu-icon">
                                              <Badge
                                                count={
                                                  <svg
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
                                                  src={data.iconStyle}
                                                  alt={data.title}
                                                />
                                              </Badge>
                                            </div>
                                          ) : (
                                            <div className="menu-icon">
                                              <Image
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
                              />
                            ) : activeTab == 2 ? (
                              <NonHcc
                                patientNonHccResult={patientDocumentResult}
                                setIsLoading={setIsLoading}
                                selectDosValue={selectDosValue}
                                setSelectDosValue={setSelectDosValue}
                              />
                            ) : activeTab == 3 ? (
                              <Radiology
                                year={
                                  dosYearDefalutSelect.value
                                    ? dosYearDefalutSelect.value
                                    : dosYearDefalutSelect
                                }
                                setDosYearDefalutSelect={
                                  setDosYearDefalutSelect
                                }
                              />
                            ) : (
                              <Lab
                                year={
                                  dosYearDefalutSelect.value
                                    ? dosYearDefalutSelect.value
                                    : dosYearDefalutSelect
                                }
                                setDosYearDefalutSelect={
                                  setDosYearDefalutSelect
                                }
                              />
                            )}
                          </>
                        </div>

                        <div className={`${visitStyles.thirdContainer}`}>
                          <div className={`${visitStyles.flag_container}`}>
                            <ul className="">
                              {flagList?.map((data) => {
                                return (
                                  <Tooltip title={data.name} placement="left">
                                    <li
                                      className={
                                        flagContainerActive == data.name
                                          ? `${visitStyles.commentsTagActive}`
                                          : `${visitStyles.commentsTag}`
                                      }
                                      onClick={() => addComments(data.name)}
                                    >
                                      {data.name === "Flag" ? (
                                        <Badge
                                          count={
                                            flagsDetailsResult?.response?.length
                                          }
                                          style={{
                                            background: "#04306f",
                                            margin: "-2px",
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
                  </div>

                  {/* Modals */}

                  <Drawer
                    onClose={handleCloseModal}
                    open={isModalComments}
                    width={
                      flagContainerActiveTitle === "Timeline"
                        ? "460px"
                        : flagContainerActiveTitle === "Add DOS & Provider"
                        ? "1200px"
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
                        {userRole == "admin" || userRole == "tenant_admin" ? (
                          <AdminWorkList
                            localUserId={localUserId}
                            setWorkListPatientId={setWorkListPatientId}
                            setIsModalComments={setIsModalComments}
                          />
                        ) : userRole == "supervisor" ? (
                          <SupervisorWorkList
                            localUserId={localUserId}
                            setWorkListPatientId={setWorkListPatientId}
                            setIsModalComments={setIsModalComments}
                          />
                        ) : (
                          <ReviwerWorkList
                            localUserId={localUserId}
                            setWorkListPatientId={setWorkListPatientId}
                            setIsModalComments={setIsModalComments}
                          />
                        )}
                      </>
                    ) : flagContainerActive === "Add DOS & Provider" ? (
                      <ManuallyAddProvider />
                    ) : null}
                  </Drawer>
                </div>
              </div>

              {/* <Footer/> */}
            </div>
          )}
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
  }),
  {
    workFgetFlagsowData: workflowActions.flagsAction,
    getpatientDetailsData: detailsActions.patientDetailsAction,
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
    getCurrentProcessYearAction: detailsActions.getCurrentProcessYearAction,
  }
);
export default enhancer(Details);
