import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import NavBar from "../../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
// import LoadingSpinner from "../../../../jsx/components/spinner/spinner";
import visitStyles from "../../../../styles/visitdata.module.css";
import { InputText } from "primereact/inputtext";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import TableStyle from "../../../../components/table/table.module.css";


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
} from "@fortawesome/free-solid-svg-icons";
import {
  CalendarOutlined
} from '@ant-design/icons';
import { QuestionCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Divider, Popover, Menu, DatePicker, Dropdown } from "antd";
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
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

import { actions as patientActions } from "../../../../stores/patients";
import { connect } from "react-redux";
import Image from 'next/image';
import { useRouter } from "next/navigation";

import { Avatar, Tooltip } from 'antd';
// import Spinner from "../../../../components/spinner/spinner";
import Footer from "../../../../jsx/layouts/Footer";

import Spinner from "../../../../components/spinner/spinner";



const Details = ({ }) => {
  const navigate = useRouter();
  let searchKeywords = [];
  // const searchPluginInstance = searchPlugin({
  //   // keyword: [
  //   //   'document',
  //   //   {
  //         keyword: 'Assessment',
  //         matchCase: true,
  //     // },
  // // ],
  // })

  const searchPluginInstance = searchPlugin({
    // keyword: 'Plan / Discussion',
    matchCase: true,
    wholeWords: true,
  });
  const { RangePicker } = DatePicker;
  const { highlight, Search } = searchPluginInstance;
  const { ShowSearchPopoverButton } = searchPluginInstance;
  const [searchPluginInstanceLocal, setSearchPluginInstanceLocal] =
    useState(searchPluginInstance);

  const sideMenu = useSelector((state) => state.sideMenu);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
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
  const [activeTabHead, setActiveTabHead] = useState("validDiseases");

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
    comments: ""
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
  const [sideNavLabelActiveKey, setSideNavLabelActiveKey] = useState("HCC")
  const [isSideNavShow, setIsSideNavShow] = useState(false);
  const [timelineData, setTimeLineData] = useState([])
  const [flagTagActive, setFlagTagActive] = useState(true)
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [patienIdDetails, setPatienIdDetails] = useState('');
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

  // const [captureValidSuggested, setCaptureValidSuggested] = useState([]);
  // const [encounterDateValidSuggested, setEncounterDateValidSuggested] = useState([]);
  // const [captureSectionInvalidDis, setCaptureInvalidDis] = useState([]);
  // const [encounterDateInvalidDis, setEncounterDateInvalidDis] = useState([]);








  const handleAddButtonClick = () => {
    setIsAddButtonClicked(true);
  };

  const statusList = [
    { name: "John", status: "pending" },
    { name: "Jane", status: "processing" },
    { name: "Doe", status: "completed" },
    // Add more names with their respective statuses
  ];


  var userSpinner = (
    <div className={visitStyles.userDetailsCard}>
      <FontAwesomeIcon icon={faUserCircle} />
    </div>
  );

  const flagPostList = [
    { value: "PATIENT_NAME_MISSED", label: <>PATIENT_NAME_MISSED <i className={visitStyles.name_missed}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "PATIENT_DOB_MISSED", label: <>PATIENT_DOB_MISSED <i className={visitStyles.dob_missed}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "MRN_ID_MISMATCH", label: <>MRN_ID_MISMATCH <i className={visitStyles.id_missed}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "PROVIDER_SIGN_MISSED", label: <>PROVIDER_SIGN_MISSED <i className={visitStyles.sign_missed}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "PROVIDER_SIGNATURE_MISSED", label: <>PROVIDER_SIGNATURE_MISSED <i className={visitStyles.signature_missed}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "PROVIDER_CREDENTIAL_MISSED", label: <>PROVIDER_CREDENTIAL_MISSED <i className={visitStyles.cred_missed}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "PROVIDER_SIGN_STATUS_PENDING", label: <>PROVIDER_SIGN_STATUS_PENDING <i className={visitStyles.sign_status}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "NO_HCC_FOUND", label: <>NO_HCC_FOUND <i className={visitStyles.no_hcc_found}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "NO_VALID_DOCUMENT_FOUND", label: <>NO_VALID_DOCUMENT_FOUND <i className={visitStyles.no_doc_found}>{SVGICON.emptyFlagSmall}</i> </> },
    { value: "PATIENT_DISEASED", label: <>PATIENT_DISEASED <i className={visitStyles.patient_diseased}>{SVGICON.emptyFlagSmall}</i> </> },
  ];

  const filterChangePatientId = async (e) => {
    setFilter(e.target.value);
    var value = e.target.value;
    if(value){
    const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/search?searchtext=${value}&pageno=${0}&pagesize=${50}`);
    var result = response.data.content;
    setPatientList(result)
    }else{
      const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/filter?userId=${localUserId}&page=${0}&size=${20}`);
      var result = response.data.content;
      setPatientList(result)
    }
  };

  const handleFilterClick = () => {
    setShowIcons(!showIcons);
  };
  const handleShowCard = () => {
    setShowCard(!showCard);
    setShowCard(true);
  };

  const filterNamesByStatus = (status) => {
    return statusList.filter((name) => name.status === status);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value);
    }

    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const hidePopover = () => {
    setOpenPopover(false);
  };

  const handleOpenChangePopover = (newOpen) => {
    setOpenPopover(newOpen);
  };

  //   highlight([
  //     'document',
  //     {
  //         keyword: 'PDF',
  //         matchCase: true,
  //     },
  // ]);

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
    // setTimeout(() => {
    //   highlight({
    //     keyword: selectDiseasesName,
    //     matchCase: true,
    //   });
    // }, 6000);
  };

  const changeSearch = () => {
    //   searchPlugin({
    //     keyword: 'BMP',
    //     matchCase: true,
    // });
    setDocumentLoaded(true);
    setTimeout(() => {
      highlight({
        keyword: "BMP",
        matchCase: true,
      });
    }, 1000);
  };

  useEffect(() => {
    // loadFilterPatientList();
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    setLocalOrgId(orgId);
    getPatientDetails(patientId, orgId, tenId);
    getPatientIdDetails(patientId);
    // getPatientDetailsRadiology(orgId, tenId);
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
    setCurrentTime(currentTime)

    setUserDetails(userSpinner);

    setvalidHccDetails(userSpinner)


  }, []);

  const getYearOfService = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
    }
  };

  const submitYearOfService = async (year) => {
    var data = {
      yearOfService: year,
    };

    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc + `aiservice/ai/upload`,
      data
    );
  };

  const getPatientIdDetails = async (patientId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/patient/get?patientId=${patientId}`
    );
    setPatienIdDetails(response.data);
    console.log(response.data)
    var result = response.data;


    const menu = (
      <Menu>
        {result.processedStatus != "HOLD" ?
          <Menu.Item key='1' onClick={() => handleActionClick("HOLD")}>
            <div className="patient-status">
              <span className={`badge hold-text`} >HOLD</span>
            </div>
          </Menu.Item> : null}
        {result.processedStatus != "PENDING" ?
          <Menu.Item key='2' onClick={() => handleActionClick("PENDING")}>
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item> : null}
        {result.processedStatus != "DECLINE" ?
          <Menu.Item key='3' onClick={() => handleActionClick("DECLINE")}>
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>DECLINE</span>

            </div>
          </Menu.Item> : null}

        {result.processedStatus != "COMPLETE" ?
          <Menu.Item key='4' onClick={() => handleActionClick("COMPLETE")}>
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETE</span>
            </div>
          </Menu.Item> : null}
      </Menu>
    );

    const menu2 = (
      <Menu>
        {result.processedStatus != "HOLD" ?
          <Menu.Item key='1' onClick={() => handleActionClick("HOLD")}>
            <div className="patient-status">
              <span className={`badge hold-text`} >HOLD</span>
            </div>
          </Menu.Item> : null}
        {result.processedStatus != "PENDING" ?
          <Menu.Item key='2' onClick={() => handleActionClick("PENDING")}>
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item> : null}
        {result.processedStatus != "DECLINE" ?
          <Menu.Item key='3' onClick={() => handleActionClick("DECLINE")}>
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>DECLINE</span>

            </div>
          </Menu.Item> : null}

        {result.processedStatus != "COMPLETE" ?
          <Menu.Item key='4' onClick={() => handleActionClick("COMPLETE")}>
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETE</span>
            </div>
          </Menu.Item> : null}
        <Menu.Item key='5' onClick={() => handleActionClick("ADD RADIOLOGY")}>
          <div className="patient-status">
            <span className={`badge  ${visitStyles.add_text}`}>+ ADD RADIOLOGY</span>
          </div>
        </Menu.Item>
      </Menu>
    );
    const menu3 = (
      <Menu>
        {result.processedStatus != "HOLD" ?
          <Menu.Item key='1' onClick={() => handleActionClick("HOLD")}>
            <div className="patient-status">
              <span className={`badge hold-text`} >HOLD</span>
            </div>
          </Menu.Item> : null}
        {result.processedStatus != "PENDING" ?
          <Menu.Item key='2' onClick={() => handleActionClick("PENDING")}>
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item> : null}
        {result.processedStatus != "DECLINE" ?
          <Menu.Item key='3' onClick={() => handleActionClick("DECLINE")}>
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>DECLINE</span>

            </div>
          </Menu.Item> : null}

        {result.processedStatus != "COMPLETE" ?
          <Menu.Item key='4' onClick={() => handleActionClick("COMPLETE")}>
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETE</span>
            </div>
          </Menu.Item> : null}
        <Menu.Item key='5' onClick={() => handleActionClick("ADD LAB")}>
          <div className="patient-status">
            <span className={`badge  ${visitStyles.add_text}`}>+ ADD LAB</span>
          </div>
        </Menu.Item>
      </Menu>
    );



    setActionItems(menu);
    setActionItems2(menu2);
    setActionItems3(menu3);
  }

  const getYearOfServiceDetails = async (year) => {
    var patientId = localStorage.getItem("patientId");
    // const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
    // if (response.data) {
    //   if(response.data != null){
    //   }else{
    //    submitYearOfService(year)
    //   }
    // }
  };
  const statuses = ["PENDING", "COMPLETED", "HOLD", "DECLINED"];
  const getPatientDetails = async (patientId, orgId, tenId) => {

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
      var result = response.data;
      console.log(result)
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

        getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId);
        setSelectMeatFileId(response.data.fileId);
        // setPatientDocumentResult(result);

        result.encounterYears.map((res) => {
          dosYearArr.push({ value: res, label: res });
        });

        const highestDOS = Math.max(...dosYearArr.map((res) => res.value));
        // setSelectedDosValue(dosYearArr[0].value);
        // console.log(highestDOS)

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
          const encounterDatearray = res.encounterDate.split(',');
          validDisArray.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition
          });

        });

        result.invalidDisease.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(',');
          invalidDiseaseNewRes.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition
          });

        });


        if (result.deletedDiseases != null) {
          result.deletedDiseases.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
            deleteHccList.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
              isManuallyAdded: res.isManuallyAdded,
              isHccValid: res.isHccValid,
              defaultPosition: res.defaultPosition
            });

          });
        }
        if (result.suggestRadiology != null) {
          // var checkDosRadio = [];
          // for (var key in result.suggestRadiology) {
          //   checkDosRadio.push({ value: key, label: key });
          // }
          suggestRadiologyList = result.suggestRadiology;
          suggestRadiologyList.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Radio",
              isHccValid: true,
            });
          });
        }

        if (result.suggestLab != null) {
          suggestLabList = result.suggestLab;
          suggestLabList.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Lab",
              isHccValid: true,
            });
          });
        }

        if (result.unMatchedDisease != null) {
          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
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
          validDiseasesArray.push({ name: validDis[key] });
        }

        // for (var key in result.validDisease) {
        //   validDis = result.validDisease[key];
        //   if (result.rafScore != null) {
        //     rafScore = result.rafScore[key]
        //   }
        // }
        // for (var key in result.invalidDisease) {
        //   invalidDis = result.invalidDisease[key];
        // }
        // for (var key in result.comboDisease) {
        //   comboDis = result.comboDisease[key];
        // }
        // for (var key in result.meatCriteria) {
        //   meatCri = result.meatCriteria[key];
        // }

        // var invalidDiseasesArray = [];
        // var validDiseasesArray = [];

        // for (var key in invalidDis) {
        //   invalidDiseasesArray.push({ name: invalidDis[key] });
        // }
        // for (var key in validDis) {
        //   validDiseasesArray.push({ name: validDis[key] });
        // }


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


        console.log(validDisArray);


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
          "sectionTag8"
        ];


        const COLORS3 = [
          "encounterDateTag1",
          "encounterDateTag2",
          "encounterDateTag3",
          "encounterDateTag4",
          "encounterDateTag5",
          "encounterDateTag6",
          "encounterDateTag7",
          "encounterDateTag8"
        ];

        validDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              "diagnosisCode": res.diagnosisCode,
            });
            
          })
        })
        invalidDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              "diagnosisCode": res.diagnosisCode,
            });

          })
        })

        suggestListAll.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              "diagnosisCode": res.diagnosisCode,
            });

          })
        })

        var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

        dublicateSectionArr.map((res, index) => {
          capturedSectionsColorsMatching.push({
            "name": res.name,
            "diagnosisCode": res.diagnosisCode,
            "colors": COLORS2[index]
          });
        })
        setCaptureSectionMatching(capturedSectionsColorsMatching);



        var encounterDateColorsMatching = [];
        var encounterDateArr = [];

        validDiseaseNewRes.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })

        result.invalidDisease.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })

        result.unMatchedDisease.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })
        result.suggestRadiology?.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })

        result.suggestLab?.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })


        console.log(encounterDateArr)


        var encounterDateArrDublicatesRemove = getUniqueListBy(encounterDateArr, "name");

        encounterDateArrDublicatesRemove.map((res, index) => {
          encounterDateColorsMatching.push({
            "name": res.name,
            "colors": COLORS3[index]
          });
        })

        setEncounterDateMatching(encounterDateColorsMatching);


        console.log(capturedSectionsColorsMatching)
        console.log(encounterDateColorsMatching)




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
  const getPatientDetailsYear = async (patientId, orgId, tenId, year) => {
    setSelectedDosValue(year);
    setNewValidDiseaseList([]);
    setInNewValidDiseaseList([]);
    setNewUnMatchHccList([]);
    setValidDiseasesList([]);
    setInvalidDiseasesList([]);
    setComboDiseaseCodesList([]);
    // setDosYear([]);
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
      `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}&year=${year}`
    );
    console.log(response.data)
    if (response.data) {
      var result = response.data;
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

        getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId);
        setSelectMeatFileId(response.data.fileId);
        // setPatientDocumentResult(result);

        // result.encounterYears.map((res) => {
        //   dosYearArr.push({ value: res, label: res });
        // });

        // const highestDOS = Math.max(...dosYearArr.map((res) => res.value));
        // setSelectedDosValue(dosYearArr[0].value);

        // const highestDosValue = dosYearArr.filter(
        //   (i) => parseInt(i.value) === highestDOS
        // );
        // setDosYearDefalutSelect(dosYearArr[0]);


        if (result.rafScore != null) {
          rafScore = result.rafScore;
        }

        validDis = result.validDisease;
        validDiseaseNewRes = result.validDisease;
        // invalidDiseaseNewRes =validDisArray;
        var validDisArray = [];
        var validEncounterDateArray = [];
        validDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(',');
          validDisArray.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition
          });

        });

        result.invalidDisease.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(',');
          invalidDiseaseNewRes.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition
          });

        });


        if (result.deletedDiseases != null) {
          result.deletedDiseases.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
            deleteHccList.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
              isManuallyAdded: res.isManuallyAdded,
              isHccValid: res.isHccValid,
              defaultPosition: res.defaultPosition
            });

          });
        }
        if (result.suggestRadiology != null) {
          // var checkDosRadio = [];
          // for (var key in result.suggestRadiology) {
          //   checkDosRadio.push({ value: key, label: key });
          // }
          suggestRadiologyList = result.suggestRadiology;
          suggestRadiologyList.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
              getPlace: "Radio",
              isHccValid: true,
            });
          });
        }

        if (result.suggestLab != null) {
          suggestLabList = result.suggestLab;
          suggestLabList.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Lab",
              isHccValid: true,
            });
          });
        }

        if (result.unMatchedDisease != null) {
          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(',');
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
          validDiseasesArray.push({ name: validDis[key] });
        }

        // for (var key in result.validDisease) {
        //   validDis = result.validDisease[key];
        //   if (result.rafScore != null) {
        //     rafScore = result.rafScore[key]
        //   }
        // }
        // for (var key in result.invalidDisease) {
        //   invalidDis = result.invalidDisease[key];
        // }
        // for (var key in result.comboDisease) {
        //   comboDis = result.comboDisease[key];
        // }
        // for (var key in result.meatCriteria) {
        //   meatCri = result.meatCriteria[key];
        // }

        // var invalidDiseasesArray = [];
        // var validDiseasesArray = [];

        // for (var key in invalidDis) {
        //   invalidDiseasesArray.push({ name: invalidDis[key] });
        // }
        // for (var key in validDis) {
        //   validDiseasesArray.push({ name: validDis[key] });
        // }


        setNewValidDiseaseList(validDisArray);
        setInNewValidDiseaseList(invalidDiseaseNewRes);
        setNewUnMatchHccList(suggestListAll);
        setValidDiseasesList(validDiseasesArray);
        setInvalidDiseasesList(invalidDiseasesArray);
        setComboDiseaseCodesList(comboDis);
        setRAFScore(rafScore);
        setSuggestedNonHccList(suggestListAllNonHcc);
        setSuggestedHccList(suggestListAll);
        setDeletedHccList(deleteHccList);


        console.log(validDisArray);


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
          "sectionTag8"
        ];


        const COLORS3 = [
          "encounterDateTag1",
          "encounterDateTag2",
          "encounterDateTag3",
          "encounterDateTag4",
          "encounterDateTag5",
          "encounterDateTag6",
          "encounterDateTag7",
          "encounterDateTag8"
        ];

        validDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              "diagnosisCode": res.diagnosisCode,
            });

          })
        })
        invalidDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              "diagnosisCode": res.diagnosisCode,
            });

          })
        })

        suggestListAll.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              "diagnosisCode": res.diagnosisCode,
            });

          })
        })

        var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

        dublicateSectionArr.map((res, index) => {
          capturedSectionsColorsMatching.push({
            "name": res.name,
            "diagnosisCode": res.diagnosisCode,
            "colors": COLORS2[index]
          });
        })
        setCaptureSectionMatching(capturedSectionsColorsMatching);



        var encounterDateColorsMatching = [];
        var encounterDateArr = [];

        validDiseaseNewRes.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })

        result.invalidDisease.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })

        result.unMatchedDisease.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })
        result.suggestRadiology?.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })

        result.suggestLab?.map((res) => {
          const array = res.encounterDate.split(',');
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          })
        })


        console.log(encounterDateArr)


        var encounterDateArrDublicatesRemove = getUniqueListBy(encounterDateArr, "name");

        encounterDateArrDublicatesRemove.map((res, index) => {
          encounterDateColorsMatching.push({
            "name": res.name,
            "colors": COLORS3[index]
          });
        })

        setEncounterDateMatching(encounterDateColorsMatching);


        console.log(capturedSectionsColorsMatching)
        console.log(encounterDateColorsMatching)




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

        // setMeatCriteriaListRadiology(result.meatCriteria)
      }
      if (result.unmatchedDisease != null) {
        setUnMatchHccListRadiology(result.unmatchedDisease);
      }
      // setPatientDetails(result);
    }
  };
  const getPatientDetailsRadiologyYear = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    var result = {
      "patientId": "lenovo-01",
      "patientName": "BERR",
      "dob": "07/04/1953",
      "gender": "Male",
      "age": 70,
      "fileId": [
        "910ead7b-b65f-4ba2-8cc4-a94321971a76"
      ],
      "orgId": "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
      "tenantId": "b4d34e42-79a6-478e-b3af-12ce7311fa09",
      "encounterYears": null,
      "validDisease": {
        "2023": [
          {
            "diagnosisCode": "I6522",
            "actualDescription": "Stenosis of left internal carotid artery",
            "dbDescription": "Occlusion and stenosis of left carotid artery",
            "notes": null,
            "capturedSections": [
              "conclusions, left findings"
            ],
            "encounterDate": "06/03/2023",
            "isManuallyAdded": null,
            "manuallyAddedAt": null,
            "manuallyAddedBy": null,
            "diagnosisCodeFinding": null,
            "isHccValid": null
          },
          {
            "diagnosisCode": "I6521",
            "actualDescription": "Stenosis of right internal carotid artery",
            "dbDescription": "Occlusion and stenosis of right carotid artery",
            "notes": null,
            "capturedSections": [
              "conclusions, right findings"
            ],
            "encounterDate": "06/03/2023",
            "isManuallyAdded": null,
            "manuallyAddedAt": null,
            "manuallyAddedBy": null,
            "diagnosisCodeFinding": null,
            "isHccValid": null
          }
        ]
      },
      "invalidDisease": {
        "2023": []
      },
      "deletedDisease": null,
      "comboDisease": {
        "2023": [
          {
            "diseaseName": "Occlusion and stenosis of bilateral carotid arteries",
            "diagnosisCodeCombo": "I6523",
            "addOnCode": null,
            "encounterDate": "06/03/2023",
            "ruleType": "BILATERAL_RULE_ENGINE"
          }
        ]
      },
      "meatCriteria": {
        "2023": [
          {
            "diseaseName": "Stenosis of left internal carotid artery",
            "diagnosisCode": "I6522",
            "isMeatCriteriaPresent": true,
            "monitorCapturedFromHeader": "Left Findings",
            "monitor": "Doppler flow velocities in the left internal carotid artery (ICA) are consistent with stenosis in the range of 1-39% with mild plaque.",
            "evaluateCapturedFromHeader": "Left Findings",
            "evaluate": "Antegrade left vertebral artery flow.",
            "assessmentCapturedFromHeader": "Conclusions",
            "assessment": "Mild stenosis in the left internal carotid artery (1-39%).",
            "treatmentCapturedFromHeader": "N/A",
            "treatment": "N/A",
            "encounterDate": "06/03/2023",
            "radiology": true
          },
          {
            "diseaseName": "Stenosis of right internal carotid artery",
            "diagnosisCode": "I6521",
            "isMeatCriteriaPresent": true,
            "monitorCapturedFromHeader": "Right Findings",
            "monitor": "Doppler flow velocities in the right internal carotid artery (ICA) are consistent with stenosis in the range of 1-39% with mild plaque.",
            "evaluateCapturedFromHeader": "Right Findings",
            "evaluate": "Antegrade right vertebral artery flow.",
            "assessmentCapturedFromHeader": "Conclusions",
            "assessment": "Mild stenosis in the right internal carotid artery (1-39%).",
            "treatmentCapturedFromHeader": "N/A",
            "treatment": "N/A",
            "encounterDate": "06/03/2023",
            "radiology": true
          }
        ]
      },

      radiologyFileDetail: [
        {
          "active": true,
          "version": 1,
          "createdBy": "anonymousUser",
          "updatedBy": "anonymousUser",
          "fileId": "910ead7b-b65f-4ba2-8cc4-a94321971a76",
          "patientId": "lenovo-01",
          "userId": "uvais01@encipherhealth.onmicrosoft.com",
          "orgId": "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
          "tenantId": "b4d34e42-79a6-478e-b3af-12ce7311fa09",
          "fileName": "consult (1).pdf",
          "documentDos": {
            "06/03/2023": {
              "testName": "Carotid Duplex Ultrasound",
              "pageNumbers": [
                1,
                2
              ]
            }
          },
          "azureBlobPath": "910ead7b-b65f-4ba2-8cc4-a94321971a76.pdf",
          "lastModifiedDate": "2023-11-29T12:24:42.867Z",
          "createdDate": "2023-11-29T12:20:39.135Z"
        }
      ]

    }


    // setPatientDetailsRadiology(result);
    //   setRadiologyResult(result);
    //   if (result.validDisease != null) {
    //     var validDis = "";
    //     var invalidDis = "";
    //     var comboDis = "";
    //     var meatCri = "";
    //     var dosYearArr = [];
    //     var dosYearArrFile = [];
    //     var validDiseaseNewRes = [];
    //     var invalidDiseaseNewRes = [];
    //     var unMatchRes = [];
    //     getPatientPdfFileRadiology(result.radiologyFileDetail[0].azureBlobPath, tenId);
    //     // getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId)

    //     for (var key in result.validDisease) {
    //       dosYearArr.push({ value: key, label: key });
    //     }

    //     var dateofService = dosYearArr[0].value;

    //     const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

    //     const highestDosValue = dosYearArr.filter(
    //       (i) => parseInt(i.value) === highestDOS
    //     );
    //     setDosYearDefalutSelectRadiology(dosYearArr[0]);

    //     if (result.radiologyFileDetail != null) {
    //       for (var key in result.radiologyFileDetail[0].documentDos) {
    //         dosYearArrFile.push({ value: key, label: key });
    //       }

    //       // var fileDetails = result.radiologyFileDetail[dateofService];
    //       setRadiologyFileDateDefaulteSelect(dosYearArrFile[0]);
    //       getPatientPdfFileRadiology(result.radiologyFileDetail[0].azureBlobPath, tenId);
    //     }

    //     validDis = result.validDisease[dateofService];
    //     validDiseaseNewRes = result.validDisease[dateofService];
    //     invalidDiseaseNewRes = result.invalidDisease[dateofService];
    //     if (result.unmatchedDisease != null) {
    //       var unMatchResCheck = result.unmatchedDisease[dateofService];

    //       if (unMatchResCheck != null) {
    //         unMatchRes = result.unmatchedDisease[dateofService];
    //       }
    //     }

    //     invalidDis = result.invalidDisease[dateofService];
    //     comboDis = result.comboDisease[dateofService];
    //     meatCri = result.meatCriteria[dateofService];

    //     setNewValidDiseaseListRadiology(validDiseaseNewRes);
    //     setInNewValidDiseaseListRadiology(invalidDiseaseNewRes);
    //     setUnMatchHccListRadiology(unMatchRes);
    //     setComboDiseaseCodesListRadiology(comboDis);
    //     setDosYearRadiology(dosYearArr);
    //     setFileRadiologyDateofServiceList(dosYearArrFile);

    //     const COLORS = [
    //       "bg-bg-seven",
    //       "bg-third",
    //       "bg-bg-four",
    //       "bg-bg-five",
    //       "bg-bg-six",
    //       "bg-bg-eight",
    //       "bg-bg-nine",
    //       "bg-bg-ten",
    //       "bg-bg-leven",
    //     ];

    //     var meatListArr = [];
    //     var meatMoniterHead = [];
    //     var meatEvaluteHead = [];
    //     var meatAssesmentHead = [];
    //     var meatTreatMentHead = [];
    //     var allMeatHead = [];
    //     var allMeatHeadColorArr = [];
    //     var allMeatHeadColor = [];
    //     var dublicateRemoveSecondArr = [];

    //     meatCri.map((res, index) => {
    //       if (res.monitorCapturedFromHeader != "") {
    //         meatMoniterHead.push({
    //           header: res.monitorCapturedFromHeader,
    //         });
    //       }
    //       if (res.evaluateCapturedFromHeader != "") {
    //         meatEvaluteHead.push({
    //           header: res.evaluateCapturedFromHeader,
    //         });
    //       }
    //       if (res.assessmentCapturedFromHeader != "") {
    //         meatAssesmentHead.push({
    //           header: res.assessmentCapturedFromHeader,
    //         });
    //       }
    //       if (res.treatmentCapturedFromHeader != "") {
    //         meatTreatMentHead.push({
    //           header: res.treatmentCapturedFromHeader,
    //         });
    //       }
    //       var newArray = [];
    //       newArray = [
    //         ...allMeatHead,
    //         ...meatMoniterHead,
    //         ...meatEvaluteHead,
    //         ...meatAssesmentHead,
    //         ...meatTreatMentHead,
    //       ];
    //       var dublicateRemoveArr = getUniqueListBy(newArray, "header");
    //       dublicateRemoveArr.map((res3, index) => {
    //         allMeatHeadColor.push({
    //           header: res3.header,
    //           color: COLORS[index],
    //         });
    //       });
    //       allMeatHeadColorArr = allMeatHeadColor;

    //       dublicateRemoveSecondArr = getUniqueListBy(
    //         allMeatHeadColor,
    //         "header"
    //       );
    //       setMeatColorCodeList(dublicateRemoveSecondArr);
    //     });

    //     meatCri.map((res, index) => {
    //       meatListArr.push({
    //         diagnosisCode: res.diagnosisCode,
    //         diseaseName: res.diseaseName,
    //         monitorCapturedFromHeader: res.monitorCapturedFromHeader,
    //         assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
    //         evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
    //         treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
    //         radiology:res.radiology,
    //         monitorCapturedFromHeaderColor: colorCodeMatch(
    //           dublicateRemoveSecondArr,
    //           res.monitorCapturedFromHeader
    //         ),
    //         assessmentCapturedFromHeaderColor: colorCodeMatch(
    //           dublicateRemoveSecondArr,
    //           res.assessmentCapturedFromHeader
    //         ),
    //         evaluateCapturedFromHeaderColor: colorCodeMatch(
    //           dublicateRemoveSecondArr,
    //           res.evaluateCapturedFromHeader
    //         ),
    //         treatmentCapturedFromHeaderColor: colorCodeMatch(
    //           dublicateRemoveSecondArr,
    //           res.treatmentCapturedFromHeader
    //         ),
    //         monitorColor: COLORS[index],
    //         meatColor: COLORS[index],
    //         assessment: res.assessment,
    //         monitor: res.monitor,
    //         evaluate: res.evaluate,
    //         treatment: res.treatment,
    //         isMeatCriteriaPresent: res.isMeatCriteriaPresent,
    //       });
    //     });
    //     setMeatCriteriaListRadiology(meatListArr);
    //     setRadiologyResultStatus(true);
    //     setIsLoadingDos(false);
    //   }


    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`
    );
    // const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
    if (response.data) {
      var result = response.data;
      setPatientDetailsRadiology(result);
      setRadiologyResult(result);
      if (result.validDisease != null) {
        var validDis = "";
        var invalidDis = "";
        var comboDis = "";
        var meatCri = "";
        var dosYearArr = [];
        var dosYearArrFile = [];
        var validDiseaseNewRes = [];
        var invalidDiseaseNewRes = [];
        var unMatchRes = [];
        getPatientPdfFileRadiology(result.radiologyFileDetail[0].azureBlobPath, tenId);
        // getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId)

        for (var key in result.validDisease) {
          dosYearArr.push({ value: key, label: key });
        }

        var dateofService = dosYearArr[0].value;

        const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

        const highestDosValue = dosYearArr.filter(
          (i) => parseInt(i.value) === highestDOS
        );
        setDosYearDefalutSelectRadiology(dosYearArr[0]);

        if (result.radiologyFileDetail != null) {
          for (var key in result.radiologyFileDetail[0].documentDos) {
            dosYearArrFile.push({ value: key, label: key });
          }

          // var fileDetails = result.radiologyFileDetail[dateofService];
          setRadiologyFileDateDefaulteSelect(dosYearArrFile[0]);
          getPatientPdfFileRadiology(result.radiologyFileDetail[0].azureBlobPath, tenId);
        }

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
          const encounterDatearray = res.encounterDate.split(',');
          validDisArray.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition
          });

        });


        setNewValidDiseaseListRadiology(validDisArray);
        setInNewValidDiseaseListRadiology(invalidDiseaseNewRes);
        setUnMatchHccListRadiology(unMatchRes);
        setComboDiseaseCodesListRadiology(comboDis);
        setDosYearRadiology(dosYearArr);
        setFileRadiologyDateofServiceList(dosYearArrFile);










        const COLORS = [
          "encounterDateTag1",
          "encounterDateTag2",
          "encounterDateTag3",
          "encounterDateTag4",
          "encounterDateTag5",
          "encounterDateTag6",
          "encounterDateTag7",
          "encounterDateTag8"
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
      }
      else {
        setIsLoading(false);
      }
    }
  };
  const getLabReportDetails = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");

    // var resultTest = {
    //   "patientId": "lenovo-01",
    //   "patientName": "Armstead, Harold B",
    //   "fileId": null,
    //   "orgId": "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
    //   "tenantId": "b4d34e42-79a6-478e-b3af-12ce7311fa09",
    //   "dob": "04/22/1950",
    //   "gender": "M",
    //   "age": 73,
    //   "validDisease": {
    //       "2023": [
    //           {
    //               "diagnosisCode": "E11.9",
    //               "actualDescription": "Type 2 diabetes mellitus without complications",
    //               "dbDescription": null,
    //               "notes": null,
    //               "capturedSections": [
    //                   "A1c"
    //               ],
    //               "encounterDate": "01/20/2023",
    //               "isManuallyAdded": null,
    //               "manuallyAddedAt": null,
    //               "manuallyAddedBy": null,
    //               "diagnosisCodeFinding": null,
    //               "isHccValid": null
    //           },
    //           {
    //               "diagnosisCode": "E11.9",
    //               "actualDescription": "Type 2 diabetes mellitus without complications",
    //               "dbDescription": null,
    //               "notes": null,
    //               "capturedSections": [
    //                   "HGA1C"
    //               ],
    //               "encounterDate": "01/19/2023",
    //               "isManuallyAdded": null,
    //               "manuallyAddedAt": null,
    //               "manuallyAddedBy": null,
    //               "diagnosisCodeFinding": null,
    //               "isHccValid": null
    //           }
    //       ]
    //   },
    //   "meatCriteria": {
    //       "2023": [
    //           {
    //               "diseaseName": "Type 2 diabetes mellitus without complications",
    //               "diagnosisCode": "E11.9",
    //               "isMeatCriteriaPresent": true,
    //               "monitorCapturedFromHeader": null,
    //               "monitor": null,
    //               "evaluateCapturedFromHeader": null,
    //               "evaluate": "A1c",
    //               "assessmentCapturedFromHeader": null,
    //               "assessment": null,
    //               "treatmentCapturedFromHeader": null,
    //               "treatment": null,
    //               "encounterDate": "01/20/2023",
    //               "radiology": null
    //           },
    //           {
    //               "diseaseName": "Type 2 diabetes mellitus without complications",
    //               "diagnosisCode": "E11.9",
    //               "isMeatCriteriaPresent": true,
    //               "monitorCapturedFromHeader": null,
    //               "monitor": null,
    //               "evaluateCapturedFromHeader": null,
    //               "evaluate": "HGA1C",
    //               "assessmentCapturedFromHeader": null,
    //               "assessment": null,
    //               "treatmentCapturedFromHeader": null,
    //               "treatment": null,
    //               "encounterDate": "01/19/2023",
    //               "radiology": null
    //           }
    //       ]
    //   },
    //   "labFileDetail": [
    //       {
    //           "active": true,
    //           "version": 0,
    //           "createdBy": "anonymousUser",
    //           "updatedBy": "anonymousUser",
    //           "fileId": "537cc4bc-f072-4f4e-9852-b6045a035236",
    //           "patientId": "lenovo-01",
    //           "userId": "uvais01@encipherhealth.onmicrosoft.com",
    //           "orgId": "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
    //           "documentDos": {
    //               "09/02/2022": {
    //                   "testName": "Lab file",
    //                   "pageNumbers": [
    //                       2
    //                   ]
    //               },
    //               "01/20/2023": {
    //                   "testName": "Lab file",
    //                   "pageNumbers": [
    //                       4
    //                   ]
    //               },
    //               "06/13/2023": {
    //                   "testName": "Lab file",
    //                   "pageNumbers": [
    //                       5
    //                   ]
    //               },
    //               "01/19/2023": {
    //                   "testName": "Lab file",
    //                   "pageNumbers": [
    //                       6
    //                   ]
    //               },
    //               "07/26/2023": {
    //                   "testName": "Lab file",
    //                   "pageNumbers": [
    //                       3
    //                   ]
    //               },
    //               "08/01/2023": {
    //                   "testName": "Lab file",
    //                   "pageNumbers": [
    //                       1
    //                   ]
    //               }
    //           },
    //           "tenantId": "b4d34e42-79a6-478e-b3af-12ce7311fa09",
    //           "fileName": "ilovepdf_merged.pdf",
    //           "azureBlobPath": "537cc4bc-f072-4f4e-9852-b6045a035236.pdf",
    //           "createdDate": "2023-11-29T15:50:34.098Z",
    //           "lastModifiedDate": "2023-11-29T15:50:34.098Z"
    //       }
    //   ]
    // }


    // if (resultTest.labFileDetail != null) {
    //   var result = resultTest;
    //   setLabResult(result);
    //   var dosYearArr = [];
    //   var dosYearArrFile = [];
    //   var validDiseaseNewRes = [];
    //   var meatRes = [];

    //   for (var key in result.validDisease) {
    //     dosYearArr.push({ value: key, label: key });
    //   }

    //   setLabFileDosList(dosYearArr);

    //   var dateofService = dosYearArr[0].value;

    //   const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

    //   const highestDosValue = dosYearArr.filter((i) => i.value === highestDOS);

    //   if (dosYearArr.length != 0) {
    //     validDiseaseNewRes = result.validDisease[dateofService];
    //     meatRes = result.meatCriteria[dateofService];
    //     if (result.labFileDetail != null) {
    //       for (var key in result.labFileDetail[0].documentDos) {
    //         dosYearArrFile.push({ value: key, label: key });
    //       }
    //       setFileLabDateofServiceList(dosYearArrFile);
    //       setLabFileDateDefaulteSelect(dosYearArrFile[0]);
    //       var fileDetails = result.labFileDetail;
    //       getLabReportFiles(fileDetails[0].azureBlobPath, tenId);
    //     }
    //   }

    //   const COLORS = [
    //     "bg-bg-seven",
    //     "bg-third",
    //     "bg-bg-four",
    //     "bg-bg-five",
    //     "bg-bg-six",
    //     "bg-bg-eight",
    //     "bg-bg-nine",
    //     "bg-bg-ten",
    //     "bg-bg-leven",
    //   ];

    //   var meatListArr = [];
    //   var meatMoniterHead = [];
    //   var meatEvaluteHead = [];
    //   var meatAssesmentHead = [];
    //   var meatTreatMentHead = [];
    //   var allMeatHead = [];
    //   var allMeatHeadColorArr = [];
    //   var allMeatHeadColor = [];
    //   var dublicateRemoveSecondArr = [];

    //   meatRes.map((res, index) => {
    //     if (res.monitorCapturedFromHeader != "") {
    //       meatMoniterHead.push({
    //         header: res.monitorCapturedFromHeader,
    //       });
    //     }
    //     if (res.evaluateCapturedFromHeader != "") {
    //       meatEvaluteHead.push({
    //         header: res.evaluateCapturedFromHeader,
    //       });
    //     }
    //     if (res.assessmentCapturedFromHeader != "") {
    //       meatAssesmentHead.push({
    //         header: res.assessmentCapturedFromHeader,
    //       });
    //     }
    //     if (res.treatmentCapturedFromHeader != "") {
    //       meatTreatMentHead.push({
    //         header: res.treatmentCapturedFromHeader,
    //       });
    //     }
    //     var newArray = [];
    //     newArray = [
    //       ...allMeatHead,
    //       ...meatMoniterHead,
    //       ...meatEvaluteHead,
    //       ...meatAssesmentHead,
    //       ...meatTreatMentHead,
    //     ];
    //     var dublicateRemoveArr = getUniqueListBy(newArray, "header");
    //     dublicateRemoveArr.map((res3, index) => {
    //       allMeatHeadColor.push({
    //         header: res3.header,
    //         color: COLORS[index],
    //       });
    //     });
    //     allMeatHeadColorArr = allMeatHeadColor;

    //     dublicateRemoveSecondArr = getUniqueListBy(
    //       allMeatHeadColor,
    //       "header"
    //     );
    //     setMeatColorCodeList(dublicateRemoveSecondArr);
    //   });

    //   meatRes.map((res, index) => {
    //     meatListArr.push({
    //       diagnosisCode: res.diagnosisCode,
    //       diseaseName: res.diseaseName,
    //       monitorCapturedFromHeader: res.monitorCapturedFromHeader,
    //       assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
    //       evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
    //       treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
    //       radiology:res.radiology,
    //       monitorCapturedFromHeaderColor: colorCodeMatch(
    //         dublicateRemoveSecondArr,
    //         res.monitorCapturedFromHeader
    //       ),
    //       assessmentCapturedFromHeaderColor: colorCodeMatch(
    //         dublicateRemoveSecondArr,
    //         res.assessmentCapturedFromHeader
    //       ),
    //       evaluateCapturedFromHeaderColor: colorCodeMatch(
    //         dublicateRemoveSecondArr,
    //         res.evaluateCapturedFromHeader
    //       ),
    //       treatmentCapturedFromHeaderColor: colorCodeMatch(
    //         dublicateRemoveSecondArr,
    //         res.treatmentCapturedFromHeader
    //       ),
    //       monitorColor: COLORS[index],
    //       meatColor: COLORS[index],
    //       assessment: res.assessment,
    //       monitor: res.monitor,
    //       evaluate: res.evaluate,
    //       treatment: res.treatment,
    //       isMeatCriteriaPresent: res.isMeatCriteriaPresent,
    //     });
    //   });


    //   setLabReportValidList(validDiseaseNewRes);
    //   setLabReportMeatList(meatListArr);
    //   setLabFileDosListDefaultSelect(dosYearArr[0]);
    //   setLabResultStatus(true);
    //   setIsLoadingDos(false);
    // }
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/lab/compute/get/lab?patientid=${patientId}&orgid=${orgId}`
    );

    var resultTest = response.data;

    if (resultTest.labFileDetail != null) {
      var result = resultTest;
      setLabResult(result);
      var dosYearArr = [];
      var dosYearArrFile = [];
      var validDiseaseNewRes = [];
      var meatRes = [];

      for (var key in result.validDisease) {
        dosYearArr.push({ value: key, label: key });
      }

      setLabFileDosList(dosYearArr);

      var dateofService = dosYearArr[0].value;

      const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

      const highestDosValue = dosYearArr.filter((i) => i.value === highestDOS);

      if (dosYearArr.length != 0) {
        validDiseaseNewRes = result.validDisease[dateofService];

        var validDisArray = [];
        validDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(',');
          validDisArray.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition
          });

        });


        meatRes = result.meatCriteria[dateofService];
        if (result.labFileDetail != null) {
          for (var key in result.labFileDetail[0].documentDos) {
            dosYearArrFile.push({ value: key, label: key });
          }
          setFileLabDateofServiceList(dosYearArrFile);
          setLabFileDateDefaulteSelect(dosYearArrFile[0]);
          var fileDetails = result.labFileDetail;
          getLabReportFiles(fileDetails[0].azureBlobPath, tenId);
        }
      }

      const COLORS = [
        "encounterDateTag1",
        "encounterDateTag2",
        "encounterDateTag3",
        "encounterDateTag4",
        "encounterDateTag5",
        "encounterDateTag6",
        "encounterDateTag7",
        "encounterDateTag8"
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

      meatRes.map((res, index) => {
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

      meatRes.map((res, index) => {
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


      setLabReportValidList(validDisArray);
      setLabReportMeatList(meatListArr);
      setLabFileDosListDefaultSelect(dosYearArr[0]);
      setLabResultStatus(true);
      setIsLoadingDos(false);
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

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const getPatientPdfFile = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data;
      setSelectFileURL(response.data);
      setSelectFileURLValid(response.data);
      setIsLoading(false);
      setIsLoadingDos(false);
      fetch(response.data)
        .then((resp) => resp.arrayBuffer())
        .then((resp) => {
          // set the blog type to final pdf
          const file = new Blob([resp], { type: "application/pdf" });

          // process to auto download it
          const fileURL = URL.createObjectURL(file);
          setValidLocalFileDownloadAndView(fileURL);
          //  setSelectFileURL(fileURL);
          //  setIsLoading(false);

          // Open new Tab
          //  window.open(fileURL)
        });
      //  setIsLoading(false);
    }
  };

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data;
      setSelectFileURLRadiology(response.data);
      fetch(response.data)
        .then((resp) => resp.arrayBuffer())
        .then((resp) => {
          const file = new Blob([resp], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          setSelectFileURLRadiology(fileURL);
          setIsLoading(false);
          // Open new Tab
          //  window.open(fileURL)
        });
    }
  };

  const getLabReportFiles = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data;
      setLabReportFile(response.data);
    }
  };

  const options = [
    { value: "1", label: "Novant Health" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
  const options2 = [
    { value: "1", label: "Home Health" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
  const options3 = [
    { value: "1", label: "Show Original" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];

  const names = [
    "Felipe Almeida.pdf",
    "Martijn Haspels.pdf",
    "Hayden Lee.pdf",
    "Simon Yu.pdf",
    "Ollie Brown.pdf",
    "Calvin hsieh.pdf",
    "Charlotte.pdf",
    "Amelia.pdf",
    "Olivia.pdf",
    "Sophia.pdf",
    "Amelia.pdf",
    "Luna.pdf",
    "Elizabeth.pdf",
    "Susanne Halstead.pdf",
    // Add more names as needed
  ];

  const data = [
    {
      userId: "02b",
      comId: "017",
      fullName: "Lily",
      userProfile: "https://www.linkedin.com/in/riya-negi-8879631a9/",
      text: "I think you have a point🤔",
      avatarUrl: "https://ui-avatars.com/api/name=Lily&background=random",
      replies: [],
    },
  ];

  const confirmvalid = () =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            setConfirmNotesModalValid(true),
            setIsValidAction("validToDeleted")
          ),

      );
    });

  const validToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            setConfirmNotesModalValid(true),
            setIsValidAction("validToSuggested")
          ),

      );
    });

  const suggestedToValid = () =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            setConfirmNotesModalValid(true),
            setIsValidAction("suggestedToValid")
          ),

      );
    });
  const suggestedToDeleted = () =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            setConfirmNotesModalValid(true),
            setIsValidAction("suggestedToDeleted")
          ),

      );
    });

  const deletedToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            setConfirmNotesModalValid(true),
            setIsValidAction("deletedToSuggested")
          ),

      );
    });
  const deletedToValid = () =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            setConfirmNotesModalValid(true),
            setIsValidAction("deletedToValid")
          ),

      );
    });

  const confirmInvalid = () =>
    new Promise((resolve) => {
      // invalidMoveConfirm();
      setTimeout(() => resolve(setConfirmNotesModalInValid(true)), 1000);
    });

  const confirmInvalidSuggested = () =>
    new Promise((resolve) => {
      // invalidMoveConfirm();
      setTimeout(() => resolve(setConfirmNotesModalInValid(true)), 1000);
    });

  const confirmInvalidMoveDis = () =>
    new Promise((resolve) => {
      validMoveConfirmDis();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmCombo = () =>
    new Promise((resolve) => {
      comboMoveConfirm();
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

  const confirmMeat = () =>
    new Promise((resolve) => {
      meatMoveConfirm();
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

  const validMoveConfirm = () => {
    const result = newValidDiseaseList.filter(
      (res) => res.diagnosisCode != selectDiseasesName
    );
    setNewValidDiseaseList(result);
    const result2 = newValidDiseaseList.filter(
      (res2) => res2.diagnosisCode == selectDiseasesName
    );

    // var namePush = [];
    // namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...invalidMoveDiseasesList, ...result2];
    setInvalidMoveDiseasesList(newArray);

    // const result = validDiseasesList.filter(
    //   (res) => res.name != selectDiseasesName
    // );
    // setValidDiseasesList(result);
    // var namePush = [];
    // namePush.push({ name: selectDiseasesName });
    // var newArray = [];
    // newArray = [...invalidDiseasesList, ...namePush];
    // setInvalidDiseasesList(newArray);
  };

  const invalidMoveConfirm = () => {
    const result = newInValidDiseaseList.filter(
      (res) => res.diagnosisCode != selectDiseasesName
    );
    setInNewValidDiseaseList(result);

    const result2 = newInValidDiseaseList.filter(
      (res2) => res2.diagnosisCode == selectDiseasesName
    );
    var namePush = [];
    namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...newValidDiseaseList, ...result2];
    setNewValidDiseaseList(newArray);
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
    setAddValidCodeCheck(null)
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
  const handleOpenModalCombinationCode = (
    value,
    disDescription,
    check,
    whereCome
  ) => {
    if (whereCome == "nonHcc") {
      setNonHccActiveCodes(true);
    } else {
      setNonHccActiveCodes(false);
    }
    if (check === "valid") {
      setSelectActiveCode(value);
      var splitPoint = "";
      splitPoint = disDescription;
      setTimeout(() => {
        highlight({
          keyword: splitPoint,
        });
        var dataset = value + " - (" + splitPoint + ")";
        setSelectMeatName(dataset);
      }, 2000);
      setDocumentLoaded(true);
      var dataset = value + " - (" + splitPoint + ")";
      setSelectMeatName(dataset + " -  " + "Loading...");
      setIsLoadingSection(true);
      setIsModalOpenCaptureSection(true);
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
      }, 2000);
      setDocumentLoaded(true);
      var dataset = value + " - (" + disDescription + ")";
      setSelectMeatName(dataset + " -  " + "Loading...");
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
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };
  const handleOpenModalRadiology = (value, disDescription, radiologyCheck) => {
    if (radiologyCheck == true) {
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
    } else {
      handleOpenModal(
        value,
        disDescription
      )
    }
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };

  const getSectionResult = async (value) => {
    var apiUrl = `dbservice/patient/compute/getsection?fileid=cbd48813-3f9c-4cc9-9882-1db87fdd1ffb&section=${value}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + apiUrl);
    var result = response.data;
    if (response.data) {
      setSectionList(response.data);
      setIsLoadingSection(false);
    }
  };

  const onChangeFile = (e) => {
    let value = URL.createObjectURL(e[0]);

    setSelectFileURL(value);
  };

  const addValidDiseases = () => {
    setIsModalOpenValid(true);
    // setValidated(true);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
    }
    setValidated(true);
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
      if (isValidAction == "declineFunction") {
        handleSubmitHccDeclineApi();
      }
      if (isValidAction == "holdFunction") {
        handleSubmitHccHold();
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

  const handleSubmitSuggestedNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setSuggestedModal(false);
      submitSuggestedHcc();
      // setSuggestedBtnTitle("Loading...")
    }
    setValidated(true);
  };

  const dosOnChangeRadiologyFile = async (e) => {
    var dosKeyValue = e.value;
    var fileDetails = radiologyResult.radiologyFileDetail[dosKeyValue];
    getPatientPdfFileRadiology(fileDetails[0].azureBlobPath, localTenantId);
  };

  const dosOnChangeLabFile = async (e) => {
    var dosKeyValue = e.value;
    // var fileDetails = labResult.labFileDetail[dosKeyValue];
    // getLabReportFiles(fileDetails[0].azureBlobPath, localTenantId);
  };

  const dosOnChange = async (e) => {
    var dosKeyValue = e.value;
    // getYearOfServiceDetails(e.value);
    // console.log(e)
    getPatientDetailsYear(localPatientId, localOrgId, localTenantId, e.value);

    // if (activeTab == 1 || activeTab == 2) {
    //   //   var validDiseaseNewRes = [];
    //   //   var invalidDiseaseNewRes = [];
    //   //   var comboDis = "";
    //   //   var meatCri = "";
    //   //   var rafScore = null;
    //   //   var result = patientDetails;
    //   //   validDiseaseNewRes = result.validDisease[dosKeyValue];
    //   //   invalidDiseaseNewRes = result.invalidDisease[dosKeyValue];
    //   //   comboDis = result.comboDisease[dosKeyValue];
    //   //   meatCri = result.meatCriteria[dosKeyValue];
    //   //   if (result.rafScore != null) {
    //   //     rafScore = result.rafScore[dosKeyValue];
    //   //   }
    //   //   setNewValidDiseaseList(validDiseaseNewRes);
    //   //   setInNewValidDiseaseList(invalidDiseaseNewRes);
    //   //   setComboDiseaseCodesList(comboDis);
    //   //   setRAFScore(rafScore);
    //   //   const COLORS = [
    //   //     "bg-bg-seven",
    //   //     "bg-third",
    //   //     "bg-bg-four",
    //   //     "bg-bg-five",
    //   //     "bg-bg-six",
    //   //     "bg-bg-eight",
    //   //     "bg-bg-nine",
    //   //   ];
    //   //   var meatListArr = [];
    //   //   var nonHccMeatListArr = [];
    //   //   var meatMoniterHead = [];
    //   //   var meatEvaluteHead = [];
    //   //   var meatAssesmentHead = [];
    //   //   var meatTreatMentHead = [];
    //   //   var allMeatHead = [];
    //   //   var allMeatHeadColorArr = [];
    //   //   var allMeatHeadColor = [];
    //   //   var dublicateRemoveSecondArr = [];
    //   //   meatCri.map((res, index) => {
    //   //     if (res.monitorCapturedFromHeader != "") {
    //   //       meatMoniterHead.push({
    //   //         header: res.monitorCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     if (res.evaluateCapturedFromHeader != "") {
    //   //       meatEvaluteHead.push({
    //   //         header: res.evaluateCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     if (res.assessmentCapturedFromHeader != "") {
    //   //       meatAssesmentHead.push({
    //   //         header: res.assessmentCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     if (res.treatmentCapturedFromHeader != "") {
    //   //       meatTreatMentHead.push({
    //   //         header: res.treatmentCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     var newArray = [];
    //   //     newArray = [
    //   //       ...allMeatHead,
    //   //       ...meatMoniterHead,
    //   //       ...meatEvaluteHead,
    //   //       ...meatAssesmentHead,
    //   //       ...meatTreatMentHead,
    //   //     ];
    //   //     var dublicateRemoveArr = getUniqueListBy(newArray, "header");
    //   //     dublicateRemoveArr.map((res3, index) => {
    //   //       allMeatHeadColor.push({
    //   //         header: res3.header,
    //   //         color: COLORS[index],
    //   //       });
    //   //     });
    //   //     allMeatHeadColorArr = allMeatHeadColor;
    //   //     dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, "header");
    //   //     setMeatColorCodeList(dublicateRemoveSecondArr);
    //   //   });
    //   //   meatCri.map((res, index) => {
    //   //     if (res.category == "Invalid") {
    //   //       nonHccMeatListArr.push({
    //   //         diagnosisCode: res.diagnosisCode,
    //   //         diseaseName: res.diseaseName,
    //   //         monitorCapturedFromHeader: res.monitorCapturedFromHeader,
    //   //         assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
    //   //         evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
    //   //         treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
    //   //         monitorCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.monitorCapturedFromHeader
    //   //         ),
    //   //         assessmentCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.assessmentCapturedFromHeader
    //   //         ),
    //   //         evaluateCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.evaluateCapturedFromHeader
    //   //         ),
    //   //         treatmentCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.treatmentCapturedFromHeader
    //   //         ),
    //   //         monitorColor: COLORS[index],
    //   //         meatColor: COLORS[index],
    //   //         assessment: res.assessment,
    //   //         monitor: res.monitor,
    //   //         evaluate: res.evaluate,
    //   //         treatment: res.treatment,
    //   //         isMeatCriteriaPresent: res.isMeatCriteriaPresent,
    //   //         category: res.category,
    //   //       });
    //   //     } else {
    //   //       meatListArr.push({
    //   //         diagnosisCode: res.diagnosisCode,
    //   //         diseaseName: res.diseaseName,
    //   //         monitorCapturedFromHeader: res.monitorCapturedFromHeader,
    //   //         assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
    //   //         evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
    //   //         treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
    //   //         monitorCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.monitorCapturedFromHeader
    //   //         ),
    //   //         assessmentCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.assessmentCapturedFromHeader
    //   //         ),
    //   //         evaluateCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.evaluateCapturedFromHeader
    //   //         ),
    //   //         treatmentCapturedFromHeaderColor: colorCodeMatch(
    //   //           dublicateRemoveSecondArr,
    //   //           res.treatmentCapturedFromHeader
    //   //         ),
    //   //         monitorColor: COLORS[index],
    //   //         meatColor: COLORS[index],
    //   //         assessment: res.assessment,
    //   //         monitor: res.monitor,
    //   //         evaluate: res.evaluate,
    //   //         treatment: res.treatment,
    //   //         isMeatCriteriaPresent: res.isMeatCriteriaPresent,
    //   //         category: res.category,
    //   //       });
    //   //     }
    //   //   });
    //   //   setMeatCriteriaList(meatListArr);
    //   //   setMeatCriteriaListNonHcc(nonHccMeatListArr);
    //   //   setIsLoading(false);
    //   // }
    //   // if (activeTab == 3) {
    //   //   var validDiseaseNewRes = [];
    //   //   var invalidDiseaseNewRes = [];
    //   //   var unmatchedDiseaseRes = [];
    //   //   var comboDis = "";
    //   //   var meatCri = "";
    //   //   var result = patientDetailsRadiology;
    //   //   validDiseaseNewRes = result.validDisease[dosKeyValue];
    //   //   invalidDiseaseNewRes = result.invalidDisease[dosKeyValue];
    //   //   unmatchedDiseaseRes = result.unmatchedDisease[dosKeyValue];
    //   //   comboDis = result.comboDisease[dosKeyValue];
    //   //   meatCri = result.meatCriteria[dosKeyValue];
    //   //   if (result.radiologyFileDetail != null) {
    //   //     var fileDetails = result.radiologyFileDetail[dosKeyValue];
    //   //     getPatientPdfFileRadiology(fileDetails[0].azureBlobPath, localTenantId);
    //   //   }
    //   //   if (result.unmatchedDisease != null) {
    //   //     setUnMatchHccListRadiology(unmatchedDiseaseRes);
    //   //   }
    //   //   setNewValidDiseaseListRadiology(validDiseaseNewRes);
    //   //   setInNewValidDiseaseListRadiology(invalidDiseaseNewRes);
    //   //   setComboDiseaseCodesListRadiology(comboDis);
    //   //   const COLORS = [
    //   //     "bg-bg-seven",
    //   //     "bg-third",
    //   //     "bg-bg-four",
    //   //     "bg-bg-five",
    //   //     "bg-bg-six",
    //   //     "bg-bg-eight",
    //   //     "bg-bg-nine",
    //   //   ];
    //   //   var meatListArr = [];
    //   //   var meatMoniterHead = [];
    //   //   var meatEvaluteHead = [];
    //   //   var meatAssesmentHead = [];
    //   //   var meatTreatMentHead = [];
    //   //   var allMeatHead = [];
    //   //   var allMeatHeadColorArr = [];
    //   //   var allMeatHeadColor = [];
    //   //   var dublicateRemoveSecondArr = [];
    //   //   meatCri.map((res, index) => {
    //   //     if (res.monitorCapturedFromHeader != "") {
    //   //       meatMoniterHead.push({
    //   //         header: res.monitorCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     if (res.evaluateCapturedFromHeader != "") {
    //   //       meatEvaluteHead.push({
    //   //         header: res.evaluateCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     if (res.assessmentCapturedFromHeader != "") {
    //   //       meatAssesmentHead.push({
    //   //         header: res.assessmentCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     if (res.treatmentCapturedFromHeader != "") {
    //   //       meatTreatMentHead.push({
    //   //         header: res.treatmentCapturedFromHeader,
    //   //       });
    //   //     }
    //   //     var newArray = [];
    //   //     newArray = [
    //   //       ...allMeatHead,
    //   //       ...meatMoniterHead,
    //   //       ...meatEvaluteHead,
    //   //       ...meatAssesmentHead,
    //   //       ...meatTreatMentHead,
    //   //     ];
    //   //     var dublicateRemoveArr = getUniqueListBy(newArray, "header");
    //   //     dublicateRemoveArr.map((res3, index) => {
    //   //       allMeatHeadColor.push({
    //   //         header: res3.header,
    //   //         color: COLORS[index],
    //   //       });
    //   //     });
    //   //     allMeatHeadColorArr = allMeatHeadColor;
    //   //     dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, "header");
    //   //     setMeatColorCodeList(dublicateRemoveSecondArr);
    //   //   });
    //   //   meatCri.map((res, index) => {
    //   //     meatListArr.push({
    //   //       diagnosisCode: res.diagnosisCode,
    //   //       diseaseName: res.diseaseName,
    //   //       monitorCapturedFromHeader: res.monitorCapturedFromHeader,
    //   //       assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
    //   //       evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
    //   //       treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
    //   //       monitorCapturedFromHeaderColor: colorCodeMatch(
    //   //         dublicateRemoveSecondArr,
    //   //         res.monitorCapturedFromHeader
    //   //       ),
    //   //       assessmentCapturedFromHeaderColor: colorCodeMatch(
    //   //         dublicateRemoveSecondArr,
    //   //         res.assessmentCapturedFromHeader
    //   //       ),
    //   //       evaluateCapturedFromHeaderColor: colorCodeMatch(
    //   //         dublicateRemoveSecondArr,
    //   //         res.evaluateCapturedFromHeader
    //   //       ),
    //   //       treatmentCapturedFromHeaderColor: colorCodeMatch(
    //   //         dublicateRemoveSecondArr,
    //   //         res.treatmentCapturedFromHeader
    //   //       ),
    //   //       monitorColor: COLORS[index],
    //   //       meatColor: COLORS[index],
    //   //       assessment: res.assessment,
    //   //       monitor: res.monitor,
    //   //       evaluate: res.evaluate,
    //   //       treatment: res.treatment,
    //   //       isMeatCriteriaPresent: res.isMeatCriteriaPresent,
    //   //     });
    //   //   });
    //   //   setMeatCriteriaListRadiology(meatListArr);
    //   //   setIsLoading(false);
    // }
    // if (activeTab == 4) {
    //   var result = labResult;
    //   var validDiseaseNewRes = [];

    //   validDiseaseNewRes = result.validDisease[dosKeyValue];

    //   if (result.labFileDetail != null) {
    //     var fileDetails = result.labFileDetail[dosKeyValue];
    //     getLabReportFiles(fileDetails[0].azureBlobPath, localTenantId);
    //   }

    //   setLabReportValidList(validDiseaseNewRes);
    //   setLabResultStatus(true);
    // }
  };
  const onClick = (e) => {
  };

  const onchangeSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(setSuggestedModal(true)), 1000);
    });

  const handleMatchHcc = (event, value, code) => {
    var checked = event.target.checked;
    setSuggestedSelectValue(value);
    setSuggestedSelectCode(code);
    // setSuggestedModal(true);
    if (checked == true) {
      // setSuggestedModal(true);
      // var newArray = [];
      // var namePush = [];
      // var dataFormatSuggested = {
      //   "userId": localUserId,
      //   "patientId": localPatientId,
      //   "diagnosisCode": value.diagnosisCodeDocument,
      //   "actualDescription": value.actualDescription,
      //   "dbDescription": "",
      //   "notes": "test",
      //   "dos": 2017
      // }
      // namePush.push(dataFormatSuggested);
      // newArray = [...matchHccList, ...namePush];
      // setMatchHccList(newArray);
    } else {
      const removeArr = matchHccList.filter((i) => i.name != value);
      setMatchHccList(removeArr);
    }
    // if (newArray.length != 0) {
    setIsMatchBtn(true);
    // }
  };

  const handleSubmitMatchHcc = async () => {
    setSuggestedBtnTitle("Loading");
    try {
      const response = await axios.put(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/suggestions`,
        matchHccList
      );
      if (response?.status == 202) {
        setSuggestedBtnTitle("Add");
        notification.success({
          message: "Moved suggested code to valid diseases Successfully!",
          placement: "top",
          duration: 1
        });
        getPatientDetails(localPatientId, localOrgId, localTenantId);
      } else {
        setSuggestedBtnTitle("Add");
      }
    } catch (e) {
      setSuggestedBtnTitle("Add");
    }
  };

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem("Navigation One", "sub1", SVGICON.AgeIcon, [
      getItem(
        "Item 1",
        null,
        null,
        [getItem("Option 1", "1"), getItem("Option 2", "2")],
        "group"
      ),
      getItem(
        "Item 2",
        null,
        null,
        [getItem("Option 3", "3"), getItem("Option 4", "4")],
        "group"
      ),
    ]),
    getItem("Navigation Two", "sub2", SVGICON.AgeIcon, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Submenu", "sub3", null, [
        getItem("Option 7", "7"),
        getItem("Option 8", "8"),
      ]),
    ]),
    getItem("Navigation Three", "sub4", SVGICON.AgeIcon, [
      getItem("Option 9", "9"),
      getItem("Option 10", "10"),
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),
  ];

  const submitSuggestedHcc = async (notes) => {
    var newArray = [];
    var namePush = [];
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: suggesteSelectCode,
      actualDescription: suggesteSelectValue.actualDescription,
      dbDescription: "",
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    namePush.push(dataFormatSuggested);
    newArray = [...matchHccList, ...namePush];
    setMatchHccList(newArray);
  };

  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };


  const handleChangeFlag = async (e) => {
    setInputValue({ ...inputValue, ['flag']: e.value });
  };

  const openModelDbDescription = () => { };

  const tabList = [
    { title: "HCC", type: "HCC", iconStyle: IMAGES.visitDataHcc },
    { title: "NON HCC", type: "NON HCC", iconStyle: IMAGES.visitDataNonHcc },
    { title: "Radiology", type: "Radiology", iconStyle: IMAGES.visitDataRadioloy, },
    { title: "Lab Report", type: "Lab Report", iconStyle: IMAGES.visitDataLabreport, },
  ];

  const navigetPageDetails = (pageTitle) => {
    // setIsLoadingDos(true);
    setActiveTabHead("file");
    setSideNavLabelActiveKey(pageTitle)
    setIsLoading(true);
    if (pageTitle == "HCC") {
      setActiveTab(1);
      setIsLoadingDos(false);
    }
    if (pageTitle == "NON HCC") {
      setActiveTab(2);
      setIsLoadingDos(false);
    }
    if (pageTitle == "Radiology") {
      setActiveTab(3);
      if (radiologyResCheck == false) {
        getPatientDetailsRadiologyYear(localOrgId, localTenantId);
      }
    }
    if (pageTitle == "Lab Report") {
      setActiveTab(4);
      getLabReportDetails(localOrgId, localTenantId);
    }
    setIsLoading(false);
  };

  const handleSubmitPatientFile = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();

      submitRadiology();
    }

    setValidated(true);
  };

  const handleSubmitLabReport = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();
      submitLabReport();
    }

    setValidated(true);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = patientDocumentResult.patientId;
    inputValue.name = patientDocumentResult.patientName;
    setValidated(false);
    setAddPatient(true);
    setIsLoadingBtn(false);
  };
  const addLabReport = (data) => {
    inputValue.patientId = patientDocumentResult.patientId;
    inputValue.name = patientDocumentResult.patientName;
    setValidated(false);
    setLapReportSlider(true);
    setIsLoadingBtn(false);
  };

  const onChangeFileRadiology = (e) => {
    setSelectFileRadiology(e[0]);
  };
  const onChangeLabReportFile = (e) => {
    setSelectLabReportFile(e[0]);
  };

  const submitRadiology = async () => {
    const formData = new FormData();
    formData.append("file", selectFileRadiology);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", localTenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("dos", inputValue.year);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc +
      `aiservice/ai/upload/radiology
      `,
      formData,
      headers
    );
    if (response?.status == 202) {
      setAddPatient(false);
      setIsLoadingBtn(false);
      getPatientDetailsRadiology(localOrgId, localTenantId);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
  };
  const submitLabReport = async () => {
    const formData = new FormData();
    formData.append("file", selectLabReportFile);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", localTenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("dos", inputValue.year);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc +
      `aiservice/ai/upload/lab
      `,
      formData,
      headers
    );
    if (response?.status == 202) {
      setAddPatient(false);
      setIsLoadingBtn(false);
      getPatientDetailsRadiology(localOrgId, localTenantId);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
  };

  const openNewTabDownloadPdf = async () => {
    //    fetch(selectFileURL).then(resp => resp.arrayBuffer()).then(resp => {

    //     // set the blog type to final pdf
    //     const file = new Blob([resp], {type: 'application/pdf'});

    //     // process to auto download it
    //     const fileURL = URL.createObjectURL(file);

    //     // Open new Tab
    //     window.open(fileURL)

    // });

    window.open("details/file-view", "_blank", "width=4000, height=4000");
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
      result = response.data;
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
      capturedSections: selectInvalidDetails.capturedSections
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
      `dbservice/update/move/validtosuggested`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to suggested Successfully!",
        placement: "top",
        duration: 1
      });
      getPatientDetails(localPatientId, localOrgId, localTenantId);
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
      capturedSections: selectInvalidDetails.capturedSections
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
      `dbservice/update/move/validtodeleted`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to deleted Successfully!",
        placement: "top",
        duration: 1
      });
      getPatientDetails(localPatientId, localOrgId, localTenantId);
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
      capturedSections: selectInvalidDetails.capturedSections
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
      `dbservice/update/move/suggestedtodeleted`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to deleted Successfully!",
        placement: "top",
        duration: 1
      });
      getPatientDetails(localPatientId, localOrgId, localTenantId);
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
      capturedSections: selectInvalidDetails.capturedSections
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
      `dbservice/update/move/suggestedtovalid`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to valid Successfully!",
        placement: "top",
        duration: 1
      });
      getPatientDetails(localPatientId, localOrgId, localTenantId);
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
      capturedSections: selectInvalidDetails.capturedSections
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
      `dbservice/update/move/deletedtovalid`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to valid Successfully!",
        placement: "top",
        duration: 1
      });
      getPatientDetails(localPatientId, localOrgId, localTenantId);
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
      capturedSections: selectInvalidDetails.capturedSections
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
      `dbservice/update/move/deletedtoSuggested`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to Suggested Successfully!",
        placement: "top",
        duration: 1
      });
      getPatientDetails(localPatientId, localOrgId, localTenantId);
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
      capturedSections: selectInvalidDetails.capturedSections
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc +
      `dbservice/update/move/invalidtovalid`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved valid diseases Successfully!",
        placement: "top",
        duration: 1
      });
      getPatientDetails(localPatientId, localOrgId, localTenantId);
    } else {
    }
  };

  const activeValidDisCode = async (code, disDescription) => {
    setSelectActiveCode(code);
    var splitPoint = disDescription.substring(" ", 20);

    setTimeout(() => {
      highlight({
        keyword: disDescription,
        matchCase: true,
      });
      var dataset = code + " - (" + disDescription + ")";
      setSelectMeatName(dataset);
    }, 2000);

    setDocumentLoaded(true);
    var dataset = code + " - (" + disDescription + ")";
    setSelectMeatName(dataset + " -  " + "Loading...");
  };

  const replaceString = (value) => {
    var removeComma = null;
    // if (value != null) {
    //   removeComma = value.replace(/,/g, "");
    // }
    return removeComma;
  };

  const replaceCaptureSection = (value) => {
    return value;
  };

  const handleSubmitHccSave = async () => {
    setSaveBtnTitle("Loading...");
    var dos = dosYearDefalutSelect[0].label;
    var validObject = {};
    var inValidObject = {};
    var unmatachObject = {};
    var comoboObject = {};
    var meatObject = {};
    var deletedObject = {};
    validObject[dos] = newValidDiseaseList;
    inValidObject[dos] = newInValidDiseaseList;
    unmatachObject[dos] = suggestedHccList;
    comoboObject[dos] = comboDiseaseCodesList;
    meatObject[dos] = meatCriteriaList;
    deletedObject[dos] = deletedHccList;

    var postData = {
      userId: localUserId,
      patientId: localPatientId,
      patientName: patientDocumentResult.patientName,
      fileId: patientDocumentResult.patientName,
      orgId: patientDocumentResult.orgId,
      tenantId: patientDocumentResult.tenantId,
      dob: patientDocumentResult.dob,
      gender: patientDocumentResult.gender,
      age: patientDocumentResult.age,
      validDisease: validObject,
      invalidDisease: inValidObject,
      unmatchedDisease: unmatachObject,
      comboDisease: comoboObject,
      meatCriteria: meatObject,
      rafScore: patientDocumentResult.rafScore,
      dosFiltered: patientDocumentResult.dosFiltered,
      fileDetailDTO: patientDocumentResult.fileDetailDTO,
      deletedDiseases: deletedObject,
    };

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/save`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Saved Successfully!",
          placement: "top",
          duration: 1
        });
        setSaveBtnTitle("Save");
        getPatientDetails(localPatientId, localOrgId, localTenantId);
      } else {
      }
    } catch (e) {
      setSaveBtnTitle("Save");
    }
  };

  const handleSubmitHccAction = () => {
    handleSubmitHccComplete()
  }

  const handleSubmitHccComplete = async () => {
    setCompleteBtnTitle("Loading...");
    var dos = selectedDosValue;
    var validObject = {};
    var inValidObject = {};
    var unmatachObject = {};
    var comoboObject = {};
    var meatObject = {};
    var deletedObject = {};
    validObject = newValidDiseaseList;
    inValidObject = newInValidDiseaseList;
    unmatachObject = suggestedHccList;
    comoboObject = comboDiseaseCodesList;
    meatObject = meatCriteriaList;
    deletedObject = deletedHccList;
    // validObject[dos] = newValidDiseaseList;
    // inValidObject[dos] = newInValidDiseaseList;
    // unmatachObject[dos] = suggestedHccList;
    // comoboObject[dos] = comboDiseaseCodesList;
    // meatObject[dos] = meatCriteriaList;
    // deletedObject[dos] = deletedHccList;

    var postData = {
      userId: localUserId,
      patientId: localPatientId,
      patientName: patientDocumentResult.patientName,
      fileId: patientDocumentResult.patientName,
      orgId: patientDocumentResult.orgId,
      tenantId: patientDocumentResult.tenantId,
      dob: patientDocumentResult.dob,
      gender: patientDocumentResult.gender,
      age: patientDocumentResult.age,
      validDisease: validObject,
      invalidDisease: inValidObject,
      unmatchedDisease: unmatachObject,
      comboDisease: comoboObject,
      meatCriteria: meatObject,
      rafScore: patientDocumentResult.rafScore,
      dosFiltered: patientDocumentResult.dosFiltered,
      fileDetailDTO: patientDocumentResult.fileDetailDTO,
      deletedDiseases: deletedObject,
      dos:selectedDosValue
    };

    console.log(postData)

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/complete`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Completed Successfully!",
          placement: "top",
          duration: 1
        });
        setConfirmCompleteModal(false);
        setCompleteBtnTitle("Complete");
        getPatientDetails(localPatientId, localOrgId, localTenantId);
        getPatientIdDetails(localPatientId);
      } else {
      }
    } catch (e) {
      setCompleteBtnTitle("Complete");
    }
  };

  const handleSubmitHccDeclineApi = async () => {
    setDeclineBtnTitle("Loading...");
    var postData = {
      orgId: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
      dos: selectedDosValue
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/decline`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Decline Successfully!",
          placement: "top",
          duration: 1
        });
        setConfirmNotesModalHold(false);
        setDeclineBtnTitle("Decline");
        getPatientIdDetails(localPatientId);

      } else {
      }
    } catch (e) {
      setDeclineBtnTitle("Decline");
    }
  };

  const handleSubmitHccHold = async () => {
    setDeclineBtnTitle("Loading...");
    var postData = {
      orgId: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
      dos: selectedDosValue
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/hold`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Hold Successfully!",
          placement: "top",
          duration: 1
        });
        setConfirmNotesModalHold(false);
        setConfirmNotesModalDecline(false);
        setDeclineBtnTitle("Decline");
        getPatientIdDetails(localPatientId);
      } else {
      }
    } catch (e) {
      setDeclineBtnTitle("Decline");
    }
  };

  const handleSubmitHccDecline = async () => {
    setIsValidAction("declineFunction");
    setConfirmNotesModalHold(true);
  };

  const getFindValidDiagnosisCode = async (value) => {

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/icddisease/finddiseasebycode?diseasecode=${value}`
    );
    if (response.data) {
      if (response.data == "ICD disease not found") {
        setAddValidCodeCheck(false)
      } else {
        setAddValidCodeCheck(true)
        inputValue.actualDescription = "adakd dvasdv"
      }
    }

    inputValue.actualDescription = "adakd dvasdv"
  };

  // updated changes
  const handleFormSubmit = async (event) => {
    var dos = dosYearDefalutSelect.label;
    const form = event.currentTarget;
    event.preventDefault();
    if (addValidCodeCheck == true) {
      setAddValidCodeCheck(null)
      if (form.checkValidity() === true) {
        var dataFormatSuggested = {
          patientComputeDetailId: localPatientId,
          year: dos,
          diseaseFormats: [
            {
              diagnosisCode: inputValue.diagnosisCode,
              actualDescription: inputValue.actualDescription,
              encounterDate: inputValue.encodedDate,
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
              duration: 1
            });
            setIsModalOpenValidCodes(false);
            getPatientDetails(localPatientId, localOrgId, localTenantId);
            handleCloseForm();
            setIsModalOpenValid(false)
          } else {
          }
        } catch (e) { }

      }
    }

    setValidated(true);

    // Add logic for handling form submission
    // You can access the form data and perform actions accordingly
    // For example, you can access the input field values using refs or state
    // After handling the submission, close the form
  };

  const addComments = async (value) => {
    setIsModalComments(true);
    setFlagContainerActive(value);
    if (value == "Filter") {
      setFlagContainerActiveTitle("My Work Qyeue")
      const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/filter?userId=${localUserId}&page=${0}&size=${20}`);
      var result = response.data.content;
      setPatientList(result)
    }

    if (value == "Timeline") {
      setFlagContainerActiveTitle("Timeline")
      const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/actioneventaudit?patientid=${localPatientId}&pageno=${0}&pagesize=${20}`);
      var result = response.data.content;
      setTimeLineData(result);
    }
    if (value == "Notes") {
      setFlagContainerActiveTitle("Notes")
      getNotesList();
    }
    if (value == "Comments") {
      setFlagContainerActiveTitle("Comments")
      getCommentsList();
    }
    if (value == "Flag") {
      setFlagContainerActiveTitle("Flag The File")
      getFlagList();
    }


  };

  const flagList = [
    {
      name: "Filter",
      icon: SVGICON.List,
    },
    {
      name: "Flag",
      icon: SVGICON.flagIcon,
    },
    {
      name: "Timeline",
      icon: SVGICON.filterIcon,
    },
    {
      name: "Comments",
      icon: SVGICON.commentIcon,
    },
    {
      name: "Notes",
      icon: SVGICON.notsIcon,
    },
  ];
  // const timelineData = [
  //   {
  //     title: "Siva",
  //     subtitle: "19/11/2023 | 10.30am",

  //     description: "Completed the  patient chart",
  //     iconBackground: "rgb(33, 150, 243)",
  //     icon:   <Image src={IMAGES.visitDataHcc} />,
  //   },
  //   {
  //     title: "Siva",
  //     subtitle: "19/11/2023 | 10.30am",

  //     description: "Completed the  patient chart",
  //     iconBackground: "rgb(33, 150, 243)",
  //     icon:   <Image src={IMAGES.visitDataHcc} />,
  //   },
  //   {
  //     title: "Siva",
  //     subtitle: "19/11/2023 | 10.30am",

  //     description: "Completed the  patient chart",
  //     iconBackground: "rgb(33, 150, 243)",
  //     icon:   <Image src={IMAGES.visitDataHcc} />,
  //   },
  //   {
  //     title: "Siva",
  //     subtitle: "19/11/2023 | 10.30am",

  //     description: "Completed the  patient chart",
  //     iconBackground: "rgb(33, 150, 243)",
  //     icon:   <Image src={IMAGES.visitDataHcc} />,
  //   },
  //   // Add more timeline data objects for other elements
  // ];

  const Icon = {
    Home: 1,
    // Add other SVG icons if needed
  };


  const getPatientListToDetails = (userId,orgId,tenantId) =>{
            getPatientDetails(userId,orgId, tenantId);
            getPatientIdDetails(userId);

  }

  const getFiltePatientListStatus = async (value) => {

    const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/filter?userId=${localUserId}&page=${0}&size=${10}&processedStatus=${value}`);
    var result = response.data.content;
    setPatientList(result)

  }

  // const getFiltePatientListDate = async (date1,date2) => {

  //   const response = await axios.get(ENDPOINTS.apiEndoint +`dbservice/patient/filter?userId=${localUserId}&page=${0}&size=${10}&processedStatus=${value}`);
  //   var result = response.data.content;
  //   setPatientList(result)

  // }

  const handleSubmitFlag = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);
      var dataFormatSuggested = {
        patientId: localPatientId,
        orgId: localOrgId,
        comments: inputValue.comments,
        year: selectedDosValue,
        flag: inputValue.flag
      };
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/flagdetails`,
        [dataFormatSuggested]
      );
      if (response?.status == 202) {
        notification.success({
          message: "Flag added Successfully!",
          placement: "top",
          duration: 1
        });
        getFlagList();
        setCommentsTrigger(false);

        // getPatientDetails(localPatientId,localOrgId, localTenantId);
      } else {
      }
    }
    setValidated(true)
    // setIsModalComments(false)
  };

  const handleSubmitNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);
      var dataFormatSuggested = {
        patientId: localPatientId,
        orgId: localOrgId,
        notes: inputValue.comments,
        year: selectedDosValue,
      };
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/notes`,
        [dataFormatSuggested]
      );
      if (response?.status == 202) {
        inputValue.comments = ''
        notification.success({
          message: "Notes added Successfully!",
          placement: "top",
          duration: 1
        });
        getNotesList();
        setCommentsTrigger(false);

      } else {
      }
    }
    setValidated(true)
    // setIsModalComments(false)
  };

  const handleSubmitCommnets = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setCommentsTrigger(true);

      var dataFormatSuggested = {
        patientId: localPatientId,
        orgId: localOrgId,
        comment: inputValue.comments,
        year: selectedDosValue,
      };
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/comment`,
        [dataFormatSuggested]
      );
      if (response?.status == 202) {
        inputValue.comments = '';
        notification.success({
          message: "Comment added Successfully!",
          placement: "top",
          duration: 1
        });
        getCommentsList();
        setCommentsTrigger(false);

      } else {
      }
    }
    setValidated(true)
    // setIsModalComments(false)
  };

  const handleEnterTextComments = async (event) => {

    if (event.charCode == 13) {
      var dataFormatSuggested = {
        patientId: localPatientId,
        orgId: localOrgId,
        comment: inputValue.comments,
        year: selectedDosValue,
      };
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/comment`,
        [dataFormatSuggested]
      );
      if (response?.status == 202) {
        inputValue.comments = '';
        notification.success({
          message: "Comment added Successfully!",
          placement: "top",
          duration: 1
        });
        getCommentsList();
      } else {
      }
    }
  }

  const handleEnterTextNotes = async (event) => {
    if (event.charCode == 13) {

      var dataFormatSuggested = {
        patientId: localPatientId,
        orgId: localOrgId,
        notes: inputValue.comments,
        year: selectedDosValue,
      };
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc +
        `dbservice/notes`,
        [dataFormatSuggested]
      );
      if (response?.status == 202) {
        inputValue.comments = ''
        notification.success({
          message: "Notes added Successfully!",
          placement: "top",
          duration: 1
        });
        getNotesList();
      } else {
      }
    }
  }

  const handleToogleCloseNav = () => {
    if (isSideNavShow == true) {
      setIsSideNavShow(false);
    } else {
      setIsSideNavShow(true);
    }


  }

  const backToPatientData = () => {
    navigate.push("/physician/patients");
  }


  const splitUserName = (name) => {
    return name[0]
  }


  const getCommentsList = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/comment?patientId=${localPatientId}&year=${selectedDosValue}`
    );
    setCommentList(response.data)
  }


  const getNotesList = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/notes?patientId=${localPatientId}&year=${selectedDosValue}`
    );
    setNotesList(response.data)
  }

  const getFlagList = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/flagdetails?patientId=${localPatientId}&year=${selectedDosValue}`
    );
    setFlagResultList(response.data)
  }

  const handleDatePickerChange = (dateString) => {
    console.log(dateString)


    // getFiltePatientListDate(dateString[0],dateString[1])
  };




  const handleActionClick = (value) => {

    if (value == "HOLD") {
      setConfirmNotesModalDecline(true);
      setIsValidAction("holdFunction");
    }

    if (value == "DECLINE") {
      handleSubmitHccDecline();
    }

    if (value == "COMPLETE") {
      setConfirmCompleteModal(true);
    }
    if (value == "ADD RADIOLOGY") {
      addPatientFile();
    }
    if (value == "ADD LAB") {
      addLabReport();
    }

    // getFiltePatientListDate(dateString[0],dateString[1])
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
        result = response.data;
        data = (
          <div className={visitStyles.userDetailsCard}>
            <div className={visitStyles.avatarStyle}>
              <Avatar size={60}>{splitUserName(result.userName)}</Avatar>
              <span className={visitStyles.userRole}>{result.role[0]}</span>
            </div>
            <div className={visitStyles.userNameDetails}>
              <FontAwesomeIcon icon={faUserCircle} />
              <span>{result.userName}</span>
            </div>
            <div className={visitStyles.usertimeDetails}>
              <FontAwesomeIcon icon={faClock} />
              <span>{currentTime}</span>
            </div>
          </div>
        );
      }
      setUserDetails(data);
    }, 1000);



    setUserDetails(data);
  };

  function removeDuplicates(array) {
    let output = []
    for (let item of array) {

      if (!output.includes(item))
        output.push(item)
    }

    return output

  }


  const getCaptureSectionBackground = (value) => {
    console.log(value)
    var dublicateCaptureDelete = removeDuplicates(value);
    console.log(dublicateCaptureDelete)
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.name == res
      );
      var backColor = result[0]?.colors;
      var disCode = result[0]?.diagnosisCode;

      var sectionMapArr =
        (<Badge onClick={() =>
          handleOpenModalCombinationCode(
            disCode,
            res,
            "valid"
          )
        }
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader} ${backColor}`}>
          {res}</Badge>)
      return sectionMapArr
    });
  }


  const getEncounterDateBackground = (value) => {
    return value.map((res) => {
      const result = encounterDateMatching.filter(
        (res2) => res2.name == res
      );
      var backColor = result[0]?.colors;
      var sectionMapArr =
        // (<Badge
        // className={`mt-2 text-start cr-pointer ${visitStyles.captureheader} ${backColor}`}>
        // {res}</Badge>)

        (<Badge
          className={`mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res).format("MM/DD")}
        </Badge>
        )
      return sectionMapArr
    });
  }








  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div className={visitStyles.headerFixed}>


          <div class="content-body">
            {isLoading ? (
              <Spinner />
            ) : (
              <div
                className={`container-fluid ${visitStyles.container_fluid_patient}`}
              >
                <div className="row patient-file-container">
                  <div className="col-xl-12">
                    <div className="row">
                      <div className="col-xl-1 col-sm-12">
                        <Button onClick={backToPatientData} className={`ms-2 ${visitStyles.backArrowBtn}`}>
                          <FontAwesomeIcon
                            icon={
                              faArrowLeft
                            }
                            style={{
                              color:
                                "rgb(38 50 107)",
                            }}
                          />
                        </Button>

                      </div>
                      <div className="col-xl-7 col-sm-12">
                        <div className={`${visitStyles.patient_info_details}`}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-xl-3 col-sm-12">
                                {/* <i>{SVGICON.patientIdIcon}</i> */}
                                <FontAwesomeIcon icon={faIdCardClip} />
                                <label>Patient Id</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.patientId}
                                </h6>
                              </div>
                              <div className="col-xl-3 col-sm-12">
                                {/* <i>{SVGICON.patientNameIcon}</i>{" "} */}
                                <FontAwesomeIcon icon={faUserCircle} />

                                <label>Name</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.patientName}
                                </h6>
                              </div>
                              <div className="col-xl-2 col-sm-12">
                                {/* <i>{SVGICON.AgeIcon}</i> */}
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <label>Age</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.age}

                                </h6>
                              </div>
                              <div className="col-xl-2 col-sm-12">
                                {/* <i>{SVGICON.GenerIcon}</i> */}
                                <FontAwesomeIcon icon={faVenusMars} />
                                <label>Gender</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.gender}
                                </h6>
                              </div>
                              <div className="col-xl-2 col-sm-12">
                                <i className={visitStyles.dob_icon}>{SVGICON.DatebirthIcon}</i> <label>DOB</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.dob}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-1 col-sm-12">
                        <div className={visitStyles.priorityStatus}>
                          {patienIdDetails.priority == "URGENT" ?
                            <>
                              <i>{SVGICON.alert}</i>{" "}
                              <span style={{ fontSize: "13px",fontWeight:500 }}>Urgent</span>{" "}
                            </> : patienIdDetails.priority == "HIGH" ?
                              <>
                                <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
                                <span style={{ fontSize: "13px",fontWeight:500 }}>High</span>{" "}
                              </> : patienIdDetails.priority == "NORMAL" ?
                                <>
                                  <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
                                  <span style={{ fontSize: "13px",fontWeight:500 }}>Normal</span>{" "}
                                </> : 
                                  <>
                                    <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
                                    <span style={{ fontSize: "13px",fontWeight:500 }}>Low</span>{" "}
                                  </> }
                        </div>
                      </div>
                      <div className="col-xl-1 col-sm-12">
                        <div className={`${visitStyles.rafscoreheader} `}>
                                <label>Score</label>
                                {patientDetails.rafScore != null ?
                                <h6 className="ageDtails">
                                {(patientDetails.rafScore?.score).toFixed(3)}

                                </h6>:<h6 className="ageDtails">
                                0.00

                                </h6>}
                        </div>
                      </div>
                      <div className="col-xl-1 col-sm-12">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-xl-12 col-sm-12">
                              {/* <label className="form-label">
                              Date of Service
                            </label> */}
                              {!isLoadingDos ? (
                                <>
                                  {activeTab == 3 ? (
                                    <Select
                                      onChange={(e) => dosOnChange(e)}
                                      options={dosYearRadiology}
                                      className={`custom-react-select ${visitStyles.dosSelectPicker}`}
                                      defaultValue={dosYearDefalutSelectRadiology}
                                      isSearchable={false}

                                    />
                                  ) : activeTab == 4 ? (
                                    <Select
                                      onChange={(e) => dosOnChange(e)}
                                      options={labFileDosList}
                                      className={`custom-react-select ${visitStyles.dosSelectPicker}`}
                                      defaultValue={labFileDosListDefaultSelect}
                                      isSearchable={false}
                                    />
                                  ) : (
                                    <Select
                                      onChange={(e) => dosOnChange(e)}
                                      options={dosYear}
                                      className={`custom-react-select ${visitStyles.dosSelectPicker}`}
                                      defaultValue={dosYearDefalutSelect}
                                      isSearchable={false}
                                    />
                                  )}
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-1 col-sm-12">
                        <div className={`${visitStyles.actionbtnContainer}`}>
                          {patienIdDetails.processedStatus == "COMPLETED" ?

                            <Dropdown.Button
                              type="primary"
                              className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
                              icon={<DownOutlined />}
                              overlay={activeTab == 3 ? actionItems2 : activeTab == 4 ? actionItems3 : actionItems}
                            >
                              COMPLETED
                            </Dropdown.Button>
                            : patienIdDetails.processedStatus == "DECLINED" ?
                              <div className={`col-xl-12`}
                              >
                                <Dropdown.Button
                                  type="primary"
                                  className={`declinedBtnHcc ${visitStyles.declinedBtnHcc}`}
                                  icon={<DownOutlined />}
                                  overlay={activeTab == 3 ? actionItems2 : activeTab == 4 ? actionItems3 : actionItems}
                                >
                                  DECLINED
                                </Dropdown.Button>

                              </div> :
                              patienIdDetails.processedStatus == "HOLD" ?
                                <Dropdown.Button
                                  type="primary"
                                  className={`holdBtnHcc ${visitStyles.holdBtnHcc}`}
                                  icon={<DownOutlined />}
                                  overlay={activeTab == 3 ? actionItems2 : activeTab == 4 ? actionItems3 : actionItems}
                                >
                                  HOLD
                                </Dropdown.Button>


                                :
                                <div className={`col-xl-12`}
                                >

                                  <Dropdown.Button
                                    type="primary"
                                    className={`pendingBtn ${visitStyles.pendingBtn}`}
                                    icon={<DownOutlined />}
                                    overlay={activeTab == 3 ? actionItems2 : activeTab == 4 ? actionItems3 : actionItems}
                                  >
                                    PENDING
                                  </Dropdown.Button>


                                </div>}
                        </div>
                      </div>
                      <div className={isSideNavShow ?
                        `${visitStyles.visitDataMain}`
                        : `${visitStyles.visitDataMainClose}`
                      }>
                        <div className={`${visitStyles.firstContainer}`}>
                          <div className={isSideNavShow ?
                            `${visitStyles.sideTab}`
                            : `${visitStyles.sideTabClose}`
                          }>


                            <div className={`${visitStyles.sideNav}`}>
                              <div className="sideNavscroll">
                                <div
                                  className="nav-control"
                                  onClick={() => {
                                    handleToogleCloseNav();
                                  }}
                                >
                                  <div className={`${visitStyles.sideNavArrow}`}>
                                    <span className="line">{SVGICON.navSideIcon}</span>
                                  </div>
                                </div>
                                <ul>
                                  {tabList.map((data, index) => (
                                    <Tooltip title={data.title} placement="right">
                                      <li className={`${visitStyles.sideNavLabel}`} onClick={() =>
                                        navigetPageDetails(data.type)
                                      }>
                                        <a className={` ${sideNavLabelActiveKey === data.title ? visitStyles.sideNavLabelActive : ""}`}>
                                          <div className="menu-icon">
                                            <Image src={data.iconStyle} />
                                          </div>{" "}
                                          <span className={`${visitStyles.sideNavText}`} >
                                            {data.title}
                                          </span>
                                        </a>
                                      </li>
                                    </Tooltip>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <Tab.Container defaultActiveKey={"HCC"}>
                              <div
                                className={`card-header border-0 flex-wrap patient-details-tab-card `}
                              >
                                {/* <Nav
                              as="ul"
                              className="nav nav-pills mix-chart-tab"
                            >
                              {tabList.map((item, index) => (
                                <Nav.Item
                                  as="li"
                                  className="nav-item"
                                  key={index}
                                >
                                  <Nav.Link
                                    onClick={() =>
                                      navigetPageDetails(item.type)
                                    }
                                    eventKey={item.title}
                                  >
                                    {item.title}
                                  </Nav.Link>
                                </Nav.Item>
                              ))}
                            </Nav> */}
                                {/* <div className={visitStyles.flags}>
                                      <div className={visitStyles.flags} >
                                        <span className={visitStyles.flag}>
                                          {SVGICON.flagIconHcc}
                                        </span>
                                        <span className={visitStyles.flagCodes}>
                                          HCC
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags}   >
                                        <span className={visitStyles.flag}>
                                          {SVGICON.flagIconSuggestion}
                                        </span>
                                        <span className={visitStyles.flagCodes}>
                                          Suggestion
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags} >
                                        <span className={visitStyles.flag}>
                                          {SVGICON.flagIconDelete}
                                        </span>
                                        <span className={visitStyles.flagCodes}>
                                          Delete
                                        </span>
                                      </div>
                                    </div> */}

                              </div>
                            </Tab.Container>
                          </div>
                        </div>

                        <div className={`${visitStyles.secondContainer}`}>
                          <div className="row">
                            {/* <div className="col-xl-8">
                            <div
                              className={`${visitStyles.visitdata_header_card}`}
                            >
                              <div className="card-body p-0">
                                <Tab.Container defaultActiveKey={"HCC"}>
                                  <div
                                    className={`card-header border-0 flex-wrap patient-details-tab-card `}
                                  >
                                    <Nav
                                      as="ul"
                                      className="nav nav-pills mix-chart-tab"
                                    >
                                      {tabList.map((item, index) => (
                                        <Nav.Item
                                          as="li"
                                          className="nav-item"
                                          key={index}
                                        >
                                          <Nav.Link
                                            onClick={() =>
                                              navigetPageDetails(item.type)
                                            }
                                            eventKey={item.title}
                                          >
                                            {item.title}
                                          </Nav.Link>
                                        </Nav.Item>
                                      ))}
                                    </Nav>
                                    <div>
                                      {activeTab == 3 ? (
                                        <div>
                                          <Button
                                            onClick={addPatientFile}
                                            className={`ms-2 ${visitStyles.addPatientBtn}`}
                                          >
                                            Add Patient Radiology
                                          </Button>
                                        </div>
                                      ) : null}
                                      {activeTab == 4 ? (
                                        <div>
                                          <Button
                                            onClick={addLabReport}
                                            className={`ms-2 ${visitStyles.addPatientBtn}`}
                                          >
                                            Add Lab report
                                          </Button>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </Tab.Container>
                              </div>
                            </div>
                          </div> */}
                            {/* <div className={`col-xl-12 ${visitStyles.actionbtnContainer}`}
                        >
                          <Button
                            onClick={handleSubmitHccDecline}
                            className={`ms-2 ${visitStyles.declineBtn}`}
                          >
                            <i>{SVGICON.delclineIcon}</i>
                            {declineBtnTitle}
                          </Button>
                          <Button
                            onClick={() => {
                              setConfirmNotesModalDecline(true);
                              setIsValidAction("holdFunction");
                            }}
                            className={`ms-2 ${visitStyles.holdBtn}`}
                          >
                            <i>{SVGICON.holdBtnIcon}</i>
                            Hold
                          </Button>

                          <Button
                            onClick={handleSubmitHccComplete}
                            className={`ms-2 ${visitStyles.completedBtn}`}
                          >
                            <i>{SVGICON.completedBtnIcon}</i>

                            {completedBtnTitle}
                          </Button>

                          <div>
                                    {activeTab == 3 ? (
                                      <div>
                                        <Button
                                          onClick={addPatientFile}
                                          className={`ms-2 ${visitStyles.addPatientBtn}`}
                                        >
                                          Add Patient Radiology
                                        </Button>
                                      </div>
                                    ) : null}
                                    {activeTab == 4 ? (
                                      <div>
                                        <Button
                                          onClick={addLabReport}
                                          className={`ms-2 ${visitStyles.addPatientBtn}`}
                                        >
                                          Add Lab report
                                        </Button>
                                      </div>
                                    ) : null}
                                  </div>

                                 
                        </div> */}


                          </div>

                          {activeTab == 1 ? (
                            <div className={visitStyles.visitdata_tab_body}>
                              <div
                                className={`profile-tab ${visitStyles.visitdata_header_card2}`}
                              >
                                <div className="custom-tab-1 ">
                                  <Tab.Container defaultActiveKey={activeTabHead}>
                                    <div className="row">
                                      <div className="col-xl-8">
                                        <Nav as="ul" className="nav nav-tabs">
                                          <Nav.Item as="li" className="nav-item">
                                            <Nav.Link
                                              to="#my-posts"
                                              eventKey="validDiseases"
                                              className={visitStyles.navColor}
                                              activeClassName={visitStyles.activeLink}
                                              onClick={() =>
                                                setFlagTagActive(true)
                                              }
                                            >
                                              Visit Data
                                            </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item as="li" className="nav-item">
                                            <Nav.Link
                                              to="#my-posts"
                                              eventKey="comboDiseases"
                                              className={visitStyles.navColor}
                                              onClick={() =>
                                                setFlagTagActive(false)
                                              }
                                            >
                                              Combination Codes
                                            </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item as="li" className="nav-item">
                                            <Nav.Link
                                              to="#my-posts"
                                              eventKey="meatCriteria"
                                              className={visitStyles.navColor}
                                              onClick={() =>
                                                setFlagTagActive(false)
                                              }
                                            >
                                              MEAT Criteria
                                            </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item as="li" className="nav-item">
                                            <Nav.Link
                                              to="#my-posts"
                                              eventKey="RafScore"
                                              className={visitStyles.navColor}
                                              onClick={() =>
                                                setFlagTagActive(false)
                                              }
                                            >
                                              RAF Score
                                            </Nav.Link>
                                          </Nav.Item>
                                          <Nav.Item as="li" className="nav-item">
                                            <Nav.Link
                                              to="#my-posts"
                                              eventKey="file"
                                              className={visitStyles.navColor}
                                              onClick={() =>
                                                setFlagTagActive(false)
                                              }
                                            >
                                              File
                                            </Nav.Link>

                                          </Nav.Item>

                                        </Nav>
                                      </div>
                                      {flagTagActive == true ?
                                        <div className="col-xl-4">
                                          <div className={visitStyles.flags} >
                                            <div className={visitStyles.flags} >
                                              <span className={visitStyles.hccFlag}>
                                              </span>
                                              <span className={visitStyles.flagCodes}>
                                                HCC
                                              </span>
                                            </div>
                                            {/* <div className={visitStyles.flags} >
                                              <span className={visitStyles.nonHccFlag}>
                                              </span>
                                              <span className={visitStyles.flagCodes}>
                                                NON HCC
                                              </span>
                                            </div> */}
                                            <div className={visitStyles.flags}   >
                                              <span className={visitStyles.suggestedFlag}>
                                              </span>
                                              <span className={visitStyles.flagCodes}>
                                                SUGGESTED
                                              </span>
                                            </div>
                                            <div className={visitStyles.flags} >
                                              <span className={visitStyles.deleteFlag}>
                                              </span>
                                              <span className={visitStyles.flagCodes}>
                                                DELETED
                                              </span>
                                            </div>
                                          </div>
                                        </div> : null}

                                    </div>


                                    <Tab.Content>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="validDiseases"
                                      >
                                        <div className="my-post-content pt-3">
                                          <div className="widget-media   ps--active-y">
                                            <div className="row">
                                              <div className="col-xl-4">
                                                <ul className="timeline">
                                                  <div
                                                    className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                                                  >
                                                    <span
                                                      className={`${visitStyles.hcc_title_name}`}
                                                    >

                                                      HCC
                                                      <FontAwesomeIcon onClick={() =>
                                                        addValidDiseases()
                                                      }
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

                                                      {newValidDiseaseList.map(
                                                        (data, i) => (
                                                          <li>
                                                            <div
                                                              className={`hccActiveCard ${visitStyles.hcc_card}`}
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


                                                                      {
                                                                        data.diagnosisCode
                                                                      }
                                                                    </span>{" "}
                                                                    -{" "}
                                                                    {
                                                                      data.actualDescription
                                                                    }

                                                                  </span>
                                                                </div>

                                                                {data.defaultPosition == "VALID" ?
                                                                  <span className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}>
                                                                  </span> : data.defaultPosition == "SUGGESTED" ?

                                                                    <span className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}>
                                                                    </span>
                                                                    : data.defaultPosition == "DELETED" ?

                                                                      <span className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}>
                                                                      </span> : null}
                                                                <Popover
                                                                  onClick={() =>
                                                                    getValidHccDetails(
                                                                      data.actualDescription,
                                                                      data.diagnosisCode
                                                                    )
                                                                  }
                                                                  content={
                                                                    validHccDetails
                                                                  }
                                                                  title={
                                                                    data.diagnosisCode
                                                                  }
                                                                  placement="bottom"
                                                                  trigger="click"
                                                                >
                                                                  <Tooltip title="HCC Veriosn Details" placement="bottom">
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
                                                                  onCancel={
                                                                    validToSuggested
                                                                  }
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
                                                                  onConfirm={
                                                                    confirmvalid
                                                                  }
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
                                                                    {<FontAwesomeIcon
                                                                      icon={faArrowsAlt}
                                                                      style={{ size: 8, color: "#a80404" }}
                                                                    />}
                                                                  </div>
                                                                </Popconfirm>
                                                              </div>
                                                              <div className={`${visitStyles.hoverActiveHcc}`}>
                                                                <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                                  {/* <Tooltip title={patientDocumentResult.patientName}>
                                                         <Avatar className={visitStyles.provider_name_style}>U</Avatar>
                                                         </Tooltip> */}
                                                                  {/* <Popover
                                                            placement="topLeft"
                                                            title=""
                                                            content={
                                                              patientDocumentResult.patientName
                                                            }
                                                          >
                                                            <Badge
                                                               className={`mt-2 text-start w-100px ${visitStyles.provider_name}`}
                                                            >
                                                              <i>
                                                                {
                                                                  SVGICON.patientNameIcon
                                                                }
                                                              </i>
                                                              {
                                                                patientDocumentResult.patientName
                                                              }
                                                            </Badge>
                                                          </Popover> */}

                                                                  {getEncounterDateBackground(data.encounterDateSplit)}
                                                                  {data.isManuallyAdded == true ?
                                                                  
                                                                      <Badge
                                                                        className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                                                      >
                                                                        Manually Added

                                                                      </Badge>:
                                                                    null}


                                                                  {/* {getCaptureSectionBackground(data.capturedSections)} */}
                                                                  {/* <Popover placement="topLeft" content={ patientDocumentResult.patientName}>
                                                      <Badge className="badge-meat text-white cr-pointer badge-circle mt-2" bg={` badge-circle mt-2 bg-bg-five`} onClick={() => handleOpenModalCombinationCode(data.diagnosisCode, data.actualDescription)}>
                                                      <FontAwesomeIcon
                                                          icon={faSearch}
                                                          style={{ color: "#fff" }}
                                                        />
                                                        HPI Test Urlplan
                                                      </Badge>
                                                      </Popover> */}
                                                                </div>
                                                                <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                                  {getCaptureSectionBackground(data.capturedSections)}
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
                                                                          {
                                                                            data.diagnosisCode
                                                                          }
                                                                        </span>{" "}
                                                                        -{" "}
                                                                        {
                                                                          data.actualDescription
                                                                        }
                                                                      </span>
                                                                    </div>
                                                                    {data.defaultPosition == "VALID" ?
                                                                      <span className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}>
                                                                      </span> : data.defaultPosition == "SUGGESTED" ?

                                                                        <span className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}>
                                                                        </span>
                                                                        : data.defaultPosition == "DELETED" ?

                                                                          <span className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}>
                                                                          </span> : null}
                                                                    <Popover
                                                                      onClick={() =>
                                                                        getValidHccDetails(
                                                                          data.actualDescription,
                                                                          data.diagnosisCode
                                                                        )
                                                                      }
                                                                      content={
                                                                        validHccDetails
                                                                      }
                                                                      title={
                                                                        data.diagnosisCode
                                                                      }
                                                                      placement="bottom"
                                                                      trigger="click"
                                                                    >
                                                                      <i>
                                                                        {
                                                                          SVGICON.infoIcon
                                                                        }
                                                                      </i>
                                                                    </Popover>
                                                                    {data.getPlace ==
                                                                      "Radio" || data.getPlace ==
                                                                      "Lab" ?
                                                                      <Popconfirm
                                                                        title="Choose an action"
                                                                        icon={
                                                                          <QuestionCircleOutlined
                                                                            style={{
                                                                              color:
                                                                                "blue",
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
                                                                        onConfirm={
                                                                          suggestedToDeleted
                                                                        }
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
                                                                            style={{ size: 8, color: "#a80404" }}
                                                                          />
                                                                        </div>
                                                                      </Popconfirm>

                                                                      : <Popconfirm
                                                                        title="Choose an action"
                                                                        icon={
                                                                          <QuestionCircleOutlined
                                                                            style={{
                                                                              color:
                                                                                "blue",
                                                                            }}
                                                                          />
                                                                        }
                                                                        okText="Move to Deleted"
                                                                        cancelText="Move to HCC"
                                                                        onCancel={
                                                                          suggestedToValid
                                                                        }
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
                                                                        onConfirm={
                                                                          suggestedToDeleted
                                                                        }
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
                                                                            style={{ size: 8, color: "#a80404" }}
                                                                          />
                                                                        </div>
                                                                      </Popconfirm>}
                                                                  </div>
                                                                  <div className={`${visitStyles.hoverActiveHcc}`}>
                                                                    <div className="">

                                                                      {getEncounterDateBackground(data.encounterDateSplit)}
                                                                      {data.getPlace ==
                                                                        "Lab" ? (
                                                                        <Tooltip title="LAB">
                                                                          <span
                                                                            className={` mt-2 ${visitStyles.labStatus}`}
                                                                            bg={`  mt-2 bg-bg-seven `}
                                                                          >
                                                                            Lap
                                                                          </span>
                                                                        </Tooltip>
                                                                      ) : data.getPlace ==
                                                                        "Radio" ? (
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

                                                                    </div>
                                                                    <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                                      {getCaptureSectionBackground(data.capturedSections)}
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
                                                                  -{" "}
                                                                  {
                                                                    data.actualDescription
                                                                  }
                                                                </span>
                                                              </div>
                                                              {data.defaultPosition == "VALID" ?
                                                                <span className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}>
                                                                </span> : data.defaultPosition == "SUGGESTED" ?

                                                                  <span className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}>
                                                                  </span>
                                                                  : data.defaultPosition == "DELETED" ?

                                                                    <span className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}>
                                                                    </span> : null}
                                                              <Popover
                                                                content={
                                                                  data.dbDescription
                                                                }
                                                                title={
                                                                  data.diagnosisCode
                                                                }
                                                                placement="bottom"
                                                                trigger="click"
                                                              >
                                                                <Tooltip title="HCC Veriosn Details" placement="bottom">
                                                                  <i>
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
                                                                okText="Move to Suggested"
                                                                cancelText="Move to HCC"
                                                                onCancel={
                                                                  deletedToValid
                                                                }
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
                                                                onConfirm={
                                                                  deletedToSuggested
                                                                }
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
                                                                    style={{ size: 8, color: "#a80404" }}
                                                                  />
                                                                </div>
                                                              </Popconfirm>
                                                            </div>
                                                            <div className={`${visitStyles.hoverActiveHcc}`}>
                                                              <div className="">

                                                                {getEncounterDateBackground(data.encounterDateSplit)}

                                                                {/* <Popover placement="topLeft" content={ patientDocumentResult.patientName}>
                                                      <Badge className="badge-meat text-white cr-pointer badge-circle mt-2" bg={` badge-circle mt-2 bg-bg-five`} onClick={() => handleOpenModalCombinationCode(data.diagnosisCode, data.actualDescription)}>
                                                      <FontAwesomeIcon
                                                          icon={faSearch}
                                                          style={{ color: "#fff" }}
                                                        />
                                                        HPI Test Urlplan
                                                      </Badge>
                                                      </Popover> */}
                                                              </div>
                                                              <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                                {getCaptureSectionBackground(data.capturedSections)}
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
                                      <Tab.Pane id="my-posts" eventKey="nonhcc">
                                        <div className="my-post-content pt-3">
                                          <div className="widget-media   ps--active-y">
                                            <div className="row">
                                              <div className="col-xl-6">
                                                <ul className="timeline">
                                                  <div className="invalid-text d-flex justify-content-sm-between">
                                                    <span
                                                      className={`dang d-block`}
                                                    >
                                                      {" "}
                                                      NON-HCC{" "}
                                                      <Badge
                                                        as="a"
                                                        href=""
                                                        bg="badge-circle invalid-bange"
                                                      >
                                                        {
                                                          newInValidDiseaseList.length
                                                        }
                                                      </Badge>
                                                    </span>
                                                    <div className="d-flex justify-content-center">
                                                      <button
                                                        onClick={() =>
                                                          addValidDiseases()
                                                        }
                                                        className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faAdd}
                                                          fontSize={11}
                                                        />
                                                      </button>
                                                    </div>
                                                  </div>
                                                  {newInValidDiseaseList.map(
                                                    (data, i) => (
                                                      <li>
                                                        <div className="timeline-panel invalid-disease">
                                                          <div className="media-body">
                                                            <span className="mb-1 disease-name d-flex">
                                                              <span className="valid-dis-name">
                                                                {data.diagnosisCode}
                                                              </span>{" "}
                                                              -{" "}
                                                              {
                                                                data.actualDescription
                                                              }
                                                            </span>
                                                          </div>
                                                          <Popconfirm
                                                            title="You want move to valid?"
                                                            description={
                                                              data.diagnosisCode
                                                            }
                                                            onConfirm={
                                                              confirmInvalid
                                                            }
                                                            placement="leftTop"
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onOpenChange={() =>
                                                              onchangeValid(
                                                                data.diagnosisCode
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
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                              {/* {validDiseasesList.length == 0 ?
                                              <div className="card box-shadow-none">
                                                <div className="card combo-card">
                                                  <div className="col-xl-12">

                                                    <span className="no-patient-data">NO DATA</span>
                                                  </div>
                                                </div></div>
                                              : null} */}
                                            </div>
                                          </div>
                                        </div>
                                      </Tab.Pane>

                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="comboDiseases"
                                      >
                                        <div className={`${visitStyles.comboContainer}`}>
                                          <div className={`row ${visitStyles.comboContainer2}`}>
                                            <div className="col-xl-6">
                                              <div className={`${visitStyles.comboTitle}`}>
                                                <span>VALID CODES </span>
                                              </div>
                                              <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
                                                <div
                                                  className={
                                                    visitStyles.combo_head_card
                                                  }
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
                                                          className={
                                                            visitStyles.combo_add_btn
                                                          }
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={
                                                              faPlus
                                                            }
                                                            style={{
                                                              color:
                                                                "#fff",
                                                              size: 12
                                                            }}
                                                          />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                {comboDiseaseCodesList.length != 0 ?
                                                  <div className={visitStyles.container}>
                                                    <div className={visitStyles.hccStickey_head}>
                                                      {comboDiseaseCodesList?.map(
                                                        (item) => {
                                                          return (
                                                            <div
                                                              className={
                                                                visitStyles.combo_details_card
                                                              }
                                                            >
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
                                                                <div
                                                                  className="col-xl-5 cr-pointer"
                                                                  onClick={() =>
                                                                    handleOpenModalCombinationCode(
                                                                      item.diagnosisCodeCombo,
                                                                      item.diseaseName
                                                                    )
                                                                  }
                                                                >
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
                                                                    <div
                                                                      className={
                                                                        visitStyles.close_icon
                                                                      }
                                                                    >
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
                                                        }
                                                      )}
                                                    </div>
                                                  </div> : null}

                                                {comboDiseaseCodesList.length == 0 ? (

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
                                              <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
                                                <div
                                                  className={
                                                    visitStyles.combo_head_card
                                                  }
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
                                                  </div>
                                                </div>
                                                {invalidComboDiseaseCodesList.length !=
                                                  0 ? (
                                                  <>
                                                    <div className={visitStyles.container}>
                                                      <div className={visitStyles.hccStickey_head}>
                                                        {invalidComboDiseaseCodesList?.map(
                                                          (item) => {
                                                            return (
                                                              <div
                                                                className={
                                                                  visitStyles.combo_details_card
                                                                }
                                                              >
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
                                                                  <div
                                                                    className="col-xl-5 cr-pointer"
                                                                    onClick={() =>
                                                                      handleOpenModalCombinationCode(
                                                                        item.diagnosisCodeCombo,
                                                                        item.diseaseName
                                                                      )
                                                                    }
                                                                  >
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
                                                          }
                                                        )}
                                                      </div> </div>

                                                  </>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                      </Tab.Pane>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="meatCriteria"
                                      >
                                        <div className="my-post-content pt-3">
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
                                          {meatCriteriaList.length != 0 ?
                                            <div className={visitStyles.container}>
                                              <div
                                                className={visitStyles.hccStickey_head}
                                              >
                                                {meatCriteriaList?.map((item) => {
                                                  return (
                                                    <div
                                                      className={
                                                        item.isMeatCriteriaPresent ===
                                                          true
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
                                                              handleOpenModal(
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
                                                              handleOpenModal(
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
                                                              handleOpenModal(
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
                                                              handleOpenModal(
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
                                                          {/* {item.isMeatCriteriaPresent === true ?
                                             <span  className="badge badge-rounded badge-warning badge-meat">
                                             True
                                           </span>:
                                            <Badge  bg="success badge-circle mt-2">{item.isMeatCriteriaPresent}</Badge>} */}
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
                                                            <div
                                                              className={
                                                                visitStyles.close_icon
                                                              }
                                                            >
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

                                                    {invalidMeatCriteriaList?.map(
                                                      (item) => {
                                                        return (
                                                          <div
                                                            className={
                                                              visitStyles.meat_details_card
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
                                                                  content={
                                                                    item.diseaseName
                                                                  }
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
                                                                <Badge
                                                                  className="badge-meat cr-pointer"
                                                                  bg={
                                                                    item.monitorCapturedFromHeader ===
                                                                      "HPI" ||
                                                                      item.monitorCapturedFromHeader ===
                                                                      "Plan: Hypertensive heart disease without heart failure" ||
                                                                      item.monitorCapturedFromHeader ===
                                                                      "Vital Signs"
                                                                      ? "third badge-circle mt-2"
                                                                      : item.monitorCapturedFromHeader ===
                                                                        "Impression" ||
                                                                        item.monitorCapturedFromHeader ===
                                                                        "Plan: COPD" ||
                                                                        item.monitorCapturedFromHeader ===
                                                                        "Assessments" ||
                                                                        item.monitorCapturedFromHeader ===
                                                                        "Assessment"
                                                                        ? "bg-eight badge-circle mt-2"
                                                                        : item.monitorCapturedFromHeader ===
                                                                          "Recommendations" ||
                                                                          item.monitorCapturedFromHeader ===
                                                                          "Plan: GERD without esophagitis" ||
                                                                          item.monitorCapturedFromHeader ===
                                                                          "Treatment"
                                                                          ? "bgshodowcolor badge-circle mt-2"
                                                                          : item.monitorCapturedFromHeader ===
                                                                            "Plan / Discussion" ||
                                                                            item.monitorCapturedFromHeader ===
                                                                            "Plan: Arteriosclerotic cardiovascular disease"
                                                                            ? "bg-four badge-circle mt-2"
                                                                            : item.monitorCapturedFromHeader ===
                                                                              "Patient Instructions" ||
                                                                              item.monitorCapturedFromHeader ===
                                                                              "Plan: Hyperlipidemia, acquired"
                                                                              ? "bg-five badge-circle mt-2"
                                                                              : item.monitorCapturedFromHeader ===
                                                                                "N/A"
                                                                                ? "bg-six badge-circle mt-2"
                                                                                : item.monitorCapturedFromHeader ===
                                                                                  "Plan"
                                                                                  ? "bg-seven badge-circle mt-2"
                                                                                  : "primary badge-circle mt-2"
                                                                  }
                                                                  onClick={() =>
                                                                    handleOpenModal(
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
                                                                <Popover
                                                                  placement="topLeft"
                                                                  title="Evaluation"
                                                                  content={item.evaluate}
                                                                >
                                                                  <span className="meat-name-details">
                                                                    {item.evaluate}
                                                                  </span>
                                                                </Popover>
                                                                <Badge
                                                                  className="badge-meat cr-pointer"
                                                                  bg={
                                                                    item.evaluateCapturedFromHeader ===
                                                                      "HPI" ||
                                                                      item.evaluateCapturedFromHeader ===
                                                                      "Plan: Hypertensive heart disease without heart failure" ||
                                                                      item.evaluateCapturedFromHeader ===
                                                                      "Vital Signs"
                                                                      ? "third badge-circle mt-2"
                                                                      : item.evaluateCapturedFromHeader ===
                                                                        "Impression" ||
                                                                        item.evaluateCapturedFromHeader ===
                                                                        "Plan: COPD" ||
                                                                        item.evaluateCapturedFromHeader ===
                                                                        "Assessments" ||
                                                                        item.evaluateCapturedFromHeader ===
                                                                        "Assessment"
                                                                        ? "bg-eight badge-circle mt-2"
                                                                        : item.evaluateCapturedFromHeader ===
                                                                          "Recommendations" ||
                                                                          item.evaluateCapturedFromHeader ===
                                                                          "Plan: GERD without esophagitis" ||
                                                                          item.evaluateCapturedFromHeader ===
                                                                          "Treatment"
                                                                          ? "bgshodowcolor badge-circle mt-2"
                                                                          : item.evaluateCapturedFromHeader ===
                                                                            "Plan / Discussion" ||
                                                                            item.evaluateCapturedFromHeader ===
                                                                            "Plan: Arteriosclerotic cardiovascular disease"
                                                                            ? "bg-four badge-circle mt-2"
                                                                            : item.evaluateCapturedFromHeader ===
                                                                              "Patient Instructions" ||
                                                                              item.evaluateCapturedFromHeader ===
                                                                              "Plan: Hyperlipidemia, acquired"
                                                                              ? "bg-five badge-circle mt-2"
                                                                              : item.evaluateCapturedFromHeader ===
                                                                                "N/A"
                                                                                ? "bg-six badge-circle mt-2"
                                                                                : item.evaluateCapturedFromHeader ===
                                                                                  "Plan"
                                                                                  ? "bg-seven badge-circle mt-2"
                                                                                  : "primary badge-circle mt-2"
                                                                  }
                                                                  onClick={() =>
                                                                    handleOpenModal(
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
                                                                <Popover
                                                                  placement="topLeft"
                                                                  title="Assessment"
                                                                  content={
                                                                    item.assessment
                                                                  }
                                                                >
                                                                  <span className="meat-name-details">
                                                                    {item.assessment}
                                                                  </span>
                                                                </Popover>
                                                                <Badge
                                                                  className="badge-meat cr-pointer"
                                                                  bg={
                                                                    item.assessmentCapturedFromHeader ===
                                                                      "HPI" ||
                                                                      item.assessmentCapturedFromHeader ===
                                                                      "Plan: Hypertensive heart disease without heart failure" ||
                                                                      item.assessmentCapturedFromHeader ===
                                                                      "Vital Signs"
                                                                      ? "third badge-circle mt-2"
                                                                      : item.assessmentCapturedFromHeader ===
                                                                        "Impression" ||
                                                                        item.assessmentCapturedFromHeader ===
                                                                        "Plan: COPD" ||
                                                                        item.assessmentCapturedFromHeader ===
                                                                        "Assessments" ||
                                                                        item.assessmentCapturedFromHeader ===
                                                                        "Assessment"
                                                                        ? "bg-eight badge-circle mt-2"
                                                                        : item.assessmentCapturedFromHeader ===
                                                                          "Recommendations" ||
                                                                          item.assessmentCapturedFromHeader ===
                                                                          "Plan: GERD without esophagitis" ||
                                                                          item.assessmentCapturedFromHeader ===
                                                                          "Treatment"
                                                                          ? "bgshodowcolor badge-circle mt-2"
                                                                          : item.assessmentCapturedFromHeader ===
                                                                            "Plan / Discussion" ||
                                                                            item.assessmentCapturedFromHeader ===
                                                                            "Plan: Arteriosclerotic cardiovascular disease"
                                                                            ? "bg-four badge-circle mt-2"
                                                                            : item.assessmentCapturedFromHeader ===
                                                                              "Patient Instructions" ||
                                                                              item.assessmentCapturedFromHeader ===
                                                                              "Plan: Hyperlipidemia, acquired"
                                                                              ? "bg-five badge-circle mt-2"
                                                                              : item.assessmentCapturedFromHeader ===
                                                                                "N/A"
                                                                                ? "bg-six badge-circle mt-2"
                                                                                : item.assessmentCapturedFromHeader ===
                                                                                  "Plan"
                                                                                  ? "bg-seven badge-circle mt-2"
                                                                                  : "primary badge-circle mt-2"
                                                                  }
                                                                  onClick={() =>
                                                                    handleOpenModal(
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
                                                                <Popover
                                                                  placement="topLeft"
                                                                  title="Treatment"
                                                                  content={item.treatment}
                                                                >
                                                                  <span className="meat-name-details">
                                                                    {item.treatment}
                                                                  </span>
                                                                </Popover>

                                                                <Badge
                                                                  className="badge-meat cr-pointer"
                                                                  bg={
                                                                    item.treatmentCapturedFromHeader ===
                                                                      "HPI" ||
                                                                      item.treatmentCapturedFromHeader ===
                                                                      "Plan: Hypertensive heart disease without heart failure" ||
                                                                      item.treatmentCapturedFromHeader ===
                                                                      "Vital Signs"
                                                                      ? "third badge-circle mt-2"
                                                                      : item.treatmentCapturedFromHeader ===
                                                                        "Impression" ||
                                                                        item.treatmentCapturedFromHeader ===
                                                                        "Plan: COPD" ||
                                                                        item.treatmentCapturedFromHeader ===
                                                                        "Assessments" ||
                                                                        item.treatmentCapturedFromHeader ===
                                                                        "Assessment"
                                                                        ? "bg-eight badge-circle mt-2"
                                                                        : item.treatmentCapturedFromHeader ===
                                                                          "Recommendations" ||
                                                                          item.treatmentCapturedFromHeader ===
                                                                          "Plan: GERD without esophagitis" ||
                                                                          item.treatmentCapturedFromHeader ===
                                                                          "Treatment"
                                                                          ? "bgshodowcolor badge-circle mt-2"
                                                                          : item.treatmentCapturedFromHeader ===
                                                                            "Plan / Discussion" ||
                                                                            item.treatmentCapturedFromHeader ===
                                                                            "Plan: Arteriosclerotic cardiovascular disease"
                                                                            ? "bg-four badge-circle mt-2"
                                                                            : item.treatmentCapturedFromHeader ===
                                                                              "Patient Instructions" ||
                                                                              item.treatmentCapturedFromHeader ===
                                                                              "Plan: Hyperlipidemia, acquired"
                                                                              ? "bg-five badge-circle mt-2"
                                                                              : item.treatmentCapturedFromHeader ===
                                                                                "N/A"
                                                                                ? "bg-six badge-circle mt-2"
                                                                                : item.treatmentCapturedFromHeader ===
                                                                                  "Plan"
                                                                                  ? "bg-seven badge-circle mt-2"
                                                                                  : "primary badge-circle mt-2"
                                                                  }
                                                                  onClick={() =>
                                                                    handleOpenModal(
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
                                                                  title="You want move to Valid?"
                                                                  description={
                                                                    item.diseaseName
                                                                  }
                                                                  onConfirm={
                                                                    confirmValidMeat
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
                                              </div>
                                            </div> : null}
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
                                                      {rafScore.scoreOutputDTOList !=
                                                        null ? (
                                                        <>
                                                          {rafScore.scoreOutputDTOList.map(
                                                            (rafScoreMapResult) => {
                                                              return (
                                                                <>
                                                                  <label className={`${visitStyles.labelStyle}`}>{rafScoreMapResult.hcc_model.version}</label>
                                                                  <div className="row raf-main-card">
                                                                    {/* <div className="col-xl-3">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head text-center">
                                                                <div className="col-xl-12">
                                                                  <label >
                                                                    Summary
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <div className="row raf-details">
                                                                <div className="col-xl-6">
                                                                  <span>
                                                                    {
                                                                      rafScoreMapResult
                                                                        .hcc_model
                                                                        .model
                                                                    }
                                                                  </span>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                  <span>
                                                                    {
                                                                      rafScoreMapResult
                                                                        .hcc_model
                                                                        .version
                                                                    }
                                                                  </span>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div> */}
                                                                    <div className="col-xl-4">
                                                                      <div className="raf-card">
                                                                        <div className="row raf-head">
                                                                          <div className="col-xl-6">
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              DX Code
                                                                            </label>
                                                                          </div>
                                                                          <div className="col-xl-6">
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              DX
                                                                              Description
                                                                            </label>
                                                                          </div>
                                                                        </div>

                                                                        {rafScoreMapResult.dx_hccs.map(
                                                                          (item) => {
                                                                            return (
                                                                              <div className="row raf-details">
                                                                                <div className="col-xl-6">
                                                                                  <span>
                                                                                    {
                                                                                      item.dx_name
                                                                                    }
                                                                                  </span>
                                                                                </div>
                                                                                <div className="col-xl-6">
                                                                                  <span>
                                                                                    {
                                                                                      item.dx_desc
                                                                                    }
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
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              HCC
                                                                            </label>
                                                                          </div>
                                                                          <div className="col-xl-6">
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              HCC
                                                                              Description
                                                                            </label>
                                                                          </div>
                                                                        </div>
                                                                        {rafScoreMapResult.dx_hccs.map(
                                                                          (res) => {
                                                                            return res.hcc_list.map(
                                                                              (
                                                                                res1
                                                                              ) => {
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
                                                                          <div className="col-xl-4">
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              Trumped By
                                                                            </label>
                                                                          </div>
                                                                          <div className="col-xl-4">
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              RAF
                                                                            </label>
                                                                          </div>
                                                                          <div className="col-xl-4">
                                                                            <label className={`${visitStyles.labelStyle}`}>
                                                                              Monthly
                                                                              Premium
                                                                            </label>
                                                                          </div>
                                                                        </div>
                                                                        {rafScoreMapResult.dx_hccs.map(
                                                                          (res) => {
                                                                            return res.hcc_list.map(
                                                                              (
                                                                                res1
                                                                              ) => {
                                                                                return (
                                                                                  <div className="row  raf-details">
                                                                                    <div className="col-xl-4">
                                                                                      <span>
                                                                                        -
                                                                                      </span>
                                                                                    </div>
                                                                                    <div className="col-xl-4">
                                                                                      <span>
                                                                                        {
                                                                                          res1.hcc_raf
                                                                                        }
                                                                                      </span>
                                                                                    </div>
                                                                                    <div className="col-xl-4">
                                                                                      <span>
                                                                                        $
                                                                                        {
                                                                                          res1.premium
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
                                                                  </div>
                                                                </>
                                                              );
                                                            }
                                                          )}
                                                        </>
                                                      ) : null}
                                                    </div>
                                                    <div className="col-xl-3">
                                                      <label className={`${visitStyles.labelStyle}`}>Overall score</label>
                                                      <div className={`row raf-main-card ${visitStyles.overallScoreContainer}`}>
                                                        <div className="raf-card ">
                                                          <div className="row raf-head">
                                                            <div className="col-xl-4">
                                                              <label className={`${visitStyles.labelStyle}`}>
                                                                V24 score
                                                              </label>
                                                            </div>
                                                            <div className="col-xl-4">
                                                              <label className={`${visitStyles.labelStyle}`}>
                                                                v24Score(70%)
                                                              </label>
                                                            </div>
                                                          </div>

                                                          <div className="row  raf-details">
                                                            <div className="col-xl-4">
                                                              <span>
                                                                {rafScore.v24Score}
                                                              </span>
                                                            </div>
                                                            <div className="col-xl-4">
                                                              <span>
                                                                {
                                                                  rafScore.v24Score70Percent
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="raf-card">
                                                          <div className="row raf-head">
                                                            <div className="col-xl-4">
                                                              <label className={`${visitStyles.labelStyle}`}>
                                                                V28 score
                                                              </label>
                                                            </div>
                                                            <div className="col-xl-4">
                                                              <label className={`${visitStyles.labelStyle}`}>
                                                                v28Score(30%)
                                                              </label>
                                                            </div>
                                                          </div>

                                                          <div className="row  raf-details">
                                                            <div className="col-xl-4 ">
                                                              <span>
                                                                {rafScore.v28Score}
                                                              </span>
                                                            </div>
                                                            <div className="col-xl-4">
                                                              <span>
                                                                {
                                                                  rafScore.v28Score30Percent
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="raf-card">
                                                          <div className=" col raf-head">
                                                            <div className="col-xl-12">
                                                              <label className={`${visitStyles.labelStyle}`}>
                                                                Overall score
                                                              </label>
                                                            </div>
                                                          </div>

                                                          <div className="row  raf-details">
                                                            <span>
                                                              {
                                                                rafScore.score
                                                              }
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>

                                                    {/* <div className="col-xl-2">
                                              <div className="row raf-score-card">
                                                <div className="raf-name-head">
                                                  <h5 className="raf-model-version">
                                                    SCORE DETAILS
                                                  </h5>
                                                </div>

                                                <div className="col-xl-3">
                                                  <div className="card">
                                                    <div className="raf-card">
                                                      <div className="row raf-head">
                                                        <div className="col-xl-2">
                                                          <label >
                                                            v24Score
                                                          </label>
                                                        </div>
                                                        <div className="col-xl-3">
                                                          <label >
                                                            v24Score70Percent
                                                          </label>
                                                        </div>
                                                        <div className="col-xl-2">
                                                          <label >
                                                            v28Score
                                                          </label>
                                                        </div>
                                                        <div className="col-xl-3">
                                                          <label >
                                                            v28Score30Percent
                                                          </label>
                                                        </div>
                                                        <div className="col-xl-2">
                                                          <label >
                                                            Score
                                                          </label>
                                                        </div>
                                                      </div>
                                                      <div className="row  raf-details">
                                                        <div className="col-xl-2">
                                                          <span>
                                                            {rafScore.v24Score}
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-3">
                                                          <span>
                                                            {
                                                              rafScore.v24Score70Percent
                                                            }
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-2">
                                                          <span>
                                                            {rafScore.v28Score}
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-3">
                                                          <span>
                                                            {
                                                              rafScore.v28Score30Percent
                                                            }
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-2">
                                                          <span>
                                                            {rafScore.score}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div> */}
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
                                                  //   </div>
                                                  // </div>
                                                ) : null}
                                              </div>
                                            </div>
                                            {/* <div className="">

                                      <div className="compete-card">
                                        <Button
                                          className="btn btn-primary btn-sm me-1"
                                        >
                                          Compete
                                        </Button>
                                      </div>


                                    </div> */}
                                          </div>
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane id="my-posts" eventKey="file">
                                        <div className="my-post-content pt-3 row">
                                          <div className="col-xl-2">
                                            <ul className="timeline">
                                              <div
                                                className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                                              >
                                                <span
                                                  className={`${visitStyles.hcc_title_name}`}
                                                >

                                                  HCC
                                                  <FontAwesomeIcon onClick={() =>
                                                    addValidDiseases()
                                                  }
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

                                                  {newValidDiseaseList.map(
                                                    (data, i) => (
                                                      <li>
                                                        <div
                                                          className={`hccActiveCard ${visitStyles.hcc_card}`}
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


                                                                  {
                                                                    data.diagnosisCode
                                                                  }
                                                                </span>{" "}
                                                                -{" "}
                                                                {
                                                                  data.actualDescription
                                                                }

                                                              </span>
                                                            </div>

                                                            {data.defaultPosition == "VALID" ?
                                                              <span className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}>
                                                              </span> : data.defaultPosition == "SUGGESTED" ?

                                                                <span className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}>
                                                                </span>
                                                                : data.defaultPosition == "DELETED" ?

                                                                  <span className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}>
                                                                  </span> : null}
                                                            <Popover
                                                              onClick={() =>
                                                                getValidHccDetails(
                                                                  data.actualDescription,
                                                                  data.diagnosisCode
                                                                )
                                                              }
                                                              content={
                                                                validHccDetails
                                                              }
                                                              title={
                                                                data.diagnosisCode
                                                              }
                                                              placement="bottom"
                                                              trigger="click"
                                                            >
                                                              <Tooltip title="HCC Veriosn Details" placement="bottom">
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
                                                              onCancel={
                                                                validToSuggested
                                                              }
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
                                                              onConfirm={
                                                                confirmvalid
                                                              }
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
                                                                {<FontAwesomeIcon
                                                                  icon={faArrowsAlt}
                                                                  style={{ size: 8, color: "#a80404" }}
                                                                />}
                                                              </div>
                                                            </Popconfirm>
                                                          </div>
                                                          <div className={`${visitStyles.hoverActiveHcc}`}>
                                                            <div className={`${visitStyles.encounterAndSectionHeader}`} >

                                                              {getEncounterDateBackground(data.encounterDateSplit)}
                                                              {data.isManuallyAdded == true ?
                                                             
                                                                  <Badge
                                                                    className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                                                  >
                                                                    Manually Added

                                                                  </Badge>
                                                               : null}
                                                            </div>
                                                            <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                              {getCaptureSectionBackground(data.capturedSections)}
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
                                          <div className="col-xl-8">
                                            {/* <div>
                                            <button
                                              onClick={() =>
                                                openNewTabDownloadPdf()
                                              }
                                              className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                            >
                                              Open New Tab
                                            </button>
                                          </div> */}
                                            <div className="card-body p-0">
                                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                                <div
                                                  style={{
                                                    height: "70vh",
                                                    maxWidth: "800px",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                  }}
                                                >
                                                  {" "}
                                                  <Viewer
                                                    fileUrl={selectFileURL}
                                                    plugins={[
                                                      defaultLayoutPluginInstance,
                                                    ]}
                                                    onDocumentLoad={
                                                      handleDocumentLoad
                                                    }
                                                    renderLoader={(percentages) => (
                                                      <div
                                                        style={{ width: "240px" }}
                                                      >
                                                        <ProgressBar
                                                          progress={Math.round(
                                                            percentages
                                                          )}
                                                        />
                                                      </div>
                                                    )}
                                                  />
                                                </div>
                                              </Worker>
                                            </div>
                                          </div>

                                        </div>
                                      </Tab.Pane>
                                    </Tab.Content>
                                  </Tab.Container>
                                </div>
                              </div>
                            </div>
                          ) : activeTab == 2 ? (
                            <div className={visitStyles.visitdata_tab_body}>
                              <div
                                className={`profile-tab ${visitStyles.visitdata_header_card2}`}
                              >
                                <div className="custom-tab-1">
                                  <Tab.Container defaultActiveKey={activeTabHead}>
                                    <Nav as="ul" className="nav nav-tabs">

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
                                      <Nav.Item as="li" className="nav-item">
                                        <Nav.Link to="#my-posts" className={visitStyles.navColor}
                                          activeClassName={visitStyles.activeLink} eventKey="file">
                                          File
                                        </Nav.Link>
                                      </Nav.Item>
                                    </Nav>
                                    <Tab.Content>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="validDiseases"
                                      >
                                        <div className="my-post-content pt-3">
                                          <div className="widget-media   ps--active-y">
                                            <div className="row">
                                              <div className="col-xl-4">
                                                <ul className="timeline">
                                                  <div
                                                    className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                                                  >
                                                    <span
                                                      className={`${visitStyles.hcc_title_name}`}
                                                    >
                                                      NON-HCC
                                                    </span>
                                                    <div className="d-flex justify-content-center">
                                                      <span
                                                        className={`${visitStyles.hcc_title_badge}`}
                                                      >
                                                        {
                                                          newInValidDiseaseList.length
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <div className={visitStyles.container}>
                                                    {newInValidDiseaseList.map(
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
                                                                  handleOpenModalCombinationCode(
                                                                    data.diagnosisCode,
                                                                    data.actualDescription,
                                                                    "valid2",
                                                                    "nonHcc"
                                                                  )
                                                                }
                                                              >
                                                                <span className="mb-1 disease-name d-flex">
                                                                  <span className="valid-dis-name">
                                                                    {
                                                                      data.diagnosisCode
                                                                    }
                                                                  </span>{" "}
                                                                  -{" "}
                                                                  {
                                                                    data.actualDescription
                                                                  }
                                                                </span>
                                                              </div>

                                                              <Popconfirm
                                                                title="You want move to valid?"
                                                                description={
                                                                  data.diagnosisCode
                                                                }
                                                                onConfirm={
                                                                  confirmInvalid
                                                                }
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
                                                                <div
                                                                  className={
                                                                    visitStyles.close_icon
                                                                  }
                                                                >
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
                                                              {getEncounterDateBackground(data.encounterDateSplit)}
                                                              <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                                {getCaptureSectionBackground(data.capturedSections)}
                                                              </div>

                                                            </div>

                                                          </div>
                                                        </li>
                                                      )
                                                    )}
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
                                                            {data.isHccValid == false || data.isHccValid == null ? (
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
                                                                          {
                                                                            data.diagnosisCode
                                                                          }
                                                                        </span>{" "}
                                                                        -{" "}
                                                                        {
                                                                          data.actualDescription
                                                                        }
                                                                      </span>
                                                                    </div>


                                                                    <Popconfirm
                                                                      title="Choose an action"
                                                                      icon={
                                                                        <QuestionCircleOutlined
                                                                          style={{
                                                                            color:
                                                                              "blue",
                                                                          }}
                                                                        />
                                                                      }
                                                                      okText="Move to Deleted"
                                                                      cancelText="Move to HCC"
                                                                      onCancel={
                                                                        suggestedToValid
                                                                      }
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
                                                                      onConfirm={
                                                                        suggestedToDeleted
                                                                      }
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
                                                                          style={{ size: 8, color: "#a80404" }}
                                                                        />
                                                                      </div>
                                                                    </Popconfirm>
                                                                  </div>
                                                                  <div className="">


                                                                    {getEncounterDateBackground(data.encounterDateSplit)}
                                                                    {data.getPlace ==
                                                                      "Lab" ? (
                                                                      <Tooltip title="LAB">
                                                                        <span
                                                                          className={` mt-2 ${visitStyles.labStatus}`}
                                                                          bg={`  mt-2 bg-bg-seven `}
                                                                        >
                                                                          Lap
                                                                        </span>
                                                                      </Tooltip>
                                                                    ) : data.getPlace ==
                                                                      "Radio" ? (
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
                                                                    <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                                      {getCaptureSectionBackground(data.capturedSections)}
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

                                              {/* <div className="col-xl-4">
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
                                                {suggestedNonHccList?.map(
                                                  (data) => {
                                                    return (
                                                      <>
                                                        {data.isHccValid ==
                                                          false ||
                                                          data.isHccValid ==
                                                          null ? (
                                                          <li>
                                                            <div className="new_valid-dis">
                                                              <div className="timeline-panel">
                                                                <div
                                                                  className="media-body"
                                                                  onClick={() =>
                                                                    handleOpenModalCombinationCode(
                                                                      data.diagnosisCode,
                                                                      data.actualDescription,
                                                                      "valid2",
                                                                      "nonHcc"
                                                                    )
                                                                  }
                                                                >
                                                                  <span className="mb-1 disease-name d-flex">
                                                                    <span className="valid-dis-name">
                                                                      {
                                                                        data.diagnosisCode
                                                                      }
                                                                    </span>{" "}
                                                                    -{" "}
                                                                    {
                                                                      data.actualDescription
                                                                    }
                                                                  </span>
                                                                </div>
                                                                <Popconfirm
                                                                  title="Choose an action"
                                                                  icon={
                                                                    <QuestionCircleOutlined
                                                                      style={{
                                                                        color:
                                                                          "blue",
                                                                      }}
                                                                    />
                                                                  }
                                                                  okText="Move to Deleted"
                                                                  cancelText="Move to HCC"
                                                                  onCancel={
                                                                    suggestedToValid
                                                                  }
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
                                                                  onConfirm={
                                                                    suggestedToDeleted
                                                                  }
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
                                                                visitStyles.tick_icon
                                                              }
                                                            >
                                                              {SVGICON.tickIcon}
                                                              </div>
                                                                </Popconfirm>
                                                              </div>
                                                              <div className="d-flex justify-content-sm-between valid-providerdocument ">
                                                                <Popover
                                                                  placement="topLeft"
                                                                  content={
                                                                    data.encounterDate
                                                                  }
                                                                >
                                                                  <Badge
                                                                    bg=" badge-rounded"
                                                                    className="badge-outline-info  mt-2"
                                                                  >
                                                                    <FontAwesomeIcon
                                                                      icon={
                                                                        faCalendar
                                                                      }
                                                                      style={{
                                                                        color:
                                                                          "#918585",
                                                                      }}
                                                                    />
                                                                    {replaceString(
                                                                      data.encounterDate
                                                                    )}
                                                                  </Badge>
                                                                </Popover>
                                                                <Popover
                                                                  placement="topLeft"
                                                                  content={
                                                                    data.capturedSections
                                                                  }
                                                                >
                                                                  <Badge
                                                                    bg=" badge-rounded"
                                                                    className="badge-outline-info  mt-2 cr-pointer"
                                                                    onClick={() =>
                                                                      handleOpenModalCombinationCode(
                                                                        data.diagnosisCode,
                                                                        data.capturedSections,
                                                                        "valid"
                                                                      )
                                                                    }
                                                                  >
                                                                    {
                                                                      data.capturedSections
                                                                    }
                                                                  </Badge>
                                                                </Popover>
                                                              </div>
                                                            </div>
                                                          </li>
                                                        ) :
                                                        
                                                        
                                                          null}
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            </div> */}
                                            </div>
                                          </div>
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane id="my-posts" eventKey="nonhcc">
                                        <div className="my-post-content pt-3">
                                          <div className="widget-media   ps--active-y">
                                            <div className="row">
                                              <div className="col-xl-6">
                                                <ul className="timeline">
                                                  <div className="invalid-text d-flex justify-content-sm-between">
                                                    <span
                                                      className={`dang d-block`}
                                                    >
                                                      {" "}
                                                      NON-HCC{" "}
                                                      <Badge
                                                        as="a"
                                                        href=""
                                                        bg="badge-circle invalid-bange"
                                                      >
                                                        {
                                                          newInValidDiseaseList.length
                                                        }
                                                      </Badge>
                                                    </span>
                                                    <div className="d-flex justify-content-center">
                                                      <button
                                                        onClick={() =>
                                                          addValidDiseases()
                                                        }
                                                        className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faAdd}
                                                          fontSize={11}
                                                        />
                                                      </button>
                                                    </div>
                                                  </div>
                                                  {newInValidDiseaseList.map(
                                                    (data, i) => (
                                                      <li>
                                                        <div className="timeline-panel invalid-disease">
                                                          <div className="media-body">
                                                            <span className="mb-1 disease-name d-flex">
                                                              <span className="valid-dis-name">
                                                                {data.diagnosisCode}
                                                              </span>{" "}
                                                              -{" "}
                                                              {
                                                                data.actualDescription
                                                              }
                                                            </span>
                                                          </div>
                                                          <Popconfirm
                                                            title="You want move to valid?"
                                                            description={
                                                              data.diagnosisCode
                                                            }
                                                            onConfirm={
                                                              confirmInvalid
                                                            }
                                                            placement="leftTop"
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onOpenChange={() =>
                                                              onchangeValid(
                                                                data.diagnosisCode
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
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                              {validDiseasesList.length == 0 ? (
                                                <div className="card box-shadow-none">
                                                  <div className="card combo-card">
                                                    <div className="col-xl-12">
                                                      <span className="no-patient-data">
                                                        NO DATA
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="comboDiseases"
                                      >
                                        <div className={`${visitStyles.comboContainer}`}>
                                          <div className={`row ${visitStyles.comboContainer2}`}>
                                            <div className="col-xl-6">
                                              <div className={`${visitStyles.comboTitle}`}>
                                                <span>VALID CODES </span>
                                              </div>
                                              <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
                                                <div
                                                  className={
                                                    visitStyles.combo_head_card
                                                  }
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
                                                          className={
                                                            visitStyles.combo_add_btn
                                                          }
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={
                                                              faPlus
                                                            }
                                                            style={{
                                                              color:
                                                                "#fff",
                                                              size: 12
                                                            }}
                                                          />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                {comboDiseaseCodesListNonHcc.length != 0 ?
                                                  <div className={visitStyles.container}>
                                                    <div className={visitStyles.hccStickey_head}>
                                                      {comboDiseaseCodesListNonHcc?.map(
                                                        (item) => {
                                                          return (
                                                            <div
                                                              className={
                                                                visitStyles.combo_details_card
                                                              }
                                                            >
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
                                                                <div
                                                                  className="col-xl-5 cr-pointer"
                                                                  onClick={() =>
                                                                    handleOpenModalCombinationCode(
                                                                      item.diagnosisCodeCombo,
                                                                      item.diseaseName
                                                                    )
                                                                  }
                                                                >
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
                                                                    <div
                                                                      className={
                                                                        visitStyles.close_icon
                                                                      }
                                                                    >
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
                                                        }
                                                      )}
                                                    </div>
                                                  </div> : null}


                                                {comboDiseaseCodesListNonHcc.length == 0 ? (
                                                  // <div className="card combo-card">
                                                  //   <div className="col-xl-12">
                                                  <div>
                                                    <span className="no-patient-data">
                                                      NO DATA
                                                    </span>
                                                  </div>
                                                  //   </div>
                                                  // </div>
                                                ) : null}
                                              </div>
                                            </div>

                                            <div className="col-xl-6">
                                              <div className={`${visitStyles.comboTitle}`}>
                                                <span>DELETED COMBO CODES </span>
                                              </div>
                                              <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
                                                <div
                                                  className={
                                                    visitStyles.combo_head_card
                                                  }
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
                                                  </div>
                                                </div>
                                                {invalidComboDiseaseCodesList.length !=
                                                  0 ? (
                                                  <>
                                                    <div className={visitStyles.container}>
                                                      <div className={visitStyles.hccStickey_head}>
                                                        {invalidComboDiseaseCodesList?.map(
                                                          (item) => {
                                                            return (
                                                              <div
                                                                className={
                                                                  visitStyles.combo_details_card
                                                                }
                                                              >
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
                                                                  <div
                                                                    className="col-xl-5 cr-pointer"
                                                                    onClick={() =>
                                                                      handleOpenModalCombinationCode(
                                                                        item.diagnosisCodeCombo,
                                                                        item.diseaseName
                                                                      )
                                                                    }
                                                                  >
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
                                                          }
                                                        )}
                                                      </div>
                                                    </div>
                                                  </>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                      </Tab.Pane>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="meatCriteria"
                                      >
                                        <div className="my-post-content pt-3">
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
                                          {meatCriteriaListNonHcc.length != 0 ?
                                            <div className={visitStyles.container}>
                                              <div className={visitStyles.hccStickey_head}>
                                                {meatCriteriaListNonHcc?.map((item) => {
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
                                                              handleOpenModal(
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
                                                              handleOpenModal(
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
                                                              handleOpenModal(
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
                                                              handleOpenModal(
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
                                            </div> : null}
                                          {meatCriteriaListNonHcc.length == 0 ? (
                                            <div className="col-xl-12">
                                              <div>
                                                <span className="no-patient-data">
                                                  NO DATA
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
                                              {/* <div className="card raf-file-head">

                                        <div className="row">
                                          <div className="col-xl-12 mb-3 text-center">
                                            <Button
                                              className="btn btn-primary btn-sm me-1"
                                            >
                                              Uplaod File
                                            </Button>

                                          </div>
                                          <div className="col-xl-12 mb-3">
                                            <Form.Control
                                              required
                                              type="file"
                                              accept="application/pdf,text/plain"

                                            />
                                          </div>
                                          <div className="col-xl-12 mb-3">
                                            <Form.Control
                                              required
                                              type="date"

                                            />
                                          </div>
                                        </div>

                                      </div> */}
                                            </div>
                                            {rafScore != null ? (
                                              <div className="col-xl-12">
                                                {rafScore.scoreOutputDTOList !=
                                                  null ? (
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
                                                                      <label >
                                                                        Summary
                                                                      </label>
                                                                    </div>
                                                                  </div>
                                                                  <div className="row raf-details">
                                                                    <div className="col-xl-6">
                                                                      <span>
                                                                        {
                                                                          rafScoreMapResult
                                                                            .hcc_model
                                                                            .model
                                                                        }
                                                                      </span>
                                                                    </div>
                                                                    <div className="col-xl-6">
                                                                      <span>
                                                                        {
                                                                          rafScoreMapResult
                                                                            .hcc_model
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
                                                                      <label >
                                                                        DX Code
                                                                      </label>
                                                                    </div>
                                                                    <div className="col-xl-6">
                                                                      <label >
                                                                        DX
                                                                        Description
                                                                      </label>
                                                                    </div>
                                                                  </div>

                                                                  {rafScoreMapResult.dx_hccs.map(
                                                                    (item) => {
                                                                      return (
                                                                        <div className="row raf-details">
                                                                          <div className="col-xl-6">
                                                                            <span>
                                                                              {
                                                                                item.dx_name
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                          <div className="col-xl-6">
                                                                            <span>
                                                                              {
                                                                                item.dx_desc
                                                                              }
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
                                                                      <label >
                                                                        HCC
                                                                      </label>
                                                                    </div>
                                                                    <div className="col-xl-6">
                                                                      <label >
                                                                        HCC
                                                                        Description
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
                                                            </div>
                                                            <div className="col-xl-6">
                                                              <div className="card">
                                                                <div className="raf-card">
                                                                  <div className="row raf-head">
                                                                    <div className="col-xl-4">
                                                                      <label >
                                                                        Trumped By
                                                                      </label>
                                                                    </div>
                                                                    <div className="col-xl-4">
                                                                      <label >
                                                                        RAF
                                                                      </label>
                                                                    </div>
                                                                    <div className="col-xl-4">
                                                                      <label >
                                                                        Monthly
                                                                        Premium
                                                                      </label>
                                                                    </div>
                                                                  </div>
                                                                  {rafScoreMapResult.dx_hccs.map(
                                                                    (res) => {
                                                                      return res.hcc_list.map(
                                                                        (res1) => {
                                                                          return (
                                                                            <div className="row  raf-details">
                                                                              <div className="col-xl-4">
                                                                                <span>
                                                                                  -
                                                                                </span>
                                                                              </div>
                                                                              <div className="col-xl-4">
                                                                                <span>
                                                                                  {
                                                                                    res1.hcc_raf
                                                                                  }
                                                                                </span>
                                                                              </div>
                                                                              <div className="col-xl-4">
                                                                                <span>
                                                                                  $
                                                                                  {
                                                                                    res1.premium
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
                                                            <label >
                                                              v24Score
                                                            </label>
                                                          </div>
                                                          <div className="col-xl-3">
                                                            <label >
                                                              v24Score70Percent
                                                            </label>
                                                          </div>
                                                          <div className="col-xl-2">
                                                            <label >
                                                              v28Score
                                                            </label>
                                                          </div>
                                                          <div className="col-xl-3">
                                                            <label >
                                                              v28Score30Percent
                                                            </label>
                                                          </div>
                                                          <div className="col-xl-2">
                                                            <label >
                                                              Score
                                                            </label>
                                                          </div>
                                                        </div>
                                                        <div className="row  raf-details">
                                                          <div className="col-xl-2">
                                                            <span>
                                                              {rafScore.v24Score}
                                                            </span>
                                                          </div>
                                                          <div className="col-xl-3">
                                                            <span>
                                                              {
                                                                rafScore.v24Score70Percent
                                                              }
                                                            </span>
                                                          </div>
                                                          <div className="col-xl-2">
                                                            <span>
                                                              {rafScore.v28Score}
                                                            </span>
                                                          </div>
                                                          <div className="col-xl-3">
                                                            <span>
                                                              {
                                                                rafScore.v28Score30Percent
                                                              }
                                                            </span>
                                                          </div>
                                                          <div className="col-xl-2">
                                                            <span>
                                                              {rafScore.score}
                                                            </span>
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
                                                    <span className="no-patient-data">
                                                      NO DATA
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : null}
                                          </div>
                                          {/* <div className="">

                                    <div className="compete-card">
                                      <Button
                                        className="btn btn-primary btn-sm me-1"
                                      >
                                        Compete
                                      </Button>
                                    </div>


                                  </div> */}
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane id="my-posts" eventKey="file">
                                        <div className="my-post-content pt-3">
                                          <div>
                                            <button
                                              onClick={() =>
                                                openNewTabDownloadPdf()
                                              }
                                              className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                            >
                                              Open New Tab
                                            </button>
                                          </div>
                                          <div className="card-body p-0">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                              <div
                                                style={{
                                                  height: "70vh",
                                                  maxWidth: "900px",
                                                  marginLeft: "auto",
                                                  marginRight: "auto",
                                                }}
                                              >
                                                {" "}
                                                <Viewer
                                                  fileUrl={selectFileURL}
                                                  plugins={[
                                                    defaultLayoutPluginInstance,
                                                  ]}
                                                  onDocumentLoad={
                                                    handleDocumentLoad
                                                  }
                                                  renderLoader={(percentages) => (
                                                    <div
                                                      style={{ width: "240px" }}
                                                    >
                                                      <ProgressBar
                                                        progress={Math.round(
                                                          percentages
                                                        )}
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
                          ) : activeTab == 3 ? (
                            <div className={visitStyles.visitdata_tab_body}>
                              <div
                                className={`profile-tab ${visitStyles.visitdata_header_card2}`}
                              >
                                <div className="custom-tab-1">
                                  <Tab.Container defaultActiveKey={activeTabHead}>
                                    <Nav as="ul" className="nav nav-tabs">
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
                                      <Nav.Item as="li" className="nav-item">
                                        <Nav.Link to="#my-posts" eventKey="file" className={visitStyles.navColor}
                                          activeClassName={visitStyles.activeLink}>
                                          File
                                        </Nav.Link>
                                      </Nav.Item>

                                      {/* {activeTab == 3 ? (
                                        <div>
                                          <Button
                                            onClick={addPatientFile}
                                            className="btn btn-primary btn-sm ms-2 flr radiologyBtn"
                                          >
                                            + Add Patient Radiology
                                          </Button>
                                        </div>
                                      ) : null} */}
                                    </Nav>
                                    <Tab.Content>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="validDiseases"
                                      >
                                        <div className="my-post-content pt-3">
                                          <div className="widget-media   ps--active-y">
                                            <div className="row">
                                              <div className="col-xl-4">
                                                <ul className="timeline">
                                                  <div
                                                    className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                                                  >
                                                    <span
                                                      className={`${visitStyles.hcc_title_name}`}
                                                    >
                                                      HCC
                                                    </span>
                                                    <div className="d-flex justify-content-center">
                                                      <span
                                                        className={`${visitStyles.hcc_title_badge}`}
                                                      >
                                                        {
                                                          newValidDiseaseListRadiology.length
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>

                                                  {newValidDiseaseListRadiology.map(
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
                                                                handleOpenModalRadiology(
                                                                  data.diagnosisCode,
                                                                  data.actualDescription,
                                                                  true
                                                                )
                                                              }
                                                            >
                                                              <span className="mb-1 disease-name d-flex">
                                                                <span className="valid-dis-name">
                                                                  {
                                                                    data.diagnosisCode
                                                                  }
                                                                </span>{" "}
                                                                -{" "}
                                                                {
                                                                  data.actualDescription
                                                                }
                                                              </span>
                                                            </div>



                                                            <Popconfirm
                                                              title="You want to delete?"
                                                              description={
                                                                data.diagnosisCode
                                                              }
                                                              onConfirm={
                                                                confirmvalid
                                                              }
                                                              placement="leftTop"
                                                              okText="Yes"
                                                              cancelText="No"
                                                              onOpenChange={() =>
                                                                onchangeValid(
                                                                  data.diagnosisCode
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
                                                                  style={{ size: 8, color: "#a80404" }}
                                                                />
                                                              </div>
                                                            </Popconfirm>
                                                          </div>
                                                          <div className={`${visitStyles.hoverActiveHcc}`}>

                                                            {getEncounterDateBackground(data.encounterDateSplit)}
                                                            <div>
                                                              {getCaptureSectionBackground(data.capturedSections)}

                                                            </div>
                                                          </div>



                                                        </div>
                                                      </li>
                                                    )
                                                  )}
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
                                                        {
                                                          newInValidDiseaseListRadiology.length
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>
                                                  {newInValidDiseaseListRadiology.map(
                                                    (data, i) => (
                                                      <li>
                                                        <div
                                                          className={`${visitStyles.hcc_card}`}
                                                        >
                                                          <div
                                                            className={`${visitStyles.hcc_card_nameHead}`}
                                                          >
                                                            <div className="media-body">
                                                              <span className="mb-1 disease-name d-flex">
                                                                <span className="valid-dis-name">
                                                                  {
                                                                    data.diagnosisCode
                                                                  }
                                                                </span>{" "}
                                                                -{" "}
                                                                {
                                                                  data.actualDescription
                                                                }
                                                              </span>
                                                            </div>
                                                            <Popconfirm
                                                              title="You want move to valid?"
                                                              description={
                                                                data.diagnosisCode
                                                              }
                                                              onConfirm={
                                                                confirmInvalid
                                                              }
                                                              placement="leftTop"
                                                              okText="Yes"
                                                              cancelText="No"
                                                              onOpenChange={() =>
                                                                onchangeValid(
                                                                  data.diagnosisCode
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
                                                                  style={{ size: 8, color: "#a80404" }}
                                                                />
                                                              </div>
                                                            </Popconfirm>
                                                          </div>
                                                        </div>
                                                      </li>
                                                    )
                                                  )}
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
                                                        {
                                                          invalidMoveDiseasesList.length
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>
                                                  {invalidMoveDiseasesList.map(
                                                    (data, i) => (
                                                      <li>
                                                        <div className="timeline-panel invalid-disease">
                                                          <div className="media-body">
                                                            <span className="mb-1 disease-name d-flex">
                                                              <span className="valid-dis-name">
                                                                {data.diagnosisCode}
                                                              </span>{" "}
                                                              -{" "}
                                                              {
                                                                data.actualDescription
                                                              }
                                                            </span>
                                                          </div>
                                                          <Popover
                                                            content={
                                                              data.dbDescription
                                                            }
                                                            title={
                                                              data.diagnosisCode
                                                            }
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
                                                            description={
                                                              data.diagnosisCode
                                                            }
                                                            onConfirm={
                                                              confirmInvalidMoveDis
                                                            }
                                                            placement="leftTop"
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onOpenChange={() =>
                                                              onchangeValid(
                                                                data.diagnosisCode
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
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane id="my-posts" eventKey="nonhcc">
                                        <div className="my-post-content pt-3">
                                          <div className="widget-media   ps--active-y">
                                            <div className="row">
                                              <div className="col-xl-6">
                                                <ul className="timeline">
                                                  <div className="invalid-text d-flex justify-content-sm-between">
                                                    <span
                                                      className={`dang d-block`}
                                                    >
                                                      {" "}
                                                      NON-HCC{" "}
                                                      <Badge
                                                        as="a"
                                                        href=""
                                                        bg="badge-circle invalid-bange"
                                                      >
                                                        {
                                                          newInValidDiseaseListRadiology.length
                                                        }
                                                      </Badge>
                                                    </span>
                                                  </div>
                                                  {newInValidDiseaseListRadiology.map(
                                                    (data, i) => (
                                                      <li>
                                                        <div className="timeline-panel invalid-disease">
                                                          <div className="media-body">
                                                            <span className="mb-1 disease-name d-flex">
                                                              <span className="valid-dis-name">
                                                                {data.diagnosisCode}
                                                              </span>{" "}
                                                              -{" "}
                                                              {
                                                                data.actualDescription
                                                              }
                                                            </span>
                                                          </div>
                                                          <Popconfirm
                                                            title="You want move to valid?"
                                                            description={
                                                              data.diagnosisCode
                                                            }
                                                            onConfirm={
                                                              confirmInvalid
                                                            }
                                                            placement="leftTop"
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onOpenChange={() =>
                                                              onchangeValid(
                                                                data.diagnosisCode
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
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                              {validDiseasesList.length == 0 ? (
                                                <div className="card box-shadow-none">
                                                  <div className="card combo-card">
                                                    <div className="col-xl-12">
                                                      <span className="no-patient-data">
                                                        NO DATA
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="comboDiseases"
                                      >
                                        <div className={`${visitStyles.comboContainer}`}>
                                          <div className={`row ${visitStyles.comboContainer2}`}>
                                            <div className="col-xl-6">
                                              <div className={`${visitStyles.comboTitle}`}>
                                                <span>VALID CODES </span>
                                              </div>
                                              <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
                                                <div
                                                  className={
                                                    visitStyles.combo_head_card
                                                  }
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
                                                          className={
                                                            visitStyles.combo_add_btn
                                                          }
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={
                                                              faPlus
                                                            }
                                                            style={{
                                                              color:
                                                                "#fff",
                                                              size: 12
                                                            }}
                                                          />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                {comboDiseaseCodesListRadiology.length != 0 ?
                                                  <div className={visitStyles.container}>
                                                    <div className={visitStyles.hccStickey_head}>
                                                      {comboDiseaseCodesListRadiology?.map(
                                                        (item) => {
                                                          return (
                                                            <div
                                                              className={
                                                                visitStyles.combo_details_card
                                                              }
                                                            >
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
                                                                <div
                                                                  className="col-xl-5 cr-pointer"
                                                                  onClick={() =>
                                                                    handleOpenModalCombinationCode(
                                                                      item.diagnosisCodeCombo,
                                                                      item.diseaseName
                                                                    )
                                                                  }
                                                                >
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
                                                                    <div
                                                                      className={
                                                                        visitStyles.close_icon
                                                                      }
                                                                    >
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
                                                        }
                                                      )}
                                                    </div>
                                                  </div> : null}

                                                {comboDiseaseCodesListRadiology.length == 0 ? (

                                                  <div>
                                                    <span className="no-patient-data">
                                                      NO DATA
                                                    </span>
                                                  </div>

                                                ) : null}
                                              </div>
                                            </div>

                                            <div className="col-xl-6">
                                              <div className={`${visitStyles.comboTitle}`}>
                                                <span>DELETED COMBO CODES </span>
                                              </div>
                                              <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
                                                <div
                                                  className={
                                                    visitStyles.combo_head_card
                                                  }
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
                                                  </div>
                                                </div>
                                                {invalidComboDiseaseCodesList.length !=
                                                  0 ? (
                                                  <>
                                                    <div className={visitStyles.container}>
                                                      <div className={visitStyles.hccStickey_head}>
                                                        {invalidComboDiseaseCodesList?.map(
                                                          (item) => {
                                                            return (
                                                              <div
                                                                className={
                                                                  visitStyles.combo_details_card
                                                                }
                                                              >
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
                                                                  <div
                                                                    className="col-xl-5 cr-pointer"
                                                                    onClick={() =>
                                                                      handleOpenModalCombinationCode(
                                                                        item.diagnosisCodeCombo,
                                                                        item.diseaseName
                                                                      )
                                                                    }
                                                                  >
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
                                                          }
                                                        )}
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
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="meatCriteria"
                                      >
                                        <div className="my-post-content pt-3">
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
                                          {meatCriteriaListRadiology.length != 0 ?
                                            <div
                                              className={visitStyles.hccStickey_head}
                                            >
                                              {meatCriteriaListRadiology?.map((item) => {
                                                return (
                                                  <div
                                                    className={
                                                      item.isMeatCriteriaPresent ===
                                                        true
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
                                                              item.radiology,
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
                                                              item.monitorCapturedFromHeader,
                                                              item.monitor,
                                                              item.radiology,
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
                                                              item.monitorCapturedFromHeader,
                                                              item.monitor,
                                                              item.radiology,
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
                                                              item.monitorCapturedFromHeader,
                                                              item.monitor,
                                                              item.radiology,
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
                                                          <div
                                                            className={
                                                              visitStyles.close_icon
                                                            }
                                                          >
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

                                            </div> : null}
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
                                            {radiologyResultStatus ? (
                                              <Select
                                                onChange={(e) =>
                                                  dosOnChangeRadiologyFile(e)
                                                }
                                                options={
                                                  radiologyFileDateofServieList
                                                }
                                                className="custom-react-select"
                                                defaultValue={
                                                  radiologyFileDateDefaulteSelect
                                                }
                                                isSearchable={false}
                                              />
                                            ) : null}
                                            <button
                                              onClick={() =>
                                                openNewTabDownloadPdfradiology()
                                              }
                                              className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                            >
                                              Open New Tab
                                            </button>
                                          </div>
                                          <div className="card-body p-0 z-index-low">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                              <div
                                                style={{
                                                  height: "70vh",
                                                  maxWidth: "900px",
                                                  marginLeft: "auto",
                                                  marginRight: "auto",
                                                }}
                                              >
                                                {" "}
                                                <Viewer
                                                  fileUrl={selectFileURLRadiology}
                                                  plugins={[
                                                    defaultLayoutPluginInstance,
                                                  ]}
                                                  onDocumentLoad={
                                                    handleDocumentLoad
                                                  }
                                                  renderLoader={(percentages) => (
                                                    <div
                                                      style={{ width: "240px" }}
                                                    >
                                                      <ProgressBar
                                                        progress={Math.round(
                                                          percentages
                                                        )}
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
                          ) : (
                            <div className={visitStyles.visitdata_tab_body}>
                              <div
                                className={`profile-tab ${visitStyles.visitdata_header_card2}`}
                              >
                                <div className="custom-tab-1">
                                  <Tab.Container defaultActiveKey={activeTabHead}>
                                    <Nav as="ul" className="nav nav-tabs">
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
                                          eventKey="meatCriteria"
                                          className={visitStyles.navColor}
                                          activeClassName={visitStyles.activeLink}
                                        >
                                          MEAT Criteria
                                        </Nav.Link>
                                      </Nav.Item>
                                      <Nav.Item as="li" className="nav-item">
                                        <Nav.Link to="#my-posts" eventKey="file" className={visitStyles.navColor}
                                          activeClassName={visitStyles.activeLink}>
                                          File
                                        </Nav.Link>
                                      </Nav.Item>
                                      {/* <div>
                                      <Button
                                        onClick={addLabReport}
                                        className="btn btn-primary btn-sm ms-2 flr radiologyBtn"
                                      >
                                        + Add Lab Report
                                      </Button>
                                    </div> */}
                                    </Nav>
                                    <Tab.Content>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="validDiseases"
                                      >
                                        <div className="my-post-content pt-3">
                                          <div className="widget-media   ps--active-y">
                                            <div className="row">
                                              <div className="col-xl-4">
                                                <ul className="timeline">
                                                  <div
                                                    className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                                                  >
                                                    <span
                                                      className={`${visitStyles.hcc_title_name}`}
                                                    >
                                                      HCC
                                                    </span>
                                                    <div className="d-flex justify-content-center">
                                                      <span
                                                        className={`${visitStyles.hcc_title_badge}`}
                                                      >
                                                        {labReportValidList.length}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  {labReportValidList.map(
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

                                                            >
                                                              <span className="mb-1 disease-name d-flex">
                                                                <span className="valid-dis-name">
                                                                  {
                                                                    data.diagnosisCode
                                                                  }
                                                                </span>{" "}
                                                                -{" "}
                                                                {
                                                                  data.actualDescription
                                                                }
                                                              </span>
                                                            </div>
                                                          </div>
                                                          <div className={`${visitStyles.hoverActiveHcc}`}>

                                                            {getEncounterDateBackground(data.encounterDateSplit)}
                                                            <div className={`${visitStyles.encounterAndSectionHeader}`} >
                                                              {getCaptureSectionBackground(data.capturedSections)}
                                                            </div>

                                                          </div>

                                                        </div>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane
                                        id="my-posts"
                                        eventKey="meatCriteria"
                                      >
                                        <div className="my-post-content pt-3">
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
                                          {labReportMeatList.length != 0 ?
                                            <div
                                              className={visitStyles.hccStickey_head}
                                            >
                                              {labReportMeatList?.map((item) => {
                                                return (
                                                  <div
                                                    className={
                                                      item.isMeatCriteriaPresent ===
                                                        true
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
                                                              item.radiology,
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
                                                              item.monitorCapturedFromHeader,
                                                              item.monitor,
                                                              item.radiology,
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
                                                              item.monitorCapturedFromHeader,
                                                              item.monitor,
                                                              item.radiology,
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
                                                              item.monitorCapturedFromHeader,
                                                              item.monitor,
                                                              item.radiology,
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
                                                          <div
                                                            className={
                                                              visitStyles.close_icon
                                                            }
                                                          >
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

                                              {labReportMeatList.length == 0 ? (
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

                                            </div> : null}
                                        </div>
                                      </Tab.Pane>
                                      <Tab.Pane id="my-posts" eventKey="file">
                                        <div className="my-post-content pt-3">
                                          <div className="radiology-select-dos">
                                            {labResultStatus ? (
                                              <Select
                                                onChange={(e) =>
                                                  dosOnChangeLabFile(e)
                                                }
                                                options={labFileDateofServieList}
                                                className="custom-react-select"
                                                defaultValue={
                                                  labFileDateDefaulteSelect
                                                }
                                                isSearchable={false}
                                              />
                                            ) : null}
                                            <button
                                              onClick={() =>
                                                openNewTabDownloadPdfradiology()
                                              }
                                              className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                            >
                                              Open New Tab
                                            </button>
                                          </div>
                                          <div className="card-body p-0 z-index-low">
                                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                              <div
                                                style={{
                                                  height: "70vh",
                                                  maxWidth: "900px",
                                                  marginLeft: "auto",
                                                  marginRight: "auto",
                                                }}
                                              >
                                                {" "}
                                                <Viewer
                                                  fileUrl={labReportFile}
                                                  plugins={[
                                                    defaultLayoutPluginInstance,
                                                  ]}
                                                  onDocumentLoad={
                                                    handleDocumentLoad
                                                  }
                                                  renderLoader={(percentages) => (
                                                    <div
                                                      style={{ width: "240px" }}
                                                    >
                                                      <ProgressBar
                                                        progress={Math.round(
                                                          percentages
                                                        )}
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
                          )}
                          {/* <div className={` col-xl-12 ${visitStyles.flags}`}>
                                      <div className={visitStyles.flags} >
                                        <span className={visitStyles.flag}>
                                          {SVGICON.flagIconHcc}
                                        </span>
                                        <span className={visitStyles.flagCodes}>
                                          HCC
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags}   >
                                        <span className={visitStyles.flag}>
                                          {SVGICON.flagIconSuggestion}
                                        </span>
                                        <span className={visitStyles.flagCodes}>
                                          Suggestion
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags} >
                                        <span className={visitStyles.flag}>
                                          {SVGICON.flagIconDelete}
                                        </span>
                                        <span className={visitStyles.flagCodes}>
                                          Delete
                                        </span>
                                      </div>
                                    </div> */}
                        </div>

                        <div className={`${visitStyles.thirdContainer}`}>
                          <div className={`${visitStyles.flag_container}`}>
                            <ul className="">
                              {flagList?.map((data) => {
                                return (
                                  <>
                                    <Tooltip title={data.name} placement="left">

                                      <li
                                        className={
                                          flagContainerActive == data.name
                                            ? `${visitStyles.commentsTagActive}`
                                            : `${visitStyles.commentsTag}`
                                        }
                                        onClick={() => addComments(data.name)}
                                      >
                                        <i>{data.icon}</i>
                                      </li>
                                    </Tooltip>
                                    {/* <li >
                            <i>{SVGICON.filterIcon}</i>
                          </li>
                          <li>
                            <i>{SVGICON.commentIcon}</i>
                          </li>
                          <li>
                            <i>{SVGICON.notsIcon}</i>
                          </li> */}
                                  </>
                                );
                              })}
                            </ul>
                          </div>
                        </div>

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
                      width={1000}
                      height={400}
                    >
                      <div className="section-container">
                        <div className="row">
                          <div className="col-xl-12">
                            <div
                              className="rpv-core__viewer"
                              style={{
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                display: "flex",
                                flexDirection: "column",
                                margin: "0 82px 10px 73px",
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  backgroundColor: "#eeeeee",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                  display: "flex",
                                  padding: "4px",
                                }}
                              >
                                {/* <Search>
                                {(renderSearchProps) => {
                                  const [readyToSearch, setReadyToSearch] =
                                    useState(false);
                                  return (
                                    <>
                                      <div
                                        style={{
                                          border:
                                            "1px solid rgba(0, 0, 0, 0.3)",
                                          display: "flex",
                                          padding: "0 2px",
                                        }}
                                      >
                                        <input
                                          style={{
                                            border: "none",
                                            padding: "8px",
                                            width: "200px",
                                          }}
                                          placeholder="Enter to search"
                                          type="text"
                                          value={renderSearchProps.keyword}
                                          onChange={(e) => {
                                            setReadyToSearch(false);
                                            renderSearchProps.setKeyword(
                                              e.target.value
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.keyCode === 13 &&
                                              renderSearchProps.keyword
                                            ) {
                                              setReadyToSearch(true);
                                              renderSearchProps.search();
                                            }
                                          }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.matchCase
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeMatchCase(
                                                  !renderSearchProps.matchCase
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                <path d="M4.383 14.725L13.59 14.725" />
                                                <path d="M0.5 21.725L3.52 21.725" />
                                                <path d="M14.479 21.725L17.5 21.725" />
                                                <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                <path d="M16.92 16.725L20.794 16.725" />
                                                <path d="M21.516 21.725L23.5 21.725" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match case"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.wholeWords
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeWholeWords(
                                                  !renderSearchProps.wholeWords
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                <path d="M3.5 9.498L3.5 14.498" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match whole word"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches ===
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            Not found
                                          </div>
                                        )}
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches >
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            {renderSearchProps.currentMatch} of{" "}
                                            {renderSearchProps.numberOfMatches}
                                          </div>
                                        )}
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToPreviousMatch
                                              }
                                            >
                                              <PreviousIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Previous match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToNextMatch
                                              }
                                            >
                                              <NextIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Next match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                    </>
                                  );
                                }}
                              </Search> */}
                              </div>
                            </div>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                              <div
                                style={{
                                  height: "400px",
                                  // width: "1000px",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                {" "}
                                <Viewer
                                  fileUrl={selectFileURL}
                                  plugins={[searchPluginInstance]}
                                  onDocumentLoad={handleDocumentLoad}
                                />
                              </div>
                            </Worker>
                          </div>
                          {/* <div className="col-xl-4">
                          <ul className="timeline">
                          <div className="modal-valid-container">
                            {newValidDiseaseList.map((data, i) => (
                              <li>
                              

                                
                                <div onClick={() => activeValidDisCode(data.diagnosisCode, data.actualDescription)} className={selectActiveCode == data.diagnosisCode ? "new_valid-dis cr-pointer modal-valid-active" : "new_valid-dis cr-pointer modal-valid" }>
                                  <div className="timeline-panel">
                                    <div className="media-body">
                                      <span className="mb-1 disease-name d-flex" >
                                        <span className="valid-dis-name">{data.diagnosisCode}</span> -  {data.actualDescription}
                                      </span>
                                    </div>
                                  </div>
                                </div>


                              </li>
                            ))}
                                                            </div>
                          </ul>
                        </div> */}
                        </div>
                        {/* <button onClick={changeSearch}>Check
        
        </button> */}
                        {/* {isLoadingSection ?
                      <Spin className='ml-2 ms-1 section-spin' size="medium" />
                      : <>
                        {sectionList?.map((item) => {
                          return (

                            <div className="card meat-card">
                              <span className="combodiseaseText">{item}</span>
                            </div>


                          );
                        })}
                      </>} */}
                        {/* <div
        className="rpv-core__viewer"
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginBottom:"50px"
        }}
    >
        <div
            style={{
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                padding: '4px',
            }}
        >
            <ShowSearchPopoverButton />
        </div>
        </div> */}
                      </div>
                    </Modal>
                  )}
                  {isModalOpenValidCodes && (
                    <Modal
                      title={selectMeatName}
                      // title="Pdf Test"
                      centered
                      open={isModalOpenValidCodes}
                      // style={{ top: 5 }}
                      onOk={handleCloseModal}
                      onCancel={handleCloseModal}
                      width={1300}
                      height={400}
                    >
                      <div className="section-container">
                        <div class="d-flex justify-content-end m-4">
                          <button
                            class="btn btn-primary"
                            onClick={handleAddButtonClick}
                          >
                            Add
                          </button>
                        </div>

                        <div className="row">
                          <div className="col-xl-8">
                            <div
                              className="rpv-core__viewer"
                              style={{
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                display: "flex",
                                flexDirection: "column",
                                margin: "0 82px 10px 73px",
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  backgroundColor: "#eeeeee",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                  display: "flex",
                                  padding: "4px",
                                }}
                              >
                                {/* <Search>
                                {(renderSearchProps) => {
                                  const [readyToSearch, setReadyToSearch] =
                                    useState(false);
                                  return (
                                    <>
                                      <div
                                        style={{
                                          border:
                                            "1px solid rgba(0, 0, 0, 0.3)",
                                          display: "flex",
                                          padding: "0 2px",
                                        }}
                                      >
                                        <input
                                          style={{
                                            border: "none",
                                            padding: "8px",
                                            width: "200px",
                                          }}
                                          placeholder="Enter to search"
                                          type="text"
                                          value={renderSearchProps.keyword}
                                          onChange={(e) => {
                                            setReadyToSearch(false);
                                            renderSearchProps.setKeyword(
                                              e.target.value
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.keyCode === 13 &&
                                              renderSearchProps.keyword
                                            ) {
                                              setReadyToSearch(true);
                                              renderSearchProps.search();
                                            }
                                          }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.matchCase
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeMatchCase(
                                                  !renderSearchProps.matchCase
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                <path d="M4.383 14.725L13.59 14.725" />
                                                <path d="M0.5 21.725L3.52 21.725" />
                                                <path d="M14.479 21.725L17.5 21.725" />
                                                <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                <path d="M16.92 16.725L20.794 16.725" />
                                                <path d="M21.516 21.725L23.5 21.725" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match case"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.wholeWords
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeWholeWords(
                                                  !renderSearchProps.wholeWords
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                <path d="M3.5 9.498L3.5 14.498" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match whole word"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches ===
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            Not found
                                          </div>
                                        )}
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches >
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            {renderSearchProps.currentMatch} of{" "}
                                            {renderSearchProps.numberOfMatches}
                                          </div>
                                        )}
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToPreviousMatch
                                              }
                                            >
                                              <PreviousIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Previous match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToNextMatch
                                              }
                                            >
                                              <NextIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Next match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                    </>
                                  );
                                }}
                              </Search> */}
                              </div>
                            </div>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                              <div
                                style={{
                                  height: "400px",
                                  // width: "1000px",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                {" "}
                                <Viewer
                                  fileUrl={selectFileURL}
                                  plugins={[searchPluginInstance]}
                                  onDocumentLoad={handleDocumentLoad}
                                />
                              </div>
                            </Worker>
                          </div>
                          {isAddButtonClicked && (
                            <div className="col-xl-4">
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
                                <div className="d-flex justify-content-between">
                                  <button
                                    type="submit"
                                    className="btn btn-success"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseForm}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                          {nonHccActiveCodes == false &&
                            isAddButtonClicked == false ? (
                            <div className="col-xl-4">
                              <ul className="timeline">
                                <div className="modal-valid-container">
                                  {newValidDiseaseList.map((data, i) => (
                                    <li>
                                      <div
                                        onClick={() =>
                                          activeValidDisCode(
                                            data.diagnosisCode,
                                            data.actualDescription
                                          )
                                        }
                                        className={
                                          selectActiveCode == data.diagnosisCode
                                            ? "new_valid-dis cr-pointer modal-valid-active"
                                            : "new_valid-dis cr-pointer modal-valid"
                                        }
                                      >
                                        <div className="timeline-panel">
                                          <div className="media-body">
                                            <span className="mb-1 disease-name d-flex">
                                              <span className="valid-dis-name">
                                                {data.diagnosisCode}
                                              </span>{" "}
                                              - {data.actualDescription}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </div>
                              </ul>
                            </div>
                          ) : (
                            <div className="col-xl-4">
                              <ul className="timeline">
                                <div className="modal-valid-container">
                                  {newInValidDiseaseList.map((data, i) => (
                                    <li>
                                      <div
                                        onClick={() =>
                                          activeValidDisCode(
                                            data.diagnosisCode,
                                            data.actualDescription
                                          )
                                        }
                                        className={
                                          selectActiveCode == data.diagnosisCode
                                            ? "new_valid-dis cr-pointer modal-valid-active"
                                            : "new_valid-dis cr-pointer modal-valid"
                                        }
                                      >
                                        <div className="timeline-panel">
                                          <div className="media-body">
                                            <span className="mb-1 disease-name d-flex">
                                              <span className="valid-dis-name">
                                                {data.diagnosisCode}
                                              </span>{" "}
                                              - {data.actualDescription}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </div>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </Modal>
                  )}
                  {isModalOpenCaptureSection && (
                    <Modal
                      title={selectMeatName}
                      // title="Pdf Test"
                      centered
                      open={isModalOpenCaptureSection}
                      // style={{ top: 5 }}
                      onOk={handleCloseModal}
                      onCancel={handleCloseModal}
                      width={1000}
                      height={400}
                    >
                      <div className="section-container">
                        <div className="row">
                          <div className="col-xl-12">
                            <div
                              className="rpv-core__viewer"
                              style={{
                                border: "1px solid rgba(0, 0, 0, 0.3)",
                                display: "flex",
                                flexDirection: "column",
                                margin: "0 82px 10px 73px",
                              }}
                            >
                              <div
                                style={{
                                  alignItems: "center",
                                  backgroundColor: "#eeeeee",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                  display: "flex",
                                  padding: "4px",
                                }}
                              >
                                {/* <Search>
                                {(renderSearchProps) => {
                                  const [readyToSearch, setReadyToSearch] =
                                    useState(false);
                                  return (
                                    <>
                                      <div
                                        style={{
                                          border:
                                            "1px solid rgba(0, 0, 0, 0.3)",
                                          display: "flex",
                                          padding: "0 2px",
                                        }}
                                      >
                                        <input
                                          style={{
                                            border: "none",
                                            padding: "8px",
                                            width: "200px",
                                          }}
                                          placeholder="Enter to search"
                                          type="text"
                                          value={renderSearchProps.keyword}
                                          onChange={(e) => {
                                            setReadyToSearch(false);
                                            renderSearchProps.setKeyword(
                                              e.target.value
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.keyCode === 13 &&
                                              renderSearchProps.keyword
                                            ) {
                                              setReadyToSearch(true);
                                              renderSearchProps.search();
                                            }
                                          }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.matchCase
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeMatchCase(
                                                  !renderSearchProps.matchCase
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                <path d="M4.383 14.725L13.59 14.725" />
                                                <path d="M0.5 21.725L3.52 21.725" />
                                                <path d="M14.479 21.725L17.5 21.725" />
                                                <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                <path d="M16.92 16.725L20.794 16.725" />
                                                <path d="M21.516 21.725L23.5 21.725" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match case"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.wholeWords
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeWholeWords(
                                                  !renderSearchProps.wholeWords
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                <path d="M3.5 9.498L3.5 14.498" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match whole word"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches ===
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            Not found
                                          </div>
                                        )}
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches >
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            {renderSearchProps.currentMatch} of{" "}
                                            {renderSearchProps.numberOfMatches}
                                          </div>
                                        )}
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToPreviousMatch
                                              }
                                            >
                                              <PreviousIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Previous match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToNextMatch
                                              }
                                            >
                                              <NextIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Next match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                    </>
                                  );
                                }}
                              </Search> */}
                              </div>
                            </div>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                              <div
                                style={{
                                  height: "400px",
                                  // width: "1000px",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                {" "}
                                <Viewer
                                  fileUrl={selectFileURL}
                                  plugins={[searchPluginInstance]}
                                  onDocumentLoad={handleDocumentLoad}
                                />
                              </div>
                            </Worker>
                          </div>
                          {/* <div className="col-xl-4">
                          <ul className="timeline">
                          <div className="modal-valid-container">
                            {newValidDiseaseList.map((data, i) => (
                              <li>
                              

                                
                                <div >
                                  <div className="timeline-panel">
                                    <div className="media-body">
                                      <span className="mb-1 disease-name d-flex" >
                                        <span className="valid-dis-name">{data.diagnosisCode}</span> -  {data.actualDescription}
                                      </span>
                                      {data.capturedSections.map((data2, i) => (
                                      <span className="mb-1 disease-name"  onClick={() => activeValidDisCode(data.diagnosisCode, data2)} >
                                        <span className={selectActiveCode == data2 ? " valid-dis-name d-flex new_valid-dis cr-pointer modal-valid-active" : "valid-dis-name d-flex new_valid-dis cr-pointer modal-valid" }>{data2}</span>
                                      </span>
                                         ))}
                                    </div>
                                  </div>
                                </div>


                              </li>
                            ))}
                                                            </div>
                          </ul>
                        </div> */}
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
                      width={1000}
                      height={400}
                    >
                      <div className="section-container">
                        {/* <button onClick={changeSearch}>Check
        
        </button> */}
                        {/* {isLoadingSection ?
                      <Spin className='ml-2 ms-1 section-spin' size="medium" />
                      : <>
                        {sectionList?.map((item) => {
                          return (

                            <div className="card meat-card">
                              <span className="combodiseaseText">{item}</span>
                            </div>


                          );
                        })}
                      </>} */}
                        {/* <div
        className="rpv-core__viewer"
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginBottom:"50px"
        }}
    >
        <div
            style={{
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                padding: '4px',
            }}
        >
            <ShowSearchPopoverButton />
        </div>
        </div> */}
                        <div
                          className="rpv-core__viewer"
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.3)",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            margin: "0 82px 10px 73px",
                          }}
                        >
                          <div
                            style={{
                              alignItems: "center",
                              backgroundColor: "#eeeeee",
                              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                              display: "flex",
                              padding: "4px",
                            }}
                          >
                            {/* <Search>
                            {(renderSearchProps) => {
                              const [readyToSearch, setReadyToSearch] =
                                useState(false);
                              return (
                                <>
                                  <div
                                    style={{
                                      border: "1px solid rgba(0, 0, 0, 0.3)",
                                      display: "flex",
                                      padding: "0 2px",
                                    }}
                                  >
                                    <input
                                      style={{
                                        border: "none",
                                        padding: "8px",
                                        width: "200px",
                                      }}
                                      placeholder="Enter to search"
                                      type="text"
                                      value={renderSearchProps.keyword}
                                      onChange={(e) => {
                                        setReadyToSearch(false);
                                        renderSearchProps.setKeyword(
                                          e.target.value
                                        );
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.keyCode === 13 &&
                                          renderSearchProps.keyword
                                        ) {
                                          setReadyToSearch(true);
                                          renderSearchProps.search();
                                        }
                                      }}
                                    />
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <button
                                          style={{
                                            background: "#fff",
                                            border: "none",
                                            borderBottom: `2px solid ${renderSearchProps.matchCase
                                              ? "blue"
                                              : "transparent"
                                              }`,
                                            height: "100%",
                                            padding: "0 2px",
                                          }}
                                          onClick={() =>
                                            renderSearchProps.changeMatchCase(
                                              !renderSearchProps.matchCase
                                            )
                                          }
                                        >
                                          <Icon>
                                            <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                            <path d="M4.383 14.725L13.59 14.725" />
                                            <path d="M0.5 21.725L3.52 21.725" />
                                            <path d="M14.479 21.725L17.5 21.725" />
                                            <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                            <path d="M16.92 16.725L20.794 16.725" />
                                            <path d="M21.516 21.725L23.5 21.725" />
                                          </Icon>
                                        </button>
                                      }
                                      content={() => "Match case"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <button
                                          style={{
                                            background: "#fff",
                                            border: "none",
                                            borderBottom: `2px solid ${renderSearchProps.wholeWords
                                              ? "blue"
                                              : "transparent"
                                              }`,
                                            height: "100%",
                                            padding: "0 2px",
                                          }}
                                          onClick={() =>
                                            renderSearchProps.changeWholeWords(
                                              !renderSearchProps.wholeWords
                                            )
                                          }
                                        >
                                          <Icon>
                                            <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                            <path d="M3.5 9.498L3.5 14.498" />
                                          </Icon>
                                        </button>
                                      }
                                      content={() => "Match whole word"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                  {readyToSearch &&
                                    renderSearchProps.keyword &&
                                    renderSearchProps.numberOfMatches === 0 && (
                                      <div style={{ padding: "0 8px" }}>
                                        Not found
                                      </div>
                                    )}
                                  {readyToSearch &&
                                    renderSearchProps.keyword &&
                                    renderSearchProps.numberOfMatches > 0 && (
                                      <div style={{ padding: "0 8px" }}>
                                        {renderSearchProps.currentMatch} of{" "}
                                        {renderSearchProps.numberOfMatches}
                                      </div>
                                    )}
                                  <div style={{ padding: "0 2px" }}>
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <MinimalButton
                                          onClick={
                                            renderSearchProps.jumpToPreviousMatch
                                          }
                                        >
                                          <PreviousIcon />
                                        </MinimalButton>
                                      }
                                      content={() => "Previous match"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                  <div style={{ padding: "0 2px" }}>
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <MinimalButton
                                          onClick={
                                            renderSearchProps.jumpToNextMatch
                                          }
                                        >
                                          <NextIcon />
                                        </MinimalButton>
                                      }
                                      content={() => "Next match"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                </>
                              );
                            }}
                          </Search> */}
                          </div>
                        </div>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                          <div
                            style={{
                              height: "400px",
                              maxWidth: "1300px",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            {" "}
                            <Viewer
                              fileUrl={selectFileURLRadiology}
                              plugins={[searchPluginInstance]}
                              onDocumentLoad={handleDocumentLoad}
                            />
                          </div>
                        </Worker>
                      </div>
                    </Modal>
                  )}
                  {confirmNotesModalDecline && (
                    <Modal
                      title={selectDiseasesName}
                      centered
                      open={confirmNotesModalDecline}
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
                              <Button
                                type="submit"
                                className="btn btn-primary btn-sm me-1"
                              >
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
                  {confirmNotesModalHold && (
                    <Modal
                      title={selectDiseasesName}
                      centered
                      open={confirmNotesModalHold}
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
                              <Button
                                type="submit"
                                className="btn btn-primary btn-sm me-1"
                              >
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
                              <Button
                                type="submit"
                                className="btn btn-primary btn-sm me-1"
                              >
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
                              <Button
                                type="submit"
                                className="btn btn-primary btn-sm me-1"
                              >
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
                  {suggestedModal && (
                    <Modal
                      title={selectDiseasesName}
                      centered
                      open={suggestedModal}
                      onOk={handleCloseModal}
                      onCancel={handleCloseModal}
                      footer={null}
                    >
                      <div className="offcanvas-body">
                        <div className="container-fluid">
                          <Form
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmitSuggestedNotes}
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
                                  rows="5"
                                  onChange={handleChangeSuggested}
                                ></textarea>
                              </div>
                            </div>

                            <div>
                              <Button
                                type="submit"
                                className="btn btn-primary btn-sm me-1"
                              >
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
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleFormSubmit}
                        >
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
                              {addValidCodeCheck == false ?
                                <span className={visitStyles.invalidHccCodeError}>
                                  Invalid Hcc Code
                                </span> : addValidCodeCheck == true ? <span className={visitStyles.validHccCodeError}>
                                  Valid Hcc Code
                                </span> : null}

                            </div>
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Provider name
                              </Form.Label>
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
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
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
                    onHide={setAddPatient}
                    show={addPatient}
                    className="offcanvas-end"
                    placement="end"
                  >
                    <div className="offcanvas-header">
                      <h5 className="modal-title" id="#gridSystemModal">
                        Add Patient Radiology
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setAddPatient(false)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div className="offcanvas-body">
                      <div className="container-fluid">
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleSubmitPatientFile}
                        >
                          <div className="row">
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Patient Id <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                name="patientId"
                                required
                                type="text"
                                value={inputValue.patientId}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Patient Name{" "}
                                <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                name="name"
                                required
                                type="text"
                                value={inputValue.name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Year of Service{" "}
                                <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                name="year"
                                required
                                type="number"
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-xl-12 mb-3">
                              <Form.Label>File</Form.Label>
                              <Form.Control
                                type="file"
                                accept="application/pdf,text/plain"
                                onChange={(e) =>
                                  onChangeFileRadiology(e.target.files)
                                }
                                disabled={isLoadingBtn ? true : false}
                              />
                            </div>
                          </div>

                          <div>
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
                              {isLoadingBtn ? "Loading..." : "Submit"}
                            </Button>
                            <Button
                              onClick={() => setAddPatient(false)}
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
                    onHide={setLapReportSlider}
                    show={labReportSlider}
                    className="offcanvas-end"
                    placement="end"
                  >
                    <div className="offcanvas-header">
                      <h5 className="modal-title" id="#gridSystemModal">
                        Add Patient Lab Report
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setLapReportSlider(false)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div className="offcanvas-body">
                      <div className="container-fluid">
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleSubmitLabReport}
                        >
                          <div className="row">
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Patient Id <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                name="patientId"
                                required
                                type="text"
                                value={inputValue.patientId}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Patient Name{" "}
                                <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                name="name"
                                required
                                type="text"
                                value={inputValue.name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Year of Service{" "}
                                <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                name="year"
                                required
                                type="number"
                                onChange={handleChange}
                              />
                            </div>

                            <div className="col-xl-12 mb-3">
                              <Form.Label>File</Form.Label>
                              <Form.Control
                                type="file"
                                accept="application/pdf,text/plain"
                                onChange={(e) =>
                                  onChangeLabReportFile(e.target.files)
                                }
                                disabled={isLoadingBtn ? true : false}
                              />
                            </div>
                          </div>

                          <div>
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
                              {isLoadingBtn ? "Loading..." : "Submit"}
                            </Button>
                            <Button
                              onClick={() => setLapReportSlider(false)}
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
                    show={isModalComments}
                    placement="end"
                    className={`offcanvas-end ${visitStyles.commentDrawer}`}
                  >
                    <div className="offcanvas-header">
                      <h5 className="modal-title" id="#gridSystemModal">
                        {flagContainerActiveTitle}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => handleCloseModal()}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    {flagContainerActive == "Timeline" ?
                      <div className={visitStyles.timeLine}>

                        <div

                          className="widget-timeline"
                        >
                          <ul className="timeline">
                            {timelineData.map((item, index) => (
                              <li>
                                {item.action == "MOVED_INVALID_TO_VALID" ?
                                  <Tooltip title={item.userName} placement="bottom">
                                    <Popover
                                      placement="bottom"
                                      content={userDetails}
                                    >
                                      <div className="timeline-badge MOVED_INVALID_TO_VALID">{splitUserName(item.userName)}


                                      </div>
                                    </Popover>
                                  </Tooltip> :
                                  item.action == "MOVED_SUGGESTED_TO_VALID" ?
                                    <Tooltip title={item.userName} placement="bottom">
                                      <Popover
                                        placement="bottom"
                                        content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>

                                        <div className="timeline-badge MOVED_SUGGESTED_TO_VALID">{splitUserName(item.userName)}
                                        </div>
                                      </Popover>
                                    </Tooltip> :
                                    item.action == "MOVED_VALID_TO_SUGGESTED" ?
                                      <Tooltip title={item.userName} placement="bottom">
                                        <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>

                                          <div className="timeline-badge MOVED_VALID_TO_SUGGESTED">{splitUserName(item.userName)}</div></Popover>
                                      </Tooltip> :
                                      item.action == "VALID_DISEASE_ADDED" ?
                                        <Tooltip title={item.userName} placement="bottom">
                                          <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                            <div className="timeline-badge VALID_DISEASE_ADDED">{splitUserName(item.userName)}</div></Popover>
                                        </Tooltip> :
                                        item.action == "MOVED_VALID_TO_DELETED" ?
                                          <Tooltip title={item.userName} placement="bottom">
                                            <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                              <div className="timeline-badge MOVED_VALID_TO_DELETED">{splitUserName(item.userName)}</div>
                                            </Popover>
                                          </Tooltip>
                                          :
                                          item.action == "COMPLETED" ?
                                            <Tooltip title={item.userName} placement="bottom">
                                              <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                <div className="timeline-badge COMPLETED">{splitUserName(item.userName)}</div></Popover>
                                            </Tooltip> :
                                            item.action == "MOVED_DELETED_TO_VALID" ?
                                              <Tooltip title={item.userName} placement="bottom">
                                                <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                  <div className="timeline-badge MOVED_DELETED_TO_VALID">{splitUserName(item.userName)}</div></Popover></Tooltip> :
                                              item.action == "MOVED_DELETED_TO_SUGGESTED" ?
                                                <Tooltip title={item.userName} placement="bottom">
                                                  <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                    <div className="timeline-badge MOVED_DELETED_TO_SUGGESTED">{splitUserName(item.userName)}</div></Popover></Tooltip> :
                                                item.action == "MOVED_SUGGESTED_TO_DELETED" ?
                                                  <Tooltip title={item.userName} placement="bottom">
                                                    <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                      <div className="timeline-badge MOVED_SUGGESTED_TO_DELETED">{splitUserName(item.userName)}</div></Popover></Tooltip> :
                                                  item.action == "ENCOUNTER_FILE_UPDATED" ?
                                                    <Tooltip title={item.userName} placement="bottom">
                                                      <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                        <div className="timeline-badge ENCOUNTER_FILE_UPDATED">{splitUserName(item.userName)}</div></Popover></Tooltip> :
                                                    item.action == "ENCOUNTER_FILE_ADDED" ?
                                                      <Tooltip title={item.userName} placement="bottom">
                                                        <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                          <div className="timeline-badge ENCOUNTER_FILE_ADDED">{splitUserName(item.userName)}</div></Popover>
                                                      </Tooltip> :
                                                      item.action == "HOLD" ?
                                                        <Tooltip title={item.userName} placement="bottom">
                                                          <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                            <div className="timeline-badge HOLD">{splitUserName(item.userName)}</div></Popover></Tooltip> :
                                                        item.action == "DECLINED" ?
                                                          <Tooltip title={item.userName} placement="bottom">
                                                            <Popover placement="bottom" content={userDetails} onOpenChange={() => renderUserDetails(item.userName)}>
                                                              <div className="timeline-badge DECLINED">{splitUserName(item.userName)}</div>
                                                            </Popover></Tooltip> :
                                                          null






                                }
                                <a
                                  className="timeline-panel text-muted"

                                >

                                  {item.action == "MOVED_INVALID_TO_VALID" ?
                                    <span className={visitStyles.timelineheading} > {item.diagnosisCode} - Moved invalid to valid</span> :
                                    item.action == "MOVED_SUGGESTED_TO_VALID" ?
                                      <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Moved Suggested to valid</span> :
                                      item.action == "MOVED_VALID_TO_SUGGESTED" ?
                                        <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Moved valid to suggested</span> :
                                        item.action == "VALID_DISEASE_ADDED" ?
                                          <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Valid disease added</span> :
                                          item.action == "MOVED_VALID_TO_DELETED" ?
                                            <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Moved valid to deleted</span> :
                                            item.action == "COMPLETED" ?
                                              <span className={visitStyles.timelineheading}>You saved to completed</span> :
                                              item.action == "MOVED_DELETED_TO_VALID" ?
                                                <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Moved deleted to valid</span> :
                                                item.action == "MOVED_DELETED_TO_SUGGESTED" ?
                                                  <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Moved deleted to suggested</span> :
                                                  item.action == "MOVED_SUGGESTED_TO_DELETED" ?
                                                    <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Moved suggested to deleted</span> :
                                                    item.action == "ENCOUNTER_FILE_UPDATED" ?
                                                      <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Encounter file updated</span> :
                                                      item.action == "ENCOUNTER_FILE_ADDED" ?
                                                        <span className={visitStyles.timelineheading}>{item.diagnosisCode} - Encounter file added</span> :
                                                        item.action == "HOLD" ?
                                                          <span className={visitStyles.timelineheading}>You saved to hold</span> :
                                                          item.action == "DECLINED" ?
                                                            <span className={visitStyles.timelineheading}> You saved to decline </span> :
                                                            null
                                  }
                                  <span className={visitStyles.timelineDate} > {moment(item.createdDate).format("MM-DD-YYYY hh:mm:A")}
                                    {/* <Tooltip title={item.userName}>
                                <Avatar className={visitStyles.timeLineUsername}>{splitUserName(item.userName)}</Avatar>
                                </Tooltip> */}
                                  </span>
                                  {/* <span>{item.action}</span> */}
                                  {/* <h6 className="mb-0">
                                  {item.patientId}
                                </h6> */}

                                </a>
                              </li>
                            ))}

                          </ul>
                        </div>

                        {/* <VerticalTimeline>
                        {timelineData.map((item, index) => (
                          <VerticalTimelineElement
                            key={index}
                            className="vertical-timeline-element--work"
                            contentStyle={{
                              background: "#fff",
                              color: "#000000",
                              borderTop: "4px solid #00749C",
                              marginLeft: "-18px",
                            }}
                            date={item.createdDate}
                            iconStyle={{
                              background: "#F5F9FE",
                              color: "black",
                              fontWeight: "600",
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            icon={item.icon}
                          >
                            <h3
                              className="vertical-timeline-element-title"
                              style={{ fontSize: "14px", fontFamily: "600" }}
                            >
                              {item.patientId}
                            </h3>
                            <h4
                              className="vertical-timeline-element-subtitle"
                              style={{ fontSize: "12px" }}
                            >
                              {item.userName}
                            </h4>
                            <p style={{ fontSize: "16px", marginTop: "0px" }}>
                              {item.action}
                            </p>
                            <style>
                              {`
        .vertical-timeline::before{
          background: black;
          width: 1px;
        }
        .vertical-timeline--animate .vertical-timeline-element-content.bounce-in {
          margin-right:-18px;
          margin-left:-26px
        }
        .vertical-timeline--animate .vertical-timeline-element-content.bounce-in {

        }
        .vertical-timeline-element-icon{
          position: absolute;
   
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 0 0 6px #00749C, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05);
        }
      `}
                            </style>
                          </VerticalTimelineElement>
                        ))}
                      </VerticalTimeline> */}
                      </div> : flagContainerActive == "Filter" ?

                        <div className={`row ${visitStyles.patientListHead}`}>
                          <div className="col-xl-9">
                            <div class="form-group has-search">
                              <FontAwesomeIcon
                                className="fa fa-search form-control-feedback"
                                icon={faSearch}
                              />
                              <InputText
                                type="text"
                                onChange={(e) => filterChangePatientId(e)}
                                className="form-control new-form-control"
                                placeholder="Search"
                              />
                              <RangePicker
                                open={openPicker}

                                onChange={(dates, dateStrings) => {
                                  setSelectedDates(dates);
                                  handleDatePickerChange(dateStrings);
                                }}

                                suffixIcon={false}
                                className={visitStyles.datepicker}
                              />
                            </div>
                          </div>
                          <div className="col-xl-3">
                            <div className={visitStyles.content}>
                              <span
                                className={visitStyles.circleCard}
                                onClick={handleFilterClick}

                              >
                                {" "}
                                <span></span> {showIcons ? <FontAwesomeIcon icon={faClose} height={30} width={30} color="#A20404" /> : SVGICON.filter}
                              </span>
                              {showIcons && (
                                <div className={visitStyles.iconContainer}>
                                  <span
                                    className={visitStyles.circleCard}
                                    onClick={handleShowCard}

                                  >
                                    {SVGICON.dashboard}
                                  </span>

                                  <span className={visitStyles.circleCard} onClick={() => {
                                    setOpenPicker(!openPicker)
                                  }}>
                                    {SVGICON.dateIcon}
                                  </span>
                                </div>
                              )}
                              {showCard && (
                                <div
                                  className={visitStyles.menuCard}
                                  onMouseEnter={() => setShowCard(true)}
                                  onMouseLeave={() => setShowCard(false)}
                                >

                                  <ul>

                                    {statuses.map((status, index) => (
                                      <li
                                        onClick={() => getFiltePatientListStatus(status)}
                                        className={visitStyles.nameList}
                                        key={index}
                                      >
                                        {status}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className={visitStyles.patientListHead}>
                            <ul className={`${visitStyles.patientDetailsHead}`} >
                              {patientList.map((data, index) => (
                                <li className={`${visitStyles.nameList} ${visitStyles.patientList}`} key={index} onClick={() => getPatientListToDetails(data.patientId, localOrgId, localTenantId)}>
                                  {data.patientId} - {data.patientName}
                                  {data.processedStatus == "COMPLETED" ?
                                    <span
                                    className={visitStyles.completed}
                                    style={{ background: "#3a9b94 !important" }}
                                  ></span>
                                   : data.processedStatus == "PENDING" || data.processedStatus == "COMPUTED" ?
                                  <span className={visitStyles.pending}></span>
                                   : data.processedStatus == "HOLD"  ?
                                   <span className={visitStyles.hold}></span> : data.processedStatus == "DECLINED"  ?
                                   <span className={visitStyles.declined}></span>:null}
                                </li>
                              ))}
                               {patientList.length == 0 ?
                              <h5 className="text-center">NO DATA</h5> : null}
                            </ul>
                           
                          </div>
                        </div> : flagContainerActive == "Comments" ?


                          <div className="offcanvas-body">
                            <div className="container-fluid">
                              {/* <div className={visitStyles.comments_card}>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing and
                                typesetting industry.
                              </span>
                              <span>18/11/2023 10:00 Am</span>
                            </div>
                            <div className={visitStyles.comments_card}>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing and
                                typesetting industry.
                              </span>
                              <span>18/11/2023 10:00 Am</span>
                            </div>
                            <div className={visitStyles.comments_card}>
                              <span>
                                Lorem Ipsum is simply dummy text of the printing and
                                typesetting industry.
                              </span>
                              <span>18/11/2023 10:00 Am</span>
                            </div> */}

                              <Form
                                noValidate
                                validated={validated}
                                onSubmit={handleSubmitCommnets}
                              >

                                <div className="row">
                                  <div className="col-xl-12">
                                    <textarea
                                      className={visitStyles.commentsFormControl}
                                      rows="5"
                                      required
                                      id="comments"
                                      name="comments"
                                      placeholder="Add Comments"
                                      value={inputValue.comments}
                                      onChange={handleChangeSuggested}
                                      onKeyPress={handleEnterTextComments}
                                      type="submit"
                                    >


                                    </textarea>
                                    <Button type="submit" disabled={commentsTrigger} className={visitStyles.commentSendIcon}>
                                      {SVGICON.sentMessageIcon}
                                    </Button>



                                  </div>
                                </div>

                                {/* <div className="text-center">
                                <Button
                                  type="submit"
                                  className={visitStyles.addPatientBtn}
                                >
                                  Save
                                </Button>
                              </div> */}
                              </Form>
                              {commentList.map((data, index) => (
                                <div className={visitStyles.comments_card}>
                                  <div className={`${visitStyles.commentNameHead}`}>

                                    <span className={visitStyles.commentsName}>
                                      {data.comment}

                                    </span>
                                    <Tooltip placement="bottom" title={data.commentCreatedBy}>
                                      <Popover
                                        placement="bottom"
                                        content={userDetails} onOpenChange={() => renderUserDetails(data.commentCreatedBy)}>

                                        <Avatar className={visitStyles.timeLineUsername}>{splitUserName(data.commentCreatedBy)}</Avatar>
                                      </Popover>
                                    </Tooltip>
                                  </div>
                                  <span className={visitStyles.commentsTime}> {moment(data.commentCreatedAt).format("MM-DD-YYYY hh:mm:A")}</span>
                                </div>
                              ))}



                            </div>

                          </div> : flagContainerActive == "Flag" ?


                            <div className="offcanvas-body">
                              <div className="container-fluid">
                                <Form
                                  noValidate
                                  validated={validated}
                                  onSubmit={handleSubmitFlag}
                                >

                                  <div className="row">
                                    <div className="col-xl-12 mb-3">
                                      <Select
                                        options={flagPostList}
                                        className="custom-react-select"
                                        isSearchable={false}
                                        id="flag"
                                        name="flag"
                                        onChange={handleChangeFlag}
                                      />
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-xl-12">
                                      <textarea
                                        className={visitStyles.commentsFormControl}
                                        rows="5"
                                        required
                                        id="comments"
                                        name="comments"
                                        placeholder="Add Comments"
                                        onChange={handleChangeSuggested}
                                      // onKeyPress={handleEnterTextNotes}
                                      // type="submit"
                                      ></textarea>
                                      <Button type="submit" disabled={commentsTrigger} className={visitStyles.commentSendIcon}>
                                        {SVGICON.sentMessageIcon}
                                      </Button>
                                    </div>
                                  </div>


                                </Form>

                                {flagResultList.map((data, index) => (
                                  <div className={visitStyles.comments_card}>
                                    <div className={`${visitStyles.commentNameHead}`}>

                                      <span className={visitStyles.commentsName}>
                                        {data.flag}
                                        {data.flag == "PATIENT_NAME_MISSED" ?
                                          <i className={visitStyles.name_missed}>{SVGICON.emptyFlagSmall}</i> :
                                          data.flag == "PATIENT_DOB_MISSED" ?
                                            <i className={visitStyles.dob_missed}>{SVGICON.emptyFlagSmall}</i> :
                                            data.flag == "MRN_ID_MISMATCH" ?
                                              <i className={visitStyles.id_missed}>{SVGICON.emptyFlagSmall}</i> :
                                              data.flag == "PROVIDER_SIGN_MISSED" ?
                                                <i className={visitStyles.sign_missed}>{SVGICON.emptyFlagSmall}</i> :
                                                data.flag == "PROVIDER_SIGNATURE_MISSED" ?
                                                  <i className={visitStyles.signature_missed}>{SVGICON.emptyFlagSmall}</i> :
                                                  data.flag == "PROVIDER_CREDENTIAL_MISSED" ?
                                                    <i className={visitStyles.cred_missed}>{SVGICON.emptyFlagSmall}</i> :
                                                    data.flag == "PROVIDER_SIGN_STATUS_PENDING" ?
                                                      <i className={visitStyles.sign_status}>{SVGICON.emptyFlagSmall}</i> :
                                                      data.flag == "NO_HCC_FOUND" ?
                                                        <i className={visitStyles.no_hcc_found}>{SVGICON.emptyFlagSmall}</i> :
                                                        data.flag == "NO_VALID_DOCUMENT_FOUND" ?
                                                          <i className={visitStyles.no_doc_found}>{SVGICON.emptyFlagSmall}</i> :
                                                          data.flag == "PATIENT_DISEASED" ?
                                                            <i className={visitStyles.patient_diseased}>{SVGICON.emptyFlagSmall}</i> :




                                                            null}


                                      </span>
                                      <Tooltip placement="bottom" title={data.commentCreatedBy}>
                                        <Popover
                                          placement="bottom"
                                          content={userDetails} onOpenChange={() => renderUserDetails(data.commentCreatedBy)}>
                                          <Avatar className={visitStyles.timeLineUsername}>{splitUserName(data.commentCreatedBy)}</Avatar>
                                        </Popover>
                                      </Tooltip>
                                    </div>
                                    <span className={visitStyles.commentsDesc}>
                                      {data.comments}
                                    </span>
                                    <span className={visitStyles.commentsTime}> {moment(data.commentCreatedAt).format("MM-DD-YYYY hh:mm:A")}</span>
                                  </div>
                                ))}

                              </div>

                            </div> : flagContainerActive == "Notes" ?


                              <div className="offcanvas-body">
                                <div className="container-fluid">

                                  <Form
                                    noValidate
                                    validated={validated}
                                    onSubmit={handleSubmitNotes}
                                  >

                                    <div className="row">
                                      <div className={`col-xl-12 ${visitStyles.textareaContainer}`}>
                                        <textarea
                                          className={visitStyles.commentsFormControl}
                                          rows="5"
                                          required
                                          id="comments"
                                          name="comments"
                                          placeholder="Add Notes"
                                          onChange={handleChangeSuggested}
                                          onKeyPress={handleEnterTextNotes}
                                          type="submit"
                                          value={inputValue.comments}
                                        ></textarea>
                                        <Button type="submit" disabled={commentsTrigger} className={visitStyles.commentSendIcon}>
                                          {SVGICON.sentMessageIcon}
                                        </Button>
                                      </div>
                                    </div>


                                  </Form>
                                  {notesList.map((data, index) => (
                                    //    <div className={visitStyles.comments_card}>
                                    //    <span>
                                    //     {data.notes}
                                    //    </span>
                                    //    <span> {moment(data.notesCreatedAt).format("MM-DD-YYYY hh:mm:A")}</span>
                                    //  </div>

                                    <div className={visitStyles.comments_card}>
                                      <div className={`${visitStyles.commentNameHead}`}>

                                        <span className={visitStyles.commentsName}>
                                          {data.notes}

                                        </span>
                                        <Tooltip placement="bottom" title={data.notesCreatedBy} >
                                          <Popover
                                            placement="bottom"
                                            content={userDetails} onOpenChange={() => renderUserDetails(data.notesCreatedBy)}>
                                            <Avatar className={visitStyles.timeLineUsername}>{splitUserName(data.notesCreatedBy)}</Avatar>
                                          </Popover>
                                        </Tooltip>
                                      </div>
                                      <span className={visitStyles.commentsTime}> {moment(data.notesCreatedAt).format("MM-DD-YYYY hh:mm:A")}</span>
                                    </div>

                                  ))}
                                </div>

                              </div> : null}
                  </Offcanvas>
                  {confirmCompleteModal ?
                    <div className={visitStyles.completedModal}>

                      <Modal title="Are you sure to complete this task?" open={true} onOk={handleSubmitHccComplete} onCancel={handleCloseModal}>

                      </Modal>
                    </div> : null}
                </div>
              </div>
            )}
                <Footer/>
          </div>
      
        </div>
     
      </div>
    
    </>
  );
}


// const enhancer = connect(
//   (state) => ({
//     filterPatientList: state.patients.filterPatientList

//   }),
//   {
//     loadFilterPatientList: patientActions.loadFilterPatientList,
//     loadTimelineList: patientActions.loadTimelineList,
//   }
// );

export default Details;