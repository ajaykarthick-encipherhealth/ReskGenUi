import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { getPatientRadiologyDetails } from "../../components/function/GetDataRadiology";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styles from "../../hcc/styles.module.css";
import { onDragEnd } from "../../components/function/ReusableFunctionsRadiology";
import RadiologyCards from "../../components/RADIOLOGY";
import ModelIndex from "../../components/model/Index";
import PdfViewer from "../../PdfViewerComponent";

const VisitData = ({ setActiveTabHead, setActiveMeatTitle }) => {
  const navigate = useRouter();
  let searchKeywords = [];
  const radiologyDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.radiologyDeatils
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const radiologyFile = useSelector(
    (state) => state?.ReviewerReducers?.radiologyFileDetails
  );
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [patientDetailsRadiology, setPatientDetailsRadiology] = useState([]);
  const [newValidDiseaseListRadiology, setNewValidDiseaseListRadiology] =
    useState([]);
  const [newInValidDiseaseListRadiology, setInNewValidDiseaseListRadiology] =
    useState([]);
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);

  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [search, setSearch] = useState();
  const [meatCriteriaListRadiology, setMeatCriteriaListRadiology] = useState(
    []
  );
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [selectDetails, setSelectDetails] = useState();
  const [isValidAction, setIsValidAction] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [allDisList, setAllDisList] = useState([]);
  const [deletedDiseasesList, setDeletedDiseasesList] = useState([]);

  useEffect(() => {
    getPatientRadiologyDetails(
      radiologyDetailsResult,
      sectionColorList,
      setPatientDetailsRadiology,
      "",
      "",
      "",
      setCaptureSectionMatching,
      setEncounterDateMatching,
      setNewValidDiseaseListRadiology,
      setInNewValidDiseaseListRadiology,
      "",
      setMeatCriteriaListRadiology,
      setAllDisList,
      setDeletedDiseasesList
    );
  }, [radiologyDetailsResult]);

  useEffect(() => {
    setSelectFileURLRadiology([]);
    getPatientPdfFileRadiology();
  }, [radiologyFile?.result?.response]);

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    if (
      radiologyFile?.result?.response &&
      radiologyDetailsResult?.result?.response?.patientId
    ) {
      setSelectFileURLRadiology(radiologyFile?.result?.response);
    }
  };

  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    data.dos = data.dosYear;
    setSelectDiseasesName(title);
    setSelectDetails(data);
  };

  const handleCloseModal = () => {
    setIsModalOpenRadiology(false);
    setConfirmNotesModalValid(false);
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
            setSelectDetails,
            setConfirmNotesModalValid,
            setIsValidAction,
            radiologyDetailsResult
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
                          </span>
                          <div className="d-flex justify-content-center">
                            <span className={`${visitStyles.hcc_title_badge}`}>
                              {newValidDiseaseListRadiology.length}
                            </span>
                          </div>
                        </div>
                        <div className={visitStyles.container}>
                          <div className={visitStyles.hccStickey_head}>
                            <RadiologyCards
                              list={newValidDiseaseListRadiology}
                              captureSectionMatching={captureSectionMatching}
                              meatCriteriaList={meatCriteriaListRadiology}
                              encounterDateMatching={encounterDateMatching}
                              onchangeValid={onchangeValid}
                              okText="Move to Deleted"
                              cancelText="Move to Suggested"
                              editFormPlace={"VALID_DISEASE"}
                              setSearch={setSearch}
                              setFileModalHeader={setFileModalHeader}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              cardTitle="RADIOLOGY_HCC"
                              provided={provided}
                              setActiveTabHead={setActiveTabHead}
                              setActiveMeatTitle={setActiveMeatTitle}
                              setIsValidAction={setIsValidAction}
                              setFileLoading={setFileLoading}
                              setIsModalOpenRadiology={setIsModalOpenRadiology}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>

              <div className="col-xl-4">
                <Droppable droppableId={"NON_HCC"} key={"NON_HCC"}>
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
                            NON-HCC
                          </span>
                          <div className="d-flex justify-content-center">
                            <span
                              className={`${visitStyles.suggested_title_badge}`}
                            >
                              {newInValidDiseaseListRadiology.length}
                            </span>
                          </div>
                        </div>
                        <div className={visitStyles.container}>
                          <div className={visitStyles.hccStickey_head}>
                            <RadiologyCards
                              list={newInValidDiseaseListRadiology}
                              captureSectionMatching={captureSectionMatching}
                              meatCriteriaList={meatCriteriaListRadiology}
                              encounterDateMatching={encounterDateMatching}
                              onchangeValid={onchangeValid}
                              okText="Move to Deleted"
                              cancelText="Move to HCC"
                              editFormPlace={"VALID_DISEASE"}
                              setSearch={setSearch}
                              setFileModalHeader={setFileModalHeader}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              cardTitle="NON_HCC"
                              provided={provided}
                              setActiveTabHead={setActiveTabHead}
                              setActiveMeatTitle={setActiveMeatTitle}
                              setIsValidAction={setIsValidAction}
                              setFileLoading={setFileLoading}
                              setIsModalOpenRadiology={setIsModalOpenRadiology}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>

              <div className="col-xl-4">
                <Droppable
                  droppableId={"RADILOGY_DELETED"}
                  key={"RADILOGY_DELETED"}
                >
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
                              {deletedDiseasesList.length}
                            </span>
                          </div>
                        </div>
                        <div className={visitStyles.container}>
                          <div className={visitStyles.hccStickey_head}>
                            <RadiologyCards
                              list={deletedDiseasesList}
                              captureSectionMatching={captureSectionMatching}
                              meatCriteriaList={meatCriteriaListRadiology}
                              encounterDateMatching={encounterDateMatching}
                              onchangeValid={onchangeValid}
                              okText="Move to Suggested"
                              cancelText="Move to HCC"
                              setSearch={setSearch}
                              setFileModalHeader={setFileModalHeader}
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              cardTitle="RADILOGY_DELETED"
                              provided={provided}
                              setActiveTabHead={setActiveTabHead}
                              setActiveMeatTitle={setActiveMeatTitle}
                              setIsValidAction={setIsValidAction}
                              setFileLoading={setFileLoading}
                              setIsModalOpenRadiology={setIsModalOpenRadiology}
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

      {isModalOpenRadiology && (
        <Modal
          title={fileModalHeader}
          centered
          open={isModalOpenRadiology}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="90%"
          footer={false}
        >
          <DragDropContext
            onDragEnd={(result) =>
              onDragEnd(
                result,
                allDisList,
                setSelectDiseasesName,
                setSelectDetails,
                setConfirmNotesModalValid,
                setIsValidAction,
                radiologyDetailsResult
              )
            }
          >
            <div className="section-container">
              <div className="my-post-content pt-3">
                <div className="row">
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
                                <span
                                  className={`${visitStyles.hcc_title_badge}`}
                                >
                                  {newValidDiseaseListRadiology.length}
                                </span>
                              </div>
                            </div>
                            <div className={visitStyles.container}>
                              <div className={visitStyles.hccStickey_head}>
                                <RadiologyCards
                                  list={newValidDiseaseListRadiology}
                                  captureSectionMatching={
                                    captureSectionMatching
                                  }
                                  meatCriteriaList={meatCriteriaListRadiology}
                                  encounterDateMatching={encounterDateMatching}
                                  onchangeValid={onchangeValid}
                                  okText="Move to Deleted"
                                  cancelText="Move to Suggested"
                                  editFormPlace={"VALID_DISEASE"}
                                  setSearch={setSearch}
                                  setFileModalHeader={setFileModalHeader}
                                  setConfirmNotesModalValid={
                                    setConfirmNotesModalValid
                                  }
                                  cardTitle="RADIOLOGY_HCC"
                                  provided={provided}
                                  setActiveTabHead={setActiveTabHead}
                                  setActiveMeatTitle={setActiveMeatTitle}
                                  setIsValidAction={setIsValidAction}
                                  setFileLoading={setFileLoading}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                  <div className="col-xl-6">
                    <div className="card-body p-0 z-index-low">
                      {selectFileURLRadiology && (
                        <PdfViewer
                          src={selectFileURLRadiology}
                          searchQuery={search?.value ? search?.value : ""}
                          pageNumber={search?.page ? search?.page : 1}
                          headers={search?.headers}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="">
                      <Droppable droppableId={"NON_HCC"} key={"NON_HCC"}>
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
                                  NON-HCC
                                </span>
                                <div className="d-flex justify-content-center">
                                  <span
                                    className={`${visitStyles.suggested_title_badge}`}
                                  >
                                    {newInValidDiseaseListRadiology.length}
                                  </span>
                                </div>
                              </div>
                              <div className={visitStyles.suggestedcontainer2}>
                                <div className={visitStyles.hccStickey_head}>
                                  <RadiologyCards
                                    list={newInValidDiseaseListRadiology}
                                    captureSectionMatching={
                                      captureSectionMatching
                                    }
                                    meatCriteriaList={meatCriteriaListRadiology}
                                    encounterDateMatching={
                                      encounterDateMatching
                                    }
                                    onchangeValid={onchangeValid}
                                    okText="Move to Deleted"
                                    cancelText="Move to HCC"
                                    editFormPlace={"VALID_DISEASE"}
                                    setSearch={setSearch}
                                    setFileModalHeader={setFileModalHeader}
                                    setConfirmNotesModalValid={
                                      setConfirmNotesModalValid
                                    }
                                    cardTitle="NON_HCC"
                                    provided={provided}
                                    setActiveTabHead={setActiveTabHead}
                                    setActiveMeatTitle={setActiveMeatTitle}
                                    setIsValidAction={setIsValidAction}
                                    setFileLoading={setFileLoading}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      </Droppable>
                    </div>

                    <div className="">
                      <Droppable
                        droppableId={"RADILOGY_DELETED"}
                        key={"RADILOGY_DELETED"}
                      >
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
                                <span
                                  className={`${visitStyles.deleted_title_name}`}
                                >
                                  DELETED CODES
                                </span>
                                <div className="d-flex justify-content-center">
                                  <span
                                    className={`${visitStyles.deleted_title_badge}`}
                                  >
                                    {deletedDiseasesList.length}
                                  </span>
                                </div>
                              </div>
                              <div className={visitStyles.suggestedcontainer2}>
                                <div className={visitStyles.hccStickey_head}>
                                  <RadiologyCards
                                    list={deletedDiseasesList}
                                    captureSectionMatching={
                                      captureSectionMatching
                                    }
                                    meatCriteriaList={meatCriteriaListRadiology}
                                    encounterDateMatching={
                                      encounterDateMatching
                                    }
                                    onchangeValid={onchangeValid}
                                    okText="Move to Suggested"
                                    cancelText="Move to HCC"
                                    setSearch={setSearch}
                                    setFileModalHeader={setFileModalHeader}
                                    setConfirmNotesModalValid={
                                      setConfirmNotesModalValid
                                    }
                                    cardTitle="RADILOGY_DELETED"
                                    provided={provided}
                                    setActiveTabHead={setActiveTabHead}
                                    setActiveMeatTitle={setActiveMeatTitle}
                                    setIsValidAction={setIsValidAction}
                                    setFileLoading={setFileLoading}
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
            </div>
          </DragDropContext>
        </Modal>
      )}
      <ModelIndex
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        handleCloseModal={handleCloseModal}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        isValidAction={isValidAction}
        selectDisDetails={selectDetails}
        setFileLoading={setFileLoading}
      />
    </>
  );
};

export default VisitData;
