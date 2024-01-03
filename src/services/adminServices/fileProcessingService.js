import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const patientDetails = async (patientId,chartId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${ENDPOINTS?.apiEndoint}dbservice/file-process/finished/stage?patientId=${patientId}&processStageIdChart=${chartId}`,
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