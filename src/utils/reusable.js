import {
  Badge,
  Button,
  message,
  notification,
  Popover,
  Skeleton,
  Tooltip,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import Pending from "../../src/images/trackingImages/pending.webp";
import Hold from "../../src/images/trackingImages/hold.webp";
import Completed from "../../src/images/trackingImages/completed.webp";
import Declined from "../../src/images/trackingImages/declined.webp";
import Abort from "../../src/images/trackingImages/abort.webp";
import Image from "next/image";
import AuditedTrack from "../../src/images/trackingImages/audited.webp";
import NotAudited from "../../src/images/trackingImages/notaudited.webp";
import AuditHold from "../../src/images/trackingImages/audithold.webp";
import ReAudit from "../../src/images/trackingImages/reaudited.webp";
import AuditPending from "../../src/images/trackingImages/auditpending.webp";
import AuditeDeclineTrack from "../../src/images/trackingImages/auditdeclined.webp";
import {
  renderUserPrfoileAvatar,
  renderUserPrfoileAvatarDisabled,
} from "../components/headerFilters/functions";
import momentTimezone from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getStorage } from "./storages";
import SvgFlag from "../components/patientDetails/details/components/svg/svg";
import { ssoLogout } from "../../lib/authService";
import { useRouter } from "next/router";
import { toFixedNum } from "../../src/commonPages/dashboard/component/function";

export const getResponePopup = (res) => {
  switch (res?.data?.status ? res?.data?.status : res?.status) {
    case "USER_DEFINED_ERROR":
      return notification.warning({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 3,
      });
    case "SUCCESS":
      return notification.success({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 2,
      });
    case "FAILED":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 2,
      });
    case "EXCEPTION":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 3,
      });
    case "CUSTOM_EXCEPTION":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 2,
      });
    default:
      break;
  }
};

export const getYears = () => {
  const currentYear = new Date().getFullYear();
  let year = [];
  for (let i = 2016; i < currentYear + 1; i++) {
    year.push({ label: i, value: i });
  }
  return year;
};

export const getMaskData = (value) => {
  if (value) {
    return value.split("").splice(0, 3).join("") + "xxxx";
  }
};

//format date (eg.sep01 -> sept1)
export const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toLocaleString("default", { month: "short" }) + date.getDate()
  );
}

export function getLast30Days() {
  const date_thirty_days = [];
  const currentDate = new Date();

  for (let i = 0; i < 30; i++) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i);
    date_thirty_days.push(
      pastDate.toLocaleString("default", { month: "short" }) +
        pastDate.getDate()
    );
  }

  return date_thirty_days.reverse();
}

export function getLast7Days() {
  const date_seven_days = [];
  const currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i);
    date_seven_days.push(
      pastDate.toLocaleString("default", { month: "short" }) +
        pastDate.getDate()
    );
  }

  return date_seven_days.reverse();
}

export const getAllDatesInRange = (start, end) => {
  const dates = [];
  let currentDate = moment(start);

  while (currentDate.isSameOrBefore(end)) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "days");
  }

  return dates;
};

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.?0+$/, "") + "M";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(2).replace(/\.?0+$/, "") + "L";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2).replace(/\.?0+$/, "") + "K";
  } else {
    return num?.toString();
  }
}

export const dateFormatForDashboard = (date) => {
  return moment(date).format("MMM") + moment(date).format("D");
};

export function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return month + day;
}

