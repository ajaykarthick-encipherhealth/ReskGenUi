import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./styles.module.css";
import {
  CloseCircleFilled,
  CheckCircleFilled,
  RightCircleOutlined,
} from "@ant-design/icons";
import { Tooltip, Popconfirm, message } from "antd";
import {
  handleSubmitValidNotes,
  moveToStrightAction,
} from "../function/ReusableFunctions";
import { actions as detailsActions } from "../../../../../stores/patient/details";

const MovementAction = ({
  validAction,
  suggestedAction,
  deleteAction,
  cardTitle,
  setConfirmNotesModalValid,
  onchangeValid,
  result,
  setFileLoading,
  patientDetailsResult,
  getpatientDetailsData,
  isComboCode,
}) => {
  const [selectDisDetails, setSelectDisDetails] = useState(false);
  const onChangeValues = (data) => {
    data.processedYear = patientDetailsResult?.data?.response?.processedYear;
    data.dateOfService = patientDetailsResult?.data?.response?.dateOfService;
    (data.fileId = patientDetailsResult?.data?.response?.fileId),
      setSelectDisDetails(data);
  };
  const [isValidAction, setIsValidAction] = useState("");

  const handleCloseModal = () => {};
  return (
    <>
      <div className={styles.container}>
        {validAction && (
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
            title="You want move to valid?"
            placement="bottom"
            okText="Yes"
            cancelText="No"
          >
            <CheckCircleFilled
              className={styles.validIcon}
              onClick={() => {
                moveToStrightAction(setIsValidAction, "Move to HCC", cardTitle),
                  onchangeValid(result.diagnosisCode, result),
                  onChangeValues(result);
              }}
            />
          </Popconfirm>
        )}
        {suggestedAction && (
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
        )}
        {deleteAction && !isComboCode ? (
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
            title="You want move to delete?"
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

        ) : 
      //   <CloseCircleFilled
      //   className={styles.deleteIcon}
      //   onClick={() => message.warning("Delete only formed codes")}
      // />
      ""
      }

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
