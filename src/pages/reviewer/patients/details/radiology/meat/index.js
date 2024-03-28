import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { InputText } from "primereact/inputtext";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Paginator } from "primereact/paginator";
import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
  RenderHighlightContentProps,
  RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCheck,
  faInfo,
  faPlus,
  faArrowsAlt,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { Popconfirm, Divider, Popover, Menu, DatePicker, Dropdown } from "antd";
import { IMAGES, SVGICON } from "../../../../../../jsx/constant/theme";
import Select from "react-select";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { getProviderDetails } from "../../../../../../services/PatientsListSevice";
import Spinner from "../../../../../../components/loadingSpinner";
import CamboTree from "../../hcc/org";

const Meat = ({}) => {
  const navigate = useRouter();
  let searchKeywords = [];
  const radiologyDetailsResult = useSelector((state) => state?.ReviewerReducers?.radiologyDeatils);
  const sectionColorList = useSelector((state) => state?.ReviewerReducers?.sectionColorList);
  const radiologyFile = useSelector((state) => state?.ReviewerReducers?.radiologyFileDetails);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;

  const { RangePicker } = DatePicker;

  const sideMenu = useSelector((state) => state.sideMenu);
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

  // const storePatientDetails = useSelector(
  //   (state) => state.patientDetails.patientDetails
  // );
  const storeDetails = useSelector((state) => state);

  // const defaultLayoutPluginInstance = searchPluginInstance();

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
  const [combiTree, setCombiTree] = useState({});
  const [opens, setOpens] = useState(false);
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
  const [providerDetails, setProviderDetails] = useState("");
  const [selectMeatResult, setSelectMeatResult] = useState(null);
  const [isModalOpenRadiologyMeat, setIsModalOpenRadiologyMeat] =
    useState(false);
  const [activeTabNumber, setActiveTabNumber] = useState(0);

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

  //     'document',
  //     {
  //         keyword: 'PDF',
  //         matchCase: true,
  //     },
  // ]);

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    setLocalOrgId(orgId);
    getPatientDetailsRadiologyYear(orgId, tenId);
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
  }, [radiologyDetailsResult]);
  
  useEffect(() => {
    getPatientPdfFileRadiology();
  }, [radiologyFile?.result?.response]);

  const getPatientDetailsRadiologyYear = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    if (radiologyDetailsResult?.result?.response) {
      var result = radiologyDetailsResult?.result?.response;
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
      }
      if (result.validDisease != null) {
        var validDis = "";
        var invalidDis = "";
        var comboDis = "";
        var meatCri = "";
        var dosYearArr = [];
        // var dosYearArrFile = [];
        var validDiseaseNewRes = [];
        var invalidDiseaseNewRes = [];
        var unMatchRes = [];

        for (var key in result.validDisease) {
          dosYearArr.push({ value: key, label: key });
        }

        var dateofService = dosYearArr[0].value;

        const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

        const highestDosValue = dosYearArr.filter(
          (i) => parseInt(i.value) === highestDOS
        );
        setDosYearDefalutSelectRadiology(dosYearArr[0]);

        validDis = result.validDisease[dateofService];
        validDiseaseNewRes = result.validDisease[dateofService];
        invalidDiseaseNewRes = result.invalidDisease[dateofService];
        if (result.unmatchedDisease != null) {
          var unMatchResCheck = result.unmatchedDisease[dateofService];

          if (unMatchResCheck != null) {
            unMatchRes = result.unmatchedDisease[dateofService];
          }
        }

        invalidDis = result.invalidDisease[dateofService];
        if (result.comboDisease != null) {
          comboDis = result.comboDisease[dateofService];
        }
        if (result.meatCriteria != null) {
          meatCri = result.meatCriteria[dateofService];
        }

        var validDisArray = [];
        validDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          var providerList = [];
          res.provider?.map((res, index) => {
            providerList.push(res.providerName);
          });
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
          });
        });

        var invalidDisArray = [];
        invalidDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          var providerList = [];
          res.provider?.map((res, index) => {
            providerList.push(res.providerName);
          });
          invalidDisArray.push({
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
        });

        var capturedSectionsColorsMatching = [];
        var capturedSectionsArr = [];

        const COLORS2 = [
          "sectionTag5",
          "sectionTag6",
          "sectionTag7",
          "sectionTag8",
          "sectionTag1",
          "sectionTag2",
          "sectionTag3",
          "sectionTag4",
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

        var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

        dublicateSectionArr.map((res, index) => {
          capturedSectionsColorsMatching.push({
            name: res.name,
            diagnosisCode: res.diagnosisCode,
            colors: COLORS2[index],
          });
        });
        var sectionColorResult = sectionColorList.result?.response;

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
          // submitSectionColors(
          //   res.name,
          //   radomColorcode,
          //   randomColorChangeShadow
          // );
        });

        var newArrayColorMatchs = [];
        newArrayColorMatchs = [
          ...sectionColorResult,
          ...sectionColorResultMatch,
          ...notMatchColorArray,
        ];

        setCaptureSectionMatching(newArrayColorMatchs);

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

        // setCaptureSectionMatching(capturedSectionsColorsMatching);
        setNewValidDiseaseListRadiology(validDisArray);
        setInNewValidDiseaseListRadiology(invalidDisArray);
        setUnMatchHccListRadiology(unMatchRes);
        setComboDiseaseCodesListRadiology(comboDis);
        setDosYearRadiology(dosYearArr);
        // setFileRadiologyDateofServiceList(dosYearArrFile);

        const COLORS = [
          "encounterDateTag1",
          "encounterDateTag2",
          "encounterDateTag3",
          "encounterDateTag4",
          "encounterDateTag5",
          "encounterDateTag6",
          "encounterDateTag7",
          "encounterDateTag8",
        ];

        var meatListArr = [];
        var meatMoniterHead = [];
        var meatEvaluteHead = [];
        var meatAssesmentHead = [];
        var meatTreatMentHead = [];
        var allMeatHead = [];
        var allMeatHeadColorArr = [];
        var allMeatHeadColor = [];
        var dublicateRemoveSecondArr = [];

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
              color: COLORS[index],
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
          meatListArr.push({
            diagnosisCode: res.diagnosisCode,
            diseaseName: res.diseaseName,
            monitorCapturedFromHeader: res.monitorCapturedFromHeader,
            assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
            evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
            treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
            radiology: res.radiology,
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
          });
        });
        setMeatCriteriaListRadiology(meatListArr);
        setRadiologyResultStatus(true);
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

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    if (radiologyFile?.result?.response) {
      setSelectFileURLRadiology(radiologyFile?.result?.response);
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

  const confirmInvalidMoveDis = () =>
    new Promise((resolve) => {
      validMoveConfirmDis();
      setTimeout(() => resolve(null), 1000);
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
  const validMoveConfirmDis = () => {
    const result = invalidMoveDiseasesList.filter(
      (res) => res.diagnosisCode != selectDiseasesName
    );
    setInvalidMoveDiseasesList(result);
    const result2 = invalidMoveDiseasesList.filter(
      (res2) => res2.diagnosisCode == selectDiseasesName
    );
    // var namePush = [];
    // namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...newValidDiseaseList, ...result2];
    setNewValidDiseaseList(newArray);
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
    setIsModalOpenRadiologyMeat(false);
    setActiveTabNumber(activeTabNumber == null ? 0 : null);
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
    setIsModalOpenRadiology(true);
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
  const handleOpenModalCombinationCode = (
    value,
    disDescription,
    check,
    whereCome,
    documentPlace
  ) => {
    handleOpenModalRadiology(value, disDescription, true);
  };
  const handleOpenModalRadiology = (
    value,
    disDescription,
    radiologyCheck,
    meatresult
  ) => {
    setSelectMeatResult(meatresult);
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

    handleOpenModal(value, disDescription);
  };
  const handleOpenModalRadiologyMeat = (
    value,
    disDescription,
    radiologyCheck,
    meatresult
  ) => {
    setSelectMeatResult(meatresult);
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
      setIsModalOpenRadiologyMeat(true);
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

  const addValidDiseasesFileForm = () => {
    setIsFileFormShow(true);
    // setValidated(true);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
    }
    setValidated(true);
  };

  const dosOnChangeRadiologyFile = async (e) => {
    var dosKeyValue = e.value;
    patientDetailsRadiology.radiologyFileDetail.map((res, index) => {
      for (var key in res.documentDos) {
        if (key == dosKeyValue) {
          // getPatientPdfFileRadiologyYear(fileDetails[0].azureBlobPath, localTenantId);
          getPatientPdfFileRadiology(res.azureBlobPath, localTenantId);
        }
      }
    });
  };

  const openNewTabDownloadPdfradiology = async () => {
    window.open("details/radiology-file", "_blank", "width=4000, height=4000");
    //     fetch(selectFileURLRadiology).then(resp => resp.arrayBuffer()).then(resp => {

    //      // set the blog type to final pdf
    //      const file = new Blob([resp], {type: 'application/pdf'});

    //      // process to auto download it
    //      const fileURL = URL.createObjectURL(file);

    //      // Open new Tab
    //      window.open(fileURL)

    //  });
  };

  function removeDuplicates(array) {
    let output = [];
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
    }

    return output;
  }

  const getCaptureSectionBackgroundFile = (value) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    console.log(dublicateCaptureDelete);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var headerNames = result[0]?.sectionName;
      var disCode = result[0]?.diagnosisCode;

      var sectionMapArr = (
        <span
          onClick={() => findValueDocument(disCode, res)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getCaptureSectionBackground = (value, documentPlace) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() =>
            handleOpenModalCombinationCode(
              value,
              res,
              "valid",
              "null",
              documentPlace
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
        <span onClick={() => getEncounterDetails(res)}>
          <span
            className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
          >
            <i>
              <CalendarOutlined className={visitStyles.calenderIcon} />
            </i>
            {moment(res).format("MMM DD")}
          </span>
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDetails = async (date) => {
    var date = moment(date).format("DD");
    highlight({
      keyword: date,
    });
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

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  const getCaptureSectionBackgroundMeat = (
    value,
    dis,
    radiology,
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
          onClick={() =>
            handleOpenModalRadiologyMeat(value, dis, radiology, meatresult)
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheaderMeat}`}
        >
          {value}
        </span>
      );
      return sectionMapArr;
    }
  };

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var sectionMapArr = (
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
      );
      return sectionMapArr;
    });
  };

  useEffect(() => {
    var tenId = localStorage.getItem("tenantId");
    if (patientDetailsRadiology?.radiologyFileDetail) {
      getPatientPdfFileRadiology(
        patientDetailsRadiology?.radiologyFileDetail[0]?.azureBlobPath,
        tenId
      );
    }
  }, [activeTabNumber]);

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
        <div className={visitStyles.container}>
          {meatCriteriaListRadiology.length != 0 ? (
            <div className={visitStyles.hccStickey_head}>
              {meatCriteriaListRadiology?.map((item) => {
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
                            item.radiology,
                            item
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
                            item.radiology,
                            item
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
                            item.radiology,
                            item
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
                            item.radiology,
                            item
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
                            onchangeMeat(item.diseaseName, item.diagnosisCode)
                          }
                        >
                          <div className={visitStyles.close_icon}>
                            <FontAwesomeIcon
                              icon={faArrowsAlt}
                              style={{ size: 8, color: "#a80404" }}
                            />
                          </div>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                );
              })}

              {meatCriteriaListRadiology.length == 0 ? (
                <div className="card combo-card">
                  <div className="col-xl-12">
                    <div>
                      <span className="no-patient-data">NO DATA</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Modals */}

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

      <Modal
        title={selectMeatName}
        // title="Pdf Test"
        centered
        open={isModalOpenRadiologyMeat}
        // style={{ top: 5 }}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        width="90%"
        footer={false}
        // height={400}
      >
        <div className="section-container">
          <div className="my-post-content pt-3">
            <div className="row">
              <div className="col-xl-4">
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-6">
                      <label>Codes</label>
                    </div>
                    <div className="col-xl-6">
                      <label>Description</label>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-6 d-grid">
                      <span className="font-bold">
                        {selectMeatResult?.diagnosisCode}
                      </span>
                      {selectMeatResult?.category == "Valid" ? (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validmeat`}
                        >
                          {selectMeatResult?.category}
                        </Badge>
                      ) : (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validUnmatch`}
                        >
                          {selectMeatResult?.category}
                        </Badge>
                      )}
                    </div>
                    <div className="col-xl-6 d-grid">
                      <Popover
                        placement="topLeft"
                        title="Description"
                        content={selectMeatResult?.diseaseName}
                      >
                        <span className="meat-name-details2">
                          {selectMeatResult?.diseaseName}
                        </span>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Monitor</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.monitor != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Monitor"
                          content={selectMeatResult?.monitor}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.monitor}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.monitorCapturedFromHeader,
                          selectMeatResult?.monitor,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Evaluation</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.evaluate != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Evaluation"
                          content={selectMeatResult?.evaluate}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.evaluate}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.evaluateCapturedFromHeader,
                          selectMeatResult?.evaluate,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Assessment</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.assessment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Assessment"
                          content={selectMeatResult?.assessment}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.assessment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.assessmentCapturedFromHeader,
                          selectMeatResult?.assessment,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Treatment</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.treatment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Treatment"
                          content={selectMeatResult?.treatment}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.treatment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.treatmentCapturedFromHeader,
                          selectMeatResult?.treatment,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="card-body p-0 z-index-low">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                    <div
                      style={{
                        height: "80vh",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {" "}
                      <Viewer
                        fileUrl={selectFileURLRadiology}
                        plugins={[defaultLayoutPluginInstance]}
                        onDocumentLoad={handleDocumentLoad}
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
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Meat;
