import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";
import { getStorage } from "../../utils/storages";

export const patientDetails = async (patientId,chartId) => {
    const token = getStorage("token");
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