import React, { useState } from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip } from "antd";
import styles from "./styles.module.css";
import { Spinner } from "react-bootstrap";
import {
  faArrowsAlt,
  faSitemap,
  faPen,
  faEllipsisVertical,
  faBook,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getCaptureSectionBackgroundFile,
  getEncounterDateBackground,
  getMeatFound,
  getProviderNameList,
  getSuspectTypes,
  moveToAnotherAction,
} from "../function/ReusableFunctions";
import { useSelector, connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import ModelIndex from "../model/Index";
import ENDPOINTS from "../../../../../utility/enpoints";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import MovementAction from "../movementAction";
import { getProviderNameTag } from "../function/ProviderHyperlinks";

const RadiologyCards = ({
  list,
  hccVersionDetails,
  captureSectionMatching,
  encounterDateMatching,
  meatCriteriaList,
  onchangeValid,
  getValidHccDetails,
  setFormValues,
  setIsEditHccForm,
  setFormEditPlace,
  okText,
  cancelText,
  editFormPlace,
  isDeletedCodes,
  setOpens,
  setCombiTree,
  setActiveTabHead,
  setActiveMeatTitle,
  setActiveComboTree,
  setSearch,
  setFileLoading,
  setIsModalOpenLab,
  setIsModalOpenRadiology,
  setIsModalOpenValidCodes,
  setFileModalHeader,
  patientDocumentResult,
  setConfirmNotesModalValid,
  cardTitle,
  setIsValidAction,
  provided,
  isVisitData,
  fileDosPageNumberList,
  popup,
  getSelectedDosPageNumber
}) => {
  const fileId = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openContent, setOpenContent] = useState(null);
  const [selectedData, setSelectedData] = useState();
  const [initialValues, setInitialValues] = useState({
    header: "",
    searchString: "",
    pagenumber: "",
  });
  const [isMulitpleHeader, setIsMulitpleHeader] = useState(false);
  const [isMulitpleHeaderCode, setIsMulitpleHeadeCode] = useState(null);
  const [isMulitpleProvider, setIsMulitpleProvider] = useState(false);

  const PopContentHccVersion = (
    <div className={styles.innerPop}>
      <div className={styles.displayDiv}>
        {hccVersionDetails ? (
          <>
            {hccVersionDetails.length != 0 ? (
              hccVersionDetails?.map((data) => (
                <div className={styles.hoverDiv} key={data?.id}>
                  <div className={`row ${styles.selectDetailsContainer}`}>
                    <div className="col-xl-3">
                      <span className={styles.selectHead}>{data.name}</span>
                    </div>
                    <div className="col-xl-3">
                      <span className={styles.selectHead}>{data.value}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.hoverDiv}>
                <div className={`row ${styles.selectDetailsContainerNoData}`}>
                  <div className="col-xl-3 text-center">
                    <span className={styles.selectHead}>NO DATA</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={visitStyles.loadingFileHeader}>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
  const handleCloseModal = () => {
    setOpenEdit(false);
    setOpens(false);
    setInitialValues({
      header: "",
      searchString: "",
      pagenumber: "",
    });
  };

  return (
    <>
      {provided && (
        <div ref={provided?.innerRef} {...provided?.droppableProps}>
          {list?.map(
            (
              data,
              i // this condation we added for vignesh suggest to remove isCombo pracent
            ) => (
              <>
                <li key={data?.id}>
                  <Draggable
                    key={data.diagnosisCode}
                    draggableId={data.diagnosisCode}
                    index={i}
                    draggableData={data.list}
                  >
                    {(provided) => {
                      return (
                        <div
                          className={`hccActiveCard ${visitStyles.hcc_card}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className={` justify-content-between ${visitStyles.hcc_card_nameHead}`}
                          >
                            <div>
                              <span className="disease-name d-flex mb-1">
                                <span className="valid-dis-name">
                                  {data.diagnosisCode}
                                </span>

                                {!isDeletedCodes && (
                                  <FontAwesomeIcon
                                    icon={faPen}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setFormValues(data),
                                        setIsEditHccForm(true),
                                        setFormEditPlace(editFormPlace);
                                    }}
                                  />
                                )}

                                <Popover
                                  content={
                                    data.dbDescription
                                      ? data.dbDescription
                                      : data.actualDescription
                                  }
                                  title=""
                                  trigger="hover"
                                  overlayStyle={{ zIndex: 1000 }}
                                >
                                  <>
                                    {" "}
                                    -{" "}
                                    {data.dbDescription
                                      ? data.dbDescription
                                      : data.actualDescription}
                                  </>
                                </Popover>
                              </span>
                            </div>
                            {/* {data.defaultPosition} */}
                            <div className="d-flex">
                              {data.suspectType.length != 0 && (
                                <>
                                  {" "}
                                  {getSuspectTypes(
                                    data.diagnosisCode,
                                    data.suspectType
                                  )}
                                </>
                              )}
                              {data.children.length > 0 && (
                                <>
                                  <div
                                    className={visitStyles.tree_icon}
                                    style={{ background: "#c7f3c6" }}
                                    onClick={() => {
                                      setOpens(true);
                                      setCombiTree([
                                        { ...data, expanded: true },
                                      ]);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faSitemap}
                                      style={{
                                        size: 8,
                                        color: "#088f39",
                                      }}
                                    />
                                  </div>
                                </>
                              )}

                              {/* <div>
                                <FontAwesomeIcon
                                  icon={faCircle}
                                  className={styles.suspectCircle}
                                 />
                              </div> */}
                              {cardTitle == "SUGGESTED" ||
                              cardTitle == "DELETED" ? (
                                <>
                                  {data.defaultPosition == "VALID" ? (
                                    <span
                                      className={`${visitStyles.hccFlag} ${visitStyles.flagDetailsChange}`}
                                    ></span>
                                  ) : data.defaultPosition == "INVALID" ? (
                                    <span
                                      className={`${visitStyles.nonhccFlag} ${visitStyles.flagDetailsChange}`}
                                    ></span>
                                  ) : data.defaultPosition == "SUGGESTED" ? (
                                    <span
                                      className={`${visitStyles.suggestedFlag} ${visitStyles.flagDetailsChange}`}
                                    ></span>
                                  ) : data.defaultPosition == "DELETED" ? (
                                    <span
                                      className={`${visitStyles.deleteFlag} ${visitStyles.flagDetailsChange}`}
                                    ></span>
                                  ) : null}
                                </>
                              ) : null}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className={`${visitStyles.hoverActiveHcc}`}>
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getProviderNameTag({
                                  providerNames: data?.providerName,
                                  hyperlinks: data?.providerHyperlinks,
                                  setSearch: setSearch,
                                  diagnosisCode: data.diagnosisCode,
                                  diseaseName: data.dbDescription,
                                  setIsModalOpen: setIsModalOpenValidCodes,
                                  setFileModalHeader: setFileModalHeader,
                                  patientDocumentResult: patientDocumentResult,
                                  setIsMulitpleHeader: setIsMulitpleProvider,
                                  isMulitpleHeader: isMulitpleProvider,
                                  setIsMulitpleHeadeCode:
                                    setIsMulitpleHeadeCode,
                                  isMulitpleHeaderCode: isMulitpleHeaderCode,
                                  setSelectMeatResult: "",
                                  getSelectedDosPageNumber: getSelectedDosPageNumber
                                })}
                              </div>
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getEncounterDateBackground({
                                  value: data?.encounterDateSplit,
                                  encounterDateMatching: encounterDateMatching,
                                  fileDosPageNumberList: fileDosPageNumberList,
                                  setIsModalOpenValidCodes:
                                    setIsModalOpenValidCodes
                                      ? setIsModalOpenValidCodes
                                      : null,
                                  setSearch: setSearch,
                                  setFileModalHeader: setFileModalHeader,
                                  patientDocumentResult: patientDocumentResult,
                                  popup,
                                })}
                              </div>
                              {data.providerName.length == 0 && (
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getCaptureSectionBackgroundFile({
                                    value: data?.capturedSections,
                                    encounterDate: data?.encounterDate,
                                    actualDescription: data?.actualDescription,
                                    diagnosisCode: data?.diagnosisCode,
                                    documentPlace: data?.getPlace,
                                    captureSectionMatching:
                                      captureSectionMatching,
                                    setSearch: setSearch,
                                    setFileLoading: setFileLoading,
                                    setIsModalOpenLab: setIsModalOpenLab,
                                    setIsModalOpenRadiology:
                                      setIsModalOpenRadiology,
                                    setIsModalOpenValidCodes:
                                      setIsModalOpenValidCodes,
                                    setFileModalHeader: setFileModalHeader,
                                    fileId: fileId,
                                    patientDocumentResult:
                                      patientDocumentResult,
                                    fileInitialPage: fileInitialPage,
                                    setFileInitialPage: setFileInitialPage,
                                    hyperlinks: data?.hyperlinks,
                                    encounterDateMatching:
                                      encounterDateMatching,
                                    setIsMulitpleHeader: setIsMulitpleHeader,
                                    isMulitpleHeader: isMulitpleHeader,
                                    setIsMulitpleHeadeCode:
                                      setIsMulitpleHeadeCode,
                                    isMulitpleHeaderCode: isMulitpleHeaderCode,

                                    diseaseName: data.dbDescription,
                                    popup: "",
                                  })}
                                </div>
                              )}
                            </div>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              <div className="d-flex justify-content-end mt-2">
                                {data.isCmsHcc && (
                                  <div
                                    className={`${visitStyles.cmsStatus} mx-1`}
                                  >
                                    CMS
                                  </div>
                                )}
                                {data.isRxHcc && (
                                  <div
                                    className={`${visitStyles.rxStatus} mx-1`}
                                  >
                                    RX
                                  </div>
                                )}
                              </div>
                              <div
                                className={`cr-pointer ${styles.meatFoundContainer}`}
                              >
                                <div
                                  onClick={() => {
                                    setActiveTabHead(4);
                                    setActiveMeatTitle({
                                      header: "M",
                                      diagnosisCode: data?.diagnosisCode,
                                    });
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "M"
                                  )}
                                </div>
                                <div
                                  onClick={() => {
                                    setActiveTabHead(4);
                                    setActiveMeatTitle({
                                      header: "E",
                                      diagnosisCode: data?.diagnosisCode,
                                    });
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "E"
                                  )}
                                </div>
                                <div
                                  onClick={() => {
                                    setActiveTabHead(4);
                                    setActiveMeatTitle({
                                      header: "A",
                                      diagnosisCode: data?.diagnosisCode,
                                    });
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "A"
                                  )}
                                </div>
                                <div
                                  onClick={() => {
                                    setActiveTabHead(4);
                                    setActiveMeatTitle({
                                      header: "T",
                                      diagnosisCode: data?.diagnosisCode,
                                    });
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "T"
                                  )}
                                </div>
                              </div>
                              {data.providerName.length == 0 && (
                                <>
                                  <div
                                    className={`${visitStyles.encounterAndSectionHeader}`}
                                  >
                                    {data.isManuallyAdded == true ? (
                                      <Badge
                                        className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                      >
                                        Manually Added
                                      </Badge>
                                    ) : null}
                                  </div>
                                  {data.isComboCode == true ? (
                                    <Badge
                                      className={`mt-2 text-start  ${visitStyles.isComboCode}`}
                                      onClick={() => {
                                        setActiveTabHead(3);
                                        setActiveComboTree({
                                          diagnosisCode: data?.diagnosisCode,
                                        });
                                      }}
                                    >
                                      Combo
                                    </Badge>
                                  ) : null}
                                </>
                              )}

                              {data.getPlace == "Insulin" ? (
                                <span
                                  className={` mt-2 ${visitStyles.radiologyStatus}`}
                                  bg={`  mt-2 bg-bg-eight `}
                                >
                                  Insulin
                                </span>
                              ) : null}
                              {data.getPlace == "Lab" ? (
                                <Tooltip title="LAB">
                                  <span
                                    className={` mt-2 ${visitStyles.labStatus}`}
                                    bg={`  mt-2 bg-bg-seven `}
                                  >
                                    Lab
                                  </span>
                                </Tooltip>
                              ) : data.getPlace == "Radio" ? (
                                <Tooltip title="RADIOLOGY">
                                  <span
                                    className={` mt-2 ${visitStyles.radiologyStatus}`}
                                    bg={`  mt-2 bg-bg-eight `}
                                  >
                                    Radiology
                                  </span>
                                </Tooltip>
                              ) : null}
                            </div>
                          </div>
                          {data.providerName.length != 0 && (
                            <div className="d-flex justify-content-between">
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getCaptureSectionBackgroundFile({
                                  value: data?.capturedSections,
                                  encounterDate: data?.encounterDate,
                                  actualDescription: data?.actualDescription,
                                  diagnosisCode: data?.diagnosisCode,
                                  documentPlace: data?.getPlace,
                                  captureSectionMatching:
                                    captureSectionMatching,
                                  setSearch: setSearch,
                                  setFileLoading: setFileLoading,
                                  setIsModalOpenLab: setIsModalOpenLab,
                                  setIsModalOpenRadiology:
                                    setIsModalOpenRadiology,
                                  setIsModalOpenValidCodes:
                                    setIsModalOpenValidCodes,
                                  setFileModalHeader: setFileModalHeader,
                                  fileId: fileId,
                                  patientDocumentResult: patientDocumentResult,
                                  fileInitialPage: fileInitialPage,
                                  setFileInitialPage: setFileInitialPage,
                                  hyperlinks: data?.hyperlinks,
                                  encounterDateMatching: encounterDateMatching,
                                  setIsMulitpleHeader: setIsMulitpleHeader,
                                  isMulitpleHeader: isMulitpleHeader,
                                  setIsMulitpleHeadeCode:
                                    setIsMulitpleHeadeCode,
                                  isMulitpleHeaderCode: isMulitpleHeaderCode,

                                  diseaseName: data.dbDescription,
                                  popup: "",
                                })}
                              </div>
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {data.isManuallyAdded == true ? (
                                  <Badge
                                    className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                  >
                                    Manually Added
                                  </Badge>
                                ) : null}
                              </div>
                              {data.isComboCode == true ? (
                                <Badge
                                  className={`mt-2 text-start  ${visitStyles.isComboCode}`}
                                  onClick={() => {
                                    setActiveTabHead(3);
                                    setActiveComboTree({
                                      diagnosisCode: data?.diagnosisCode,
                                    });
                                  }}
                                >
                                  Combo
                                </Badge>
                              ) : data.isMostSpecific ? (
                                <Badge
                                  className={`mt-2 text-start  ${visitStyles.isMostSpecific}`}
                                >
                                  Most Specified
                                </Badge>
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </Draggable>
                </li>
              </>
            )
          )}
          <span className="d-none">{provided?.placeholder}</span>
        </div>
      )}

      <ModelIndex
        title={"Edit"}
        openState={openEdit}
        handleCloseModal={handleCloseModal}
        isEdit={ENDPOINTS?.isLocalEdit}
        setOpenEdit={setOpenEdit}
        initialValues={initialValues}
        setInitialValues={setInitialValues}
        setOpenContent={setOpenContent}
        selectedData={selectedData}
      />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
  }),
  {
    getSelectedDosPageNumber: detailsActions.getSelectedDosPageNumber,
  }
);
export default enhancer(RadiologyCards);
