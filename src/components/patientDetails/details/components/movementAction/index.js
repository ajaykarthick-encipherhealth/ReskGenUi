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
  isShow,
  fromMeat,
  patientDetailsLoad,
  getPatientIdData,
  patientIdDetailsData,
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
          patientDetailsLoad,
          getPatientIdData,
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
        patientDetailsLoad,
        getPatientIdData,
      });
    }
  };
  const isDisabled =
    patientIdDetailsData?.data?.response?.workflow?.[0]?.status !== "PENDING";

  const handleCloseModal = () => {};
  return (
    <>
      <div className={styles.container}>
        {validAction && (
          <Tooltip title="Move to valid" placement="bottom">
            {isShow || fromMeat ? (
              !isDisabled ? (
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
              ) : (
                <CheckCircleFilled
                  className={styles.validIcon}
                  style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                />
              )
            ) : null}
          </Tooltip>
        )}
        {suggestedAction && (
          <Tooltip title="Move to Care Gap" placement="bottom">
            {isShow || fromMeat ? (
              !isDisabled ? (
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
                      patientDetailsLoad,
                      getPatientIdData,
                    });
                  }}
                  title="You want move to Care Gap?"
                  placement="bottom"
                  okText="Yes"
                  cancelText="No"
                >
                  <RightCircleOutlined
                    className={styles.suggestedIcon}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      moveToStrightAction(
                        setIsValidAction,
                        "Move to Suggested",
                        cardTitle
                      );
                      onchangeValid(result.diagnosisCode, result);
                      onChangeValues(result);
                    }}
                  />
                </Popconfirm>
              ) : (
                <RightCircleOutlined
                  className={styles.suggestedIcon}
                  style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                />
              )
            ) : null}
          </Tooltip>
        )}

        {potentialAction && !isComboCode && (
          <Tooltip title="Move to potential" placement="bottom">
            {isShow || fromMeat ? (
              !isDisabled ? (
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
                      patientDetailsLoad,
                      getPatientIdData,
                    });
                  }}
                  title="You want move to potential?"
                  placement="bottom"
                  okText="Yes"
                  cancelText="No"
                >
                  <span
                    className={`d-flex align-items-center justify-content-center ${styles.potentialIcon}`}
                    onClick={() => {
                      moveToStrightAction(
                        setIsValidAction,
                        "Move to Potential",
                        cardTitle
                      );
                      onchangeValid(result.diagnosisCode, result);
                      onChangeValues(result);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faHandHoldingMedical}
                      style={{ fontSize: "9px" }}
                    />
                  </span>
                </Popconfirm>
              ) : (
                <span
                  className={`d-flex align-items-center justify-content-center ${styles.potentialIcon}`}
                >
                  <FontAwesomeIcon
                    icon={faHandHoldingMedical}
                    style={{
                      fontSize: "9px",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }}
                  />
                </span>
              )
            ) : null}
          </Tooltip>
        )}
        {deleteAction && !isComboCode ? (
          <Tooltip title="Move to delete" placement="bottom">
            {isShow || fromMeat ? (
              !isDisabled ? (
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
                      patientDetailsLoad,
                      getPatientIdData,
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
              ) : (
                <CloseCircleFilled
                  className={styles.deleteIcon}
                  style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                />
              )
            ) : null}
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
    patientIdDetailsData: state?.patientDetails.details?.patientIdResult,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
    patientDetailsLoad: detailsActions.patientDetailsLoad,
    getPatientIdData: detailsActions.patientIdDetailsAction,
  }
);
export default enhancer(MovementAction);
