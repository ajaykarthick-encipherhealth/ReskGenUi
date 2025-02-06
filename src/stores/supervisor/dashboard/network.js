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
  return data;
}

export const dailyTask = async ({ date }) => {
  const userId = getStorage("userId");
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

export const holdStatus = async () => {
  const userId = getStorage("userId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/audit/hold/charts`, options);
  return data;
};

export const accuracy = async ({ btn,month,year,user }) => {
  const role = getStorage("userRole");
  const url =
  btn === "DAILY"
    ? `daily?month=${month}&role=${
        role ? role.toUpperCase() : ""
      }&year=${year}&userId=${user}`
    : btn === "WEEKLY"
    ? `weekly?month=${month}&role=${
        role ? role.toUpperCase() : ""
      }&year=${year}&userId=${user}`
    : `monthyly?role=${role ? role.toUpperCase() : ""}&year=${year}&userId=${user}`;

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

export const CompletedStatus = async ({
  btn,
  month,
  year,
}) => {
  const url =
    btn === "Daily"
      ? `daily?month=${month}&year=${year}`
      : btn === "Weekly"
      ? `weekly?month=${month}&year=${year}`
      : `monthly?year=${year}`;
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/l2dashboard/productivity/status/${url}`,
    options
  );
  return data;
};

export const userByIndividual = async () => {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/getuserbymanagerid?orgid=${orgId}`,
    options
  );
  return data;
};
