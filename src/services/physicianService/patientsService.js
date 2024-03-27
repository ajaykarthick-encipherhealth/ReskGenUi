import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";
export const PatientsList = async (physicianId, from, to, priority, search) => {
  const token = localStorage.getItem("token");
  const uId = localStorage.getItem("userId");

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
