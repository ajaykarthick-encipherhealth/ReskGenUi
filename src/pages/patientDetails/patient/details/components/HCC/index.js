import React from "react";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip } from "antd";
import styles from "./styles.module.css";
import { Spinner } from "react-bootstrap";
import {
  faClose,
  faArrowLeft,
  faPlus,
  faArrowsAlt,
  faSitemap,
  faAngleDown,
  faCircleUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { SVGICON } from "../../../../../../jsx/constant/theme";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";

const HccCards = ({
  list,
  hccVersionDetails,
  captureSectionMatching,
  encounterDateMatching,
  meatCriteriaList,
  getEncounterDetails,
  findValueDocument,
  onchangeValid,
  setConfirmNotesModalValid,
  setIsValidAction,
  getValidHccDetails,
  setFormValues,
  setIsEditHccForm,
  setFormEditPlace,
}) => {
  const getEncounterDateBackground = (value) => {
    return value?.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = res ? (
        <span
          onClick={() => getEncounterDetails(res)}
          className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res).format("MMM DD")}
        </span>
      ) : (
        ""
      );
      return sectionMapArr;
    });
  };
  const getCaptureSectionBackgroundFile = (
    value,
    encounterDate,
    actualDescription,
    diagnosisCode
  ) => {
    // getSectionTagColor(value);
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;
      var sectionMapArr = (
        <span
          onClick={() =>
            findValueDocument(
              disCode,
              res,
              headerNames,
              encounterDate,
              actualDescription,
              diagnosisCode
            )
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getMeatFound = (code, data, value) => {
    const result = data?.filter(
      (res2) => res2?.diagnosisCode?.replace(".", "") == code?.replace(".", "")
    );
    var backColor = "#f93d3d";
    var meatTitle = "MEAT";
    if (result?.length != 0) {
      switch (value) {
        case "M":
          if (result[0]?.monitor) {
            backColor = "#15b315";
          }
          meatTitle = "Monitor";
          break;
        case "E":
          if (result[0]?.evaluate) {
            backColor = "#15b315";
          }
          meatTitle = "Evaluate";
          break;
        case "A":
          if (result[0]?.assessment) {
            backColor = "#15b315";
          }
          meatTitle = "Assessment";
          break;
        case "T":
          if (result[0]?.treatment) {
            backColor = "#15b315";
          }
          meatTitle = "Treatment";
          break;
        default:
          null;
      }
    }
    // var badgeMap = (
    //   <span
    //     style={{ backgroundColor: backColor, color: "white" }}
    //     className={`mt-2 ${styles.badgeMeat}`}
    //   >
    //     {value}
    //   </span>
    // );
    return (
      <Tooltip title={meatTitle} placement="bottom">
        <span
          style={{ backgroundColor: backColor, color: "white" }}
          className={`mt-2 ${styles.badgeMeat}`}
        >
          {value}
        </span>
      </Tooltip>
    );
  };

  const PopContentHccVersion = (
    <div className={styles.innerPop}>
      <div className={styles.displayDiv}>
        {hccVersionDetails ? (
          <>
            {hccVersionDetails.length != 0 ? (
              hccVersionDetails?.map((data) => (
                <div className={styles.hoverDiv}>
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

  function removeDuplicates(array) {
    let output = [];
    if (array) {
      for (let item of array) {
        if (!output.includes(item)) output.push(item);
      }
    }

    return output;
  }

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor =
        result[0]?.backgroundColor == "#efeff033"
          ? "#54548d33"
          : result[0]?.backgroundColor;
      var textColor =
        result[0]?.sectionColor == "#efeff0" ? "#000" : result[0]?.sectionColor;
      var value = ["09/19/2023"];
      var sectionMapArr = (
        <span
          className={`mt-2 text-start ${visitStyles.provider_name}`}
          style={{ backgroundColor: backColor, color: textColor }}
        >
          <i>
            {" "}
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{
                size: 10,
                color: textColor,
              }}
            />
          </i>
          {res}
        </span>
        // </Popover>
      );
      return sectionMapArr;
    });
  };

  const confirmvalid = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("validToDeleted")
        )
      );
    });

  const validToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("validToSuggested")
        )
      );
    });

  return (
    <>
      {list?.map((data, i) => (
        <li>
          <div className={`hccActiveCard ${visitStyles.hcc_card}`}>
            <div
              className={` justify-content-between ${visitStyles.hcc_card_nameHead}`}
            >
              <div>
                <span className="disease-name d-flex mb-1">
                  <span className="valid-dis-name">{data.diagnosisCode}</span>
                  {/* removed reason for demo */}
                  {/* <span className="">
                                <Popover
                                  content={updateCode(data)}
                                  title=""
                                  trigger="click"
                                >
                                  <FontAwesomeIcon icon={faPen} />
                                </Popover>
                              </span> */}
                  <FontAwesomeIcon
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFormValues(data),
                        setIsEditHccForm(true),
                        setFormEditPlace("VALID_DISEASE");
                    }}
                  />

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
                  okText="Move to Deleted"
                  cancelText="Move to Suggested"
                  onCancel={validToSuggested}
                  okButtonProps={{
                    type: "default",
                  }}
                  cancelButtonProps={{
                    type: "default",
                  }}
                  description={data.diagnosisCode}
                  onConfirm={confirmvalid}
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
                  {getProviderNameList(data?.providerName)}
                </div>
                <div className={`${visitStyles.encounterAndSectionHeader}`}>
                  {getEncounterDateBackground(data.encounterDateSplit)}
                </div>

                <div className={`${visitStyles.encounterAndSectionHeader}`}>
                  {getCaptureSectionBackgroundFile(
                    data?.capturedSections,
                    data?.encounterDate,
                    data?.actualDescription,
                    data?.diagnosisCode,
                    data?.dbDescription
                  )}
                </div>
                {/* {data?.isMostSpecific == true ? (
                                        <div
                                          className={`${visitStyles.encounterAndSectionHeader}`}
                                        >
                                          <span
                                            className={`mt-2 text-start cr-pointer ${styles.mostSpecificTag}`}
                                          >
                                            IsMostSpecific
                                          </span>
                                        </div>
                                      ) : null} */}
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
