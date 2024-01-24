import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
// import LoadingSpinner from "../../../../jsx/components/spinner/spinner";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import "react-vertical-timeline-component/style.min.css";
import { Paginator } from "primereact/paginator";
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
import { Popconfirm, Divider, Popover, Menu, DatePicker, Dropdown } from "antd";
import { IMAGES, SVGICON } from "../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { notification } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, Tooltip } from "antd";

const NonHcc = ({ patientNonHccResult }) => {
  const navigate = useRouter();
  let searchKeywords = [];
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;
  const { setTargetPages } = searchPluginInstance;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileFormShow, setIsFileFormShow] = useState(false);
  const [isModalOpenValid, setIsModalOpenValid] = useState(false);
  const [isModalOpenValidCodes, setIsModalOpenValidCodes] = useState(false);
  const [isModalOpenCaptureSection, setIsModalOpenCaptureSection] =
    useState(false);
  const [confirmNotesModalDecline, setConfirmNotesModalDecline] =
    useState(false);
  const [confirmNotesModalHold, setConfirmNotesModalHold] = useState(false);

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
  const [flagTagActive, setFlagTagActive] = useState(true);
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

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };

  useEffect(() => {
    // loadFilterPatientList();
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    setLocalOrgId(orgId);
    getPatientDetails(patientId, orgId, tenId);
    setLocalTenantId(tenId);

    var uId = localStorage.getItem("userId");
    setLocalUserId(uId);

    setLocalPatientId(patientId);

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
  }, []);

  const getPatientDetails = async (
    patientId,
    orgId,
    tenId,
    reload
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

    var result = patientNonHccResult;

    if(reload == "reload"){
    var patientId = localStorage.getItem("patientId");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    );
    result = response.data.response;
    }
  
    if (result) {
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

        if (reload != "reload") {
          getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId);
          setSelectMeatFileId(patientNonHccResult.fileId);
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
          validDiseasesArray.push({ name: validDis[key] });        }


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


        var newArrayColorMatchs = [];
        newArrayColorMatchs = [
          ...sectionColorResultMatch,
          ...notMatchColorArray,
        ];

        setCaptureSectionMatching(newArrayColorMatchs);


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

        result.unMatchedDisease.map((res) => {
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
          if (res.monitorCapturedFromHeader != "") {
            meatMoniterHead.push({
              header: res.monitorCapturedFromHeader,
            });
          }
          if (res.evaluateCapturedFromHeader != "") {
            meatEvaluteHead.push({
              header: res.evaluateCapturedFromHeader,
            });
          }
          if (res.assessmentCapturedFromHeader != "") {
            meatAssesmentHead.push({
              header: res.assessmentCapturedFromHeader,
            });
          }
          if (res.treatmentCapturedFromHeader != "") {
            meatTreatMentHead.push({
              header: res.treatmentCapturedFromHeader,
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
            });
          }
        });
        setMeatCriteriaList(meatListArr);
        setMeatCriteriaListNonHcc(nonHccMeatListArr);
        setIsLoadingDos(false);
      } else {
        setIsLoading(false);
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

   const confirmInvalid = () =>
    new Promise((resolve) => {
      resolve(setConfirmNotesModalInValid(true));
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

  const meatMoveConfirm = () => {
    const result = meatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setMeatCriteriaList(result);
    var namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    var newArray = [];
    newArray = [...invalidDiseasesList, ...namePush];
    setInvalidMeatCriteriaList(newArray);
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
    setConfirmNotesModalDecline(false);
    setConfirmNotesModalHold(false);
    setIsAddButtonClicked(false);
    setConfirmNotesModalDecline(false);
    setIsAddButtonClicked(false);
    setIsModalComments(false);
    setFlagContainerActive("");
    setConfirmCompleteModal(false);
    setIsModalOpenLab(false);
    setIsFileFormShow(false);
  };

  const handleOpenModal = (value, disDescription) => {
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
    setIsModalOpen(true);
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };
  const findValueDocument = (value, disDescription) => {
    var splitPoint = disDescription.substring(" ", 40);

    highlight({
      keyword: splitPoint,
      // matchCase: true,
      // wholeWords:true
    });
  };
  const handleOpenModalCombinationCode = async (
    value,
    disDescription,
    check,
    whereCome,
    documentPlace,
    encounterDate,
    headerNames,
    actualDescription
  ) => {
    if (check === "valid") {
      var fileId = patientFileDTO.fileId;

      const encounterDatearray = encounterDate.split(",");
      const encounterDateValue = encounterDatearray[0];

      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/pageNumber?header=${headerNames}&fileId=${fileId}&dos=${encounterDateValue}`
      );
      var result = response.data.response;
      if (result?.length) {
        var pageNumber = result[0] - 1;
        setFileInitialPage(pageNumber);
      }

      setSelectActiveCode(value);
      var splitPoint = "";
      splitPoint = disDescription;
      setTimeout(() => {
        setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
        highlight({
          keyword: headerNames,
        });
        var dataset = value + " - (" + splitPoint + ")";
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
      var dataset = value + " - (" + splitPoint + ")";
      setSelectMeatName(dataset + " -  " + "Loading...");
      setIsLoadingSection(true);
      var headerName =
        patientDocumentResult.patientId +
        " / " +
        patientDocumentResult.patientName +
        " / " +
        dataset +
        " -  " +
        "Loading...";
      setFileModalHeader(headerName);
      setIsModalOpenCaptureSection(true);
    }
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
      if (isValidAction == "suggestedToValid") {
        handleSubmitMoveSuggestedToValid();
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

  const openNewTabDownloadPdf = async () => {
    window.open("details/file-view", "_blank", "width=4000, height=4000");
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
      getPatientDetails(localPatientId, localOrgId, localTenantId,"reload");
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
      getPatientDetails(localPatientId, localOrgId, localTenantId,"reload");
    } else {
    }
  };

  function removeDuplicates(array) {
    let output = [];
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
    }

    return output;
  }

  const getCaptureSectionBackground = (
    value,
    documentPlace,
    encounterDate,
    actualDescription,
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


  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1">
            <Tab.Container defaultActiveKey={activeTabHead}>
              <Nav as="ul" className="nav nav-tabs">
              <Nav.Item as="li" className="nav-item">
                  <Nav.Link
                    to="#my-posts"
                    className={visitStyles.navColor}
                    activeClassName={visitStyles.activeLink}
                    eventKey="file"
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
                  >
                    Visit Data
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link
                    to="#my-posts"
                    eventKey="comboDiseases"
                    className={visitStyles.navColor}
                    activeClassName={visitStyles.activeLink}
                  >
                    Combination Codes
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link
                    to="#my-posts"
                    eventKey="meatCriteria"
                    className={visitStyles.navColor}
                    activeClassName={visitStyles.activeLink}
                  >
                    MEAT Criteria
                  </Nav.Link>
                </Nav.Item>
             </Nav>
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
                                NON-HCC
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.hcc_title_badge}`}
                                >
                                  {newInValidDiseaseList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              {newInValidDiseaseList.map((data, i) => (
                                <li>
                                  <div className={`${visitStyles.hcc_card}`}>
                                    <div
                                      className={`${visitStyles.hcc_card_nameHead}`}
                                    >
                                      <div className="media-body">
                                        <span className="mb-1 disease-name d-flex">
                                          <span className="valid-dis-name">
                                            {data.diagnosisCode}
                                          </span>{" "}
                                          - {data.actualDescription}
                                        </span>
                                      </div>

                                      <Popconfirm
                                        title="You want move to Hcc?"
                                        description={data.diagnosisCode}
                                        onConfirm={confirmInvalid}
                                        placement="leftTop"
                                        okText="Yes"
                                        cancelText="No"
                                        onOpenChange={() =>
                                          onchangeValid(
                                            data.diagnosisCode,
                                            data
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
                                    <div
                                      className={`${visitStyles.hoverActiveHcc}`}
                                    >
                                      {getEncounterDateBackground(
                                        data.encounterDateSplit
                                      )}
                                      <div
                                        className={`${visitStyles.encounterAndSectionHeader}`}
                                      >
                                        {getCaptureSectionBackground(
                                          data.capturedSections,
                                          null,
                                          data.encounterDate,
                                          data.actualDescription,
                                          data.diagnosisCode
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
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
                                  {suggestedNonHccList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              <div className={visitStyles.hccStickey_head}>
                                {suggestedNonHccList?.map((data) => {
                                  return (
                                    <>
                                      {data.isHccValid == false ||
                                      data.isHccValid == null ? (
                                        <li>
                                          <div
                                            className={`${visitStyles.hcc_card}`}
                                          >
                                            <div
                                              className={`${visitStyles.hcc_card_nameHead}`}
                                            >
                                              <div
                                                className="media-body"
                                                onClick={() =>
                                                  handleOpenModalCombinationCode(
                                                    data.diagnosisCode,
                                                    data.actualDescription,
                                                    "valid2"
                                                  )
                                                }
                                              >
                                                <span className="mb-1 disease-name d-flex">
                                                  <span className="valid-dis-name">
                                                    {data.diagnosisCode}
                                                  </span>{" "}
                                                  - {data.actualDescription}
                                                </span>
                                              </div>

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
                                            </div>
                                            <div className="">
                                              {getEncounterDateBackground(
                                                data.encounterDateSplit
                                              )}
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
                                              ) : (
                                                <Tooltip title="HCC">
                                                  <span
                                                    className={` mt-2 ${visitStyles.hccStatus}`}
                                                    bg={` mt-2 bg-bg-five `}
                                                  >
                                                    HCC
                                                  </span>
                                                </Tooltip>
                                              )}
                                              <div
                                                className={`${visitStyles.encounterAndSectionHeader}`}
                                              >
                                                {getCaptureSectionBackground(
                                                  data.capturedSections,
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
                          {comboDiseaseCodesListNonHcc.length != 0 ? (
                            <div className={visitStyles.container}>
                              <div className={visitStyles.hccStickey_head}>
                                {comboDiseaseCodesListNonHcc?.map((item) => {
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

                          {comboDiseaseCodesListNonHcc.length == 0 ? (
                            // <div className="card combo-card">
                            //   <div className="col-xl-12">
                            <div>
                              <span className="no-patient-data">
                                No Combination Codes
                              </span>
                            </div>
                          ) : //   </div>
                          // </div>
                          null}
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
                          {invalidComboDiseaseCodesList.length != 0 ? (
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
                                </div>
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
                    {meatCriteriaListNonHcc.length != 0 ? (
                      <div className={visitStyles.container}>
                        <div className={visitStyles.hccStickey_head}>
                          {meatCriteriaListNonHcc?.map((item) => {
                            return (
                              <div
                                className={
                                  item.isMeatCriteriaPresent === true
                                    ? "card meat-card"
                                    : "card meat-card-false"
                                }
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
                                    <Badge
                                      className="badge-meat cr-pointer badge-circle mt-2"
                                      bg={` badge-circle mt-2 ${item.monitorCapturedFromHeaderColor} `}
                                      onClick={() =>
                                        handleOpenModal(
                                          item.monitorCapturedFromHeader,
                                          item.monitor
                                        )
                                      }
                                    >
                                      {item.monitorCapturedFromHeader}
                                    </Badge>
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
                                    <Badge
                                      className="badge-meat cr-pointer badge-circle mt-2"
                                      bg={` badge-circle mt-2 ${item.evaluateCapturedFromHeaderColor} `}
                                      onClick={() =>
                                        handleOpenModal(
                                          item.evaluateCapturedFromHeader,
                                          item.evaluate
                                        )
                                      }
                                    >
                                      {item.evaluateCapturedFromHeader}
                                    </Badge>
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
                                    <Badge
                                      className="badge-meat cr-pointer badge-circle mt-2"
                                      bg={` badge-circle mt-2 ${item.assessmentCapturedFromHeaderColor} `}
                                      onClick={() =>
                                        handleOpenModal(
                                          item.assessmentCapturedFromHeader,
                                          item.assessment
                                        )
                                      }
                                    >
                                      {item.assessmentCapturedFromHeader}
                                    </Badge>
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

                                    <Badge
                                      className="badge-meat cr-pointer badge-circle mt-2"
                                      bg={` badge-circle mt-2 ${item.treatmentCapturedFromHeaderColor} `}
                                      onClick={() =>
                                        handleOpenModal(
                                          item.treatmentCapturedFromHeader,
                                          item.treatment
                                        )
                                      }
                                    >
                                      {item.treatmentCapturedFromHeader}
                                    </Badge>
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
                                      <div className="icon-box  bg-danger-light me-1">
                                        <FontAwesomeIcon
                                          icon={faClose}
                                          style={{ color: "red" }}
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
                    {meatCriteriaListNonHcc.length == 0 ? (
                      <div className="col-xl-12">
                        <div>
                          <span className="no-patient-data">
                            No MEAT Criteria
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="RafScore">
                  <div className="my-post-content pt-3">
                    <div className="row">
                      <div className="col-xl-3">
                       
                      </div>
                      {rafScore != null ? (
                        <div className="col-xl-12">
                          {rafScore.scoreOutputDTOList != null ? (
                            <>
                              {rafScore.scoreOutputDTOList.map(
                                (rafScoreMapResult) => {
                                  return (
                                    <div className="row raf-main-card">
                                      {/* <div className="raf-name-head">
                                                  <h5 className="raf-model-version">{rafScoreMapResult.hcc_model.model} - {rafScoreMapResult.hcc_model.version}</h5>
                                                </div> */}

                                      <div className="col-xl-6">
                                        <div className="card">
                                          <div className="raf-card">
                                            <div className="row raf-head text-center">
                                              <div className="col-xl-12">
                                                <label>Summary</label>
                                              </div>
                                            </div>
                                            <div className="row raf-details">
                                              <div className="col-xl-6">
                                                <span>
                                                  {
                                                    rafScoreMapResult.hcc_model
                                                      .model
                                                  }
                                                </span>
                                              </div>
                                              <div className="col-xl-6">
                                                <span>
                                                  {
                                                    rafScoreMapResult.hcc_model
                                                      .version
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-6">
                                        <div className="card">
                                          <div className="raf-card">
                                            <div className="row raf-head">
                                              <div className="col-xl-6">
                                                <label>DX Code</label>
                                              </div>
                                              <div className="col-xl-6">
                                                <label>DX Description</label>
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
                                      </div>
                                      <div className="col-xl-6">
                                        <div className="card">
                                          <div className="raf-card">
                                            <div className="row raf-head">
                                              <div className="col-xl-6">
                                                <label>HCC</label>
                                              </div>
                                              <div className="col-xl-6">
                                                <label>HCC Description</label>
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
                                                            {res1.hcc_name}
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-6">
                                                          <span>
                                                            {res1.hcc_desc}
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
                                      <div className="col-xl-6">
                                        <div className="card">
                                          <div className="raf-card">
                                            <div className="row raf-head">
                                              <div className="col-xl-4">
                                                <label>Trumped By</label>
                                              </div>
                                              <div className="col-xl-4">
                                                <label>RAF</label>
                                              </div>
                                              <div className="col-xl-4">
                                                <label>Monthly Premium</label>
                                              </div>
                                            </div>
                                            {rafScoreMapResult.dx_hccs.map(
                                              (res) => {
                                                return res.hcc_list.map(
                                                  (res1) => {
                                                    return (
                                                      <div className="row  raf-details">
                                                        <div className="col-xl-4">
                                                          <span>-</span>
                                                        </div>
                                                        <div className="col-xl-4">
                                                          <span>
                                                            {res1.hcc_raf}
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-4">
                                                          <span>
                                                            ${res1.premium}
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
                                    </div>
                                  );
                                }
                              )}
                            </>
                          ) : null}

                          <div className="row raf-main-card">
                            <div className="raf-name-head">
                              <h5 className="raf-model-version">
                                SCORE DETAILS
                              </h5>
                            </div>

                            <div className="col-xl-12">
                              <div className="card">
                                <div className="raf-card">
                                  <div className="row raf-head">
                                    <div className="col-xl-2">
                                      <label>v24Score</label>
                                    </div>
                                    <div className="col-xl-3">
                                      <label>v24Score70Percent</label>
                                    </div>
                                    <div className="col-xl-2">
                                      <label>v28Score</label>
                                    </div>
                                    <div className="col-xl-3">
                                      <label>v28Score30Percent</label>
                                    </div>
                                    <div className="col-xl-2">
                                      <label>Score</label>
                                    </div>
                                  </div>
                                  <div className="row  raf-details">
                                    <div className="col-xl-2">
                                      <span>{rafScore.v24Score}</span>
                                    </div>
                                    <div className="col-xl-3">
                                      <span>{rafScore.v24Score70Percent}</span>
                                    </div>
                                    <div className="col-xl-2">
                                      <span>{rafScore.v28Score}</span>
                                    </div>
                                    <div className="col-xl-3">
                                      <span>{rafScore.v28Score30Percent}</span>
                                    </div>
                                    <div className="col-xl-2">
                                      <span>{rafScore.score}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {rafScore == null ? (
                        <div className="card box-shadow-none">
                          <div className="card combo-card">
                            <div className="col-xl-12">
                              <span className="no-patient-data">NO DATA</span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="file">
                  <div className="my-post-content pt-3">
                    <div>
                      <button
                        onClick={() => openNewTabDownloadPdf()}
                        className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                      >
                        Open New Tab
                      </button>
                    </div>
                    <div className="card-body p-0">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                        <div
                          style={{
                            height: "80vh",
                            maxWidth: "1000px",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        >
                          {" "}
                          <Viewer
                            fileUrl={selectFileURL}
                            plugins={[defaultLayoutPluginInstance]}
                            onDocumentLoad={handleDocumentLoad}
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
            <div className={`row ${visitStyles.hccCodeAddContainer}`}>
              <div className="col-xl-12">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                  <div
                    style={{
                      height: "80vh",
                      width: "1000px",
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
                    initialPage={fileInitialPage}
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
    </>
  );
};

export default NonHcc;