export function formatValues(values, dates) {
  const formatobj = {};

  if (Array.isArray(values)) {
    values.forEach((obj) => {
      const key = Object.keys(obj)[0];
      const formattedKey = formatDate(key);
      formatobj[formattedKey] = obj[key];
    });
  } else if (values && typeof values === "object") {
    Object.keys(values).forEach((key) => {
      const formattedKey = formatDate(key);
      formatobj[formattedKey] = values[key];
    });
  }
  let resultArray = [];
  if (dates.length === 1) {
    const singleDate = dates[0];
    const nextDate = new Date(singleDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const currentFormatted = formatDate(singleDate);
    const nextFormatted = formatDate(nextDate);

    resultArray = [
      formatobj[currentFormatted] || 0,
      formatobj[nextFormatted] || 0,
    ];
  } else {
    resultArray = dates.map((date) => formatobj[formatDate(date)] || 0);
  }

  return resultArray;
}

export const getAge = (dob) => {
  if (dob) {
    const diff = new Date() - new Date(dob);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }
};

export const validateFileName = (fileName) => {
  // Regular expression to detect double extensions
  const doubleExtensionPattern = /\.[^/.]+(\.[^/.]+)$/;
  return !doubleExtensionPattern.test(fileName);
};

export const emrTypeOptions = [
  { label: "ADSC", value: "ADSC" },
  { label: "Advanced MD", value: "Advanced MD" },
  { label: "Amazing Charts", value: "Amazing Charts" },
  { label: "Aprima", value: "Aprima" },
  { label: "Athena", value: "Athena" },
  { label: "Allegiance MD", value: "Allegiance MD" },
  { label: "Bizmatics", value: "Bizmatics" },
  { label: "Cronos", value: "Cronos" },
  { label: "DR RIAZ U HAQUE MD", value: "DR RIAZ U HAQUE MD" },
  { label: "Eclinicalworks", value: "Eclinicalworks" },
  { label: "EMD", value: "EMD" },
  { label: "EpicCare", value: "EpicCare" },
  { label: "Glenwood Systems", value: "Glenwood Systems" },
  { label: "Happy MD", value: "Happy MD" },
  { label: "Insync", value: "Insync" },
  { label: "IPatientCare", value: "IPatientCare" },
  { label: "NextGen", value: "NextGen" },
  { label: "PointClickCare", value: "PointClickCare" },
  { label: "Paper", value: "Paper" },
  { label: "Power to Practice", value: "Power to Practice" },
  { label: "Practice Fusion", value: "Practice Fusion" },
  { label: "Prognosis", value: "Prognosis" },
  { label: "Tebra", value: "Tebra" },
  { label: "Term SVR", value: "Term SVR" },
  {
    label: "Aprima Facility Portal",
    value: "Aprima Facility Portal",
  },
  { label: "Micro MD", value: "Micro MD" },
  { label: "IMS", value: "IMS" },
  { label: "Other", value: "Other" },
];

export const disabledDate = (
  currentDate,
  selectedDates = [],
  allowFuture = false
) => {
  const today = dayjs().endOf("day");
  const [startDate, endDate] = Array.isArray(selectedDates)
    ? selectedDates
    : [null, null];

  const startDay = startDate ? dayjs(startDate) : null;
  const endDay = endDate ? dayjs(endDate) : null;

  if (!allowFuture && currentDate && currentDate.isAfter(today, "day")) {
    return true;
  }
  if (startDay && !endDay) {
    return currentDate && currentDate.isBefore(startDay, "day");
  }
  if (endDay && !startDay) {
    return currentDate && currentDate.isAfter(endDay, "day");
  }
  if (startDay && endDay) {
    return (
      currentDate &&
      (currentDate.isBefore(startDay, "day") ||
        currentDate.isAfter(endDay, "day"))
    );
  }
  return false;
};

export const getSpacesWithUnderscoresAuditing = (value) => {
  if (value) {
    if (value == "AUDIT PENDING" || value == "AUDIT DECLINED") {
      return value.split(" ").join("_");
    } else if (value == "AUDIT HOLD" || value == "RE AUDIT") {
      return value.split(" ").join("");
    } else {
      return value;
    }
  }
};
export const reusableEllipses = ({ str, count }) => {
  if (str?.length > count) {
    return (
      <Tooltip placement="top" title={str}>
        {`${str?.substring(0, count)}...`}
      </Tooltip>
    );
  } else {
    return str;
  }
};
export const tableSkeleton = ({ rows = 1, columns = 1 }) => (
  <div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} id="badge">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton.Input key={colIndex} active />
        ))}
      </div>
    ))}
  </div>
);

