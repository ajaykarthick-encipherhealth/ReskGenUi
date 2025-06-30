import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./styles.module.css";
import {
  CloseCircleFilled,
  CheckCircleFilled,
  RightCircleOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import { Tooltip, Popconfirm, message, Checkbox } from "antd";
import {
  getMeatAnyOneFindCheck,
  handleSubmitValidNotes,
  moveToStrightAction,
} from "../function/ReusableFunctions";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { suggestedMeatCheck } from "../../../../../stores/patient/details/network";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingMedical } from "@fortawesome/free-solid-svg-icons";
import { getStorage } from "../../../../../utils/storages";
import { isStatusDisabled } from '../../../../../utils/reusable'
import { useRouter } from "next/router";

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
  educationalError,
  setEducationalError,
}) => {
    const router = useRouter()
  const userRole = getStorage("userRole");
  const [selectDisDetails, setSelectDisDetails] = useState(false);
  // const [educationalError, setEducationalError] = useState(false);
  const [popVisible, setPopVisible] = useState({
    valid: false,
    suggested: false,
    potential: false,
    delete: false,
  });
  const handlePopVisibleChange = (key, visible) => {
    setPopVisible((prev) => ({
      ...prev,
      [key]: visible,
    }));
    // if (!visible) {
    //   setEducationalError && setEducationalError(false);
    // }
  };

  const [isValidAction, setIsValidAction] = useState("");

  const educationalErrorCheckBox = ({ message, checked, onChange }) => (
    <div>
      <div>{message}</div>
      <div className="d-flex mt-2 flex-column gap-2 w-100">
        <Checkbox
          className="ant-badge"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        >
         Mark as Educational Error
        </Checkbox>
      </div>
    </div>
  );
  const handleCancel = () => {
    setEducationalError && setEducationalError(false);
    setPopVisible({
      valid: false,
      suggested: false,
      potential: false,
      delete: false,
    });
  };

  const onChangeValues = (data) => {
    data.processedYear = patientDetailsResult?.data?.response?.processedYear;
    data.dateOfService = patientDetailsResult?.data?.response?.dateOfService;
    (data.fileId = patientDetailsResult?.data?.response?.fileId),
      setSelectDisDetails(data);
  };

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
          educationalError,
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
        educationalError,
      });
    }
  };
 const isDisabled = isStatusDisabled(patientIdDetailsData, patientDetailsResult, router.pathname);

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
                  title={
                    userRole === "CODER_2" || userRole === "QA"
                      ? educationalErrorCheckBox({
                          message: "You want move to valid?",
                          checked: educationalError,
                          onChange: setEducationalError,
                        })
                      : "You want move to valid?"
                  }
                  placement="bottom"
                  okText="Yes"
                  cancelText="No"
                  onCancel={handleCancel}
                  visible={popVisible.valid}
                  onVisibleChange={(visible) =>
                    handlePopVisibleChange("valid", visible)
                  }
                >
                  <CheckCircleFilled
                    className={styles.validIcon}
                    onClick={() => {
                      setEducationalError && setEducationalError(false);
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
                      educationalError,
                    });
                  }}
                  onCancel={handleCancel}
                  visible={popVisible.suggested}
                  onVisibleChange={(visible) =>
                    handlePopVisibleChange("suggested", visible)
                  }
                  title={
                    userRole === "CODER_2" || userRole === "QA"
                      ? educationalErrorCheckBox({
                          message: "You want to move to Care Gap?",
                          checked: educationalError,
                          onChange: setEducationalError,
                        })
                      : "You want to move to Care Gap?"
                  }
                  placement="bottom"
                  okText="Yes"
                  cancelText="No"
                >
                  <RightCircleOutlined
                    className={styles.suggestedIcon}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEducationalError && setEducationalError(false);
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
                      educationalError,
                    });
                  }}
                  title={
                    userRole === "CODER_2" || userRole === "QA"
                      ? educationalErrorCheckBox({
                          message: "You want move to potential?",
                          checked: educationalError,
                          onChange: setEducationalError,
                        })
                      : "You want move to potential?"
                  }
                  placement="bottom"
                  okText="Yes"
                  cancelText="No"
                  onCancel={handleCancel}
                  visible={popVisible.potential}
                  onVisibleChange={(visible) =>
                    handlePopVisibleChange("potential", visible)
                  }
                >
                  <span
                    className={`d-flex align-items-center justify-content-center ${styles.potentialIcon}`}
                    onClick={() => {
                      setEducationalError && setEducationalError(false);
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
                      educationalError,
                    });
                  }}
                  title={
                    userRole === "CODER_2" || userRole === "QA"
                      ? educationalErrorCheckBox({
                          message: "You want move to delete?",
                          checked: educationalError,
                          onChange: setEducationalError,
                        })
                      : "You want move to delete?"
                  }
                  onCancel={handleCancel}
                  visible={popVisible.delete}
                  onVisibleChange={(visible) =>
                    handlePopVisibleChange("delete", visible)
                  }
                  placement="bottom"
                  okText="Yes"
                  cancelText="No"
                >
                  <CloseCircleFilled
                    className={styles.deleteIcon}
                    onClick={() => {
                      setEducationalError && setEducationalError(false);
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
