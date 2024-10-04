import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./styles.module.css";
import {
  CloseCircleFilled,
  CheckCircleFilled,
  RightCircleOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import { Tooltip, Popconfirm, message } from "antd";
import {
  getMeatAnyOneFindCheck,
  handleSubmitValidNotes,
  moveToStrightAction,
} from "../function/ReusableFunctions";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { suggestedMeatCheck } from "../../../../../stores/patient/details/network";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingMedical } from "@fortawesome/free-solid-svg-icons";

const MovementAction = ({
  validAction,
  suggestedAction,
  deleteAction,
  potentialAction,
  cardTitle,
  setConfirmNotesModalValid,
  onchangeValid,
  result,
  setFileLoading,
  patientDetailsResult,
  getpatientDetailsData,
  isComboCode,
  setSuggestedMeatForm,
  meatCriteriaList,
  setSelectCardTitle,
}) => {
  const [selectDisDetails, setSelectDisDetails] = useState(false);
  const onChangeValues = (data) => {
    data.processedYear = patientDetailsResult?.data?.response?.processedYear;
    data.dateOfService = patientDetailsResult?.data?.response?.dateOfService;
    (data.fileId = patientDetailsResult?.data?.response?.fileId),
      setSelectDisDetails(data);
  };
  const [isValidAction, setIsValidAction] = useState("");

  const onConfirmValidMove = async () => {
    setSelectCardTitle && setSelectCardTitle(isValidAction);
    var meatFoundResult = getMeatAnyOneFindCheck(
      selectDisDetails?.diagnosisCode,
      meatCriteriaList
    );
    if (!meatFoundResult) {
      setFileLoading(true);
      const result = await suggestedMeatCheck(selectDisDetails?.diagnosisCode);
      if (result?.response) {
        setSuggestedMeatForm && setSuggestedMeatForm(true);
        setFileLoading(false);
      } else {
        handleSubmitValidNotes({
          values: null,
          setFileLoading,
          setConfirmNotesModalValid,
          isValidAction,
          selectDisDetails,
          getpatientDetailsData,
          patientDetailsResult,
          handleCloseModal,
        });
      }
    } else {
      handleSubmitValidNotes({
        values: null,
        setFileLoading,
        setConfirmNotesModalValid,
        isValidAction,
        selectDisDetails,
        getpatientDetailsData,
        patientDetailsResult,
        handleCloseModal,
      });
    }
  };

  const handleCloseModal = () => {};
  return (
    <>
      <div className={styles.container}>
        {validAction && (
          <Tooltip title="Move to valid" placement="bottom">
            <Popconfirm
              onConfirm={() => {
                onConfirmValidMove();
              }}
              title="You want move to valid?"
              placement="bottom"
              okText="Yes"
              cancelText="No"
            >
              <CheckCircleFilled
                className={styles.validIcon}
                onClick={() => {
                  moveToStrightAction(
                    setIsValidAction,
                    "Move to HCC",
                    cardTitle
                  ),
                    onchangeValid(result.diagnosisCode, result),
                    onChangeValues(result);
                }}
              />
            </Popconfirm>
          </Tooltip>
        )}
        {suggestedAction && (
          <Tooltip title="Move to suggested" placement="bottom">
            <Popconfirm
              onConfirm={() => {
                handleSubmitValidNotes({
                  values: null,
                  setFileLoading,
                  setConfirmNotesModalValid,
                  isValidAction,
                  selectDisDetails,
                  getpatientDetailsData,
                  patientDetailsResult,
                  handleCloseModal,
                });
              }}
              title="You want move to suggested?"
              placement="bottom"
              okText="Yes"
              cancelText="No"
            >
              <RightCircleOutlined
                className={styles.suggestedIcon}
                onClick={() => {
                  moveToStrightAction(
                    setIsValidAction,
                    "Move to Suggested",
                    cardTitle
                  ),
                    onchangeValid(result.diagnosisCode, result),
                    onChangeValues(result);
                }}
              />
            </Popconfirm>
          </Tooltip>
        )}
        {potentialAction && (
          <Tooltip title="Move to potential" placement="bottom">
            <Popconfirm
              onConfirm={() => {
                onConfirmValidMove();
              }}
              title="You want move to potential?"
              placement="bottom"
              okText="Yes"
              cancelText="No"
            >
            <span className={`d-flex align-items-center justify-content-center ${styles.potentialIcon}`}>
            <FontAwesomeIcon icon={faHandHoldingMedical}  style={{ fontSize: "9px" }}
                onClick={() => {
                  moveToStrightAction(
                    setIsValidAction,
                    "Move to Potential",
                    cardTitle
                  ),
                    onchangeValid(result.diagnosisCode, result),
                    onChangeValues(result);
                }} />
              </span>
            </Popconfirm>
          </Tooltip>
        )}
        {deleteAction && !isComboCode ? (
          <Tooltip title="Move to delete" placement="bottom">
            <Popconfirm
              onConfirm={() => {
                handleSubmitValidNotes({
                  values: null,
                  setFileLoading,
                  setConfirmNotesModalValid,
                  isValidAction,
                  selectDisDetails,
                  getpatientDetailsData,
                  patientDetailsResult,
                  handleCloseModal,
                });
              }}
              title="Do you want to move to delete?"
              placement="bottom"
              okText="Yes"
              cancelText="No"
            >
              <CloseCircleFilled
                className={styles.deleteIcon}
                onClick={() => {
                  moveToStrightAction(
                    setIsValidAction,
                    "Move to Deleted",
                    cardTitle
                  ),
                    onchangeValid(result.diagnosisCode, result),
                    onChangeValues(result);
                }}
              />
            </Popconfirm>
          </Tooltip>
        ) : (
          //   <CloseCircleFilled
          //   className={styles.deleteIcon}
          //   onClick={() => message.warning("Delete only formed codes")}
          // />
          ""
        )}
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
  }
);
export default enhancer(MovementAction);
