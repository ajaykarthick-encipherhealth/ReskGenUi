import React, { useEffect } from "react";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip } from "antd";
import styles from "./styles.module.css";
import { Spinner } from "react-bootstrap";
import {
  faArrowsAlt,
  faSitemap,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { SVGICON } from "../../../../../../jsx/constant/theme";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  getCaptureSectionBackgroundFile,
  getEncounterDateBackground,
  getMeatFound,
  getProviderNameList,
  moveToAnotherAction,
} from "../function/ReusableFunctions";
import { useSelector } from "react-redux";

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
  setIsValidAction
}) => {
  const fileId = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const fileDosPageNumberList = useSelector(
    (state) => state?.ReviewerReducers.dosPageNumberList
  );
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
  return (
    <>
      {list?.map((data, i) => (
        <li key={data?.id}>
          <div className={`hccActiveCard ${visitStyles.hcc_card}`}>
            <div
              className={` justify-content-between ${visitStyles.hcc_card_nameHead}`}
            >
              <div>
                <span className="disease-name d-flex mb-1">
                  <span className="valid-dis-name">{data.diagnosisCode}</span>

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

              <div className="d-flex">
                {data.defaultPosition ==
                "VALID" ? null : data.defaultPosition == "INVALID" ? (
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
                >
                  <Tooltip title="HCC Version Details" placement="bottom">
                    <i className="cr-pointer">{SVGICON.infoIcon}</i>
                  </Tooltip>
                </Popover>
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
                    data.getPlace == "Radio" || data.getPlace == "Lab"
                      ? "Move to Deleted"
                      : okText
                  }
                  cancelText={
                    data.getPlace === "Radio" || data.getPlace === "Lab"
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
                  placement="leftTop"
                  onOpenChange={() => onchangeValid(data.diagnosisCode, data)}
                >
                  <div className={visitStyles.close_icon}>
                    {
                      <FontAwesomeIcon
                        icon={faArrowsAlt}
                        style={{
                          size: 8,
                          color: "#a80404",
                        }}
                      />
                    }
                  </div>
                </Popconfirm>
                {data.isMostSpecific == true && (
                  <div
                    className={visitStyles.close_icon}
                    style={{ background: "#c7f3c6" }}
                    onClick={() => {
                      setOpens(true);
                      setCombiTree([{ ...data, expanded: true }]);
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
            </div>
            <div className="d-flex justify-content-between">
              <div className={`${visitStyles.hoverActiveHcc}`}>
                <div className={`${visitStyles.encounterAndSectionHeader}`}>
                  {getProviderNameList({
                    data: data?.providerName,
                    captureSectionMatching: captureSectionMatching,
                  })}
                </div>
                <div className={`${visitStyles.encounterAndSectionHeader}`}>
                  {getEncounterDateBackground({
                    value: data?.encounterDateSplit,
                    encounterDateMatching: encounterDateMatching,
                    fileDosPageNumberList: fileDosPageNumberList,
                    setIsModalOpenValidCodes:setIsModalOpenValidCodes? setIsModalOpenValidCodes : null,
                    setSearch:setSearch,
                    setFileModalHeader:setFileModalHeader,
                    patientDocumentResult:patientDocumentResult
                  })}
                </div>
                <div className={`${visitStyles.encounterAndSectionHeader}`}>
                  {getCaptureSectionBackgroundFile(
                    data?.capturedSections,
                    data?.encounterDate,
                    data?.actualDescription,
                    data?.diagnosisCode,
                    data?.getPlace,
                    captureSectionMatching,
                    setSearch,
                    setFileLoading,
                    setIsModalOpenLab,
                    setIsModalOpenRadiology,
                    setIsModalOpenValidCodes,
                    setFileModalHeader,
                    fileId,
                    patientDocumentResult
                  )}
                </div>
              </div>
              <div className={`${visitStyles.encounterAndSectionHeader}`}>
                <div className="d-flex justify-content-end mt-2">
                  {data.isCmsHcc && (
                    <div className={`${visitStyles.cmsStatus} mx-1`}>CMS</div>
                  )}
                  {data.isRxHcc && (
                    <div className={`${visitStyles.rxStatus} mx-1`}>RX</div>
                  )}
                </div>
                <div className={`cr-pointer ${styles.meatFoundContainer}`}>
                  <div
                    onClick={() => {
                      setActiveTabHead(4);
                      setActiveMeatTitle({
                        header: "M",
                        diagnosisCode: data?.diagnosisCode,
                      });
                    }}
                  >
                    {getMeatFound(data?.diagnosisCode, meatCriteriaList, "M")}
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
                    {getMeatFound(data?.diagnosisCode, meatCriteriaList, "E")}
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
                    {getMeatFound(data?.diagnosisCode, meatCriteriaList, "A")}
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
                    {getMeatFound(data?.diagnosisCode, meatCriteriaList, "T")}
                  </div>
                </div>
                <div className={`${visitStyles.encounterAndSectionHeader}`}>
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
          </div>
        </li>
      ))}
    </>
  );
};

export default HccCards;
