import React from "react";
import { Popover } from "antd";
import visitStyles from "../../../../styles/visitdata.module.css";
import styles from "../styles.module.css";
import {
  getCaptureSectionBackground,
  getEncounterDateBackgroundHcc,
  getProviderNameList,
} from "../index";
import { useSelector } from "react-redux";
import { getMeatFound } from "../../../../components/patientDetails/details/components/function/ReusableFunctions";

export const reusableElipses = (str, count) => {
  if (str?.length > count - 5) {
    return `${str?.substring(0, count)}...`;
  } else {
    return str;
  }
};
const ValidHcc = ({ content, meatCriteriaList, ProviderName }) => {
  const colorsData = useSelector((state) => state.physicianComparison.colors);
  return (
    <ul className="timeline">
      <div
        className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
      >
        <span className={`${visitStyles.hcc_title_name}`}>VALID HCC</span>
        <div className="d-flex justify-content-center">
          <span className={`${visitStyles.hcc_title_badge}`}>
            {content?.length}
          </span>
        </div>
      </div>
      <div className={styles.container}>
        <div className={visitStyles.hccStickey_head}>
          {content?.map((data) => {
            const dates = data?.encounterDate?.split(",");
            return (
              <li>
                <div className={`hccActiveCard ${visitStyles.hcc_card}`}>
                  <div className={`${visitStyles.hcc_card_nameHead}`}>
                    <div className="media-body">
                      <span className="mb-1 disease-name d-flex">
                        <span className="valid-dis-name">
                          {data?.diagnosisCode} -
                        </span>
                        <Popover
                          content={data.actualDescription}
                          trigger="hover"
                        >
                          {reusableElipses(data?.actualDescription, 30)}
                        </Popover>
                      </span>
                    </div>
                  </div>
                  <div className={`${visitStyles.hoverActiveHcc}`}>
                    <div className={`${visitStyles.encounterAndSectionHeader}`}>
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
                        data?.encounterDate,
                        data?.diagnosisCode
                      )}
                    </div>
                    <div className={`${visitStyles.encounterAndSectionHeader}`}>
                      {getCaptureSectionBackground(
                        data?.capturedSections,
                        data?.diagnosisCode,
                        colorsData
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
  );
};

export default ValidHcc;
