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
import { useWindowWidth } from "../../../../../commonPages/dashboard/component/function";

const Details = ({ fileResult, fromHcc, fileDetails }) => {
  const size = useWindowWidth()
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
  const getHeaderData = [
    {
      title: "Patient ID",
      value: fileResult?.patientId || "---",
      icon: faIdCardClip,
      isMask: true,
      isCopyed: true,
      isSvg: false,
    },
    {
      title: "Patient Name",
      value: fileResult?.patientName || "---",
      icon: faUserCircle,
      isMask: true,
      isCopyed: true,
      isSvg: false,
    },
    {
      title: "MBI",
      value: fileResult?.mbi || "---",
      icon: faIdCard,
      isMask: true,
      isCopyed: true,
      isSvg: false,
    },
    {
      title: "Age",
      value: calculateAge(fileResult?.dob) || "---",
      icon: faCalendarAlt,
      isMask: false,
      isCopyed: false,
      isSvg: false,
    },
    {
      title: "File Name",
      value: fileResult?.fileName || "---",
      icon: faFile,
      isMask: true,
      isCopyed: true,
      isSvg: false,
    },
    {
      title: "Date Of Birth",
      value: fileResult?.dob
        ? formatDateTime({ date: fileResult.dob })?.replace(/\d{4}$/, "xxxx")
        : "---",
      icon: <i className={styles.dob_icon}>{SVGICON.DatebirthIcon}</i>,
      isMask: false,
      isCopyed: true,
      isSvg: true,
    },
    {
      title: "Gender",
      value: fileResult?.gender || "---",
      icon: faVenusMars,
      isMask: false,
      isCopyed: false,
      isSvg: false,
    },
    {
      title: "Face to Face",
      value: fileDetails?.faceToFace ? "Yes" : "No",
      icon: SVGICON.faceToface,
      isMask: false,
      isCopyed: false,
      isSvg: true,
    },
    {
      title: "Visit Type",
      value: fileDetails?.visitType || "---",
      icon: SVGICON.visitType,
      isMask: false,
      isCopyed: false,
      isSvg: true,
    },
  ];
  
  return (
    <>
      <div
        id="detailsCardHcc"
        name="detailsCardHcc"
        className={styles.detailsCardHcc}
      > 
        <div className={size <= 1130 ? "row" : "d-flex gap-3 justify-content-between"}>
          {getHeaderData.map((item) => (
            <div className={size <= 1130 ? "col-2" : ""} id="patient-id" name="patient-id">
              {item.isSvg ? (
                item.icon
              ) : (
                <FontAwesomeIcon
                  icon={item.icon}
                  style={{ color: "#241571" }}
                />
              )}
              <label className="px-1 m-0" style={{ fontWeight: 600 }}>
                {item.title}
              </label>
              <h6
                id={item.title.replaceAll(" ", "-").toLowerCase()}
                name={item.title.replaceAll(" ", "-").toLowerCase()}
                className="px-4 cursor-pointer"
                onClick={() =>
                  item.isCopyed &&
                  handleCopyToClipboard({
                    text: item.value,
                    setCopied: setCopied,
                  })
                }
              >
                {item.isMask ? (
                  <Tooltip title={item.value}>
                    {item.value && item.value !== "---"
                      ? getMastData(item.value)
                      : "---"}
                  </Tooltip>
                ) : (
                  item.value
                )}
              </h6>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Details;
