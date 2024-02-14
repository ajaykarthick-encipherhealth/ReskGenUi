import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

// chnaged
export const TEAM_CHART = "TEAM_CHART";
export const TeamChart = (router) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  try {
    dispatch({
      type: TEAM_CHART,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.get(
      `${ENDPOINTS.apiEndoint}dbservice/admindashboard/teamchart?orgId=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: TEAM_CHART,
        payload: {
          loading: false,
          data: response.data,
        },
      });
    }
  } catch (err) {
    if (err?.response?.status === 401) {
      router?.push("/login");
    }
  }
};
