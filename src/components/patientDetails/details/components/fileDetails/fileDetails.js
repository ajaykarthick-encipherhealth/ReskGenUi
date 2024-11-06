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
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { Tooltip } from "antd";
import { truncateString } from "../function/ReusableFunctions";
const Details = ({ fileResult, fromHcc }) => {
  const getMastData = (value) => {
    if (value) {
      return value.split("").splice(0, 3).join("") + "xxxx";
    }
  };

  return (
    <>
      <div className={fromHcc ? styles.detailsCardHcc : styles.detailsCard}>
        <div className="row" style={{ lineHeight: "0" }}>
          <div className="col-xl-4">
            <FontAwesomeIcon icon={faIdCardClip} style={{ color: "#241571" }} />
            <label className="px-2" style={{fontWeight:600}}>Patient ID</label>
            <h6
              className="ageDtails"
              style={{
                paddingLeft: "25px",
                cursor: "pointer",
              }
              {fileResult?.patientId?getMastData(fileResult?.patientId):"--"}
            </h6>
          </div>
          <div className="col-xl-5">
            <FontAwesomeIcon icon={faUserCircle} style={{ color: "#241571" }} />

            <label className="px-2" style={{fontWeight:600}}>Patient Name</label>
            <h6 className="px-4">
              {fileResult?.patientName
                ? getMastData(fileResult?.patientName)
                : "--"}
            </h6>
          </div>
          <div className="col-xl-3">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ color: "#241571" }}
            />
            <label className="px-2" style={{fontWeight:600}}>Age</label>
            <h6 className="px-4">{fileResult?.age || "--"}</h6>
          </div>
          <div className="col-xl-4">
            <FontAwesomeIcon icon={faFile} style={{ color: "#241571" }} />
            <label className="px-2" style={{fontWeight:600}}>File Name</label>
            <h6
              className="px-3"
              style={{
                // paddingLeft: "25px",
                cursor: "pointer",
              }}
            >
              {fileResult?.fileDetailDTO?.fileName ? (
                <Tooltip title={fileResult?.fileDetailDTO?.fileName}>
                  {truncateString(fileResult?.fileDetailDTO?.fileName, 17)}
                </Tooltip>
              ) : (
                "--"
              )}
            </h6>
          </div>
          <div className="col-xl-5">
            <i className={styles.dob_icon}>{SVGICON.DatebirthIcon}</i>
            <label className="px-2" style={{fontWeight:600}}>Date Of Birth</label>
            <h6 className="px-4">
              {dayjs(fileResult?.dateOfBirth).format("MM-DD-YYYY") ||
                "MM-DD-YYYY"}
            </h6>
          </div>
          <div className="col-xl-3">
            <FontAwesomeIcon icon={faVenusMars} style={{ color: "#241571" }} />
            <label className="px-2 font-weight-bold" style={{fontWeight:600}}>Gender</label>
            <h6 className="px-4">{fileResult?.gender || "--"}</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
