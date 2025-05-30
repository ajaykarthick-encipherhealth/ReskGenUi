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
          <div className="col-3" id="patient-id" name="patient-id">
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
                : "--"}</Tooltip>
            </h6>
          </div>
          <div className="col-4" id="patient-name" name="patient-name">
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
                  : "--"}
              </Tooltip>
            </h6>
          </div>
          <div className="col-2" id="patient-mbi" name="patient-mbi">
            {/* <FontAwesomeIcon icon={faUserCircle} style={{ color: "#241571" }} /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 30 30"
              fill="none"
            >
              <circle cx="15.2615" cy="14.6624" r="14.6624" fill="#04306F" />
              <path
                d="M7.39359 10.5332H8.50327L11.1125 16.9063H11.2025L13.8117 10.5332H14.9214V18.2109H14.0516V12.3777H13.9767L11.5774 18.2109H10.7376L8.33832 12.3777H8.26334V18.2109H7.39359V10.5332ZM16.7855 18.2109V10.5332H19.4697C20.0046 10.5332 20.4457 10.6257 20.7931 10.8106C21.1405 10.9931 21.3992 11.2392 21.5691 11.5491C21.7391 11.8566 21.824 12.1977 21.824 12.5726C21.824 12.9025 21.7653 13.1749 21.6478 13.3899C21.5329 13.6048 21.3804 13.7747 21.1905 13.8997C21.003 14.0247 20.7993 14.1171 20.5794 14.1771V14.2521C20.8143 14.2671 21.0505 14.3496 21.2879 14.4995C21.5254 14.6495 21.7241 14.8644 21.884 15.1443C22.044 15.4243 22.1239 15.7667 22.1239 16.1715C22.1239 16.5564 22.0365 16.9026 21.8615 17.21C21.6866 17.5174 21.4104 17.7611 21.033 17.941C20.6556 18.121 20.1645 18.2109 19.5597 18.2109H16.7855ZM17.7152 17.3862H19.5597C20.167 17.3862 20.5981 17.2687 20.8531 17.0338C21.1105 16.7964 21.2392 16.5089 21.2392 16.1715C21.2392 15.9116 21.173 15.6717 21.0405 15.4517C20.9081 15.2293 20.7194 15.0519 20.4744 14.9194C20.2295 14.7844 19.9396 14.717 19.6047 14.717H17.7152V17.3862ZM17.7152 13.9072H19.4397C19.7197 13.9072 19.9721 13.8522 20.197 13.7423C20.4244 13.6323 20.6044 13.4773 20.7369 13.2774C20.8718 13.0774 20.9393 12.8425 20.9393 12.5726C20.9393 12.2352 20.8218 11.949 20.5869 11.7141C20.352 11.4767 19.9796 11.358 19.4697 11.358H17.7152V13.9072ZM24.5814 10.5332V18.2109H23.6516V10.5332H24.5814Z"
                fill="white"
              />
            </svg>

            <label className="p-1" style={{ fontWeight: 600 }}>
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
                {fileResult?.mbi ? getMastData(fileResult?.mbi) : "--"}
              </Tooltip>
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
            <h6
              id="patient-age-value"
              name="patient-age-value"
              className="px-4"
            >
              {fileResult?.dob ? calculateAge(fileResult?.dob) : "--"}
            </h6>
          </div>
          <div className="col-3" id="file-name" name="file-name">
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
                  {truncateString(fileResult?.fileName, 8)}
                </Tooltip>
              ) : (
                "--"
              )}
            </h6>
          </div>
          <div className="col-4 " id="date-of-birth" name="date-of-birth">
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
              <h6 id="gender-value" name="gender-value" className="px-2">
                {fileResult?.gender || "--"}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
