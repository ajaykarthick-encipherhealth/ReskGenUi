import { notification } from "antd";
import moment from "moment";

export const getResponePopup = (res) => {
  switch (res?.data?.status ? res?.data?.status : res?.status) {
    case "USER_DEFINED_ERROR":
      return notification.warning({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 2,
      });
    case "SUCCESS":
      return notification.success({
        description: res?.data?.message ? res?.data?.message : res?.status,
        duration: 1,
      });
    case "FAILED":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.status,
        duration: 1,
      });
    case "EXCEPTION":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.status,
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

// export function formatValues(values, dates) {
//   const formatobj = {};
//   if (values?.length) {
//     values &&
//       values.forEach((key, i) => {
//         const formattedKey = formatDate(Object?.keys(key)?.[0]);
//         let count = values[i];
//         formatobj[formattedKey] = count[Object?.keys(key)?.[0]];
//       });
//   }
//    else {
//     values &&
//       Object?.keys(values).forEach((key) => {
//         const formattedKey = formatDate(key);
//         formatobj[formattedKey] = values[key];
//       });
//   }
//   const resultArray = dates?.map((date) => formatobj[date] || 0);
//   return resultArray;

// }

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
