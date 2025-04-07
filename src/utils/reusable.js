import { notification, Popover, Skeleton, Tooltip } from "antd";
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
import { renderUserPrfoileAvatar, renderUserPrfoileAvatarDisabled } from "../components/headerFilters/functions";
import momentTimezone from "moment-timezone";

export const getResponePopup = (res) => {
  switch (res?.data?.status ? res?.data?.status : res?.status) {
    case "USER_DEFINED_ERROR":
      return notification.warning({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 1,
      });
    case "SUCCESS":
      return notification.success({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 1,
      });
    case "FAILED":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 1,
      });
    case "EXCEPTION":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 1,
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
          <Skeleton.Input key={colIndex}   active />
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


export const proxyStatusBodyTemplate = (rowData) => {
  const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

  switch (rowData) {
    case "CODER_1_COMPLETED":
      return (
        <Popover placement="bottom" title="Status: CODER 1 COMPLETED">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Completed} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
        case "CODER_1_PENDING":
          return (
            <Popover placement="bottom" title="Status: CODER 1 PENDING">
              <div className="patient-status" style={{ textAlign: "center" }}>
                <Image src={Pending} style={{ height: "30px", width: "30px" }} />
              </div>
            </Popover>
          );
    case "CODER_1_DECLINED":
      return (
        <Popover
          placement="bottom"
          title="Status: CODER 1 DECLINED"
        >
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Declined} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
      case "CODER_1_HOLD":
      return (
        <Popover placement="bottom" title="Status: CODER 1 HOLD">
          <div className="patient-status" style={{ textAlign: "center" }}>
            <Image src={Hold} style={{ height: "30px", width: "30px" }} />
          </div>
        </Popover>
      );
      case "COMPUTED":
        return (
          <Popover placement="bottom" title="Status: CODER 1 PENDING">
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
  const dateType = formatType == "date" ? "MM-DD-YYYY" : "MM-DD-YYYY, h:mm a";
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
  const compareObj = columnItem?.fromObject
    ? data[columnItem?.fromObject] || data
    : data;

  if (
    compareObj[columnItem?.value?.first] ||
    compareObj[columnItem?.value?.last] ||
    compareObj[columnItem?.value?.img] || compareObj[columnItem?.value1?.first] ||
    compareObj[columnItem?.value1?.last] ||
    compareObj[columnItem?.value1?.img]
  ) {
    return (
      <div
        className="d-flex align-items-center text-truncate"
        style={{ width: "95%", margin: "auto" }}
      >
        <span style={{ marginRight: "10px" }}>
          {renderUserPrfoileAvatar(
            compareObj[columnItem?.value?.first] || compareObj[columnItem?.value1?.first] ,
            compareObj[columnItem?.value?.last] || compareObj[columnItem?.value1?.last] ,
            compareObj[columnItem?.value?.img] || compareObj[columnItem?.value1?.img] ,
            "header"
          )}
        </span>
        <span>
          {compareObj[columnItem?.value?.first]|| compareObj[columnItem?.value1?.first]}{" "}
          {compareObj[columnItem?.value?.last] || compareObj[columnItem?.value1?.last]}
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
  const declinedDataFromAudit = extractLatestData(
    rowData?.auditDeclinedNotes
  );
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
            <Image
              src={AuditHold}
              style={{ height: "30px", width: "30px" }}
            />
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
          <Image
            src={AuditedTrack}
            style={{ height: "30px", width: "30px" }}
          />
        </span>
      );
    case "NOT_AUDIT":
      return (
        <Popover placement="bottom" title=" Status: NOT AUDIT">
          <span className="patient-status" style={{ textAlign: "center" }}>
            <Image
              src={NotAudited}
              style={{ height: "30px", width: "30px" }}
            />
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


