import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function supervisorWorkFlow({ startDate = "", endDate = "" }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/audit/statistics/processed/range?startDate=${startDate}&endDate=${endDate}
  `,
    options
  );
console.log(startdataDate, "startDate");
  return data;
}

export const dailyTask = async ({ date }) => {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/audit/statistics/processed?username=${userId}&date=${date}
  `,
    options
  );
  return data;
};

export const notification = async () => {
  const userId = getStorage("userId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `communication/notification/${userId}?page=${0}&limit=100`,
    options
  );
  return data;
};

