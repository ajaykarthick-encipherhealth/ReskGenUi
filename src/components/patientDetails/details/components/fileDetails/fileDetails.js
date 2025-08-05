import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import {
  faArrowLeft,
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
  faClock,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faFile,
  setCopied,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { notification, Tooltip } from "antd";
import { truncateString } from "../function/ReusableFunctions";
import { handleCopyToClipboard } from "../../../../commonFunctions";
import { formatDateTime } from "../../../../../utils/reusable";

const Details = ({ fileResult, fromHcc, fileDetails }) => {
  const getMastData = (value) => {
    if (value) {
      return value.split("").splice(0, 3).join("") + "xxxx";
    }
  };

  const calculateAge = (dob) => {
    if (dob) {
      return dayjs().diff(dob, "year");
    }
  };
  return (
    <>
      <div
        id="detailsCardHcc"
        name="detailsCardHcc"
        className={styles.detailsCardHcc}
      >
        <div
          id="patient-header"
          name="patient-header"
          className="row"
          style={{ lineHeight: "0" }}
        >
          <div className="col-2" id="patient-id" name="patient-id">
            <FontAwesomeIcon icon={faIdCardClip} style={{ color: "#241571" }} />
            <label className="px-1" style={{ fontWeight: 600 }}>
              Patient ID
            </label>
            <h6
              id="patient-id-value"
              name="patient-id-value"
              className="px-4 cursor-pointer"
              onClick={() =>
                handleCopyToClipboard({
                  text: fileResult?.patientId,
                  setCopied: setCopied,
                })
              }
            >
              <Tooltip title={fileResult?.patientId}>
                {fileResult?.patientId
                  ? getMastData(fileResult?.patientId)
                  : "-"}
              </Tooltip>
            </h6>
          </div>
          <div className="col-2" id="patient-name" name="patient-name">
            <FontAwesomeIcon icon={faUserCircle} style={{ color: "#241571" }} />

            <label className="px-2" style={{ fontWeight: 600 }}>
              Patient Name
            </label>
            <h6
              id="patient-name-value"
              name="patient-name-value"
              className="px-4 cursor-pointer"
              onClick={() =>
                handleCopyToClipboard({
                  text: fileResult?.patientName,
                  setCopied: setCopied,
                })
              }
            >
              <Tooltip title={fileResult?.patientName}>
                {fileResult?.patientName
                  ? getMastData(fileResult?.patientName)
                  : "-"}
              </Tooltip>
            </h6>
          </div>
          <div className="col-2" id="patient-mbi" name="patient-mbi">
            <FontAwesomeIcon icon={faIdCard} style={{ color: "#241571" }} />

            <label className={styles.mbi} style={{ fontWeight: 600 }}>
              MBI
            </label>
            <h6
              id="patient-mbi-value"
              name="patient-mbi-value"
              className="px-4 cursor-pointer"
              onClick={() =>
                handleCopyToClipboard({
                  text: fileResult?.mbi,
                  setCopied: setCopied,
                })
              }
            >
              <Tooltip title={fileResult?.mbi}>
                {fileResult?.mbi ? getMastData(fileResult?.mbi) : "-"}
              </Tooltip>
            </h6>
          </div>
          <div className="col-2" id="patient-age" name="patient-age">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ color: "#241571" }}
            />
            <label className="px-2" style={{ fontWeight: 600 }}>
              Age
            </label>
            <h6
              id="patient-age-value"
              name="patient-age-value"
              className="px-4"
            >
              {fileResult?.dob ? calculateAge(fileResult?.dob) : "-"}
            </h6>
          </div>
          <div className="col-2" id="file-name" name="file-name">
            <FontAwesomeIcon icon={faFile} style={{ color: "#241571" }} />
            <label className="px-1" style={{ fontWeight: 600 }}>
              File Name
            </label>
            <h6
              id="file-name-value"
              name="file-name-value"
              // className="px-2"
              style={{
                paddingLeft: "25px",
                cursor: "pointer",
              }}
              onClick={() =>
                handleCopyToClipboard({
                  text: fileResult?.fileName,
                  setCopied: setCopied,
                })
              }
            >
              {fileResult?.fileName ? (
                <Tooltip title={fileResult?.fileName}>
                  {getMastData(fileResult?.fileName)}
                </Tooltip>
              ) : (
                "-"
              )}
            </h6>
          </div>
          <div className="col-2 " id="date-of-birth" name="date-of-birth">
            <i className={styles.dob_icon}>{SVGICON.DatebirthIcon}</i>
            <label className="px-2" style={{ fontWeight: 600 }}>
              Date Of Birth
            </label>
            <h6
              id="date-of-birth-value"
              name="date-of-birth-value"
              className="px-4 cursor-pointer"
              onClick={() =>
                handleCopyToClipboard({
                  text: fileResult?.dob,
                  setCopied: setCopied,
                })
              }
            >
              <Tooltip
                title={formatDateTime({
                  date: fileResult?.dob,
                })}
              >
                {fileResult?.dob
                  ? formatDateTime({ date: fileResult.dob })?.replace(
                      /\d{4}$/,
                      "xxxx"
                    )
                  : "-"}
              </Tooltip>
            </h6>
          </div>
          <div className="col-2" id="gender" name="gender">
            <FontAwesomeIcon icon={faVenusMars} style={{ color: "#241571" }} />
            <div className={styles.subItems}>
              <label className="px-3" style={{ fontWeight: 600 }}>
                Gender
              </label>
              <h6 id="gender-value" name="gender-value" className="px-3">
                {fileResult?.gender || "-"}
              </h6>
            </div>
          </div>
          <div className="col-2" id="gender" name="gender">
            {SVGICON.faceToface}
            <div className={styles.subItems}>
              <label className="px-3" style={{ fontWeight: 600 }}>
                Face to Face
              </label>
              <h6 id="gender-value" name="gender-value" className="px-3">
                {/* {fileResult?.gender || "-"} */}
                {fileDetails?.faceToFace === true
                  ? "Yes"
                  : fileDetails?.faceToFace === false
                  ? "No"
                  : "---"}
              </h6>
            </div>
          </div>
          <div className="col-4" id="gender" name="gender">
            {SVGICON.visitType}
            <div className={styles.subItems}>
              <label className="px-3" style={{ fontWeight: 600 }}>
                Visit Type
              </label>
              <h6 id="gender-value" name="gender-value" className="px-3">
                {/* {fileResult?.gender || "-"} */}
                {fileDetails?.visitType || "---"}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
