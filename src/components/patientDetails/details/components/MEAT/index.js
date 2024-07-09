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

import { connect } from "react-redux";
import { getProviderNameTag } from "../function/ProviderHyperlinks";
import MovementAction from "../movementAction";

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
}) => {
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [isMulitpleHeader, setIsMulitpleHeader] = useState(false);
  const [isMulitpleHeaderCode, setIsMulitpleHeadeCode] = useState(null);
  const [isMulitpleProvider, setIsMulitpleProvider] = useState(false);

  const highlight = (code) => {
    if (code == activeMeatTitle?.diagnosisCode) {
      return true;
    }
  };
  return (
    <>
      <div className="my-post-content pt-3" >
        <div className={visitStyles.meat_head_card}>
          <div className="row">
            <div className="col-xl-3 text-center text-uppercase">
              <label>Codes & Description</label>
            </div>
            <div className="col-xl-2 text-center text-uppercase">
              <label>Monitor</label>
            </div>
            <div className="col-xl-2 text-center text-uppercase">
              <label>Evaluation</label>
            </div>
            <div className="col-xl-2 text-center text-uppercase">
              <label>Assessment</label>
            </div>
            <div className="col-xl-2 text-center text-uppercase">
              <label>Treatment</label>
            </div>
            <div className="col-xl-1">
              <label></label>
            </div>
          </div>
        </div>
        <div className={visitStyles.meatcontainer}>
          <div className={visitStyles.hccStickey_head}>
            {list?.map((item) => {
              return (
                <div
                  className={
                    item.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card_table}`
                      : `${visitStyles.meat_details_card_false_table}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-3 pe-0">
                      <div
                        className="rounded-start-2"
                        style={{ padding: "10px" }}
                      >
                        <div className="row">
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
                          <div className="col-xl-12  d-grid">
                            <Popover
                              placement="topLeft"
                              title="Description"
                              content={item.diseaseName}
                              overlayStyle={{ zIndex: 1000 }}
                            >
                              <div className="d-flex">
                                <span
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "small",
                                  }}
                                >
                                  {item.diagnosisCode}&nbsp;
                                </span>
                                <span
                                  className="meat-name-details_meat"
                                  style={{ fontSize: "small" }}
                                >
                                  - {item.diseaseName}
                                </span>
                              </div>
                            </Popover>
                          </div>
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
                            {getProviderNameTag(
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
                            )}
                          </div>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
                            {getEncounterDateBackground({
                              value: item?.encounterDateSplit,
                              encounterDateMatching: encounterDateMatching,
                              fileDosPageNumberList: fileDosPageNumberList,
                              setIsModalOpenValidCodes: setIsModalOpen,
                              setSearch: setSearch,
                              setFileModalHeader: setFileModalHeader,
                              patientDocumentResult: patientDocumentResult,
                              selectMeatResult: setSelectMeatResult,
                              datas: item,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div
                        className="rounded-start-2 p-3"
                        
                      > */}
                    <div
                      className={
                        activeMeatTitle?.header === "M" &&
                        activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                          item?.diagnosisCode?.replace(".", "")
                          ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                          : `col-xl-2 d-grid`
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
                          setSelectHyperlink
                        )}
                      </div>
                    </div>

                    <div
                      className={
                        activeMeatTitle?.header === "E" &&
                        activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                          item?.diagnosisCode?.replace(".", "")
                          ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                          : `col-xl-2 d-grid`
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
                      <div>
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
                          setSelectHyperlink
                        )}
                      </div>
                    </div>
                    <div
                      className={
                        activeMeatTitle?.header === "A" &&
                        activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                          item?.diagnosisCode?.replace(".", "")
                          ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                          : `col-xl-2 d-grid`
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
                      <div>
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
                          setSelectHyperlink
                        )}
                      </div>
                    </div>
                    <div
                      className={
                        activeMeatTitle?.header === "T" &&
                        activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                          item?.diagnosisCode?.replace(".", "")
                          ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                          : `col-xl-2 d-grid`
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
                      <div>
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
                          setSelectHyperlink
                        )}
                      </div>
                    </div>
                    <div className="col-xl-1 meatclose">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          background: "#edf5ff",
                          height: "100%",
                          width: "100%",
                          borderRadius: "10px",
                        }}
                      >
                        <div className="d-flex">
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

                          <div className={styles.meatActionIcon}>
                            <MovementAction
                              validAction={
                                cardTitle == "DELETED_MEAT" ? true : false
                              }
                              deleteAction={
                                cardTitle == "VALID_MEAT" ? true : false
                              }
                              setIsValidAction={setIsValidAction}
                              cardTitle="MEAT"
                              setConfirmNotesModalValid={
                                setConfirmNotesModalValid
                              }
                              onchangeValid={onchangeMeat}
                              result={item}
                              setFileLoading={setFileLoading}
                            />
                          </div>

                          <Tooltip title="Edit">
                            <div
                              className={visitStyles.edit_icon}
                              onClick={() => {
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
                          {item.isMeatCriteriaPresent === false ? (
                            <div
                              onClick={() => addMeatQuery(item, "Add")}
                              className={visitStyles.add_meat_query}
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {list.length == 0 ? (
          <div className="card combo-card">
            <div className="col-xl-12">
              <div>
                <span className="no-patient-data">NO DATA</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

const enhancer = connect((state) => ({
  fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
}));
export default enhancer(MeatCard);
