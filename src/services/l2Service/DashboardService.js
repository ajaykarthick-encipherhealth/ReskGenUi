import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

// chnaged
export async function workStatusApi(startDate, endDate, router) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/audit/statistics/processed/range?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
}

// chnaged
export const DailyTaskApi = async (date, router) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/audit/statistics/processed?username=${userId}&date=${date}`,
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

export const accuracyScore = async (btn, month, year, router) => {
  const token = localStorage.getItem("token");
  const url =
    btn === "Daily"
      ? `daily?month=${month}&year=${year}`
      : btn === "Weekly"
      ? `weekly?month=${month}&year=${year}`
      : `monthyly?year=${year}`;
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
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};

export const CompletedScore = async (btn, date, month, year, router) => {
  const token = localStorage.getItem("token");
  const url =
    btn === "DAILY"
      ? `daily?month=${month}&year=${year}`
      : btn === "WEEKLY"
      ? `weekly?month=${month}&year=${year}`
      : `monthly?year=${year}`;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/l2dashboard/productivity/status/${url}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
};

// chnaged
export const HoldStatus = async (router) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/audit/hold/charts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      router.push("/login");
    }
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

export const CompletedScoreNew = async (
  btn,
  date,
  month,
  year,
  router,
  type,
  user
) => {
  const token = localStorage.getItem("token");
  switch (btn) {
    case "WEEKLY":
      btn = "WEEK";
      break;
    case "MONTHLY":
      btn = "MONTH";
      break;
    default:
      null;
  }
  var data = {
    year: year,
    month: month,
    date: date,
    l1AccuracyMemberType: type,
    l1AccuracyDateType: btn,
    orgId: "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
    userIds: user,
  };
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}management/l2dashboard/l1accuracybydatetype`,
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


export const UserByIndividual = async (router) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/user/getuserbymanagerid?orgid=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      router.push("/login");
    }
  }
};