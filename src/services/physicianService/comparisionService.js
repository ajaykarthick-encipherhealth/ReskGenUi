import axios from "axios";
import { endPoint } from "./DashbaordServices";
import ENDPOINTS from "../../utility/enpoints";

export const COMPARISON = "COMPARISON";
export const COLORS = "COLORS";

export const getComparisionData =
  (physicianId, patientId) => async (dispatch) => {
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

export const getColors = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  dispatch({
    type: COLORS,
    payload: {
      loading: true,
      data: null,
    },
  });
  try {
    const response = await axios.get(
      `${ENDPOINTS.apiEndoint}dbservice/section/color/getallsections`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: COLORS,
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
