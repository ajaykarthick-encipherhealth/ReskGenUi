import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import Select from "react-select";
import PdfViewer from "../../PdfViewerComponent";
import { onDragEnd } from "../../components/function/ReusableFunctionsRadiology";
import styles from "../../hcc/styles.module.css";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ModelIndex from "../../components/model/Index";
import { getPatientLabDetails } from "../../components/function/GetDataLab";
import LabCards from "../../components/LAB";

const File = ({ setActiveTabHead, setActiveMeatTitle }) => {
  const labDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.labDeatils
  );
  const labFile = useSelector(
    (state) => state?.ReviewerReducers?.labFileDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const [labReportValidList, setLabReportValidList] = useState([]);
  const [labReportFile, setLabReportFile] = useState([]);

  const [labResultStatus, setLabResultStatus] = useState(false);
  const [labFileDateDefaulteSelect, setLabFileDateDefaulteSelect] =
    useState("");
  const [labResult, setLabResult] = useState("");
  const [labFileDosList, setLabFileDosList] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [labFileFilterList, setLabFileFilterList] = useState(10);
  const [patientLabDetails, setPatientLabDetails] = useState(null);
  const [search, setSearch] = useState();
  const [labReportMeatList, setLabReportMeatList] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [selectDetails, setSelectDetails] = useState();
  const [isValidAction, setIsValidAction] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [allDisList, setAllDisList] = useState([]);
  const [deletedDiseasesList, setDeletedDiseasesList] = useState([]);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);

  useEffect(() => {
    getPatientLabDetails(
      labDetailsResult,
      setLabReportValidList,
      sectionColorList,
      setPatientLabDetails,
      setLabResult,
      setLabFileDosList,
      setCaptureSectionMatching,
      setEncounterDateMatching,
      setLabFileDateDefaulteSelect,
      setLabResultStatus,
      setLabFileFilterList,
      setLabReportMeatList,
      setAllDisList
    );
  }, [labDetailsResult]);

  useEffect(() => {
    setLabReportFile([]);
    getLabReportFiles();
  }, [labFile?.result?.response]);

  const getLabReportFiles = async (fileId, tenId) => {
    if (
      labFile?.result?.response &&
      labDetailsResult?.result?.response?.patientId
    ) {
      setLabReportFile(labFile?.result?.response);
    }
  };

  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    data.dos = data.dosYear;
    setSelectDiseasesName(title);
    setSelectDetails(data);
  };

  const dosOnChangeRadiologyFile = async (e) => {
    var dosKeyValue = e.value;
    patientDetailsRadiology.radiologyFileDetail.map((res, index) => {
      for (var key in res.documentDos) {
        if (key == dosKeyValue) {
          // getPatientPdfFileRadiologyYear(fileDetails[0].azureBlobPath, localTenantId);
          getPatientPdfFileRadiology(res.azureBlobPath, localTenantId);
        }
      }
    });
  };

  const handleCloseModal = () => {
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
            labDetailsResult
          )
        }
      >
        <div className="my-post-content pt-3">
          <div className="radiology-select-dos">
            {labResultStatus ? (
              <Select
                onChange={(e) => dosOnChangeLabFile(e)}
                options={labFileFilterList}
                className="custom-react-select"
                defaultValue={labFileDateDefaulteSelect}
                isSearchable={false}
              />
            ) : (
              <div></div>
            )}
          </div>
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
                          <span className={`${visitStyles.hcc_title_badge}`}>
                            {labReportValidList.length}
                          </span>
                        </div>
                      </div>
                      <div className={visitStyles.container}>
                        <div className={visitStyles.hccStickey_head}>
                          <LabCards
                            list={labReportValidList}
                            captureSectionMatching={captureSectionMatching}
                            meatCriteriaList={labReportMeatList}
                            encounterDateMatching={encounterDateMatching}
                            onchangeValid={onchangeValid}
                            okText="Move to Deleted"
                            cancelText="Cancel"
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
                {labReportFile && (
                  <PdfViewer
                    src={labReportFile}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
                  />
                )}
              </div>
            </div>
            <div className="col-xl-3">
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
                            {deletedDiseasesList.length}
                          </span>
                        </div>
                      </div>
                      <div className={visitStyles.container}>
                        <div className={visitStyles.hccStickey_head}>
                          <LabCards
                            list={deletedDiseasesList}
                            captureSectionMatching={captureSectionMatching}
                            meatCriteriaList={labReportMeatList}
                            encounterDateMatching={encounterDateMatching}
                            onchangeValid={onchangeValid}
                            okText="Cancel"
                            cancelText="Move to Hcc"
                            editFormPlace={"VALID_DISEASE"}
                            setSearch={setSearch}
                            setFileModalHeader={setFileModalHeader}
                            setConfirmNotesModalValid={
                              setConfirmNotesModalValid
                            }
                            cardTitle="DELETED"
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
      </DragDropContext>
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

export default File;
