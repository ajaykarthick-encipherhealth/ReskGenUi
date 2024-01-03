import axios from "axios";
import ENDPOINTS from "../utility/enpoints";

export const NotificationList = async (Id) => {
    var uId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `
         ${ENDPOINTS?.apiEndoint}communication/notification/`+Id,
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


