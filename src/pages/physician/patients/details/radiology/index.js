import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import NavBar from "../../../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
// import LoadingSpinner from "../../../../jsx/components/spinner/spinner";
import visitStyles from "../../../../../styles/visitdata.module.css";
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
import Select from "react-select";
import { Modal } from "antd";
import { Button } from "react-bootstrap";

import { Space, Spin } from "antd";
// import { searchPlugin ,NextIcon, PreviousIcon, RenderSearchProps,} from '@react-pdf-viewer/search';
import { Icon, MinimalButton, Position } from "@react-pdf-viewer/core";
import {
  NextIcon,
  PreviousIcon,
  RenderSearchProps,
  searchPlugin,
} from "@react-pdf-viewer/search";
import Form from "react-bootstrap/Form";
import { Offcanvas } from "react-bootstrap";
import { InfoCircleOutlined, DownOutlined } from "@ant-design/icons";
import Link from "next/link";
import { notification } from "antd";
// import { C } from "@fullcalendar/core/internal-common";

import { actions as patientActions } from "../../../../../stores/patients";
import { connect } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Avatar, Tooltip } from "antd";

const Radiology = ({}) => {
  const navigate = useRouter();
  let searchKeywords = [];

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
  }, []);

  const getPatientDetailsRadiologyYear = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`
    );
    // const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
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

        var invalidDisArray = [];
        invalidDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          invalidDisArray.push({
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

        setCaptureSectionMatching(capturedSectionsColorsMatching);
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
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data.response;
      setSelectFileURLRadiology(response.data.response);
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
  const handleOpenModalCombinationCode = (
    value,
    disDescription,
    check,
    whereCome,
    documentPlace
  ) => {
    handleOpenModalRadiology(value, disDescription, true);
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
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var disCode = result[0]?.diagnosisCode;

      var sectionMapArr = (
        <Badge
          onClick={() => findValueDocument(disCode, res)}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader} ${backColor}`}
        >
          {res}
        </Badge>
      );
      return sectionMapArr;
    });
  };

  const getCaptureSectionBackground = (value, documentPlace) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var disCode = result[0]?.diagnosisCode;

      var sectionMapArr = (
        <Badge
          onClick={() =>
            handleOpenModalCombinationCode(
              disCode,
              res,
              "valid",
              "null",
              documentPlace
            )
          }
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader} ${backColor}`}
        >
          {res}
        </Badge>
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

        <Badge
          className={`mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res).format("MMM DD")}
        </Badge>
      );
      return sectionMapArr;
    });
  };

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1">
            <Tab.Container defaultActiveKey={activeTabHead}>
              <div className="row">
                <div className="col-xl-11">
                  <Nav as="ul" className="nav nav-tabs">
                  <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="file"
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
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
                </div>
                <div className="col-xl-1">
                  <div className={visitStyles.sideHeaderTitle}>
                    <span>RADIOLOGY</span>
                  </div>
                </div>
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
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.hcc_title_badge}`}
                                >
                                  {newValidDiseaseListRadiology.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              {newValidDiseaseListRadiology.map((data, i) => (
                                <li>
                                  <div className={`${visitStyles.hcc_card}`}>
                                    <div
                                      className={`${visitStyles.hcc_card_nameHead}`}
                                    >
                                      <div
                                        className="media-body"
                                        onClick={() =>
                                          handleOpenModalRadiology(
                                            data.diagnosisCode,
                                            data.actualDescription,
                                            true
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
                                        title="You want to delete?"
                                        description={data.diagnosisCode}
                                        onConfirm={confirmvalid}
                                        placement="leftTop"
                                        okText="Yes"
                                        cancelText="No"
                                        onOpenChange={() =>
                                          onchangeValid(data.diagnosisCode)
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
                                      <div>
                                        {getCaptureSectionBackground(
                                          data.capturedSections,
                                          "Radio"
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
                                NON-HCC
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.suggested_title_badge}`}
                                >
                                  {newInValidDiseaseListRadiology.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              {newInValidDiseaseListRadiology.map((data, i) => (
                                <li>
                                  <div className={`${visitStyles.hcc_card}`}>
                                    <div
                                      className={`${visitStyles.hcc_card_nameHead}`}
                                    >
                                      <div
                                        className="media-body"
                                        onClick={() =>
                                          handleOpenModalRadiology(
                                            data.diagnosisCode,
                                            data.actualDescription,
                                            true
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
                                        title="You want to delete?"
                                        description={data.diagnosisCode}
                                        onConfirm={confirmvalid}
                                        placement="leftTop"
                                        okText="Yes"
                                        cancelText="No"
                                        onOpenChange={() =>
                                          onchangeValid(data.diagnosisCode)
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
                                      <div>
                                        {getCaptureSectionBackground(
                                          data.capturedSections,
                                          "Radio"
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
                                  {invalidMoveDiseasesList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              {invalidMoveDiseasesList.map((data, i) => (
                                <li>
                                  <div className="timeline-panel invalid-disease">
                                    <div className="media-body">
                                      <span className="mb-1 disease-name d-flex">
                                        <span className="valid-dis-name">
                                          {data.diagnosisCode}
                                        </span>{" "}
                                        - {data.actualDescription}
                                      </span>
                                    </div>
                                    <Popover
                                      content={data.dbDescription}
                                      title={data.diagnosisCode}
                                      placement="bottom"
                                      trigger="click"
                                    >
                                      <div className="icon-box  bg-danger-light me-1">
                                        <FontAwesomeIcon
                                          icon={faInfo}
                                          style={{
                                            color: "blue",
                                          }}
                                        />
                                      </div>
                                    </Popover>
                                    <Popconfirm
                                      title="You want move to valid?"
                                      description={data.diagnosisCode}
                                      onConfirm={confirmInvalidMoveDis}
                                      placement="leftTop"
                                      okText="Yes"
                                      cancelText="No"
                                      onOpenChange={() =>
                                        onchangeValid(data.diagnosisCode)
                                      }
                                    >
                                      <div className="icon-box  bg-danger-light me-1">
                                        <FontAwesomeIcon
                                          icon={faCheck}
                                          style={{
                                            color: "orange",
                                          }}
                                        />
                                      </div>
                                    </Popconfirm>
                                  </div>
                                </li>
                              ))}
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
                          {comboDiseaseCodesListRadiology.length != 0 ? (
                            <div className={visitStyles.container}>
                              <div className={visitStyles.hccStickey_head}>
                                {comboDiseaseCodesListRadiology?.map((item) => {
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

                          {comboDiseaseCodesListRadiology.length == 0 ? (
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
                  {/* <div className="my-post-content pt-3">
                                        <div
                                          className={visitStyles.combo_head_card}
                                        >
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
                                                  onClick={() =>
                                                    addValidDiseases()
                                                  }
                                                  className="btn bg-white hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faAdd}
                                                    fontSize={11}
                                                    color="blue"
                                                  />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {comboDiseaseCodesListRadiology?.map(
                                          (item) => {
                                            return (
                                              <div className="card combo-card">
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
                                                    <span>
                                                      {item.diseaseName}
                                                    </span>
                                                  </div>
                                                  <div className="col-xl-1 comboclose">
                                                    <Popconfirm
                                                      title="You want move to Invalid?"
                                                      description={
                                                        item.diseaseName
                                                      }
                                                      onConfirm={
                                                        confirmComboInvalid
                                                      }
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
                                                      <div className="icon-box  bg-danger-light me-1">
                                                        <FontAwesomeIcon
                                                          icon={faClose}
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        />
                                                      </div>
                                                    </Popconfirm>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}

                                        {comboDiseaseCodesListRadiology.length ==
                                          0 ? (
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

                                        {invalidComboDiseaseCodesList.length !=
                                          0 ? (
                                          <>
                                            <div className="invalid-combo">
                                              <span>Invalid Combo Diseases </span>
                                            </div>

                                            {invalidComboDiseaseCodesList?.map(
                                              (item) => {
                                                return (
                                                  <div className="card combo-card">
                                                    <div className="row">
                                                      <div className="col-xl-3">
                                                        <span className="font-bold">
                                                          {
                                                            item.diagnosisCodeCombo
                                                          }
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <span className="font-bold">
                                                          {item.addOnCode}
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-5">
                                                        <span>
                                                          {item.diseaseName}
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-1 comboclose">
                                                        <Popconfirm
                                                          title="You want move to Valid?"
                                                          description={
                                                            item.diseaseName
                                                          }
                                                          onConfirm={
                                                            confirmComboValid
                                                          }
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
                                                          <div className="icon-box  bg-danger-light me-1">
                                                            <FontAwesomeIcon
                                                              icon={faCheck}
                                                              style={{
                                                                color: "orange",
                                                              }}
                                                            />
                                                          </div>
                                                        </Popconfirm>
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </>
                                        ) : null}
                                      </div> */}
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
                                    <Badge
                                      className="badge-meat cr-pointer badge-circle mt-2"
                                      bg={` badge-circle mt-2 ${item.monitorCapturedFromHeaderColor} `}
                                      onClick={() =>
                                        handleOpenModalRadiology(
                                          item.monitorCapturedFromHeader,
                                          item.monitor,
                                          item.radiology
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
                                        handleOpenModalRadiology(
                                          item.monitorCapturedFromHeader,
                                          item.monitor,
                                          item.radiology
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
                                        handleOpenModalRadiology(
                                          item.monitorCapturedFromHeader,
                                          item.monitor,
                                          item.radiology
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
                                        handleOpenModalRadiology(
                                          item.monitorCapturedFromHeader,
                                          item.monitor,
                                          item.radiology
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
                                  <span className="no-patient-data">
                                    NO DATA
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* <div className="my-post-content pt-3">
                                        <div
                                          className={visitStyles.meat_head_card}
                                        >
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
                                        {meatCriteriaListRadiology?.map(
                                          (item) => {
                                            return (
                                              <div
                                                className={
                                                  item.isMeatCriteriaPresent ===
                                                    true
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
                                                        handleOpenModalRadiology(
                                                          item.monitorCapturedFromHeader,
                                                          item.monitor
                                                        )
                                                      }
                                                    >
                                                      {
                                                        item.monitorCapturedFromHeader
                                                      }
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
                                                        handleOpenModalRadiology(
                                                          item.evaluateCapturedFromHeader,
                                                          item.evaluate
                                                        )
                                                      }
                                                    >
                                                      {
                                                        item.evaluateCapturedFromHeader
                                                      }
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
                                                        handleOpenModalRadiology(
                                                          item.assessmentCapturedFromHeader,
                                                          item.assessment
                                                        )
                                                      }
                                                    >
                                                      {
                                                        item.assessmentCapturedFromHeader
                                                      }
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
                                                        handleOpenModalRadiology(
                                                          item.treatmentCapturedFromHeader,
                                                          item.treatment
                                                        )
                                                      }
                                                    >
                                                      {
                                                        item.treatmentCapturedFromHeader
                                                      }
                                                    </Badge>
                                                  </div>
                                                 
                                                  <div className="col-xl-1 meatclose">
                                                   
                                                    <Popconfirm
                                                      title="You want move to Invalid?"
                                                      description={
                                                        item.diseaseName
                                                      }
                                                      onConfirm={
                                                        confirmInvalidMeat
                                                      }
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
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        />
                                                      </div>
                                                    </Popconfirm>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                        {meatCriteriaListRadiology.length == 0 ? (
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
                                      </div> */}
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="file">
                  <div className="my-post-content pt-3">
                    <div className="radiology-select-dos">
                      {radiologyFileDetailCheck ? (
                        <Select
                          onChange={(e) => dosOnChangeRadiologyFile(e)}
                          options={radiologyFileDateofServieList}
                          className="custom-react-select"
                          defaultValue={radiologyFileDateDefaulteSelect}
                          isSearchable={false}
                        />
                      ) : (
                        <div></div>
                      )}
                      <button
                        onClick={() => openNewTabDownloadPdfradiology()}
                        className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                      >
                        Open New Tab
                      </button>
                    </div>
                    <div className="row">
                      <div className="col-xl-2">
                        <ul className="timeline">
                          <div
                            className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                          >
                            <span className={`${visitStyles.hcc_title_name}`}>
                              HCC
                            </span>
                            <div className="d-flex justify-content-center">
                              <span
                                className={`${visitStyles.hcc_title_badge}`}
                              >
                                {newValidDiseaseListRadiology.length}
                              </span>
                            </div>
                          </div>

                          {newValidDiseaseListRadiology.map((data, i) => (
                            <li>
                              <div className={`${visitStyles.hcc_card}`}>
                                <div
                                  className={`${visitStyles.hcc_card_nameHead}`}
                                >
                                  <div
                                    className="media-body"
                                    onClick={() =>
                                      findValueDocument(
                                        data.diagnosisCode,
                                        data.actualDescription
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
                                    title="You want to delete?"
                                    description={data.diagnosisCode}
                                    onConfirm={confirmvalid}
                                    placement="leftTop"
                                    okText="Yes"
                                    cancelText="No"
                                    onOpenChange={() =>
                                      onchangeValid(data.diagnosisCode)
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
                                <div
                                  className={`${visitStyles.hoverActiveHcc}`}
                                >
                                  {getEncounterDateBackground(
                                    data.encounterDateSplit
                                  )}
                                  <div>
                                    {getCaptureSectionBackgroundFile(
                                      data.capturedSections,
                                      "Radio"
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-xl-8">
                        <div className="card-body p-0 z-index-low">
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                            <div
                              style={{
                                height: "62vh",
                                maxWidth: "1000px",
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
                      <div className="col-xl-2">
                        <div className="">
                          <ul className="timeline">
                            <div
                              className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                            >
                              <span
                                className={`${visitStyles.suggested_title_name}`}
                              >
                                NON-HCC
                              </span>
                              <div className="d-flex justify-content-center">
                                <span
                                  className={`${visitStyles.suggested_title_badge}`}
                                >
                                  {newInValidDiseaseListRadiology.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.suggestedcontainer2}>
                              <div className={visitStyles.hccStickey_head}>
                                {newInValidDiseaseListRadiology.map(
                                  (data, i) => (
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
                                              findValueDocument(
                                                data.diagnosisCode,
                                                data.actualDescription
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
                                            title="You want to delete?"
                                            description={data.diagnosisCode}
                                            onConfirm={confirmvalid}
                                            placement="leftTop"
                                            okText="Yes"
                                            cancelText="No"
                                            onOpenChange={() =>
                                              onchangeValid(data.diagnosisCode)
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
                                          {getEncounterDateBackground(
                                            data.encounterDateSplit
                                          )}
                                          <div>
                                            {getCaptureSectionBackgroundFile(
                                              data.capturedSections,
                                              "Radio"
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                )}
                              </div>
                            </div>
                          </ul>
                        </div>

                        <div className="">
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
                                  {invalidMoveDiseasesList.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.suggestedcontainer2}>
                              <div className={visitStyles.hccStickey_head}>
                                {invalidMoveDiseasesList.map((data, i) => (
                                  <li>
                                    <div className="timeline-panel invalid-disease">
                                      <div className="media-body">
                                        <span className="mb-1 disease-name d-flex">
                                          <span className="valid-dis-name">
                                            {data.diagnosisCode}
                                          </span>{" "}
                                          - {data.actualDescription}
                                        </span>
                                      </div>
                                      <Popover
                                        content={data.dbDescription}
                                        title={data.diagnosisCode}
                                        placement="bottom"
                                        trigger="click"
                                      >
                                        <div className="icon-box  bg-danger-light me-1">
                                          <FontAwesomeIcon
                                            icon={faInfo}
                                            style={{
                                              color: "blue",
                                            }}
                                          />
                                        </div>
                                      </Popover>
                                      <Popconfirm
                                        title="You want move to valid?"
                                        description={data.diagnosisCode}
                                        onConfirm={confirmInvalidMoveDis}
                                        placement="leftTop"
                                        okText="Yes"
                                        cancelText="No"
                                        onOpenChange={() =>
                                          onchangeValid(data.diagnosisCode)
                                        }
                                      >
                                        <div className="icon-box  bg-danger-light me-1">
                                          <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{
                                              color: "orange",
                                            }}
                                          />
                                        </div>
                                      </Popconfirm>
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
              </Tab.Content>
            </Tab.Container>
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
                      onDocumentLoad={handleDocumentLoad}
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
    </>
  );
};

export default Radiology;
