import axios from "../utility/axiosConfig";
import ENDPOINTS from "../utility/enpoints";
import { getStorage } from "../utils/storages";

export async function workStatusApi(startDate, endDate, router) {
  const token = getStorage("token");
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
  const token = getStorage("token");
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
  const token = getStorage("token");
  const role = getStorage("role");
  const url = isAdmin
    ? btn === "Daily"
      ? `daily?month=${month}&year=${year}&role=${role ? role.toUpperCase() : ""}&isAdmin=${isAdmin}`
      : btn === "Weekly"
      ? `weekly?month=${month}&year=${year}&role=${role ? role.toUpperCase() : ""}&isAdmin=${isAdmin}`
      : `monthly?year=${year}&role=${role ? role.toUpperCase() : ""}&isAdmin=${isAdmin}`
    : btn === "Daily"
    ? `daily?month=${month}&year=${year}&role=${role ? role.toUpperCase() : ""}&isAdmin=${isAdmin}`
    : btn === "Weekly"
    ? `weekly?month=${month}&year=${year}&role=${role ? role.toUpperCase() : ""}&isAdmin=${isAdmin}`
    : `monthly?year=${year}&role=${role ? role.toUpperCase() : ""}&isAdmin=${isAdmin}`;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/accuracyscore/machine/${url}`,
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
  const token = getStorage("token");
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
  const token = getStorage("token");
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
  const token = getStorage("token");
  var data = {
    input: msg,
  };
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}aiservice/ai/chat`,
      data,
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
