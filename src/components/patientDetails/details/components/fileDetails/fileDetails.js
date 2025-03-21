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
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { notification, Tooltip } from "antd";
import { truncateString } from "../function/ReusableFunctions";
import { handleCopyToClipboard } from "../../../../commonFunctions";
import { formatDateTime } from "../../../../../utils/reusable";

const Details = ({ fileResult, fromHcc }) => {
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
      <div id="detailsCardHcc" name="detailsCardHcc" className={styles.detailsCardHcc}>
        <div id="patient-header" name="patient-header" className="row" style={{ lineHeight: "0" }}>
          <div className="col-4" id="patient-id" name="patient-id">
            <FontAwesomeIcon icon={faIdCardClip} style={{ color: "#241571" }} />
            <label className="px-2" style={{ fontWeight: 600 }}>
              Patient ID
            </label>
            <h6
            id="patient-id-value" name="patient-id-value"
              className="px-4 cursor-pointer"
              onClick={() =>
                handleCopyToClipboard({
                  text: fileResult?.patientId,
                  setCopied: setCopied,
                })
              }
            >
              {fileResult?.patientId
                ? getMastData(fileResult?.patientId)
                : "--"}
            </h6>
          </div>
          <div className="col-5" id="patient-name" name="patient-name">
            <FontAwesomeIcon icon={faUserCircle} style={{ color: "#241571" }} />

            <label className="px-2" style={{ fontWeight: 600 }}>
              Patient Name
            </label>
            <h6 id="patient-name-value" name="patient-name-value" className="px-4">
              {fileResult?.patientName
                ? getMastData(fileResult?.patientName)
                : "--"}
            </h6>
          </div>
          <div className="col-3" id="patient-age" name="patient-age">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ color: "#241571" }}
            />
            <label className="px-2" style={{ fontWeight: 600 }}>
              Age
            </label>
            <h6  id="patient-age-value" name="patient-age-value" className="px-4">
              {fileResult?.dob ? calculateAge(fileResult?.dob) : "--"}
            </h6>
          </div>
          <div className="col-4" id="file-name" name="file-name">
            <FontAwesomeIcon icon={faFile} style={{ color: "#241571" }} />
            <label className="px-2" style={{ fontWeight: 600 }}>
              File Name
            </label>
            <h6 id="file-name-value"
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
                  {truncateString(fileResult?.fileName, 12)}
                </Tooltip>
              ) : (
                "--"
              )}
            </h6>
          </div>
          <div className="col-5" id="date-of-birth" name="date-of-birth">
            <i className={styles.dob_icon}>{SVGICON.DatebirthIcon}</i>
            <label className="px-2" style={{ fontWeight: 600 }}>
              Date Of Birth
            </label>
            <h6 id="date-of-birth-value" name="date-of-birth-value" className="px-4">
              {fileResult?.dob
                ? formatDateTime({ date: fileResult?.dob })
                : "---"}
            </h6>
          </div>
          {/* <div className="col-3">
            <FontAwesomeIcon icon={faVenusMars} style={{ color: "#241571"}} />
            <label
              // className="px-2 "
              style={{ fontWeight: 600 }}
            >
              Gender
            </label>
            <h6 className="px-4">{fileResult?.gender || "--"}</h6>
          </div> */}
          <div className="col-3" id="gender" name="gender">
            <FontAwesomeIcon icon={faVenusMars} style={{ color: "#241571" }} />
            <div
              style={{
                position: "relative",
                bottom: "10px",
                paddingLeft: "6px",
              }}
            >
              <label className="px-3" style={{ fontWeight: 600 }}>
                Gender
              </label>
              <h6 id="gender-value" name="gender-value" className="px-2">{fileResult?.gender || "--"}</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
