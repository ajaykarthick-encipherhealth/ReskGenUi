import React, { useState } from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip, Tag, message } from "antd";
import styles from "../../hcc/styles.module.css";
import {
  faArrowsAlt,
  faSitemap,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { CloseCircleFilled } from "@ant-design/icons";
import {
  getCaptureSectionBackgroundFile,
  getEncounterDateBackground,
  getMeatFound,
  getProviderNameList,
  moveToAnotherAction,
} from "../function/ReusableFunctions";
import { connect } from "react-redux";
import { getProviderNameTag } from "../function/ProviderHyperlinks";
import MovementAction from "../movementAction";
import { actions as detailsAction } from "../../../../../stores/patient/details";
import { Draggable } from "react-beautiful-dnd";
import { Spinner } from "react-bootstrap";
import hccstyles from "../HCC/styles.module.css";

const ComboCard = ({
  list,
  captureSectionMatching,
  encounterDateMatching,
  okText,
  cancelText,
  setOpens,
  setCombiTree,
  setSearch,
  setFileLoading,
  setFileModalHeader,
  patientDocumentResult,
  fileDosPageNumberList,
  onchangeCombo,
  setIsModalOpenCaptureSection,
  isAddComboCode,
  addComboCode,
  popConfirmTitle,
  setConfirmNotesModalValid,
  setIsValidAction,
  setActiveTabHead,
  setActiveMeatTitle,
  meatCriteriaList,
  popup,
  getSelectedDosPageNumber,
  cardTitle,
  isDosSelected,
  patientDetailsResult,
  storeFileDetails,
  setSuggestedMeatForm,
  setSelectCardTitle,
  loading,
  provided,
}) => {
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [isMulitpleHeader, setIsMulitpleHeader] = useState(false);
  const [isMulitpleHeaderCode, setIsMulitpleHeadeCode] = useState(null);
  const [isMulitpleProvider, setIsMulitpleProvider] = useState(false);

  const addOnCodeColor = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];
  return (
    <>
      {provided && (
        <div ref={provided?.innerRef} {...provided?.droppableProps}>
          <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
            <div className={visitStyles.combo_head_card}>
              <div className="row p-0">
                <div className="col-xl-4 d-flex align-items-center justify-content-center text-truncate">
                  <label  htmlFor="combo">Combo Codes</label>
                </div>
                <div className="col-xl-2 d-flex align-items-center justify-content-center text-truncate">
                  <label htmlFor="additional">Addons</label>
                </div>
                <div className="col-xl-5 d-flex align-items-center justify-content-center text-truncate">
                  <label  htmlFor="description">Description</label>
                </div>
                <div className="col-xl-1">
                  {/* {isAddComboCode && (
                <div className="d-flex justify-content-center">
                  <button
                    onClick={() => addComboCode()}
                    className={visitStyles.combo_add_btn}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{
                        color: "#fff",
                        size: 12,
                      }}
                    />
                  </button>
                </div>
              )} */}
                </div>
              </div>
            </div>
            {loading ? (
              <div className={hccstyles.noMsContainer}>
                <Spinner />
              </div>
            ) : list?.length != 0 ? (
              <div className={visitStyles.container}>
                <div className={visitStyles.hccStickey_head}>
                  {list?.map((item, ind) => {
                    return (
                      item.isShow && (
                        <Draggable
                          key={item?.diagnosisCode}
                          draggableId={item?.diagnosisCode}
                          index={ind}
                          draggableData={item?.list}
                          isDragDisabled={isDosSelected ? false : true}
                        >
                          {(provided, snapshot) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${visitStyles.combo_details_card} ${
                                  snapshot?.isDragging &&
                                  visitStyles.drag_and_drop_movement_bg
                                }`}
                                key={item?.id}
                              >
                                <div className="row">
                                  <div className="col-xl-3 d-grid">
                                    <span className="font-bold ms-3">
                                      {item.diagnosisCode}
                                    </span>
                                  </div>
                                  <div className="col-xl-3">
                                    {item.addOnCodes?.map(
                                      (addCombo, index) =>
                                        addCombo && (
                                          <span
                                            className="font-bold"
                                            key={addOnCodeColor[index]}
                                          >
                                            <Tag
                                              color={addOnCodeColor[index]}
                                              style={{ fontSize: "10px" }}
                                            >
                                              {addCombo}
                                            </Tag>
                                          </span>
                                        )
                                    )}
                                  </div>
                                  <div className="col-xl-5">
                                    <span>{item.actualDescription}</span>
                                  </div>
                                  <div
                                    className="col-xl-1"
                                    style={{
                                      position: "relative",
                                      right: "18px",
                                    }}
                                  >
                                    {/* <div>
                          <Popconfirm
                            title={popConfirmTitle}
                            onConfirm={() =>
                              moveToAnotherAction(
                                setConfirmNotesModalValid,
                                setIsValidAction,
                                popConfirmTitle == "You want move to delete?"
                                  ? "Move to Deleted"
                                  : "Move to valid",
                                "COMBO"
                              )
                            }
                            placement="leftTop"
                            okText={okText}
                            cancelText={cancelText}
                            onOpenChange={() =>
                              onchangeCombo(item, item.addOnCode)
                            }
                          >
                            <div className={visitStyles.close_icon}>
                              <FontAwesomeIcon
                                icon={faArrowsAlt}
                                style={{
                                  size: 8,
                                  color: "#a80404",
                                }}
                              />
                            </div>
                          </Popconfirm>
                        </div> */}

                                    <div className={styles.comcoActionIcon}>
                                      {item?.children?.length > 0 &&
                                      isDosSelected &&
                                      !item.stateIndicators?.includes(
                                        "COMBO_CODE"
                                      ) &&
                                      item.ruleType ==
                                        "DIRECT_COMBINATION_RULE_ENGINE" ? (
                                        <CloseCircleFilled
                                          className={styles.deleteIcon}
                                          onClick={() =>
                                            message.warning(
                                              "Delete only formed codes"
                                            )
                                          }
                                        />
                                      ) : isDosSelected ? (
                                        <MovementAction
                                          validAction={
                                            cardTitle == "HCC" ? false : true
                                          }
                                          suggestedAction={
                                            cardTitle == "SUGGESTED"
                                              ? false
                                              : true
                                          }
                                          deleteAction={
                                            cardTitle == "DELETED"
                                              ? false
                                              : true
                                          }
                                          setIsValidAction={setIsValidAction}
                                          cardTitle={cardTitle}
                                          setConfirmNotesModalValid={
                                            setConfirmNotesModalValid
                                          }
                                          onchangeValid={onchangeCombo}
                                          result={item}
                                          setFileLoading={setFileLoading}
                                          isComboCode={
                                            item.stateIndicators?.includes(
                                              "COMBO_CODE"
                                            ) &&
                                            item.ruleType !==
                                              "DIRECT_COMBINATION_RULE_ENGINE"
                                          }
                                          meatCriteriaList={meatCriteriaList}
                                          setSuggestedMeatForm={
                                            setSuggestedMeatForm
                                          }
                                          setSelectCardTitle={
                                            setSelectCardTitle
                                          }
                                        />
                                      ) : null}
                                    </div>

                                    {item?.children?.length > 0 && (
                                      <div
                                        className={visitStyles.close_icon}
                                        style={{ background: "#c7f3c6" }}
                                        onClick={() => {
                                          setOpens(true);
                                          setCombiTree([
                                            {
                                              ...item,
                                              expanded: true,
                                              isDisabled: true,
                                            },
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
                                    )}
                                  </div>
                                  <div className={styles.comboDetailsHeaders}>
                                    <div>
                                      <div
                                        className={`${visitStyles.encounterAndSectionHeader}`}
                                      >
                                        {getProviderNameTag({
                                          providerNames: item?.providerName,
                                          hyperlinks: item?.providerHyperlinks,
                                          setSearch: setSearch,
                                          diagnosisCode:
                                            item.diagnosisCodeCombo,
                                          diseaseName: item.diseaseName,
                                          setIsModalOpen:
                                            setIsModalOpenCaptureSection,
                                          setFileModalHeader:
                                            setFileModalHeader,
                                          patientDocumentResult:
                                            patientDocumentResult,
                                          setIsMulitpleHeader:
                                            setIsMulitpleProvider,
                                          isMulitpleHeader: isMulitpleProvider,
                                          setIsMulitpleHeadeCode:
                                            setIsMulitpleHeadeCode,
                                          isMulitpleHeaderCode:
                                            isMulitpleHeaderCode,
                                          setSelectMeatResult: "",
                                          getSelectedDosPageNumber:
                                            getSelectedDosPageNumber,
                                        })}
                                        {/* {getProviderNameTag(
                              item?.providerName,
                              item?.providerHyperlinks,
                              setSearch,
                              item.diagnosisCodeCombo,
                              item.diseaseName,
                              setIsModalOpenCaptureSection,
                              setFileModalHeader,
                              patientDocumentResult,
                              setIsMulitpleProvider,
                              isMulitpleProvider,
                              setIsMulitpleHeadeCode,
                              isMulitpleHeaderCode
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
                                          setIsModalOpenValidCodes:
                                            setIsModalOpenCaptureSection,
                                          setSearch: setSearch,
                                          setFileModalHeader:
                                            setFileModalHeader,
                                          patientDocumentResult:
                                            patientDocumentResult,
                                          popup,
                                          storeFileDetails: storeFileDetails,
                                        })}
                                      </div>
                                      <div
                                        className={`${visitStyles.encounterAndSectionHeader}`}
                                      >
                                        {getCaptureSectionBackgroundFile({
                                          value: item?.capturedSections,
                                          encounterDate: item?.encounterDate,
                                          actualDescription:
                                            item?.actualDescription,
                                          diagnosisCodeCombo:
                                            item?.diagnosisCodeCombo,
                                          getPlace: item?.getPlace,
                                          captureSectionMatching:
                                            captureSectionMatching,
                                          setSearch: setSearch,
                                          setFileLoading: setFileLoading,
                                          setIsModalOpenCaptureSection:
                                            setIsModalOpenCaptureSection,
                                          setFileModalHeader:
                                            setFileModalHeader,
                                          patientDocumentResult:
                                            patientDocumentResult,
                                          fileInitialPage: fileInitialPage,
                                          setFileInitialPage:
                                            setFileInitialPage,
                                          hyperlinks: item?.hyperlinks,
                                          encounterDateMatching:
                                            encounterDateMatching,
                                          setIsMulitpleHeader:
                                            setIsMulitpleHeader,
                                          isMulitpleHeader: isMulitpleHeader,
                                          setIsMulitpleHeadeCode:
                                            setIsMulitpleHeadeCode,
                                          isMulitpleHeaderCode:
                                            isMulitpleHeaderCode,
                                          diseaseName: item.diseaseName,
                                          popup: popup,
                                          getSelectedDosPageNumber:
                                            getSelectedDosPageNumber,
                                          storeFileDetails: storeFileDetails,
                                        })}
                                      </div>
                                    </div>
                                    <div
                                      className={`cr-pointer ${styles.meatFoundContainer}`}
                                    >
                                      <div
                                        onClick={() => {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "M",
                                            diagnosisCode: item?.diagnosisCode,
                                          });
                                        }}
                                      >
                                        {getMeatFound(
                                          item?.diagnosisCode,
                                          meatCriteriaList,
                                          "M"
                                        )}
                                      </div>
                                      <div
                                        onClick={() => {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "E",
                                            diagnosisCode: item?.diagnosisCode,
                                          });
                                        }}
                                      >
                                        {getMeatFound(
                                          item?.diagnosisCode,
                                          meatCriteriaList,
                                          "E"
                                        )}
                                      </div>
                                      <div
                                        onClick={() => {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "A",
                                            diagnosisCode: item?.diagnosisCode,
                                          });
                                        }}
                                      >
                                        {getMeatFound(
                                          item?.diagnosisCode,
                                          meatCriteriaList,
                                          "A"
                                        )}
                                      </div>
                                      <div
                                        onClick={() => {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "T",
                                            diagnosisCode: item?.diagnosisCode,
                                          });
                                        }}
                                      >
                                        {getMeatFound(
                                          item?.diagnosisCode,
                                          meatCriteriaList,
                                          "T"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      )
                    );
                  })}
                </div>
              </div>
            ) : null}

            {list?.length == 0 && !loading ? (
              <div>
                <span className="no-patient-data">No Combination Codes</span>
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
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    loading: state?.patientDetails?.details?.loading,
  }),
  {
    getSelectedDosPageNumber: detailsAction.getSelectedDosPageNumber,
  }
);
export default enhancer(ComboCard);
