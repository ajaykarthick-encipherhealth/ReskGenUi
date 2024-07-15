import { SVGICON } from "../../../../../jsx/constant/theme";
import styles from "./styles.module.css";
import TableStyle from "../../../../../components/table/table.module.css";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const Flag = ({ patienIdDetails, patientDetails, flagFirstData }) => {

  const underScoreRemove = (value) => {
    console.log(value)
    if (value) {
      let str = value;
      let newStr = str.replace(/_/g, " ");
      return newStr;
    }
  };


  return (
    <>
      <div className="d-flex">
        <div className={styles.flagCard1}>
          <h5>Flag</h5>
          <span
            className={`${visitStyles.commentsName} ${visitStyles.statusFLag}`}
          >
            {flagFirstData?.flag == "PATIENT_NAME_MISSED" ? (
              <Tooltip title="PATIENT_NAME_MISSED" placement="bottom">
                <i className={visitStyles.name_missed}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "PATIENT_DOB_MISSED" ? (
              <Tooltip title="PATIENT_DOB_MISSED" placement="bottom">
                <i className={visitStyles.dob_missed}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "MRN_ID_MISMATCH" ? (
              <Tooltip title="MRN_ID_MISMATCH" placement="bottom">
                <i className={visitStyles.id_missed}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "PROVIDER_SIGN_MISSED" ? (
              <Tooltip title="PROVIDER_SIGN_MISSED" placement="bottom">
                <i className={visitStyles.sign_missed}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "PROVIDER_SIGNATURE_MISSED" ? (
              <Tooltip title="PROVIDER_SIGNATURE_MISSED" placement="bottom">
                <i className={visitStyles.signature_missed}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "PROVIDER_CREDENTIAL_MISSED" ? (
              <Tooltip title="PROVIDER_CREDENTIAL_MISSED" placement="bottom">
                <i className={visitStyles.cred_missed}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "PROVIDER_SIGN_STATUS_PENDING" ? (
              <Tooltip title="PROVIDER_SIGN_STATUS_PENDING" placement="bottom">
                <i className={visitStyles.sign_status}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "NO_HCC_FOUND" ? (
              <Tooltip title="NO_HCC_FOUND" placement="bottom">
                <i className={visitStyles.no_hcc_found}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "NO_VALID_DOCUMENT_FOUND" ? (
              <Tooltip title="NO_VALID_DOCUMENT_FOUND" placement="bottom">
                <i className={visitStyles.no_doc_found}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "PATIENT_DECEASED" ? (
              <Tooltip title="PATIENT_DECEASED" placement="bottom">
                <i className={visitStyles.patient_diseased}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : flagFirstData?.flag == "PATIENT_INACTIVE" ? (
              <Tooltip title="PATIENT_INACTIVE" placement="bottom">
                <i className={visitStyles.patient_inactive}>
                  {SVGICON.emptyFlagSmallLarge}
                </i>
                {underScoreRemove(flagFirstData?.flag)}
              </Tooltip>
            ) : null}
          </span>
        </div>
        <div className={styles.flagCard2}>
          <h5>Priority</h5>
          <div className={`${styles.priorityStatus} p-0`}>
            {patienIdDetails?.priority == "URGENT" ? (
              <div className={styles.priorityStatusIcon}>
                <i><FontAwesomeIcon icon={faTriangleExclamation} /></i>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "red",
                    paddingTop: "5px",
                    paddingLeft: "5px",
                  }}
                >
                  Urgent
                </span>
              </div>
            ) : patienIdDetails?.priority == "HIGH" ? (
              <div className={styles.priorityStatusIcon}>
                <i className={TableStyle.highFlag}><FontAwesomeIcon icon={faTriangleExclamation} /></i>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#cf940a",
                    paddingTop: "5px",
                    paddingLeft: "5px",
                  }}
                >
                  High
                </span>
              </div>
            ) : patienIdDetails?.priority == "NORMAL" ? (
              <div className={styles.priorityStatusIcon}>
                <i className={TableStyle.normalFlag}><FontAwesomeIcon icon={faTriangleExclamation} /></i>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#4466ff ",
                    paddingTop: "5px",
                    paddingLeft: "5px",
                  }}
                >
                  Normal
                </span>
              </div>
            ) : (
              <div className={styles.priorityStatusIcon}>
                <i className={TableStyle.lowFlag}><FontAwesomeIcon icon={faTriangleExclamation} /></i>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#87909e",
                    paddingTop: "5px",
                    paddingLeft: "5px",
                  }}
                >
                  Low
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.flagCard3}>
          <h5>RAF</h5>
          {patientDetails?.rafScore?.rafVersionDTO?.overAllScore != null ? (
            <h5>
              {patientDetails?.rafScore?.rafVersionDTO?.overAllScore?.toFixed(
                3
              )}
            </h5>
          ) : (
            <h5>0.00</h5>
          )}
        </div>
      </div>
    </>
  );
};

export default Flag;
