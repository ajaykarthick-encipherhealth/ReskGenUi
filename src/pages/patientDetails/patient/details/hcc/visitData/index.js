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
  getMeatQueryList,
  submitMeatQuery,
  updateMeatQuery,
} from "../../../../../../services/PatientsListSevice";
import { getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import CamboTree from "../org";
import AddMeatQuery from "../../components/addMeatQuery";
import AddHccForm from "../../components/addHccForm";
import PdfViewer from "../../PdfViewerComponent";
import EditHccForm from "../../components/editHccForm";
import HccCards from "../../components/HCC";
import ModelIndex from "../../components/model/Index";
import { getPatientDetails } from "../../components/function/GetData";
// import { getPatientPdfFileRadiology } from "../../components/function/ReusableFunctions";

const { Option } = Select;
const VisitData = ({
  setActiveTabHead,
  setActiveMeatTitle,
  setActiveComboTree,
}) => {
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
  const radiologyFileDetails = useSelector(
    (state) => state?.ReviewerReducers?.radiologyFileDetails
  );
  const labFileDetails = useSelector(
    (state) => state?.ReviewerReducers?.labFileDetails
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
  const [search, setSearch] = useState(false);
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
  const [hccFormTab, setHccFormTab] = useState("HCCFORM");
  const [isEditHccForm, setIsEditHccForm] = useState(false);
  const [formValues, setFormValues] = useState(false);
  const [formEditPlace, setFormEditPlace] = useState("");
  const [queryFormValues, setQueryFormValues] = useState(false);

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    var uId = localStorage.getItem("userId");
    setLocalUserId(uId);
    setLocalPatientId(patientId);
    setLocalOrgId(orgId);
    setLocalTenantId(tenId);
    getPatientDetails(
      orgId,
      tenId,
      setPatientDocumentResult,
      setNewValidDiseaseList,
      setSuggestedHccList,
      setDeletedHccList,
      setEncounterDateMatching,
      setCaptureSectionMatching,
      setMeatCriteriaList,
      patientDetailsResult,
      dispatch,
      sectionColorList
    );

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
    if (radiologyFileDetails?.result?.response) {
      setSelectFileURLRadiology(radiologyFileDetails?.result?.response);
    }
    if (labFileDetails?.result?.response) {
      setLabReportFile(labFileDetails?.result?.response);
    }
  }, [hccFileDetails, radiologyFileDetails, labFileDetails]);

  useEffect(() => {
    getFileDosPageNumber();
  }, [fileDosPageNumberList]);

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

  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    setSelectDiseasesName(title);
    setSelectInvalidDetails(data);
  };

  const handleCloseModal = () => {
    setFormErr("");
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

  const addValidDiseases = () => {
    setIsModalOpenValid(true);
    // setValidated(true);
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
        <div className="bouncing-loader"></div>
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

  const getPatientDetailsReload = async (patientId) => {
    dispatch(getPatientDetailsResult(patientId));
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

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  const modalOpenValidContent = (
    <div className="section-container">
      <div className="my-post-content row pt-3">
        {!isFileFormShow ? (
          <div className="col-xl-3">
            <ul className="timeline">
              <div
                className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
              >
                <span className={`${visitStyles.hcc_title_name}`}>HCC</span>
                <div className="d-flex justify-content-center">
                  <span className={`${visitStyles.hcc_title_badge}`}>
                    {newValidDiseaseList.length}
                  </span>
                </div>
              </div>
              <div className={visitStyles.container}>
                <div className={visitStyles.hccStickey_head}>
                  <HccCards
                    list={newValidDiseaseList}
                    hccVersionDetails={hccVersionDetails}
                    captureSectionMatching={captureSectionMatching}
                    encounterDateMatching={encounterDateMatching}
                    meatCriteriaList={meatCriteriaList}
                    // findValueDocument={findValueDocument}
                    getEncounterDetails={getEncounterDetails}
                    onchangeValid={onchangeValid}
                    getValidHccDetails={getValidHccDetails}
                    setFormValues={setFormValues}
                    setIsEditHccForm={setIsEditHccForm}
                    setFormEditPlace={setFormEditPlace}
                    okText="Move to Deleted"
                    cancelText="Move to Suggested"
                    confirmFunc={confirmvalid}
                    cancelFunc={validToSuggested}
                    editFormPlace={"VALID_DISEASE"}
                    setOpens={setOpens}
                    setCombiTree={setCombiTree}
                    setActiveTabHead={setActiveTabHead}
                    setActiveMeatTitle={setActiveMeatTitle}
                    setActiveComboTree={setActiveComboTree}
                    setSearch={setSearch}
                    setFileLoading={setFileLoading}
                    setIsModalOpenLab={setIsModalOpenLab}
                    setIsModalOpenRadiology={setIsModalOpenRadiology}
                    setIsModalOpenValidCodes={setIsModalOpenValidCodes}
                    setFileModalHeader={setFileModalHeader}
                    patientDocumentResult={patientDocumentResult}
                    setConfirmNotesModalValid={setConfirmNotesModalValid}
                    setIsValidAction={setIsValidAction}
                  />
                </div>
              </div>
            </ul>
          </div>
        ) : null}
        <div className={isFileFormShow ? "col-xl-8" : "col-xl-6"}>
          <div className="card-body p-0">
            {selectFileURL && (
              <PdfViewer
                src={selectFileURL}
                searchQuery={search?.value ? search?.value : ""}
                pageNumber={search?.page ? search?.page : 1}
                headers={search?.headers}
              />
            )}
          </div>
        </div>
        {isFileFormShow ? (
          <div className={`col-xl-4 ${styles.hccFormContainer}`}>
            <AddHccForm
              diagnosisCode={inputValue.diagnosisCode}
              handleCloseModal={handleCloseModal}
              isMeatNew={true}
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
                    <HccCards
                      list={suggestedHccList}
                      hccVersionDetails={hccVersionDetails}
                      captureSectionMatching={captureSectionMatching}
                      encounterDateMatching={encounterDateMatching}
                      meatCriteriaList={meatCriteriaList}
                      // findValueDocument={findValueDocument}
                      getEncounterDetails={getEncounterDetails}
                      onchangeValid={onchangeValid}
                      getValidHccDetails={getValidHccDetails}
                      setFormValues={setFormValues}
                      setIsEditHccForm={setIsEditHccForm}
                      setFormEditPlace={setFormEditPlace}
                      okText={"Move to Deleted"}
                      cancelText={"Move to HCC"}
                      confirmFunc={suggestedToDeleted}
                      cancelFunc={suggestedToValid}
                      suggestedToDeleted={suggestedToDeleted}
                      editFormPlace={"SUGGESTED_DISEASE"}
                      setOpens={setOpens}
                      setCombiTree={setCombiTree}
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                      setActiveComboTree={setActiveComboTree}
                      setSearch={setSearch}
                      setFileLoading={setFileLoading}
                      setIsModalOpenLab={setIsModalOpenLab}
                      setIsModalOpenRadiology={setIsModalOpenRadiology}
                      setIsModalOpenValidCodes={setIsModalOpenValidCodes}
                      setFileModalHeader={setFileModalHeader}
                      patientDocumentResult={patientDocumentResult}
                      setConfirmNotesModalValid={setConfirmNotesModalValid}
                      setIsValidAction={setIsValidAction}
                    />
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
                    <HccCards
                      list={deletedHccList}
                      hccVersionDetails={hccVersionDetails}
                      captureSectionMatching={captureSectionMatching}
                      encounterDateMatching={encounterDateMatching}
                      meatCriteriaList={meatCriteriaList}
                      // findValueDocument={findValueDocument}
                      getEncounterDetails={getEncounterDetails}
                      onchangeValid={onchangeValid}
                      getValidHccDetails={getValidHccDetails}
                      setFormValues={setFormValues}
                      setIsEditHccForm={setIsEditHccForm}
                      setFormEditPlace={setFormEditPlace}
                      okText="Move to Suggested"
                      cancelText="Move to HCC"
                      confirmFunc={deletedToSuggested}
                      cancelFunc={deletedToValid}
                      isDeletedCodes={true}
                      setOpens={setOpens}
                      setCombiTree={setCombiTree}
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                      setActiveComboTree={setActiveComboTree}
                      setSearch={setSearch}
                      setFileLoading={setFileLoading}
                      setIsModalOpenLab={setIsModalOpenLab}
                      setIsModalOpenRadiology={setIsModalOpenRadiology}
                      setIsModalOpenValidCodes={setIsModalOpenValidCodes}
                      setFileModalHeader={setFileModalHeader}
                      patientDocumentResult={patientDocumentResult}
                      setConfirmNotesModalValid={setConfirmNotesModalValid}
                      setIsValidAction={setIsValidAction}
                    />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
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
                    <span className={`${visitStyles.hcc_title_badge}`}>
                      {newValidDiseaseList.length}
                    </span>
                  </div>
                </div>
                <div className={visitStyles.container}>
                  <div className={visitStyles.hccStickey_head}>
                    <HccCards
                      list={newValidDiseaseList}
                      hccVersionDetails={hccVersionDetails}
                      captureSectionMatching={captureSectionMatching}
                      encounterDateMatching={encounterDateMatching}
                      meatCriteriaList={meatCriteriaList}
                      // findValueDocument={findValueDocument}
                      getEncounterDetails={getEncounterDetails}
                      onchangeValid={onchangeValid}
                      getValidHccDetails={getValidHccDetails}
                      setFormValues={setFormValues}
                      setIsEditHccForm={setIsEditHccForm}
                      setFormEditPlace={setFormEditPlace}
                      okText="Move to Deleted"
                      cancelText="Move to Suggested"
                      confirmFunc={confirmvalid}
                      cancelFunc={validToSuggested}
                      editFormPlace={"VALID_DISEASE"}
                      setOpens={setOpens}
                      setCombiTree={setCombiTree}
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                      setActiveComboTree={setActiveComboTree}
                      setSearch={setSearch}
                      setFileLoading={setFileLoading}
                      setIsModalOpenLab={setIsModalOpenLab}
                      setIsModalOpenRadiology={setIsModalOpenRadiology}
                      setIsModalOpenValidCodes={setIsModalOpenValidCodes}
                      setFileModalHeader={setFileModalHeader}
                      patientDocumentResult={patientDocumentResult}
                      setConfirmNotesModalValid={setConfirmNotesModalValid}
                      setIsValidAction={setIsValidAction}
                    />
                  </div>
                </div>
              </ul>
            </div>
            <div className="col-xl-4">
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
                <div className={visitStyles.suggestedcontainer}>
                  <div className={visitStyles.hccStickey_head}>
                    <HccCards
                      list={suggestedHccList}
                      hccVersionDetails={hccVersionDetails}
                      captureSectionMatching={captureSectionMatching}
                      encounterDateMatching={encounterDateMatching}
                      meatCriteriaList={meatCriteriaList}
                      // findValueDocument={findValueDocument}
                      getEncounterDetails={getEncounterDetails}
                      onchangeValid={onchangeValid}
                      getValidHccDetails={getValidHccDetails}
                      setFormValues={setFormValues}
                      setIsEditHccForm={setIsEditHccForm}
                      setFormEditPlace={setFormEditPlace}
                      okText={"Move to Deleted"}
                      cancelText={"Move to HCC"}
                      confirmFunc={suggestedToDeleted}
                      cancelFunc={suggestedToValid}
                      suggestedToDeleted={suggestedToDeleted}
                      editFormPlace={"SUGGESTED_DISEASE"}
                      setOpens={setOpens}
                      setCombiTree={setCombiTree}
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                      setActiveComboTree={setActiveComboTree}
                      setSearch={setSearch}
                      setFileLoading={setFileLoading}
                      setIsModalOpenLab={setIsModalOpenLab}
                      setIsModalOpenRadiology={setIsModalOpenRadiology}
                      setIsModalOpenValidCodes={setIsModalOpenValidCodes}
                      setFileModalHeader={setFileModalHeader}
                      patientDocumentResult={patientDocumentResult}
                      setConfirmNotesModalValid={setConfirmNotesModalValid}
                      setIsValidAction={setIsValidAction}
                    />
                  </div>
                </div>
              </ul>
            </div>

            <div className="col-xl-4">
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
                <div className={visitStyles.container}>
                  <div className={visitStyles.hccStickey_head}>
                    <HccCards
                      list={deletedHccList}
                      hccVersionDetails={hccVersionDetails}
                      captureSectionMatching={captureSectionMatching}
                      encounterDateMatching={encounterDateMatching}
                      meatCriteriaList={meatCriteriaList}
                      // findValueDocument={findValueDocument}
                      getEncounterDetails={getEncounterDetails}
                      onchangeValid={onchangeValid}
                      getValidHccDetails={getValidHccDetails}
                      setFormValues={setFormValues}
                      setIsEditHccForm={setIsEditHccForm}
                      setFormEditPlace={setFormEditPlace}
                      okText="Move to Suggested"
                      cancelText="Move to HCC"
                      confirmFunc={deletedToSuggested}
                      cancelFunc={deletedToValid}
                      isDeletedCodes={true}
                      setOpens={setOpens}
                      setCombiTree={setCombiTree}
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                      setActiveComboTree={setActiveComboTree}
                      setSearch={setSearch}
                      setFileLoading={setFileLoading}
                      setIsModalOpenLab={setIsModalOpenLab}
                      setIsModalOpenRadiology={setIsModalOpenRadiology}
                      setIsModalOpenValidCodes={setIsModalOpenValidCodes}
                      setFileModalHeader={setFileModalHeader}
                      patientDocumentResult={patientDocumentResult}
                      setConfirmNotesModalValid={setConfirmNotesModalValid}
                      setIsValidAction={setIsValidAction}
                    />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ModelIndex
        validated={validated}
        handleSubmit=""
        title={fileModalHeader}
        openState={isModalOpenValidCodes}
        handleCloseModal={handleCloseModal}
        handleChangeSuggested=""
        combiTree=""
        labReportFile=""
        search=""
        modalOpenValidContent={modalOpenValidContent}
      />
      <ModelIndex
        validated={validated}
        title={fileModalHeader}
        openState={isModalOpenLab}
        handleCloseModal={handleCloseModal}
        labReportFile={labReportFile}
        search={search}
      />

      <ModelIndex
        validated={validated}
        title={fileModalHeader}
        openState={isModalOpenRadiology}
        handleCloseModal={handleCloseModal}
        labReportFile={selectFileURLRadiology}
        search={search}
      />
      <ModelIndex
        validated={validated}
        handleSubmit={(event) =>
          handleSubmitValidNotes(
            event,
            setFileLoading,
            setConfirmNotesModalValid,
            getPatientDetailsReload,
            setValidated
          )
        }
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        handleCloseModal={handleCloseModal}
        handleChangeSuggested={handleChangeSuggested}
      />

      {opens && combiTree[0]?.children?.length > 0 ? (
        <ModelIndex
          validated={validated}
          title={fileModalHeader}
          openState={opens}
          handleCloseModal={handleCloseModal}
          combiTree={combiTree}
        />
      ) : (
        opens && showErrorMessage()
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
            <div className={`className="col-xl-12`}>
              <AddHccForm
                diagnosisCode={inputValue.diagnosisCode}
                handleCloseModal={handleCloseModal}
                isMeatNew={true}
              />
            </div>
          </div>
        </div>
      </Offcanvas>

      <AddMeatQuery
        queryFormValues={queryFormValues}
        handleCloseModal={handleCloseModal}
        isMeatQueryModal={isMeatQueryModal}
        setIsMeatQueryModal={setIsMeatQueryModal}
      />
      <EditHccForm
        formValues={formValues}
        isEditHccForm={isEditHccForm}
        setIsEditHccForm={setIsEditHccForm}
        formEditPlace={formEditPlace}
      />
    </>
  );
};

export default VisitData;
