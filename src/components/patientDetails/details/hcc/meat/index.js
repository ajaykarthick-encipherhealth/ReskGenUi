import React, { useState, useRef, useEffect } from "react";
import { Badge } from "react-bootstrap";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "react-vertical-timeline-component/style.min.css";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faPen } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, Popover, Input, Space, Form } from "antd";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import { Tooltip } from "antd";
import Spinner from "../../../../../components/loadingSpinner";
import styles from "../styles.module.css";
import { getPatientDetailsResult } from "../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import CamboTree from "../org";
import PdfViewer from "../../PdfViewerComponent";
import RegularButton from "../../../../../components/button";
import { getResponePopup } from "../../../../../utils/reusable";
import AddMeatQuery from "../../components/addMeatQuery";
import {
  getEncounterDateBackground,
  getHeaderHyperlink,
  getProviderNameList,
} from "../../components/function/ReusableFunctions";
import { getPatientDetails } from "../../components/function/GetData";

const Meat = ({ activeMeatTitle, year }) => {
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
  const [meatEdit, setMeatEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileFormShow, setIsFileFormShow] = useState(false);
  const [isModalOpenValid, setIsModalOpenValid] = useState(false);
  const [isModalOpenValidCodes, setIsModalOpenValidCodes] = useState(false);
  const [isModalOpenCaptureSection, setIsModalOpenCaptureSection] =
    useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [confirmNotesModalInValid, setConfirmNotesModalInValid] =
    useState(false);
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectCode, setSelectCode] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
  const [isModalOpenLab, setIsModalOpenLab] = useState(false);
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
  const [suggestedModal, setSuggestedModal] = useState(false);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [isModalComments, setIsModalComments] = useState(false);
  const [flagContainerActive, setFlagContainerActive] = useState("");
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [inputValueFileDate, setInputValueFileDate] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [isMeatQueryModal, setIsMeatQueryModal] = useState(false);
  const [meatQueriedDetailsModal, setMeatQueriedDetailsModal] = useState(false);
  const [fileDosPageNumber, setFileDosPageNumber] = useState(0);
  const [isAddComboCode, setIsAddComboCode] = useState(false);
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
  const [hccFormTab, setHccFormTab] = useState("HCCFORM");
  const [search, setSearch] = useState(false);
  const [editData, setEditData] = useState({});
  const [queryFormValues, setQueryFormValues] = useState(false);
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
  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
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
  }, [patientDetailsResult]);

  useEffect(() => {
    if (hccFileDetails?.result?.response) {
      setSelectFileURL(hccFileDetails?.result?.response);
    }
  }, [hccFileDetails]);

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

  const onchangeMeat = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
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

  const handleOpenModals = async (
    value,
    disDescription,
    encounterDate,
    meatresult,
  ) => {
    setSelectMeatResult(meatresult);
    setFileLoading(true);
    setIsModalOpen(true);
    var splitPoint = disDescription.substring(" ", 20);
    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );

    var fileId = patientDetailsResult?.result?.response?.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var pageNumber = null;
    var data = {
      fileId: fileId,
      header: value,
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
        if (result?.first == false) {
          splitPoint = value;
        }

        pageNumber = result?.second[0] ? result?.second[0] : null;
        setSearch({
          value: splitPoint,
          page: pageNumber,
          headers: false,
          headerContent: value,
        });
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

      var dataset = value + " / (" + disDescription + ")";
      setSelectMeatName(dataset);
    } catch (error) {
      var dataset = value + " / (" + disDescription + ")";
      setSelectMeatName(dataset);
      splitPoint = value;
      setSearch({
        value: splitPoint,
        headers: true,
      });
      if (findFileKeyword == value) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
      setFileDosPageNumber(null);
    }
  };

  const handleOpenModal = async (
    value,
    disDescription,
    encounterDate,
    meatresult,
    type
  ) => {
  //   setSelectMeatResult(meatresult);
  //   setFileLoading(true);
  //   setIsModalOpen(true);
  //   var splitPoint = disDescription.substring(" ", 20);
  //   var dotLoading = (
  //     <div className={visitStyles.loadingFileHeader}>
  //       <Spinner />
  //     </div>
  //   );
  //   var fileId = patientFileDTO.fileId;
  //   const encounterDatesValue = encounterDate.split(",");
  //   const encounterDatesHeader = encounterDatesValue[0];
  //   var pageNumber = null;
  //   // var data = {
  //   //   fileId: fileId,
  //   //   header: value,
  //   //   diagnosisCode: meatresult.diagnosisCode,
  //   //   dos: encounterDatesValue,
  //   //   stringFileWord: splitPoint,
  //   // };
  //   const patientId = localStorage.getItem("patientId");
  //   var data = {
  //     patientId: patientId,
  //     diagnosisCode: meatresult.diagnosisCode,
  //     year: year.value,
  //     header: value,
  //     dos: encounterDatesValue,
  //     meatType: type,
  //   };
  //   try {
  //     // const response = await axios.post(
  //     //   ENDPOINTS.apiEndoint + `dbservice/pageNumber/latest`,
  //     //   data
  //     // );
  //     const response = await axios.post(
  //       ENDPOINTS.apiEndoint + `dbservice/pageNumber/hyperlink`,
  //       data
  //     );
  //     var result = response.data.response;
  //     if (response?.data?.status == "SUCCESS") {
  //       if (result == null) {
  //         return handleOpenModals(
  //           value,
  //           disDescription,
  //           encounterDate,
  //           meatresult,
  //         );
  //       }
  //       splitPoint = result?.searchString;
  //       setSearch({
  //         value: splitPoint,
  //         page: result?.pageNumber,
  //         headers: false,
  //         headerContent: headerNames,
  //       });
  //       setFileInitialPage(pageNumber);
  //       setFileDosPageNumber(pageNumber);
  //     } else {
  //       setFileInitialPage(null);
  //       setFileDosPageNumber(null);
  //     }
  //     setMeatModalTitle(dotLoading);
  //     setIsLoadingSection(true);
  //     if (findFileKeyword == splitPoint) {
  //       setFileLoading(false);
  //       var dataset = value + " / (" + disDescription + ")";
  //       setMeatModalTitle(dataset);
  //     }
  //     setFindFileKeyword(splitPoint);

  //     var dataset = value + " / (" + disDescription + ")";
  //     setSelectMeatName(dataset);
  //   } catch (error) {
  //     var dataset = value + " / (" + disDescription + ")";
  //     setSelectMeatName(dataset);
  //     splitPoint = value;
  //     if (findFileKeyword == value) {
  //       setFileLoading(false);
  //     }
  //     setFindFileKeyword(splitPoint);
  //     setFileInitialPage(null);
  //     setFileDosPageNumber(null);
  //   }
  // };

  // const getFindValidDiagnosisCode = async (value) => {
  //   const response = await axios.get(
  //     ENDPOINTS.apiEndoint +
  //       `dbservice/icddisease/finddiseasebycode?diseasecode=${value}`
  //   );
  //   if (response.data) {
  //     if (response.data == "ICD disease not found") {
  //       setAddValidCodeCheck(false);
  //     } else {
  //       setAddValidCodeCheck(true);
  //       inputValue.actualDescription = "adakd dvasdv";
  //     }
  //   }

  //   inputValue.actualDescription = "adakd dvasdv";
  // };

  // const stringToColour = (str) => {
  //   let hash = 0;
  //   str?.split("").forEach((char) => {
  //     hash = char.charCodeAt(0) + ((hash << 5) - hash);
  //   });
  //   let colour = "#";
  //   for (let i = 0; i < 3; i++) {
  //     const value = (hash >> (i * 8)) & 0xff;
  //     colour += value.toString(16).padStart(2, "0");
  //   }
  //   return colour;
  // };

  // const submitSectionColors = async (
  //   sectionName,
  //   sectionColor,
  //   backgroundColor
  // ) => {
  //   var postData = {
  //     backgroundColor: backgroundColor,
  //     sectionColor: sectionColor,
  //     sectionName: sectionName,
  //   };

  //   try {
  //     const response = await axios.post(
  //       ENDPOINTS.apiEndoint + `dbservice/section/color/save`,
  //       postData
  //     );
  //     var result = response.data;
  //     if (result.status == "SUCCESS") {
  //     } else {
  //     }
  //   } catch (e) {}
  };

  const getCaptureSectionBackgroundMeat = (
    value,
    dis,
    encounterDate,
    meatresult,
    type,
    hyperlinks,
    diagnosisCode
  ) => {
    if (value) {
      var igonreCase = value.toLowerCase();
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName === igonreCase
      );
      const headerResult = hyperlinks?.filter(
        (res2) => res2.header?.toLowerCase() === result[0]?.sectionName
      );

      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;
      var sectionMapArr = (
        <Popover
        placement="bottom"
        content={
          getHeaderHyperlink(
          headerResult,
          encounterDateMatching,
          "hcc",
          setSearch,
          setFileLoading,
          setIsModalOpenLab,
          setIsModalOpenRadiology,
          setIsModalOpen,
          setFileModalHeader,
          patientDocumentResult,
          fileInitialPage,
          setFileInitialPage,
          diagnosisCode,
          setSelectMeatResult,
          meatresult
        )}
      >
        <span
          // onClick={() =>
          //   handleOpenModal(value, dis, encounterDate, meatresult, type)
          // }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheaderMeat}`}
        >
          {value}
        </span>
        </Popover>
      );
      return sectionMapArr;
    }
  };

  const getCaptureSectionBackgroundMeatFile = (
    value,
    dis,
    encounterDate,
    meatresult,
    type
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
            handleOpenModal(value, dis, encounterDate, meatresult, type)
          }
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
    var data = {
      diagnosisCode: value.diagnosisCode,
    };
    setQueryFormValues(data);
    setIsMeatQueryModal(true);
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  const onFinishMeat = async (form) => {
    const patientId = localStorage.getItem("patientId");
    const data = {
      ...form,
      patientId: patientId,
      year: year.value,
      diagnosisCode: editData.diagnosisCode,
    };

    try {
      const res = await axios.put(
        ENDPOINTS.apiEndoint + "dbservice/patient/compute/editmeat",
        data
      );
      if (res.data?.status) {
        getResponePopup(res);
        setEditData(null);
        setMeatEdit(false);
        dispatch(getPatientDetailsResult(patientId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (form) => {};

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
                      <div className="col-xl-3">
                        <div className="row">
                          <div className="col-xl-4 d-grid">
                            <span className="meat-name-details font-bold">
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
                          <div className="col-xl-8">
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
                        </div>
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          {getProviderNameList({
                            data: item?.providerName,
                            captureSectionMatching: captureSectionMatching,
                          })}
                        </div>
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          {getEncounterDateBackground({
                            value: item?.encounterDateSplit,
                            encounterDateMatching: encounterDateMatching,
                            fileDosPageNumberList: fileDosPageNumberList,
                            setIsModalOpenValidCodes: setIsModalOpen,
                            setSearch: setSearch,
                            setFileModalHeader: setMeatModalTitle,
                            patientDocumentResult: patientDocumentResult,
                            selectMeatResult: setSelectMeatResult,
                            datas: item,
                          })}
                        </div>
                      </div>

                      <div
                        className={
                          activeMeatTitle?.header === "M" &&
                          activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                            item?.diagnosisCode?.replace(".", "")
                            ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                            : `col-xl-2 d-grid`
                        }
                      >
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
                            item.encounterDate,
                            item,
                            "MONITOR",
                            item.monitorHyperLink,
                            item.diagnosisCode
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          activeMeatTitle?.header === "E" &&
                          activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                            item?.diagnosisCode?.replace(".", "")
                            ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                            : `col-xl-2 d-grid`
                        }
                      >
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
                            item.encounterDate,
                            item,
                            "EVALUATION",
                            item.evaluateHyperLink,
                            item.diagnosisCode
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          activeMeatTitle?.header === "A" &&
                          activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                            item?.diagnosisCode?.replace(".", "")
                            ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                            : `col-xl-2 d-grid`
                        }
                      >
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
                            item.encounterDate,
                            item,
                            "ASSESSMENT",
                            item.assessmentHyperLink,
                            item.diagnosisCode
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          activeMeatTitle?.header === "T" &&
                          activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                            item?.diagnosisCode?.replace(".", "")
                            ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                            : `col-xl-2 d-grid`
                        }
                      >
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
                            item.encounterDate,
                            item,
                            "TREATMENT",
                            item.treatmentHyperLink,
                            item.diagnosisCode
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
                        <Tooltip title="Edit">
                          <div
                            className={visitStyles.edit_icon}
                            onClick={() => {
                              setMeatEdit(true);
                              setEditData(item);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPen}
                              style={{ size: 8, color: "#706e70" }}
                            />
                          </div>
                        </Tooltip>
                        {item.isMeatCriteriaPresent === false ? (
                          <div
                            onClick={() => addMeatQuery(item, "Add")}
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
                      <span className="no-patient-data">NO DATA</span>
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
                      <div className={visitStyles.meat_details_card}>
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
                                item.encounterDate,
                                item
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
                                item.encounterDate,
                                item
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
                                item.encounterDate,
                                item
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
                                item.encounterDate,
                                item
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
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="col-xl-12">
            <div>
              <span className="no-patient-data">NO DATA</span>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title={fileModalHeader}
          // title="Pdf Test"
          centered
          open={isModalOpen}
          // style={{ top: 5 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="97%"
          footer={false}
          // height={400}
        >
          <div className="section-container">
            <div className="row">
              <div className="col-xl-4">
                <div style={{ height: "90%", overflowY: "scroll" }}>
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
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getProviderNameList({
                          data: selectMeatResult?.providerName,
                          captureSectionMatching: captureSectionMatching,
                        })}
                      </div>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getEncounterDateBackground({
                          value: selectMeatResult?.encounterDateSplit,
                          encounterDateMatching: encounterDateMatching,
                          fileDosPageNumberList: fileDosPageNumberList,
                          setIsModalOpenValidCodes: setIsModalOpen
                            ? setIsModalOpen
                            : null,
                          setSearch: setSearch,
                          setFileModalHeader: setFileModalHeader,
                          patientDocumentResult: patientDocumentResult,
                        })}
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
                            selectMeatResult.monitorCapturedFromHeader,
                            selectMeatResult.monitor,
                            selectMeatResult.encounterDate,
                            selectMeatResult,
                            "MONITOR",
                            selectMeatResult.monitorHyperLink,
                            selectMeatResult.diagnosisCode
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
                            selectMeatResult.evaluateCapturedFromHeader,
                            selectMeatResult.evaluate,
                            selectMeatResult.encounterDate,
                            selectMeatResult,
                            "EVALUATION",
                            selectMeatResult.evaluateHyperLink,
                            selectMeatResult.diagnosisCode
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
                            selectMeatResult.assessmentCapturedFromHeader,
                            selectMeatResult.assessment,
                            selectMeatResult.encounterDate,
                            selectMeatResult,
                            "ASSESSMENT",
                            selectMeatResult.assessmentHyperLink,
                            selectMeatResult.diagnosisCode
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
                            selectMeatResult.treatmentCapturedFromHeader,
                            selectMeatResult.treatment,
                            selectMeatResult.encounterDate,
                            selectMeatResult,
                            "TREATMENT",
                            selectMeatResult.treatmentHyperLink,
                            selectMeatResult.diagnosisCode
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <>
                  {selectFileURL && (
                    <PdfViewer
                      src={selectFileURL}
                      searchQuery={search?.value ? search?.value : ""}
                      pageNumber={search?.page ? search?.page : 1}
                      headers={search?.headers}
                      headerContent={search?.headerContent}
                    />
                  )}
                </>
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

      {meatEdit && (
        <Modal
          title={"Edit MEAT"}
          // title="Pdf Test"
          centered
          open={meatEdit}
          // style={{ top: 5 }}
          onOk={() => setMeatEdit(false)}
          onCancel={() => setMeatEdit(false)}
          width="50%"
          footer={false}
          // height={400}
        >
          <Form
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            initialValues={editData}
            onFinish={onFinishMeat}
            onFinishFailed={onFinishFailed}
          >
            <>
              <div className="row">
                <div className="col-xl-6">
                  <Form.Item label="Diagnosis Code" name="diagnosisCode">
                    <Input
                      name="diagnosisCode"
                      className={styles.formControl}
                      disabled
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-6">
                  <Form.Item label="Description" name="diseaseName">
                    <Input
                      name="diseaseName"
                      className={styles.formControl}
                      disabled
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6">
                  <Form.Item
                    label="Monitor Header"
                    name="monitorCapturedFromHeader"
                  >
                    <Input
                      name="monitorCapturedFromHeader"
                      className={styles.formControl}
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-6">
                  <Form.Item label="Monitor" name="monitor">
                    <Input name="monitor" className={styles.formControl} />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6">
                  <Form.Item
                    label="Evaluate Header"
                    name="evaluateCapturedFromHeader"
                  >
                    <Input
                      name="evaluateCapturedFromHeader"
                      className={styles.formControl}
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-6">
                  <Form.Item label="Evaluate" name="evaluate">
                    <Input name="evaluate" className={styles.formControl} />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6">
                  <Form.Item
                    label={<label>Assessment Header&nbsp;</label>}
                    name="assessmentCapturedFromHeader"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Assessment Header.",
                      },
                    ]}
                  >
                    <Input
                      name="assessmentCapturedFromHeader"
                      className={styles.formControl}
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-6">
                  <Form.Item
                    label={<label>Assessment&nbsp;</label>}
                    name="assessment"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Assessment.",
                      },
                    ]}
                  >
                    <Input name="assessment" className={styles.formControl} />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6">
                  <Form.Item
                    label="Treatment Header"
                    name="treatmentCapturedFromHeader"
                  >
                    <Input
                      name="treatmentCapturedFromHeader"
                      className={styles.formControl}
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-6">
                  <Form.Item label="Treatment" name="treatment">
                    <Input name="treatment" className={styles.formControl} />
                  </Form.Item>
                </div>{" "}
              </div>

              <Form.Item>
                <Space>
                  <RegularButton type="submit" name="Save" width={100} />
                </Space>
              </Form.Item>
            </>
          </Form>
        </Modal>
      )}

      <AddMeatQuery
        queryFormValues={queryFormValues}
        handleCloseModal={handleCloseModal}
        isMeatQueryModal={isMeatQueryModal}
        setIsMeatQueryModal={setIsMeatQueryModal}
      />
    </>
  );
};

export default Meat;
