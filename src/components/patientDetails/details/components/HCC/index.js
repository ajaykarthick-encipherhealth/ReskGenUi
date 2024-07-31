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
const HccCards = ({
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
  getSelectedDosPageNumber,
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
          {list?.length > 0 ? (
            list?.map(
              (
                data,
                i // this condation we added for vignesh suggest to remove isCombo pracent
              ) => (
                <>
                  <li
                    key={data?.id}
                    style={{ margin: i !== 0 && "10px 0 0 0" }}
                  >
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
                                {data?.children?.length > 0 && (
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
                                  setIsValidAction={setIsValidAction}
                                  cardTitle={cardTitle}
                                  setConfirmNotesModalValid={
                                    setConfirmNotesModalValid
                                  }
                                  onchangeValid={onchangeValid}
                                  result={data}
                                  setFileLoading={setFileLoading}
                                  isComboCode={data.isComboCode}
                                />

                                <Popover
                                  placement="left"
                                  title={""}
                                  trigger="click"
                                  overlayStyle={{ zIndex: 1000 }}
                                  open={
                                    openContent === data?.diagnosisCode
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
                                          onClick={() => setOpenContent(null)}
                                          className={styles.closeIcon}
                                        />
                                      </div>

                                      <div className="px-1">
                                        <Popover
                                          onClick={() =>
                                            getValidHccDetails(
                                              data.actualDescription,
                                              data.diagnosisCode
                                            )
                                          }
                                          content={PopContentHccVersion}
                                          title={data.diagnosisCode}
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
                                          data.getPlace == "Radio" ||
                                          data.getPlace == "Lab"
                                            ? "Move to Deleted"
                                            : okText
                                        }
                                        cancelText={
                                          data.getPlace === "Radio" ||
                                          data.getPlace === "Lab"
                                            ? ""
                                            : cancelText
                                        }
                                        onCancel={() =>
                                          moveToAnotherAction(
                                            setConfirmNotesModalValid,
                                            setIsValidAction,
                                            cancelText,
                                            cardTitle
                                          )
                                        }
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
                                          onchangeValid(
                                            data.diagnosisCode,
                                            data
                                          )
                                        }
                                      >
                                        {
                                          <div className="cr-pointer d-flex">
                                            <div
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
                                            <div className="m-1">Actions</div>
                                          </div>
                                        }
                                      </Popconfirm>
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
                                        ENDPOINTS?.isLocalEdit && (
                                          <div
                                            className="d-flex"
                                            onClick={() => {
                                              setOpenEdit(true);
                                              setSelectedData(data);
                                              setInitialValues({
                                                diagnosisCode:
                                                  data?.diagnosisCode,
                                                actualDescription:
                                                  data?.actualDescription,
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faPen}
                                              style={{ margin: "3px 10px 0 0" }}
                                            />
                                            <span style={{ cursor: "pointer" }}>
                                              Edit
                                            </span>
                                          </div>
                                        )}
                                    </>
                                  )}
                                  className={styles.ellipsBtn}
                                >
                                  <div
                                    onClick={() => {
                                      setOpenContent(data?.diagnosisCode);
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
                                  })}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getEncounterDateBackground({
                                    value: data?.encounterDateSplit,
                                    encounterDateMatching:
                                      encounterDateMatching,
                                    fileDosPageNumberList:
                                      fileDosPageNumberList,
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
                                  })}
                                </div>
                                {data.providerName.length == 0 && (
                                  <div
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
                                      isMulitpleHeaderCode:
                                        isMulitpleHeaderCode,

                                      diseaseName: data.dbDescription,
                                      popup: "",
                                      getSelectedDosPageNumber,
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
                                    getSelectedDosPageNumber,
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
                                {data.isRadiology == true && (
                                  <Tooltip title="RADIOLOGY">
                                    <span
                                      className={` mt-2 ${visitStyles.radiologyStatus}`}
                                      bg={`  mt-2 bg-bg-eight `}
                                    >
                                      Radiology
                                    </span>
                                  </Tooltip>
                                )}
                                {data.lab == true && (
                                  <Tooltip title="LAB">
                                    <span
                                      className={` mt-2 ${visitStyles.labStatus}`}
                                      bg={`  mt-2 bg-bg-seven `}
                                    >
                                      Lab
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }}
                    </Draggable>
                  </li>
                </>
              )
            )
          ) : (
            <div className={styles.noMsContainer}>
              {`${cardTitle == "SUGGESTED" ? "CARE GAP" : cardTitle} Codes Not Found`}
            </div>
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
export default enhancer(HccCards);
