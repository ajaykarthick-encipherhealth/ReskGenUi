import axios from "axios";

export const endPoint = "http://localhost:8080/";

export const DASHBOARDCHART = "DASHBOARDCHART";
export const GRAPHDATA = "GRAPHDATA";

export const DashbaoudContent =
  (physicianId = "ID-001") =>
  async (dispatch) => {
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
        `${endPoint}physician/dashboard?physicianId=${physicianId}`,
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

export const GraphContent =
  (physicianId,currentBtn, selectedMonth, selectedYear) =>
  async (dispatch) => {
    const token = localStorage.getItem("token");
    dispatch({
      type: GRAPHDATA,
      payload: {
        loading: true,
        data: null,
      },
    });
    try {
      const response = await axios.get(
        `${endPoint}statistics?physicianId=${physicianId}&year=${selectedYear}&month=${selectedMonth}&date=18&range=${currentBtn}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch({
          type: GRAPHDATA,
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
