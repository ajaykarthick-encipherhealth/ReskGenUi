import React from "react";
import { Popover } from "antd";
import visitStyles from '../../../styles/visitdata.module.css'
import styles from './styles.module.css'

const ClientResult = ({validHccList,getCaptureSectionBackground,getEncounterDateBackgroundHcc,getProviderNameList,clientSuggestedHccList}) => {
  return (
    <div className="row">
      <div className="col-xl-12">
        <ul className="timeline">
          <div
            className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
          >
            <span className={`${visitStyles.hcc_title_name}`}>HCC</span>
            <div className="d-flex justify-content-center">
              <span className={`${visitStyles.hcc_title_badge}`}>
                {validHccList?.length}
              </span>
            </div>
          </div>
          <div className={styles.container}>
            <div className={visitStyles.hccStickey_head}>
              {validHccList?.map((data) => (
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
                            {data?.actualDescription}
                          </Popover>
                        </span>
                      </div>
                    </div>
                    <div className={`${visitStyles.hoverActiveHcc}`}>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getProviderNameList(data?.providerName)}
                        {getEncounterDateBackgroundHcc(
                          data?.encounterDateSplit,
                          data?.diagnosisCode
                        )}
                      </div>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getCaptureSectionBackground(
                          data?.capturedSections,
                          data?.diagnosisCode
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
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
                {clientSuggestedHccList?.length}
              </span>
            </div>
          </div>
          <div className={visitStyles.suggestedcontainer}>
            <div className={visitStyles.hccStickey_head}>
              {clientSuggestedHccList?.length > 0 &&
                clientSuggestedHccList?.map((data) => (
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
                              {data?.actualDescription}
                            </Popover>
                          </span>
                        </div>
                      </div>
                      <div className={`${visitStyles.hoverActiveHcc}`}>
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          {getProviderNameList(data?.providerName)}
                          {getEncounterDateBackgroundHcc(
                            data.encounterDateSplit,
                            data.diagnosisCode
                          )}
                        </div>
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          {getCaptureSectionBackground(
                            data?.capturedSections,
                            data?.diagnosisCode
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default ClientResult;
