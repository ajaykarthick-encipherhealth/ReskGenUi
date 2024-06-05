import React, { useState } from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip, Tag } from "antd";
import styles from "../../hcc/styles.module.css";
import {
  faArrowsAlt,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import {
  getCaptureSectionBackgroundMeatNew,
  getDisTitlePopover,
  getEncounterDateBackground,
  getProviderNameList,
  moveToAnotherAction,
} from "../function/ReusableFunctions";
import { SVGICON } from "../../../../../jsx/constant/theme";

import { connect } from "react-redux";

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
  onchangeMeat
}) => {
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [isMulitpleHeader, setIsMulitpleHeader] = useState(false);
  const [isMulitpleHeaderCode, setIsMulitpleHeadeCode] = useState(null);

  return (
    <>
   <div className="my-post-content pt-3">
        <div className={visitStyles.meat_head_card}>
          <div className="row">
            <div className="col-xl-1">
              <label>Codes</label>
            </div>
            <div className="col-xl-2">
              <label>Description</label>
            </div>
            <div className="col-xl-2">
              <label>Monitor</label>
            </div>
            <div className="col-xl-2">
              <label>Evaluation</label>
            </div>
            <div className="col-xl-2">
              <label>Assessment</label>
            </div>
            <div className="col-xl-2">
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
                        ? `${visitStyles.meat_details_card}`
                        : `${visitStyles.meat_details_card_false}`
                    }
                  >
                    <div className="row">
                      <div className="col-xl-3">
                        <div className="row">
                          <div className="col-xl-4 d-grid">
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
                          </div>
                          <div className="col-xl-8">
                            <Popover
                              placement="topLeft"
                              title="Description"
                              content={item.diseaseName}
                            >
                              <span className="meat-name-details">
                                {item.diseaseName}
                              </span>
                            </Popover>
                          </div>
                        </div>
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          {getProviderNameList({
                            data: item?.providerName,
                            captureSectionMatching: captureSectionMatching,
                          })}
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

                      <div
                        className={
                          activeMeatTitle?.header === "M" &&
                          activeMeatTitle?.diagnosisCode?.replace(".", "") ==
                            item?.diagnosisCode?.replace(".", "")
                            ? `col-xl-2 d-grid ${styles.meatHyperlinkActiveClass}`
                            : `col-xl-2 d-grid`
                        }
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
                        <Popconfirm
                          title={popConfirmTitle}
                          onConfirm={() =>
                            moveToAnotherAction(
                              setConfirmNotesModalValid,
                              setIsValidAction,
                              popConfirmTitle == "You want move to delete?" ? "Move to Deleted" : "Move to valid",
                              "MEAT"
                            )
                          }
                          placement="leftTop"
                          okText={okText}
                          cancelText={cancelText}
                          onOpenChange={() =>
                            onchangeMeat(item)
                          }
                        >
                          <div className={visitStyles.close_icon}>
                            <FontAwesomeIcon
                              icon={faArrowsAlt}
                              style={{ size: 8, color: "#a80404" }}
                            />
                          </div>
                        </Popconfirm>
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
                            {SVGICON.meatQueryIcon}
                          </div>
                        ) : null}
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
