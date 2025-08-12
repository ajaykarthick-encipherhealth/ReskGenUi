import React, { useEffect, useState } from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip } from "antd";
import styles from "./styles.module.css";
import {
  faArrowsAlt,
  faSitemap,
  faPen,
  faEllipsisVertical,
  faBook,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getCaptureSectionBackgroundFile,
  getEncounterDateBackground,
  getMeatFound,
  getSuspectTypes,
  moveToAnotherAction,
  reusableEllipseNoTooltip,
} from "../function/ReusableFunctions";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import ModelIndex from "../model/Index";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import MovementAction from "../movementAction";
import { getProviderNameTag } from "../function/ProviderHyperlinks";
import TableRisk from "../../../../tableRisk";
import moment from "moment";
import { getStorage } from "../../../../../utils/storages";
import { isLocalEdit } from "../../../../../utils/config";
import CardSkeleton from "../../../../skeleton/card";
import AiLogo from "../../../../../images/logo/AI.png";
import Image from "next/image";
import { getResponePopup, isStatusDisabled } from "../../../../../utils/reusable";
import { useRouter } from "next/router";

const HccCards = ({
  list,
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
  popup,
  getSelectedDosPageNumber,
  getRadiologyPDFFile,
  getLabPDFFile,
  getCurrentDiseaseType,
  loading,
  isDosSelected,
  labFile,
  radiologyFile,
  radiologyDetailsResult,
  patientDetailsResult,
  setSuggestedMeatForm,
  setSelectCardTitle,
  storeFileDetails,
  year,
  getPatientDetailsData,
  diseaseEdit,
  selectDosValue,
  patientDetailsLoad,
  isSpinnerLoading,
  patientDetailsLoading,
  id,
  getPatientIdData,
  patientIdDetailsData,
  educationalError,
  setEducationalError,
}) => {
  const router = useRouter()
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
  const [labData, setLabData] = useState("");
  const [selectedDos, setSelectedDos] = useState("");
  const [hoveredItem, setHoveredIem] = useState(null);
  // const [truncateLimit, setTruncateLimit] = useState(30);

  // const updateTruncateLimit = useCallback(
  //   debounce(() => {
  //     const width = window.innerWidth;

  //     if (width <= 1060 && width >= 1024) {
  //       setTruncateLimit(10);
  //     } else if (width <= 1090 && width >= 1061) {
  //       setTruncateLimit(12);
  //     } else if (width <= 1200 && width >= 1091) {
  //       setTruncateLimit(15);
  //     } else if (width <= 1275 && width >= 1201) {
  //       setTruncateLimit(18);
  //     } else if (width <= 1375 && width >= 1276) {
  //       setTruncateLimit(20);
  //     } else if (width <= 1475 && width >= 1376) {
  //       setTruncateLimit(23);
  //     } else if (width <= 1575 && width >= 1476) {
  //       setTruncateLimit(25);
  //     } else {
  //       setTruncateLimit(30);
  //     }
  //   }, 200),
  //   []
  // );

  // useEffect(() => {
  //   updateTruncateLimit();
  //   window.addEventListener("resize", updateTruncateLimit);
  //   return () => window.removeEventListener("resize", updateTruncateLimit);
  // }, [updateTruncateLimit]);

  const getPdfEmptyFunction = () => {};
  const getRadiologyPDF =
    radiologyFile?.data?.response &&
    radiologyDetailsResult?.data?.response?.patientId ==
      patientDocumentResult?.patientId
      ? getPdfEmptyFunction
      : getRadiologyPDFFile;
  const getLabPDF =
    labFile?.data?.response && labData == labFile?.data?.response?.fileId
      ? getPdfEmptyFunction
      : getLabPDFFile;

  const PopContentHccVersion = (data) => {
    return (
      // <div className={styles.innerPop}>
      //   <div className={styles.displayDiv}>
      //     {hccVersionDetails ? (
      //       <>
      //         {hccVersionDetails.length != 0 ? (
      //           hccVersionDetails?.map((data) => (
      //             <div className={styles.hoverDiv} key={data?.id}>
      //               <div className={`row ${styles.selectDetailsContainer}`}>
      //                 <div className="col-xl-3">
      //                   <span className={styles.selectHead}>{data.name}</span>
      //                 </div>
      //                 <div className="col-xl-3">
      //                   <span className={styles.selectHead}>{data.value}</span>
      //                 </div>
      //               </div>
      //             </div>
      //           ))
      //         ) : (
      //           <div className={styles.hoverDiv}>
      //             <div className={`row ${styles.selectDetailsContainerNoData}`}>
      //               <div className="col-xl-3 text-center">
      //                 <span className={styles.selectHead}>NO DATA</span>
      //               </div>
      //             </div>
      //           </div>
      //         )}
      //       </>
      //     ) : (
      //       <div className={visitStyles.loadingFileHeader}>
      //         <Spinner />
      //       </div>
      //     )}
      //   </div>
      // </div>
      <div>
        <TableRisk data={data} fromPatientDetails={true} />
      </div>
    );
  };
  const handleCloseModal = () => {
    setOpenEdit(false);
    setOpens(false);
    setInitialValues({
      header: "",
      searchString: "",
      pagenumber: "",
    });
  };

  const userId = getStorage("userId");

  useEffect(() => {
    if (selectedDos && labFile?.data?.response?.dosSummaries) {
      const res = labFile?.data?.response?.dosSummaries.find(
        (item) => item.dos == selectedDos
      );
      setSearch({
        value: moment(selectedDos).format("MM/DD/YYYY"),
        page: res?.startPageNumber,
      });
    }
  }, [selectedDos, labFile?.data?.response?.dosSummaries]);

  const unHideDisease = async (data, action, meatCriteriaList) => {
    const result = meatCriteriaList?.find(
      (res2) =>
        res2?.diagnosisCode?.replace(".", "") ===
        data?.diagnosisCode?.replace(".", "")
    );
    patientDetailsLoad(true);
    const patientId = getStorage("patientId");
    const role = getStorage("userRole");
    const res = await diseaseEdit({
      patientId: patientId,
      ...data,
      isShow: action === "hide" ? false : true,
      chartProcessType: "DATE_OF_SERVICE",
      dateOfServiceIfDosWiseCompute: data?.dateOfServices[0],
      processedYear: year?.value , 
      newDiagnosisCode: data?.diagnosisCode,
      oldDiagnosisCode: data?.diagnosisCode,
      monitorAspect: result?.monitorAspect,
      evaluateAspect: result?.evaluateAspect,
      assessmentAspect: result?.assessmentAspect,
      treatmentAspect: result?.treatmentAspect,
      monitorHyperLink: result?.monitorHyperLink,
      evaluateHyperLink: result?.evaluateHyperLink,
      assessmentHyperLink: result?.assessmentHyperLink,
      treatmentHyperLink: result?.treatmentHyperLink,
    });
    if (res?.status === "SUCCESS") {
      getPatientDetailsData(patientId, null, isDosSelected, "", role);
      getPatientIdData(patientId);
      setOpenContent(false);
      getResponePopup(res);
      patientDetailsLoad(false);
    } else {
      getResponePopup(res);
      patientDetailsLoad(false);
    }
  };
 const isDisabled = isStatusDisabled(patientIdDetailsData, patientDetailsResult, router.pathname);
  return (
    <>
      {provided && (
        <div
          id="hcc-list"
          name="hcc-list"
          ref={provided?.innerRef}
          {...provided?.droppableProps}
        >
          {loading || patientDetailsLoading || isSpinnerLoading ? (
            <div>
              {/* <Spinner /> */}
              <CardSkeleton count={6} height={100} />
            </div>
          ) : list?.length > 0 ? (
            list?.map(
              (
                data,
                i // this condation we added for vignesh suggest to remove isCombo pracent
              ) => (
                <li
                  id={`${id}-hcc-visit-data-card-${i}`}
                  key={data?.id}
                  style={{ margin: i !== 0 && "10px 0 0 0" }}
                >
                  <Draggable
                    key={data.diagnosisCode}
                    draggableId={data.diagnosisCode}
                    index={i}
                    draggableData={data.list}
                    isDragDisabled={
                      isDosSelected && data?.isShow && !isDisabled
                        ? false
                        : true
                    }
                  >
                    {(provided, snapshot) => {
                      // const cmsList = data?.riskAdjustmentDtoList
                      //   ?.map((item) => item?.cmsHcc)
                      //   .filter((cmsHcc) => cmsHcc?.length > 0);
                      // const rxList = data?.riskAdjustmentDtoList
                      //   ?.map((item) => item?.rxHcc)
                      //   .filter((rxHcc) => rxHcc?.length > 0);
                      // const esrdList = data?.riskAdjustmentDtoList
                      //   ?.map((item) => item?.esrd)
                      //   .filter((esrd) => esrd?.length > 0);

                      return (
                        <div
                          id={`${id}-hcc-file-card-${i}`}
                          name={`hcc-file-card-${i}`}
                          className={`hccActiveCard ${visitStyles.hcc_card} ${
                            snapshot?.isDragging &&
                            visitStyles.drag_and_drop_movement_bg
                          } ${!data?.isShow && visitStyles.isSHowHccBlurHcc}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onMouseOver={() =>
                            !data?.isShow && setHoveredIem(data?.diagnosisCode)
                          }
                          onMouseLeave={() =>
                            !data?.isShow && setHoveredIem(null)
                          }
                        >
                          <Popover
                            open={
                              !data?.isShow &&
                              isDosSelected &&
                              hoveredItem == data?.diagnosisCode
                                ? true
                                : false
                            }
                            placement="center"
                            trigger={["hover", "focus"]}
                            content={
                              !isDisabled ? (
                                <Popconfirm
                                  title="Are you sure want to unhide the disease?"
                                  onConfirm={() =>
                                    unHideDisease(
                                      data,
                                      "show",
                                      meatCriteriaList
                                    )
                                  }
                                >
                                  <div
                                    className="w-100 d-flex justify-content-center align-items-center cursor-pointer"
                                    // onClick={() => unHideDisease(data)}
                                  >
                                    <span
                                      className="px-2"
                                      style={{
                                        width: "50px",
                                        color: "#d9d9d9",
                                      }}
                                    >
                                      {"Show"}
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faEyeSlash}
                                      style={{ color: "#d9d9d9" }}
                                    />
                                  </div>
                                </Popconfirm>
                              ) : (
                                <>
                                  <div
                                    className="w-100 d-flex justify-content-center align-items-center "
                                    style={{
                                      cursor: isDisabled
                                        ? "not-allowed"
                                        : "pointer",
                                    }}
                                  >
                                    <span
                                      className="px-2"
                                      style={{
                                        width: "50px",
                                        color: "#d9d9d9",
                                      }}
                                    >
                                      {"Show"}
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faEyeSlash}
                                      style={{ color: "#d9d9d9" }}
                                    />
                                  </div>
                                </>
                              )
                            }
                          >
                            <div
                              id={`${id}-hcc-name-Card-${i}`}
                              name={`hcc-name-Card-${i}`}
                              className={` justify-content-between mt-2 ${visitStyles.hcc_card_nameHead}`}
                            >
                              <div
                                className="d-flex"
                                id={`${id}-hcc-disease-name-${i}`}
                                name={`hcc-disease-name-${i}`}
                              >
                                <span className=" d-flex disease-name mb-1">
                                  <span className="valid-dis-name">
                                    {data.diagnosisCode}
                                  </span>
                                  {!isDeletedCodes &&
                                    isDosSelected &&
                                    data?.isLab !== true &&
                                    data?.isRadiology !== true &&
                                    ((data.ruleType ===
                                      "DIRECT_COMBINATION_RULE_ENGINE" &&
                                      data.stateIndicators?.includes(
                                        "COMBO_CODE"
                                      )) ||
                                      !data.stateIndicators?.includes(
                                        "COMBO_CODE"
                                      )) && (
                                      <FontAwesomeIcon
                                        icon={faPen}
                                        style={{
                                          cursor: isDisabled
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                        onClick={() => {
                                          if (isDisabled) return;
                                          if (data?.isShow) {
                                            setFormValues(data);
                                            setIsEditHccForm(true);
                                            setFormEditPlace(editFormPlace);
                                          }
                                        }}
                                      />
                                    )}
                                </span>
                              </div>
                              {/* {data.defaultPosition} */}
                              <div
                                className="d-flex"
                                id={`${id}-hcc-info-${i}`}
                                name={`hcc-info-${i}`}
                              >
                                {data?.reason && cardTitle == "POTENTIAL" && (
                                  <Popover
                                    content={
                                      <>
                                        <div
                                          style={{
                                            maxWidth: "400px",
                                            overflowY: "auto",
                                          }}
                                        >
                                          {data?.reason || ""}
                                        </div>
                                      </>
                                    }
                                  >
                                    <Image
                                      src={AiLogo}
                                      alt="ai-log"
                                      width="20"
                                      className="mx-1"
                                      id="hcc-ai-icon"
                                      name="hcc-ai-icon"
                                    />
                                  </Popover>
                                )}
                                {data.suspectType.length != 0 && (
                                  <>
                                    {" "}
                                    {getSuspectTypes(
                                      data.diagnosisCode,
                                      data.suspectType,
                                      data?.isShow
                                    )}
                                  </>
                                )}
                                {data?.children?.length > 0 && (
                                  <div
                                    id="hcc-tree-icon"
                                    name="hcc-tree-icon"
                                    className={visitStyles.tree_icon}
                                    // style={{
                                    //   cursor: isDisabled
                                    //     ? "not-allowed"
                                    //     : "pointer",
                                    //   background: "#c7f3c6",
                                    // }}
                                    onClick={() => {
                                      // if (isDisabled) return;
                                      if (data?.isShow) {
                                        setOpens(true);
                                        setCombiTree([
                                          {
                                            ...data,
                                            expanded: true,
                                            isDisabled: true,
                                          },
                                        ]);
                                      }
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

                                {/* <div>
                                <FontAwesomeIcon
                                  icon={faCircle}
                                  className={styles.suspectCircle}
                                 />
                              </div> */}
                                {cardTitle == "SUGGESTED" ||
                                cardTitle == "DELETED" ||
                                cardTitle == "POTENTIAL" ? (
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
                                    ) : data.defaultPosition == "POTENTIAL" ? (
                                      <span
                                        className={`${visitStyles.potentialFlag} ${visitStyles.flagDetailsChange}`}
                                      ></span>
                                    ) : null}
                                  </>
                                ) : null}
                                {isDosSelected && (
                                  <MovementAction
                                    validAction={
                                      cardTitle == "HCC" ? false : true
                                    }
                                    suggestedAction={
                                      cardTitle == "SUGGESTED" ? false : true
                                    }
                                    deleteAction={
                                      cardTitle == "DELETED" ? false : true
                                    }
                                    potentialAction={
                                      cardTitle == "POTENTIAL" ? false : true
                                    }
                                    setIsValidAction={setIsValidAction}
                                    cardTitle={cardTitle}
                                    setConfirmNotesModalValid={
                                      setConfirmNotesModalValid
                                    }
                                    onchangeValid={onchangeValid}
                                    result={data}
                                    setFileLoading={setFileLoading}
                                    isComboCode={
                                      data.isComboCode &&
                                      data.ruleType !=
                                        "DIRECT_COMBINATION_RULE_ENGINE"
                                    }
                                    setSuggestedMeatForm={setSuggestedMeatForm}
                                    meatCriteriaList={meatCriteriaList}
                                    setSelectCardTitle={setSelectCardTitle}
                                    isShow={data?.isShow}
                                    educationalError={educationalError}
                                    setEducationalError={setEducationalError}
                                  />
                                )}
                                <Popover
                                  placement="bottom"
                                  title={""}
                                  trigger="click"
                                  overlayStyle={{ zIndex: 1000 }}
                                  open={
                                    openContent === data?.diagnosisCode &&
                                    data?.isShow
                                      ? true
                                      : false
                                  }
                                  onVisibleChange={(visible) =>
                                    setOpenContent(
                                      visible ? data?.diagnosisCode : null
                                    )
                                  }
                                  content={() => (
                                    <>
                                      <div className={styles.closeContainer2}>
                                        <CloseOutlined
                                          onClick={() => {
                                            if (data?.isShow) {
                                              setOpenContent(null);
                                            }
                                          }}
                                          className={styles.closeIcon}
                                        />
                                      </div>

                                      <div
                                        className="px-1 patientDetailsPop"
                                        id="hcc-info-popover"
                                        name="hcc-info-popover"
                                      >
                                        <Popover
                                          onClick={() => {
                                            if (data?.isShow) {
                                              getValidHccDetails(
                                                data.actualDescription,
                                                data.diagnosisCode
                                              );
                                            }
                                          }}
                                          content={
                                            data?.isShow &&
                                            PopContentHccVersion(
                                              data?.riskAdjustmentDtoList
                                            )
                                          }
                                          title={data?.diagnosisCode}
                                          placement="bottom"
                                          trigger="click"
                                          overlayStyle={{ zIndex: 1000 }}
                                        >
                                          {/* <Tooltip title="HCC Version Details" placement="bottom"> */}
                                          <div className="cr-pointer">
                                            <i className="cr-pointer">
                                              {SVGICON.infoIcon}
                                            </i>
                                            <span className="px-1">
                                              HCC Version Details
                                            </span>
                                          </div>
                                          {/* </Tooltip> */}
                                        </Popover>
                                      </div>
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
                                          okText={
                                            (data?.isShow &&
                                              data.getPlace == "Radio") ||
                                            (data?.isShow &&
                                              data.getPlace == "Lab")
                                              ? "Move to Deleted"
                                              : data?.isShow && okText
                                          }
                                          cancelText={
                                            (data?.isShow &&
                                              data.getPlace === "Radio") ||
                                            (data?.isShow &&
                                              data.getPlace === "Lab")
                                              ? ""
                                              : data?.isShow && cancelText
                                          }
                                          onCancel={() => {
                                            if (data?.isShow) {
                                              moveToAnotherAction(
                                                setConfirmNotesModalValid,
                                                setIsValidAction,
                                                cancelText,
                                                cardTitle
                                              );
                                            }
                                          }}
                                          okButtonProps={{
                                            type: "default",
                                          }}
                                          cancelButtonProps={{
                                            type: "default",
                                          }}
                                          description={data.diagnosisCode}
                                          onConfirm={() => {
                                            if (data?.isShow) {
                                              moveToAnotherAction(
                                                setConfirmNotesModalValid,
                                                setIsValidAction,
                                                okText,
                                                cardTitle
                                              );
                                            }
                                          }}
                                          placement="bottom"
                                          onOpenChange={() => {
                                            if (data?.isShow) {
                                              onchangeValid(
                                                data.diagnosisCode,
                                                data
                                              );
                                            }
                                          }}
                                        >
                                          {/* {isDosSelected && (
                                            <div className="cr-pointer d-flex">
                                              <div
                                                className={
                                                  visitStyles.close_icon
                                                }
                                              >
                                                <FontAwesomeIcon
                                                  icon={faArrowsAlt}
                                                  style={{
                                                    size: 8,
                                                    color: "#a80404",
                                                  }}
                                                />
                                              </div>
                                              <div className="m-1">Actions</div>
                                            </div>
                                          )} */}
                                        </Popconfirm>
                                      ) : (
                                        <div>
                                          {isDosSelected && (
                                            <div className="cr-pointer d-flex">
                                              <div
                                                style={{
                                                  cursor: isDisabled
                                                    ? "not-allowed"
                                                    : "pointer",
                                                }}
                                                className={
                                                  visitStyles.close_icon
                                                }
                                              >
                                                <FontAwesomeIcon
                                                  icon={faArrowsAlt}
                                                  style={{
                                                    size: 8,
                                                    color: "#a80404",
                                                  }}
                                                />
                                              </div>
                                              <div className="m-1">Actions</div>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* {data.isMostSpecific == true && (
                                    <div className="cr-pointer d-flex">
                                      <div
                                        className={visitStyles.close_icon}
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
                                      <div className="px-2 mt-1">
                                        Combo Tree View
                                      </div>
                                    </div>
                                  )} */}
                                      {data.notes && (
                                        <div className="cr-pointer px-1 mr-1">
                                          <Popover
                                            content={() => <p>{data.notes}</p>}
                                            title={data.diagnosisCode}
                                            placement="bottom"
                                            trigger="click"
                                            overlayStyle={{ zIndex: 1000 }}
                                          >
                                            {/* <Tooltip title="HCC Version Details" placement="bottom"> */}
                                            <div className="cr-pointer">
                                              <FontAwesomeIcon
                                                icon={faBook}
                                                style={{
                                                  size: 8,
                                                  color: "#195cf5b5",
                                                }}
                                              />
                                              <span className="px-1 mx-1">
                                                Notes
                                              </span>
                                            </div>
                                            {/* </Tooltip> */}
                                          </Popover>
                                        </div>
                                      )}
                                      {/* edit Option */}
                                      {isVisitData &&
                                        isDosSelected &&
                                        isLocalEdit && (
                                          <div
                                            className="d-flex"
                                            onClick={() => {
                                              if (data?.isShow) {
                                                setOpenEdit(true);
                                                setSelectedData(data);
                                                setInitialValues({
                                                  diagnosisCode:
                                                    data?.diagnosisCode,
                                                  actualDescription:
                                                    data?.actualDescription,
                                                });
                                              }
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faPen}
                                              style={{
                                                margin: "3px 10px 0 0",
                                              }}
                                            />
                                            <span style={{ cursor: "pointer" }}>
                                              Edit
                                            </span>
                                          </div>
                                        )}
                                      {data?.isShow && isDosSelected && (
                                        <>
                                          {isDisabled ? (
                                            <div
                                              style={{
                                                cursor: isDisabled
                                                  ? "not-allowed"
                                                  : "pointer",
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faEyeSlash}
                                                className="px-1"
                                              />
                                              Hide Disease
                                            </div>
                                          ) : (
                                            <Popconfirm
                                              title="Are you sure want to hide disease?"
                                              onConfirm={() =>
                                                unHideDisease(
                                                  data,
                                                  "hide",
                                                  meatCriteriaList
                                                )
                                              }
                                            >
                                              <div className="cursor-pointer">
                                                <FontAwesomeIcon
                                                  icon={faEyeSlash}
                                                  className="px-1"
                                                />
                                                Hide Disease
                                              </div>
                                            </Popconfirm>
                                          )}
                                        </>
                                      )}
                                    </>
                                  )}
                                  className={styles.ellipsBtn}
                                >
                                  <div
                                    onClick={() => {
                                      if (data?.isShow) {
                                        setOpenContent(data?.diagnosisCode);
                                      }
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faEllipsisVertical}
                                      style={{
                                        size: 8,
                                        color: "#000",
                                      }}
                                    />
                                  </div>
                                </Popover>
                              </div>
                            </div>
                            <div className="m-1">
                              <Popover
                                content={
                                  data?.isShow && (
                                    <div className="patientDetailsDescPopSTyle">
                                      {data.dbDescription
                                        ? data.dbDescription
                                        : data.actualDescription}
                                    </div>
                                  )
                                }
                                // title=""
                                trigger="hover"
                                overlayStyle={{ zIndex: 1000 }}
                                placement="topLeft"
                                maxHeight={100}
                              >
                                <>
                                  <span className="cr-pointer font2">
                                    {reusableEllipseNoTooltip({
                                      str: data.dbDescription
                                        ? data.dbDescription
                                        : data.actualDescription ||
                                          "--".toString(),
                                      count: 45,
                                    })}
                                  </span>
                                </>
                              </Popover>
                            </div>
                            <div
                              id={`${id}-hcc-hoverActiveHcc-${i}`}
                              name={`hcc-hoverActiveHcc-${i}`}
                              className="d-flex justify-content-between"
                            >
                              <div
                                id={`${id}-hcc-hoverActiveHcc-content-${i}`}
                                name={`hcc-hoverActiveHcc-content-${i}`}
                                className={`${visitStyles.hoverActiveHcc}`}
                              >
                                <div
                                  id={`${id}-hcc-encounterAndSectionHeader-${i}`}
                                  name={`hcc-encounterAndSectionHeader-${i}`}
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
                                    patientDocumentResult:
                                      patientDocumentResult,
                                    setIsMulitpleHeader: setIsMulitpleProvider,
                                    isMulitpleHeader: isMulitpleProvider,
                                    setIsMulitpleHeadeCode:
                                      setIsMulitpleHeadeCode,
                                    isMulitpleHeaderCode: isMulitpleHeaderCode,
                                    setSelectMeatResult: "",
                                    getSelectedDosPageNumber:
                                      getSelectedDosPageNumber,
                                    getRadiologyPDF,
                                    getLabPDF,
                                    getCurrentDiseaseType,
                                    setLabData,
                                    storeFileDetails: storeFileDetails,
                                    isShow: data?.isShow,
                                  })}
                                </div>
                                <div
                                  id={`${id}-encounterAndSectionHeader-data-${i}`}
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getEncounterDateBackground({
                                    value: data?.encounterDateSplit,
                                    encounterDateMatching:
                                      encounterDateMatching,
                                    fileDosPageNumberList:
                                      patientDetailsResult?.data?.response
                                        ?.fileDetailDTO?.dosSummaries,
                                    setIsModalOpenValidCodes:
                                      setIsModalOpenValidCodes
                                        ? setIsModalOpenValidCodes
                                        : null,
                                    setSearch: setSearch,
                                    setFileModalHeader: setFileModalHeader,
                                    patientDocumentResult:
                                      patientDocumentResult,
                                    popup,
                                    getSelectedDosPageNumber:
                                      getSelectedDosPageNumber,
                                    getRadiologyPDF,
                                    getLabPDF,
                                    getCurrentDiseaseType,
                                    hyperlinks: data?.hyperlinks,
                                    setSelectedDos,
                                    setLabData,
                                    storeFileDetails: storeFileDetails,
                                    isShow: data?.isShow,
                                    getEncounterDateBackground:
                                      getEncounterDateBackground,
                                  })}
                                </div>
                                {data.providerName.length == 0 && (
                                  <div
                                    id={`${id}-hcc-captureSection-${i}`}
                                    className={`${visitStyles.encounterAndSectionHeader}`}
                                  >
                                    {getCaptureSectionBackgroundFile({
                                      value: data?.capturedSections,
                                      encounterDate: data?.encounterDate,
                                      actualDescription:
                                        data?.actualDescription,
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
                                      isMulitpleHeaderCode:
                                        isMulitpleHeaderCode,

                                      diseaseName: data.dbDescription,
                                      popup: "",
                                      getSelectedDosPageNumber:
                                        getSelectedDosPageNumber,
                                      getRadiologyPDF: getRadiologyPDF,
                                      getLabPDF: getLabPDF,
                                      getCurrentDiseaseType:
                                        getCurrentDiseaseType,
                                      getSelectedDosPageNumber:
                                        getSelectedDosPageNumber,
                                      setLabData: setLabData,
                                      storeFileDetails: storeFileDetails,
                                      isShow: data?.isShow,
                                    })}
                                  </div>
                                )}
                              </div>
                              <div
                                id={`${id}-hcc-right-${i}`}
                                name={`hcc-right-${i}`}
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                <div
                                  id={`${id}-hcc-cmx-rx-container-${i}`}
                                  name={`hcc-cmx-rx-container-${i}`}
                                  className="d-flex justify-content-end mt-2 me-1 gap-1 text-center flex-wrap"
                                >
                                  {/* As of now we command this for 3gen  */}
                                  {/* {data?.riskAdjustmentDtoList?.some((item) =>
                                    item?.cmsHcc?.some((hcc) => hcc.value > 1)
                                  ) && (
                                    <div
                                      id={`${id}-hcc-cmx-${i}`}
                                      name={`hcc-cmx-${i}`}
                                      className={`${visitStyles.cmsStatus} `}
                                    >
                                      CMS
                                    </div>
                                  )} */}

                                  {/* As of now we command this for 3gen */}

                                  {/* {data?.riskAdjustmentDtoList?.some((item) =>
                                    item?.rxHcc?.some((hcc) => hcc.value > 1)
                                  ) &&
                                    userId !=
                                      "reviewer@3gencogentai.onmicrosoft.com" && (
                                      <div
                                        id={`${id}-hcc-rx-${i}`}
                                        name={`hcc-rx-${i}`}
                                        className={`${visitStyles.rxStatus}`}
                                      >
                                        RX
                                      </div>
                                    )} */}
                                </div>
                                {!data.isLab && !data.isRadiology && (
                                  <div
                                    id={`${id}-meatFoundContainer-${i}`}
                                    name={`meatFoundContainer-${i}`}
                                    className={`${styles.meatFoundContainer}`}
                                  >
                                    <div
                                      className="cr-pointer "
                                      id={`${id}-meatFound-M-${i}`}
                                      onClick={() => {
                                        if (data?.isShow) {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "M",
                                            diagnosisCode: data?.diagnosisCode,
                                          });
                                        }
                                      }}
                                    >
                                      {getMeatFound(
                                        data?.diagnosisCode,
                                        meatCriteriaList,
                                        "M"
                                      )}
                                    </div>
                                    <div
                                      id={`${id}-meatFound-E-${i}`}
                                      className="cr-pointer "
                                      onClick={() => {
                                        if (data?.isShow) {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "E",
                                            diagnosisCode: data?.diagnosisCode,
                                          });
                                        }
                                      }}
                                    >
                                      {getMeatFound(
                                        data?.diagnosisCode,
                                        meatCriteriaList,
                                        "E"
                                      )}
                                    </div>
                                    <div
                                      id={`${id}-meatFound-A-${i}`}
                                      className="cr-pointer "
                                      onClick={() => {
                                        if (data?.isShow) {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "A",
                                            diagnosisCode: data?.diagnosisCode,
                                          });
                                        }
                                      }}
                                    >
                                      {getMeatFound(
                                        data?.diagnosisCode,
                                        meatCriteriaList,
                                        "A"
                                      )}
                                    </div>
                                    <div
                                      id={`${id}-meatFound-T-${i}`}
                                      className="cr-pointer "
                                      onClick={() => {
                                        if (data?.isShow) {
                                          setActiveTabHead(4);
                                          setActiveMeatTitle({
                                            header: "T",
                                            diagnosisCode: data?.diagnosisCode,
                                          });
                                        }
                                      }}
                                    >
                                      {getMeatFound(
                                        data?.diagnosisCode,
                                        meatCriteriaList,
                                        "T"
                                      )}
                                    </div>
                                  </div>
                                )}
                                {data.providerName.length == 0 && (
                                  <>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {data.isManuallyAdded ? (
                                        <Badge
                                          className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                        >
                                          Manually Added
                                        </Badge>
                                      ) : null}
                                    </div>

                                    {data.isComboCode ? (
                                      <Badge
                                        className={`mt-2 text-start  ${visitStyles.isComboCode}`}
                                        onClick={() => {
                                          if (data?.isShow) {
                                            setActiveTabHead(3);
                                            setActiveComboTree({
                                              diagnosisCode:
                                                data?.diagnosisCode,
                                            });
                                          }
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
                                    bg={`mt-2 bg-bg-eight `}
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
                              <div className="d-flex flex-wrap p-1 justify-content-between">
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
                                    getSelectedDosPageNumber:
                                      getSelectedDosPageNumber,
                                    getLabPDF: getLabPDF,
                                    getRadiologyPDF: getRadiologyPDF,
                                    getCurrentDiseaseType:
                                      getCurrentDiseaseType,
                                    getSelectedDosPageNumber:
                                      getSelectedDosPageNumber,
                                    setLabData: setLabData,
                                    storeFileDetails: storeFileDetails,
                                    isShow: data?.isShow,
                                  })}
                                </div>

                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {data.isManuallyAdded ? (
                                    <Badge
                                      className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                    >
                                      Manually Added
                                    </Badge>
                                  ) : null}

                                  {data.isComboCode ? (
                                    <Badge
                                      className={`mt-2 text-start  ${visitStyles.isComboCode}`}
                                      onClick={() => {
                                        if (data?.isShow) {
                                          setActiveTabHead(3);
                                          setActiveComboTree({
                                            diagnosisCode: data?.diagnosisCode,
                                          });
                                        }
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
                                  {data.isRadiology && (
                                    <Tooltip title="RADIOLOGY">
                                      <span
                                        className={` mt-2 ${visitStyles.radiologyStatus}`}
                                        bg={`  mt-2 bg-bg-eight `}
                                      >
                                        Radiology
                                      </span>
                                    </Tooltip>
                                  )}
                                  {data?.stateIndicators?.includes(
                                    "CONFLICT_CONDITION"
                                  ) && (
                                    <Tooltip title="CONFLICT CONDITION">
                                      <span
                                        className={` mt-2 ${visitStyles.radiologyStatus}`}
                                        bg={`  mt-2 bg-bg-eight `}
                                      >
                                        Conflict
                                      </span>
                                    </Tooltip>
                                  )}
                                  {data?.stateIndicators?.includes(
                                    "EDITED"
                                  ) && (
                                    <Tooltip title="EDITED">
                                      <span
                                        className={` mt-2 ${visitStyles.radiologyStatus}`}
                                        bg={`  mt-2 bg-bg-eight `}
                                      >
                                        Edited
                                      </span>
                                    </Tooltip>
                                  )}
                                  {data.isLab && (
                                    <Tooltip title="LAB">
                                      <span
                                        className={` mt-2 ${visitStyles.labStatus}`}
                                        bg={`  mt-2 bg-bg-seven `}
                                      >
                                        Lab
                                      </span>
                                    </Tooltip>
                                  )}
                                  {data?.stateIndicators?.includes(
                                    "CRITICAL_CONDITION"
                                  ) && (
                                    <Badge
                                      className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}
                                    >
                                      Critical
                                    </Badge>
                                  )}
                                  {data?.stateIndicators?.includes(
                                    "STATUS_CODE"
                                  ) && (
                                    <Badge
                                      className={`mt-2 text-start  ${visitStyles.statusCode}`}
                                    >
                                      Status Code
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            {!data.isLab && !data.isRadiology && (
                              <div className={`${styles.meatContainer}`}>
                                <div
                                  className="cr-pointer "
                                  onClick={() => {
                                    if (data?.isShow) {
                                      setActiveTabHead(4);
                                      setActiveMeatTitle({
                                        header: "M",
                                        diagnosisCode: data?.diagnosisCode,
                                      });
                                    }
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "M"
                                  )}
                                </div>
                                <div
                                  className="cr-pointer "
                                  onClick={() => {
                                    if (data?.isShow) {
                                      setActiveTabHead(4);
                                      setActiveMeatTitle({
                                        header: "E",
                                        diagnosisCode: data?.diagnosisCode,
                                      });
                                    }
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "E"
                                  )}
                                </div>
                                <div
                                  className="cr-pointer "
                                  onClick={() => {
                                    if (data?.isShow) {
                                      setActiveTabHead(4);
                                      setActiveMeatTitle({
                                        header: "A",
                                        diagnosisCode: data?.diagnosisCode,
                                      });
                                    }
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "A"
                                  )}
                                </div>
                                <div
                                  className="cr-pointer "
                                  onClick={() => {
                                    if (data?.isShow) {
                                      setActiveTabHead(4);
                                      setActiveMeatTitle({
                                        header: "T",
                                        diagnosisCode: data?.diagnosisCode,
                                      });
                                    }
                                  }}
                                >
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "T"
                                  )}
                                </div>
                              </div>
                            )}
                          </Popover>
                        </div>
                      );
                    }}
                  </Draggable>
                </li>
              )
            )
          ) : (
            <div className={styles.noMsContainer}>
              {`${
                cardTitle == "SUGGESTED"
                  ? "CARE GAP"
                  : cardTitle == "POTENTIAL"
                  ? "POTENTIAL / SUGGESTED "
                  : cardTitle
              } Codes Not Found`}
            </div>
          )}
          <span className="d-none">{provided?.placeholder}</span>
        </div>
      )}

      <ModelIndex
        title={"Edit"}
        openState={openEdit}
        handleCloseModal={handleCloseModal}
        isEdit={isLocalEdit}
        setOpenEdit={setOpenEdit}
        initialValues={initialValues}
        setInitialValues={setInitialValues}
        setOpenContent={setOpenContent}
        selectedData={selectedData}
        year={year}
      />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    loading: state?.patientDetails?.details?.loading,
    patientDetailsLoading: state?.patientDetails?.details?.patientsLoading,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
    radiologyFile: state?.patientDetails?.details?.radiologyFileResult,
    labFile: state?.patientDetails?.details?.labPDFDetails,
    labDetailsResult: state?.patientDetails?.details?.labResult,
    radiologyDetailsResult: state?.patientDetails?.details?.radiologyResult,
    patientIdDetailsData: state?.patientDetails.details?.patientIdResult,
  }),
  {
    getSelectedDosPageNumber: detailsActions.getSelectedDosPageNumber,
    getLabPDFFile: detailsActions.labPDFDetails,
    getRadiologyPDFFile: detailsActions.radiologyDetailsAction,
    getCurrentDiseaseType: detailsActions.getCurrentDiseaseType,
    storeFileDetails: detailsActions.storeFileIdAction,
    getPatientDetailsData: detailsActions.patientDetailsAction,
    diseaseEdit: detailsActions.diseaseEdit,
    patientDetailsLoad: detailsActions.patientDetailsLoad,
    getPatientIdData: detailsActions.patientIdDetailsAction,
  }
);
export default enhancer(HccCards);
