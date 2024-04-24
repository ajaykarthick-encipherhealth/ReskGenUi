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
  faPen,
  faSave,
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
import PdfViewer from "../../PdfViewerComponent";
import AddHccForm from "../../components/addHccForm";

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
const File = ({ popoverVisible, setPopoverVisible, year,setActiveTabHead }) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  let searchKeywords = [];
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const hccFileDetails = useSelector(
    (state) => state?.ReviewerReducers?.hccFileDetails
  );
  const fileDosPageNumberList = useSelector(
    (state) => state?.ReviewerReducers.dosPageNumberList
  );
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
  const [editDiagnosisCode, setEditDiagnosisCode] = useState("");
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

  const [hccVersionDetails, setHccVersionDetails] = useState(null);
  const [selectProviderInfo, setSelectProviderInfo] = useState(null);
  const [hccFormTab, setHccFormTab] = useState("HCCFORM");
  const [search, setSearch] = useState(false);
  const [hyperlinkSeacrh, setHyperlinkSearch] = useState(false);
  const [editCode, setEditCode] = useState(false);
  const [isAddHccForm, setIsAddHccForm] = useState(false);

  const getMeatFound = (code, data, value) => {
    const result = data?.filter(
      (res2) => res2?.diagnosisCode?.replace(".", "") == code?.replace(".", "")
    );
    var backColor = "#f93d3d";
    var meatTitle = "MEAT";
    if (result.length != 0) {
      switch (value) {
        case "M":
          if (result[0]?.monitor) {
            backColor = "#15b315";
          }
          meatTitle = "Monitor";
          break;
        case "E":
          if (result[0]?.evaluate) {
            backColor = "#15b315";
          }
          meatTitle = "Evaluate";
          break;
        case "A":
          if (result[0]?.assessment) {
            backColor = "#15b315";
          }
          meatTitle = "Assessment";
          break;
        case "T":
          if (result[0]?.treatment) {
            backColor = "#15b315";
          }
          meatTitle = "Treatment";
          break;
        default:
          null;
      }
    }
    // var badgeMap = (
    //   <span
    //     style={{ backgroundColor: backColor, color: "white" }}
    //     className={`mt-2 ${styles.badgeMeat}`}
    //   >
    //     {value}
    //   </span>
    // );
    return (
      <Tooltip title={meatTitle} placement="bottom">
        <span
          style={{ backgroundColor: backColor, color: "white" }}
          className={`mt-2 ${styles.badgeMeat}`}
        >
          {value}
        </span>
      </Tooltip>
    );
  };

  const handleAddButtonClick = () => {
    setIsAddButtonClicked(true);
  };

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

  const handleChangeMeat = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "encodedDate") {
      setInputValueFileDate(e.target.value);
    }
    const value = e.target.value;
    setInputValueMeat({ ...inputValueMeat, [key]: value });
  };

  const handleDatePickerChangeFile = (dates, dateString) => {
    let convertDate = moment(dateString).format("MM-DD-YYYY");
    setdragFileDate(false);
    setInputValueFileDate(convertDate);
    setInputValue({ ...inputValue, ["encodedDate"]: convertDate });
  };

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };
  const handleDocumentLoadFile = () => {
    setDocumentLoaded(true);
    if (findFileKeyword) {
      setTimeout(() => {
        setFileModalHeader(fileModalTitle);
        if (fileInitialPage) {
          setTargetPages(
            (targetPage) =>
              targetPage.pageIndex === fileInitialPage ||
              targetPage.pageIndex === fileInitialPage + 1 ||
              targetPage.pageIndex === fileInitialPage + 2
          );
        }
        highlight({
          keyword: findFileKeyword,
        });
      }, 1000);
    }
  };

  const pageClickPdfFile = (e) => {};

  useEffect(() => {
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

  useEffect(() => {
    if (hccFileDetails?.result?.response) {
      setSelectFileURL(hccFileDetails?.result?.response);
    }
  }, [hccFileDetails]);

  useEffect(() => {
    getFileDosPageNumber();
  }, [fileDosPageNumberList]);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    getPatientDetailsFileLoad(patientId, orgId, tenId);
  }, [activeTabNumber]);

  useEffect(() => {
    setDocumentLoaded(true);
    if (findFileKeyword) {
      setTimeout(() => {
        setFileModalHeader(fileModalTitle);
        setMeatModalTitle(selectMeatName);
        if (fileInitialPage != null) {
          setTargetPages(
            (targetPage) =>
              targetPage.pageIndex === fileInitialPage ||
              targetPage.pageIndex === fileInitialPage + 1 ||
              targetPage.pageIndex === fileInitialPage + 2
          );
        } else {
          setTargetPages(null);
        }
        highlight({
          keyword: findFileKeyword,
        });
        setTimeout(() => {
          setFileLoading(false);
        }, 1000);
      }, 1000);
    }
  }, [fileInitialPage, findFileKeyword, fileModalTitle]);

  const getPatientDetails = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    setIsModalComments(false);
    if (patientDetailsResult?.result?.response) {
      var result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      setPatientDetails(result);
      if (result.validDisease != null) {
        var validDis = "";
        var invalidDis = "";
        var comboDis = "";
        var meatCri = "";
        var dosYearArr = [];
        var rafScore = null;
        var validDiseaseNewRes = [];
        var invalidDiseaseNewRes = [];
        var unMatchRes = [];
        var unMatchResHcc = [];
        var unMatchResNonHcc = [];
        var meatCriColorTagList = [];

        var suggestRadiologyList = [];
        var suggestLabList = [];

        var suggestListAll = [];
        var suggestListAllNonHcc = [];
        var deleteHccList = [];

        if (fileloadCondition != "fileNotLoad") {
          getPatientPdfFile(result?.fileDetailDTO?.azureBlobPath, tenId);
          setSelectMeatFileId(patientDetailsResult?.result?.response?.fileId);
          setPatientFileDTO(result?.fileDetailDTO);
        }
        // setPatientDocumentResult(result);

        result.encounterYears.map((res) => {
          dosYearArr.push({ value: res, label: res });
        });

        const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

        const highestDosValue = dosYearArr.filter(
          (i) => parseInt(i.value) === highestDOS
        );
        setDosYearDefalutSelect(highestDosValue[0]);
        setSelectedDosValue(highestDosValue[0].value);

        if (result.rafScore != null) {
          rafScore = result.rafScore;
        }

        var unMacthResList = [];

        validDis = result.validDisease;
        validDiseaseNewRes = result?.validDisease;
        // invalidDiseaseNewRes =validDisArray;
        var validDisArray = [];
        var validEncounterDateArray = [];
        validDiseaseNewRes?.map((res, index) => {
          const encounterDatearray = res?.encounterDate?.split(",");
          var providerList = [];
          res.provider?.map((res, index) => {
            providerList.push(res.providerName);
          });

          if (res.isShow != false) {
            validDisArray.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              isManuallyAdded: res.isManuallyAdded,
              isHccValid: res.isHccValid,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
              dbDescription: res.dbDescription,
              isMostSpecific: res.isMostSpecific,
              children: res.children,
              getPlace: "Hcc",
              dbDescription: res.dbDescription,
            });
          }
        });

        if (result?.insulinDisease) {
          const encounterDatearray = result?.insulinDisease?.dos?.split(",");
          validDisArray.push({
            actualDescription: result?.insulinDisease?.description,
            capturedSections: [result?.insulinDisease?.section],
            diagnosisCode: result?.insulinDisease?.code,
            encounterDate: result?.insulinDisease?.dos,
            encounterDateSplit: encounterDatearray,
            getPlace: "Insulin",
            isHccValid: true,
            defaultPosition: null,
            dbDescription: result?.insulinDisease?.dbDescription,
          });
        }

        result?.invalidDisease?.map((res, index) => {
          const encounterDatearray = res?.encounterDate?.split(",");
          invalidDiseaseNewRes.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition,
          });
        });

        if (result.deletedDiseases != null) {
          result.deletedDiseases.map((res, index) => {
            if (res.isShow != false) {
              const encounterDatearray = res?.encounterDate?.split(",");
              var providerList = [];
              res.provider?.map((res, index) => {
                providerList.push(res.providerName);
              });
              deleteHccList.push({
                actualDescription: res.actualDescription,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCode,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                isManuallyAdded: res.isManuallyAdded,
                isHccValid: res.isHccValid,
                defaultPosition: res.defaultPosition,
                providerName: providerList,
              });
            }
          });
        }
        if (result.suggestRadiology != null) {
          // var checkDosRadio = [];
          // for (var key in result.suggestRadiology) {
          //   checkDosRadio.push({ value: key, label: key });
          // }
          // getPatientDetailsRadiologyYear(orgId,tenId)
          suggestRadiologyList = result.suggestRadiology;
          suggestRadiologyList.map((res, index) => {
            const encounterDatearray = res?.encounterDate?.split(",");
            var providerList = [];
            res?.provider?.map((res2, index) => {
              providerList.push(res2.providerName);
            });
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Radio",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
              children: res.children ? res.children : [],
              isMostSpecific: res.isMostSpecific,
            });
          });

          if (result.suggestRadiologyCombo != null) {
            result.suggestRadiologyCombo.map((res, index) => {
              var providerList = [];
              res.providers?.map((res2, index) => {
                providerList.push(res2.providerName);
              });
              const encounterDatearray = res?.encounterDate?.split(",");
              suggestListAll.push({
                actualDescription: res.diseaseName,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCodeCombo,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Radio-combo",
                isHccValid: true,
                providerName: providerList,
                // defaultPosition:res.defaultPosition
              });
            });
          }
        }

        if (result.suggestLab != null) {
          // getLabReportDetails(orgId,tenId)
          suggestLabList = result.suggestLab;
          suggestLabList.map((res, index) => {
            var providerList = [];
            res?.provider?.map((res2, index) => {
              providerList.push(res2.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Lab",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
            });
          });
        }
        if (result.unMatchedDisease != null) {
          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            if (res.isShow != false) {
              const encounterDatearray = res?.encounterDate?.split(",");
              var providerList = [];
              res?.provider?.map((res, index) => {
                providerList.push(res.providerName);
              });
              suggestListAll.push({
                actualDescription: res.actualDescription,
                diagnosisCodeFinding: res.diagnosisCode,
                isHccValid: res.isHccValid,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCode,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Hcc",
                defaultPosition: res.defaultPosition,
                providerName: providerList,
                children: res.children ? res.children : [],
                isMostSpecific: res.isMostSpecific,
              });
            }
          });
        }
        if (result?.suggestLabInReport) {
          result?.suggestLabInReport?.map((res, index) => {
            var providerList = [];
            res?.provider?.map((res2, index) => {
              providerList.push(res2?.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Hcc",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
            });
          });
        }
        if (result?.suggestRadiologyInReport) {
          result?.suggestRadiologyInReport?.map((res, index) => {
            var providerList = [];
            res?.provider?.map((res2, index) => {
              providerList.push(res2.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Hcc",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
            });
          });
        }

        invalidDis = result.invalidDisease;
        comboDis = result.comboDisease;
        meatCri = result.meatCriteria;

        var combiDisArray = [];
        if (result.comboDisease) {
          comboDis.map((res, index) => {
            var providerList = [];
            res.providers?.map((res, index) => {
              providerList.push(res.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            combiDisArray.push({
              addOnCode: res.addOnCode,
              addOnCodeTwo: res.addOnCodeTwo,
              addOnCodeThree: res.addOnCodeThree,
              addOnCodes: [res.addOnCode, res.addOnCodeTwo, res.addOnCodeThree],
              diagnosisCodeCombo: res.diagnosisCodeCombo,
              diseaseName: res.diseaseName,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              providerName: providerList,
              providers: res.provider ? res.providers : res.provider,
              ruleType: res.ruleType,
              capturedSections: res.capturedSections,
              children: res.children ? res.children : [],
              expanded: true,
            });
          });
        }

        // validDiseaseNewRes = validDiseaseNew[2019]

        var invalidDiseasesArray = [];
        var validDiseasesArray = [];

        for (var key in invalidDis) {
          invalidDiseasesArray.push({ name: invalidDis[key] });
        }
        for (var key in validDis) {
          validDiseasesArray.push({ name: validDis[key] });
        }

        setNewValidDiseaseList(validDisArray);
        setInNewValidDiseaseList(invalidDiseaseNewRes);
        setNewUnMatchHccList(suggestListAll);
        setValidDiseasesList(validDiseasesArray);
        setInvalidDiseasesList(invalidDiseasesArray);
        setComboDiseaseCodesList(combiDisArray);
        setDosYear(dosYearArr);
        setRAFScore(rafScore);
        setSuggestedNonHccList(suggestListAllNonHcc);
        setSuggestedHccList(suggestListAll);
        setDeletedHccList(deleteHccList);

        var capturedSectionsColorsMatching = [];
        var capturedSectionsArr = [];

        const COLORS = [
          "bg-bg-seven",
          "bg-third",
          "bg-bg-four",
          "bg-bg-five",
          "bg-bg-six",
          "bg-bg-eight",
          "bg-bg-nine",
          "bg-bg-ten",
          "bg-bg-leven",
        ];

        const COLORS2 = [
          "sectionTag1",
          "sectionTag2",
          "sectionTag3",
          "sectionTag4",
          "sectionTag5",
          "sectionTag6",
          "sectionTag7",
          "sectionTag8",
        ];

        const COLORS3 = [
          "encounterDateTag1",
          "encounterDateTag2",
          "encounterDateTag3",
          "encounterDateTag4",
          "encounterDateTag5",
          "encounterDateTag6",
          "encounterDateTag7",
          "encounterDateTag8",
          "encounterDateTag9",
          "encounterDateTag10",
        ];

        validDiseaseNewRes?.map((res) => {
          res.capturedSections?.map((res2, index) => {
            capturedSectionsArr?.push({
              name: res2,
              diagnosisCode: res?.diagnosisCode,
            });
          });
        });

        validDiseaseNewRes?.map((res) => {
          res.provider?.map((res2, index) => {
            capturedSectionsArr?.push({
              name: res2.providerName,
              diagnosisCode: res?.diagnosisCode,
            });
          });
        });

        invalidDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              diagnosisCode: res.diagnosisCode,
            });
          });
        });

        suggestListAll?.map((res) => {
          res?.capturedSections?.map((res2, index) => {
            capturedSectionsArr?.push({
              name: res2,
              diagnosisCode: res?.diagnosisCode,
            });
          });

          res.providerName?.map((res2, index) => {
            if (res2) {
              capturedSectionsArr?.push({
                name: res2,
                diagnosisCode: res?.diagnosisCode,
              });
            }
          });
        });

        if (result?.insulinDisease) {
          capturedSectionsArr?.push({
            name: result?.insulinDisease?.section,
            diagnosisCode: result?.insulinDisease?.code,
          });
        }

        var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

        dublicateSectionArr.map((res, index) => {
          capturedSectionsColorsMatching.push({
            name: res.name,
            diagnosisCode: res.diagnosisCode,
            colors: COLORS2[index],
          });
        });

        var sectionColorResult = sectionColorList.result?.response;

        let sectionColorResultMatch = sectionColorResult?.filter((o1) =>
          dublicateSectionArr.some((o2) => o1.sectionName === o2.name)
        );
        let sectionColorResultNotMatch = dublicateSectionArr.filter(
          (o1) => !sectionColorResult?.some((o2) => o1.name === o2.sectionName)
        );

        var notMatchColorArray = [];
        sectionColorResultNotMatch?.map((res, index) => {
          var radomColorcode = stringToColour(res.name);
          var randomColorChangeShadow = radomColorcode + 33;
          notMatchColorArray.push({
            sectionName: res.name,
            backgroundColor: randomColorChangeShadow,
            sectionColor: radomColorcode,
          });
          submitSectionColors(
            res.name,
            radomColorcode,
            randomColorChangeShadow
          );
        });

        //   var newArrayColorMatchs = [];
        //   newArrayColorMatchs = [
        //     ...sectionColorResultMatch,
        //     ...notMatchColorArray,
        //   ];

        //  setCaptureSectionMatching(newArrayColorMatchs);

        var encounterDateColorsMatching = [];
        var encounterDateArr = [];

        validDiseaseNewRes.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result?.invalidDisease.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        // if (result?.insulinDisease) {
        //   encounterDateArr.push({
        //     name: result?.insulinDisease?.dos,
        //   });
        // }

        result?.unMatchedDisease?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });
        result?.suggestRadiology?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result?.suggestLab?.map((res) => {
          const array = res?.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr?.push({
              name: res2,
            });
          });
        });

        result?.suggestLabInReport?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });
        result?.suggestRadiologyInReport?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        if (result?.insulinDisease) {
          encounterDateArr.push({
            name: result?.insulinDisease?.dos,
          });
        }

        var encounterDateArrDublicatesRemove = getUniqueListBy(
          encounterDateArr,
          "name"
        );

        encounterDateArrDublicatesRemove.map((res, index) => {
          encounterDateColorsMatching.push({
            name: res.name,
            colors: COLORS3[index],
          });
        });

        setEncounterDateMatching(encounterDateColorsMatching);
        var meatListArr = [];
        var meatMoniterHead = [];
        var meatEvaluteHead = [];
        var meatAssesmentHead = [];
        var meatTreatMentHead = [];
        var allMeatHead = [];
        var allMeatHeadColorArr = [];
        var allMeatHeadColor = [];
        var dublicateRemoveSecondArr = [];
        var nonHccMeatListArr = [];

        var meatHeaderList = [];

        meatCri?.map((res, index) => {
          if (
            res.monitorCapturedFromHeader != "" &&
            res.monitorCapturedFromHeader != null
          ) {
            meatMoniterHead.push({
              header: res.monitorCapturedFromHeader.toLowerCase(),
            });
          }
          if (
            res.evaluateCapturedFromHeader != "" &&
            res.evaluateCapturedFromHeader != null
          ) {
            meatEvaluteHead.push({
              header: res.evaluateCapturedFromHeader.toLowerCase(),
            });
          }
          if (
            res.assessmentCapturedFromHeader != "" &&
            res.assessmentCapturedFromHeader != null
          ) {
            meatAssesmentHead.push({
              header: res.assessmentCapturedFromHeader.toLowerCase(),
            });
          }
          if (
            res.treatmentCapturedFromHeader != "" &&
            res.treatmentCapturedFromHeader != null
          ) {
            meatTreatMentHead.push({
              header: res.treatmentCapturedFromHeader.toLowerCase(),
            });
          }
          var newArray = [];
          newArray = [
            ...allMeatHead,
            ...meatMoniterHead,
            ...meatEvaluteHead,
            ...meatAssesmentHead,
            ...meatTreatMentHead,
          ];
          var dublicateRemoveArr = getUniqueListBy(newArray, "header");
          dublicateRemoveArr.map((res3, index) => {
            allMeatHeadColor.push({
              header: res3.header,
              color: COLORS3[index],
            });
          });
          allMeatHeadColorArr = allMeatHeadColor;
          meatHeaderList = dublicateRemoveArr;
          dublicateRemoveSecondArr = getUniqueListBy(
            allMeatHeadColor,
            "header"
          );
          setMeatColorCodeList(dublicateRemoveSecondArr);
        });

        meatCri?.map((res, index) => {
          if (res.category == "Invalid") {
            nonHccMeatListArr.push({
              diagnosisCode: res.diagnosisCode,
              diseaseName: res.diseaseName,
              monitorCapturedFromHeader: res.monitorCapturedFromHeader,
              assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
              evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
              treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
              monitorCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.monitorCapturedFromHeader
              ),
              assessmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.assessmentCapturedFromHeader
              ),
              evaluateCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.evaluateCapturedFromHeader
              ),
              treatmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.treatmentCapturedFromHeader
              ),
              monitorColor: COLORS[index],
              meatColor: COLORS[index],
              assessment: res.assessment,
              monitor: res.monitor,
              evaluate: res.evaluate,
              treatment: res.treatment,
              isMeatCriteriaPresent: res.isMeatCriteriaPresent,
              category: res.category,
              encounterDate: res.encounterDate,
            });
          } else {
            var providerList = [];
            res?.visitDetailsDTO?.providerSet?.map((res, index) => {
              providerList.push(res.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");

            meatListArr.push({
              diagnosisCode: res.diagnosisCode,
              diseaseName: res.diseaseName,
              monitorCapturedFromHeader: res.monitorCapturedFromHeader,
              assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
              evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
              treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
              providerName: providerList,
              monitorCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.monitorCapturedFromHeader
              ),
              assessmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.assessmentCapturedFromHeader
              ),
              evaluateCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.evaluateCapturedFromHeader
              ),
              treatmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.treatmentCapturedFromHeader
              ),
              monitorColor: COLORS[index],
              meatColor: COLORS[index],
              assessment: res.assessment,
              monitor: res.monitor,
              evaluate: res.evaluate,
              treatment: res.treatment,
              isMeatCriteriaPresent: res.isMeatCriteriaPresent,
              category: res.category,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
            });
          }
        });

        let sectionColorResultMatchMeat = sectionColorResult?.filter((o1) =>
          meatHeaderList.some((o2) => o1.sectionName === o2.header)
        );
        let sectionColorResultNotMatchMeat = meatHeaderList.filter(
          (o1) =>
            !sectionColorResult?.some((o2) => o1.header === o2.sectionName)
        );

        var notMatchColorArrayMeat = [];
        sectionColorResultNotMatchMeat?.map((res, index) => {
          var radomColorcode = stringToColour(res.header);
          var randomColorChangeShadow = radomColorcode + 33;
          notMatchColorArrayMeat.push({
            sectionName: res.header,
            backgroundColor: randomColorChangeShadow,
            sectionColor: radomColorcode,
          });
          submitSectionColors(
            res.header,
            radomColorcode,
            randomColorChangeShadow
          );
        });

        var newArrayColorMatchs = [];
        newArrayColorMatchs = [
          ...sectionColorResult,
          ...sectionColorResultMatch,
          ...notMatchColorArray,
          ...sectionColorResultMatchMeat,
          ...notMatchColorArrayMeat,
        ];

        setCaptureSectionMatching(newArrayColorMatchs);

        setMeatCriteriaList(meatListArr);
        setMeatCriteriaListNonHcc(nonHccMeatListArr);
        setIsLoadingDos(false);

        if (result.suggestRadiology != null) {
          if (result.suggestRadiology.length != 0) {
            getPatientDetailsRadiologyYear(orgId, tenId);
          }
        }

        if (result.suggestLab != null) {
          if (result.suggestLab.length != 0) {
            getLabReportDetailsInititalLoad(
              orgId,
              tenId,
              capturedSectionsColorsMatching,
              encounterDateColorsMatching
            );
          }
        }
      } else {
        setIsLoading(false);
      }
    }
  };
  const getPatientDetailsFileLoad = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    getFileDosPageNumber();
    if (patientDetailsResult?.result?.response) {
      var result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      setPatientDetails(result);
      if (result.validDisease != null) {
        getPatientPdfFile(result?.fileDetailDTO?.azureBlobPath, tenId);
        setPatientFileDTO(result?.fileDetailDTO);
      } else {
        setIsLoading(false);
      }
    }
  };
  const getPatientDetailsRadiologyYear = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
      var result = response.data.response;
      setPatientDetailsRadiology(result);
      setRadiologyResult(result);
      if (result.radiologyFileDetail != null) {
        if (result.radiologyFileDetail.length != 0) {
          var dosYearArrFile = [];
          result.radiologyFileDetail.map((res, index) => {
            for (var key in res.documentDos) {
              dosYearArrFile.push({
                value: key,
                label: key + " - " + res.documentDos[key].testName,
              });
            }
          });
          setFileRadiologyDateofServiceList(dosYearArrFile);
          setRadiologyFileDateDefaulteSelect(dosYearArrFile[0]);
          getPatientPdfFileRadiology(
            result.radiologyFileDetail[0].azureBlobPath,
            tenId
          );
          setRadiologyFileDetailCheck(true);
        }
      } else {
        setIsLoading(false);
      }
    }
  };
  const getLabReportDetailsInititalLoad = async (
    orgId,
    tenId,
    matchCode,
    encounterData
  ) => {
    var patientId = localStorage.getItem("patientId");

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/lab/compute/get/lab?patientid=${patientId}&orgid=${orgId}`
    );

    var resultTest = response.data.response;

    var dosYearArrFile = [];
    if (resultTest.labFileDetail != null) {
      if (resultTest.labFileDetail.length != 0) {
        for (var key in resultTest.labFileDetail[0].documentDos) {
          dosYearArrFile.push({ value: key, label: key });
        }
        setFileLabDateofServiceList(dosYearArrFile);
        setLabFileDateDefaulteSelect(dosYearArrFile[0]);
        var fileDetails = resultTest.labFileDetail;
        getLabReportFiles(fileDetails[0].azureBlobPath, tenId);
      }
    }
  };

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  function colorCodeMatch(arrList, key) {
    var colorReturnValue = null;
    const result = arrList.filter((res) => res.header == key);
    if (result[0] != undefined) {
      colorReturnValue = result[0].color;
    }

    return colorReturnValue;
  }

  const getPatientPdfFile = async (fileId, tenId) => {
    // const response = await axios.get(
    //   ENDPOINTS.apiEndoint +
    //     `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    // );
    // if (response.data) {
    //   var result = response.data.response;
    //   setSelectFileURL(response.data.response);
    //   setSelectFileURLValid(response.data.response);
    //   setIsLoading(false);
    //   setIsLoadingDos(false);
    // }
  };

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data.response;
      setSelectFileURLRadiology(response.data.response);
    }
  };

  const getLabReportFiles = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data.response;
      setLabReportFile(response.data.response);
    }
  };

  const confirmvalid = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("validToDeleted")
        )
      );
    });

  const validToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("validToSuggested")
        )
      );
    });

  const suggestedToValid = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("suggestedToValid")
        )
      );
    });
  const suggestedToDeleted = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("suggestedToDeleted")
        )
      );
    });

  const deletedToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("deletedToSuggested")
        )
      );
    });
  const deletedToValid = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("deletedToValid")
        )
      );
    });

  const confirmInvalid = () =>
    new Promise((resolve) => {
      // invalidMoveConfirm();
      setTimeout(() => resolve(setConfirmNotesModalInValid(true)), 1000);
    });

  const confirmComboInvalid = () =>
    new Promise((resolve) => {
      comboMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmComboValid = () =>
    new Promise((resolve) => {
      comboMoveValidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmInvalidMeat = () =>
    new Promise((resolve) => {
      meatMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmValidMeat = () =>
    new Promise((resolve) => {
      meatMoveValidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    setSelectDiseasesName(title);
    setSelectInvalidDetails(data);
  };

  const onchangeCombo = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };
  const onchangeMeat = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };

  const comboMoveInvalidConfirm = () => {
    const result = comboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = comboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setComboDiseaseCodesList(result);
    var namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    var newArray = [];
    newArray = [...invalidComboDiseaseCodesList, ...result2];
    setInvalidComboDiseaseCodesList(newArray);
  };

  const comboMoveValidConfirm = () => {
    const result = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setInvalidComboDiseaseCodesList(result);
    const result2 = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    var newArray = [];
    newArray = [...comboDiseaseCodesList, ...result2];
    setComboDiseaseCodesList(newArray);
  };

  const meatMoveInvalidConfirm = () => {
    const result = meatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = meatCriteriaList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setMeatCriteriaList(result);
    var newArray = [];
    newArray = [...invalidMeatCriteriaList, ...result2];
    setInvalidMeatCriteriaList(newArray);
  };

  const meatMoveValidConfirm = () => {
    const result = invalidMeatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setInvalidMeatCriteriaList(result);
    const result2 = invalidMeatCriteriaList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    var newArray = [];
    newArray = [...meatCriteriaList, ...result2];
    setMeatCriteriaList(newArray);
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

  const handleOpenModal = async (
    value,
    disDescription,
    encounterDate,
    meatresult
  ) => {
    setSelectMeatResult(meatresult);
    setFileLoading(true);
    var splitPoint = disDescription.substring(" ", 20);
    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var pageNumber = null;
    try {
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/pageNumber?header=${value}&fileId=${fileId}&dos=${encounterDatesHeader}&stringFileWord=${splitPoint}`
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        if (result?.first == false) {
          splitPoint = value;
        }
        pageNumber = result?.second[0] - 1 ? result?.second[0] - 1 : null;
        setFileInitialPage(pageNumber);
        setFileDosPageNumber(pageNumber);
      } else {
        setFileInitialPage(null);
        setFileDosPageNumber(null);
      }
      setMeatModalTitle(dotLoading);
      setIsLoadingSection(true);
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
        var dataset = value + " / (" + disDescription + ")";
        setMeatModalTitle(dataset);
      }
      setFindFileKeyword(splitPoint);

      setIsModalOpen(true);
      var dataset = value + " / (" + disDescription + ")";
      setSelectMeatName(dataset);
    } catch (error) {
      splitPoint = value;
      if (findFileKeyword == value) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
      setFileDosPageNumber(null);
    }
  };

  const findValueDocuments = async (
    value,
    disDescription,
    headerNames,
    encounterDate,
    actualDescription
  ) => {
    setFileLoading(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var splitPoint = actualDescription.substring(" ", 20);
    var pageNumber = null;
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: splitPoint,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.second[0] - 1 ? result?.second[0] - 1 : null;
        if (result?.first == false) {
          splitPoint = headerNames;
        }
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setSearch({
          value: splitPoint,
          page: result?.pageNumber,
        });
        setFileInitialPage(pageNumber);
        setFileDosPageNumber(pageNumber);
      } else {
        splitPoint = headerNames;
        setFileInitialPage(null);
        setFileDosPageNumber(null);
      }
      setTargetPages(
        (targetPage) =>
          targetPage.pageIndex === pageNumber ||
          targetPage.pageIndex === pageNumber + 1 ||
          targetPage.pageIndex === pageNumber + 2
      );
      setFindFileKeyword(splitPoint);
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
      }
    } catch (error) {
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
      setFileDosPageNumber(null);
    }
  };

  const findValueDocument = async (
    value,
    disDescription,
    headerNames,
    encounterDate,
    actualDescription,
    diagnosisCode
  ) => {
    setFileLoading(true);
    setHyperlinkSearch(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var splitPoint;
    var pageNumber = null;
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: actualDescription.substring(" ", 20),
      diagnosisCode: diagnosisCode,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber/latest`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.pageNumber - 1 ? result?.pageNumber - 1 : null;
        splitPoint = result?.searchString;
        if (result == null) {
          return findValueDocuments(
            value,
            disDescription,
            headerNames,
            encounterDate,
            actualDescription
          );
        }
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setSearch({
          value: splitPoint,
          page: result?.pageNumber,
        });
        setFileInitialPage(pageNumber);
        setFileDosPageNumber(pageNumber);
      } else {
        splitPoint = headerNames;
        setFileInitialPage(null);
        setFileDosPageNumber(null);
      }
      setTargetPages((targetPage) => {
        targetPage.pageIndex === pageNumber;
      });
      setFindFileKeyword(splitPoint);
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
      }
    } catch (error) {
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
      setFileDosPageNumber(null);
    }
  };

  const handleOpenModalCombinationCode = async (
    value,
    disDescription,
    check,
    whereCome,
    documentPlace,
    encounterDate,
    headerNames,
    actualDescription,
    testModal
  ) => {
    setFileLoading(true);
    setDocumentLoaded(false);
    if (
      documentPlace == "Radio" ||
      whereCome == "Radio" ||
      documentPlace == "Radio-combo"
    ) {
      handleOpenModalRadiology(value, disDescription, true);
    } else if (documentPlace == "Lab" || whereCome == "Lab") {
      setFileInitialPage(null);
      setFileDosPageNumber(null);
      var splitPoint = disDescription.substring(" ", 40);
      setFindFileKeyword(splitPoint);
      setTimeout(() => {
        var dataset = "Lab" + " - (" + disDescription + ")";
        setSelectMeatName(dataset);
      }, 2000);
      setDocumentLoaded(true);
      var dataset = "Lab" + " - (" + disDescription + ")";
      setSelectMeatName(dataset + " -  " + "Loading...");
      setIsLoadingSection(true);
      setIsModalOpenLab(true);
    } else {
      if (whereCome == "nonHcc") {
        setNonHccActiveCodes(true);
      } else {
        setNonHccActiveCodes(false);
      }
      if (check === "valid") {
        var dataset = value + " - (" + disDescription + ")";
        setSelectMeatName(dataset + " -  " + "Loading...");
        var dotLoading = (
          <div className={visitStyles.loadingFileHeader}>
            <Spinner />
          </div>
        );
        setIsLoadingSection(true);
        var headerName = dotLoading;
        setFileModalHeader(headerName);
        if (documentPlace == "COMBO") {
          setIsModalOpenCaptureSection(true);
        } else {
          if (testModal == "Suggested") {
            setIsModalOpenValidCodes(true);
          } else {
            setIsModalOpenValidCodes(true);
          }
        }

        var fileId = patientFileDTO.fileId;
        const encounterDatesValue = encounterDate.split(",");
        const encounterDatesHeader = encounterDatesValue[0];
        var splitPoint = "";
        var pageNumber = null;
        splitPoint = actualDescription.substring(" ", 20);
        try {
          const response = await axios.get(
            ENDPOINTS.apiEndoint +
              `dbservice/pageNumber?header=${headerNames}&fileId=${fileId}&dos=${encounterDatesHeader}&stringFileWord=${splitPoint}`
          );
          var result = response.data.response;
          if (response?.data?.status == "SUCCESS") {
            if (result?.first == false) {
              splitPoint = headerNames;
            }
            pageNumber = result?.second[0] - 1 ? result?.second[0] - 1 : null;
            setFileInitialPage(pageNumber);
          } else {
            splitPoint = headerNames;
          }
          setSelectActiveCode(value);

          setFindFileKeyword(splitPoint);
          var dataset =
            value +
            " - (" +
            disDescription +
            ")" +
            " / (" +
            actualDescription +
            ")";
          setSelectMeatName(dataset);
          var headerName =
            patientDocumentResult.patientId +
            " / " +
            patientDocumentResult.patientName +
            " / " +
            dataset;
          setFileModalTitle(headerName);
          setDocumentLoaded(true);
        } catch (error) {
          splitPoint = headerNames;
          if (findFileKeyword == headerNames) {
            setFileLoading(false);
          }
          setFindFileKeyword(splitPoint);
          setFileInitialPage(null);
          setFileDosPageNumber(null);
        }
      } else if (check == "valid2") {
        setSelectActiveCode(value);
        var splitPoint = "";
        splitPoint = disDescription;
        setTimeout(() => {
          highlight({
            keyword: splitPoint,
            matchCase: true,
          });
          var dataset = value + " - (" + disDescription + ")";
          setSelectMeatName(dataset);
          var headerName =
            patientDocumentResult.patientId +
            " / " +
            patientDocumentResult.patientName +
            " / " +
            dataset;
          setFileModalHeader(headerName);
        }, 2000);
        setDocumentLoaded(true);
        var dataset = value + " - (" + disDescription + ")";
        setSelectMeatName(dataset + " -  " + "Loading...");
        var headerName =
          patientDocumentResult.patientId +
          " / " +
          patientDocumentResult.patientName +
          " / " +
          dataset +
          " -  " +
          "Loading...";
        setFileModalHeader(headerName);

        setIsLoadingSection(true);
        setIsModalOpenValidCodes(true);
      } else {
        setSelectActiveCode(value);
        var splitPoint = "";
        splitPoint = disDescription.substring(" ", 20);
        setTimeout(() => {
          highlight({
            keyword: splitPoint,
            matchCase: true,
            // wholeWords:true
          });
          var dataset = value + " - (" + disDescription + ")";
          setSelectMeatName(dataset);
        }, 2000);
        setDocumentLoaded(true);
        var dataset = value + " - (" + disDescription + ")";
        setSelectMeatName(dataset + " -  " + "Loading...");
        setIsLoadingSection(true);
        setIsModalOpen(true);
      }
    }

    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };
  const handleOpenModalRadiology = (value, disDescription, radiologyCheck) => {
    setFileInitialPage(null);
    setFileDosPageNumber(null);
    if (radiologyCheck == true) {
      var splitPoint = disDescription.substring(" ", 40);
      setFindFileKeyword(splitPoint);
      setTimeout(() => {
        var dataset = "Radiology" + " - (" + disDescription + ")";
        setSelectMeatName(dataset);
      }, 2000);
      setDocumentLoaded(true);
      var dataset = "Radiology" + " - (" + disDescription + ")";
      setSelectMeatName(dataset + " -  " + "Loading...");
      setIsLoadingSection(true);
      setIsModalOpenRadiology(true);
    } else {
      handleOpenModal(value, disDescription);
    }
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };

  const addValidDiseases = () => {
    setIsModalOpenValid(true);
    // setValidated(true);
  };

  const handleSubmitValidNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModalValid(false);
      // validMoveConfirm();
      if (isValidAction == "validToSuggested") {
        handleSubmitMoveValidToSuggested();
      }
      if (isValidAction == "validToDeleted") {
        handleSubmitMoveValidToDeleted();
      }
      if (isValidAction == "suggestedToDeleted") {
        handleSubmitMoveSuggestedToDeleted();
      }
      if (isValidAction == "suggestedToValid") {
        handleSubmitMoveSuggestedToValid();
      }
      if (isValidAction == "deletedToSuggested") {
        handleSubmitMoveDeletedToSuggested();
      }
      if (isValidAction == "deletedToValid") {
        handleSubmitMoveDeletedToValid();
      }
    }
    setValidated(true);
  };

  const handleSubmitValiInValiddNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModalInValid(false);
      handleSubmitInValidtoValid();
    }
    setValidated(true);
  };

  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const getValidHccDetails = async (value, code) => {
    var patientId = localStorage.getItem("patientId");
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
    setvalidHccDetails(data);
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/hccdisease/icd10mappingForDisease?year=${selectedDosValue}&diagnosisCode=${code}`
    );
    if (response.data) {
      var value = [];
      result = response.data.response;
      for (var key in result) {
        if (
          key != "id" &&
          key != "description" &&
          key != "year" &&
          key != "diagnosisCode" &&
          result[key] != null
        ) {
          value.push({
            name: key,
            value: result[key],
          });
        }
      }
      setHccVersionDetails(value);
    }

    setvalidHccDetails(data);
  };

  const handleSubmitMoveValidToSuggested = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/update/move/validtosuggested`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitMoveValidToDeleted = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/update/move/validtodeleted`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitMoveSuggestedToDeleted = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/update/move/suggestedtodeleted`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitMoveSuggestedToValid = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/update/move/suggestedtovalid`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitMoveDeletedToValid = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/update/move/deletedtovalid`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
    } else {
    }
  };
  const handleSubmitMoveDeletedToSuggested = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/update/move/deletedtoSuggested`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitInValidtoValid = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/update/move/invalidtovalid`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
    } else {
    }
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

  // updated changes
  const handleFormSubmit = async (event) => {
    var dos = dosYearDefalutSelect.label;
    const form = event.currentTarget;
    event.preventDefault();
    if (addValidCodeCheck == true) {
      setAddValidCodeCheck(null);
      if (form.checkValidity() === true) {
        setHccFormTab("MEATFORM");
        setValidated(false);
        // let convertDate = moment(inputValue.encodedDate).format("MM-DD-YYYY");
        // var dataFormatSuggested = {
        //   patientComputeDetailId: localPatientId,
        //   year: dos,
        //   tenantId: localTenantId,
        //   diseaseFormat: {
        //     diagnosisCode: inputValue.diagnosisCode,
        //     actualDescription: inputValue.actualDescription,
        //     encounterDate: convertDate,
        //     capturedSections: [inputValue.capturedSections],
        //   },
        //   providerInfo: {
        //     providerName: inputValue.providerName,
        //     authorizedProvider:
        //       selectProviderInfo == "authorizedProvider" ? true : false,
        //     noCredential: selectProviderInfo == "noCredential" ? true : false,
        //     unAuthorizeProvider:
        //       selectProviderInfo == "unAuthorizeProvider" ? true : false,
        //     unSigned: selectProviderInfo == "unSigned" ? true : false,
        //   },
        // };
        // try {
        //   const response = await axios.post(
        //     ENDPOINTS.apiEndointFileUploadHcc +
        //       `aiservice/patient/addvaliddisease`,
        //     dataFormatSuggested
        //   );
        //   if (response?.status == 200) {
        //     notification.success({
        //       message: "Saved Successfully!",
        //       placement: "top",
        //       duration: 1,
        //     });
        //     form.reset();
        //     setIsModalOpenValidCodes(false);
        //     setIsFileFormShow(false);
        //     setInputValueFileDate("");
        //     getPatientDetailsReload(
        //       localPatientId,
        //       localOrgId,
        //       localTenantId,
        //       "fileNotLoad"
        //     );
        //     handleCloseForm();
        //     setIsModalOpenValid(false);
        //   } else {
        //   }
        // } catch (e) {}
      }
    }

    setValidated(true);
  };
  const handleFormSubmitMeat = async (event) => {
    var dos = dosYearDefalutSelect.label;
    const form = event.currentTarget;
    event.preventDefault();
    setAddValidCodeCheck(null);
    if (form.checkValidity() === true) {
      let convertDate = moment(inputValue.encodedDate).format("MM-DD-YYYY");

      var dataFormatSuggested = {
        patientComputeDetailId: localPatientId,
        year: dos,
        meatDetail: {
          diseaseName: inputValue.actualDescription,
          diagnosisCode: inputValue.diagnosisCode,
          isMeatCriteriaPresent: inputValueMeat.isMeatCriteriaPresent,
          monitorCapturedFromHeader: inputValueMeat.monitorCapturedFromHeader,
          monitor: inputValueMeat.monitor,
          evaluateCapturedFromHeader: inputValueMeat.evaluateCapturedFromHeader,
          evaluate: inputValueMeat.evaluate,
          assessmentCapturedFromHeader:
            inputValueMeat.assessmentCapturedFromHeader,
          assessment: inputValueMeat.assessment,
          treatmentCapturedFromHeader:
            inputValueMeat.treatmentCapturedFromHeader,
          treatment: inputValueMeat.treatment,
          radiology: false,
          lab: false,
          isManuallyAdded: true,
          encounterDate: convertDate,
        },
        diseaseFormat: {
          diagnosisCode: inputValue.diagnosisCode,
          actualDescription: inputValue.actualDescription,
          encounterDate: convertDate,
          capturedSections: [inputValue.capturedSections],
        },
        providerInfo: {
          providerName: inputValue.providerName,
          authorizedProvider:
            selectProviderInfo == "authorizedProvider" ? true : false,
          noCredential: selectProviderInfo == "noCredential" ? true : false,
          unAuthorizeProvider:
            selectProviderInfo == "unAuthorizeProvider" ? true : false,
          unSigned: selectProviderInfo == "unSigned" ? true : false,
        },
      };

      try {
        const response = await axios.post(
          ENDPOINTS.apiEndointFileUploadHcc +
            `dbservice/patient/compute/addvaliddisease`,
          dataFormatSuggested
        );
        if (response?.status == 200) {
          notification.success({
            message: "Saved Successfully!",
            placement: "top",
            duration: 1,
          });
          setHccFormTab("HCCFORM");

          form.reset();
          setIsModalOpenValidCodes(false);
          setIsFileFormShow(false);
          setInputValueFileDate("");

          getPatientDetailsReload(
            localPatientId,
            localOrgId,
            localTenantId,
            "fileNotLoad"
          );
          handleCloseForm();
          setIsModalOpenValid(false);
        } else {
        }
      } catch (e) {}
    }

    setValidated(true);
  };

  const getPatientDetailsReload = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    dispatch(getPatientDetailsResult(patientId));
  };

  const addValidCodeFile = async (event) => {
    setIsFileFormShow(true);
    setValidated(false);
  };

  function removeDuplicates(array) {
    let output = [];
    if (array) {
      for (let item of array) {
        if (!output.includes(item)) output.push(item);
      }
    }

    return output;
  }

  const stringToColour = (str) => {
    let hash = 0;
    str.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, "0");
    }
    return colour;
  };

  const submitSectionColors = async (
    sectionName,
    sectionColor,
    backgroundColor
  ) => {
    var postData = {
      backgroundColor: backgroundColor,
      sectionColor: sectionColor,
      sectionName: sectionName,
    };

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/section/color/save`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
      } else {
      }
    } catch (e) {}
  };

  const getCaptureSectionBackgroundFile = (
    value,
    encounterDate,
    actualDescription,
    diagnosisCode
  ) => {
    // getSectionTagColor(value);
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;
      var sectionMapArr = (
        <span
          onClick={() =>
            findValueDocument(
              disCode,
              res,
              headerNames,
              encounterDate,
              actualDescription,
              diagnosisCode
            )
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getCaptureSectionBackground = (
    value,
    documentPlace,
    encounterDate,
    actualDescription,
    testModal,
    diagnosisCode
  ) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = diagnosisCode;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() =>
            handleOpenModalCombinationCode(
              disCode,
              res,
              "valid",
              "null",
              documentPlace,
              encounterDate,
              headerNames,
              actualDescription,
              testModal
            )
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDateBackgroundHcc = (value, code, place, meatResult) => {
    return value?.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = res ? (
        <span
          onClick={() => getEncounterDetailsHcc(res, code, place, meatResult)}
          className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res, "MM/DD/YYYY").format("MMM DD")}
        </span>
      ) : (
        ""
      );
      return sectionMapArr;
    });
  };

  const getEncounterDetailsHcc = async (date, code, place, meatResult) => {
    const findPageNumber = listPageNumber.filter((i) => i.date === date);
    if (findPageNumber.length != 0) {
      var dataset = code + " - (" + date + ")";
      var headerName =
        patientDocumentResult.patientId +
        " / " +
        patientDocumentResult.patientName +
        " / " +
        dataset;
      setFileModalTitle(headerName);

      setFileLoading(true);
      if (place == "MEAT") {
        setSelectMeatName(headerName);
        setSelectMeatResult(meatResult);
        setIsModalOpen(true);
      } else if (place == "COMBO") {
        setIsModalOpenCaptureSection(true);
      } else {
        setIsModalOpenValidCodes(true);
      }
      var date = findPageNumber[0].date;
      if (findPageNumber[0].startPage.length != 0) {
        var pageNumber = findPageNumber[0].startPage[0].pageNumber - 1;
        setFileInitialPage(pageNumber);
        setFileDosPageNumber(pageNumber);
        var splitPoint = date.substring(" ", 5);
        setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
        setFindFileKeyword(splitPoint);
        if (pageNumber == fileInitialPage) {
        }
      }
    }
  };

  const getEncounterDateBackground = (value) => {
    return value?.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = res ? (
        <span
          onClick={() => getEncounterDetails(res)}
          className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res).format("MMM DD")}
        </span>
      ) : (
        ""
      );
      return sectionMapArr;
    });
  };

  const getEncounterDetails = async (date) => {
    const findPageNumber = listPageNumber.filter((i) => i.date === date);
    if (findPageNumber.length != 0) {
      setFileLoading(true);
      var date = findPageNumber[0].date;
      if (findPageNumber[0].startPage.length != 0) {
        var pageNumber = findPageNumber[0].startPage[0].pageNumber;
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setFileInitialPage(pageNumber);
        setFileDosPageNumber(pageNumber);
        var splitPoint = date.substring(" ", 5);
        setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
        setFindFileKeyword(splitPoint);
        setSearch({
          value: splitPoint,
          page: pageNumber,
        });
      }
    }
    // var dotLoading = (
    //   <div className={visitStyles.loadingFileHeader}>
    //     <Spinner />
    //   </div>
    // );
    // setProviderDetails(dotLoading);
    // var encounterDate = moment(date).format("MM/DD/YYYY");
    // var result = await getProviderDetails(localPatientId, encounterDate);
    // var data = "";
    // if (result?.status == "SUCCESS") {
    //   var datas = result.response;
    //   data = (
    //     <div className="validhcc-details">
    //       <div>Provider Name : {datas.providerName}</div>
    //       <div>Authorized Provider : {datas.authorizedProvider}</div>
    //       <div>UnAuthorize Provider : {datas.unAuthorizeProvider}</div>
    //       <div>No Credential : {datas.noCredential}</div>
    //       <div>UnSigned : {datas.unSigned}</div>
    //     </div>
    //   );
    // } else {
    //   data = (
    //     <div className="validhcc-details">
    //       <div>Provider Not Found</div>
    //     </div>
    //   );
    // }
    // setProviderDetails(data);
  };

  const getCaptureSectionBackgroundMeat = (
    value,
    dis,
    encounterDate,
    meatresult
  ) => {
    if (value) {
      var igonreCase = value.toLowerCase();
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == igonreCase
      );

      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() => handleOpenModal(value, dis, encounterDate, meatresult)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheaderMeat}`}
        >
          {value}
        </span>
      );
      return sectionMapArr;
    }
  };

  const getCaptureSectionBackgroundMeatFile = (
    value,
    dis,
    encounterDate,
    meatresult
  ) => {
    if (value) {
      var igonreCase = value.toLowerCase();
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == igonreCase
      );

      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() => handleOpenModal(value, dis, encounterDate, meatresult)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheaderMeatView}`}
        >
          {value}
        </span>
      );
      return sectionMapArr;
    }
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
  const dosListMeat = [
    { value: "08/01/2023", label: "08/01/2023" },
    { value: "24/06/2023", label: "24/06/2023" },
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
  const selectTab = async (number) => {
    setActiveTabNumber(number);
    setSelectPreviousCode(null);
    setFlagTagActive(false);
    setIsDosSelect(false);
    setFileInitialPage(0);
    switch (number) {
      case 1:
        setFlagTagActive(true);
        setIsDosSelect(false);
        break;
      case 5:
        setIsDosSelect(true);
        break;
      case 6:
        // var result = await getMeatQueryList(selectedDosValue, localPatientId);
        // setMeatQueryList(result.response);
        break;
      default:
        null;
    }
  };

  const getFileDosPageNumber = async () => {
    var result = fileDosPageNumberList?.result;
    var groupPageNumber = [];
    var groupEncounterDate = [];
    for (var key in result?.response) {
      var optionArray = [];
      var optionPage = [];
      var pageNumbervalue = result.response[key];
      for (var key2 in pageNumbervalue) {
        var startPage = key2 == "first" ? pageNumbervalue[key2] : null;
        var keyValue = key2 == "first" ? "Start - " : "End - ";
        optionArray.push({
          label: keyValue + " " + pageNumbervalue[key2],
          value: pageNumbervalue[key2] + "," + moment(key).format("MM/DD"),
        });
        if (startPage) {
          optionPage.push({
            pageNumber: startPage,
          });
        }
      }
      groupPageNumber.push({
        label: moment(key).format("MM-DD-YYYY"),
        options: optionArray,
      });
      groupEncounterDate.push({
        date: moment(key).format("MM/DD/YYYY"),
        startPage: optionPage,
      });
    }
    setPageNumberOptions(groupPageNumber);
    setListPageNumber(groupEncounterDate);
  };

  const handleChangePageNumber = async (value) => {
    setPopoverVisible(false);
    var str_array = value.split(",");
    var pageNumber = str_array[0];
    var findData = str_array[1];
    setFindFileKeyword(null);
    setFileLoading(true);
    var pageIndex = pageNumber - 1;
    setFileInitialPage(pageIndex);
    setFileDosPageNumber(pageIndex);
    setTargetPages(
      (targetPage) =>
        targetPage.pageIndex === pageNumber ||
        targetPage.pageIndex === pageNumber + 1 ||
        targetPage.pageIndex === pageNumber + 2
    );
    setFindFileKeyword(findData);
    setSearch({
      value: "",
      page: pageNumber,
    });
  };

  const getPreviousData = (code, action) => {
    const result = meatQueryList.filter(
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

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor =
        result[0]?.backgroundColor == "#efeff033"
          ? "#54548d33"
          : result[0]?.backgroundColor;
      var textColor =
        result[0]?.sectionColor == "#efeff0" ? "#000" : result[0]?.sectionColor;
      var value = ["09/19/2023"];
      var sectionMapArr = (
        // <Popover
        //   content={
        //     <>
        //       {value?.map((res3) => {
        //         const result = encounterDateMatching.filter(
        //           (res2) => res2.name == res3
        //         );
        //         var backColor = result[0]?.colors;
        //         <span
        //           className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
        //         >
        //           <i>
        //             <CalendarOutlined className={visitStyles.calenderIcon} />
        //           </i>
        //           {moment(res3).format("MMM DD")}
        //         </span>;
        //       })}
        //     </>
        //   }
        //   trigger={["click"]}
        //   placement="bottom"
        //   onClick={() => getEncounterProviderDetails(res)}
        // >
        <Tooltip title={res}>
          <span
            className={`mt-2 text-start ${visitStyles.provider_name} ${visitStyles.elipse}`}
            style={{ backgroundColor: backColor, color: textColor }}
          >
            <i>
              {" "}
              <FontAwesomeIcon
                icon={faCircleUser}
                style={{
                  size: 10,
                  color: textColor,
                }}
              />
            </i>
            {res}
          </span>
        </Tooltip>

        // </Popover>
      );
      return sectionMapArr;
    });

    // var value = data?.map((res) =>
    //   res.providerName ? (
    //     <Badge
    //       className={
    //         res.authorizedProvider === true
    //           ? `mt-2 text-start ${visitStyles.provider_name}`
    //           : `mt-2 text-start ${visitStyles.un_provider_name}`
    //       }
    //     >
    //       <i>
    //         {" "}
    //         <FontAwesomeIcon
    //           icon={faCircleUser}
    //           style={{
    //             size: 10,
    //             color:
    //               res.authorizedProvider === true ? "#008000bf" : "#ff0000cc",
    //           }}
    //         />
    //       </i>
    //       {res.providerName}
    //     </Badge>
    //   ) : null
    // );
    // return value;
  };

  const addComboCode = () => {
    setIsAddComboCode(true);
  };

  const handleSubmitComboCode = async (event) => {
    var dos = dosYearDefalutSelect.label;

    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      var updateDataformat = {
        patientId: localPatientId,
        dosYear: selectedDosValue,
        comboCode: inputValue.comboCode,
        additionalCode: inputValue.additionalCode,
        description: inputValue.description,
      };
      var result = await manuallyAddComboCode(updateDataformat);
      if (result.status == "SUCCESS") {
        setIsAddComboCode(false);
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getPatientDetailsReload(
          localPatientId,
          localOrgId,
          localTenantId,
          "fileNotLoad"
        );
      }

      setValidated(true);
    }
  };

  const underScoreRemove = (value) => {
    var str = value;
    var newStr = str.replace(/_/g, " ");
    return newStr;
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
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

  const getEncounterProviderDetails = async (name) => {
    // var result = await getProviderEncounterDetails(localPatientId, name);

    var value = ["09/19/2023"];

    return value?.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = (
        <span
          className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res).format("MMM DD")}
        </span>
      );
      return sectionMapArr;
    });
  };

  const PopContent = (
    <div className={styles.innerPop}>
      <div className={styles.displayDiv}>
        <div className={styles.closeContainer}>
          <FontAwesomeIcon
            icon={faClose}
            style={{
              size: 5,
              color: "#fff",
            }}
            className={styles.close_icon}
            onClick={() => setPopoverVisible(false)}
          />
        </div>
        {pageNumberOptions
          ? pageNumberOptions?.map((data) => (
              <div className={styles.hoverDiv}>
                <div className={`row ${styles.selectDetailsContainer}`}>
                  <div className="col-xl-3">
                    <span className={styles.selectHead}>{data.label}</span>
                  </div>
                  {data?.options.map((data2) => (
                    <div className={`col-xl-3 ${styles.selectDetailsDiv}`}>
                      <span
                        onClick={() => handleChangePageNumber(data2.value)}
                        className={styles.selectDetails}
                      >
                        {data2?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );

  const PopContentHccVersion = (
    <div className={styles.innerPop}>
      <div className={styles.displayDiv}>
        {hccVersionDetails ? (
          <>
            {hccVersionDetails.length != 0 ? (
              hccVersionDetails?.map((data) => (
                <div className={styles.hoverDiv}>
                  <div className={`row ${styles.selectDetailsContainer}`}>
                    <div className="col-xl-3">
                      <span className={styles.selectHead}>{data.name}</span>
                    </div>
                    <div className="col-xl-3">
                      <span className={styles.selectHead}>{data.value}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.hoverDiv}>
                <div className={`row ${styles.selectDetailsContainerNoData}`}>
                  <div className="col-xl-3 text-center">
                    <span className={styles.selectHead}>NO DATA</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={visitStyles.loadingFileHeader}>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );

  const handleSelectProvider = (value) => {
    setSelectProviderInfo(value);
  };

  const handleFormClear = () => {
    inputValue.diagnosisCode = "";
    inputValue.providerName = "";
    inputValue.actualDescription = "";
    inputValue.capturedSections = "";
    setAddValidCodeCheck(null);
    setInputValueFileDate("");
    setSelectProviderInfo(null);
  };

  // var pdfElement = document.getElementsByClassName("rpv-toolbar__item");
  // if (pdfElement.length != 0) {
  //   for (let i = 0; i < pdfElement.length; i++) {
  //     pdfElement[i].addEventListener("click", function (e) {
  //       if (hyperlinkSeacrh == false) {
  //         setFileInitialPage(null);
  //         setFindFileKeyword(null);
  //       }
  //     });
  //   }
  // }

  const updateCall = async (data) => {
    const orgId = localStorage.getItem('orgId')
    const response = await axios.put(
      ENDPOINTS.apiEndoint + `aiservice/patient/update`,
      {
        patientId: localPatientId,
        orgId: orgId,
        previousDiagnosisCode: data.diagnosisCode,
        newPreviousDiagnosisCode: editDiagnosisCode,
        year: year.value
      }
    );
    setEditCode(true)
    setEditDiagnosisCode("");
  };

  const updateCode = (value) => {
    return (
      <>
        <div className="input-group mb-3">
          <input
            type="text"
            className={`form-control ${editCode && "border border-primary"}`}
            placeholder="Recipient's username"
            value={editDiagnosisCode ? editDiagnosisCode : value.diagnosisCode}
            onChange={(e) => setEditDiagnosisCode(e.target.value)}
            disabled={!editCode}
          />

          {editCode ? (
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              id="basic-addon2"
              onClick={() => updateCall(value)}
            >
              <FontAwesomeIcon icon={faSave} />
            </span>
          ) : (
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              id="basic-addon2"
              onClick={() => {
                setEditCode(true);
                setEditDiagnosisCode(value.diagnosisCode);
              }}
            >
              <FontAwesomeIcon icon={faPen} />
            </span>
          )}
        </div>
      </>
    );
  };
  return (
    <>
      {fileLoading ? (
        <div className={styles.overlay_style}>
          <div className={styles.overlay__inner_style}>
            <div className={styles.overlay__content_style}>
              <span className={styles.spinner_style}></span>
            </div>
          </div>
        </div>
      ) : null}
      <div className="my-post-content row pt-3">
        {!isFileFormShow ? (
          <div className="col-xl-3">
            <ul className="timeline">
              <div
                className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
              >
                <span className={`${visitStyles.hcc_title_name}`}>
                  HCC
                  <FontAwesomeIcon
                    onClick={() => addValidCodeFile()}
                    icon={faPlus}
                  />
                </span>
                <div className="d-flex justify-content-center">
                  <span className={`${visitStyles.hcc_title_badge}`}>
                    {newValidDiseaseList.length}
                  </span>
                </div>
              </div>
              <div className={visitStyles.container}>
                <div className={visitStyles.hccStickey_head}>
                  {newValidDiseaseList.map((data, i) => (
                    <li>
                      <div className={`hccActiveCard ${visitStyles.hcc_card}`}>
                        <div
                          className={` justify-content-between ${visitStyles.hcc_card_nameHead}`}
                        >
                          <div>
                            <span className="disease-name d-flex mb-1">
                              <span className="valid-dis-name">
                                {data.diagnosisCode}
                              </span>{" "}
                              <span className="">
                                <Popover
                                  content={updateCode(data)}
                                  title=""
                                  trigger="click"
                                >
                                  <FontAwesomeIcon icon={faPen} />
                                </Popover>
                              </span>
                              <Popover
                                content={
                                  data.dbDescription
                                    ? data.dbDescription
                                    : data.actualDescription
                                }
                                title=""
                                trigger="hover"
                              >
                                <>
                                  {" "}
                                  -{" "}
                                  {data.dbDescription
                                    ? data.dbDescription
                                    : data.actualDescription}
                                </>
                              </Popover>
                            </span>
                          </div>

                          <div className="d-flex">
                            {data.defaultPosition ==
                            "VALID" ? null : data.defaultPosition ==
                              "INVALID" ? (
                              <span
                                className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                              ></span>
                            ) : data.defaultPosition == "SUGGESTED" ? (
                              <span
                                className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                              ></span>
                            ) : data.defaultPosition == "DELETED" ? (
                              <span
                                className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}
                              ></span>
                            ) : null}
                            <Popover
                              onClick={() =>
                                getValidHccDetails(
                                  data.actualDescription,
                                  data.diagnosisCode
                                )
                              }
                              content={PopContentHccVersion}
                              title={data.diagnosisCode}
                              placement="bottom"
                              trigger="click"
                            >
                              <Tooltip
                                title="HCC Version Details"
                                placement="bottom"
                              >
                                <i className="cr-pointer">{SVGICON.infoIcon}</i>
                              </Tooltip>
                            </Popover>

                            <Popconfirm
                              title="Choose an action"
                              icon={
                                <QuestionCircleOutlined
                                  style={{
                                    color: "blue",
                                  }}
                                />
                              }
                              okText="Move to Deleted"
                              cancelText="Move to Suggested"
                              onCancel={validToSuggested}
                              okButtonProps={{
                                type: buttonClicked ? "primary" : "default",
                              }}
                              cancelButtonProps={{
                                type: buttonClicked ? "danger" : "default",
                              }}
                              description={data.diagnosisCode}
                              onConfirm={confirmvalid}
                              placement="leftTop"
                              onOpenChange={() =>
                                onchangeValid(data.diagnosisCode, data)
                              }
                            >
                              <div className={visitStyles.close_icon}>
                                {
                                  <FontAwesomeIcon
                                    icon={faArrowsAlt}
                                    style={{
                                      size: 8,
                                      color: "#a80404",
                                    }}
                                  />
                                }
                              </div>
                            </Popconfirm>
                            {data.isMostSpecific == true && (
                              <div
                                className={visitStyles.close_icon}
                                style={{ background: "#c7f3c6" }}
                                onClick={() => {
                                  setOpens(true);
                                  setCombiTree([{ ...data, expanded: true }]);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faSitemap}
                                  style={{
                                    size: 8,
                                    color: "#088f39",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className={`${visitStyles.hoverActiveHcc}`}>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {getProviderNameList(data?.providerName)}
                            </div>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {getEncounterDateBackground(
                                data.encounterDateSplit
                              )}
                            </div>

                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {getCaptureSectionBackgroundFile(
                                data?.capturedSections,
                                data?.encounterDate,
                                data?.actualDescription,
                                data?.diagnosisCode,
                                data?.dbDescription
                              )}
                            </div>
                            {/* {data?.isMostSpecific == true ? (
                                        <div
                                          className={`${visitStyles.encounterAndSectionHeader}`}
                                        >
                                          <span
                                            className={`mt-2 text-start cr-pointer ${styles.mostSpecificTag}`}
                                          >
                                            IsMostSpecific
                                          </span>
                                        </div>
                                      ) : null} */}
                          </div>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
                            <div className={`cr-pointer ${styles.meatFoundContainer}`}>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "M"
                                )}
                              </div>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "E"
                                )}
                              </div>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "A"
                                )}
                              </div>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "T"
                                )}
                              </div>
                            </div>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {data.isManuallyAdded == true ? (
                                <Badge
                                  className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                >
                                  Manually Added
                                </Badge>
                              ) : null}
                            </div>
                            {data.getPlace == "Insulin" ? (
                              <span
                                className={` mt-2 ${visitStyles.radiologyStatus}`}
                                bg={`  mt-2 bg-bg-eight `}
                              >
                                Insulin
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </div>
              </div>
            </ul>
          </div>
        ) : null}
        <div className={isFileFormShow ? "col-xl-1" : "d-none"}>
          <Button
            onClick={() => handleCloseModal()}
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
        <div className={isFileFormShow ? "col-xl-7" : "col-xl-6"}>
          <Popover
            open={popoverVisible}
            content={PopContent}
            placement="bottom"
            trigger={"click"}
            onOpenChange={() => setPopoverVisible(true)}
          >
            <div className={styles.dosContainer}>
              <span className={styles.dosPageNumber}>
                Select Dos Page Number
              </span>
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{
                  size: 10,
                  color: "#e6e6e6",
                }}
              />
            </div>
          </Popover>
          <div className="card-body p-0">
            {hccFileDetails?.loading != true ? (
              // <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
              //   <div
              //     style={{
              //       height: "71vh",
              //       maxWidth: "1000px",
              //       marginLeft: "auto",
              //       marginRight: "auto",
              //     }}
              //   >
              //     {" "}
              //     <Viewer
              //       fileUrl={selectFileURL}
              //       initialPage={fileInitialPage}
              //       plugins={[defaultLayoutPluginInstance,searchPluginInstance]}
              //       onDocumentLoad={handleDocumentLoadFile}
              //       renderLoader={(percentages) => (
              //         <div style={{ width: "240px" }}>
              //           <ProgressBar progress={Math.round(percentages)} />
              //         </div>
              //       )}
              //       renderMode="canvas"
              //       />

              //   </div>
              // </Worker>
              // selectFileURL

              <>
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                  />
                )}
              </>
            ) : null}
          </div>
        </div>
        {isFileFormShow ? (
          <div className="col-xl-4">
            <AddHccForm
              diagnosisCode={inputValue.diagnosisCode}
              handleCloseModal={handleCloseModal}
              isAddHccForm={isAddHccForm}
              setIsAddHccForm={setIsAddHccForm}
            />
          </div>
        ) : null}
        {!isFileFormShow ? (
          <div className="col-xl-3">
            <div className="">
              <ul className="timeline">
                <div
                  className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                >
                  <span className={`${visitStyles.suggested_title_name}`}>
                    SUGGESTED CODES
                  </span>
                  <div className="d-flex justify-content-center">
                    <span className={`${visitStyles.suggested_title_badge}`}>
                      {suggestedHccList.length}
                    </span>
                  </div>
                </div>
                <div className={visitStyles.suggestedcontainer2}>
                  <div className={visitStyles.hccStickey_head}>
                    {suggestedHccList?.map((data) => {
                      return (
                        <>
                          <li>
                            <div
                              className={`hccActiveCard ${visitStyles.hcc_card}`}
                            >
                              <div
                                className={`${visitStyles.hcc_card_nameHead}`}
                              >
                                <div className="media-body">
                                  <span className="disease-name d-flex mb-1">
                                    <span className="valid-dis-name">
                                      {data.diagnosisCode}
                                    </span>{" "}
                                    <Popover
                                      content={
                                        data.dbDescription
                                          ? data.dbDescription
                                          : data.actualDescription
                                      }
                                      title=""
                                      trigger="hover"
                                    >
                                      -{" "}
                                      {data.dbDescription
                                        ? data.dbDescription
                                        : data.actualDescription}
                                    </Popover>
                                  </span>
                                </div>
                                {data.defaultPosition == "VALID" ? (
                                  <span
                                    className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}
                                  ></span>
                                ) : data.defaultPosition == "INVALID" ? (
                                  <span
                                    className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                                  ></span>
                                ) : data.defaultPosition == "SUGGESTED" ? (
                                  <span
                                    className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                                  ></span>
                                ) : data.defaultPosition == "DELETED" ? (
                                  <span
                                    className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}
                                  ></span>
                                ) : null}
                                <Popover
                                  onClick={() =>
                                    getValidHccDetails(
                                      data.actualDescription,
                                      data.diagnosisCode
                                    )
                                  }
                                  content={PopContentHccVersion}
                                  title={data.diagnosisCode}
                                  placement="bottom"
                                  trigger="click"
                                >
                                  <i>{SVGICON.infoIcon}</i>
                                </Popover>
                                {data.getPlace == "Radio" ||
                                data.getPlace == "Lab" ? (
                                  <Popconfirm
                                    title="Choose an action"
                                    icon={
                                      <QuestionCircleOutlined
                                        style={{
                                          color: "blue",
                                        }}
                                      />
                                    }
                                    okText="Move to Deleted"
                                    okButtonProps={{
                                      type: buttonClicked
                                        ? "primary"
                                        : "default",
                                    }}
                                    description={data.diagnosisCode}
                                    onConfirm={suggestedToDeleted}
                                    placement="leftTop"
                                    onOpenChange={() =>
                                      onchangeValid(data.diagnosisCode, data)
                                    }
                                  >
                                    <div className={visitStyles.close_icon}>
                                      <FontAwesomeIcon
                                        icon={faArrowsAlt}
                                        style={{
                                          size: 8,
                                          color: "#a80404",
                                        }}
                                      />
                                    </div>
                                  </Popconfirm>
                                ) : (
                                  <Popconfirm
                                    title="Choose an action"
                                    icon={
                                      <QuestionCircleOutlined
                                        style={{
                                          color: "blue",
                                        }}
                                      />
                                    }
                                    okText="Move to Deleted"
                                    cancelText="Move to HCC"
                                    onCancel={suggestedToValid}
                                    okButtonProps={{
                                      type: buttonClicked
                                        ? "primary"
                                        : "default",
                                    }}
                                    cancelButtonProps={{
                                      type: buttonClicked
                                        ? "danger"
                                        : "default",
                                    }}
                                    description={data.diagnosisCode}
                                    onConfirm={suggestedToDeleted}
                                    placement="leftTop"
                                    onOpenChange={() =>
                                      onchangeValid(data.diagnosisCode, data)
                                    }
                                  >
                                    <div className={visitStyles.close_icon}>
                                      <FontAwesomeIcon
                                        icon={faArrowsAlt}
                                        style={{
                                          size: 8,
                                          color: "#a80404",
                                        }}
                                      />
                                    </div>
                                  </Popconfirm>
                                )}
                                {data.isMostSpecific == true && (
                                  <div
                                    className={visitStyles.close_icon}
                                    style={{
                                      background: "#c7f3c6",
                                    }}
                                    onClick={() => {
                                      setOpens(true);
                                      setCombiTree([
                                        {
                                          ...data,
                                          expanded: true,
                                        },
                                      ]);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faSitemap}
                                      style={{
                                        size: 8,
                                        color: "#088f39",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              <div
                                className={`${visitStyles.hoverActiveHcc} d-flex justify-content-between`}
                              >
                                <div>
                                  <div className="">
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getProviderNameList(data?.providerName)}
                                    </div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getEncounterDateBackground(
                                        data.encounterDateSplit
                                      )}
                                    </div>                                   
                                  </div>

                                  {data.getPlace == "Lab" ? (
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getCaptureSectionBackground(
                                        data.capturedSections,
                                        "Lab",
                                        data.encounterDate,
                                        data.actualDescription,
                                        data.diagnosisCode
                                      )}
                                    </div>
                                  ) : data.getPlace == "Radio" ||
                                    data.getPlace == "Radio-combo" ? (
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getCaptureSectionBackground(
                                        data.capturedSections,
                                        "Radio",
                                        data.encounterDate,
                                        data.actualDescription,
                                        data.AvatardiagnosisCode
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getCaptureSectionBackgroundFile(
                                        data?.capturedSections,
                                        data?.encounterDate,
                                        data?.actualDescription,
                                        data?.diagnosisCode
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                     <div className={`cr-pointer ${styles.meatFoundContainer}`}>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "M"
                                )}
                              </div>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "E"
                                )}
                              </div>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "A"
                                )}
                              </div>
                              <div onClick={()=>setActiveTabHead(4)}>
                                {getMeatFound(
                                  data?.diagnosisCode,
                                  meatCriteriaList,
                                  "T"
                                )}
                              </div>
                            </div>
                                  <div
                                    className={`${visitStyles.encounterAndSectionHeader}`}
                                  >
                                    {data.isManuallyAdded == true ? (
                                      <Badge
                                        className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                      >
                                        Manually Added
                                      </Badge>
                                    ) : null}
                                  </div>
                                  {data.getPlace == "Insulin" ? (
                                    <span
                                      className={` mt-2 ${visitStyles.radiologyStatus}`}
                                      bg={`  mt-2 bg-bg-eight `}
                                    >
                                      Insulin
                                    </span>
                                  ) : null}
                                   {data.getPlace == "Lab" ? (
                                      <Tooltip title="LAB">
                                        <span
                                          className={` mt-2 ${visitStyles.labStatus}`}
                                          bg={`  mt-2 bg-bg-seven `}
                                        >
                                          Lab
                                        </span>
                                      </Tooltip>
                                    ) : data.getPlace == "Radio" ? (
                                      <Tooltip title="RADIOLOGY">
                                        <span
                                          className={` mt-2 ${visitStyles.radiologyStatus}`}
                                          bg={`  mt-2 bg-bg-eight `}
                                        >
                                          Radiology
                                        </span>
                                      </Tooltip>
                                    ) : null}
                                </div>
                              </div>
                            </div>
                          </li>
                        </>
                      );
                    })}
                  </div>
                </div>
              </ul>
            </div>

            <div className={visitStyles.deleteFileContainer}>
              <ul className="timeline">
                <div
                  className={`valid-text d-flex justify-content-sm-between ${visitStyles.deleted_title_card}`}
                >
                  <span className={`${visitStyles.deleted_title_name}`}>
                    DELETED CODES
                  </span>
                  <div className="d-flex justify-content-center">
                    <span className={`${visitStyles.deleted_title_badge}`}>
                      {deletedHccList.length}
                    </span>
                  </div>
                </div>
                <div className={visitStyles.deletedContainer}>
                  <div className={visitStyles.hccStickey_head}>
                    {deletedHccList.map((data, i) => (
                      <li>
                        <div
                          className={`hccActiveCard ${visitStyles.hcc_card}`}
                        >
                          <div className={`${visitStyles.hcc_card_nameHead}`}>
                            <div className="media-body">
                              <span className="disease-name d-flex mb-1">
                                <span className="valid-dis-name">
                                  {data.diagnosisCode}
                                </span>{" "}
                                <Popover
                                  content={
                                    data.dbDescription
                                      ? data.dbDescription
                                      : data.actualDescription
                                  }
                                  title=""
                                  trigger="hover"
                                >
                                  -{" "}
                                  {data.dbDescription
                                    ? data.dbDescription
                                    : data.actualDescription}
                                </Popover>
                              </span>
                            </div>
                            {data.defaultPosition == "VALID" ? (
                              <span
                                className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}
                              ></span>
                            ) : data.defaultPosition == "INVALID" ? (
                              <span
                                className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                              ></span>
                            ) : data.defaultPosition == "SUGGESTED" ? (
                              <span
                                className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                              ></span>
                            ) : data.defaultPosition == "DELETED" ? (
                              <span
                                className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}
                              ></span>
                            ) : null}
                            <Popover
                              content={data.dbDescription}
                              title={data.diagnosisCode}
                              placement="bottom"
                              trigger="click"
                            >
                              <Tooltip
                                title="HCC Version Details"
                                placement="bottom"
                              >
                                <i>{SVGICON.infoIcon}</i>
                              </Tooltip>
                            </Popover>
                            <Popconfirm
                              title="Choose an action"
                              icon={
                                <QuestionCircleOutlined
                                  style={{
                                    color: "blue",
                                  }}
                                />
                              }
                              okText="Move to Suggested"
                              cancelText="Move to HCC"
                              onCancel={deletedToValid}
                              okButtonProps={{
                                type: buttonClicked ? "primary" : "default",
                              }}
                              cancelButtonProps={{
                                type: buttonClicked ? "danger" : "default",
                              }}
                              description={data.diagnosisCode}
                              onConfirm={deletedToSuggested}
                              placement="leftTop"
                              onOpenChange={() =>
                                onchangeValid(data.diagnosisCode, data)
                              }
                            >
                              <div className={visitStyles.close_icon}>
                                <FontAwesomeIcon
                                  icon={faArrowsAlt}
                                  style={{
                                    size: 8,
                                    color: "#a80404",
                                  }}
                                />
                              </div>
                            </Popconfirm>
                          </div>
                          <div className={`${visitStyles.hoverActiveHcc}`}>
                            <div className="">
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getProviderNameList(data?.providerName)}
                              </div>
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getEncounterDateBackground(
                                  data.encounterDateSplit
                                )}
                              </div>
                            </div>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {getCaptureSectionBackgroundFile(
                                data?.capturedSections,
                                data?.encounterDate,
                                data?.actualDescription,
                                data?.diagnosisCode
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </div>
                </div>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
      {isModalOpenRadiology && (
        <Modal
          title={selectMeatName}
          // title="Pdf Test"
          centered
          open={isModalOpenRadiology}
          // style={{ top: 5 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="70%"
          footer={false}
          // height={400}
        >
          <div className="section-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
              <div
                style={{
                  height: "80vh",
                  // width: "900px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {" "}
                <Viewer
                  fileUrl={selectFileURLRadiology}
                  plugins={[defaultLayoutPluginInstance]}
                  onDocumentLoad={handleDocumentLoadFile}
                  renderLoader={(percentages) => (
                    <div style={{ width: "240px" }}>
                      <ProgressBar progress={Math.round(percentages)} />
                    </div>
                  )}
                />
              </div>
            </Worker>
          </div>
        </Modal>
      )}
      {isModalOpenLab && (
        <Modal
          title={selectMeatName}
          // title="Pdf Test"
          centered
          open={isModalOpenLab}
          // style={{ top: 5 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="70%"
          // height={400}
        >
          <div className="section-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
              <div
                style={{
                  height: "80vh",
                  // width: "900px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {" "}
                <Viewer
                  fileUrl={labReportFile}
                  plugins={[defaultLayoutPluginInstance]}
                  onDocumentLoad={handleDocumentLoadFile}
                  renderLoader={(percentages) => (
                    <div style={{ width: "240px" }}>
                      <ProgressBar progress={Math.round(percentages)} />
                    </div>
                  )}
                />
              </div>
            </Worker>
          </div>
        </Modal>
      )}
      {confirmNotesModalValid && (
        <Modal
          title={selectDiseasesName}
          centered
          open={confirmNotesModalValid}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          footer={null}
        >
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitValidNotes}
              >
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Reason <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <textarea
                      required
                      className="form-control"
                      id="notes"
                      name="notes"
                      onChange={handleChangeSuggested}
                      rows="5"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    Submit
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
        </Modal>
      )}
      {confirmNotesModalInValid && (
        <Modal
          title={selectDiseasesName}
          centered
          open={confirmNotesModalInValid}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          footer={null}
        >
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitValiInValiddNotes}
              >
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Reason <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      onChange={handleChangeSuggested}
                      rows="5"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    Submit
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
        </Modal>
      )}
      {opens && combiTree[0]?.children?.length > 0 ? (
        <Modal
          title={fileModalHeader}
          width="90%"
          centered
          open={opens}
          onOk={() => setOpens(false)}
          onCancel={() => setOpens(false)}
          footer={null}
        >
          <CamboTree tree={combiTree} />
        </Modal>
      ) : (
        opens && showErrorMessage()
      )}
    </>
  );
};

export default File;
