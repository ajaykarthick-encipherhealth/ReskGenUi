import axios from "axios";
import ENDPOINTS from "../utility/enpoints";

export const NotificationList = async (Id) => {
    var uId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `
         ${ENDPOINTS?.apiEndoint}communication/notification/c58c4c29-df4a-4c9e-9277-d58ad9b9d9d8`,
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