export function extractLatestData(notes) {
  let declinedData;

  if (notes && typeof notes === "object") {
    const entries = Object.entries(notes);

    const latestKey = Math.max(...entries.map(([key, value]) => parseInt(key)));

    entries.forEach(([key, value]) => {
      if (parseInt(key) === latestKey) {
        declinedData = value;
      }
    });
  }

  return declinedData;
}
export const processstatusBodyTemplate = (rowData) => {
  const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

  switch (rowData) {
    case "COMPLETED":
      return (
        <Popover placement="bottom" title="Status: COMPLETED">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Completed} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );

    case "PENDING":
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Pending} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );

    case "DECLINED":
      return (
        <Popover
          placement="bottom"
          title="Status: DECLINED"
          content={`Reason: ${
            declinedDataFromDeclined ? declinedDataFromDeclined : "---"
          }`}
        >
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Declined} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "NOTCOMPUTED":
      return (
        <Popover placement="bottom" title="Status: NOT COMPUTED">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Pending} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "COMPUTED":
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Pending} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "PROCESSING":
      return (
        <Popover placement="bottom" title="Status: PROCESSING">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              style={{ height: "30px", width: "30px", color: "orange" }}
              icon={faSpinner}
            />
          </div>
        </Popover>
      );
    case "HOLD":
      return (
        <Popover placement="bottom" title="Status: HOLD">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Hold} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "ABORTED_BY_CRON":
      return (
        <Popover placement="bottom" title="Status: ABORTED BY CRON">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Abort} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case null:
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Pending} style={{ height: "15%", width: "15%" }} />
          </div>
        </Popover>
      );
  }
};
export const processStatusBodyTemplate = (rowData) => {
  const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

  switch (rowData) {
    case "COMPLETED":
      return (
        <Popover placement="bottom" title="Status: COMPLETED">
          <div
            className="patient-status"
            style={{ textAlign: "center", color: "#05bf35" }}
          >
            COMPLETED
          </div>
        </Popover>
      );

    case "PENDING":
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <div
            className="patient-status"
            style={{ textAlign: "center", color: "#027bd3" }}
          >
            PENDING{" "}
          </div>
        </Popover>
      );

    case "DECLINED":
      return (
        <Popover
          placement="bottom"
          title="Status: DECLINED"
          content={`Reason: ${
            declinedDataFromDeclined ? declinedDataFromDeclined : "---"
          }`}
        >
          <div
            className="patient-status"
            style={{ textAlign: "center", color: "#ff4b4a" }}
          >
            DECLINED{" "}
          </div>
        </Popover>
      );
    case "NOTCOMPUTED":
      return (
        <Popover placement="bottom" title="Status: NOT COMPUTED">
          <div
            className="patient-status"
            style={{ textAlign: "center", color: "#c96c61" }}
          >
            NOT COMPUTED{" "}
          </div>
        </Popover>
      );
    case "COMPUTED":
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <div
            className="patient-status"
            style={{ textAlign: "center", color: "#055673" }}
          >
            COMPUTED{" "}
          </div>
        </Popover>
      );
    case "PROCESSING":
      return (
        <Popover placement="bottom" title="Status: PROCESSING">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <FontAwesomeIcon
              style={{ height: "30px", width: "30px", color: "orange" }}
              icon={faSpinner}
            />
          </div>
        </Popover>
      );
    case "HOLD":
      return (
        <Popover placement="bottom" title="Status: HOLD">
          <div className="patient-status" style={{ textAlign: "center" }}>
            COMPUTED{" "}
          </div>
        </Popover>
      );
    case "ABORTED_BY_CRON":
      return (
        <Popover placement="bottom" title="Status: ABORTED BY CRON">
          <div
            className="patient-status"
            style={{ textAlign: "center", color: "#453c8b" }}
          >
            ABORTED BY CRON{" "}
          </div>
        </Popover>
      );
    case null:
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <div className="patient-status" style={{ textAlign: "center" }}>
            PENDING
          </div>
        </Popover>
      );
  }
};

export const proxyStatusBodyTemplate = (rowData) => {
  const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);
  const proxyRole = getStorage("proxyRole");

  switch (rowData) {
    case "CODER_1_COMPLETED":
      return (
        <Popover placement="bottom" title={`${proxyRole} - COMPLETED`}>
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Completed} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "CODER_1_PENDING":
      return (
        <Popover placement="bottom" title={`${proxyRole} - PENDING`}>
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Pending} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "CODER_1_DECLINED":
      return (
        <Popover placement="bottom" title="Status: CODER 1 DECLINED">
          <div className="patient-status" title={`${proxyRole} - DECLINED`}>
            <Image src={Declined} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "CODER_1_HOLD":
      return (
        <Popover placement="bottom" title={`${proxyRole} - HOLD`}>
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Hold} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case "COMPUTED":
      return (
        <Popover placement="bottom" title={`${proxyRole} - PENDING`}>
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Pending} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
    case null:
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Pending} style={{ height: "15%", width: "15%" }} />
          </div>
        </Popover>
      );
  }
};

