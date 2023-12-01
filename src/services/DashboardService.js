import axios from "axios";

export function workStatusApi(startDate, endDate) {
  const token = localStorage.getItem("token");
  return axios.get(
    `https://hcc.encipherhealth.com/secure/management/dashboard/tile/statistics?start=${startDate}&end=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export const DailyTaskApi = (date) => {
  const token = localStorage.getItem("token");
  return axios.get(
    `https://hcc.encipherhealth.com/secure/management/dashboard/daily/statistics?date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const accuracyScore = (btn, month, year) => {
  const token = localStorage.getItem("token");
  const url =
    btn === "Daily"
      ? `daily?month=${month}&year=${year}`
      : btn === "Weekly"
      ? `weekly?month=${month}&year=${year}`
      : `monthyly?year=${year}`;
  return axios.post(
    `https://hcc.encipherhealth.com/secure/dbservice/accuracyscore/${url}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const CompletedScore = (btn, date, month, year) => {
  const token = localStorage.getItem("token");
  const url=`year=${year}&month=${month}&date=${date}&range=${btn}`
  return axios.get(
    `https://hcc.encipherhealth.com/secure/management/dashboard/line/statistics?${url}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const HoldStatus = () => {
    const token = localStorage.getItem("token");
    return axios.get(
      `https://hcc.encipherhealth.com/secure/dbservice/dashboard/hold/charts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
