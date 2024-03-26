import axios from "axios";
import dayjs from "dayjs";

export const endPoint = "http://localhost:8080/";

export const DASHBOARDCHART = "DASHBOARDCHART";
export const GRAPHDATA = "GRAPHDATA";
export const CALENDER = "CALENDER";

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
  (physicianId, currentBtn, selectedMonth, selectedYear) =>
  async (dispatch) => {
    const token = localStorage.getItem("token");
    dispatch({
      type: GRAPHDATA,
      payload: {
        loading: true,
        data: null,
      },
    });
    const currentdate = dayjs().format("DD");
    try {
      const response = await axios.get(
        `${endPoint}statistics?physicianId=${physicianId}&year=${selectedYear}&month=${selectedMonth}&date=${currentdate}&range=${currentBtn}`,
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

export const CalenderData = (physicianId, month, year) => async (dispatch) => {
  const token = localStorage.getItem("token");
  dispatch({
    type: CALENDER,
    payload: {
      loading: true,
      data: null,
    },
  });
  try {
    const response = await axios.get(
      `${endPoint}calender?physicianId=${physicianId}&month=${month}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: CALENDER,
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
