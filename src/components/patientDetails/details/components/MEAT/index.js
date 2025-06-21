import React, { useEffect, useState } from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip, Tag } from "antd";
import styles from "../../hcc/styles.module.css";
import { faArrowsAlt, faPen } from "@fortawesome/free-solid-svg-icons";
import {
  getCaptureSectionBackgroundMeatNew,
  getEncounterDateBackground,
  getProviderNameList,
  moveToAnotherAction,
} from "../function/ReusableFunctions";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { actions as detailsAction } from "../../../../../stores/patient/details";
import { connect } from "react-redux";
import { getProviderNameTag } from "../function/ProviderHyperlinks";
import MovementAction from "../movementAction";
import { Draggable } from "react-beautiful-dnd";
import { Spinner } from "react-bootstrap";
import hccstyles from "../HCC/styles.module.css";
import CardSkeleton from "../../../../skeleton/card";

const MeatCard = ({
  list,
  captureSectionMatching,
  encounterDateMatching,
  okText,
  cancelText,
  setSearch,
  setFileLoading,
  setFileModalHeader,
  patientDocumentResult,
  fileDosPageNumberList,
  popConfirmTitle,
  setConfirmNotesModalValid,
  setIsValidAction,
  setIsModalOpen,
  setSelectMeatResult,
  activeMeatTitle,
  setIsModalOpenLab,
  setIsModalOpenRadiology,
  setSelectHyperlink,
  setEditData,
  setMeatEdit,
  addMeatQuery,
  onchangeMeat,
  getDisTitlePopover,
  cardTitle,
  getSelectedDosPageNumber,
  getRadiologyPDF,
  getCurrentDiseaseType,
  isDosSelected,
  getLabPDFFile,
  labFile,
  setLabData,
  labData,
  patientDetailsResult,
  storeFileDetails,
  setSuggestedMeatForm,
  setSelectCardTitle,
  provided,
  loading,
  patientDetailsLoad,
  id,
  patientIdDetailsData,
  educationalError,
  setEducationalError,
}) => {
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [isMulitpleHeaderCode, setIsMulitpleHeadeCode] = useState(null);
  const [isMulitpleProvider, setIsMulitpleProvider] = useState(false);
  const highlight = (code) => {
    if (code == activeMeatTitle?.diagnosisCode) {
      return true;
    }
  };
  const getPdfEmptyFunction = () => {};
  const getLabPDF =
    labFile?.data?.response && labData == labFile?.data?.response?.fileId
      ? getPdfEmptyFunction
      : getLabPDFFile;

  const isDisabled =
    patientIdDetailsData?.data?.response?.workflow?.[0]?.status !== "PENDING" ||
    patientDetailsResult?.data?.response?.workflow?.[0]?.status == "COMPLETED";

  return (
    <>
      {provided && (
        <div
          id={`${id}-provided-content`}
          ref={provided?.innerRef}
          {...provided?.droppableProps}
        >
          <div
            id={`my-provider-meat`}
            className={`my-post-content pt-3  `}
            style={{ paddingRight: "12px" }}
          >
            <div className={visitStyles.meat_head_card}>
              <div className="row">
                <div className="col-3 text-center text-uppercase">
                  <label>Codes & Description</label>
                </div>
                <div className="col-2 text-center text-uppercase">
                  <label>Monitor</label>
                </div>
                <div className="col-2 text-center text-uppercase">
                  <label>Evaluation</label>
                </div>
                <div className="col-2 text-center text-uppercase">
                  <label>Assessment</label>
                </div>
                <div className="col-2 text-center text-uppercase">
                  <label>Treatment</label>
                </div>
                <div className="col-1">
                  <label></label>
                </div>
              </div>
            </div>

            {loading || patientDetailsLoad ? (
              <div>
                {/* <Spinner /> */}
                <CardSkeleton count={6} />
              </div>
            ) : (
              list?.map((item, i) => {
                return (
                  <Draggable
                    key={item?.diagnosisCode}
                    draggableId={item?.diagnosisCode}
                    index={i}
                    draggableData={item?.list}
                    // isDragDisabled={isDosSelected ? false : true}
                    isDragDisabled={isDosSelected && !isDisabled ? false : true}
                  >
                    {(provided, snapshot) => {
                      return (
                        <div
                          id={`${id}-meat-drag-${i}`}
                          name={`${id}-meat-drag-${i}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${
                            item.isMeatCriteriaPresent === true
                              ? `${visitStyles.meat_details_card_table}`
                              : `${visitStyles.meat_details_card_false_table}`
                          }
                              ${
                                snapshot?.isDragging &&
                                visitStyles.drag_and_drop_movement_bg
                              }`}
                        >
                          <div
                            className="row"
                            id={`${id}-meat-isMeatCriteriaPresent-${i}`}
                            name={`${id}-meat-isMeatCriteriaPresent-${i}`}
                          >
                            <div
                              className="col-3 pe-0"
                              id={`${id}-isMeatCriteriaPresent-content-${i}`}
                              name={`${id}-isMeatCriteriaPresent-content-${i}`}
                            >
                              <div
                                className="rounded-start-2"
                                style={{ padding: "10px" }}
                                id={`${id}-meat-criteria-grid-${i}`}
                                name={`${id}-meat-criteria-grid-${i}`}
                              >
                                <div
                                  className="row"
                                  id={`${id}-meat-criteria-pop-content-${i}`}
                                >
                                  {/* <div className="col-xl-4 d-grid">
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
                          </div> */}
                                  <div
                                    className="col-12  d-grid"
                                    id={`${id}-meat-pop-grid-${i}`}
                                    name={`${id}-meat-pop-grid-${i}`}
                                  >
                                    <Popover
                                      placement="topLeft"
                                      title="Description"
                                      content={item.diseaseName}
                                      overlayStyle={{ zIndex: 1000 }}
                                    >
                                      <div
                                        id={`${id}-diagnosis-code-name${i}`}
                                        name={`${id}-diagnosis-code-name${i}`}
                                        className="d-flex"
                                      >
                                        <span
                                          id={`${id}-diagnosis-code-${i}`}
                                          name={`${id}-diagnosis-code-${i}`}
                                          style={{
                                            fontWeight: "700",
                                            fontSize: "small",
                                          }}
                                        >
                                          {item.diagnosisCode}&nbsp;
                                        </span>
                                        <span
                                          id={`${id}-meat-diseaseName-${i}`}
                                          name={`${id}-meat-diseaseName-${i}`}
                                          className="meat-name-details_meat"
                                          style={{ fontSize: "small" }}
                                        >
                                          - {item.diseaseName}
                                        </span>
                                      </div>
                                    </Popover>
                                  </div>
                                </div>
                                <div
                                  id={`${id}-MC-encounterAndSectionHeader-${i}`}
                                  name={`${id}-MC-encounterAndSectionHeader-${i}`}
                                  style={{ marginTop: "5px" }}
                                >
                                  <div
                                    id={`${id}-MC-encounterAndSectionHeader-Value-${i}`}
                                    name={`${id}-MC-encounterAndSectionHeader-Value-${i}`}
                                    className={`${visitStyles.encounterAndSectionHeader}`}
                                  >
                                    {getProviderNameTag({
                                      providerNames: item?.providerName,
                                      hyperlinks: item?.providerHyperlinks,
                                      setSearch: setSearch,
                                      diagnosisCode: item.diagnosisCode,
                                      diseaseName: item.diseaseName,
                                      setIsModalOpen: setIsModalOpen,
                                      setFileModalHeader: setFileModalHeader,
                                      patientDocumentResult:
                                        patientDocumentResult,
                                      setIsMulitpleHeader:
                                        setIsMulitpleProvider,
                                      isMulitpleHeader: isMulitpleProvider,
                                      setIsMulitpleHeadeCode:
                                        setIsMulitpleHeadeCode,
                                      isMulitpleHeaderCode:
                                        isMulitpleHeaderCode,
                                      setSelectMeatResult: setSelectMeatResult,
                                      meatresult: item,
                                      getSelectedDosPageNumber:
                                        getSelectedDosPageNumber,
                                      getRadiologyPDF: getRadiologyPDF,
                                      getLabPDF: getLabPDF,
                                      getCurrentDiseaseType:
                                        getCurrentDiseaseType,
                                      storeFileDetails: storeFileDetails,
                                      isShow: item?.isShow,
                                    })}
                                    {/* {getProviderNameTag(
                              item?.providerName,
                              item?.providerHyperlinks,
                              setSearch,
                              item.diagnosisCode,
                              item.diseaseName,
                              setIsModalOpen,
                              setFileModalHeader,
                              patientDocumentResult,
                              setIsMulitpleProvider,
                              isMulitpleProvider,
                              setIsMulitpleHeadeCode,
                              isMulitpleHeaderCode,
                              setSelectMeatResult,
                              item
                            )} */}
                                  </div>
                                  <div
                                    className={`${visitStyles.encounterAndSectionHeader}`}
                                  >
                                    {getEncounterDateBackground({
                                      value: item?.encounterDateSplit,
                                      encounterDateMatching:
                                        encounterDateMatching,
                                      fileDosPageNumberList:
                                        patientDetailsResult?.data?.response
                                          ?.fileDetailDTO?.dosSummaries,
                                      setIsModalOpenValidCodes: setIsModalOpen,
                                      setSearch: setSearch,
                                      setFileModalHeader: setFileModalHeader,
                                      patientDocumentResult:
                                        patientDocumentResult,
                                      selectMeatResult: setSelectMeatResult,
                                      datas: item,
                                      getRadiologyPDF: getRadiologyPDF,
                                      getLabPDF: getLabPDF,
                                      getCurrentDiseaseType:
                                        getCurrentDiseaseType,
                                      storeFileDetails: storeFileDetails,
                                      isShow: item?.isShow,
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div
                        className="rounded-start-2 p-3"
                        
                      > */}
                            <div
                              id={`${id}-meatHyperlink-${i}`}
                              className={
                                activeMeatTitle?.header === "M" &&
                                activeMeatTitle?.diagnosisCode?.replace(
                                  ".",
                                  ""
                                ) == item?.diagnosisCode?.replace(".", "")
                                  ? `col-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                  : `col-2 d-grid`
                              }
                              style={{
                                // background: "#eff5ff",
                                background: "#edf5ff",
                                // background: "#ecf2fc" ,
                                padding: "10px",
                                borderRadius: "10px",
                              }}
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
                                  setSelectHyperlink,
                                  getSelectedDosPageNumber,
                                  getRadiologyPDF,
                                  getLabPDF,
                                  getCurrentDiseaseType,
                                  setLabData,
                                  storeFileDetails
                                )}
                              </div>
                            </div>

                            <div
                              id={`${id}-meat-evaluate-${i}`}
                              name={`${id}-meat-evaluate-${i}`}
                              className={
                                activeMeatTitle?.header === "E" &&
                                activeMeatTitle?.diagnosisCode?.replace(
                                  ".",
                                  ""
                                ) == item?.diagnosisCode?.replace(".", "")
                                  ? `col-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                  : `col-2 d-grid`
                              }
                              style={{
                                // background: "#f4f8ff",
                                // background: "#f4f8ff",
                                // background: "#eff5ff",
                                padding: "10px",
                              }}
                            >
                              {getDisTitlePopover(
                                "Evaluate",
                                item.evaluateAspect,
                                item.evaluateHyperLink,
                                item
                              )}
                              <div id={`${id}-meat-link-${i}`}>
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
                                  setSelectHyperlink,
                                  getSelectedDosPageNumber,
                                  getRadiologyPDF,
                                  getLabPDF,
                                  getCurrentDiseaseType,
                                  setLabData,
                                  storeFileDetails
                                )}
                              </div>
                            </div>
                            <div
                              id={`${id}-meat-hyperlink-${i}`}
                              className={
                                activeMeatTitle?.header === "A" &&
                                activeMeatTitle?.diagnosisCode?.replace(
                                  ".",
                                  ""
                                ) == item?.diagnosisCode?.replace(".", "")
                                  ? `col-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                  : `col-2 d-grid`
                              }
                              style={{
                                // background: "#edf5ff",
                                background: "#edf5ff",
                                // background: "#eff5ff",
                                padding: "10px",
                                borderRadius: "10px",
                              }}
                            >
                              {getDisTitlePopover(
                                "Assessment",
                                item.assessmentAspect,
                                item.assessmentHyperLink,
                                item
                              )}
                              <div id={`${id}-meat-capture-${i}`}>
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
                                  setSelectHyperlink,
                                  getSelectedDosPageNumber,
                                  getRadiologyPDF,
                                  getLabPDF,
                                  getCurrentDiseaseType,
                                  setLabData,
                                  storeFileDetails
                                )}
                              </div>
                            </div>
                            <div
                              id={`${id}-meat-treatment-${i}`}
                              name={`${id}-meat-treatment-${i}`}
                              className={
                                activeMeatTitle?.header === "T" &&
                                activeMeatTitle?.diagnosisCode?.replace(
                                  ".",
                                  ""
                                ) == item?.diagnosisCode?.replace(".", "")
                                  ? `col-2 d-grid ${styles.meatHyperlinkActiveClass}`
                                  : `col-2 d-grid`
                              }
                              style={{
                                // background: "#fdfdff",
                                // background: "#fafcff",

                                // background: "#ecf2fc" ,
                                padding: "10px",
                              }}
                            >
                              {getDisTitlePopover(
                                "Treatment",
                                item.treatmentAspect,
                                item.treatmentHyperLink,
                                item
                              )}
                              <div
                                id={`${id}-meat-capture-meat-${i}`}
                                name={`${id}-meat-capture-meat-${i}`}
                              >
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
                                  setSelectHyperlink,
                                  getSelectedDosPageNumber,
                                  getRadiologyPDF,
                                  getLabPDF,
                                  getCurrentDiseaseType,
                                  setLabData,
                                  storeFileDetails
                                )}
                              </div>
                            </div>
                            {isDosSelected && (
                              <div
                                id={`${id}-meat-action-${i}`}
                                name={`${id}-meat-action-${i}`}
                                className="col-1 meatclose ant-badge"
                              >
                                <div
                                  name={`${id}-meat-action-content-${i}`}
                                  id={`${id}-meat-action-content-${i}`}
                                  className="ant-badge d-flex align-items-center justify-content-center"
                                  style={{
                                    background: "#edf5ff",
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: "14px",
                                  }}
                                >
                                  <div
                                    id={`ant-badge ${id}-meat-action-flex-${i}`}
                                    className="d-flex"
                                  >
                                    {/* <Popconfirm
                          title={popConfirmTitle}
                          onConfirm={() =>
                            moveToAnotherAction(
                              setConfirmNotesModalValid,
                              setIsValidAction,
                              popConfirmTitle == "You want move to delete?"
                                ? "Move to Deleted"
                                : "Move to valid",
                              "MEAT"
                            )
                          }
                          placement="leftTop"
                          okText={okText}
                          cancelText={cancelText}
                          onOpenChange={() => onchangeMeat(item)}
                        >
                          <div className={visitStyles.close_icon}>
                            <FontAwesomeIcon
                              icon={faArrowsAlt}
                              style={{ size: 8, color: "#a80404" }}
                            />
                          </div>
                        </Popconfirm> */}

                                    <div
                                      id={`${id}-delete-meat-${i}`}
                                      name={`${id}-delete-meat-${i}`}
                                      className={`ant-badge ${styles.meatActionIcon}`}
                                    >
                                      <MovementAction
                                        validAction={
                                          cardTitle == "DELETED_MEAT"
                                            ? true
                                            : false
                                        }
                                        deleteAction={
                                          cardTitle == "VALID_MEAT"
                                            ? true
                                            : false
                                        }
                                        setIsValidAction={setIsValidAction}
                                        cardTitle={
                                          item.isMeatCriteriaPresent === true
                                            ? "MEAT"
                                            : "NON_MEAT"
                                        }
                                        setConfirmNotesModalValid={
                                          setConfirmNotesModalValid
                                        }
                                        onchangeValid={onchangeMeat}
                                        result={item}
                                        setFileLoading={setFileLoading}
                                        meatCriteriaList={list}
                                        setSuggestedMeatForm={
                                          setSuggestedMeatForm
                                        }
                                        setSelectCardTitle={setSelectCardTitle}
                                        fromMeat={true}
                                        educationalError={educationalError}
                                        setEducationalError={
                                          setEducationalError
                                        }
                                      />
                                    </div>

                                    <Tooltip title="Edit">
                                      <div
                                        id={`${id}-meat-edit-${i}`}
                                        name={`${id}-meat-edit-${i}`}
                                        className={visitStyles.edit_icon}
                                        style={{
                                          cursor: isDisabled
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                        onClick={() => {
                                          if (isDisabled) return;
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
                                    {item?.stateIndicators?.includes(
                                      "QUERIED"
                                    ) ? (
                                      <Tooltip
                                        placement="top"
                                        title={"Already Suggested"}
                                      >
                                        <div
                                          id={`${id}-meat-Q-${i}`}
                                          name={`${id}-meat-Q-${i}`}
                                          className={visitStyles.add_meat_query}
                                          style={{
                                            background: "#edbe4e",
                                            cursor: isDisabled
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "11px",
                                              fontWeight: "600",
                                              color: "#716969",
                                            }}
                                          >
                                            Q
                                          </span>
                                        </div>
                                      </Tooltip>
                                    ) : item.isMeatCriteriaPresent === false ? (
                                      <div
                                        id={`${id}-addMeatQuery-${i}`}
                                        name={`${id}-addMeatQuery-${i}`}
                                        onClick={() => {
                                          if (isDisabled) return;
                                          addMeatQuery(item, "Add");
                                        }}
                                        className={visitStyles.add_meat_query}
                                        style={{
                                          cursor: isDisabled
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            color: "#716969",
                                          }}
                                        >
                                          S
                                        </span>
                                        {/* {SVGICON.meatQueryIcon} */}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })
            )}

            {list.length == 0 ? (
              <div className="card combo-card">
                <div className="col-12">
                  <div>
                    <span className="no-patient-data">NO DATA</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
    radiologyResult: state?.patientDetails?.details?.radiologyResult,
    labResult: state?.patientDetails?.details?.labResult,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
    labFile: state?.patientDetails?.details?.labFileResult,
    loading: state?.patientDetails?.details?.loading,
    patientDetailsLoad: state?.patientDetails?.details?.patientsLoading,
    patientIdDetailsData: state?.patientDetails.details?.patientIdResult,
  }),
  {
    getSelectedDosPageNumber: detailsAction.getSelectedDosPageNumber,
    getLabPDF: detailsAction.labDetailsAction,
    getRadiologyPDF: detailsAction.radiologyDetailsAction,
    getLabPDFFile: detailsAction.labPDFDetails,
    getCurrentDiseaseType: detailsAction.getCurrentDiseaseType,
    storeFileDetails: detailsAction.storeFileIdAction,
  }
);
export default enhancer(MeatCard);
