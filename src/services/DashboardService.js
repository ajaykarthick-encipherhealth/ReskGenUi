import axios from "../utility/axiosConfig";
import ENDPOINTS from "../utility/enpoints";

export async function workStatusApi(startDate, endDate, router) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}management/dashboard/tile/statistics?start=${startDate}&end=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err)
  }
}

export const DailyTaskApi = async (date, router) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}management/dashboard/daily/statistics?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router?.push("/login");
    }
  }
};

export const accuracyScore = async (
  btn,
  month,
  year,
  router,
  isAdmin = false
) => {
  const token = localStorage.getItem("token");
  const url = isAdmin
    ? btn === "Daily"
      ? `daily?month=${month}&year=${year}&isAdmin=${isAdmin}`
      : btn === "Weekly"
      ? `weekly?month=${month}&year=${year}&isAdmin=${isAdmin}`
      : `monthyly?year=${year}&isAdmin=${isAdmin}`
    : btn === "Daily"
    ? `daily?month=${month}&year=${year}&isAdmin=${isAdmin}`
    : btn === "Weekly"
    ? `weekly?month=${month}&year=${year}&isAdmin=${isAdmin}`
    : `monthyly?year=${year}&isAdmin=${isAdmin}`;
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}dbservice/accuracyscore/${url}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err)
  }
};

export const CompletedScore = async (btn, date, month, year, router) => {
  const token = localStorage.getItem("token");
  const url = `year=${year}&month=${month}&date=${date}&range=${btn}`;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}management/dashboard/line/statistics?${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err)
  }
};

export const HoldStatus = async (router) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/dashboard/hold/charts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err)
  }
};

export const ChatBot = async (msg) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}aiservice/ai/chat?input=${msg}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