export const formatDateTime = ({ date, formatType = "date" }) => {
  if (!date) return "";
  const dateType = formatType == "date" ? "MM/DD/YYYY" : "MM/DD/YYYY h:mm a";
  if (!date) return date;
  const time = momentTimezone(date);
  const offset = momentTimezone.tz
    .zone(momentTimezone.tz.guess())
    .utcOffset(time);
  let adjustedTime = time.clone().subtract(offset, "minutes").toISOString();
  return momentTimezone.utc(adjustedTime).format(dateType);
};

export const formatDateForIndex = ({ date, index }) => {
  if (!date) return "";

  const formattedDate = moment(date).format("YYYY-MM-DD");
  const dateFormat =
    index === 1
      ? `${formattedDate}T23:59:59.999Z`
      : `${formattedDate}T00:00:00.000Z`;
  if (!dateFormat) return dateFormat;
  const time = momentTimezone(dateFormat);
  const offset = momentTimezone.tz
    .zone(momentTimezone.tz.guess())
    .utcOffset(time);
  const adjustedTime = time.clone().add(offset, "minutes");

  return adjustedTime.toISOString();
};

export const renderUserProfile = (data, columnItem) => {
  const compareObj = data[columnItem?.actualField];

  if (
    compareObj?.firstName ||
    compareObj?.lastName ||
    compareObj?.profileImage
  ) {
    return (
      <div
        className="d-flex align-items-center text-truncate"
        style={{ width: "100%", margin: "auto" }}
      >
        <span style={{ marginRight: "10px" }}>
          {renderUserPrfoileAvatar(
            compareObj?.firstName || compareObj?.firstName,
            compareObj?.lastName || compareObj?.lastName,
            compareObj?.profileImage || compareObj?.profileImage,
            "header"
          )}
        </span>
        <span>
          {compareObj?.firstName || compareObj?.firstName}{" "}
          {compareObj?.lastName || compareObj?.lastName}
        </span>
      </div>
    );
  }
  return <div style={{ textAlign: "center" }}>---</div>;
};

