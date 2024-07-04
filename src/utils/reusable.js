import { notification } from "antd";

export const getResponePopup = (res) => {
  switch (res?.data?.status ? res?.data?.status : res?.status) {
    case "USER_DEFINED_ERROR":
      return notification.warning({
        description: res?.data?.message ? res?.data?.message : res?.status,
        duration: 1,
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
  if(value){
    return value.split('').splice(0,3).join('') + "xxxx"
  }
}