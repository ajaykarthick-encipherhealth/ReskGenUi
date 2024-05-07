import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment from "moment";
import "react-vertical-timeline-component/style.min.css";

import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faArrowLeft,
  faPlus,
  faArrowsAlt,
  faSitemap,
  faAngleDown,
  faPen,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Popover } from "antd";
import { SVGICON } from "../../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { notification } from "antd";
import { Tooltip } from "antd";
import Spinner from "../../../../../../components/loadingSpinner";
import styles from "../styles.module.css";
import {
  getLabFileDetails,
  getPatientDetailsResult,
  getRadiologyFileDetails,
} from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import CamboTree from "../org";
import PdfViewer from "../../PdfViewerComponent";
import AddHccForm from "../../components/addHccForm";
import EditHccForm from "../../components/editHccForm";
import { pdfUrl } from "../../../../../../stores/authflow/reducers";
import HccCards from "../../components/HCC";
import ModelIndex from "../../components/model/Index";
import { getPatientDetails } from "../../components/function/GetData";
import { handleSubmitValidNotes } from "../../components/function/ReusableFunctions";

const File = ({
  popoverVisible,
  setPopoverVisible,
  year,
  setActiveTabHead,
  setActiveMeatTitle,
  setActiveComboTree,
}) => {
  const dispatch = useDispatch();

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
  const [isFileFormShow, setIsFileFormShow] = useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [confirmNotesModalInValid, setConfirmNotesModalInValid] =
    useState(false);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
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
  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [selectInvalidDetails, setSelectInvalidDetails] = useState(false);
  const [labReportFile, setLabReportFile] = useState([]);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [isValidAction, setIsValidAction] = useState("");
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [pageNumberOptions, setPageNumberOptions] = useState([]);
  const [listPageNumber, setListPageNumber] = useState([]);
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const [fileLoading, setFileLoading] = useState(false);
  const [hccVersionDetails, setHccVersionDetails] = useState(null);
  const [search, setSearch] = useState();
  const [isAddHccForm, setIsAddHccForm] = useState(false);
  const [isEditHccForm, setIsEditHccForm] = useState(false);
  const [formValues, setFormValues] = useState(false);
  const [formEditPlace, setFormEditPlace] = useState("");

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
  }, [patientDetailsResult]);

  useEffect(() => {
    if (hccFileDetails?.result?.response) {
      // dispatch(pdfUrl(hccFileDetails?.result?.response));
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

  useEffect(() => {
    if (findFileKeyword) {
      setTimeout(() => {
        setFileModalHeader(fileModalTitle);

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
    setValidated(false);
    setConfirmNotesModalValid(false);
    setConfirmNotesModalInValid(false);
    setIsModalOpenRadiology(false);
    setIsModalOpenLab(false);
    setIsFileFormShow(false);
    setFindFileKeyword(null);
    setFileLoading(false);
    setActiveTabNumber(activeTabNumber == null ? 0 : null);
    setIsEditHccForm(false);
    setOpens(false);
  };

  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const getValidHccDetails = async (value, code) => {
    var result = "";
    var data = "";

    data = (
      <div className={visitStyles.userDetailsCard}>
        <div className="bouncing-loader"></div>
      </div>
    );

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/hccdisease/icd10mappingForDisease?year=${patientDetailsResult?.result?.response?.dos}&diagnosisCode=${code}`
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
  };

  const getPatientDetailsReload = async (patientId) => {
    dispatch(getPatientDetailsResult(patientId));
    setFileLoading(false);
  };

  const addValidCodeFile = async (event) => {
    setIsFileFormShow(true);
    setValidated(false);
  };

  const getEncounterDetails = async (date) => {
    const findPageNumber = listPageNumber.filter(
      (i) =>
        moment(i.date).format("MM/DD/YYYY") ===
        moment(date).format("MM/DD/YYYY")
    );
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

  const handleChangePageNumber = async (value) => {
    setPopoverVisible(false);
    var str_array = value.split(",");
    var pageNumber = str_array[0];
    setSearch({
      value: "",
      page: pageNumber,
    });
  };
  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };
  const PopContent = (
    <div className={styles.innerPop}>
      <div className={styles.displayDiv}>
        <div className={styles.closeContainer}>
          <FontAwesomeIcon
            icon={faClose}
            style={{
              size: 5,
              color: "#fff",
            }}
            className={styles.close_icon}
            onClick={() => setPopoverVisible(false)}
          />
        </div>
        {pageNumberOptions
          ? pageNumberOptions?.map((data) => (
              <div className={styles.hoverDiv}>
                <div className={`row ${styles.selectDetailsContainer}`}>
                  <div className="col-xl-3">
                    <span className={styles.selectHead}>{data.label}</span>
                  </div>
                  {data?.options.map((data2) => (
                    <div className={`col-xl-3 ${styles.selectDetailsDiv}`}>
                      <span
                        onClick={() => handleChangePageNumber(data2.value)}
                        className={styles.selectDetails}
                      >
                        {data2?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : null}
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
      <div className="my-post-content row pt-3">
        {!isFileFormShow ? (
          <div className="col-xl-3">
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
                    setFileModalHeader={setFileModalHeader}
                    setConfirmNotesModalValid={setConfirmNotesModalValid}
                    setIsValidAction={setIsValidAction}
                  />
                </div>
              </div>
            </ul>
          </div>
        ) : null}
        <div className={isFileFormShow ? "col-xl-1" : "d-none"}>
          <Button
            onClick={() => handleCloseModal()}
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
        <div className={isFileFormShow ? "col-xl-7" : "col-xl-6"}>
          <Popover
            open={popoverVisible}
            content={PopContent}
            placement="bottom"
            trigger={"click"}
            onOpenChange={() => setPopoverVisible(true)}
          >
            <div className={styles.dosContainer}>
              <span className={styles.dosPageNumber}>
                Select Dos Page Number
              </span>
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{
                  size: 10,
                  color: "#e6e6e6",
                }}
              />
            </div>
          </Popover>
          <div className="card-body p-0">
            {hccFileDetails?.loading != true ? (
              <>
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
                  />
                )}
              </>
            ) : null}
          </div>
        </div>
        {isFileFormShow ? (
          <div className="col-xl-4">
            <AddHccForm
              diagnosisCode={inputValue.diagnosisCode}
              handleCloseModal={handleCloseModal}
              isAddHccForm={isAddHccForm}
              setIsAddHccForm={setIsAddHccForm}
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
                      patientDocumentResult={patientDocumentResult}
                      setFileModalHeader={setFileModalHeader}
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
                      patientDocumentResult={patientDocumentResult}
                      setFileModalHeader={setFileModalHeader}
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
      <ModelIndex
        validated={validated}
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        handleCloseModal={handleCloseModal}
        handleChangeSuggested={handleChangeSuggested}
        setFileLoading={setFileLoading}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        getPatientDetailsReload={getPatientDetailsReload}
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

      <EditHccForm
        formValues={formValues}
        isEditHccForm={isEditHccForm}
        setIsEditHccForm={setIsEditHccForm}
        formEditPlace={formEditPlace}
      />
    </>
  );
};

export default File;
