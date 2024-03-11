import axios from "axios";
import ENDPOINTS from "../utility/enpoints";

export const NotificationList = async (Id) => {
  const token = localStorage.getItem("token");
  const userId= localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `
         ${
           ENDPOINTS?.apiEndoint
         }communication/notification/${userId}?page=${0}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.response;
  } catch (err) {
    console.log(err);
  }
};

export const postNotification = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}communication/push-notifications/admin/send`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getNotificationList = async (Id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `
         ${ENDPOINTS?.apiEndoint}communication/push-notifications/get/sentnotification`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
