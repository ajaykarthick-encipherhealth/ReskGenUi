import { notification } from "antd";

export const getResponePopup = (res) => {
  switch (res.data.status) {
    case "USER_DEFINED_ERROR":
      return notification.warning({
        description: res?.data?.message,
        duration: 1,
      });
    case "SUCCESS":
      return notification.success({
        description: res?.data?.message,
        duration: 1,
      });
    case "FAILED":
      return notification.error({
        description: res?.data?.message,
        duration: 1,
      });
      case "EXCEPTION":
      return notification.error({
        description: res?.data?.message,
        duration: 1,
      });
    default:
      break;
  }
};
