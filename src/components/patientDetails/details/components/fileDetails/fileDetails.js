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
      <div className={styles.detailsCardHcc}>
        <div className="row" style={{ lineHeight: "0" }}>
          <div className="col-4">
            <FontAwesomeIcon icon={faIdCardClip} style={{ color: "#241571" }} />
            <label className="px-2" style={{ fontWeight: 600 }}>
              Patient ID
            </label>
            <h6
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
          <div className="col-5">
            <FontAwesomeIcon icon={faUserCircle} style={{ color: "#241571" }} />

            <label className="px-2" style={{ fontWeight: 600 }}>
              Patient Name
            </label>
            <h6 className="px-4">
              {fileResult?.patientName
                ? getMastData(fileResult?.patientName)
                : "--"}
            </h6>
          </div>
          <div className="col-3">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ color: "#241571" }}
            />
            <label className="px-2" style={{ fontWeight: 600 }}>
              Age
            </label>
            <h6 className="px-4">{fileResult?.dob?calculateAge(fileResult?.dob) : "--"}</h6>
          </div>
          <div className="col-4 ">
            <FontAwesomeIcon icon={faFile} style={{ color: "#241571" }} />
            <label className="px-2" style={{ fontWeight: 600 }}>
              File Name
            </label>
            <h6
              className="px-2"
              style={{
                // paddingLeft: "25px",
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
          <div className="col-5">
            <i className={styles.dob_icon}>{SVGICON.DatebirthIcon}</i>
            <label className="px-2" style={{ fontWeight: 600 }}>
             Date Of Birth   
            </label>
            <h6 className="px-4">
            {fileResult?.dob ? dayjs(fileResult.dob).format("MM-DD-YYYY") : "---"}
            </h6>
          </div>
          <div className="col-3">
            <FontAwesomeIcon icon={faVenusMars} style={{ color: "#241571" }} />
            <label
              className="px-2 font-weight-bold"
              style={{ fontWeight: 600 }}
            >
              Gender
            </label>
            <h6 className="px-4">{fileResult?.gender || "--"}</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
