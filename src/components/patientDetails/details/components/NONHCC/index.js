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
import { useSelector, connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import ModelIndex from "../model/Index";
import ENDPOINTS from "../../../../../utility/enpoints";

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
}) => {
  const fileId = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  // const fileDosPageNumberList = useSelector(
  //   (state) => state?.ReviewerReducers.dosPageNumberList
  // );
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

  return (
    <>
      {list?.map((data, i) => (
        <>
          <li key={data?.id}>
            <div className={`hccActiveCard ${visitStyles.hcc_card}`}>
              <div
                className={` justify-content-between ${visitStyles.hcc_card_nameHead}`}
              >
                <div>
                  <span className="disease-name d-flex mb-1">
                    <span className="valid-dis-name">{data.diagnosisCode}</span>

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
                <div className="d-flex">
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
                    onOpenChange={() => onchangeValid(data.diagnosisCode, data)}
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
                      setIsModalOpenValidCodes: setIsModalOpenValidCodes
                        ? setIsModalOpenValidCodes
                        : null,
                      setSearch: setSearch,
                      setFileModalHeader: setFileModalHeader,
                      patientDocumentResult: patientDocumentResult,
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
                      patientDocumentResult,
                      fileInitialPage,
                      setFileInitialPage,
                      data?.hyperlinks,
                      encounterDateMatching,
                      setIsMulitpleHeader,
                      isMulitpleHeader,
                      setIsMulitpleHeadeCode,
                      isMulitpleHeaderCode
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
                </div>
              </div>
            </div>
          </li>
        </>
      ))}
    </>
  );
};

const enhancer = connect((state) => ({
  fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
}));
export default enhancer(NonHccCards);
