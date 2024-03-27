import React from "react";
import { Popover, Tooltip } from "antd";
import visitStyles from "../../../../styles/visitdata.module.css";
import {
  getProviderNameList,
  getEncounterDateBackgroundHcc,
  getCaptureSectionBackground,
} from "../index";
import { useSelector } from "react-redux";
import { reusableElipses } from "./ValidHcc";

const SuggestedCode = ({ content, ProviderName }) => {
  const colorsData = useSelector((state) => state.physicianComparison.colors);
  return (
    <>
      <ul className="timeline">
        <div
          className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
        >
          <span className={`${visitStyles.suggested_title_name}`}>
            SUGGESTED CODES
          </span>
          <div className="d-flex justify-content-center">
            <span className={`${visitStyles.suggested_title_badge}`}>
              {content?.length}
            </span>
          </div>
        </div>
        <div className={visitStyles.suggestedcontainer}>
          <div className={visitStyles.hccStickey_head}>
            {content?.length > 0 &&
              content?.map((data) => {
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
                              content={data?.actualDescription}
                              trigger="hover"
                            >
                              {reusableElipses(data?.actualDescription, 30)}
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
                            data?.capturedSections,
                            data?.diagnosisCode,
                            colorsData
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
    </>
  );
};

export default SuggestedCode;
