import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCheck,
  faInfo,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { Popconfirm, Popover } from "antd";
import Select from "react-select";
import { Modal } from "antd";
import visitStyles from "../../../../../styles/visitdata.module.css";
import CamboTree from "../../hcc/org";
import { getPatientRadiologyDetails } from "../../components/function/GetDataRadiology";
import PdfViewer from "../../PdfViewerComponent";
import {
  onDragEnd,
} from "../../components/function/ReusableFunctionsRadiology";
import styles from "../../hcc/styles.module.css";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import RadiologyCards from "../../components/RADIOLOGY";
import ModelIndex from "../../components/model/Index";

const File = ({ setActiveTabHead, setActiveMeatTitle }) => {
  const radiologyDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.radiologyDeatils
  );
  const radiologyFile = useSelector(
    (state) => state?.ReviewerReducers?.radiologyFileDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;
  const [invalidMoveDiseasesList, setInvalidMoveDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [patientDetailsRadiology, setPatientDetailsRadiology] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);

  const [newValidDiseaseListRadiology, setNewValidDiseaseListRadiology] =
    useState([]);
  const [newInValidDiseaseListRadiology, setInNewValidDiseaseListRadiology] =
    useState([]);
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [isLoadingDos, setIsLoadingDos] = useState(true);

  const [radiologyFileDateofServieList, setFileRadiologyDateofServiceList] =
    useState([]);
  const [radiologyFileDateDefaulteSelect, setRadiologyFileDateDefaulteSelect] =
    useState("");
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");

  const [radiologyFileDetailCheck, setRadiologyFileDetailCheck] =
    useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };
  const [search, setSearch] = useState();
  const [meatCriteriaListRadiology, setMeatCriteriaListRadiology] = useState(
    []
  );
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
      setFileRadiologyDateofServiceList,
      setRadiologyFileDateDefaulteSelect,
      setRadiologyFileDetailCheck,
      setCaptureSectionMatching,
      setEncounterDateMatching,
      setNewValidDiseaseListRadiology,
      setInNewValidDiseaseListRadiology,
      setIsLoadingDos,
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

  const findValueDocument = (value, disDescription) => {
    var splitPoint = disDescription.substring(" ", 40);

    highlight({
      keyword: splitPoint,
    });
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

  function removeDuplicates(array) {
    let output = [];
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
    }

    return output;
  }

  const getCaptureSectionBackgroundFile = (value) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var headerNames = result[0]?.sectionName;
      var disCode = result[0]?.diagnosisCode;

      var sectionMapArr = (
        <span
          onClick={() => findValueDocument(disCode, res)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDateBackground = (value) => {
    return value.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = (
        <span onClick={() => getEncounterDetails(res)}>
          <span
            className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
          >
            <i>
              <CalendarOutlined className={visitStyles.calenderIcon} />
            </i>
            {moment(res).format("MMM DD")}
          </span>
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDetails = async (date) => {
    var date = moment(date).format("DD");
    highlight({
      keyword: date,
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
            radiologyDetailsResult
          )
        }
      >
        <div className="my-post-content pt-3">
          <div className="radiology-select-dos">
            {radiologyFileDetailCheck ? (
              <Select
                onChange={(e) => dosOnChangeRadiologyFile(e)}
                options={radiologyFileDateofServieList}
                className="custom-react-select"
                defaultValue={radiologyFileDateDefaulteSelect}
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
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>

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
                        <div className={visitStyles.suggestedcontainer2}>
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
