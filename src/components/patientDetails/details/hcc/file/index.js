import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch, connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faArrowLeft,
  faPlus,
  faAngleDown,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Drawer, Popover, notification } from "antd";
import { Button, Offcanvas, Spinner } from "react-bootstrap";
import styles from "../styles.module.css";
import PdfViewer from "../../PdfViewerComponent";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import HccCards from "../../components/HCC";
import ModelIndex from "../../components/model/Index";
import { getPatientDetails } from "../../components/function/GetData";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { onDragEnd } from "../../components/function/ReusableFunctions";
import ManuallyAdd from "../../components/manuallyAdd";
import LogoLoader from "../../../../logoLoader";

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
  search,
  setSearch,
  fileDosPageNumberList,
  radiologyFile,
  labFile,
  labResult,
  radiologyResult,
  getRadiologyFileDetails,
  getLabFileDetails,
  currentDiseaseType,
  loading,
  isDosSelected,
  labFileLoad,
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
  const [allMeatList, setAllMeatList] = useState([]);
  const [deletedMeatList, setDeletedMeatList] = useState([]);
  const [showList, setShowList] = useState(["care"]);

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
      setDeletedMeatList,
      "",
      setAllMeatList
    );
  }, [patientDetailsResult]);

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
        `dbservice/hccdisease/icd10mappingForDisease?year=${year.value}&diagnosisCode=${code}`
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
    setPageNumberOptions(
      patientDetailsResult?.data?.response?.fileDetailDTO?.dosSummaries
    );
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  useEffect(() => {
    if (labResult?.data?.response) {
      if (labResult?.data?.response) {
        getLabFileDetails(labResult?.data?.response?.azureBlobPath);
      }
    }
  }, [labResult?.data?.response]);

  useEffect(() => {
    if (radiologyResult?.data?.response) {
      if (radiologyResult?.data?.response?.fileDetailDTO) {
        getRadiologyFileDetails(
          radiologyResult?.data?.response?.fileDetailDTO
            ?.radiologyAzureBlobPaths[0]
        );
      }
    }
  }, [radiologyResult?.data?.response]);
  useEffect(() => {
    if (
      hccFileDetails?.data?.response &&
      patientDetailsResult?.data?.response?.fileDetailDTO &&
      (currentDiseaseType || currentDiseaseType === "")
    ) {
      setSelectFileURL(hccFileDetails?.data?.response);
    }
    if (radiologyFile?.data?.response && !currentDiseaseType) {
      setSelectFileURL(radiologyFile?.data?.response);
    }
    if (labFile?.data?.response && !currentDiseaseType) {
      setSelectFileURL(labFile?.data?.response);
    }
  }, [hccFileDetails, radiologyFile, labFile, currentDiseaseType]);

  useEffect(() => {
    getFileDosPageNumber();
  }, [patientDetailsResult]);

  const handleShowList = (value) => {
    if (showList.includes(value)) {
      setShowList((prev) => {
        return prev.filter((item) => item != value);
      });
    } else if (!showList.includes(value)) {
      setShowList((prev) => [...prev, value]);
    }
  };
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
        <div className="my-post-content row pt-3" style={{ height: "100%" }}>
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
                          {isDosSelected && (
                            <FontAwesomeIcon
                              onClick={() => addValidCodeFile()}
                              icon={faPlus}
                            />
                          )}
                        </span>
                        <div className="d-flex justify-content-center">
                          <span className={`${visitStyles.hcc_title_badge}`}>
                            {newValidDiseaseList.length}
                          </span>
                        </div>
                      </div>
                      <div className={visitStyles.HccContainer}>
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
              {loading || labFileLoad ? (
                <div className={visitStyles?.loaderDiv}>
                  <Spinner />
                </div>
              ) : (
                <>
                  {selectFileURL && (
                    <PdfViewer
                      src={selectFileURL}
                      searchQuery={search?.value ? search?.value : ""}
                      pageNumber={search?.page ? search?.page : 1}
                      headers={search?.headers}
                      // height={true}
                      fileHeightFrames={window.screen.availHeight - 300}
                      fileHeights={"80vh"}
                      isFillView={true}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          {isFileFormShow ? (
            <div
              className="col-xl-5"
              style={{ height: "74.5vh", overflowY: "scroll" }}
            >
              {/* <AddHccForm
                handleCloseModal={handleCloseModal}
                isAddHccForm={isAddHccForm}
                setIsAddHccForm={setIsAddHccForm}
                isMeatNew={true}
              /> */}

              <ManuallyAdd
                handleCloseModal={handleCloseModal}
                setIsFileFormShow={setIsFileFormShow}
                year={year}
              />
            </div>
          ) : null}
          {!isFileFormShow ? (
            <div className="col-xl-3" style={{ height: "74vh" }}>
              <Droppable droppableId={"SUGGESTED"} key={"SUGGESTED"}>
                {(provided) => {
                  return (
                    <div
                      className="timeline"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div
                        className={`valid-text d-flex justify-content-sm-between cr-pointer ${visitStyles.suggested_title_card}`}
                        onClick={() => handleShowList("care")}
                      >
                        <span className={`${visitStyles.suggested_title_name}`}>
                          <span className="mx-1">
                            <FontAwesomeIcon
                              icon={
                                showList.includes("care")
                                  ? faAngleDown
                                  : faAngleRight
                              }
                            />
                          </span>
                          CARE GAP
                        </span>
                        <div className="d-flex justify-content-center">
                          <span
                            className={`${visitStyles.suggested_title_badge}`}
                          >
                            {suggestedHccList.length}
                          </span>
                        </div>
                      </div>
                      {showList.includes("care") && (
                        <div
                          className={visitStyles.suggestedcontainer2}
                          style={{
                            height:
                              showList.length == 1
                                ? "58vh"
                                : showList.length == 2
                                ? "27vh"
                                : "18vh",
                          }}
                        >
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
                      )}
                    </div>
                  );
                }}
              </Droppable>
              <Droppable droppableId={"POTENTIAL"} key={"POTENTIAL"}>
                {(provided) => {
                  return (
                    <div
                      className="timeline"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ marginTop: "10px" }}
                    >
                      <div
                        className={`valid-text d-flex justify-content-sm-between cr-pointer ${visitStyles.potential_title_card}`}
                        onClick={() => handleShowList("potential")}
                      >
                        <span className={`${visitStyles.potential_title_name}`}>
                        <span className="mx-1">
                            <FontAwesomeIcon
                              icon={
                                showList.includes("potential")
                                  ? faAngleDown
                                  : faAngleRight
                              }
                            />
                          </span>
                          POTENTIAL DIAGNOSIS
                        </span>
                        <div className="d-flex justify-content-center">
                          <span
                            className={`${visitStyles.potential_title_badge}`}
                          >
                            {deletedHccList.length}
                          </span>
                        </div>
                      </div>
                      {showList.includes("potential") && (
                        <div
                          className={visitStyles.deletedContainers}
                          style={{
                            height:
                              showList.length == 1
                                ? "55vh"
                                : showList.length == 2
                                ? "27vh"
                                : "18vh",
                          }}
                        >
                          <div className={visitStyles.hccStickey_head}>
                            <HccCards
                              list={[]}
                              hccVersionDetails={hccVersionDetails}
                              captureSectionMatching={captureSectionMatching}
                              encounterDateMatching={encounterDateMatching}
                              meatCriteriaList={deletedMeatList}
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
                              cardTitle="POTENTIAL"
                              provided={provided}
                              remove
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              </Droppable>
              <Droppable droppableId={"DELETED"} key={"DELETED"}>
                {(provided) => {
                  return (
                    <div
                      className="timeline"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ marginTop: "10px" }}
                    >
                      <div
                        className={`valid-text d-flex justify-content-sm-between cr-pointer ${visitStyles.deleted_title_card}`}
                        onClick={() => handleShowList("deleted")}
                      >
                        <span className={`${visitStyles.deleted_title_name}`}>
                        <span className="mx-1">
                            <FontAwesomeIcon
                              icon={
                                showList.includes("deleted")
                                  ? faAngleDown
                                  : faAngleRight
                              }
                            />
                          </span>
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
                      {showList.includes("deleted") && (
                        <div
                          className={visitStyles.deletedContainers}
                          style={{
                            height:
                              showList.length == 1
                                ? "55vh"
                                : showList.length == 2
                                ? "27vh"
                                : "18vh",
                          }}
                        >
                          <div className={visitStyles.hccStickey_head}>
                            <HccCards
                              list={deletedHccList}
                              hccVersionDetails={hccVersionDetails}
                              captureSectionMatching={captureSectionMatching}
                              encounterDateMatching={encounterDateMatching}
                              meatCriteriaList={deletedMeatList}
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
                              remove
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              </Droppable>
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
        dragMovemntAction={true}
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
          title={""}
          openState={opens}
          handleCloseModal={handleCloseModal}
          combiTree={combiTree}
          setOpens={setOpens}
          setCombiTree={setCombiTree}
          fileLoading={fileLoading}
          setFileLoading={setFileLoading}
        />
      ) : (
        opens && showErrorMessage()
      )}
      <Drawer
        title=""
        onClose={handleCloseModal}
        closeIcon={false}
        open={isEditHccForm}
        width={"80vw"}
      >
        <div className="row p-4" style={{ overflow: "hidden", height: "100%" }}>
          <div className="col-8">
            {hccFileDetails?.loading != true ? (
              <>
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
                    fileHeight={true}
                    fileHeightFrames={window.screen.availHeight - 50}
                    fileHeights={"100vh"}
                  />
                )}
              </>
            ) : null}
          </div>
          <div className="col-4">
            <div
              className="px-4"
              style={{ height: "90vh", overflowY: "scroll" }}
            >
              <ManuallyAdd
                handleCloseModal={handleCloseModal}
                setIsFileFormShow={setIsFileFormShow}
                year={year}
                isEditPage={true}
                isEditValue={formValues}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    hccFileDetails: state?.patientDetails?.details?.hccFileResult,
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
    radiologyFile: state?.patientDetails?.details?.radiologyFileResult,
    labFile: state?.patientDetails?.details?.labFileResult,
    labFileLoad: state?.patientDetails?.details?.labFileResultLoad,
    radiologyResult: state?.patientDetails?.details?.radiologyResult,
    labResult: state?.patientDetails?.details?.labPDFDetails,
    currentDiseaseType: state?.patientDetails?.details?.currentDiseaseType,
    loading: state?.patientDetails?.details?.loading,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
  }),
  {
    getRadiologyFileDetails: detailsActions.radiologyFileAction,
    getLabFileDetails: detailsActions.labFileAction,
  }
);
export default enhancer(File);
