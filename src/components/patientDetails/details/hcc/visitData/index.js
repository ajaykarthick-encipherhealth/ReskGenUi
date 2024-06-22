import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { notification } from "antd";
import { Offcanvas } from "react-bootstrap";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import Spinner from "../../../../../components/loadingSpinner";
import styles from "../styles.module.css";
import AddMeatQuery from "../../components/addMeatQuery";
import AddHccForm from "../../components/addHccForm";
import PdfViewer from "../../PdfViewerComponent";
import EditHccForm from "../../components/editHccForm";
import HccCards from "../../components/HCC";
import ModelIndex from "../../components/model/Index";
import { getPatientDetails } from "../../components/function/GetData";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  moveToAnotherAction,
  onDragEnd,
} from "../../components/function/ReusableFunctions";
import ManuallyAdd from "../../components/manuallyAdd";
import LogoLoader from "../../../../logoLoader";

const VisitData = ({
  setActiveTabHead,
  setActiveMeatTitle,
  setActiveComboTree,
  patientDetailsResult,
  hccFileDetails,
  year,
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
  const [isModalOpenValid, setIsModalOpenValid] = useState(false);
  const [isModalOpenValidCodes, setIsModalOpenValidCodes] = useState(false);
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
  const [search, setSearch] = useState(false);
  const [labReportFile, setLabReportFile] = useState([]);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [isValidAction, setIsValidAction] = useState("");
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [userDetails, setUserDetails] = useState("");
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [isMeatQueryModal, setIsMeatQueryModal] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [hccVersionDetails, setHccVersionDetails] = useState(null);
  const [isEditHccForm, setIsEditHccForm] = useState(false);
  const [formValues, setFormValues] = useState(false);
  const [formEditPlace, setFormEditPlace] = useState("");
  const [queryFormValues, setQueryFormValues] = useState(false);
  const [selectDisDetails, setSelectDisDetails] = useState(false);
  const [allDisList, setAllDisList] = useState([]);
  const [zIndex, setZIndex] = useState(false);
  const [allMeatList, setAllMeatList] = useState([]);


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
      setAllDisList,
      "",
      "",
      "",
      "",
      "",
      setAllMeatList
    );

    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    setUserDetails(dotLoading);
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

  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    data.processedYear = patientDetailsResult?.data?.response?.processedYear;
    data.dateOfService = patientDetailsResult?.data?.response?.dateOfService;
    (data.fileId = patientDetailsResult?.data?.response?.fileId),
      setSelectDiseasesName(title);
    setSelectDisDetails(data);
  };

  const handleCloseModal = () => {
    setValidated(false);
    setIsModalOpenValid(false);
    setConfirmNotesModalValid(false);
    setIsModalOpenRadiology(false);
    setIsModalOpenValidCodes(false);
    setIsModalOpenLab(false);
    setIsFileFormShow(false);
    setFileLoading(false);
    setOpens(false);
  };

  const addValidDiseases = () => {
    setIsModalOpenValid(true);
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
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/hccdisease/icd10mappingForDisease?year=${
          patientDetailsResult?.result?.response?.dos
            ? patientDetailsResult?.result?.response?.dos
            : year.value
        }&diagnosisCode=${code}`
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

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  useEffect(() => {
    if (isModalOpenValidCodes) {
      setInterval(() => {
        setZIndex(true);
      }, 1000);
    } else {
      setZIndex(false);
    }
  }, [isModalOpenValidCodes]);

  const modalOpenValidContent = (
    <div className="section-container">
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
                        </span>
                        <div className="d-flex justify-content-center">
                          <span className={`${visitStyles.hcc_title_badge}`}>
                            {
                              newValidDiseaseList.filter(
                                (item) => item.isComboCode != true
                              ).length
                            }
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
                            meatCriteriaList={allMeatList}
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
                            setIsModalOpenValidCodes={setIsModalOpenValidCodes}
                            setFileModalHeader={setFileModalHeader}
                            patientDocumentResult={patientDocumentResult}
                            setConfirmNotesModalValid={
                              setConfirmNotesModalValid
                            }
                            setIsValidAction={setIsValidAction}
                            cardTitle="HCC"
                            isVisitData={true}
                            provided={provided}
                            popup={zIndex}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Droppable>
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
                  headerContent={search?.headerContent}
                />
              )}
            </div>
          </div>
          {isFileFormShow ? (
            <div className={`col-xl-4 ${styles.hccFormContainer}`}>
              {/* <ManuallyAdd handleCloseModal={handleCloseModal} setIsFileFormShow={setIsFileFormShow} year={year}/> */}
              {/* <AddHccForm
                handleCloseModal={handleCloseModal}
                isMeatNew={true}
              /> */}
            </div>
          ) : null}
          {!isFileFormShow ? (
            <div className="col-xl-3">
              <div className="">
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
                          <span
                            className={`${visitStyles.suggested_title_name}`}
                          >
                            SUGGESTED CODES
                          </span>
                          <div className="d-flex justify-content-center">
                            <span
                              className={`${visitStyles.suggested_title_badge}`}
                            >
                              {
                                suggestedHccList.filter(
                                  (item) => item.isComboCode != true
                                ).length
                              }
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
                              meatCriteriaList={allMeatList}
                              onchangeValid={onchangeValid}
                              getValidHccDetails={getValidHccDetails}
                              setFormValues={setFormValues}
                              setIsEditHccForm={setIsEditHccForm}
                              setFormEditPlace={setFormEditPlace}
                              okText={"Move to Deleted"}
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
                              setIsModalOpenValidCodes={
                                setIsModalOpenValidCodes
                              }
                              setFileModalHeader={setFileModalHeader}
                              patientDocumentResult={patientDocumentResult}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="SUGGESTED"
                              isVisitData={true}
                              provided={provided}
                              popup={zIndex}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>

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
                              {
                                deletedHccList.filter(
                                  (item) => item.isComboCode != true
                                ).length
                              }
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
                              meatCriteriaList={allMeatList}
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
                              setIsModalOpenValidCodes={
                                setIsModalOpenValidCodes
                              }
                              setFileModalHeader={setFileModalHeader}
                              patientDocumentResult={patientDocumentResult}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="DELETED"
                              isVisitData={true}
                              provided={provided}
                              popup={zIndex}
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
    </div>
  );

  return (
    <>
      {fileLoading ? <LogoLoader /> : null}
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
        <div className="my-post-content pt-3">
          <div className="widget-media   ps--active-y">
            <div className="row">
              <div className="col-xl-4">
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
                              onClick={() => addValidDiseases()}
                              icon={faPlus}
                            />
                          </span>
                          <div className="d-flex justify-content-center">
                            <span className={`${visitStyles.hcc_title_badge}`}>
                              {
                                newValidDiseaseList.filter(
                                  (item) => item.isComboCode != true
                                ).length
                              }
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
                              meatCriteriaList={allMeatList}
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
                              setIsModalOpenValidCodes={
                                setIsModalOpenValidCodes
                              }
                              setFileModalHeader={setFileModalHeader}
                              patientDocumentResult={patientDocumentResult}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="HCC"
                              provided={provided}
                              isVisitData={true}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>
              <div className="col-xl-4">
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
                          <span
                            className={`${visitStyles.suggested_title_name}`}
                          >
                            SUGGESTED CODES
                          </span>
                          <div className="d-flex justify-content-center">
                            <span
                              className={`${visitStyles.suggested_title_badge}`}
                            >
                              {
                                suggestedHccList.filter(
                                  (item) => item.isComboCode != true
                                ).length
                              }
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
                              meatCriteriaList={allMeatList}
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
                              setIsModalOpenValidCodes={
                                setIsModalOpenValidCodes
                              }
                              setFileModalHeader={setFileModalHeader}
                              patientDocumentResult={patientDocumentResult}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="SUGGESTED"
                              provided={provided}
                              isVisitData={true}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>
              <div className="col-xl-4">
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
                              {
                                deletedHccList.filter(
                                  (item) => item.isComboCode != true
                                ).length
                              }
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
                              meatCriteriaList={allMeatList}
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
                              setIsModalOpenValidCodes={
                                setIsModalOpenValidCodes
                              }
                              setFileModalHeader={setFileModalHeader}
                              patientDocumentResult={patientDocumentResult}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="DELETED"
                              provided={provided}
                              isVisitData={true}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>

      <ModelIndex
        validated={validated}
        handleSubmit=""
        title={fileModalHeader}
        openState={isModalOpenValidCodes}
        handleCloseModal={handleCloseModal}
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
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        handleCloseModal={handleCloseModal}
        setFileLoading={setFileLoading}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        isValidAction={isValidAction}
        selectDisDetails={selectDisDetails}
        dragMovemntAction={true}
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
        {/* <div className="offcanvas-header">
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
                handleCloseModal={handleCloseModal}
                isMeatNew={true}
              />
            </div>
          </div>
        </div> */}
        <div className="p-4" style={{ overflowY: "scroll" }}>
          <ManuallyAdd
            handleCloseModal={handleCloseModal}
            setIsFileFormShow={setIsModalOpenValid}
            year={year}
          />
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

const enhancer = connect((state) => ({
  patientDetailsResult: state?.patientDetails?.details?.patientResult,
  hccFileDetails: state?.patientDetails?.details?.hccFileResult,
}));
export default enhancer(VisitData);
