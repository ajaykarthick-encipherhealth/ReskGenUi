import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch,connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faArrowLeft,
  faPlus,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Popover, notification } from "antd";
import { Button } from "react-bootstrap";
import styles from "../../hcc/styles.module.css";
import PdfViewer from "../../PdfViewerComponent";
import AddHccForm from "../../components/addHccForm";
import EditHccForm from "../../components/editHccForm";
import HccCards from "../../components/HCC";
import ModelIndex from "../../components/model/Index";
import { getPatientDetails } from "../../components/function/GetData";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { onDragEnd } from "../../components/function/ReusableFunctions";
import NonHccCards from "../../components/NONHCC";

const File = ({
  setActiveTabHead,
  setActiveMeatTitle,
  setActiveComboTree,
  patientDetailsResult,
  hccFileDetails
}) => {
  const dispatch = useDispatch();
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
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
  const [isFileFormShow, setIsFileFormShow] = useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
  const [isModalOpenLab, setIsModalOpenLab] = useState(false);
  const [selectDisDetails, setSelectDisDetails] = useState(false);
  const [labReportFile, setLabReportFile] = useState([]);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [isValidAction, setIsValidAction] = useState("");
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  // const [pageNumberOptions, setPageNumberOptions] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [hccVersionDetails, setHccVersionDetails] = useState(null);
  const [search, setSearch] = useState();
  const [isAddHccForm, setIsAddHccForm] = useState(false);
  const [isEditHccForm, setIsEditHccForm] = useState(false);
  const [formValues, setFormValues] = useState(false);
  const [formEditPlace, setFormEditPlace] = useState("");
  const [allDisList, setAllDisList] = useState([]);
  const [nonHccDiseasesList, setNonHccDiseasesList] = useState([]);


  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    getPatientDetails(
      orgId,
      tenId,
      setPatientDocumentResult,
      "",
      "",
      "",
      setEncounterDateMatching,
      setCaptureSectionMatching,
      "",
      patientDetailsResult,
      dispatch,
      sectionColorList,
      "",
      "",
      "",
      setNonHccDiseasesList
    );
  }, [patientDetailsResult]);

  useEffect(() => {
    if (hccFileDetails?.data?.response) {
      setSelectFileURL(hccFileDetails?.data?.response);
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
  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    data.dos = patientDetailsResult?.result?.response?.dos;
    setSelectDiseasesName(title);
    setSelectDisDetails(data);
  };

  const handleCloseModal = () => {
    setValidated(false);
    setConfirmNotesModalValid(false);
    setIsModalOpenRadiology(false);
    setIsModalOpenLab(false);
    setIsFileFormShow(false);
    setFileLoading(false);
    setIsEditHccForm(false);
    setOpens(false);
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
    }
  };

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
        <div className="col-xl-3">
          <div className="timeline">
            <div
              className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
            >
              <span className={`${visitStyles.hcc_title_name}`}>NON-HCC</span>
              <div className="d-flex justify-content-center">
                <span className={`${visitStyles.hcc_title_badge}`}>
                  {nonHccDiseasesList.length}
                </span>
              </div>
            </div>
            <div className={visitStyles.container}>
              <div className={visitStyles.hccStickey_head}>
                <NonHccCards
                  list={nonHccDiseasesList}
                  hccVersionDetails={hccVersionDetails}
                  captureSectionMatching={captureSectionMatching}
                  encounterDateMatching={encounterDateMatching}
                  meatCriteriaList={meatCriteriaList}
                  onchangeValid={onchangeValid}
                  getValidHccDetails={getValidHccDetails}
                  setFormValues={setFormValues}
                  setIsEditHccForm={setIsEditHccForm}
                  setFormEditPlace={setFormEditPlace}
                  okText="Move to Hcc"
                  cancelText="Cancel"
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
                  cardTitle="NONHCC"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={"col-xl-6"}>
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
        <div className="col-xl-3">
          <div className="timeline">
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
            <div className={visitStyles.container}>
              <div className={visitStyles.hccStickey_head}>
                <NonHccCards
                  list={suggestedHccList}
                  hccVersionDetails={hccVersionDetails}
                  captureSectionMatching={captureSectionMatching}
                  encounterDateMatching={encounterDateMatching}
                  meatCriteriaList={meatCriteriaList}
                  onchangeValid={onchangeValid}
                  getValidHccDetails={getValidHccDetails}
                  setFormValues={setFormValues}
                  setIsEditHccForm={setIsEditHccForm}
                  setFormEditPlace={setFormEditPlace}
                  okText={"Move to Deleted"}
                  cancelText={"Move to HCC"}
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
                  cardTitle="SUGGESTED"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModelIndex
        validated={validated}
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        handleCloseModal={handleCloseModal}
        setFileLoading={setFileLoading}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        isValidAction={isValidAction}
        selectDisDetails={selectDisDetails}
      />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult :state?.patientDetails?.details?.patientResult,
    hccFileDetails :state?.patientDetails?.details?.hccFileResult,
  }),
);
export default enhancer(File);