export const renderUserProfileDisable = (data, columnItem) => {
  const compareObj = columnItem?.fromObject
    ? data[columnItem?.fromObject] || data
    : data;

  if (
    compareObj[columnItem?.value?.first] ||
    compareObj[columnItem?.value?.last] ||
    compareObj[columnItem?.value?.img] ||
    compareObj[columnItem?.value1?.first] ||
    compareObj[columnItem?.value1?.last] ||
    compareObj[columnItem?.value1?.img]
  ) {
    return (
      <div
        className="d-flex align-items-center text-truncate"
        style={{ width: "95%", margin: "auto" }}
      >
        <span style={{ marginRight: "10px" }}>
          {renderUserPrfoileAvatarDisabled(
            compareObj[columnItem?.value?.first] ||
              compareObj[columnItem?.value1?.first],
            compareObj[columnItem?.value?.last] ||
              compareObj[columnItem?.value1?.last],
            compareObj[columnItem?.value?.img] ||
              compareObj[columnItem?.value1?.img],
            "header"
          )}
        </span>
        <span>
          {compareObj[columnItem?.value?.first] ||
            compareObj[columnItem?.value1?.first]}{" "}
          {compareObj[columnItem?.value?.last] ||
            compareObj[columnItem?.value1?.last]}
        </span>
      </div>
    );
  }
  return <div style={{ textAlign: "center" }}>---</div>;
};
export const auditStatusTemplate = (rowData) => {
  const declinedDataFromAudit = extractLatestData(rowData?.auditDeclinedNotes);
  const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);
  const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
  switch (rowData) {
    case "AUDIT_PENDING":
      return (
        <Popover placement="bottom" title="Status: AUDIT PENDING">
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image
              src={AuditPending}
              style={{ height: "30px", width: "30px" }}
            />
          </span>
        </Popover>
      );

    case "AUDITHOLD":
      return (
        <Popover placement="bottom" title="Status: AUDIT HOLD">
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image src={AuditHold} style={{ height: "30px", width: "30px" }} />
          </span>
        </Popover>
      );
    case "REAUDIT":
      return (
        <Popover placement="bottom" title="Status: REAUDIT">
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image src={ReAudit} style={{ height: "30px", width: "30px" }} />
          </span>
        </Popover>
      );
    case "AUDITED":
      return (
        <Popover placement="bottom" title="Status: AUDITED">
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image
              src={AuditedTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </span>
        </Popover>
      );
    case "AUDIT_DECLINED":
      return (
        <Popover
          placement="bottom"
          title="Status: AUDIT DECLINED"
          content={`Reason: ${declinedData ? declinedData : "---"}`}
        >
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image
              src={AuditeDeclineTrack}
              style={{ height: "30px", width: "30px" }}
            />
          </span>
        </Popover>
      );
    case "AUDITED":
      return (
        <span className="patient-status" style={{ textAlign: "center" }}>
          <Image src={AuditedTrack} style={{ height: "30px", width: "30px" }} />
        </span>
      );
    case "NOT_AUDIT":
      return (
        <Popover placement="bottom" title=" Status: NOT AUDIT">
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image src={NotAudited} style={{ height: "30px", width: "30px" }} />
          </span>
        </Popover>
      );
    case null:
      return (
        <span className="patient-status" style={{ textAlign: "center" }}>
          ---
        </span>
      );
  }
};
export const dynamicAuditStatusTemplate = (rowData) => {
  const declinedDataFromAudit = extractLatestData(rowData?.auditDeclinedNotes);
  const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);
  const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
  switch (rowData) {
    case "AUDIT_PENDING":
      return (
        <Popover placement="bottom" title="Status: AUDIT PENDING">
          <span
            className="patient-status"
            style={{ textAlign: "center", color: "#bf437f" }}
          >
            AUDIT PENDING
          </span>
        </Popover>
      );

    case "AUDITHOLD":
      return (
        <Popover placement="bottom" title="Status: AUDIT HOLD">
          <span
            className="patient-status"
            style={{ textAlign: "center", color: "#ce9900" }}
          >
            AUDIT HOLD{" "}
          </span>
        </Popover>
      );
    case "REAUDIT":
      return (
        <Popover placement="bottom" title="Status: REAUDIT">
          <span
            className="patient-status"
            style={{ textAlign: "center", color: "#ce9900" }}
          >
            REAUDIT{" "}
          </span>
        </Popover>
      );
    case "AUDITED":
      return (
        <Popover placement="bottom" title="Status: AUDITED">
          <span
            className="patient-status"
            style={{ textAlign: "center", color: "#377880" }}
          >
            AUDITED
          </span>
        </Popover>
      );
    case "AUDIT_DECLINED":
      return (
        <Popover
          placement="bottom"
          title="Status: AUDIT DECLINED"
          content={`Reason: ${declinedData ? declinedData : "---"}`}
        >
          <span
            className="patient-status"
            style={{ textAlign: "center", color: "#377880" }}
          >
            AUDIT DECLINED
          </span>
        </Popover>
      );
    case "AUDITED":
      return (
        <span
          className="patient-status"
          style={{ textAlign: "center", color: "#4aa0aa" }}
        >
          AUDITED{" "}
        </span>
      );
    case "NOT_AUDIT":
      return (
        <Popover placement="bottom" title=" Status: NOT AUDIT">
          <span
            className="patient-status"
            style={{ textAlign: "center", color: "#ea8f2a" }}
          >
            NOT AUDIT{" "}
          </span>
        </Popover>
      );
    case null:
      return (
        <span className="patient-status" style={{ textAlign: "center" }}>
          ---
        </span>
      );
  }
};

export const createIdGen = (key) => {
  if (key) {
    return key.trim().toLowerCase().replaceAll(" ", "-");
  } else {
    return key;
  }
};

export const getRoasterStatus = (status) => {
  switch (status) {
    case "SUCCESS":
      return <Button className={` px-3 py-1`}>SUCCESS</Button>;

    case "FAILED":
      return <Button className={` px-3 py-1`}>FAILED</Button>;

    default:
      return <div className={`px-3 py-1`}>FAILED</div>;
  }
};

