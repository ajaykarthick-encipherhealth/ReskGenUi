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
const Combo = ({}) => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  let searchKeywords = [];
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList.result?.response
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

  useEffect(() => {
    // loadFilterPatientList();
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
    getFileDosPageNumber();
    setNewValidDiseaseList([]);
    setInNewValidDiseaseList([]);
    setNewUnMatchHccList([]);
    setValidDiseasesList([]);
    setInvalidDiseasesList([]);
    setComboDiseaseCodesList([]);
    setDosYear([]);
    setRAFScore([]);
    setSuggestedNonHccList([]);
    setSuggestedHccList([]);
    setDeletedHccList([]);
    setMeatCriteriaList([]);
    setMeatCriteriaListNonHcc([]);

    // setIsLoading(true);
    setIsModalComments(false);
    // var patientId = localStorage.getItem("patientId");
    // const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/compute/get?patientid=ambal&orgid=ambal");
    // const response = await axios.get(
    //   ENDPOINTS.apiEndoint +
    //   `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    // );
    if (patientDetailsResult?.result?.response && sectionColorList) {
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
              if (res.isHccValid == true) {
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
              } else {
                // suggestListAll.push({
                //   actualDescription: res.actualDescription,
                //   diagnosisCodeFinding: res.diagnosisCodeFinding,
                //   isHccValid: res.isHccValid,
                //   capturedSections: res.capturedSections,
                //   diagnosisCode: res.diagnosisCodeFinding,
                //   encounterDate: res.encounterDate,
                //   getPlace: "Hcc",
                // });
                suggestListAllNonHcc.push({
                  actualDescription: res.actualDescription,
                  diagnosisCodeFinding: res.diagnosisCode,
                  isHccValid: res.isHccValid,
                  capturedSections: res.capturedSections,
                  diagnosisCode: res.diagnosisCode,
                  encounterDate: res.encounterDate,
                  encounterDateSplit: encounterDatearray,
                  getPlace: "Hcc",
                  providerName: providerList,
                });
              }
            }
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

        var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

        dublicateSectionArr.map((res, index) => {
          capturedSectionsColorsMatching.push({
            name: res.name,
            diagnosisCode: res.diagnosisCode,
            colors: COLORS2[index],
          });
        });

        var sectionColorResult = sectionColorList;

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
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data.response;
      setSelectFileURL(response.data.response);
      setSelectFileURLValid(response.data.response);
      setIsLoading(false);
      setIsLoadingDos(false);
    }
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

  const findValueDocument = async (
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
    try {
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/pageNumber?header=${headerNames}&fileId=${fileId}&dos=${encounterDatesHeader}&stringFileWord=${splitPoint}`
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
  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const getPatientDetailsReload = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    dispatch(getPatientDetailsResult(patientId));
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
    actualDescription
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
              actualDescription
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

  const getFileDosPageNumber = async () => {
    var result = await getFilePageNumber(
      patientDetailsResult?.result?.response.fileId
    );
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
  };

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
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
        <span
          className={`mt-2 text-start ${visitStyles.provider_name}`}
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

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  return (
    <>
      <div className={`${visitStyles.comboContainer}`}>
        <div className={`row ${visitStyles.comboContainer2}`}>
          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>VALID CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label>Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label>Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label>Description</label>
                  </div>
                  <div className="col-xl-1">
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => addComboCode()}
                        className={visitStyles.combo_add_btn}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{
                            color: "#fff",
                            size: 12,
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {comboDiseaseCodesList?.length != 0 ? (
                <div className={visitStyles.container}>
                  <div className={visitStyles.hccStickey_head}>
                    {comboDiseaseCodesList?.map((item) => {
                      return (
                        <div className={visitStyles.combo_details_card}>
                          <div className="row">
                            <div className="col-xl-3 d-grid">
                              <span className="font-bold">
                                {item.diagnosisCodeCombo}
                              </span>
                            </div>
                            <div className="col-xl-3">
                              {item.addOnCodes?.map(
                                (addCombo, index) =>
                                  addCombo && (
                                    <span className="font-bold">
                                      <Tag color={addOnCodeColor[index]}>
                                        {addCombo}
                                      </Tag>
                                    </span>
                                  )
                              )}
                            </div>
                            <div className="col-xl-5">
                              <span>{item.diseaseName}</span>
                            </div>
                            <div className="col-xl-1">
                              <div>
                                <Popconfirm
                                  title="You want move to Invalid?"
                                  description={item.diseaseName}
                                  onConfirm={confirmComboInvalid}
                                  placement="leftTop"
                                  okText="Yes"
                                  cancelText="No"
                                  onOpenChange={() =>
                                    onchangeCombo(
                                      item.diseaseName,
                                      item.addOnCode
                                    )
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
                              {/* <Popconfirm
                                            title="You want to see the tree view?"
                                            description={item.diseaseName}
                                            onConfirm={() => {
                                              setOpens(true);
                                              
                                            }}
                                            placement="leftTop"
                                            okText="Yes"
                                            cancelText="No"
                                            onOpenChange={() => {
                                              setCombiTree(item);
                                            }}
                                          > */}
                              <div
                                className={visitStyles.close_icon}
                                style={{ background: "#c7f3c6" }}
                                onClick={() => {
                                  setOpens(true);
                                  setCombiTree([{ ...item, expanded: true }]);
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
                              {/* </Popconfirm> */}
                            </div>
                            <div className={styles.comboDetailsHeaders}>
                              <div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getProviderNameList(item?.providerName)}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getEncounterDateBackgroundHcc(
                                    item.encounterDateSplit,
                                    item.diagnosisCode,
                                    "COMBO"
                                  )}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getCaptureSectionBackground(
                                    item.capturedSections,
                                    "COMBO",
                                    item.encounterDate,
                                    item.diseaseName,
                                    null,
                                    item.diagnosisCode
                                  )}
                                </div>
                              </div>
                              {/* <div>
                                            <span
                                              className={styles.ruleTypeCol}
                                            >
                                              {underScoreRemove(item.ruleType)}
                                            </span>
                                          </div> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {comboDiseaseCodesList?.length == 0 ? (
                <div>
                  <span className="no-patient-data">No Combination Codes</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>DELETED COMBO CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label>Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label>Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label>Description</label>
                  </div>
                </div>
              </div>
              {invalidComboDiseaseCodesList?.length != 0 ? (
                <>
                  <div className={visitStyles.container}>
                    <div className={visitStyles.hccStickey_head}>
                      {invalidComboDiseaseCodesList?.map((item) => {
                        return (
                          <div className={visitStyles.combo_details_card}>
                            <div className="row">
                              <div className="col-xl-3">
                                <span className="font-bold">
                                  {item.diagnosisCodeCombo}
                                </span>
                              </div>
                              <div className="col-xl-3">
                                <span className="font-bold">
                                  {item.addOnCode}
                                </span>
                              </div>
                              <div className="col-xl-5">
                                <span>{item.diseaseName}</span>
                              </div>
                              <div className="col-xl-1 comboclose">
                                <Popconfirm
                                  title="You want move to Valid?"
                                  description={item.diseaseName}
                                  onConfirm={confirmComboValid}
                                  placement="leftTop"
                                  okText="Yes"
                                  cancelText="No"
                                  onOpenChange={() =>
                                    onchangeCombo(
                                      item.diseaseName,
                                      item.addOnCode
                                    )
                                  }
                                >
                                  <div className={visitStyles.tick_icon}>
                                    {SVGICON.tickIcon}
                                  </div>
                                </Popconfirm>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>{" "}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpenCaptureSection && (
        <Modal
          title={fileModalHeader}
          // title="Pdf Test"
          centered
          open={isModalOpenCaptureSection}
          style={{ top: 1 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="95%"
          footer={false}
          // height={500}
        >
          <div className="section-container">
            <div className="row">
              <div className="col-xl-5">
                <div
                  className={`my-post-content  ${visitStyles.comboContainer3}`}
                >
                  <div className={visitStyles.combo_head_card}>
                    <div className="row">
                      <div className="col-xl-3">
                        <label>Combo Codes</label>
                      </div>
                      <div className="col-xl-3">
                        <label>Additional Codes</label>
                      </div>
                      <div className="col-xl-5">
                        <label>Description</label>
                      </div>
                      <div className="col-xl-1"></div>
                    </div>
                  </div>
                  {comboDiseaseCodesList?.length != 0 ? (
                    <div className={visitStyles.container}>
                      <div className={visitStyles.hccStickey_head}>
                        {comboDiseaseCodesList?.map((item) => {
                          return (
                            <div className={visitStyles.combo_details_card}>
                              <div className="row">
                                <div className="col-xl-3 d-grid">
                                  <span className="font-bold">
                                    {item.diagnosisCodeCombo}
                                  </span>
                                </div>
                                <div className="col-xl-3">
                                  {item.addOnCodes?.map(
                                    (addCombo, index) =>
                                      addCombo && (
                                        <span className="font-bold">
                                          <Tag color={addOnCodeColor[index]}>
                                            {addCombo}
                                          </Tag>
                                        </span>
                                      )
                                  )}
                                </div>
                                <div className="col-xl-5">
                                  <span>{item.diseaseName}</span>
                                </div>
                                <div className="col-xl-1">
                                  <div>
                                    <Popconfirm
                                      title="You want move to Invalid?"
                                      description={item.diseaseName}
                                      onConfirm={confirmComboInvalid}
                                      placement="leftTop"
                                      okText="Yes"
                                      cancelText="No"
                                      onOpenChange={() =>
                                        onchangeCombo(
                                          item.diseaseName,
                                          item.addOnCode
                                        )
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
                                  {/* <Popconfirm
                                            title="You want to see the tree view?"
                                            description={item.diseaseName}
                                            onConfirm={() => {
                                              setOpens(true);
                                              
                                            }}
                                            placement="leftTop"
                                            okText="Yes"
                                            cancelText="No"
                                            onOpenChange={() => {
                                              setCombiTree(item);
                                            }}
                                          > */}
                                  <div
                                    className={visitStyles.close_icon}
                                    style={{ background: "#c7f3c6" }}
                                    onClick={() => {
                                      setOpens(true);
                                      setCombiTree([
                                        { ...item, expanded: true },
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
                                  {/* </Popconfirm> */}
                                </div>
                                <div className={styles.comboDetailsHeaders}>
                                  <div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getProviderNameList(item?.providerName)}
                                    </div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getEncounterDateBackgroundHcc(
                                        item.encounterDateSplit,
                                        item.diagnosisCode,
                                        "COMBO"
                                      )}
                                    </div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getCaptureSectionBackgroundFile(
                                        item?.capturedSections,
                                        item?.encounterDate,
                                        item?.diseaseName
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-xl-7">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                  <div
                    style={{
                      height: "80vh",
                      width: "900px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    {" "}
                    <Viewer
                      fileUrl={selectFileURL}
                      plugins={[defaultLayoutPluginInstance]}
                      initialPage={fileInitialPage}
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
      <Offcanvas
        onHide={handleCloseModal}
        show={isAddComboCode}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add Combo Code
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
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmitComboCode}
            >
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Combo Code <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="comboCode"
                    name="comboCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>Additional Code</Form.Label>
                  <Form.Control
                    type="text"
                    id="additionalCode"
                    name="additionalCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={handleChangeSuggested}
                    rows="5"
                    required
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
      </Offcanvas>
    </>
  );
};

export default Combo;
