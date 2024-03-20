import axios from "axios";
import { endPoint } from "./DashbaordServices";

export const COMPARISON = "COMPARISON";

export const getComparisionData =
  (physicianId = "ID-001",patientId='ID-002') =>
  async (dispatch) => {
    const token = localStorage.getItem("token");
    dispatch({
      type: COMPARISON,
      payload: {
        loading: true,
        data: null,
      },
    });
    try {
      const response = await axios.get(
        `${endPoint}comparison?physicianId=${physicianId}&patientId=${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch({
          type: COMPARISON,
          payload: {
            loading: false,
            data: response.data,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