export const handleCopyTextInput = (info) => {
  if (info) {
    navigator.clipboard
      .writeText(info)
      .then(() => {
        message.success("Text copied to clipboard");
      })
      .catch((err) => {
        message.error("Failed to copy text: ", err);
      });
  }
};
export const priorityStatusRender = (status) => {
  switch (status?.toLowerCase()) {
    case "high":
      return (
        <div className="d-flex align-items-center">
          <div className={`${tinStyles.highPriority}`}></div> &nbsp;{status}
        </div>
      );
    case "medium":
      return (
        <div className="d-flex align-items-center">
          <div className={`${tinStyles.mediumPriority}`}></div> &nbsp;{status}
        </div>
      );
    case "low":
      return (
        <div className="d-flex align-items-center">
          <div className={`${tinStyles.lowPriority}`}></div> &nbsp;{status}
        </div>
      );

    default:
      return "--";
  }
};

export const getAccessTabItems = ({ page, tabsMenu }) => {
  const accessMenuList = JSON.parse(getStorage("accessMenuList"));
  const currentTabs = accessMenuList?.find((item) => item?.title === page);
  return currentTabs?.[tabsMenu];
};

export const findItemWithTrueKey = (dataArray, fieldName) => {
  const item = dataArray?.find((item) => item.actualField === fieldName);
  if (item?.actualField === fieldName) {
    return true;
  } else {
    return false;
  }
};

export const findItemWithTrueOrFalse = (design, key) => {
  return design?.includes(key);
};
export const renderFlagCells = (data) => {
  if (!data?.flagList || data.flagList.length === 0) {
    return (
      <Tooltip title="No flag found">
        <span>
          <SvgFlag fillColor={"transparent"} />
        </span>
      </Tooltip>
    );
  }

  const sortedFlags = [...data.flagList].sort((a, b) => {
    if (a.priority === null) return 1;
    if (b.priority === null) return -1;
    return a.priority - b.priority;
  });

  const priorityFlag = sortedFlags[0];

  return (
    <Popover
      content={
        <div
          className="ant-badge"
          style={{ height: "auto", overflow: "scroll" }}
        >
          <strong>Flag details</strong>
          {data.flagList.map((flag, flagIndex) => (
            <div key={flagIndex}>
              <span className="p-1 ant-badge">
                <SvgFlag fillColor={flag?.flagColour} />
              </span>
              {flag?.flagName.replaceAll("_", " ")}
            </div>
          ))}
        </div>
      }
      placement="right"
    >
      <Badge
        className="ant-badge"
        count={data.flagList.length}
        offset={[5, 5]}
        size="small"
        style={{
          right: "2px",
          marginTop: "2px",
          background: "#04306f",
          cursor: "default",
        }}
      >
        <span className="ant-badge">
          <SvgFlag
            className="ant-badge"
            fillColor={priorityFlag?.flagColour || "transparent"}
          />
        </span>
      </Badge>
    </Popover>
  );
};
export const logoutFunction = async ({ router, azureLogout }) => {
  Swal.fire({
    title: "Warning!",
    text: "Do you want Logout!",
    icon: "warning",
    confirmButtonText: "Logout",
    showCancelButton: true,
    confirmButtonColor: "var(--logoutBtn)",
    closeOnConfirm: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      // removeStorage();
      // azureLogout && azureLogout.logoutRedirect({
      //   postLogoutRedirectUri: window.location.origin, // Redirect to home/login page after logout
      // })
      ssoLogout();
      router.push("/projects");
    }
  });
};

export const generateOptionsObject = (items) => {
  if (items?.length > 0) {
    const options = [
      ...items?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })),
    ].filter(Boolean);
    return options;
  } else {
    return [];
  }
};

export const generateOptions = (items) => {
  if (items?.length > 0) {
    const options = [
      ...items?.map((item) => ({
        label: item,
        value: item,
      })),
    ].filter(Boolean);
    return options;
  } else {
    return [];
  }
};

export const convertToCustomParams = (obj) => {
  const keys = Object.keys(obj);
  if (keys.length === 0) return "";
  const restParams = keys
    .filter((key) => obj[key] !== undefined && obj[key] !== null)
    .map((key) => `&${key}=${obj[key]}`)
    .join("");
  return restParams;
};

