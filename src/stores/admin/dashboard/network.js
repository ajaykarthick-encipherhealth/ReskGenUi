import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function workFlow({ startDate, endDate }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/dashboard/tile/statistics?start=${startDate}&end=${endDate}
  `,
    options
  );
  return data;
}
export const dailyTask = async ({ date }) => {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/dashboard/daily/statistics?date=${date}
  `,
    options
  );
  return data;
};
export const accuracy = async ({ btn, month, year, isAdmin = false }) => {
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
  const options = {
    method: "POST",
  };
  const data = await requestPortal(
    `dbservice/accuracyscore/${url}
  `,
    options
  );
  return data;
};

export const completedScrore = async ({ btn, date, month, year }) => {
  const options = {
    method: "GET",
  };
  const url = `year=${year}&month=${month}&date=${date}&range=${btn}`;

  const data = await requestPortal(`management/dashboard/line/statistics?${url}`,
    options
  );
  return data;
};

export const holdStatus=async()=>{
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/dashboard/hold/charts`,
    options
  );
  return data;
}

export const notification=async()=>{
  const userId= getStorage("userId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`communication/notification/${userId}?page=${0}&limit=100`,
    options
  );
  return data;
}

export const tenentLogo = async() => {
  const orgId= getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/comapnayLogo/getComapanyLogoLink?orgId=${orgId}`,
    options
  );
  return data;
}