import { Popover, Tooltip } from "antd";
import React from "react";
import visitStyles from "../../../styles/visitdata.module.css";
import styles from "./styles.module.css";
import { getMeatFound } from "../../reviewer/patients/details/hcc";

const CogentAIResult = ({
  validClienHccList,
  getCaptureSectionBackground,
  getEncounterDateBackgroundHcc,
  getProviderNameList,
  cogentSuggestedHccList,
  comparisonData,
}) => {
  const meatCriteriaYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.cogentAIResult?.meatCriteria)
    : "";
  const meatCriteriaList =
    comparisonData?.data?.cogentAIResult?.meatCriteria[meatCriteriaYear];
  const ProviderName =
    comparisonData?.data?.cogentAIResult?.provider[meatCriteriaYear];

  return (
    <div className="row">
      <div className="col-xl-12">
        <ul className="timeline">
          <div
            className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
          >
            <span className={`${visitStyles.hcc_title_name}`}>VALID HCC</span>
            <div className="d-flex justify-content-center">
              <span className={`${visitStyles.hcc_title_badge}`}>
                {validClienHccList?.length}
              </span>
            </div>
          </div>
          <div className={styles.container}>
            <div className={visitStyles.hccStickey_head}>
              {validClienHccList?.map((data) => {
                const dates = data?.encounterDate?.split(",");
                return (
                  <li>
                    <div className={`hccActiveCard ${visitStyles.hcc_card}`}>
                      <div className={`${visitStyles.hcc_card_nameHead}`}>
                        <div className="media-body">
                          <span className="mb-1 disease-name d-flex">
                            <span className="valid-dis-name">
                              {data.diagnosisCode} -
                            </span>
                            <Popover
                              content={
                                data.actualDescription.length > 25
                                  ? `${data.actualDescription.substring(
                                      0,
                                      25
                                    )}...`
                                  : data.actualDescription
                              }
                              trigger="hover"
                            >
                              {data.actualDescription.length > 25
                                ? `${data.actualDescription.substring(
                                    0,
                                    30
                                  )}...`
                                : data.actualDescription}
                            </Popover>
                          </span>
                        </div>
                      </div>
                      <div className={`${visitStyles.hoverActiveHcc}`}>
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              {dates?.map((date) =>
                                getProviderNameList(ProviderName[date])
                              )}
                            </div>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              <div
                                className={styles.meatFoundContainer}
                                style={{
                                  display: "flex",
                                  paddingRight: "10px",
                                }}
                              >
                                <div>
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "M"
                                  )}
                                </div>
                                <div>
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "E"
                                  )}
                                </div>
                                <div>
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "A"
                                  )}
                                </div>
                                <div>
                                  {getMeatFound(
                                    data?.diagnosisCode,
                                    meatCriteriaList,
                                    "T"
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {getEncounterDateBackgroundHcc(
                            data.encounterDate,
                            data.diagnosisCode
                          )}
                        </div>
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          {getCaptureSectionBackground(
                            data.capturedSections,
                            data.diagnosisCode
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </div>
          </div>
        </ul>
      </div>
      <div className="col-xl-12">
        <ul className="timeline">
          <div
            className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
          >
            <span className={`${visitStyles.suggested_title_name}`}>
              SUGGESTED CODES
            </span>
            <div className="d-flex justify-content-center">
              <span className={`${visitStyles.suggested_title_badge}`}>
                {cogentSuggestedHccList?.length}
              </span>
            </div>
          </div>
          <div className={visitStyles.suggestedcontainer}>
            <div className={visitStyles.hccStickey_head}>
              {cogentSuggestedHccList?.length > 0 &&
                cogentSuggestedHccList?.map((data) => {
                  const dates = data?.encounterDate?.split(",");

                  return (
                    <li>
                      <div className={`hccActiveCard ${visitStyles.hcc_card}`}>
                        <div className={`${visitStyles.hcc_card_nameHead}`}>
                          <div className="media-body">
                            <span className="mb-1 disease-name d-flex">
                              <span className="valid-dis-name">
                                {data.diagnosisCode} -
                              </span>
                              <Popover
                                content={
                                  data.actualDescription.length > 25
                                    ? `${data.actualDescription.substring(
                                        0,
                                        25
                                      )}...`
                                    : data.actualDescription
                                }
                                trigger="hover"
                              >
                                {data.actualDescription.length > 25
                                  ? `${data.actualDescription.substring(
                                      0,
                                      30
                                    )}...`
                                  : data.actualDescription}
                              </Popover>
                            </span>
                          </div>
                        </div>
                        <div className={`${visitStyles.hoverActiveHcc}`}>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
                            {dates?.map((date) =>
                              getProviderNameList(ProviderName[date])
                            )}
                            {getEncounterDateBackgroundHcc(
                              data.encounterDate,
                              data.diagnosisCode
                            )}
                          </div>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
                            {getCaptureSectionBackground(
                              data.capturedSections,
                              data.diagnosisCode
                            )}
                            {data?.getPlace == "Lab" && (
                              <Tooltip title="LAB">
                                <span
                                  className={` mt-2 ${visitStyles.labStatus}`}
                                  bg={`  mt-2 bg-bg-seven `}
                                >
                                  Lab
                                </span>
                              </Tooltip>
                            )}
                            {data?.getPlace == "Radio" && (
                              <Tooltip title="RADIOLOGY">
                                <span
                                  className={` mt-2 ${visitStyles.radiologyStatus}`}
                                  bg={`  mt-2 bg-bg-eight `}
                                >
                                  Radiology
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default CogentAIResult;