export const convertToCustomParamsDatePicker = (obj) => {
  let params = "";

  Object.entries(obj).forEach(([key, value]) => {
    // let keyValue = key;
    if (typeof value === "object" && value !== null) {
      const { startDate, endDate } = value;
      // if(keyValue == "computedDate"){
      //   const userRole = getStorage("userRole");
      //   keyValue = userRole.replace("_", "").toLowerCase()+"CompletedDate";
      // }
      if (startDate) {
        params += `&${key}Start=${startDate}`;
      }

      if (endDate) {
        params += `&${key}End=${endDate}`;
      }
    }
  });

  return params;
};

export const checkWithIncludesKey = (list, key) => {
  return list?.includes(key);
};

export const convertUsFormat = (indiaDate) => {
  if (!indiaDate) {
    return "---";
  }
  // Parse the date and time in IST
  const indiaTime = moment.tz(
    indiaDate,
    "YYYY-MM-DDTHH:mm:ss.SSSZ",
    "Asia/Kolkata"
  );
  // Convert the time to US Eastern Standard Time (EST)
  const usFormattedDate = indiaTime
    .clone()
    .tz("America/New_York")
    .format("MM-DD-YYYY hh:mm A");
  return usFormattedDate;
};

export const findMatchesByField = (arr1, arr2) => {
  return arr1?.some((obj1) =>
    arr2?.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2))
  );
};
export const timeLineDateAndTime = (inputDate) => {
  return moment(inputDate).format("MMMM D YYYY hh:mm A");
};

export const isStatusDisabled = (
  patientIdDetailsData,
  patientDetailsResult,
  pathname
) => {
  const dosWiseStatus =
    patientDetailsResult?.data?.response?.workflow?.[0]?.status ||
    patientDetailsResult?.data?.response?.masterAudit?.status;
  const overAllStatus =
    patientIdDetailsData?.data?.response?.workflow?.[0]?.status ||
    patientIdDetailsData?.data?.response?.masterAudit?.status;

  const disabled = dosWiseStatus !== "PENDING" || overAllStatus === "COMPLETED";
  const pathDisbaled =
    pathname.endsWith("/tenantadmin/tin/details") ||
    pathname.endsWith("/tenantadmin/project/details") ||
    pathname.endsWith("/tenantadmin/patientsync/batchfilesview");

  if (pathDisbaled) {
    return true;
  }
  return disabled;
};
export const isYearWiseDisabled = (patientDetailsResult, pathname) => {
  let returnValue = false;
  const overAllStatus =
    patientDetailsResult?.data?.response?.workflow?.[0]?.status ||
    patientDetailsResult?.data?.response?.masterAudit?.status;
  if (patientDetailsResult?.data?.response?.masterAudit?.status == "PENDING") {
    returnValue = false;
  } else {
    if (overAllStatus === "COMPLETED" || overAllStatus === "QUERIED") {
      returnValue = true;
    }
  }
  const pathDisbaled =
    pathname.endsWith("/tenantadmin/tin/details") ||
    pathname.endsWith("/tenantadmin/project/details") ||
    pathname.endsWith("/tenantadmin/patientsync/batchfilesview") ||
    pathname.endsWith("/tenantadmin/tin/tindetails/querydetails");

  if (pathDisbaled) {
    returnValue = true;
  }

  return returnValue;
};

export const getRolePanelPermission = (roles, currentRole) => {
  let findRoles = roles?.find((res) => res.details?.proxyRole === currentRole);
  if (findRoles?.details?.panelList?.panel2Name) {
    return true;
  } else {
    return false;
  }
};

export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16); // Example: 'f65c57f6-a6aa-4d8a-9f43-3c9c4f90b2c6'
  });
}
export const createIdGens = (key) => {
  const router = useRouter();
  if (key && router?.pathname) {
    return (
      key.trim().toLowerCase().replaceAll(" ", "-") +
      router.pathname.replaceAll("/", "-")
    );
  } else if (key) {
    return key.trim().toLowerCase().replaceAll(" ", "-");
  } else {
    return key;
  }
};

