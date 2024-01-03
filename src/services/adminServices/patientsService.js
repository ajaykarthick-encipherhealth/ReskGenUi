import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const PatientsList = async (pageNo,pageSize) => {
    const token = localStorage.getItem("token");
    const uId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${ENDPOINTS.apiEndoint}dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  };