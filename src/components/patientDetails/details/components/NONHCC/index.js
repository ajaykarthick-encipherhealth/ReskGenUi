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
import { getProviderNameTag } from "../function/ProviderHyperlinks";
import { actions as detailsActions } from "../../../../../stores/patient/details";


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
  getSelectedDosPageNumber
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
  const [isMulitpleProvider, setIsMulitpleProvider] = useState(false);

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
                    {getProviderNameTag({
                      providerNames: data?.providerName,
                      hyperlinks: data?.providerHyperlinks,
                      setSearch: setSearch,
                      diagnosisCode: data.diagnosisCode,
                      diseaseName: data.dbDescription,
                      setIsModalOpen: setIsModalOpenValidCodes,
                      setFileModalHeader: setFileModalHeader,
                      patientDocumentResult: patientDocumentResult,
                      setIsMulitpleHeader: setIsMulitpleProvider,
                      isMulitpleHeader: isMulitpleProvider,
                      setIsMulitpleHeadeCode: setIsMulitpleHeadeCode,
                      isMulitpleHeaderCode: isMulitpleHeaderCode,
                      setSelectMeatResult: "",
                      getSelectedDosPageNumber:
                      getSelectedDosPageNumber,
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
                    {getCaptureSectionBackgroundFile({
                      value: data?.capturedSections,
                      encounterDate: data?.encounterDate,
                      actualDescription: data?.actualDescription,
                      diagnosisCode: data?.diagnosisCode,
                      documentPlace: data?.getPlace,
                      captureSectionMatching: captureSectionMatching,
                      setSearch: setSearch,
                      setFileLoading: setFileLoading,
                      setIsModalOpenLab: setIsModalOpenLab,
                      setIsModalOpenRadiology: setIsModalOpenRadiology,
                      setIsModalOpenValidCodes: setIsModalOpenValidCodes,
                      setFileModalHeader: setFileModalHeader,
                      fileId: fileId,
                      patientDocumentResult: patientDocumentResult,
                      fileInitialPage: fileInitialPage,
                      setFileInitialPage: setFileInitialPage,
                      hyperlinks: data?.hyperlinks,
                      encounterDateMatching: encounterDateMatching,
                      setIsMulitpleHeader: setIsMulitpleHeader,
                      isMulitpleHeader: isMulitpleHeader,
                      setIsMulitpleHeadeCode: setIsMulitpleHeadeCode,
                      isMulitpleHeaderCode: isMulitpleHeaderCode,
                      diseaseName: data.dbDescription,
                      popup: "",
                      getSelectedDosPageNumber,
                    })}
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
}),
{
  getSelectedDosPageNumber: detailsActions.getSelectedDosPageNumber,
}
);
export default enhancer(NonHccCards);
