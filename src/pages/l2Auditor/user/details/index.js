import React, { useState, useRef, useEffect } from "react";
import NavBar from "../../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import visitStyles from "../../../../styles/visitdata.module.css";
import { InputText } from "primereact/inputtext";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import TableStyle from "../../../../components/table/table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faSearch,
  faArrowLeft,
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, Menu, DatePicker, Dropdown } from "antd";
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
import Select from "react-select";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Offcanvas } from "react-bootstrap";
import { DownOutlined } from "@ant-design/icons";
import { notification } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, Tooltip } from "antd";
import Hcc from "./hcc/index";
import NonHcc from "./non-hcc/index";
import Radiology from "./radiology/index";
import Lab from "./lab/index";
import SpinnerDots from "../../../../components/spinner";
import AllocateModal from "../../../admin/allocatedUser/allocate";

const Details = ({}) => {
  const navigate = useRouter();
  const { RangePicker } = DatePicker;
  const sideMenu = useSelector((state) => state.sideMenu);
  const [confirmNotesModalDecline, setConfirmNotesModalDecline] =
    useState(false);
  const [confirmNotesModalHold, setConfirmNotesModalHold] = useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [confirmNotesModalInValid, setConfirmNotesModalInValid] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dosYear, setDosYear] = useState("");
  const [dosYearRadiology, setDosYearRadiology] = useState("");
  const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState("");
  const [dosYearDefalutSelectRadiology, setDosYearDefalutSelectRadiology] =
    useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [validated, setValidated] = useState(false);
  const [patientDetails, setPatientDetails] = useState([]);
  const [matchHccList, setMatchHccList] = useState([]);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

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
  const [isLoadingDos, setIsLoadingDos] = useState(true);
  const [suggestedModal, setSuggestedModal] = useState(false);
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [labFileDosList, setLabFileDosList] = useState([]);
  const [labFileDosListDefaultSelect, setLabFileDosListDefaultSelect] =
    useState([]);
  const [isValidAction, setIsValidAction] = useState("");
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [isModalComments, setIsModalComments] = useState(false);
  const [flagContainerActive, setFlagContainerActive] = useState("");
  const [flagContainerActiveTitle, setFlagContainerActiveTitle] = useState("");
  const [showIcons, setShowIcons] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [sideNavLabelActiveKey, setSideNavLabelActiveKey] = useState("HCC");
  const [isSideNavShow, setIsSideNavShow] = useState(false);
  const [timelineData, setTimeLineData] = useState([]);
  const [patienIdDetails, setPatienIdDetails] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [notesList, setNotesList] = useState([]);
  const [flagResultList, setFlagResultList] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [actionItems, setActionItems] = useState([]);
  const [actionItems2, setActionItems2] = useState([]);
  const [actionItems3, setActionItems3] = useState([]);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [commentsTrigger, setCommentsTrigger] = useState(false);
  const [flagFirstData, setFlagFirstData] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(true);

  const [patientResultReload, setPatientResultReload] = useState(false);
  const [selectModalName, setSelectModalName] = useState(false);
  const selectPatientId = useSelector((state) => state.patients?.patiendId);
  const [userRole, setUserRole] = useState("");
  const [allocateModal, setAllocateModal] = useState(false);
  const [selectedRowsId, setSelectedRowsId] = useState([]);

  const flagPostList = [
    {
      value: "PATIENT_NAME_MISSED",
      label: (
        <>
          PATIENT_NAME_MISSED
          <i className={visitStyles.name_missed}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "PATIENT_DOB_MISSED",
      label: (
        <>
          PATIENT_DOB_MISSED
          <i className={visitStyles.dob_missed}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "MRN_ID_MISMATCH",
      label: (
        <>
          MRN_ID_MISMATCH
          <i className={visitStyles.id_missed}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "PROVIDER_SIGN_MISSED",
      label: (
        <>
          PROVIDER_SIGN_MISSED
          <i className={visitStyles.sign_missed}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "PROVIDER_SIGNATURE_MISSED",
      label: (
        <>
          PROVIDER_SIGNATURE_MISSED
          <i className={visitStyles.signature_missed}>
            {SVGICON.emptyFlagSmall}
          </i>
        </>
      ),
    },
    {
      value: "PROVIDER_CREDENTIAL_MISSED",
      label: (
        <>
          PROVIDER_CREDENTIAL_MISSED
          <i className={visitStyles.cred_missed}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "PROVIDER_SIGN_STATUS_PENDING",
      label: (
        <>
          PROVIDER_SIGN_STATUS_PENDING
          <i className={visitStyles.sign_status}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "NO_HCC_FOUND",
      label: (
        <>
          NO_HCC_FOUND
          <i className={visitStyles.no_hcc_found}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "NO_VALID_DOCUMENT_FOUND",
      label: (
        <>
          NO_VALID_DOCUMENT_FOUND
          <i className={visitStyles.no_doc_found}>{SVGICON.emptyFlagSmall}</i>
        </>
      ),
    },
    {
      value: "PATIENT_DECEASED",
      label: (
        <>
          PATIENT_DECEASED
          <i className={visitStyles.patient_diseased}>
            {SVGICON.emptyFlagSmall}
          </i>
        </>
      ),
    },
    {
      value: "PATIENT_INACTIVE",
      label: (
        <>
          PATIENT_INACTIVE
          <i className={visitStyles.patient_inactive}>
            {SVGICON.emptyFlagSmall}
          </i>
        </>
      ),
    },
  ];

  const filterChangePatientId = async (e) => {
    setFilter(e.target.value);
    var value = e.target.value;
    if (value) {
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/patient/compute/search?searchtext=${value}&pageno=${0}&pagesize=${100}`
      );
      var result = response.data.response.content;
      setPatientList(result);
    } else {
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/patient/filter?patientAllocated=${localUserId}&page=${0}&size=${100}`
      );
      var result = response.data.response.content;
      setPatientList(result);
    }
  };

  const handleFilterClick = () => {
    setShowIcons(!showIcons);
  };
  const handleShowCard = () => {
    setShowCard(!showCard);
    setShowCard(true);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "encodedDate") {
      setInputValueFileDate(e.target.value);
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    var uId = localStorage.getItem("userId");
    const userRoleLocal = localStorage.getItem("userRole");
    setUserRole(userRoleLocal);
    setLocalOrgId(orgId);
    setLocalTenantId(tenId);
    setLocalUserId(uId);
    setLocalPatientId(selectPatientId ? selectPatientId?.patirntId : patientId);
    getPatientDetails(
      selectPatientId ? selectPatientId?.patirntId : patientId,
      orgId,
      tenId
    );
    getPatientIdDetails(
      selectPatientId ? selectPatientId?.patirntId : patientId
    );
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
  }, []);

  const getPatientIdDetails = async (patientId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint + `dbservice/patient/get?patientId=${patientId}`
    );
    setPatienIdDetails(response.data.response);
    var result = response.data.response;
    var data = [
      {
        id: result?.patientId,
        name: result?.patientName,
      },
    ];
    setSelectedRowsId(data);
    const menu = (
      <Menu>
        {result?.processedStatus != "HOLD" ? (
          <Menu.Item key="1" onClick={() => handleActionClick("HOLD")}>
            <div className="patient-status">
              <span className={`badge hold-text`}>HOLD</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "PENDING" &&
        result?.processedStatus != "COMPUTED" ? (
          <Menu.Item key="2" onClick={() => handleActionClick("PENDING")}>
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "DECLINE" ? (
          <Menu.Item key="3" onClick={() => handleActionClick("DECLINE")}>
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>
                DECLINE
              </span>
            </div>
          </Menu.Item>
        ) : null}

        {result?.processedStatus != "COMPLETE" ? (
          <Menu.Item key="4" onClick={() => handleActionClick("COMPLETE")}>
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETE</span>
            </div>
          </Menu.Item>
        ) : null}
      </Menu>
    );

    const menu2 = (
      <Menu>
        {result?.processedStatus != "HOLD" ? (
          <Menu.Item key="1" onClick={() => handleActionClick("HOLD")}>
            <div className="patient-status">
              <span className={`badge hold-text`}>HOLD</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "PENDING" ? (
          <Menu.Item key="2" onClick={() => handleActionClick("PENDING")}>
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "DECLINE" ? (
          <Menu.Item key="3" onClick={() => handleActionClick("DECLINE")}>
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>
                DECLINE
              </span>
            </div>
          </Menu.Item>
        ) : null}

        {result?.processedStatus != "COMPLETE" ? (
          <Menu.Item key="4" onClick={() => handleActionClick("COMPLETE")}>
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETE</span>
            </div>
          </Menu.Item>
        ) : null}
        <Menu.Item key="5" onClick={() => handleActionClick("ADD RADIOLOGY")}>
          <div className="patient-status">
            <span className={`badge  ${visitStyles.add_text}`}>
              + ADD RADIOLOGY
            </span>
          </div>
        </Menu.Item>
      </Menu>
    );
    const menu3 = (
      <Menu>
        {result?.processedStatus != "HOLD" ? (
          <Menu.Item key="1" onClick={() => handleActionClick("HOLD")}>
            <div className="patient-status">
              <span className={`badge hold-text`}>HOLD</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "PENDING" ? (
          <Menu.Item key="2" onClick={() => handleActionClick("PENDING")}>
            <div className="patient-status">
              <span className={`badge processing-text`}>PENDING</span>
            </div>
          </Menu.Item>
        ) : null}
        {result?.processedStatus != "DECLINE" ? (
          <Menu.Item key="3" onClick={() => handleActionClick("DECLINE")}>
            <div className="patient-status">
              <span className={`badge failed-text`} style={{ color: "red" }}>
                DECLINE
              </span>
            </div>
          </Menu.Item>
        ) : null}

        {result?.processedStatus != "COMPLETE" ? (
          <Menu.Item key="4" onClick={() => handleActionClick("COMPLETE")}>
            <div className="patient-status">
              <span className={`badge processed-text`}>COMPLETE</span>
            </div>
          </Menu.Item>
        ) : null}
        <Menu.Item key="5" onClick={() => handleActionClick("ADD LAB")}>
          <div className="patient-status">
            <span className={`badge  ${visitStyles.add_text}`}>+ ADD LAB</span>
          </div>
        </Menu.Item>
      </Menu>
    );

    setActionItems(menu);
    setActionItems2(menu2);
    setActionItems3(menu3);
  };

  const statuses = ["PENDING", "COMPLETED", "HOLD", "DECLINED"];
  const getPatientDetails = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    setDosYear([]);
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
      var result = response.data.response;
      setPatientDocumentResult(result);
      setPatientDetails(result);
      if (result.validDisease != null) {
        var dosYearArr = [];
        result.encounterYears.map((res) => {
          dosYearArr.push({ value: res, label: res });
        });
        const highestDOS = Math.max(...dosYearArr.map((res) => res.value));
        const highestDosValue = dosYearArr.filter(
          (i) => parseInt(i.value) === highestDOS
        );

        var validDisArray = [];
        result.validDisease.map((res, index) => {
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

        setNewValidDiseaseList(validDisArray);
        setDosYearDefalutSelect(highestDosValue[0]);
        setSelectedDosValue(highestDosValue[0].value);
        setDosYear(dosYearArr);
        setIsLoadingDos(false);
        getFlagListLastDetails(patientId, highestDosValue[0].value);
        setIsLoading(false);
        setPatientResultReload(true);
      } else {
        setPatientResultReload(true);
        setIsLoading(false);
      }
    }
  };
  const getPatientDetailsYear = async (patientId, orgId, tenId, year) => {
    setSelectedDosValue(year);
    setIsModalComments(false);
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}&year=${year}`
    );

    if (response.data) {
      var result = response.data.response;
      var validDisArray = [];
      result.validDisease.map((res, index) => {
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
      setNewValidDiseaseList(validDisArray);
      setPatientDocumentResult(result);
      setPatientDetails(result);
      setPatientResultReload(true);
    }
  };

  const handleCloseModal = () => {
    setValidated(false);
    setConfirmNotesModalValid(false);
    setConfirmNotesModalInValid(false);
    setSuggestedModal(false);
    setConfirmNotesModalDecline(false);
    setConfirmNotesModalHold(false);
    setConfirmNotesModalDecline(false);
    setIsModalComments(false);
    setFlagContainerActive("");
    setConfirmCompleteModal(false);
  };

  const handleSubmitValidNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModalValid(false);
      if (isValidAction == "declineFunction") {
        handleSubmitHccDeclineApi();
      }
      if (isValidAction == "holdFunction") {
        handleSubmitHccHold();
      }
      if (isValidAction == "pendingFunction") {
        handleSubmitHccPending();
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
    }
    setValidated(true);
  };

  const dosOnChange = async (e) => {
    setPatientResultReload(false);
    getPatientDetailsYear(localPatientId, localOrgId, localTenantId, e.value);
  };

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
    setInputValue({ ...inputValue, ["flag"]: e.value });
  };

  const tabList = [
    { title: "HCC", type: "HCC", iconStyle: IMAGES.visitDataHcc },
    { title: "NON HCC", type: "NON HCC", iconStyle: IMAGES.visitDataNonHcc },
    {
      title: "Radiology",
      type: "Radiology",
      iconStyle: IMAGES.visitDataRadioloy,
    },
    {
      title: "Lab Report",
      type: "Lab Report",
      iconStyle: IMAGES.visitDataLabreport,
    },
  ];

  const navigetPageDetails = async (pageTitle) => {
    setSideNavLabelActiveKey(pageTitle);
    if (pageTitle == "HCC") {
      var patientId = localStorage.getItem("patientId");
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/patient/compute/get?patientid=${patientId}&orgid=${localOrgId}`
      );
      if (response.data) {
        var result = response.data.response;
        setPatientDocumentResult(result);
      }
      setActiveTab(1);
      setIsLoadingDos(false);
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
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
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
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      setAddPatient(false);
      setIsLoadingBtn(false);
      getPatientDetailsRadiology(localOrgId, localTenantId);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
  };

  const handleSubmitHccComplete = async () => {
    var dos = selectedDosValue;
    var validObject = {};
    var inValidObject = {};
    var unmatachObject = {};
    var comoboObject = {};
    var meatObject = {};
    var deletedObject = {};
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
      validDisease: patientDocumentResult.validDisease,
      invalidDisease: patientDocumentResult.invalidDisease,
      unmatchedDisease: patientDocumentResult.unmatchedDisease,
      comboDisease: patientDocumentResult.comboDisease,
      meatCriteria: patientDocumentResult.meatCriteria,
      rafScore: patientDocumentResult.rafScore,
      dosFiltered: patientDocumentResult.dosFiltered,
      fileDetailDTO: patientDocumentResult.fileDetailDTO,
      deletedDiseases: patientDocumentResult.deletedDiseases,
      dos: selectedDosValue,
    };

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/complete`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        setConfirmCompleteModal(false);
        getPatientDetails(localPatientId, localOrgId, localTenantId);
        getPatientIdDetails(localPatientId);
      } else {
      }
    } catch (e) {}
  };

  const handleSubmitHccDeclineApi = async () => {
    var postData = {
      orgId: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/decline`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        setConfirmNotesModalHold(false);
        getPatientIdDetails(localPatientId);
      } else {
      }
    } catch (e) {}
  };

  const handleSubmitHccPending = async () => {
    var postData = {
      orgId: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/pending`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        setConfirmNotesModalHold(false);
        setConfirmNotesModalDecline(false);
        getPatientIdDetails(localPatientId);
      } else {
      }
    } catch (e) {}
  };

  const handleSubmitHccHold = async () => {
    var postData = {
      orgId: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/hold`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        setConfirmNotesModalHold(false);
        setConfirmNotesModalDecline(false);
        getPatientIdDetails(localPatientId);
      } else {
      }
    } catch (e) {}
  };

  const handleSubmitHccDecline = async () => {
    setIsValidAction("declineFunction");
    setConfirmNotesModalHold(true);
  };

  const addComments = async (value) => {
    setFilterDataLoading(true);
    setIsModalComments(true);
    setFlagContainerActive(value);
    if (value == "Filter") {
      setFlagContainerActiveTitle("My Work Queue");
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/patient/filter?patientAllocated=${localUserId}&page=0&size=${15}&processedStatus=&dueDateStart=&dueDateEnd=&processedStart=&processedEnd=&searchString=`
      );
      var result = response.data.response.content;
      setPatientList(result);
      setFilterDataLoading(false);
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
    if (value == "Notes") {
      setFlagContainerActiveTitle("Notes");
      getNotesList();
    }
    if (value == "Comments") {
      setFlagContainerActiveTitle("Comments");
      getCommentsList();
    }
    if (value == "Flag") {
      setFlagContainerActiveTitle("Flag The File");
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

  const getPatientListToDetails = (userId, orgId, tenantId) => {
    setPatientResultReload(false);
    getPatientDetails(userId, orgId, tenantId);
    getPatientIdDetails(userId);
    setLocalPatientId(userId);
  };

  const getFiltePatientListStatus = async (value) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/patient/filter?patientAllocated=${localUserId}&page=${0}&size=${10}&processedStatus=${value}`
    );
    var result = response.data.response.content;
    setPatientList(result);
  };

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
        flag: inputValue.flag,
      };
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/flagdetails`,
        [dataFormatSuggested]
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        inputValue.comments = "";
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getFlagList();
        setCommentsTrigger(false);
      } else {
      }
    }
    setValidated(true);
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
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/notes`,
        [dataFormatSuggested]
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        inputValue.comments = "";
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getNotesList();
        setCommentsTrigger(false);
      } else {
      }
    }
    setValidated(true);
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
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/comment`,
        [dataFormatSuggested]
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        inputValue.comments = "";
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getCommentsList();
        setCommentsTrigger(false);
      } else {
      }
    }
    setValidated(true);
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
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/comment`,
        [dataFormatSuggested]
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        inputValue.comments = "";
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        notification.success({
          message: "Comment added Successfully!",
          placement: "top",
          duration: 1,
        });
        getCommentsList();
      } else {
      }
    }
  };

  const handleEnterTextNotes = async (event) => {
    if (event.charCode == 13) {
      var dataFormatSuggested = {
        patientId: localPatientId,
        orgId: localOrgId,
        notes: inputValue.comments,
        year: selectedDosValue,
      };
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/notes`,
        [dataFormatSuggested]
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        inputValue.comments = "";
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getNotesList();
      } else {
      }
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
    navigate.back();
    // navigate.push("/physician/patients");
  };

  const splitUserName = (name) => {
    return name[0];
  };

  const getCommentsList = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/comment?patientId=${localPatientId}&year=${selectedDosValue}`
    );
    setCommentList(response.data.response);
    setFilterDataLoading(false);
  };

  const getNotesList = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/notes?patientId=${localPatientId}&year=${selectedDosValue}`
    );
    setNotesList(response.data.response);
    setFilterDataLoading(false);
  };

  const getFlagListLastDetails = async (patientId, dos) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/flagdetails?patientId=${patientId}&year=${dos}`
    );
    if (response.data.response.length != 0) {
      setFlagFirstData(response.data.response[0]);
    }
    // setFilterDataLoading(false);
  };

  const getFlagList = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/flagdetails?patientId=${localPatientId}&year=${selectedDosValue}`
    );
    setFlagResultList(response.data.response);
    if (response.data.response.length != 0) {
      setFlagFirstData(response.data.response[0]);
    }
    setFilterDataLoading(false);
  };

  const handleDatePickerChange = (dateString) => {
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
    if (value == "PENDING") {
      setIsValidAction("pendingFunction");
      setConfirmNotesModalHold(true);
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
  const renderFlagIcon = (flag) => {
    switch (flag) {
      case "PATIENT_NAME_MISSED":
        return (
          <i className={visitStyles.name_missed}>{SVGICON.emptyFlagSmall}</i>
        );
      case "PATIENT_DOB_MISSED":
        return (
          <i className={visitStyles.dob_missed}>{SVGICON.emptyFlagSmall}</i>
        );
      case "MRN_ID_MISMATCH":
        return (
          <i className={visitStyles.id_missed}>{SVGICON.emptyFlagSmall}</i>
        );
      case "PROVIDER_SIGN_MISSED":
        return (
          <i className={visitStyles.sign_missed}>{SVGICON.emptyFlagSmall}</i>
        );
      case "PROVIDER_SIGNATURE_MISSED":
        return (
          <i className={visitStyles.signature_missed}>
            {SVGICON.emptyFlagSmall}
          </i>
        );
      case "PROVIDER_CREDENTIAL_MISSED":
        return (
          <i className={visitStyles.cred_missed}>{SVGICON.emptyFlagSmall}</i>
        );
      case "PROVIDER_SIGN_STATUS_PENDING":
        return (
          <i className={visitStyles.sign_status}>{SVGICON.emptyFlagSmall}</i>
        );
      case "NO_HCC_FOUND":
        return (
          <i className={visitStyles.no_hcc_found}>{SVGICON.emptyFlagSmall}</i>
        );
      case "NO_VALID_DOCUMENT_FOUND":
        return (
          <i className={visitStyles.no_doc_found}>{SVGICON.emptyFlagSmall}</i>
        );
      case "PATIENT_DECEASED":
        return (
          <i className={visitStyles.patient_diseased}>
            {SVGICON.emptyFlagSmall}
          </i>
        );
      case "PATIENT_INACTIVE":
        return (
          <i className={visitStyles.patient_inactive}>
            {SVGICON.emptyFlagSmall}
          </i>
        );
      default:
        return null;
    }
  };

  const allocatePatient = () => {
    setAllocateModal(true);
  };

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div className={visitStyles.headerFixed}>
          <div class="content-body">
            {isLoading ? (
              <SpinnerDots />
            ) : (
              <div
                className={`container-fluid ${visitStyles.container_fluid_patient}`}
              >
                <div className="row patient-file-container">
                  <div className="col-xl-12">
                    <div className="row">
                      <div className="col-xl-1 col-sm-12">
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
                      <div className="col-xl-7 col-sm-12">
                        <div className={`${visitStyles.patient_info_details}`}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-xl-3 col-sm-12">
                                <FontAwesomeIcon icon={faIdCardClip} />
                                <label>Patient Id</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.patientId}
                                </h6>
                              </div>
                              <div className="col-xl-3 col-sm-12">
                                <FontAwesomeIcon icon={faUserCircle} />

                                <label>Name</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.patientName}
                                </h6>
                              </div>
                              <div className="col-xl-2 col-sm-12">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <label>Age</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.age}
                                </h6>
                              </div>
                              <div className="col-xl-2 col-sm-12">
                                <FontAwesomeIcon icon={faVenusMars} />
                                <label>Gender</label>
                                <h6 className="ageDtails">
                                  {patientDocumentResult.gender}
                                </h6>
                              </div>
                              <div className="col-xl-2 col-sm-12">
                                <i className={visitStyles.dob_icon}>
                                  {SVGICON.DatebirthIcon}
                                </i>
                                <label>DOB</label>
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
                          {patienIdDetails?.priority == "URGENT" ? (
                            <div className={visitStyles.priorityStatusIcon}>
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
                          ) : patienIdDetails?.priority == "HIGH" ? (
                            <div className={visitStyles.priorityStatusIcon}>
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
                          ) : patienIdDetails?.priority == "NORMAL" ? (
                            <div className={visitStyles.priorityStatusIcon}>
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
                            <div className={visitStyles.priorityStatusIcon}>
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

                          <div className={`${visitStyles.hccCountHeader} `}>
                            <label>HCC</label>

                            <h6 className="ageDtails">
                              {newValidDiseaseList.length}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-1 col-sm-12 d-flex">
                        <div className={`${visitStyles.rafscoreheader} `}>
                          <label>Score</label>
                          {patientDetails.rafScore != null ? (
                            <h6 className="ageDtails">
                              {(patientDetails.rafScore?.score).toFixed(3)}
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
                          ) : flagFirstData?.flag == "PATIENT_DOB_MISSED" ? (
                            <Tooltip
                              title="PATIENT_DOB_MISSED"
                              placement="bottom"
                            >
                              <i className={visitStyles.dob_missed}>
                                {SVGICON.emptyFlagSmallLarge}
                              </i>
                            </Tooltip>
                          ) : flagFirstData?.flag == "MRN_ID_MISMATCH" ? (
                            <Tooltip title="MRN_ID_MISMATCH" placement="bottom">
                              <i className={visitStyles.id_missed}>
                                {SVGICON.emptyFlagSmallLarge}
                              </i>
                            </Tooltip>
                          ) : flagFirstData?.flag == "PROVIDER_SIGN_MISSED" ? (
                            <Tooltip
                              title="PROVIDER_SIGN_MISSED"
                              placement="bottom"
                            >
                              <i className={visitStyles.sign_missed}>
                                {SVGICON.emptyFlagSmallLarge}
                              </i>
                            </Tooltip>
                          ) : flagFirstData.flag ==
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
                                {SVGICON.emptemptyFlagSmallLargeyFlag}
                              </i>
                            </Tooltip>
                          ) : flagFirstData?.flag == "NO_HCC_FOUND" ? (
                            <Tooltip title="NO_HCC_FOUND" placement="bottom">
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
                      <div className="col-xl-1 col-sm-12">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-xl-12 col-sm-12">
                              {!isLoadingDos ? (
                                <>
                                  {activeTab == 3 ? (
                                    <Select
                                      onChange={(e) => dosOnChange(e)}
                                      options={dosYearRadiology}
                                      className={`custom-react-select ${visitStyles.dosSelectPicker}`}
                                      defaultValue={
                                        dosYearDefalutSelectRadiology
                                      }
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
                        {userRole == "admin" ? (
                          <div className={`${visitStyles.actionbtnContainer}`}>
                            <div
                              className="patient-status"
                              onClick={() => {
                                allocatePatient();
                              }}
                            >
                              <span
                                className={`badge processed-text cr-pointer`}
                              >
                                ALLOCATE
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className={`${visitStyles.actionbtnContainer}`}>
                            {patienIdDetails?.processedStatus == "COMPLETED" ? (
                              <Dropdown.Button
                                type="primary"
                                className={`completedBtnHcc ${visitStyles.completedBtnHcc}`}
                                icon={<DownOutlined />}
                                overlay={
                                  activeTab == 3
                                    ? actionItems2
                                    : activeTab == 4
                                    ? actionItems3
                                    : actionItems
                                }
                              >
                                COMPLETED
                              </Dropdown.Button>
                            ) : patienIdDetails?.processedStatus ==
                              "DECLINED" ? (
                              <div className={`col-xl-12`}>
                                <Dropdown.Button
                                  type="primary"
                                  className={`declinedBtnHcc ${visitStyles.declinedBtnHcc}`}
                                  icon={<DownOutlined />}
                                  overlay={
                                    activeTab == 3
                                      ? actionItems2
                                      : activeTab == 4
                                      ? actionItems3
                                      : actionItems
                                  }
                                >
                                  DECLINED
                                </Dropdown.Button>
                              </div>
                            ) : patienIdDetails?.processedStatus == "HOLD" ? (
                              <Dropdown.Button
                                type="primary"
                                className={`holdBtnHcc ${visitStyles.holdBtnHcc}`}
                                icon={<DownOutlined />}
                                overlay={
                                  activeTab == 3
                                    ? actionItems2
                                    : activeTab == 4
                                    ? actionItems3
                                    : actionItems
                                }
                              >
                                HOLD
                              </Dropdown.Button>
                            ) : (
                              <div className={`col-xl-12`}>
                                <Dropdown.Button
                                  type="primary"
                                  className={`pendingBtn ${visitStyles.pendingBtn}`}
                                  icon={<DownOutlined />}
                                  overlay={
                                    activeTab == 3
                                      ? actionItems2
                                      : activeTab == 4
                                      ? actionItems3
                                      : actionItems
                                  }
                                >
                                  PENDING
                                </Dropdown.Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                                      {SVGICON.navSideIcon}
                                    </span>
                                  </div>
                                </div>
                                <ul>
                                  {tabList?.map((data, index) => (
                                    <Tooltip
                                      title={data.title}
                                      placement="right"
                                    >
                                      <li
                                        className={`${visitStyles.sideNavLabel}`}
                                        onClick={() =>
                                          navigetPageDetails(data.type)
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
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`${visitStyles.secondContainer}`}>
                          {patientResultReload ? (
                            <>
                              {activeTab == 1 ? (
                                <Hcc patientHccResult={patientDocumentResult} />
                              ) : activeTab == 2 ? (
                                <NonHcc
                                  patientNonHccResult={patientDocumentResult}
                                />
                              ) : activeTab == 3 ? (
                                <Radiology />
                              ) : (
                                <Lab />
                              )}
                            </>
                          ) : null}
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

                  {confirmNotesModalDecline && (
                    <Modal
                      title={selectModalName}
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
                                  Reason <span className="text-danger">*</span>
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
                      title={selectModalName}
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
                                  Reason <span className="text-danger">*</span>
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
                      title={selectModalName}
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
                                  Reason <span className="text-danger">*</span>
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
                      title={selectModalName}
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
                                  Reason <span className="text-danger">*</span>
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
                      title={selectModalName}
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
                                  Reason <span className="text-danger">*</span>
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
                                Patient Id
                                <span className="text-danger">*</span>
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
                                Year of Service
                                <span className="text-danger">*</span>
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
                                Patient Id
                                <span className="text-danger">*</span>
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
                                Year of Service
                                <span className="text-danger">*</span>
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
                    {flagContainerActive == "Timeline" ? (
                      <div className={visitStyles.timeLine}>
                        {!filterDataLoading ? (
                          <>
                            <div className="widget-timeline">
                              <ul className="timeline">
                                {timelineData.map((item, index) => (
                                  <li>
                                    {item.action == "MOVED_INVALID_TO_VALID" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                        >
                                          <div className="timeline-badge MOVED_INVALID_TO_VALID">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "MOVED_SUGGESTED_TO_VALID" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge MOVED_SUGGESTED_TO_VALID">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "MOVED_VALID_TO_SUGGESTED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge MOVED_VALID_TO_SUGGESTED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action == "VALID_DISEASE_ADDED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge VALID_DISEASE_ADDED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "MOVED_VALID_TO_DELETED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge MOVED_VALID_TO_DELETED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action == "COMPLETED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge COMPLETED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "MOVED_DELETED_TO_VALID" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge MOVED_DELETED_TO_VALID">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "MOVED_DELETED_TO_SUGGESTED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge MOVED_DELETED_TO_SUGGESTED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "MOVED_SUGGESTED_TO_DELETED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge MOVED_SUGGESTED_TO_DELETED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "ENCOUNTER_FILE_UPDATED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge ENCOUNTER_FILE_UPDATED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action ==
                                      "ENCOUNTER_FILE_ADDED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge ENCOUNTER_FILE_ADDED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action == "HOLD" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge HOLD">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action == "DECLINED" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge DECLINED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : item.action == "PENDING" ? (
                                      <Tooltip
                                        title={item.userName}
                                        placement="bottom"
                                      >
                                        <Popover
                                          placement="bottom"
                                          content={userDetails}
                                          onOpenChange={() =>
                                            renderUserDetails(item.userName)
                                          }
                                        >
                                          <div className="timeline-badge DECLINED">
                                            {splitUserName(item.userName)}
                                          </div>
                                        </Popover>
                                      </Tooltip>
                                    ) : null}
                                    <a className="timeline-panel text-muted">
                                      {item.action ==
                                      "MOVED_INVALID_TO_VALID" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Moved from
                                          invalid to valid
                                        </span>
                                      ) : item.action ==
                                        "MOVED_SUGGESTED_TO_VALID" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Moved from
                                          Suggested to valid
                                        </span>
                                      ) : item.action ==
                                        "MOVED_VALID_TO_SUGGESTED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Moved from
                                          valid to suggested
                                        </span>
                                      ) : item.action ==
                                        "VALID_DISEASE_ADDED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Valid from
                                          disease added
                                        </span>
                                      ) : item.action ==
                                        "MOVED_VALID_TO_DELETED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Moved from
                                          valid to deleted
                                        </span>
                                      ) : item.action == "COMPLETED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          Changed from
                                          {item.previousProcessedState} to
                                          COMPLETD
                                        </span>
                                      ) : item.action ==
                                        "MOVED_DELETED_TO_VALID" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Moved from
                                          deleted to valid
                                        </span>
                                      ) : item.action ==
                                        "MOVED_DELETED_TO_SUGGESTED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Moved from
                                          deleted to suggested
                                        </span>
                                      ) : item.action ==
                                        "MOVED_SUGGESTED_TO_DELETED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Moved from
                                          suggested to deleted
                                        </span>
                                      ) : item.action ==
                                        "ENCOUNTER_FILE_UPDATED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Encounter file
                                          updated
                                        </span>
                                      ) : item.action ==
                                        "ENCOUNTER_FILE_ADDED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          {item.diagnosisCode} - Encounter file
                                          added
                                        </span>
                                      ) : item.action == "HOLD" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          Changed from
                                          {item.previousProcessedState} to HOLD
                                        </span>
                                      ) : item.action == "DECLINED" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          Changed from
                                          {item.previousProcessedState} to
                                          DECLINED
                                        </span>
                                      ) : item.action == "PENDING" ? (
                                        <span
                                          className={
                                            visitStyles.timelineheading
                                          }
                                        >
                                          Changed from
                                          {item.previousProcessedState} to
                                          DECLINED
                                        </span>
                                      ) : null}
                                      <span
                                        className={visitStyles.timelineDate}
                                      >
                                        {moment(item.createdDate).format(
                                          "MM-DD-YYYY hh:mm:A"
                                        )}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                                {timelineData.length == 0 ? (
                                  <h6 className="text-center">NO DATA</h6>
                                ) : null}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <div className={visitStyles.userDetailsCard}>
                            <div className="bouncing-loader">
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : flagContainerActive == "Filter" ? (
                      <div className={`row ${visitStyles.patientListHead}`}>
                        <div
                          className={visitStyles.flags}
                          style={{ marginTop: "15px", marginBottom: "20px" }}
                        >
                          <div className={visitStyles.flags}>
                            <span
                              className={visitStyles.completed}
                              style={{ background: "#3a9b94 !important" }}
                            ></span>
                            <span className={visitStyles.flagCodes}>
                              Completed
                            </span>
                          </div>
                          <div className={visitStyles.flags}>
                            <span className={visitStyles.pending}></span>
                            <span className={visitStyles.flagCodes}>
                              Pending
                            </span>
                          </div>
                          <div className={visitStyles.flags}>
                            <span className={visitStyles.hold}></span>
                            <span className={visitStyles.flagCodes}>Hold</span>
                          </div>
                          <div className={visitStyles.flags}>
                            <span className={visitStyles.declined}></span>
                            <span className={visitStyles.flagCodes}>
                              Declined
                            </span>
                          </div>
                        </div>
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
                              <span></span>
                              {showIcons ? (
                                <FontAwesomeIcon
                                  icon={faClose}
                                  height={30}
                                  width={30}
                                  color="#A20404"
                                />
                              ) : (
                                SVGICON.filter
                              )}
                            </span>
                            {showIcons && (
                              <div className={visitStyles.iconContainer}>
                                <span
                                  className={visitStyles.circleCard}
                                  onClick={handleShowCard}
                                >
                                  {SVGICON.dashboard}
                                </span>

                                <span
                                  className={visitStyles.circleCard}
                                  onClick={() => {
                                    setOpenPicker(!openPicker);
                                  }}
                                >
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
                                      onClick={() =>
                                        getFiltePatientListStatus(status)
                                      }
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
                        {!filterDataLoading ? (
                          <>
                            <div className={visitStyles.patientListHead}>
                              <ul
                                className={`${visitStyles.patientDetailsHead}`}
                              >
                                {patientList.map((data, index) => (
                                  <li
                                    className={`${visitStyles.nameList} ${visitStyles.patientList}`}
                                    key={index}
                                    onClick={() =>
                                      getPatientListToDetails(
                                        data.patientId,
                                        localOrgId,
                                        localTenantId
                                      )
                                    }
                                  >
                                    {data.patientId} - {data.patientName}
                                    {data.processedStatus == "COMPLETED" ? (
                                      <span
                                        className={visitStyles.completed}
                                        style={{
                                          background: "#3a9b94 !important",
                                        }}
                                      ></span>
                                    ) : data.processedStatus == "PENDING" ||
                                      data.processedStatus == "COMPUTED" ? (
                                      <span
                                        className={visitStyles.pending}
                                      ></span>
                                    ) : data.processedStatus == "HOLD" ? (
                                      <span className={visitStyles.hold}></span>
                                    ) : data.processedStatus == "DECLINED" ? (
                                      <span
                                        className={visitStyles.declined}
                                      ></span>
                                    ) : null}
                                  </li>
                                ))}
                                {patientList.length == 0 ? (
                                  <h5 className="text-center">NO DATA</h5>
                                ) : null}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <div className={visitStyles.userDetailsCard}>
                            <div className="bouncing-loader">
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : flagContainerActive == "Comments" ? (
                      <div className="offcanvas-body">
                        <div className="container-fluid">
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
                                ></textarea>
                                <Button
                                  type="submit"
                                  disabled={commentsTrigger}
                                  className={visitStyles.commentSendIcon}
                                >
                                  {SVGICON.sentMessageIcon}
                                </Button>
                              </div>
                            </div>
                          </Form>
                          {commentList.map((data, index) => (
                            <div className={visitStyles.comments_card}>
                              <div className={`${visitStyles.commentNameHead}`}>
                                <span className={visitStyles.commentsName}>
                                  {data.comment}
                                </span>
                                <Tooltip
                                  placement="bottom"
                                  title={data.commentCreatedBy}
                                >
                                  <Popover
                                    placement="bottom"
                                    content={userDetails}
                                    onOpenChange={() =>
                                      renderUserDetails(data.commentCreatedBy)
                                    }
                                  >
                                    <Avatar
                                      className={visitStyles.timeLineUsername}
                                    >
                                      {splitUserName(data.commentCreatedBy)}
                                    </Avatar>
                                  </Popover>
                                </Tooltip>
                              </div>
                              <span className={visitStyles.commentsTime}>
                                {moment(data.commentCreatedAt).format(
                                  "MM-DD-YYYY hh:mm:A"
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : flagContainerActive == "Flag" ? (
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
                                <Button
                                  type="submit"
                                  disabled={commentsTrigger}
                                  className={visitStyles.commentSendIcon}
                                >
                                  {SVGICON.sentMessageIcon}
                                </Button>
                              </div>
                            </div>
                          </Form>

                          {flagResultList.map((data, index) => (
                            <div
                              className={visitStyles.comments_card}
                              key={index}
                            >
                              <div className={`${visitStyles.commentNameHead}`}>
                                <span className={visitStyles.commentsName}>
                                  {data.flag && renderFlagIcon(data.flag)}
                                </span>
                                <Tooltip
                                  placement="bottom"
                                  title={data.commentCreatedBy}
                                >
                                  <Popover
                                    placement="bottom"
                                    content={userDetails}
                                    onOpenChange={() =>
                                      renderUserDetails(data.commentCreatedBy)
                                    }
                                  >
                                    <Avatar
                                      className={visitStyles.timeLineUsername}
                                    >
                                      {splitUserName(data.commentCreatedBy)}
                                    </Avatar>
                                  </Popover>
                                </Tooltip>
                              </div>
                              <span className={visitStyles.commentsDesc}>
                                {data.comments}
                              </span>
                              <span className={visitStyles.commentsTime}>
                                {moment(data.commentCreatedAt).format(
                                  "MM-DD-YYYY hh:mm:A"
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : flagContainerActive == "Notes" ? (
                      <div className="offcanvas-body">
                        <div className="container-fluid">
                          <Form
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmitNotes}
                          >
                            <div className="row">
                              <div
                                className={`col-xl-12 ${visitStyles.textareaContainer}`}
                              >
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
                                <Button
                                  type="submit"
                                  disabled={commentsTrigger}
                                  className={visitStyles.commentSendIcon}
                                >
                                  {SVGICON.sentMessageIcon}
                                </Button>
                              </div>
                            </div>
                          </Form>
                          {notesList.map((data, index) => (
                            <div className={visitStyles.comments_card}>
                              <div className={`${visitStyles.commentNameHead}`}>
                                <span className={visitStyles.commentsName}>
                                  {data.notes}
                                </span>
                                <Tooltip
                                  placement="bottom"
                                  title={data.notesCreatedBy}
                                >
                                  <Popover
                                    placement="bottom"
                                    content={userDetails}
                                    onOpenChange={() =>
                                      renderUserDetails(data.notesCreatedBy)
                                    }
                                  >
                                    <Avatar
                                      className={visitStyles.timeLineUsername}
                                    >
                                      {splitUserName(data.notesCreatedBy)}
                                    </Avatar>
                                  </Popover>
                                </Tooltip>
                              </div>
                              <span className={visitStyles.commentsTime}>
                                {moment(data.notesCreatedAt).format(
                                  "MM-DD-YYYY hh:mm:A"
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </Offcanvas>
                  {confirmCompleteModal ? (
                    <div className={visitStyles.completedModal}>
                      <Modal
                        title="Are you sure to complete this task?"
                        open={true}
                        onOk={handleSubmitHccComplete}
                        onCancel={handleCloseModal}
                      ></Modal>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            {/* <Footer/> */}
          </div>
        </div>
      </div>

      <AllocateModal
        open={allocateModal}
        setOpen={setAllocateModal}
        selectedRowsId={selectedRowsId}
        setSelectedRowsId={setSelectedRowsId}
      />
    </>
  );
};

export default Details;
