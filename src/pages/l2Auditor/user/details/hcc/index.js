import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { InputText } from "primereact/inputtext";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import "react-vertical-timeline-component/style.min.css";
import { highlightPlugin } from "@react-pdf-viewer/highlight";

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
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { QuestionCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Select, Popover, Menu, DatePicker, Dropdown } from "antd";
import { IMAGES, SVGICON } from "../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Offcanvas } from "react-bootstrap";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import { Avatar, Tooltip } from "antd";
import Spinner from "../../../../../components/loadingSpinner";
import styles from "./styles.module.css";
import {
  getFilePageNumber,
  getMeatQueryList,
  submitMeatQuery,
  updateMeatQuery,
} from "../../../../../services/PatientsListSevice";
const { Option } = Select;

const Hcc = ({ patientHccResult }) => {
  const navigate = useRouter();
  let searchKeywords = [];

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

  const [rafHccList, setRafScoreHccList] = useState([]);
  const [isMatchBtn, setIsMatchBtn] = useState(false);
  const [matchHccList, setMatchHccList] = useState([]);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [newInValidDiseaseList, setInNewValidDiseaseList] = useState([]);
  const [unMatchResList, setNewUnMatchHccList] = useState([]);
  const [meatColorCodeList, setMeatColorCodeList] = useState([]);

  const [dbDescriptionRes, setDbDescriptionRes] = useState([]);

  const [openPopover, setOpenPopover] = useState(false);

  const [activeTab, setActiveTab] = useState(1);
  const [activeTabHead, setActiveTabHead] = useState("file");

  const [unmatchHccListRadiology, setUnMatchHccListRadiology] = useState([]);
  const [newValidDiseaseListRadiology, setNewValidDiseaseListRadiology] =
    useState([]);
  const [newInValidDiseaseListRadiology, setInNewValidDiseaseListRadiology] =
    useState([]);
  const [comboDiseaseCodesListRadiology, setComboDiseaseCodesListRadiology] =
    useState([]);
  const [meatCriteriaListRadiology, setMeatCriteriaListRadiology] = useState(
    []
  );
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
    diagnosisCodeQuery:""
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
  const [labResult, setLabResult] = useState("");
  const [labFileDosList, setLabFileDosList] = useState([]);
  const [labFileDosListDefaultSelect, setLabFileDosListDefaultSelect] =
    useState([]);
  const [saveBtnTitle, setSaveBtnTitle] = useState("Save");
  const [completedBtnTitle, setCompleteBtnTitle] = useState("Complete");
  const [declineBtnTitle, setDeclineBtnTitle] = useState("Decline");

  const [suggestRadiology, setSuggestRadiology] = useState([]);
  const [suggestLab, setSuggestLab] = useState([]);

  const [buttonClicked, setButtonClicked] = useState(false);
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [isValidAction, setIsValidAction] = useState("");
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [isModalComments, setIsModalComments] = useState(false);
  const [flagContainerActive, setFlagContainerActive] = useState("");
  const [flagContainerActiveTitle, setFlagContainerActiveTitle] = useState("");
  const [showIcons, setShowIcons] = useState(false);
  const [filter, setFilter] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [sideNavLabelActiveKey, setSideNavLabelActiveKey] = useState("HCC");
  const [isSideNavShow, setIsSideNavShow] = useState(false);
  const [timelineData, setTimeLineData] = useState([]);
  const [flagTagActive, setFlagTagActive] = useState(false);
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [patienIdDetails, setPatienIdDetails] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [notesList, setNotesList] = useState([]);
  const [flagResultList, setFlagResultList] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [actionItems2, setActionItems2] = useState([]);
  const [actionItems3, setActionItems3] = useState([]);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [commentsTrigger, setCommentsTrigger] = useState(false);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [flagFirstData, setFlagFirstData] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [filterDataLoading, setFilterDataLoading] = useState(true);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [totalElements, setTotalElements] = useState(10);

  const [labFileFilterList, setLabFileFilterList] = useState(10);
  const [radiologyFileDetailCheck, setRadiologyFileDetailCheck] =
    useState(false);
  const [dragFileDate, setdragFileDate] = useState(false);
  const [inputValueFileDate, setInputValueFileDate] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(0);
  const [sectionAllColor, setSectionAllColor] = useState([]);

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

  const handleAddButtonClick = () => {
    setIsAddButtonClicked(true);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "encodedDate") {
      setInputValueFileDate(e.target.value);
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
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
            (targetPage) => targetPage.pageIndex === fileInitialPage
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

    var userSpinner = (
      <div className={visitStyles.userDetailsCard}>
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

    var currentTime = moment().format("hh:mm");
    setCurrentTime(currentTime);

    setUserDetails(userSpinner);

    setvalidHccDetails(userSpinner);
  }, [fileInitialPage, findFileKeyword, fileModalTitle, fileDosPageNumber]);

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
    if (patientHccResult) {
      var result = patientHccResult;
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
          getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId);
          setSelectMeatFileId(patientHccResult.fileId);
          setPatientFileDTO(result.fileDetailDTO);
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
        validDiseaseNewRes = result.validDisease;
        // invalidDiseaseNewRes =validDisArray;
        var validDisArray = [];
        var validEncounterDateArray = [];
        validDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          validDisArray.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition,
            providerName: res.providerName,
          });
        });

        result?.invalidDisease?.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
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
            const encounterDatearray = res.encounterDate.split(",");
            deleteHccList.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              isManuallyAdded: res.isManuallyAdded,
              isHccValid: res.isHccValid,
              defaultPosition: res.defaultPosition,
              providerName: res.providerName,
            });
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
            const encounterDatearray = res.encounterDate.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Radio",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: res.providerName,
            });
          });

          if (result.suggestRadiologyCombo != null) {
            result.suggestRadiologyCombo.map((res, index) => {
              const encounterDatearray = res.encounterDate.split(",");
              suggestListAll.push({
                actualDescription: res.diseaseName,
                capturedSections: [],
                diagnosisCode: res.diagnosisCodeCombo,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Radio-combo",
                isHccValid: true,
                // defaultPosition:res.defaultPosition
              });
            });
          }
        }

        if (result.suggestLab != null) {
          // getLabReportDetails(orgId,tenId)
          suggestLabList = result.suggestLab;
          suggestLabList.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Lab",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
            });
          });
        }

        if (result.unMatchedDisease != null) {
          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(",");
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
                providerName: res.providerName,
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
                providerName: res.providerName,
              });
            }
          });
        }

        invalidDis = result.invalidDisease;
        comboDis = result.comboDisease;
        meatCri = result.meatCriteria;

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
        setComboDiseaseCodesList(comboDis);
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
        ];

        validDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              diagnosisCode: res.diagnosisCode,
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

        suggestListAll.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              diagnosisCode: res.diagnosisCode,
            });
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

        const response = await axios.get(
          ENDPOINTS.apiEndoint + `dbservice/section/color/getallsections`
        );

        var sectionColorResult = response.data.response;

        let sectionColorResultMatch = sectionColorResult.filter((o1) =>
          dublicateSectionArr.some((o2) => o1.sectionName === o2.name)
        );
        let sectionColorResultNotMatch = dublicateSectionArr.filter(
          (o1) => !sectionColorResult.some((o2) => o1.name === o2.sectionName)
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
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result.invalidDisease.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result.unMatchedDisease?.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });
        result.suggestRadiology?.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result.suggestLab?.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

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

        meatCri.map((res, index) => {
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

        meatCri.map((res, index) => {
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
            meatListArr.push({
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
          }
        });

        let sectionColorResultMatchMeat = sectionColorResult.filter((o1) =>
          meatHeaderList.some((o2) => o1.sectionName === o2.header)
        );
        let sectionColorResultNotMatchMeat = meatHeaderList.filter(
          (o1) => !sectionColorResult.some((o2) => o1.header === o2.sectionName)
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
  };

  const handleOpenModal = (value, disDescription, encounterDate) => {
    var splitPoint = disDescription.substring(" ", 20);
    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    setSelectMeatName(dotLoading);
    setIsLoadingSection(true);
    setIsModalOpen(true);
    setTimeout(() => {
      highlight({
        keyword: splitPoint,
        matchCase: true,
      });
      var dataset = value + " / (" + disDescription + ")";
      setSelectMeatName(dataset);
    }, 2000);
    setDocumentLoaded(true);
  };

  const getSectionPageNumber = async (header, encounterDate) => {
    var fileId = patientFileDTO.fileId;
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/pageNumber?header=${header}&fileId=${fileId}&dos=${encounterDate}`
    );

    var result = response.data;
    if (result?.length) {
      var pageNumber = result[0] - 1;
      setFileInitialPage(pageNumber);
    }
  };

  const findValueDocument = async (
    value,
    disDescription,
    headerNames,
    encounterDate,
    actualDescription
  ) => {
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/pageNumber?header=${headerNames}&fileId=${fileId}&dos=${encounterDatesHeader}`
    );
    var result = response.data.response;
    if (result?.length) {
      var pageNumber = result[0] - 1;
      setFileInitialPage(pageNumber);
      setFileDosPageNumber(pageNumber);
    }

    // getSectionPageNumber(headerNames, encounterDate);

    var splitPoint = disDescription.substring(" ", 40);
    setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
    setFindFileKeyword(actualDescription);
    // highlight({
    //   keyword: actualDescription,
    //   // matchCase: true,
    //   // wholeWords:true
    // });
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
    setDocumentLoaded(false);
    if (
      documentPlace == "Radio" ||
      whereCome == "Radio" ||
      whereCome == "Radio-combo"
    ) {
      handleOpenModalRadiology(value, disDescription, true);
    } else if (documentPlace == "Lab" || whereCome == "Lab") {
      var splitPoint = disDescription.substring(" ", 40);
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
      // setSelectMeatName(dataset);
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
        if (testModal == "Suggested") {
          setIsModalOpenCaptureSection(true);
        } else {
          setIsModalOpenValidCodes(true);
        }

        var fileId = patientFileDTO.fileId;
        const encounterDatesValue = encounterDate.split(",");
        const encounterDatesHeader = encounterDatesValue[0];
        const response = await axios.get(
          ENDPOINTS.apiEndoint +
            `dbservice/pageNumber?header=${headerNames}&fileId=${fileId}&dos=${encounterDatesHeader}`
        );
        var result = response.data.response;
        if (result?.length) {
          var pageNumber = result[0] - 1;
          setFileInitialPage(pageNumber);
        }
        setSelectActiveCode(value);
        var splitPoint = "";
        splitPoint = actualDescription.substring(" ", 40);
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
    if (radiologyCheck == true) {
      var splitPoint = disDescription.substring(" ", 40);
      setTimeout(() => {
        highlight({
          keyword: splitPoint,
          // matchCase: true,
          // wholeWords:true
        });
        var dataset = value + " - (" + disDescription + ")";
        setSelectMeatName(dataset);
      }, 2000);
      setDocumentLoaded(true);
      var dataset = value + " - (" + disDescription + ")";
      // setSelectMeatName(dataset);
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
      ENDPOINTS.apiEndoint + `dbservice/hccdisease?diagnosisCode=${code}`
    );
    if (response.data) {
      result = response.data.response;
      data = (
        <div className="validhcc-details">
          {/* <Spin className='ml-2 ms-1' size="small" /> */}
          {/* <div>{value}</div> */}
          <div>
            cmsHcc_V22_for_2023_payment_year :{" "}
            {result.cmsHcc_Model_Category_V22_for_2023_payment_year}
          </div>
          <div>
            cmsHcc_V24_for_2023_payment_year :{" "}
            {result.cmsHcc_Model_Category_V24_for_2023_payment_year}
          </div>
          <div>cmsHcc_V22 : {result.cmsHcc_model_category_V22}</div>
          <div>cmsHcc_V24 : {result.cmsHcc_model_category_V24}</div>
          <div>
            rxHcc_V05_for_2023_payment_year :{" "}
            {result.rxHcc_Model_Category_V05_for_2023_payment_year}
          </div>
          <div>
            rxHcc_V08_for_2023_payment_year :{" "}
            {result.rxHcc_model_category_V08_for_2023_payment_year}
          </div>
          <div>rxHcc_V05 : {result.rxHcc_model_category_V05}</div>
          <div>rxHcc_V08 : {result.rxHcc_model_category_V08}</div>
        </div>
      );
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
        let convertDate = moment(inputValue.encodedDate).format("MM-DD-YYYY");

        var dataFormatSuggested = {
          patientComputeDetailId: localPatientId,
          year: dos,
          diseaseFormats: [
            {
              diagnosisCode: inputValue.diagnosisCode,
              actualDescription: inputValue.actualDescription,
              encounterDate: convertDate,
              capturedSections: [inputValue.capturedSections],
            },
          ],
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
    }

    setValidated(true);
  };

  const getPatientDetailsReload = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
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
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
      var result = response.data.response;
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
          getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId);
          setSelectMeatFileId(patientHccResult.fileId);
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
        validDiseaseNewRes = result.validDisease;
        // invalidDiseaseNewRes =validDisArray;
        var validDisArray = [];
        var validEncounterDateArray = [];
        validDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          validDisArray.push({
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

        result.invalidDisease.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
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
            const encounterDatearray = res.encounterDate.split(",");
            deleteHccList.push({
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
        }
        if (result.suggestRadiology != null) {
          // var checkDosRadio = [];
          // for (var key in result.suggestRadiology) {
          //   checkDosRadio.push({ value: key, label: key });
          // }
          // getPatientDetailsRadiologyYear(orgId,tenId)
          suggestRadiologyList = result.suggestRadiology;
          suggestRadiologyList.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Radio",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
            });
          });

          if (result.suggestRadiologyCombo != null) {
            result.suggestRadiologyCombo.map((res, index) => {
              const encounterDatearray = res.encounterDate.split(",");
              suggestListAll.push({
                actualDescription: res.diseaseName,
                capturedSections: [],
                diagnosisCode: res.diagnosisCodeCombo,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Radio-combo",
                isHccValid: true,
                // defaultPosition:res.defaultPosition
              });
            });
          }
        }

        if (result.suggestLab != null) {
          // getLabReportDetails(orgId,tenId)
          suggestLabList = result.suggestLab;
          suggestLabList.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Lab",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
            });
          });
        }

        if (result.unMatchedDisease != null) {
          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(",");
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
              });
            } else {
              suggestListAllNonHcc.push({
                actualDescription: res.actualDescription,
                diagnosisCodeFinding: res.diagnosisCode,
                isHccValid: res.isHccValid,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCode,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Hcc",
              });
            }
          });
        }

        invalidDis = result.invalidDisease;
        comboDis = result.comboDisease;
        meatCri = result.meatCriteria;

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
        setComboDiseaseCodesList(comboDis);
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
        ];

        validDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              diagnosisCode: res.diagnosisCode,
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

        suggestListAll.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              diagnosisCode: res.diagnosisCode,
            });
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
        // setCaptureSectionMatching(capturedSectionsColorsMatching);

        var encounterDateColorsMatching = [];
        var encounterDateArr = [];

        validDiseaseNewRes.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result.invalidDisease.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result.unMatchedDisease?.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });
        result.suggestRadiology?.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result.suggestLab?.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

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

        meatCri.map((res, index) => {
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

          dublicateRemoveSecondArr = getUniqueListBy(
            allMeatHeadColor,
            "header"
          );
          setMeatColorCodeList(dublicateRemoveSecondArr);
        });

        meatCri.map((res, index) => {
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
            meatListArr.push({
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
          }
        });
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

  const addValidCodeFile = async (event) => {
    setIsFileFormShow(true);
    setValidated(false);
  };

  function removeDuplicates(array) {
    let output = [];
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
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
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader} ${backColor}`}
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
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDateBackground = (value) => {
    return value.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = (
        // (<Badge
        // className={`mt-2 text-start cr-pointer ${visitStyles.captureheader} ${backColor}`}>
        // {res}</Badge>)

        <span
          className={`mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
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

  const getCaptureSectionBackgroundMeat = (value, dis, encounterDate) => {
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
          onClick={() => handleOpenModal(value, dis, encounterDate)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheaderMeat}`}
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
    { value: "CT Chest", label: "CT Chest" },
    { value: "CT abdomen", label: "CT abdomen" },
    { value: "Chest Xray", label: "Chest Xray" },
    { value: "CT Cervix", label: "CT Cervix" },
  ];
  const dosListMeat = [
    { value: "08/01/2023", label: "08/01/2023" },
    { value: "24/06/2023", label: "24/06/2023" },
  ];

  const handleSubmitMeatQuery = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
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
      } else {
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
    setSelectPreviousCode(null);
    setFlagTagActive(false);
    setIsDosSelect(false);
    setFindFileKeyword(null);
    setFileInitialPage(0);
    setFileDosPageNumber(0);
    switch (number) {
      case 1:
        setFlagTagActive(true);
        setIsDosSelect(false);
        break;
      case 5:
        getFileDosPageNumber();
        setIsDosSelect(true);
        break;
      case 6:
        var result = await getMeatQueryList(selectedDosValue, localPatientId);
        setMeatQueryList(result.response);
        break;
      default:
        null;
    }
  };

  const getFileDosPageNumber = async () => {
    var result = await getFilePageNumber(patientHccResult.fileId);
    var groupPageNumber = [];
    for (var key in result?.response) {
      var opationArray = [];
      var pageNumbervalue = result.response[key];
      for (var key2 in pageNumbervalue) {
        opationArray.push({
          label: key2 + " page - " + pageNumbervalue[key2],
          value: pageNumbervalue[key2],
        });
      }
      groupPageNumber.push({
        label: moment(key).format("MM-DD-YYYY"),
        options: opationArray,
      });
    }
    setPageNumberOptions(groupPageNumber);
  };

  const handleChangePageNumber = async (value) => {
    setFindFileKeyword(null);
    var pageIndex = value - 1;
    setFileDosPageNumber(pageIndex);
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

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1 ">
            <Tab.Container defaultActiveKey={activeTabHead}>
              <div className="row">
                <div className="col-xl-8">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="file"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(5)}
                      >
                        File
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="validDiseases"
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(1)}
                      >
                        Visit Data
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="comboDiseases"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(2)}
                      >
                        Combination Codes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="meatCriteria"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(3)}
                      >
                        MEAT Criteria
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="RafScore"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(4)}
                      >
                        RAF Score
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="query"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(6)}
                      >
                        Query
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
                {flagTagActive == true ? (
                  <div className="col-xl-4">
                    <div className={visitStyles.flags}>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.hccFlag}></span>
                        <span className={visitStyles.flagCodes}>HCC</span>
                      </div>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.suggestedFlag}></span>
                        <span className={visitStyles.flagCodes}>SUGGESTED</span>
                      </div>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.deleteFlag}></span>
                        <span className={visitStyles.flagCodes}>DELETED</span>
                      </div>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.nonhccFlag}></span>
                        <span className={visitStyles.flagCodes}>NON HCC</span>
                      </div>
                    </div>
                  </div>
                ) : null}
                {isDosSelect == true ? (
                  <div className="col-xl-3">
                    <Select
                      className={`ant_select_form`}
                      onChange={handleChangePageNumber}
                      options={pageNumberOptions}
                      placeholder="Dos Page Number"
                    />
                  </div>
                ) : null}
              </div>

              <Tab.Content>
                <Tab.Pane id="my-posts" eventKey="validDiseases">
                  <div className="my-post-content pt-3">
                    <div className="widget-media   ps--active-y">
                      <div className="row">
                        <div className="col-xl-4">
                          <ul className="timeline">
                            <div
                              className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                            >
                              <span className={`${visitStyles.hcc_title_name}`}>
                                HCC
                                <FontAwesomeIcon
                                  onClick={() => addValidDiseases()}
                                  icon={faPlus}
                                />
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.hcc_title_badge}`}
                                >
                                  {newValidDiseaseList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              <div className={visitStyles.hccStickey_head}>
                                {newValidDiseaseList.map((data, i) => (
                                  <li>
                                    <div
                                      className={`hccActiveCard ${visitStyles.hcc_card}`}
                                    >
                                      <div
                                        className={`${visitStyles.hcc_card_nameHead}`}
                                      >
                                        <div className="media-body">
                                          <span className="mb-1 disease-name d-flex">
                                            <span className="valid-dis-name">
                                              {data.diagnosisCode}
                                            </span>{" "}
                                            <Popover
                                              content={data.actualDescription}
                                              title=""
                                              trigger="hover"
                                            >
                                              - {data.actualDescription}
                                            </Popover>
                                          </span>
                                        </div>

                                        {data.defaultPosition ==
                                        "VALID" ? null : data.defaultPosition ==
                                          "INVALID" ? (
                                          <span
                                            className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "SUGGESTED" ? (
                                          <span
                                            className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "DELETED" ? (
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
                                          content={validHccDetails}
                                          title={data.diagnosisCode}
                                          placement="bottom"
                                          trigger="click"
                                        >
                                          <Tooltip
                                            title="HCC Veriosn Details"
                                            placement="bottom"
                                          >
                                            <i className="cr-pointer">
                                              {SVGICON.infoIcon}
                                            </i>
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
                                          onConfirm={confirmvalid}
                                          placement="leftTop"
                                          onOpenChange={() =>
                                            onchangeValid(
                                              data.diagnosisCode,
                                              data
                                            )
                                          }
                                        >
                                          <div
                                            className={visitStyles.close_icon}
                                          >
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
                                      </div>
                                      <div
                                        className={`${visitStyles.hoverActiveHcc}`}
                                      >
                                        <div
                                          className={`${visitStyles.encounterAndSectionHeader}`}
                                        >
                                          {data.providerName ? (
                                            <Badge
                                              className={`mt-2 text-start ${visitStyles.provider_name}`}
                                            >
                                              <i>{SVGICON.patientNameIcon}</i>
                                              {data.providerName}
                                            </Badge>
                                          ) : null}
                                          {getEncounterDateBackground(
                                            data.encounterDateSplit
                                          )}
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
                                        <div
                                          className={`${visitStyles.encounterAndSectionHeader}`}
                                        >
                                          {getCaptureSectionBackground(
                                            data.capturedSections,
                                            null,
                                            data.encounterDate,
                                            data.actualDescription,
                                            null,
                                            data.diagnosisCode
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
                        <div className="col-xl-4">
                          <ul className="timeline">
                            <div
                              className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                            >
                              <span
                                className={`${visitStyles.suggested_title_name}`}
                              >
                                SUGGESTED CODES
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.suggested_title_badge}`}
                                >
                                  {suggestedHccList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.suggestedcontainer}>
                              <div className={visitStyles.hccStickey_head}>
                                {suggestedHccList?.map((data) => {
                                  return (
                                    <>
                                      {data.isHccValid == true ? (
                                        <li>
                                          <div
                                            className={`hccActiveCard ${visitStyles.hcc_card}`}
                                          >
                                            <div
                                              className={`${visitStyles.hcc_card_nameHead}`}
                                            >
                                              <div className="media-body">
                                                <span className="mb-1 disease-name d-flex">
                                                  <span className="valid-dis-name">
                                                    {data.diagnosisCode}
                                                  </span>{" "}
                                                  <Popover
                                                    content={
                                                      data.actualDescription
                                                    }
                                                    title=""
                                                    trigger="hover"
                                                  >
                                                    - {data.actualDescription}
                                                  </Popover>
                                                </span>
                                              </div>
                                              {data.defaultPosition ==
                                              "VALID" ? (
                                                <span
                                                  className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}
                                                ></span>
                                              ) : data.defaultPosition ==
                                                "INVALID" ? (
                                                <span
                                                  className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                                                ></span>
                                              ) : data.defaultPosition ==
                                                "SUGGESTED" ? (
                                                <span
                                                  className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                                                ></span>
                                              ) : data.defaultPosition ==
                                                "DELETED" ? (
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
                                                content={validHccDetails}
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
                                                  description={
                                                    data.diagnosisCode
                                                  }
                                                  onConfirm={suggestedToDeleted}
                                                  placement="leftTop"
                                                  onOpenChange={() =>
                                                    onchangeValid(
                                                      data.diagnosisCode,
                                                      data
                                                    )
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      visitStyles.close_icon
                                                    }
                                                  >
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
                                                  description={
                                                    data.diagnosisCode
                                                  }
                                                  onConfirm={suggestedToDeleted}
                                                  placement="leftTop"
                                                  onOpenChange={() =>
                                                    onchangeValid(
                                                      data.diagnosisCode,
                                                      data
                                                    )
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      visitStyles.close_icon
                                                    }
                                                  >
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
                                            </div>
                                            <div
                                              className={`${visitStyles.hoverActiveHcc}`}
                                            >
                                              <div className="">
                                                <div
                                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                                >
                                                  {data.providerName ? (
                                                    <Badge
                                                      className={`mt-2 text-start ${visitStyles.provider_name}`}
                                                    >
                                                      <i>
                                                        {
                                                          SVGICON.patientNameIcon
                                                        }
                                                      </i>
                                                      {data.providerName}
                                                    </Badge>
                                                  ) : null}
                                                  {getEncounterDateBackground(
                                                    data.encounterDateSplit
                                                  )}
                                                </div>
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
                                                ) : data.getPlace ==
                                                  "Radio-combo" ? (
                                                  <Tooltip title="RADIOLOGY COMBO CODES">
                                                    <span
                                                      className={` mt-2 ${visitStyles.radiologyStatus}`}
                                                      bg={`  mt-2 bg-bg-eight `}
                                                    >
                                                      Radiology - Combo Codes
                                                    </span>
                                                  </Tooltip>
                                                ) : null}
                                              </div>
                                              <div
                                                className={`${visitStyles.encounterAndSectionHeader}`}
                                              >
                                                {getCaptureSectionBackground(
                                                  data.capturedSections,
                                                  data.getPlace,
                                                  data.encounterDate,
                                                  data.actualDescription,
                                                  "Suggested",
                                                  data.diagnosisCode
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                      ) : null}
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          </ul>
                        </div>

                        <div className="col-xl-4">
                          <ul className="timeline">
                            <div
                              className={`valid-text d-flex justify-content-sm-between ${visitStyles.deleted_title_card}`}
                            >
                              <span
                                className={`${visitStyles.deleted_title_name}`}
                              >
                                DELETED CODES
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.deleted_title_badge}`}
                                >
                                  {deletedHccList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              <div className={visitStyles.hccStickey_head}>
                                {deletedHccList.map((data, i) => (
                                  <li>
                                    <div
                                      className={`hccActiveCard ${visitStyles.hcc_card}`}
                                    >
                                      <div
                                        className={`${visitStyles.hcc_card_nameHead}`}
                                      >
                                        <div className="media-body">
                                          <span className="mb-1 disease-name d-flex">
                                            <span className="valid-dis-name">
                                              {data.diagnosisCode}
                                            </span>{" "}
                                            <Popover
                                              content={data.actualDescription}
                                              title=""
                                              trigger="hover"
                                            >
                                              - {data.actualDescription}
                                            </Popover>
                                          </span>
                                        </div>
                                        {data.defaultPosition == "VALID" ? (
                                          <span
                                            className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "INVALID" ? (
                                          <span
                                            className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "SUGGESTED" ? (
                                          <span
                                            className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "DELETED" ? (
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
                                            title="HCC Veriosn Details"
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
                                          onConfirm={deletedToSuggested}
                                          placement="leftTop"
                                          onOpenChange={() =>
                                            onchangeValid(
                                              data.diagnosisCode,
                                              data
                                            )
                                          }
                                        >
                                          <div
                                            className={visitStyles.close_icon}
                                          >
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
                                      <div
                                        className={`${visitStyles.hoverActiveHcc}`}
                                      >
                                        <div className="">
                                          <div
                                            className={`${visitStyles.encounterAndSectionHeader}`}
                                          >
                                            {data.providerName ? (
                                              <Badge
                                                className={`mt-2 text-start ${visitStyles.provider_name}`}
                                              >
                                                <i>{SVGICON.patientNameIcon}</i>
                                                {data.providerName}
                                              </Badge>
                                            ) : null}
                                            {getEncounterDateBackground(
                                              data.encounterDateSplit
                                            )}
                                          </div>
                                        </div>
                                        <div
                                          className={`${visitStyles.encounterAndSectionHeader}`}
                                        >
                                          {getCaptureSectionBackground(
                                            data.capturedSections,
                                            null,
                                            data.encounterDate,
                                            data.actualDescription,
                                            "Suggested",
                                            data.diagnosisCode
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
                    </div>
                  </div>
                </Tab.Pane>

                <Tab.Pane id="my-posts" eventKey="comboDiseases">
                  <div className={`${visitStyles.comboContainer}`}>
                    <div className={`row ${visitStyles.comboContainer2}`}>
                      <div className="col-xl-6">
                        <div className={`${visitStyles.comboTitle}`}>
                          <span>VALID CODES </span>
                        </div>
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
                              <div className="col-xl-1">
                                <div className="d-flex justify-content-center">
                                  <button
                                    onClick={() => addValidDiseases()}
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
                                    <div
                                      className={visitStyles.combo_details_card}
                                    >
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
                                        <div
                                          className="col-xl-5 cr-pointer"
                                          onClick={() =>
                                            handleOpenModalCombinationCode(
                                              item.diagnosisCodeCombo,
                                              item.diseaseName
                                            )
                                          }
                                        >
                                          <span>{item.diseaseName}</span>
                                        </div>
                                        <div className="col-xl-1 comboclose">
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
                                            <div
                                              className={visitStyles.close_icon}
                                            >
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
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}

                          {comboDiseaseCodesList?.length == 0 ? (
                            <div>
                              <span className="no-patient-data">
                                No Combination Codes
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-xl-6">
                        <div className={`${visitStyles.comboTitle}`}>
                          <span>DELETED COMBO CODES </span>
                        </div>
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
                            </div>
                          </div>
                          {invalidComboDiseaseCodesList?.length != 0 ? (
                            <>
                              <div className={visitStyles.container}>
                                <div className={visitStyles.hccStickey_head}>
                                  {invalidComboDiseaseCodesList?.map((item) => {
                                    return (
                                      <div
                                        className={
                                          visitStyles.combo_details_card
                                        }
                                      >
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
                                          <div
                                            className="col-xl-5 cr-pointer"
                                            onClick={() =>
                                              handleOpenModalCombinationCode(
                                                item.diagnosisCodeCombo,
                                                item.diseaseName
                                              )
                                            }
                                          >
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
                                              <div
                                                className={
                                                  visitStyles.tick_icon
                                                }
                                              >
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
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="meatCriteria">
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
                          <label>Monitor</label>
                        </div>
                        <div className="col-xl-2">
                          <label>Evaluation</label>
                        </div>
                        <div className="col-xl-2">
                          <label>Assessment</label>
                        </div>
                        <div className="col-xl-2">
                          <label>Treatment</label>
                        </div>
                        <div className="col-xl-1">
                          <label></label>
                        </div>
                      </div>
                    </div>
                    {meatCriteriaList.length != 0 ? (
                      <div className={visitStyles.container}>
                        <div className={visitStyles.hccStickey_head}>
                          {meatCriteriaList?.map((item) => {
                            return (
                              <div
                                className={
                                  item.isMeatCriteriaPresent === true
                                    ? `${visitStyles.meat_details_card}`
                                    : `${visitStyles.meat_details_card_false}`
                                }
                              >
                                <div className="row">
                                  {/* <div className="col-xl-1">
                                                  <span className="font-bold">{item.diagnosisCode}</span>
                                                </div> */}
                                  <div className="col-xl-1 d-grid">
                                    <span className="font-bold meat-name-details">
                                      {item.diagnosisCode}
                                    </span>
                                    {item.category == "Valid" ? (
                                      <Badge
                                        className="valid-meat badge-circle mt-2"
                                        bg={` badge-circle mt-2 bg-validmeat`}
                                      >
                                        {item.category}
                                      </Badge>
                                    ) : (
                                      <Badge
                                        className="valid-meat badge-circle mt-2"
                                        bg={` badge-circle mt-2 bg-validUnmatch`}
                                      >
                                        {item.category}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="col-xl-2">
                                    <Popover
                                      placement="topLeft"
                                      title="Description"
                                      content={item.diseaseName}
                                    >
                                      <span className="meat-name-details">
                                        {item.diseaseName}
                                      </span>
                                    </Popover>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    {item.monitor != "" ? (
                                      <Popover
                                        placement="topLeft"
                                        title="Monitor"
                                        content={item.monitor}
                                      >
                                        <span className="meat-name-details">
                                          {item.monitor}
                                        </span>
                                      </Popover>
                                    ) : (
                                      <span className="meat-name-details text-center font-bold">
                                        -
                                      </span>
                                    )}
                                    <div>
                                      {getCaptureSectionBackgroundMeat(
                                        item.monitorCapturedFromHeader,
                                        item.monitor,
                                        item.encounterDate
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    {item.evaluate != "" ? (
                                      <Popover
                                        placement="topLeft"
                                        title="Evaluation"
                                        content={item.evaluate}
                                      >
                                        <span className="meat-name-details">
                                          {item.evaluate}
                                        </span>
                                      </Popover>
                                    ) : (
                                      <span className="meat-name-details text-center font-bold">
                                        -
                                      </span>
                                    )}
                                    <div>
                                      {getCaptureSectionBackgroundMeat(
                                        item.evaluateCapturedFromHeader,
                                        item.evaluate,
                                        item.encounterDate
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    {item.assessment != "" ? (
                                      <Popover
                                        placement="topLeft"
                                        title="Assessment"
                                        content={item.assessment}
                                      >
                                        <span className="meat-name-details">
                                          {item.assessment}
                                        </span>
                                      </Popover>
                                    ) : (
                                      <span className="meat-name-details text-center font-bold">
                                        -
                                      </span>
                                    )}

                                    <div>
                                      {getCaptureSectionBackgroundMeat(
                                        item.assessmentCapturedFromHeader,
                                        item.assessment,
                                        item.encounterDate
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    {item.treatment != "" ? (
                                      <Popover
                                        placement="topLeft"
                                        title="Treatment"
                                        content={item.treatment}
                                      >
                                        <span className="meat-name-details">
                                          {item.treatment}
                                        </span>
                                      </Popover>
                                    ) : (
                                      <span className="meat-name-details text-center font-bold">
                                        -
                                      </span>
                                    )}
                                    <div>
                                      {getCaptureSectionBackgroundMeat(
                                        item.treatmentCapturedFromHeader,
                                        item.treatment,
                                        item.encounterDate
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-xl-1 meatclose">
                                    <Popconfirm
                                      title="You want move to Invalid?"
                                      description={item.diseaseName}
                                      onConfirm={confirmInvalidMeat}
                                      placement="leftTop"
                                      okText="Yes"
                                      cancelText="No"
                                      onOpenChange={() =>
                                        onchangeMeat(
                                          item.diseaseName,
                                          item.diagnosisCode
                                        )
                                      }
                                    >
                                      <div className={visitStyles.close_icon}>
                                        <FontAwesomeIcon
                                          icon={faArrowsAlt}
                                          style={{ size: 8, color: "#a80404" }}
                                        />
                                      </div>
                                    </Popconfirm>
                                    {item.isMeatCriteriaPresent === false ? (
                                      <div
                                        onClick={() =>
                                          addMeatQuery(item, "Add")
                                        }
                                        className={visitStyles.add_meat_query}
                                      >
                                        {SVGICON.meatQueryIcon}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {meatCriteriaList.length == 0 ? (
                            <div className="card combo-card">
                              <div className="col-xl-12">
                                <div>
                                  <span className="no-patient-data">
                                    NO DATA
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          {invalidMeatCriteriaList.length != 0 ? (
                            <>
                              <div className="invalid-combo">
                                <span>Invalid MeatCriteria</span>
                              </div>

                              {invalidMeatCriteriaList?.map((item) => {
                                return (
                                  <div
                                    className={visitStyles.meat_details_card}
                                  >
                                    <div className="row">
                                      <div className="col-xl-1">
                                        <span className="font-bold">
                                          {item.diagnosisCode}
                                        </span>
                                      </div>
                                      <div className="col-xl-2">
                                        <Popover
                                          placement="topLeft"
                                          title="Description"
                                          content={item.diseaseName}
                                        >
                                          <span className="meat-name-details">
                                            {item.diseaseName}
                                          </span>
                                        </Popover>
                                      </div>
                                      <div className="col-xl-2 d-grid">
                                        <Popover
                                          placement="topLeft"
                                          title="Monitor"
                                          content={item.monitor}
                                        >
                                          <span className="meat-name-details">
                                            {item.monitor}
                                          </span>
                                        </Popover>
                                        <div>
                                          {getCaptureSectionBackgroundMeat(
                                            item.monitorCapturedFromHeader,
                                            item.monitor,
                                            item.encounterDate
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-xl-2 d-grid">
                                        <Popover
                                          placement="topLeft"
                                          title="Evaluation"
                                          content={item.evaluate}
                                        >
                                          <span className="meat-name-details">
                                            {item.evaluate}
                                          </span>
                                        </Popover>
                                        <div>
                                          {getCaptureSectionBackgroundMeat(
                                            item.evaluateCapturedFromHeader,
                                            item.evaluate,
                                            item.encounterDate
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-xl-2 d-grid">
                                        <Popover
                                          placement="topLeft"
                                          title="Assessment"
                                          content={item.assessment}
                                        >
                                          <span className="meat-name-details">
                                            {item.assessment}
                                          </span>
                                        </Popover>
                                        <div>
                                          {getCaptureSectionBackgroundMeat(
                                            item.assessmentCapturedFromHeader,
                                            item.assessment,
                                            item.encounterDate
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-xl-2 d-grid">
                                        <Popover
                                          placement="topLeft"
                                          title="Treatment"
                                          content={item.treatment}
                                        >
                                          <span className="meat-name-details">
                                            {item.treatment}
                                          </span>
                                        </Popover>

                                        <div>
                                          {getCaptureSectionBackgroundMeat(
                                            item.treatmentCapturedFromHeader,
                                            item.treatment,
                                            item.encounterDate
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-xl-1 meatclose">
                                        <Popconfirm
                                          title="You want move to Valid?"
                                          description={item.diseaseName}
                                          onConfirm={confirmValidMeat}
                                          placement="leftTop"
                                          okText="Yes"
                                          cancelText="No"
                                          onOpenChange={() =>
                                            onchangeMeat(
                                              item.diseaseName,
                                              item.diagnosisCode
                                            )
                                          }
                                        >
                                          <div
                                            className={visitStyles.close_icon}
                                          >
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
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="RafScore">
                  <div className="my-post-content pt-3">
                    <div className={`${visitStyles.rafContainer}`}>
                      <div className={visitStyles.hccStickeyRaf_head}>
                        <div className={`row ${visitStyles.rafContainer2}`}>
                          {rafScore != null ? (
                            <>
                              <div className="col-xl-9">
                                {rafScore.scoreOutputDTOList != null ? (
                                  <>
                                    {rafScore.scoreOutputDTOList.map(
                                      (rafScoreMapResult, index) => {
                                        return (
                                          <>
                                            {index == 0 ? (
                                              <label
                                                className={`${visitStyles.labelStyle} ${visitStyles.raflablehead2}`}
                                              >
                                                {
                                                  rafScoreMapResult.hcc_model
                                                    .version
                                                }
                                              </label>
                                            ) : (
                                              <label
                                                className={`${visitStyles.labelStyle} ${visitStyles.raflablehead1}`}
                                              >
                                                {
                                                  rafScoreMapResult.hcc_model
                                                    .version
                                                }
                                              </label>
                                            )}

                                            <div className="row raf-main-card">
                                              <div className="col-xl-4">
                                                <div className="raf-card">
                                                  <div className="row raf-head">
                                                    <div className="col-xl-6">
                                                      <label
                                                        className={`${visitStyles.labelStyle}`}
                                                      >
                                                        DX Code
                                                      </label>
                                                    </div>
                                                    <div className="col-xl-6">
                                                      <label
                                                        className={`${visitStyles.labelStyle}`}
                                                      >
                                                        DX Description
                                                      </label>
                                                    </div>
                                                  </div>

                                                  {rafScoreMapResult.dx_hccs.map(
                                                    (item) => {
                                                      return (
                                                        <div className="row raf-details">
                                                          <div className="col-xl-6">
                                                            <span>
                                                              {item.dx_name}
                                                            </span>
                                                          </div>
                                                          <div className="col-xl-6">
                                                            <span>
                                                              {item.dx_desc}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                              <div className="col-xl-4">
                                                <div className="raf-card">
                                                  <div className="row raf-head">
                                                    <div className="col-xl-6">
                                                      <label
                                                        className={`${visitStyles.labelStyle}`}
                                                      >
                                                        HCC
                                                      </label>
                                                    </div>
                                                    <div className="col-xl-6">
                                                      <label
                                                        className={`${visitStyles.labelStyle}`}
                                                      >
                                                        HCC Description
                                                      </label>
                                                    </div>
                                                  </div>
                                                  {rafScoreMapResult.dx_hccs.map(
                                                    (res) => {
                                                      return res.hcc_list.map(
                                                        (res1) => {
                                                          return (
                                                            <div className="row raf-details">
                                                              <div className="col-xl-6">
                                                                <span>
                                                                  {
                                                                    res1.hcc_name
                                                                  }
                                                                </span>
                                                              </div>
                                                              <div className="col-xl-6">
                                                                <span>
                                                                  {
                                                                    res1.hcc_desc
                                                                  }
                                                                </span>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                              <div className="col-xl-4">
                                                <div className="raf-card">
                                                  <div className="row raf-head">
                                                    {/* <div className="col-xl-4">
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              Trumped By
                                                                            </label>
                                                                          </div> */}
                                                    <div className="col-xl-6">
                                                      <label
                                                        className={`${visitStyles.labelStyle}`}
                                                      >
                                                        RAF
                                                      </label>
                                                    </div>
                                                    <div className="col-xl-6">
                                                      <label
                                                        className={`${visitStyles.labelStyle}`}
                                                      >
                                                        Monthly Premium
                                                      </label>
                                                    </div>
                                                  </div>
                                                  {rafScoreMapResult.dx_hccs.map(
                                                    (res) => {
                                                      return res.hcc_list.map(
                                                        (res1) => {
                                                          return (
                                                            <div className="row  raf-details">
                                                              {/* <div className="col-xl-4">
                                                                                      <span>
                                                                                        -
                                                                                      </span>
                                                                                    </div> */}
                                                              <div className="col-xl-6">
                                                                <span>
                                                                  {res1.hcc_raf}
                                                                </span>
                                                              </div>
                                                              <div className="col-xl-6">
                                                                <span>
                                                                  $
                                                                  {res1.premium}
                                                                </span>
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        );
                                      }
                                    )}
                                  </>
                                ) : null}
                              </div>
                              <div className="col-xl-3">
                                <label
                                  className={`${visitStyles.labelStyle} ${visitStyles.raflableheadOverall}`}
                                >
                                  Overall score
                                </label>
                                <div
                                  className={`row raf-main-card ${visitStyles.overallScoreContainer}`}
                                >
                                  <div className="raf-card ">
                                    <div className="row raf-head">
                                      <div className="col-xl-4">
                                        <label
                                          className={`${visitStyles.labelStyle}`}
                                        >
                                          V24 score
                                        </label>
                                      </div>
                                      <div className="col-xl-4">
                                        <label
                                          className={`${visitStyles.labelStyle}`}
                                        >
                                          v24Score(70%)
                                        </label>
                                      </div>
                                    </div>

                                    <div className="row  raf-details">
                                      <div className="col-xl-4">
                                        <span>{rafScore.v24Score}</span>
                                      </div>
                                      <div className="col-xl-4">
                                        {rafScore.v24Score70Percent != null ? (
                                          <span>
                                            {rafScore.v24Score70Percent.toFixed(
                                              3
                                            )}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="raf-card">
                                    <div className="row raf-head">
                                      <div className="col-xl-4">
                                        <label
                                          className={`${visitStyles.labelStyle}`}
                                        >
                                          V28 score
                                        </label>
                                      </div>
                                      <div className="col-xl-4">
                                        <label
                                          className={`${visitStyles.labelStyle}`}
                                        >
                                          v28Score(30%)
                                        </label>
                                      </div>
                                    </div>

                                    <div className="row  raf-details">
                                      <div className="col-xl-4 ">
                                        <span>{rafScore.v28Score}</span>
                                      </div>
                                      <div className="col-xl-4">
                                        {rafScore.v28Score30Percent != null ? (
                                          <span>
                                            {rafScore.v28Score30Percent.toFixed(
                                              3
                                            )}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="raf-card">
                                    <div className=" col raf-head">
                                      <div className="col-xl-12">
                                        <label
                                          className={`${visitStyles.labelStyle}`}
                                        >
                                          Overall score
                                        </label>
                                      </div>
                                    </div>

                                    <div className="row  raf-details">
                                      {rafScore.score != null ? (
                                        <span>{rafScore.score.toFixed(3)}</span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {rafScore == null ? (
                            // <div className="card box-shadow-none">
                            //   <div className="card combo-card">
                            <div className="col-xl-12">
                              <span className="no-patient-data">
                                No RAF Score
                              </span>
                            </div>
                          ) : //   </div>
                          // </div>
                          null}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="file">
                  <div className="my-post-content pt-3 row">
                    {!isFileFormShow ? (
                      <div className="col-xl-2">
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
                              <span
                                className={`${visitStyles.hcc_title_badge}`}
                              >
                                {newValidDiseaseList.length}
                              </span>
                            </div>
                          </div>
                          <div className={visitStyles.container}>
                            <div className={visitStyles.hccStickey_head}>
                              {newValidDiseaseList.map((data, i) => (
                                <li>
                                  <div
                                    className={`hccActiveCard ${visitStyles.hcc_card}`}
                                  >
                                    <div
                                      className={`${visitStyles.hcc_card_nameHead}`}
                                    >
                                      <div>
                                        <span className="mb-1 disease-name d-flex">
                                          <span className="valid-dis-name">
                                            {data.diagnosisCode}
                                          </span>{" "}
                                          <Popover
                                            content={data.actualDescription}
                                            title=""
                                            trigger="hover"
                                          >
                                            - {data.actualDescription}
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
                                      ) : data.defaultPosition ==
                                        "SUGGESTED" ? (
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
                                        content={validHccDetails}
                                        title={data.diagnosisCode}
                                        placement="bottom"
                                        trigger="click"
                                      >
                                        <Tooltip
                                          title="HCC Veriosn Details"
                                          placement="bottom"
                                        >
                                          <i className="cr-pointer">
                                            {SVGICON.infoIcon}
                                          </i>
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
                                        onConfirm={confirmvalid}
                                        placement="leftTop"
                                        onOpenChange={() =>
                                          onchangeValid(
                                            data.diagnosisCode,
                                            data
                                          )
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
                                    </div>
                                    <div
                                      className={`${visitStyles.hoverActiveHcc}`}
                                    >
                                      <div
                                        className={`${visitStyles.encounterAndSectionHeader}`}
                                      >
                                        {data.providerName ? (
                                          <Badge
                                            className={`mt-2 text-start ${visitStyles.provider_name}`}
                                          >
                                            <i>{SVGICON.patientNameIcon}</i>
                                            {data.providerName}
                                          </Badge>
                                        ) : null}
                                        {getEncounterDateBackground(
                                          data.encounterDateSplit
                                        )}
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
                                      <div
                                        className={`${visitStyles.encounterAndSectionHeader}`}
                                      >
                                        {getCaptureSectionBackgroundFile(
                                          data.capturedSections,
                                          data.encounterDate,
                                          data.actualDescription
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
                    ) : null}
                    <div className="col-xl-8">
                      <div className="card-body p-0">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                          <div
                            style={{
                              height: "71vh",
                              maxWidth: "1000px",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            {" "}
                            <Viewer
                              fileUrl={selectFileURL}
                              initialPage={fileDosPageNumber}
                              plugins={[defaultLayoutPluginInstance]}
                              onDocumentLoad={handleDocumentLoadFile}
                              renderLoader={(percentages) => (
                                <div style={{ width: "240px" }}>
                                  <ProgressBar
                                    progress={Math.round(percentages)}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </Worker>
                      </div>
                    </div>
                    {isFileFormShow ? (
                      <div className="col-xl-4">
                        <div className="offcanvas-body">
                          <div className={visitStyles.fileFormContianer}>
                            <Form
                              noValidate
                              validated={validated}
                              onSubmit={handleFormSubmit}
                            >
                              <div className="row">
                                <div className="col-xl-12">
                                  <Form.Label>
                                    Code <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    id="diagnosisCode"
                                    name="diagnosisCode"
                                    onChange={handleChange}
                                  />
                                  {addValidCodeCheck == false ? (
                                    <span
                                      className={
                                        visitStyles.invalidHccCodeError
                                      }
                                    >
                                      Invalid Hcc Code
                                    </span>
                                  ) : addValidCodeCheck == true ? (
                                    <span
                                      className={visitStyles.validHccCodeError}
                                    >
                                      Valid Hcc Code
                                    </span>
                                  ) : null}
                                </div>
                                <div className="col-xl-12">
                                  <Form.Label>Provider name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="providerName"
                                    name="providerName"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="col-xl-12">
                                  <Form.Label>
                                    Section{" "}
                                    <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                  <Form.Control
                                    required
                                    type="text"
                                    id="capturedSections"
                                    name="capturedSections"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className={`col-xl-12`}>
                                  <Form.Label>
                                    Encoded date{" "}
                                    <span className="text-danger">*</span>{" "}
                                  </Form.Label>

                                  {/* <Form.Control
                                                        required
                                                        type="date"
                                                        id="encodedDate"
                                                        name="encodedDate"
                                                        onChange={handleChange}                                                      
                                                      /> */}
                                  <div className={visitStyles.fileFormDate}>
                                    <Form.Control
                                      required
                                      type="text"
                                      id="encodedDate"
                                      name="encodedDate"
                                      onChange={handleChange}
                                      value={inputValueFileDate}
                                    />
                                    {!dragFileDate ? (
                                      <span
                                        onClick={() => setdragFileDate(true)}
                                      >
                                        {" "}
                                        <FontAwesomeIcon
                                          icon={faCalendar}
                                          style={{
                                            color: "#918585",
                                          }}
                                        />
                                      </span>
                                    ) : (
                                      <span
                                        onClick={() => setdragFileDate(false)}
                                      >
                                        {" "}
                                        <FontAwesomeIcon
                                          icon={faClose}
                                          style={{
                                            color: "#918585",
                                          }}
                                        />
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <DatePicker
                                  format="MM-DD-YYYY"
                                  onChange={(dates, dateStrings) => {
                                    handleDatePickerChangeFile(
                                      dates,
                                      dateStrings
                                    );
                                  }}
                                  open={dragFileDate}
                                  showNow={false}
                                  style={{
                                    visibility: "hidden",
                                    boxShadow: "none",
                                    marginBottom: "-45px",
                                  }}
                                  placeholder="MM-DD-YYYY"
                                  className="form-control"
                                />
                                {/* <DatePicker/> */}

                                <div className="col-xl-12 mb-3">
                                  <Form.Label>
                                    Description{" "}
                                    <span className="text-danger">*</span>{" "}
                                  </Form.Label>
                                  <textarea
                                    className="form-control"
                                    id="actualDescription"
                                    name="actualDescription"
                                    onChange={handleChangeSuggested}
                                    // value={inputValue.actualDescription}
                                    rows="5"
                                    required
                                  ></textarea>
                                </div>
                              </div>

                              <div>
                                <Button
                                  type="submit"
                                  className="btn btn-primary btn-sm me-1"
                                >
                                  Submit
                                </Button>
                                <Button
                                  // type="reset"
                                  onClick={() => handleCloseModal()}
                                  className="btn btn-danger btn-sm light ms-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </Form>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {!isFileFormShow ? (
                      <div className="col-xl-2">
                        <div className="">
                          <ul className="timeline">
                            <div
                              className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                            >
                              <span
                                className={`${visitStyles.suggested_title_name}`}
                              >
                                SUGGESTED CODES
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.suggested_title_badge}`}
                                >
                                  {suggestedHccList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.suggestedcontainer2}>
                              <div className={visitStyles.hccStickey_head}>
                                {suggestedHccList?.map((data) => {
                                  return (
                                    <>
                                      {data.isHccValid == true ? (
                                        <li>
                                          <div
                                            className={`hccActiveCard ${visitStyles.hcc_card}`}
                                          >
                                            <div
                                              className={`${visitStyles.hcc_card_nameHead}`}
                                            >
                                              <div className="media-body">
                                                <span className="mb-1 disease-name d-flex">
                                                  <span className="valid-dis-name">
                                                    {data.diagnosisCode}
                                                  </span>{" "}
                                                  <Popover
                                                    content={
                                                      data.actualDescription
                                                    }
                                                    title=""
                                                    trigger="hover"
                                                  >
                                                    - {data.actualDescription}
                                                  </Popover>
                                                </span>
                                              </div>
                                              {data.defaultPosition ==
                                              "VALID" ? (
                                                <span
                                                  className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}
                                                ></span>
                                              ) : data.defaultPosition ==
                                                "INVALID" ? (
                                                <span
                                                  className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                                                ></span>
                                              ) : data.defaultPosition ==
                                                "SUGGESTED" ? (
                                                <span
                                                  className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                                                ></span>
                                              ) : data.defaultPosition ==
                                                "DELETED" ? (
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
                                                content={validHccDetails}
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
                                                  description={
                                                    data.diagnosisCode
                                                  }
                                                  onConfirm={suggestedToDeleted}
                                                  placement="leftTop"
                                                  onOpenChange={() =>
                                                    onchangeValid(
                                                      data.diagnosisCode,
                                                      data
                                                    )
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      visitStyles.close_icon
                                                    }
                                                  >
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
                                                  description={
                                                    data.diagnosisCode
                                                  }
                                                  onConfirm={suggestedToDeleted}
                                                  placement="leftTop"
                                                  onOpenChange={() =>
                                                    onchangeValid(
                                                      data.diagnosisCode,
                                                      data
                                                    )
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      visitStyles.close_icon
                                                    }
                                                  >
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
                                            </div>
                                            <div
                                              className={`${visitStyles.hoverActiveHcc}`}
                                            >
                                              <div className="">
                                                <div
                                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                                >
                                                  {data.providerName ? (
                                                    <Badge
                                                      className={`mt-2 text-start ${visitStyles.provider_name}`}
                                                    >
                                                      <i>
                                                        {
                                                          SVGICON.patientNameIcon
                                                        }
                                                      </i>
                                                      {data.providerName}
                                                    </Badge>
                                                  ) : null}
                                                  {getEncounterDateBackground(
                                                    data.encounterDateSplit
                                                  )}
                                                </div>
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

                                              {data.getPlace == "Lab" ? (
                                                <div
                                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                                >
                                                  {getCaptureSectionBackground(
                                                    data.capturedSections,
                                                    "Lab",
                                                    data.encounterDate,
                                                    data.actualDescription
                                                  )}
                                                </div>
                                              ) : data.getPlace == "Radio" ? (
                                                <div
                                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                                >
                                                  {getCaptureSectionBackground(
                                                    data.capturedSections,
                                                    "Radio",
                                                    data.encounterDate,
                                                    data.actualDescription
                                                  )}
                                                </div>
                                              ) : (
                                                <div
                                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                                >
                                                  {getCaptureSectionBackgroundFile(
                                                    data.capturedSections,
                                                    data.encounterDate,
                                                    data.actualDescription
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </li>
                                      ) : null}
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
                              <span
                                className={`${visitStyles.deleted_title_name}`}
                              >
                                DELETED CODES
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.deleted_title_badge}`}
                                >
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
                                      <div
                                        className={`${visitStyles.hcc_card_nameHead}`}
                                      >
                                        <div className="media-body">
                                          <span className="mb-1 disease-name d-flex">
                                            <span className="valid-dis-name">
                                              {data.diagnosisCode}
                                            </span>{" "}
                                            <Popover
                                              content={data.actualDescription}
                                              title=""
                                              trigger="hover"
                                            >
                                              - {data.actualDescription}
                                            </Popover>
                                          </span>
                                        </div>
                                        {data.defaultPosition == "VALID" ? (
                                          <span
                                            className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "INVALID" ? (
                                          <span
                                            className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "SUGGESTED" ? (
                                          <span
                                            className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                                          ></span>
                                        ) : data.defaultPosition ==
                                          "DELETED" ? (
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
                                            title="HCC Veriosn Details"
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
                                          onConfirm={deletedToSuggested}
                                          placement="leftTop"
                                          onOpenChange={() =>
                                            onchangeValid(
                                              data.diagnosisCode,
                                              data
                                            )
                                          }
                                        >
                                          <div
                                            className={visitStyles.close_icon}
                                          >
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
                                      <div
                                        className={`${visitStyles.hoverActiveHcc}`}
                                      >
                                        <div className="">
                                          <div
                                            className={`${visitStyles.encounterAndSectionHeader}`}
                                          >
                                            {data.providerName ? (
                                              <Badge
                                                className={`mt-2 text-start ${visitStyles.provider_name}`}
                                              >
                                                <i>{SVGICON.patientNameIcon}</i>
                                                {data.providerName}
                                              </Badge>
                                            ) : null}
                                            {getEncounterDateBackground(
                                              data.encounterDateSplit
                                            )}
                                          </div>
                                        </div>
                                        <div
                                          className={`${visitStyles.encounterAndSectionHeader}`}
                                        >
                                          {getCaptureSectionBackgroundFile(
                                            data.capturedSections,
                                            data.encounterDate,
                                            data.actualDescription
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
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="query">
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
                    {meatQueryList?.length != 0 ? (
                      <div className={visitStyles.container}>
                        <div className={visitStyles.hccStickey_head}>
                          {meatQueryList?.map((item) => (
                            <>
                              {item.currentQuery == true ? (
                                <div
                                  className={`${visitStyles.meat_details_card}`}
                                >
                                  <>
                                    {item.diagnosisCode ==
                                    selectPreviousCode ? (
                                      <div className="d-flex justify-content-between">
                                        <span className={styles.currentBadge}>
                                          Current
                                        </span>
                                        <span
                                          className={styles.moreBtn}
                                          onClick={() =>
                                            setSelectPreviousCode(null)
                                          }
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
                                      <span className="font-bold meat-name-details">
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
                                      <span className={styles.l1auditorBadge}>
                                        L1 Auditor
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
                                        onClick={() =>
                                          meatQueriedComments(item)
                                        }
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
                                      <div
                                        onClick={() =>
                                          addMeatQuery(item, "Update")
                                        }
                                        className={styles.edit_meat_query}
                                      >
                                        {SVGICON.meatQueryEdit}
                                      </div>
                                    </div>
                                  </div>
                                  {item.diagnosisCode == selectPreviousCode ? (
                                    <>
                                      <span className={styles.previousBadge}>
                                        Previous
                                      </span>
                                      {meatQueryListPrevious?.map((item) => (
                                        <div>
                                          <div className="row">
                                            <div className="col-xl-1 d-grid">
                                              <span className="font-bold meat-name-details">
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
                                              <span
                                                className={
                                                  styles.l1auditorBadge
                                                }
                                              >
                                                L1 Auditor
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
                                                onClick={() =>
                                                  meatQueriedComments(item)
                                                }
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
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <Modal
          title={selectMeatName}
          // title="Pdf Test"
          centered
          open={isModalOpen}
          // style={{ top: 5 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="90%"
          // height={400}
        >
          <div className="section-container">
            <div className="row">
              <div className="col-xl-12">
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
                      onDocumentLoad={handleDocumentLoad}
                    />
                  </div>
                </Worker>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {isModalOpenValidCodes && (
        <Modal
          title={fileModalHeader}
          // title="Pdf Test"
          centered
          open={isModalOpenValidCodes}
          // style={{ top: 5 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="90%"
          // height={400}
        >
          <div className="section-container">
            <div class="d-flex justify-content-end m-4">
              <Button
                onClick={handleAddButtonClick}
                className={`btn btn-primary btn-sm me-1 ${visitStyles.hccCodeAddBtn}`}
              >
                Add
              </Button>
            </div>

            <div className={`row ${visitStyles.hccCodeAddContainer}`}>
              <div className="col-xl-8">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                  <div
                    style={{
                      height: "80vh",
                      // width: "1000px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    {" "}
                    <Viewer
                      initialPage={fileInitialPage}
                      fileUrl={selectFileURL}
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
              {isAddButtonClicked && (
                <div
                  className={`col-xl-4 ${visitStyles.hccCodeAddRightContainer}`}
                >
                  {/* Input fields */}
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <Form.Label>
                        Diagnosis code
                        <span className="text-danger">*</span>{" "}
                      </Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        id="diagnosisCode"
                        name="diagnosisCode"
                        placeholder="Enter Code"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <Form.Label>Provider name</Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        id="providerName"
                        name="providerName"
                        placeholder="Enter provider name (Optional)"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <Form.Label>
                        Section<span className="text-danger">*</span>{" "}
                      </Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        id="capturedSections"
                        name="capturedSections"
                        placeholder="Enter section"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <Form.Label>
                        Encoded date
                        <span className="text-danger">*</span>{" "}
                      </Form.Label>

                      <input
                        type="date"
                        className="form-control"
                        id="encodedDate"
                        name="encodedDate"
                        placeholder="Select encoded date"
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <Form.Label>
                        Description
                        <span className="text-danger">*</span>{" "}
                      </Form.Label>

                      <textarea
                        className="form-control"
                        id="actualDescription"
                        name="actualDescription"
                        value={inputValue.actualDescription}
                        onChange={handleChangeSuggested}
                        rows="5"
                      ></textarea>
                    </div>

                    <div className={visitStyles.addValidCodeFormFooter}>
                      <Button
                        type="submit"
                        className="btn btn-primary btn-sm me-1"
                      >
                        {isLoadingBtn ? "Loading..." : "Submit"}
                      </Button>
                      <Button
                        onClick={handleCloseForm}
                        className="btn btn-danger btn-sm light ms-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              {nonHccActiveCodes == false && isAddButtonClicked == false ? (
                <div
                  className={`col-xl-4 ${visitStyles.hccCodeAddRightContainer}`}
                >
                  <div className={visitStyles.validHcccontainer}>
                    <div className={visitStyles.sticked_head}>
                      {newValidDiseaseList.map((data, i) => (
                        <li>
                          <div
                            className={`hccActiveCard ${visitStyles.hcc_card} ${visitStyles.hcc_card_addCode}`}
                          >
                            <div className={`${visitStyles.hcc_card_nameHead}`}>
                              <div className="media-body">
                                <span className="mb-1 disease-name d-flex">
                                  <span className="valid-dis-name">
                                    {data.diagnosisCode}
                                  </span>{" "}
                                  <Popover
                                    content={data.actualDescription}
                                    title=""
                                    trigger="hover"
                                  >
                                    - {data.actualDescription}
                                  </Popover>
                                </span>
                              </div>

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
                            </div>
                            <div className={`${visitStyles.hoverActiveHcc}`}>
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getEncounterDateBackground(
                                  data.encounterDateSplit
                                )}
                                {data.isManuallyAdded == true ? (
                                  <Badge
                                    className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                  >
                                    Manually Added
                                  </Badge>
                                ) : null}
                              </div>
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getCaptureSectionBackgroundFile(
                                  data.capturedSections,
                                  data.encounterDate,
                                  data.actualDescription
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Modal>
      )}
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
          // height={500}
        >
          <div className="section-container">
            <div className="row">
              <div className="col-xl-12">
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
                  onDocumentLoad={handleDocumentLoad}
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
                  onDocumentLoad={handleDocumentLoad}
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
                    {isLoading ? "Loding..." : "Submit"}
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
                    {isLoading ? "Loding..." : "Submit"}
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

      <Offcanvas
        onHide={handleCloseModal}
        show={isModalOpenValid}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add Valid Code
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
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Code <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="diagnosisCode"
                    name="diagnosisCode"
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
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Section <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="capturedSections"
                    name="capturedSections"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Encoded date <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    id="encodedDate"
                    name="encodedDate"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="actualDescription"
                    name="actualDescription"
                    onChange={handleChangeSuggested}
                    value={inputValue.actualDescription}
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
                    <span className={styles.meatQueried_head}>{meatQueryResult.diagnosisCode}</span>
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
                  We've pinpointed the following details that may pertain to records associated with <b>{patientHccResult.patientName}</b>.
                  </p>
                </div>
                <div>
                  <span className={styles.meatQueried_head}>Dear Dr {meatQueryResult.providerName}</span>
                  {!meatQueriedDetailsShow ?
                  <p className={styles.meatQueried_details}>
                    {meatQueryResult.queryComment}
                  </p>:
                    <textarea
                    className={`${styles.queryTextarea}`}
                      id="queryComment"
                      name="queryComment"
                      onChange={handleChange}
                      rows="5"
                      value={inputValue.queryComment}
                    ></textarea>}
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

export default Hcc;
