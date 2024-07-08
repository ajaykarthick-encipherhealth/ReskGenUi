import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
const Details = ({ fileResult }) => {
  const getMastData = (value) => {
    if (value) {
      return value.split("").splice(0, 3).join("") + "xxxx";
    }
  };

  return (
    <>
      <div className={styles.detailsCard}>
        <div className="row" style={{ lineHeight: "0" }}>
          <div className="col-xl-4">
            <FontAwesomeIcon icon={faIdCardClip} style={{ color: "#241571" }} />
            <label>Patient ID</label>
            <h6
              className="ageDtails"
              style={{
                paddingLeft: "25px",
                cursor: "pointer",
              }}
            >
              {getMastData(fileResult?.patientId)}
            </h6>
          </div>
          <div className="col-xl-5">
            <FontAwesomeIcon icon={faUserCircle} style={{ color: "#241571" }} />

            <label>Patient Name</label>
            <h6 className="ageDtails" style={{ paddingLeft: "20px" }}>
              {getMastData(fileResult?.patientId)}
            </h6>
          </div>
          <div className="col-xl-3">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ color: "#241571" }}
            />
            <label>Age</label>
            <h6 className="ageDtails" style={{ paddingLeft: "20px" }}>
              {fileResult?.age}
            </h6>
          </div>
          <div className="col-xl-4">
            <FontAwesomeIcon icon={faFile} style={{ color: "#241571" }} />
            <label>File Name</label>
            <h6
              className="ageDtails"
              style={{
                paddingLeft: "25px",
                cursor: "pointer",
              }}
            >
              {fileResult?.fileDetailDTO?.fileName}
            </h6>
          </div>
          <div className="col-xl-5">
            <i className={styles.dob_icon}>{SVGICON.DatebirthIcon}</i>

            <label>Date Of Birth</label>
            <h6 className="ageDtails" style={{ paddingLeft: "20px" }}>
              {fileResult?.dob}
            </h6>
          </div>
          <div className="col-xl-3">
            <FontAwesomeIcon icon={faVenusMars} style={{ color: "#241571" }} />
            <label>Gender</label>
            <h6 className="ageDtails" style={{ paddingLeft: "20px" }}>
              {fileResult?.gender}
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
