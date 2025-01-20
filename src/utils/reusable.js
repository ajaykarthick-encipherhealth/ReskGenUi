import { notification } from "antd";
import moment from "moment";
import dayjs from "dayjs";
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

  const resultArray = dates.map((date) => formatobj[formatDate(date)] || 0);
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

export const emrTypeOptions=[
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
]

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


