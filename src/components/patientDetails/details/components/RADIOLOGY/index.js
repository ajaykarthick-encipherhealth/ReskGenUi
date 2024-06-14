import React, { useState } from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Popconfirm, Popover, Tooltip } from "antd";
import styles from "./styles.module.css";
import { Spinner } from "react-bootstrap";
import {
  faArrowsAlt,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { QuestionCircleOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getCaptureSectionBackgroundFile,
  getEncounterDateBackground,
  getMeatFound,
  getProviderNameList,
  moveToAnotherAction,
} from "../function/ReusableFunctionsRadiology";
import { useSelector, useDispatch } from "react-redux";
import { Draggable } from "react-beautiful-dnd";

const RadiologyCards = ({
  list,
  captureSectionMatching,
  encounterDateMatching,
  meatCriteriaList,
  onchangeValid,
  okText,
  cancelText,
  setActiveTabHead,
  setActiveMeatTitle,
  setSearch,
  setFileLoading,
  setFileModalHeader,
  patientDocumentResult,
  setConfirmNotesModalValid,
  cardTitle,
  provided,
  isVisitData,
  setIsModalOpenValidCodes,
  setIsValidAction,
  setIsModalOpenRadiology,
}) => {
  const fileId = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const fileDosPageNumberList = useSelector(
    (state) => state?.ReviewerReducers.dosPageNumberList
  );
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [openContent, setOpenContent] = useState(null);

  return (
    <>
      {provided && (
        <div ref={provided?.innerRef} {...provided?.droppableProps}>
          {list?.map((data, i) => (
            <>
              <li key={data?.id}>
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
                              onchangeValid(data.diagnosisCode, data)
                            }
                          >
                            {
                              <div className="cr-pointer d-flex">
                                <div className={visitStyles.close_icon}>
                                  <FontAwesomeIcon
                                    icon={faArrowsAlt}
                                    style={{
                                      size: 8,
                                      color: "#a80404",
                                    }}
                                  />
                                </div>
                              </div>
                            }
                          </Popconfirm>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className={`${visitStyles.hoverActiveHcc}`}>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {getProviderNameList({
                                data: data?.providerName,
                                captureSectionMatching: captureSectionMatching,
                              })}
                            </div>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {getEncounterDateBackground({
                                value: data?.encounterDateSplit,
                                encounterDateMatching: encounterDateMatching,
                                fileDosPageNumberList: fileDosPageNumberList,
                                setIsModalOpenValidCodes:
                                  setIsModalOpenValidCodes
                                    ? setIsModalOpenValidCodes
                                    : null,
                                setSearch: setSearch,
                                setFileModalHeader: setFileModalHeader,
                                patientDocumentResult: patientDocumentResult,
                              })}
                            </div>
                            <div
                              className={`${visitStyles.encounterAndSectionHeader}`}
                            >
                              {getCaptureSectionBackgroundFile(
                                data?.capturedSections,
                                data?.encounterDate,
                                data?.actualDescription,
                                data?.diagnosisCode,
                                captureSectionMatching,
                                setSearch,
                                setIsModalOpenRadiology,
                                setFileModalHeader
                              )}
                            </div>
                          </div>
                          <div
                            className={`${visitStyles.encounterAndSectionHeader}`}
                          >
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
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Draggable>
              </li>
            </>
          ))}
          <span className="d-none">{provided?.placeholder}</span>
        </div>
      )}
    </>
  );
};

export default RadiologyCards;
