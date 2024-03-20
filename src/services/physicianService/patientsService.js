import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";
export const endPoint = "http://localhost:8080/";
export const PatientsList = async (datas) => {
  const token = localStorage.getItem("token");
  const uId = localStorage.getItem("userId");

  // const filteredStatus = status === undefined ? "" : status;
  try {
    const response = await axios.get(
      `${endPoint}/get-patients-list/filter?physicianId=ID-001`,
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