export const tableCustomFilterClearCheck = ({
  searchText,
  selectedDateRanges,
  selectedDates,
  selectedOption,
  setSearchText,
  setSelectedDateRanges,
  setSelectedDates,
  setSelectedOption,
  data,
}) => {
  const columnIds = new Set(data.map((col) => col.id));

  const searchTextResult = Object.fromEntries(
    Object.entries(searchText || {}).filter(([key]) => columnIds.has(key))
  );

  const selectResult = Object.fromEntries(
    Object.entries(selectedOption || {})?.filter(([key]) => columnIds.has(key))
  );

  const selectDateRangestResult = Object.fromEntries(
    Object.entries(selectedDateRanges || {}).filter(([key]) =>
      columnIds.has(key)
    )
  );

  const selectDatesResult = Object.fromEntries(
    Object.entries(selectedDates || {}).filter(([key]) => columnIds.has(key))
  );

  const noResetNeeded =
    !searchText &&
    Object.keys(selectedDateRanges).length === 0 &&
    Object.keys(selectedDates).length === 0 &&
    Object.keys(selectedOption).length === 0;

  if (noResetNeeded) {
  } else {
    setSearchText(searchTextResult);
    setSelectedDateRanges(selectDateRangestResult);
    setSelectedDates(selectDatesResult);
    setSelectedOption(selectResult);
  }

  return noResetNeeded;
};

export const getRoleIdByRole = (role) => {
  switch (role) {
    case "ADMIN":
      return "0";
    case "DOWNLOADER":
      return "1";
    case "OWNER":
      return "2";
    case "AI":
      return "3";
    case "CODER_1":
      return "4";
    case "CODER_2":
      return "5";
    case "QA":
      return "6";
    case "QA_LEAD":
      return "7";
    case "PROJECT_LEAD":
      return "8";
    case "CLIENT":
      return "9";
    default:
      return null;
  }
};

export const getColorValue = (key) => {
  switch (key) {
    case "primary":
    case "1":
      return "#064BAC";
    case "secondary":
    case "2":
      return "#5271FA";
    case "secondary2":
    case "3":
      return "#00C1FF";
    case "secondary3":
    case "4":
      return "#006DDC";
    case "secondary4":
    case "5":
      return "#008FCA";
    case "secondary5":
    case "6":
      return "#0A5EB0";
    case "secondary6":
    case "7":
      return "#8576FF";
    default:
      return null;
  }
};

export const getStatusColor = (key) => {
  switch (key) {
    case "1": // allocated
      return "#064BAC";
    case "2": //Not Allocated
      return "#5271FA";
    case "3": //Completed
      return "#00C1FF";
    case "4": //InProgress
      return "#006DDC";
    case "5": //Reassigned
      return "#008FCA";
    // case "secondary5":
    // case "6":
    //   return "#0A5EB0";
    // case "secondary6":
    // case "7":
    //   return "#8576FF";
    default:
      return null;
  }
};

export const getRoleColor = (key) => {
  switch (key) {
    case "1": // admin
      return "#064BAC";
    case "2": //coder 1
      return "#5271FA";
    case "3": //coder 2
      return "#00C1FF";
    case "4": //Qa
      return "#006DDC";
    case "5": //Qa lead
      return "#008FCA";
    case "6": //projectLead
      return "#0A5EB0";
    case "7": //owner
      return "#8576FF";
    default:
      return null;
  }
};

export const getChartTimeLine = (obj, plotConfig) => {
  const { key, value } = plotConfig;
  const tempObj = {};
  if (obj) {
    for (const i of obj) {
      tempObj[i[key]] = toFixedNum(i[value], 2);
    }
  }
  return tempObj;
};

export const statusFormate = (status) => {
  return typeof status == "string"
    ? status?.replace(/([a-z](?=[A-Z]))/g, "$1 ")
    : status;
};

export const findFirstPendingWorkflow = (responseArray) => {
  for (const item of responseArray) {
    if (item.workflow && Array.isArray(item.workflow)) {
      const hasCompleted = item.workflow.some((w) => w.status === "COMPLETED");
      const allPending = item.workflow.every((w) => w.status === "PENDING");
      if (hasCompleted) {
        continue;
      }
      if (allPending) {
        return item;
      }
    }
  }
  return null;
};
