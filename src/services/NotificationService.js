import axios from "axios";
import ENDPOINTS from "../utility/enpoints";

export const NotificationList = async (Id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `
         ${ENDPOINTS?.apiEndoint}communication/notification/${Id}?page=${1}&limit=100`,
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


