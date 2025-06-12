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
} from "@fortawesome/free-solid-svg-icons";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getCaptureSectionBackgroundFile,
  getEncounterDateBackground,
  getMeatFound,
  getProviderNameList,
  moveToAnotherAction,
} from "../function/ReusableFunctions";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import ModelIndex from "../model/Index";
import { getProviderNameTag } from "../function/ProviderHyperlinks";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import CardSkeleton from "../../../../skeleton/card";

const NonHccCards = ({
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
  getSelectedDosPageNumber,
  storeFileDetails,
  patientDetailsResult,
  patientDetailsLoad,
  id,
  isDosSelected,
  patientIdDetailsData,
}) => {
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
  const isDisabled =
    patientIdDetailsData?.data?.response?.workflow?.[0]?.status !== "PENDING" || patientDetailsResult?.data?.response?.workflow?.[0]
    ?.status == "COMPLETED";
  return (
    <>
      {patientDetailsLoad ? (
        <CardSkeleton count={6} />
      ) : (
        list?.map((data, i) => (
          <>
            <li
              id={`${id}-Active-card-${i}`}
              name={`${id}-Active-card-${i}`}
              key={data?.id}
            >
              <div
                id={`${id}-active-card-list-${i}`}
                name={`${id}-active-card-list-${i}`}
                className={`hccActiveCard ${visitStyles.hcc_card}`}
              >
                <div
                  id={`${id}-name-head-${i}`}
                  name={`${id}-name-head-${i}`}
                  className={` justify-content-between ${visitStyles.hcc_card_nameHead}`}
                >
                  <div id={`${id}-disease-name`} name={`${id}-disease-name`}>
                    <span
                      id={`${id}-valid-dis-${i}`}
                      name={`${id}-disease-name`}
                      className="disease-name d-flex mb-1"
                    >
                      <span
                        id={`${id}-diagnosisCode-${i}`}
                        name={`${id}-diagnosisCode-${i}`}
                        className="valid-dis-name"
                      >
                        {data.diagnosisCode}
                      </span>

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
                  <div
                    id={`${id}-Action-${i}`}
                    name={`${id}-Action-${i}`}
                    className="d-flex"
                  >
                    {!isDisabled ? (
                      <Popconfirm
                        title="Choose an action"
                        icon={
                          <QuestionCircleOutlined
                            style={{
                              color: "blue",
                            }}
                          />
                        }
                        okText={okText}
                        cancelText={cancelText}
                        onCancel={() => setConfirmNotesModalValid(false)}
                        okButtonProps={{
                          type: "default",
                        }}
                        cancelButtonProps={{
                          type: "default",
                        }}
                        description={data.diagnosisCode}
                        onConfirm={() =>
                          moveToAnotherAction(
                            setConfirmNotesModalValid,
                            setIsValidAction,
                            okText,
                            cardTitle
                          )
                        }
                        placement="bottom"
                        onOpenChange={() =>
                          onchangeValid(data.diagnosisCode, data)
                        }
                      >
                        {isDosSelected && (
                          <div
                            id={`${id}-close-icon-${i}`}
                            name={`${id}-close-icon-${i}`}
                            className="cr-pointer d-flex"
                          >
                            <div
                              id={`${id}-close-icon-action${i}`}
                              name={`${id}-close-icon-action${i}`}
                              className={visitStyles.close_icon}
                            >
                              <FontAwesomeIcon
                                icon={faArrowsAlt}
                                style={{
                                  size: 8,
                                  color: "#a80404",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Popconfirm>
                    ) : (
                    <>
                    {isDosSelected && (
                          <div
                            id={`${id}-close-icon-${i}`}
                            name={`${id}-close-icon-${i}`}
                            className="cr-pointer d-flex"
                          >
                            <div
                              id={`${id}-close-icon-action${i}`}
                              name={`${id}-close-icon-action${i}`}
                              className={visitStyles.close_icon}
                              style={{
                                cursor: isDisabled ? "not-allowed" : "pointer",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faArrowsAlt}
                                style={{
                                  size: 8,
                                  color: "#a80404",
                                }}
                              />
                            </div>
                          </div>
                        )}</>
                    )}
                  </div>
                </div>
                <div
                  id={`${id}-hoverActiveHcc-${i}`}
                  name={`${id}-hoverActiveHcc-${i}`}
                  className="d-flex justify-content-between"
                >
                  <div
                    id={`${id}-hoverActiveHcc-content-${i}`}
                    name={`${id}-hoverActiveHcc-content-${i}`}
                    className={`${visitStyles.hoverActiveHcc}`}
                  >
                    <div
                      id={`${id}-encounterAndSectionHeader-${i}`}
                      name={`${id}-encounterAndSectionHeader-${i}`}
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
                        setIsMulitpleHeadeCode: setIsMulitpleHeadeCode,
                        isMulitpleHeaderCode: isMulitpleHeaderCode,
                        setSelectMeatResult: "",
                        getSelectedDosPageNumber: getSelectedDosPageNumber,
                        storeFileDetails: storeFileDetails,
                        isShow: data?.isShow,
                      })}
                    </div>
                    <div
                      id={`${id}-encounter-dos-${i}`}
                      name={`${id}-encounter-dos-${i}`}
                      className={`${visitStyles.encounterAndSectionHeader}`}
                    >
                      {getEncounterDateBackground({
                        value: data?.encounterDateSplit,
                        encounterDateMatching: encounterDateMatching,
                        fileDosPageNumberList:
                          patientDetailsResult?.data?.response?.fileDetailDTO
                            ?.dosSummaries,
                        setIsModalOpenValidCodes: setIsModalOpenValidCodes
                          ? setIsModalOpenValidCodes
                          : null,
                        setSearch: setSearch,
                        setFileModalHeader: setFileModalHeader,
                        patientDocumentResult: patientDocumentResult,
                        storeFileDetails: storeFileDetails,
                        getSelectedDosPageNumber: getSelectedDosPageNumber,
                        isShow: data?.isShow,
                      })}
                    </div>
                    <div
                      id={`${id}-capture-file-${i}`}
                      name={`${id}-capture-file-${i}`}
                      className={`${visitStyles.encounterAndSectionHeader}`}
                    >
                      {getCaptureSectionBackgroundFile({
                        value: data?.capturedSections,
                        encounterDate: data?.encounterDate,
                        actualDescription: data?.actualDescription,
                        diagnosisCode: data?.diagnosisCode,
                        documentPlace: data?.getPlace,
                        captureSectionMatching: captureSectionMatching,
                        setSearch: setSearch,
                        setFileLoading: setFileLoading,
                        setIsModalOpenLab: setIsModalOpenLab,
                        setIsModalOpenRadiology: setIsModalOpenRadiology,
                        setIsModalOpenValidCodes: setIsModalOpenValidCodes,
                        setFileModalHeader: setFileModalHeader,

                        patientDocumentResult: patientDocumentResult,
                        fileInitialPage: fileInitialPage,
                        setFileInitialPage: setFileInitialPage,
                        hyperlinks: data?.hyperlinks,
                        encounterDateMatching: encounterDateMatching,
                        setIsMulitpleHeader: setIsMulitpleHeader,
                        isMulitpleHeader: isMulitpleHeader,
                        setIsMulitpleHeadeCode: setIsMulitpleHeadeCode,
                        isMulitpleHeaderCode: isMulitpleHeaderCode,
                        diseaseName: data.dbDescription,
                        popup: "",
                        getSelectedDosPageNumber: getSelectedDosPageNumber,
                        storeFileDetails: storeFileDetails,
                        isShow: data?.isShow,
                      })}
                    </div>
                  </div>
                  <div
                    id={`${id}-cmx-rx-container-${i}`}
                    name={`${id}-cmx-rx-container-${i}`}
                    className={`${visitStyles.encounterAndSectionHeader}`}
                  >
                    <div
                      id={`${id}-cmx-rx-content-${i}`}
                      name={`${id}-cmx-rx-content-${i}`}
                      className="d-flex justify-content-end mt-2"
                    >
                             {/* As of now we command this for 3gen */}
                      {/* {data.isCmsHcc && (
                        <div
                          id={`${id}-cmx-content-${i}`}
                          name={`${id}-cmx-content-${i}`}
                          className={`${visitStyles.cmsStatus} mx-1`}
                        >
                          CMS
                        </div>
                      )} */}
                      {/* {data.isRxHcc && (
                        <div
                          id={`${id}-rx-content-${i}`}
                          name={`${id}-cmx-content-${i}`}
                          className={`${visitStyles.rxStatus} mx-1`}
                        >
                          RX
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </>
        ))
      )}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    patientDetailsLoad: state?.patientDetails?.details?.patientsLoading,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
    patientIdDetailsData: state?.patientDetails.details?.patientIdResult,
  }),
  {
    getSelectedDosPageNumber: detailsActions.getSelectedDosPageNumber,
    storeFileDetails: detailsActions.storeFileIdAction,
  }
);
export default enhancer(NonHccCards);
