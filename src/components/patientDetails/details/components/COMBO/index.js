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
  cardTitle,
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
      <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
        <div className={visitStyles.combo_head_card}>
          <div className="row">
            <div className="col-xl-3">
              <label htmlFor="combo">Combo Codes</label>
            </div>
            <div className="col-xl-3">
              <label htmlFor="additional">Addons</label>
            </div>
            <div className="col-xl-5">
              <label htmlFor="description">Description</label>
            </div>
            <div className="col-xl-1">
              {isAddComboCode && (
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
              )}
            </div>
          </div>
        </div>
        {list?.length != 0 ? (
          <div className={visitStyles.container}>
            <div className={visitStyles.hccStickey_head}>
              {list?.map((item) => {
                return (
                  <div
                    className={visitStyles.combo_details_card}
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
                                <Tag color={addOnCodeColor[index]} style={{fontSize: "10px"}}>
                                  {addCombo}
                                </Tag>
                              </span>
                            )
                        )}
                      </div>
                      <div className="col-xl-5">
                        <span>{item.actualDescription}</span>
                      </div>
                      <div className="col-xl-1">
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
                          {item?.children?.length > 0 ? (
                            <CloseCircleFilled className={styles.deleteIcon} onClick={() => message.warning("Delete only formed codes")}/>
                          ) : (
                            <MovementAction
                              validAction={
                                cardTitle == "DELETED_COMBO" ? true : false
                              }
                              deleteAction={
                                cardTitle == "VALID_COMBO" ? true : false
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="COMBO"
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              onchangeValid={onchangeCombo}
                              result={item}
                              setFileLoading={setFileLoading}
                            />
                          )}
                        </div>
                        {item?.children?.length > 0 && (
                          <div
                            className={visitStyles.close_icon}
                            style={{ background: "#c7f3c6" }}
                            onClick={() => {
                              setOpens(true);
                              setCombiTree([{ ...item, expanded: true }]);
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
                            {getProviderNameTag(
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
                            )}
                          </div>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
                            {getEncounterDateBackground({
                              value: item?.encounterDateSplit,
                              encounterDateMatching: encounterDateMatching,
                              fileDosPageNumberList: fileDosPageNumberList,
                              setIsModalOpenValidCodes:
                                setIsModalOpenCaptureSection,
                              setSearch: setSearch,
                              setFileModalHeader: setFileModalHeader,
                              patientDocumentResult: patientDocumentResult,
                              popup
                            })}
                          </div>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
                            {getCaptureSectionBackgroundFile(
                              item?.capturedSections,
                              item?.encounterDate,
                              item?.actualDescription,
                              item?.diagnosisCodeCombo,
                              item?.getPlace,
                              captureSectionMatching,
                              setSearch,
                              setFileLoading,
                              "",
                              "",
                              setIsModalOpenCaptureSection,
                              setFileModalHeader,
                              "",
                              patientDocumentResult,
                              fileInitialPage,
                              setFileInitialPage,
                              item?.hyperlinks,
                              encounterDateMatching,
                              setIsMulitpleHeader,
                              isMulitpleHeader,
                              setIsMulitpleHeadeCode,
                              isMulitpleHeaderCode,
                              item.diseaseName,
                              popup
                            )}
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
                                diagnosisCode: item?.diagnosisCodeCombo,
                              });
                            }}
                          >
                            {getMeatFound(
                              item?.diagnosisCodeCombo,
                              meatCriteriaList,
                              "M"
                            )}
                          </div>
                          <div
                            onClick={() => {
                              setActiveTabHead(4);
                              setActiveMeatTitle({
                                header: "E",
                                diagnosisCode: item?.diagnosisCodeCombo,
                              });
                            }}
                          >
                            {getMeatFound(
                              item?.diagnosisCodeCombo,
                              meatCriteriaList,
                              "E"
                            )}
                          </div>
                          <div
                            onClick={() => {
                              setActiveTabHead(4);
                              setActiveMeatTitle({
                                header: "A",
                                diagnosisCode: item?.diagnosisCodeCombo,
                              });
                            }}
                          >
                            {getMeatFound(
                              item?.diagnosisCodeCombo,
                              meatCriteriaList,
                              "A"
                            )}
                          </div>
                          <div
                            onClick={() => {
                              setActiveTabHead(4);
                              setActiveMeatTitle({
                                header: "T",
                                diagnosisCode: item?.diagnosisCodeCombo,
                              });
                            }}
                          >
                            {getMeatFound(
                              item?.diagnosisCodeCombo,
                              meatCriteriaList,
                              "T"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {list?.length == 0 ? (
          <div>
            <span className="no-patient-data">No Combination Codes</span>
          </div>
        ) : null}
      </div>
    </>
  );
};

const enhancer = connect((state) => ({
  fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
}));
export default enhancer(ComboCard);
