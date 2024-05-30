import React, { useState, useRef, useEffect } from "react";
import { Badge } from "react-bootstrap";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { useSelector, useDispatch, connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faPen } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, Popover, Input, Space, Form, Select, Button } from "antd";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { notification } from "antd";
import { Tooltip } from "antd";
import styles from "../styles.module.css";
import CamboTree from "../org";
import PdfViewer from "../../PdfViewerComponent";
import RegularButton from "../../../../../components/button";
import { getResponePopup } from "../../../../../utils/reusable";
import AddMeatQuery from "../../components/addMeatQuery";
import {
  getCaptureSectionBackgroundMeatNew,
  getEncounterDateBackground,
  getHeaderHyperlink,
  getProviderNameList,
  removeDuplicatesArray,
} from "../../components/function/ReusableFunctions";
import { getPatientDetails } from "../../components/function/GetData";
import { actions as detailsActions } from "../../../../../stores/patient/details";
const { Option } = Select;

const Meat = ({
  activeMeatTitle,
  year,
  patientDetailsResult,
  getpatientDetailsData,
  hccFileDetails,
  fileDosPageNumberList,
}) => {
  const dispatch = useDispatch();
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
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
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectCode, setSelectCode] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
  const [isModalOpenLab, setIsModalOpenLab] = useState(false);
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
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [isMeatQueryModal, setIsMeatQueryModal] = useState(false);
  const [meatQueriedDetailsModal, setMeatQueriedDetailsModal] = useState(false);
  const [isAddComboCode, setIsAddComboCode] = useState(false);
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const [meatModalTitle, setMeatModalTitle] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [selectMeatResult, setSelectMeatResult] = useState(null);
  const [hccFormTab, setHccFormTab] = useState("HCCFORM");
  const [search, setSearch] = useState(false);
  const [editData, setEditData] = useState({});
  const [queryFormValues, setQueryFormValues] = useState(false);
  const [selectHyperlink, setSelectHyperlink] = useState([]);
  const [selectOtherHyperlink, setSelectOtherHyperlink] = useState([]);

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
    const result = selectHyperlink?.allHeaderResult?.filter(
      (res2) =>
        res2.substring != selectHyperlink?.selectHeaderResult?.substring &&
        res2.header === selectHyperlink?.selectHeaderResult?.header
    );
    setSelectOtherHyperlink(result);
  }, [selectHyperlink]);

  useEffect(() => {
    if (hccFileDetails?.data?.response) {
      setSelectFileURL(hccFileDetails?.data?.response);
    }
  }, [hccFileDetails]);

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
        getpatientDetailsData(
          patientId,
          patientDetailsResult?.data?.response?.processedYear,
          patientDetailsResult?.data?.response?.dateOfService
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDisTitlePopover = (title, value, subString,result) => {
    var popOver = "";
    // var dublicateRemove = removeDuplicatesArray(subString);
    if (value) {
      popOver = (
        <Popover
          placement="top"
          title={title}
          content={
            <>
              <div>{value}</div>
              {subString?.map((res) => {
                return (
                  <div className={styles.subStringContainer}>
                    <div>
                      <span className={styles.substringHead}>
                        {res.header} (Document Word) 
                        <a className={styles.pageNumberHyperlink} onClick={() => gotoPageNumber(res,result,subString)}>
                          ({res.pageNumber})
                        </a>
                        
                      </span>
                    </div>
                    {res.substring}
                  </div>
                );
              })}
            </>
          }
        >
          <span className="meat-name-details">{value}</span>
        </Popover>
      );
    } else {
      popOver = (
        <span className="meat-name-details text-center font-bold">-</span>
      );
    }
    return popOver;
  };

  const gotoPageNumber = (data,result,value) => {
    setSelectHyperlink({ allHeaderResult: value, selectHeaderResult: data });
    var splitSpace = data?.substring
      ?.replace(/\s{2,}/g, " ")
      .replace(/['"]+/g, "");
    setSearch({
      value: splitSpace,
      page: data?.pageNumber,
      headers: true,
      headerContent: data?.header,
    });
    setIsModalOpen(true);
    setSelectMeatResult(result)
    var headerName = patientDetailsResult
    ? patientDetailsResult?.data?.response?.patientId +
      " / " +
      patientDetailsResult?.data?.response?.patientName +
      " / " +
      result.diagnosisCode +
      " - (" +
      result?.diseaseName +
      ")"  +
      " / (" +
      data?.header +
      ")"
    : "";
  setFileModalHeader(headerName);

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
                            setFileModalHeader: setFileModalHeader,
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
                        {getDisTitlePopover(
                          "Monitor",
                          item.monitorAspect,
                          item.monitorHyperLink,
                          item
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            item.monitorHyperLink,
                            captureSectionMatching,
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
                            item.diagnosisCode,
                            setSelectMeatResult,
                            item,
                            setSelectHyperlink
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
                        {getDisTitlePopover(
                          "Evaluate",
                          item.evaluateAspect,
                          item.evaluateHyperLink,
                          item
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            item.evaluateHyperLink,
                            captureSectionMatching,
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
                            item.diagnosisCode,
                            setSelectMeatResult,
                            item,
                            setSelectHyperlink
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
                        {getDisTitlePopover(
                          "Assessment",
                          item.assessmentAspect,
                          item.assessmentHyperLink,
                          item
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            item.assessmentHyperLink,
                            captureSectionMatching,
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
                            item.diagnosisCode,
                            setSelectMeatResult,
                            item,
                            setSelectHyperlink
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
                        {getDisTitlePopover(
                          "Treatment",
                          item.treatmentAspect,
                          item.treatmentHyperLink,
                          item
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            item.treatmentHyperLink,
                            captureSectionMatching,
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
                            item.diagnosisCode,
                            setSelectMeatResult,
                            item,
                            setSelectHyperlink
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
                              activeMeatTitle?.diagnosisCode?.replace(
                                ".",
                                ""
                              ) == item?.diagnosisCode?.replace(".", "")
                                ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                : `col-xl-2 d-grid`
                            }
                          >
                            {item.monitorAspect != "" ? (
                              <Popover
                                placement="topLeft"
                                title="Monitor"
                                content={item.monitorAspect}
                              >
                                <span className="meat-name-details">
                                  {item.monitorAspect}
                                </span>
                              </Popover>
                            ) : (
                              <span className="meat-name-details text-center font-bold">
                                -
                              </span>
                            )}
                            <div>
                              {getCaptureSectionBackgroundMeatNew(
                                item.monitorHyperLink,
                                captureSectionMatching,
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
                                item.diagnosisCode,
                                setSelectMeatResult,
                                item
                              )}
                            </div>
                          </div>
                          <div
                            className={
                              activeMeatTitle?.header === "E" &&
                              activeMeatTitle?.diagnosisCode?.replace(
                                ".",
                                ""
                              ) == item?.diagnosisCode?.replace(".", "")
                                ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                : `col-xl-2 d-grid`
                            }
                          >
                            {item.evaluateAspect != "" ? (
                              <Popover
                                placement="topLeft"
                                title="Evaluation"
                                content={item.evaluateAspect}
                              >
                                <span className="meat-name-details">
                                  {item.evaluateAspect}
                                </span>
                              </Popover>
                            ) : (
                              <span className="meat-name-details text-center font-bold">
                                -
                              </span>
                            )}
                            <div>
                              {getCaptureSectionBackgroundMeatNew(
                                item.evaluateHyperLink,
                                captureSectionMatching,
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
                                item.diagnosisCode,
                                setSelectMeatResult,
                                item
                              )}
                            </div>
                          </div>
                          <div
                            className={
                              activeMeatTitle?.header === "A" &&
                              activeMeatTitle?.diagnosisCode?.replace(
                                ".",
                                ""
                              ) == item?.diagnosisCode?.replace(".", "")
                                ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                : `col-xl-2 d-grid`
                            }
                          >
                            {item.assessmentAspect != "" ? (
                              <Popover
                                placement="topLeft"
                                title="Assessment"
                                content={item.assessmentAspect}
                              >
                                <span className="meat-name-details">
                                  {item.assessmentAspect}
                                </span>
                              </Popover>
                            ) : (
                              <span className="meat-name-details text-center font-bold">
                                -
                              </span>
                            )}

                            <div>
                              {getCaptureSectionBackgroundMeatNew(
                                item.assessmentHyperLink,
                                captureSectionMatching,
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
                                item.diagnosisCode,
                                setSelectMeatResult,
                                item
                              )}
                            </div>
                          </div>
                          <div
                            className={
                              activeMeatTitle?.header === "T" &&
                              activeMeatTitle?.diagnosisCode?.replace(
                                ".",
                                ""
                              ) == item?.diagnosisCode?.replace(".", "")
                                ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                : `col-xl-2 d-grid`
                            }
                          >
                            {item.treatmentAspect != "" ? (
                              <Popover
                                placement="topLeft"
                                title="Treatment"
                                content={item.treatmentAspect}
                              >
                                <span className="meat-name-details">
                                  {item.treatmentAspect}
                                </span>
                              </Popover>
                            ) : (
                              <span className="meat-name-details text-center font-bold">
                                -
                              </span>
                            )}
                            <div>
                              {getCaptureSectionBackgroundMeatNew(
                                item.treatmentHyperLink,
                                captureSectionMatching,
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
                                item.diagnosisCode,
                                setSelectMeatResult,
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
          title={[
            <div className={styles.selectHyperheader}>
              {fileModalHeader}
              {selectOtherHyperlink?.length != 0 && (
                <div className={styles.stillIssueContainer}>
                  <Popover
                    placement="bottom"
                    title="Secondary"
                    content={getCaptureSectionBackgroundMeatNew(
                      selectOtherHyperlink,
                      captureSectionMatching,
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
                      selectMeatResult.diagnosisCode,
                      setSelectMeatResult,
                      selectMeatResult
                    )}
                  >
                    <Button type="primary">Still Hyperlink Issue</Button>
                  </Popover>
                </div>
              )}
            </div>,
          ]}
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
                        {getDisTitlePopover(
                          "Monitor",
                          selectMeatResult?.monitorAspect,
                          selectMeatResult.monitorHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.monitorHyperLink,
                            captureSectionMatching,
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
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
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
                        {getDisTitlePopover(
                          "Evaluate",
                          selectMeatResult?.evaluateAspect,
                          selectMeatResult.evaluateHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.evaluateHyperLink,
                            captureSectionMatching,
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
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
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
                        {getDisTitlePopover(
                          "Assesssment",
                          selectMeatResult?.assessmentAspect,
                          selectMeatResult.assessmentHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.assessmentHyperLink,
                            captureSectionMatching,
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
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
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
                        {getDisTitlePopover(
                          "Treatment",
                          selectMeatResult?.treatmentAspect,
                          selectMeatResult.treatmentHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.treatmentHyperLink,
                            captureSectionMatching,
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
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
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
                  <Form.Item label="Section" name="monitorHyperLink">
                    <Select
                      mode="tags"
                      maxTagCount="responsive"
                      className={`ant_select_form hcc_form mb-2`}
                    >
                      {editData?.monitorHyperLink?.map((data) => (
                        <Option key={data?.header} value={data?.header}>
                          {data?.header}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <Form.Item
                    label="Monitor Header"
                    name="monitorCapturedFromHeader"
                  >
                    <Input
                      name="monitorCapturedFromHeader"
                      className={styles.formControl}
                    />
                  </Form.Item> */}
                </div>
                <div className="col-xl-6">
                  <Form.Item label="Monitor" name="monitorAspect">
                    <Input
                      name="monitorAspect"
                      className={styles.formControl}
                    />
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
                  <Form.Item label="Evaluate" name="evaluateAspect">
                    <Input
                      name="evaluateAspect"
                      className={styles.formControl}
                    />
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
                    name="assessmentAspect"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Assessment.",
                      },
                    ]}
                  >
                    <Input
                      name="assessmentAspect"
                      className={styles.formControl}
                    />
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
                  <Form.Item label="Treatment" name="treatmentAspect">
                    <Input
                      name="treatmentAspect"
                      className={styles.formControl}
                    />
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

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    hccFileDetails: state?.patientDetails?.details?.hccFileResult,
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
  }
);
export default enhancer(Meat);
