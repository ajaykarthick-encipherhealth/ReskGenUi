import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch ,connect} from "react-redux";
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
import { Popover, notification } from "antd";
import { Button } from "react-bootstrap";
import styles from "../styles.module.css";
import PdfViewer from "../../PdfViewerComponent";
import AddHccForm from "../../components/addHccForm";
import EditHccForm from "../../components/editHccForm";
import HccCards from "../../components/HCC";
import ModelIndex from "../../components/model/Index";
import { getPatientDetails } from "../../components/function/GetData";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { onDragEnd } from "../../components/function/ReusableFunctions";

const File = ({
  patientDetailsResult,
  hccFileDetails,
  popoverVisible,
  setPopoverVisible,
  year,
  setActiveTabHead,
  setActiveMeatTitle,
  setActiveComboTree,
  pageNumberOptions, 
  setPageNumberOptions,
  search, setSearch,
  fileDosPageNumberList
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
  // const [search, setSearch] = useState();
  const [isAddHccForm, setIsAddHccForm] = useState(false);
  const [isEditHccForm, setIsEditHccForm] = useState(false);
  const [formValues, setFormValues] = useState(false);
  const [formEditPlace, setFormEditPlace] = useState("");
  const [allDisList, setAllDisList] = useState([]);

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
      sectionColorList,
      setAllDisList
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

  const addValidCodeFile = async (event) => {
    setIsFileFormShow(true);
    setValidated(false);
  };

  const getFileDosPageNumber = async () => {
    setPageNumberOptions(fileDosPageNumberList?.data?.response);
  };

 
  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
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
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(
            result,
            allDisList,
            setSelectDiseasesName,
            setSelectDisDetails,
            setConfirmNotesModalValid,
            setIsValidAction,
            patientDetailsResult
          )
        }
      >
        <div className="my-post-content row pt-3">
          {!isFileFormShow ? (
            <div className="col-xl-3">
              <Droppable droppableId={"HCC"} key={"HCC"}>
                {(provided) => {
                  return (
                    <div
                      className="timeline"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
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
                            onchangeValid={onchangeValid}
                            getValidHccDetails={getValidHccDetails}
                            setFormValues={setFormValues}
                            setIsEditHccForm={setIsEditHccForm}
                            setFormEditPlace={setFormEditPlace}
                            okText="Move to Deleted"
                            cancelText="Move to Suggested"
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
                            setConfirmNotesModalValid={
                              setConfirmNotesModalValid
                            }
                            setIsValidAction={setIsValidAction}
                            cardTitle="HCC"
                            provided={provided}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Droppable>
            </div>
          ) : null}
          {isFileFormShow && (
            <div className={"col-xl-1"}>
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
          )}
          <div className={"col-xl-6"}>
            {/* <Popover
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
            </Popover> */}
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
                handleCloseModal={handleCloseModal}
                isAddHccForm={isAddHccForm}
                setIsAddHccForm={setIsAddHccForm}
                isMeatNew={true}
              />
            </div>
          ) : null}
          {!isFileFormShow ? (
            <div className="col-xl-3">
              <Droppable droppableId={"SUGGESTED"} key={"SUGGESTED"}>
                {(provided) => {
                  return (
                    <div
                      className="timeline"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div
                        className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                      >
                        <span className={`${visitStyles.suggested_title_name}`}>
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
                      <div className={visitStyles.suggestedcontainer2}>
                        <div className={visitStyles.hccStickey_head}>
                          <HccCards
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
                            setConfirmNotesModalValid={
                              setConfirmNotesModalValid
                            }
                            setIsValidAction={setIsValidAction}
                            cardTitle="SUGGESTED"
                            provided={provided}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Droppable>

              <div className={visitStyles.deleteFileContainer}>
                <Droppable droppableId={"DELETED"} key={"DELETED"}>
                  {(provided) => {
                    return (
                      <div
                        className="timeline"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        <div
                          className={`valid-text d-flex justify-content-sm-between ${visitStyles.deleted_title_card}`}
                        >
                          <span className={`${visitStyles.deleted_title_name}`}>
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
                        <div className={visitStyles.deletedContainer}>
                          <div className={visitStyles.hccStickey_head}>
                            <HccCards
                              list={deletedHccList}
                              hccVersionDetails={hccVersionDetails}
                              captureSectionMatching={captureSectionMatching}
                              encounterDateMatching={encounterDateMatching}
                              meatCriteriaList={meatCriteriaList}
                              onchangeValid={onchangeValid}
                              getValidHccDetails={getValidHccDetails}
                              setFormValues={setFormValues}
                              setIsEditHccForm={setIsEditHccForm}
                              setFormEditPlace={setFormEditPlace}
                              okText="Move to Suggested"
                              cancelText="Move to HCC"
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
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="DELETED"
                              provided={provided}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          ) : null}
        </div>
      </DragDropContext>
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

const enhancer = connect(
  (state) => ({
    patientDetailsResult :state?.patientDetails?.details?.patientResult,
    hccFileDetails :state?.patientDetails?.details?.hccFileResult,
    fileDosPageNumberList:state?.patientDetails?.details?.dosPageNumberResult,

  }),
);
export default enhancer(File);
