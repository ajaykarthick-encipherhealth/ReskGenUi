import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";
import { getStorage } from "../../utils/storages";
export const PatientsList = async (physicianId, from, to, priority, search) => {
  const token = getStorage("token");
  const uId = getStorage("userId");

  // const filteredStatus = status === undefined ? "" : status;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiLocal}/get-patients-list/filter?physicianId=${physicianId}&from=${from}&to=${to}&priority=${priority}&search=${search}`,
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
