import axios from "axios";

export const endPoint = "http://localhost:8080/";

export const DASHBOARDCHART = "DASHBOARDCHART";

export const DashbaoudContent = (physicianId) => async (dispatch) => {
  const token = localStorage.getItem("token");
  dispatch({
    type: DASHBOARDCHART,
    payload: {
      loading: true,
      data: null,
    },
  });
  try {
    const response = await axios.get(
      `${endPoint}physician/dashboard?physicianId=ID-001`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: DASHBOARDCHART,
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
