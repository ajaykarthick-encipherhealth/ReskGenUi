import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { InputText } from "primereact/inputtext";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import "react-vertical-timeline-component/style.min.css";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faCheck,
  faAdd,
  faInfo,
  faUser,
  faSearch,
  faCheckCircle,
  faArrowLeft,
  faPlus,
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
  faCog,
  faClock,
  faArrowsAlt,
  faCalendar,
  faCircle,
  faCircleUp,
  faSitemap,
  faCircleUser,
  faTrash,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Popconfirm,
  Select,
  Popover,
  Menu,
  DatePicker,
  Dropdown,
  Tag,
  message,
} from "antd";
import { IMAGES, SVGICON } from "../../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Offcanvas } from "react-bootstrap";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import { Avatar, Tooltip } from "antd";
import Spinner from "../../../../../../components/loadingSpinner";
import styles from "../styles.module.css";
import {
  getFilePageNumber,
  getMeatQueryList,
  submitMeatQuery,
  updateMeatQuery,
  getProviderDetails,
  manuallyAddComboCode,
  deleteMeatQuery,
  getProviderEncounterDetails,
} from "../../../../../../services/PatientsListSevice";
import { getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import CamboTree from "../org";

const { Option } = Select;
const addOnCodeColor = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];
const MeatQuery = ({}) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  let searchKeywords = [];
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const meatQueryDetails = useSelector(
    (state) => state?.ReviewerReducers?.meatQueryList
  );

  console.log(meatQueryDetails);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;
  const { setTargetPages } = searchPluginInstance;

  // setTargetPages((targetPage) => targetPage.pageIndex === 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileFormShow, setIsFileFormShow] = useState(false);
  const [isModalOpenValid, setIsModalOpenValid] = useState(false);
  const [isModalOpenValidCodes, setIsModalOpenValidCodes] = useState(false);
  const [isModalOpenCaptureSection, setIsModalOpenCaptureSection] =
    useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [confirmNotesModalInValid, setConfirmNotesModalInValid] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
  const [invalidMoveDiseasesList, setInvalidMoveDiseasesList] = useState([]);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] =
    useState([]);

  const [validDiseasesList, setValidDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectCode, setSelectCode] = useState("");
  const [dosYear, setDosYear] = useState("");
  const [dosYearRadiology, setDosYearRadiology] = useState("");
  const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState("");
  const [dosYearDefalutSelectRadiology, setDosYearDefalutSelectRadiology] =
    useState("");
  const [radiologyFileDetailCheck, setRadiologyFileDetailCheck] =
    useState(false);
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [selectMeatFileId, setSelectMeatFileId] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [selectFileURLValid, setSelectFileURLValid] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rafScore, setRAFScore] = useState([]);
  const [patientDetails, setPatientDetails] = useState([]);
  const [patientDetailsRadiology, setPatientDetailsRadiology] = useState([]);
  const [opens, setOpens] = useState(false);
  const [rafHccList, setRafScoreHccList] = useState([]);
  const [isMatchBtn, setIsMatchBtn] = useState(false);
  const [matchHccList, setMatchHccList] = useState([]);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [newInValidDiseaseList, setInNewValidDiseaseList] = useState([]);
  const [unMatchResList, setNewUnMatchHccList] = useState([]);
  const [meatColorCodeList, setMeatColorCodeList] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [dbDescriptionRes, setDbDescriptionRes] = useState([]);

  const [openPopover, setOpenPopover] = useState(false);

  const [activeTab, setActiveTab] = useState(1);
  const [activeTabHead, setActiveTabHead] = useState("file");
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
  const [isModalOpenLab, setIsModalOpenLab] = useState(false);

  const [radiologyResCheck, setRadiologyResCheck] = useState(false);
  const [radiologyFileProcessing, setRadiologyFileProcessing] = useState(
    "Please wait file processing..."
  );

  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [labReportSlider, setLapReportSlider] = useState(false);
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    notes: "",
    diagnosisCode: "",
    actualDescription: "",
    capturedSections: "",
    encodedDate: "",
    flag: "",
    comments: "",
    description: "",
    queryReason: "",
    providerName: "",
    imagingTestHeader: "",
    headerName: "",
    queryComment: "",
    reason: "",
    diagnosisCodeQuery: "",
    comboCode: "",
    additionalCode: "",
  });
  const [inputValueMeat, setInputValueMeat] = useState({
    year: "",
    diseaseName: "",
    diagnosisCode: "",
    isMeatCriteriaPresent: true,
    monitorCapturedFromHeader: "",
    monitor: "",
    evaluateCapturedFromHeader: "",
    evaluate: "",
    assessmentCapturedFromHeader: "",
    assessment: "",
    treatment: "",
    treatmentCapturedFromHeader: "",
    encounterDate: "",
    radiology: false,
    lab: false,
    isManuallyAdded: true,
    reason: "",
    actualDescription: "",
  });

  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [selectLabReportFile, setSelectLabReportFile] = useState(null);

  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");

  const [validHccDetails, setvalidHccDetails] = useState("");
  const [validLocalFileDownloadAndView, setValidLocalFileDownloadAndView] =
    useState([]);

  const [unMatchListNonHcc, setUnmatchListNonHcc] = useState([]);
  const [comboDiseaseCodesListNonHcc, setComboDiseaseCodesListNonHcc] =
    useState([]);
  const [meatCriteriaListNonHcc, setMeatCriteriaListNonHcc] = useState([]);
  const [yearOfServiceList, setYearOfServiceList] = useState([]);
  const [isLoadingDos, setIsLoadingDos] = useState(true);
  const [suggestedModal, setSuggestedModal] = useState(false);
  const [suggesteSelectValue, setSuggestedSelectValue] = useState("");
  const [suggesteSelectCode, setSuggestedSelectCode] = useState("");
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [suggestedBtnTitle, setSuggestedBtnTitle] = useState("Add");
  const [selectInvalidDetails, setSelectInvalidDetails] = useState(false);
  const [selectActiveCode, setSelectActiveCode] = useState("");
  const [labReportValidList, setLabReportValidList] = useState([]);
  const [labReportMeatList, setLabReportMeatList] = useState([]);
  const [labReportFile, setLabReportFile] = useState([]);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [suggestedNonHccList, setSuggestedNonHccList] = useState([]);
  const [nonHccActiveCodes, setNonHccActiveCodes] = useState(false);
  const [radiologyFileDateofServieList, setFileRadiologyDateofServiceList] =
    useState([]);
  const [radiologyFileDateDefaulteSelect, setRadiologyFileDateDefaulteSelect] =
    useState("");
  const [radiologyResult, setRadiologyResult] = useState("");
  const [radiologyResultStatus, setRadiologyResultStatus] = useState(false);
  const [labResultStatus, setLabResultStatus] = useState(false);
  const [labFileDateofServieList, setFileLabDateofServiceList] = useState([]);
  const [labFileDateDefaulteSelect, setLabFileDateDefaulteSelect] =
    useState("");
  const [saveBtnTitle, setSaveBtnTitle] = useState("Save");
  const [completedBtnTitle, setCompleteBtnTitle] = useState("Complete");
  const [declineBtnTitle, setDeclineBtnTitle] = useState("Decline");

  const [buttonClicked, setButtonClicked] = useState(false);
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [isValidAction, setIsValidAction] = useState("");
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [isModalComments, setIsModalComments] = useState(false);
  const [flagContainerActive, setFlagContainerActive] = useState("");
  const [flagTagActive, setFlagTagActive] = useState(false);
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [dragFileDate, setdragFileDate] = useState(false);
  const [inputValueFileDate, setInputValueFileDate] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [isMeatQueryModal, setIsMeatQueryModal] = useState(false);
  const [meatQueriedDetailsModal, setMeatQueriedDetailsModal] = useState(false);
  const [meatQueriedDetailsShow, setMeatQueriedDetailsShow] = useState(true);
  const [isDosSelect, setIsDosSelect] = useState(true);
  const [pageNumberOptions, setPageNumberOptions] = useState([]);
  const [fileDosPageNumber, setFileDosPageNumber] = useState(0);
  const [selectPreviousCode, setSelectPreviousCode] = useState(null);
  const [meatQueryList, setMeatQueryList] = useState([]);
  const [meatQueryListPrevious, setMeatQueryListPrevious] = useState([]);
  const [meatQueryResult, setMeatQueryResult] = useState([]);
  const [meatQueryUpdate, setMeatQueryUpdate] = useState(false);
  const [providerDetails, setProviderDetails] = useState("");
  const [isAddComboCode, setIsAddComboCode] = useState(false);
  const [comboCodeTree, setComboCodeTree] = useState(true);
  const [listPageNumber, setListPageNumber] = useState([]);
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const [meatModalTitle, setMeatModalTitle] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [selectMeatResult, setSelectMeatResult] = useState(null);
  const [formErr, setFormErr] = useState({
    providername: "",
    quickQuery: "",
    imagingQuery: "",
    queryReason: "",
    description: "",
  });
  const [providerNameEcnounterList, setProviderNameEcnounterList] = useState(
    []
  );
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [hccVersionDetails, setHccVersionDetails] = useState(null);
  const [selectProviderInfo, setSelectProviderInfo] = useState(null);
  const [hccFormTab, setHccFormTab] = useState("HCCFORM");

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCodeQuery") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "encodedDate") {
      setInputValueFileDate(e.target.value);
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };

  useEffect(() => {
    console.log("test");
    // loadFilterPatientList();
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    var uId = localStorage.getItem("userId");
    setLocalUserId(uId);
    setLocalPatientId(patientId);
    setLocalOrgId(orgId);
    setLocalTenantId(tenId);
    getPatientDetails(patientId, orgId, tenId);

    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    setUserDetails(dotLoading);
    setvalidHccDetails(dotLoading);
  }, [patientDetailsResult]);

  const getPatientDetails = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    var result = patientDetailsResult?.result?.response;
    console.log(result);
    if (result?.dos) {
      //   var result2 = await getMeatQueryList(result?.dos, localPatientId);
      //   console.log(result2)
      //   setMeatQueryList(result2.response);
    }
  };

  const handleCloseForm = () => {
    setIsAddButtonClicked(false);
    // Add any additional logic for closing the form if needed
  };

  const handleCloseModal = () => {
    setHccFormTab("HCCFORM");
    setAddValidCodeCheck(null);
    setValidated(false);
    setIsModalOpen(false);
    setIsModalOpenValid(false);
    setConfirmNotesModalValid(false);
    setConfirmNotesModalInValid(false);
    setIsModalOpenRadiology(false);
    setSuggestedModal(false);
    setIsModalOpenValidCodes(false);
    setIsModalOpenCaptureSection(false);
    setIsAddButtonClicked(false);
    setIsAddButtonClicked(false);
    setIsModalComments(false);
    setFlagContainerActive("");
    setConfirmCompleteModal(false);
    setIsModalOpenLab(false);
    setIsFileFormShow(false);
    setIsMeatQueryModal(false);
    setMeatQueriedDetailsModal(false);
    setIsAddComboCode(false);
    setFindFileKeyword(null);
    setFileLoading(false);
    setActiveTabNumber(activeTabNumber == null ? 0 : null);
  };

  const getFindValidDiagnosisCode = async (value) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/icddisease/finddiseasebycode?diseasecode=${value}`
    );
    if (response.data) {
      if (response.data == "ICD disease not found") {
        setAddValidCodeCheck(false);
      } else {
        setAddValidCodeCheck(true);
        inputValue.actualDescription = "adakd dvasdv";
      }
    }

    inputValue.actualDescription = "adakd dvasdv";
  };

  const addMeatQuery = (value, condition) => {
    inputValue.diagnosisCodeQuery = value.diagnosisCode;
    if (condition == "Add") {
      setMeatQueryUpdate(false);
      inputValue.providerName = "";
      inputValue.headerName = "";
      inputValue.imagingTestHeader = "";
      inputValue.description = "";
      inputValue.queryReason = "";
      inputValue.reason = "";
    } else {
      inputValue.providerName = value.providerName;
      inputValue.headerName = value.headerName;
      inputValue.imagingTestHeader = value.imagingTestHeader;
      inputValue.description = value.description;
      inputValue.queryReason = value.queryReason;
      inputValue.reason = value.reason;
      setMeatQueryUpdate(true);
    }
    setIsMeatQueryModal(true);
  };

  const meatQueriedComments = (value) => {
    setMeatQueryResult(value);
    setMeatQueriedDetailsModal(true);
    setMeatQueriedDetailsShow(false);
  };

  const headersList = [
    { value: "A/P", label: "A/P" },
    { value: "PMH", label: "PMH" },
    { value: "HPI", label: "HPI" },
    { value: "Physical Exam", label: "Physical Exam" },
    { value: "VITALS", label: "VITALS" },
    { value: "OTHERS", label: "OTHERS" },
  ];

  const queryReasons = [
    { value: "Diagnosis Not Supported", label: "Diagnosis Not Supported" },
    { value: "H/o condition", label: "H/o condition" },
    { value: "MEAT not Sufficient", label: "MEAT not Sufficient" },
    { value: "Imaging Query", label: "Imaging Query" },
    { value: "More Specific Diagnosis", label: "More Specific Diagnosis" },
    { value: "OTHERS", label: "OTHERS" },
  ];
  const imagingtest = [
    { value: "X-ray", label: "X-ray" },
    { value: "CT Scan", label: "CT Scan" },
    { value: "MRI", label: "MRI" },
    { value: "Ultrasound", label: "Ultrasound" },
    { value: "PET Scan", label: "PT Scan " },
    { value: "Mammography", label: "Mammography" },
    { value: "Fluoroscopy", label: "Fluoroscopy" },
    { value: "Bone Densitometry", label: "Bone Densitometry" },
    { value: "Nuclear Medicine Imaging", label: "Nuclear Medicine Imaging" },
    { value: "Angiography", label: "Angiography" },
    { value: "Myelography", label: "Myelography" },
    { value: "Arthrogram", label: "Arthrogram" },
    { value: "Barium Swallow/Test", label: "Barium Swallow/Test" },
    { value: "Hysterosalpingography", label: "Hysterosalpingography" },
    { value: "Fistulogram", label: "Fistulogram" },
    { value: "Cholangiography", label: "Cholangiography" },
    { value: "Sialography", label: "Sialography" },
    { value: "Discography", label: "Discography" },
    { value: "Lymphangiography", label: "Lymphangiography" },
    { value: "Intravenous Pyelogram", label: "Intravenous Pyelogram" },
    { value: "OTHERS", label: "OTHERS" },
  ];

  const handleSubmitMeatQuery = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (
      inputValue?.providerName === "" ||
      inputValue?.headerName === "" ||
      inputValue?.imagingTestHeader === "" ||
      inputValue?.queryReason === "" ||
      inputValue?.description === "" ||
      inputValue?.reason
    ) {
      let errors = {
        providername:
          inputValue?.providerName === "" ? "Please enter provider name" : "",
        quickQuery:
          inputValue?.headerName === "" ? "Please select quick query" : "",
        imagingQuery:
          inputValue?.imagingTestHeader === ""
            ? "Please select imaging query"
            : "",
        queryReason:
          inputValue?.queryReason === "" ? "Please select quick reason" : "",
        description:
          inputValue?.description === "" ? "Please enter description" : "",
      };

      setFormErr(errors);
    } else {
      if (form.checkValidity() === true) {
        var dataformat = {
          patientId: localPatientId,
          diagnosisCode: inputValue.diagnosisCodeQuery,
          queryReason: inputValue.queryReason,
          Reason: inputValue.reason,
          providerName: inputValue.providerName,
          imagingTestHeader: inputValue.imagingTestHeader,
          headerName: inputValue.headerName,
          dosYear: selectedDosValue,
          description: inputValue.description,
        };
        var result = await submitMeatQuery(dataformat);
        if (result.status == "SUCCESS") {
          setMeatQueryResult(result.response);
          inputValue.queryComment = result.response.queryComment;
          setIsMeatQueryModal(false);
          notification.success({
            message: result.message,
            placement: "top",
            duration: 1,
          });
          setMeatQueriedDetailsModal(true);
          setMeatQueriedDetailsShow(true);
          var result = await getMeatQueryList(selectedDosValue, localPatientId);
          setMeatQueryList(result.response);
        }
      }
    }
  };
  const updateMeatQueryComments = async () => {
    var updateDataformat = {
      patientId: localPatientId,
      diagnosisCode: inputValue.diagnosisCodeQuery,
      dos: selectedDosValue,
      queryComment: inputValue.queryComment,
    };
    var result = await updateMeatQuery(updateDataformat);
    if (result.status == "SUCCESS") {
      setMeatQueryResult(result.response);
      setIsMeatQueryModal(false);
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      setMeatQueriedDetailsModal(false);
      setMeatQueriedDetailsShow(false);
    } else {
    }
  };

  const getPreviousData = (code, action) => {
    const result = meatQueryDetails?.result?.response.filter(
      (res) => res.diagnosisCode == code && res.currentQuery != true
    );
    setSelectPreviousCode(code);
    var querySort = result;
    querySort.sort(function (a, b) {
      return b.queryVersion - a.queryVersion;
    });
    setMeatQueryListPrevious(querySort);
  };

  const handleSelect = (value, title) => {
    setInputValue({ ...inputValue, [title]: value });
  };

  const emailSplitFunction = (email) => {
    if (meatQueriedDetailsModal) {
      let emailSplit = email?.split("@");
      return emailSplit[0].charAt(0).toUpperCase() + emailSplit[0].slice(1);
    }
  };

  const confirmMeatQuery = async (code) => {
    var result = await deleteMeatQuery(localPatientId, code);
    if (result.status == "SUCCESS") {
      var result = await getMeatQueryList(selectedDosValue, localPatientId);
      setMeatQueryList(result.response);
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
    } else {
    }
  };

  return (
    <>
      <div className="my-post-content pt-3">
        <div className={visitStyles.meat_head_card}>
          <div className="row">
            <div className="col-xl-1">
              <label>Codes</label>
            </div>
            <div className="col-xl-2">
              <label>Description</label>
            </div>
            <div className="col-xl-2">
              <label>Published By</label>
            </div>
            <div className="col-xl-2">
              <label>Date & Time</label>
            </div>
            <div className="col-xl-2">
              <label>Message</label>
            </div>
            <div className="col-xl-2">
              <label>Reason</label>
            </div>
            <div className="col-xl-1">
              <label></label>
            </div>
          </div>
        </div>
        {meatQueryDetails?.result?.response?.length != 0 ? (
          <div className={visitStyles.container}>
            <div className={visitStyles.hccStickey_head}>
              {meatQueryDetails?.result?.response?.map((item) => (
                <>
                  {item.currentQuery == true ? (
                    <div className={`${visitStyles.meat_details_card}`}>
                      <>
                        {item.diagnosisCode == selectPreviousCode ? (
                          <div className="d-flex justify-content-between">
                            <span className={styles.currentBadge}>Current</span>
                            <span
                              className={styles.moreBtn}
                              onClick={() => setSelectPreviousCode(null)}
                            >
                              Less
                            </span>
                          </div>
                        ) : (
                          <div className="text-end">
                            <span
                              className={styles.moreBtn}
                              onClick={() =>
                                getPreviousData(item.diagnosisCode)
                              }
                            >
                              More
                            </span>
                          </div>
                        )}
                      </>
                      <div className="row">
                        <div className="col-xl-1 d-grid">
                          <span className="meat-name-details font-bold">
                            {item.diagnosisCode}
                          </span>
                        </div>
                        <div className="col-xl-2">
                          <span className="meat-name-details">
                            {item.description}
                          </span>
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span className="meat-name-details">
                            {item.createdBy}
                          </span>
                          {/* <span className={styles.l1auditorBadge}>
                                        L1 Auditor
                                      </span> */}
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span className="meat-name-details">
                            {moment(item.createdAt).format(
                              "MM-DD-YYYY & HH:MM:SS"
                            )}
                          </span>
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span
                            onClick={() => meatQueriedComments(item)}
                            className="cr-pointer meat-name-details"
                          >
                            {SVGICON.comment}
                          </span>
                        </div>
                        <div className="col-xl-2 d-grid">
                          <span className="meat-name-details">
                            {item.reason}
                          </span>
                        </div>
                        <div className="col-xl-1">
                          <div className="d-flex">
                            <div
                              onClick={() => addMeatQuery(item, "Update")}
                              className={styles.edit_meat_query}
                            >
                              {SVGICON.meatQueryEdit}
                            </div>
                            {/* <Popconfirm
                                          title="Are you sure to delete this query?"
                                          okText="Yes"
                                          cancelText="No"
                                          onConfirm={() =>
                                            confirmMeatQuery(item.diagnosisCode)
                                          }
                                        >
                                          <div
                                            className={styles.delete_meat_query}
                                          >
                                            <FontAwesomeIcon
                                              icon={faTrash}
                                              style={{
                                                size: 8,
                                                color: "#fff",
                                              }}
                                            />
                                          </div>
                                        </Popconfirm> */}
                          </div>
                        </div>
                      </div>
                      {item.diagnosisCode == selectPreviousCode ? (
                        <>
                          <span className={styles.previousBadge}>Previous</span>
                          {meatQueryListPrevious?.map((item) => (
                            <div>
                              <div className="row">
                                <div className="col-xl-1 d-grid">
                                  <span className="meat-name-details font-bold">
                                    {item.diagnosisCode}
                                  </span>
                                </div>
                                <div className="col-xl-2">
                                  <span className="meat-name-details">
                                    {item.description}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span className="meat-name-details">
                                    {item.createdBy}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span className="meat-name-details">
                                    {moment(item.createdAt).format(
                                      "MM-DD-YYYY & HH:MM:SS"
                                    )}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span
                                    onClick={() => meatQueriedComments(item)}
                                    className="cr-pointer meat-name-details"
                                  >
                                    {SVGICON.comment}
                                  </span>
                                </div>
                                <div className="col-xl-2 d-grid">
                                  <span className="meat-name-details">
                                    {item.reason}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <Offcanvas
        onHide={handleCloseModal}
        show={isMeatQueryModal}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Meat Query
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => handleCloseModal()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <Form noValidate onSubmit={handleSubmitMeatQuery}>
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    DX Code <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="diagnosisCodeQuery"
                    name="diagnosisCodeQuery"
                    value={inputValue?.diagnosisCodeQuery}
                    onChange={handleChange}
                  />
                  {addValidCodeCheck == false ? (
                    <span className={visitStyles.invalidHccCodeError}>
                      Invalid Hcc Code
                    </span>
                  ) : addValidCodeCheck == true ? (
                    <span className={visitStyles.validHccCodeError}>
                      Valid Hcc Code
                    </span>
                  ) : null}
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>Provider name</Form.Label>
                  <Form.Control
                    type="text"
                    id="providerName"
                    name="providerName"
                    value={inputValue?.providerName}
                    onChange={handleChange}
                  />
                  {formErr?.providername && (
                    <div className="text-danger fs-12">
                      {formErr?.providername}
                    </div>
                  )}
                </div>
                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Quick Query <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Select
                    defaultValue={inputValue?.headerName}
                    className={`ant_select_form`}
                    onChange={(value) => handleSelect(value, "headerName")}
                  >
                    {headersList?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                  {formErr?.quickQuery && (
                    <div className="text-danger fs-12">
                      {formErr?.quickQuery}
                    </div>
                  )}
                </div>
                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Imaging Query <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Select
                    defaultValue={inputValue?.imagingTestHeader}
                    className={`ant_select_form`}
                    onChange={(value) =>
                      handleSelect(value, "imagingTestHeader")
                    }
                  >
                    {imagingtest?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                  {formErr?.imagingQuery && (
                    <div className="text-danger fs-12">
                      {formErr?.imagingQuery}
                    </div>
                  )}
                </div>
                {/* <div className="col-xl-12 mb-4">
                  <Form.Label>
                    DOS <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Select className={`ant_select_form`} onChange={handleChange}>
                    {dosListMeat?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </div> */}

                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Query Reason <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Select
                    defaultValue={inputValue?.queryReason}
                    className={`ant_select_form`}
                    onChange={(value) => handleSelect(value, "queryReason")}
                  >
                    {queryReasons?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                  {formErr?.queryReason && (
                    <div className="text-danger fs-12">
                      {formErr?.queryReason}
                    </div>
                  )}
                </div>
                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Description <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    value={inputValue?.description}
                    rows="5"
                  ></textarea>
                </div>
                {meatQueryUpdate ? (
                  <div className="col-xl-12 mb-4">
                    <Form.Label>
                      Reason <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <textarea
                      className="form-control"
                      id="reason"
                      name="reason"
                      onChange={handleChange}
                      rows="5"
                      value={inputValue?.reason}
                    ></textarea>
                  </div>
                ) : null}
                {formErr?.description && (
                  <div className="text-danger fs-12">
                    {formErr?.description}
                  </div>
                )}
              </div>

              <div>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  {meatQueryUpdate ? "Update" : "Submit"}
                </Button>
                <Button
                  onClick={() => handleCloseModal()}
                  className="btn btn-danger btn-sm light ms-1"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Offcanvas>
      <Modal
        title="Meat Queried Details"
        centered
        open={meatQueriedDetailsModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={null}
        className="meat-queriedmodal"
      >
        <div className="offcanvas-body">
          <div className="container-fluid">
            {meatQueriedDetailsShow ? (
              <div className="row">
                <div className="col-xl-6">
                  <div className={styles.publishedByDetails}>
                    <span className={styles.meatQueried_head}>
                      {meatQueryResult.diagnosisCode}
                    </span>
                    <p className={styles.meatQueried_details}>
                      {meatQueryResult.description}
                    </p>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className={styles.publishedByDetails}>
                    <span className={styles.meatQueried_head}>
                      Published By :
                    </span>
                    <p className={styles.publisheddetails}>
                      Name - {emailSplitFunction(meatQueryResult.createdBy)}
                    </p>
                    <p className={styles.publisheddetails}>
                      Date & Time -{" "}
                      {moment(meatQueryResult.createdAt).format(
                        "MM-DD-YYYY && HH:MM:SS"
                      )}
                    </p>
                    <p className={styles.publisheddetails}>
                      Reason - {meatQueryResult.reason}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className={styles.meatCommentCard}>
              <div className={styles.meatCommentCard2}>
                <div>
                  <span className={styles.meatQueried_head}>Subject</span>
                  <p className={styles.meatQueried_details}>
                    We've identified the following details that may pertain to
                    records associated with{" "}
                    <b>{patientDetailsResult?.result?.response?.patientName}</b>
                    .
                  </p>
                </div>
                <div>
                  <span className={styles.meatQueried_head}>
                    Dear Dr {meatQueryResult.providerName}
                  </span>
                  {!meatQueriedDetailsShow ? (
                    <p className={styles.meatQueried_details}>
                      {meatQueryResult.queryComment}
                    </p>
                  ) : (
                    <textarea
                      className={`${styles.queryTextarea}`}
                      id="queryComment"
                      name="queryComment"
                      onChange={handleChange}
                      rows="5"
                      value={inputValue.queryComment}
                    ></textarea>
                  )}
                </div>
              </div>
            </div>
            {meatQueriedDetailsShow ? (
              <div className={styles.meat_queryfooterBtn}>
                <button
                  className={styles.meat_querySaveBtn}
                  onClick={() => updateMeatQueryComments(false)}
                >
                  Save
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MeatQuery;
