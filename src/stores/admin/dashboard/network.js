import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

// export async function workFlow({ startDate, endDate }) {
//   const options = {
//     method: "GET",
//   };
//   const data = await requestPortal(
//     `management/dashboard/tile/statistics?start=${startDate}&end=${endDate}
//   `,
//     options
//   );
//   return data;
// }

export async function workFlow({ startDate="", endDate=""}) {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/admindashboard/overallchart?allocatedOnStartDate=${startDate}&allocatedOnEndDate=${endDate}&organizationId=${orgId}
  `,
    options
  );
  return data;
}
export const dailyTask = async () => {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/getusercountbyrole?organizationId=${orgId}
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
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/accuracyscore/machine/${url}
  `,
    options
  );
  return data;
};
export const completedScore = async ({
  btn,
  month,
  year,
  userName,
  selectMemberType,
}) => {
  const isManage = selectMemberType == "SUPERVISOR";
  const options = {
    method: "GET",
  };
  const url =
    btn === "DAILY"
      ? `daily?month=${month}&year=${year}&userName=${userName}&isManager=${isManage}`
      : btn === "WEEKLY"
      ? `weekly?month=${month}&year=${year}&userName=${userName}&isManager=${isManage}`
      : `monthyly?year=${year}&userName=${userName}&isManager=${isManage}`;

  const data = await requestPortal(
    `dbservice/admindashboard/chartdeliverystatus/${url}`,
    options
  );
  return data;
};
export const holdStatus = async () => {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/dashboard/hold/charts`, options);
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
export const tenentLogo = async () => {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/comapnayLogo/getComapanyLogoLink?orgId=${orgId}`,
    options
  );
  return data;
};
export const getTeamChartData = async () => {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/admindashboard/teamchart?orgId=${orgId}`,
    options
  );
  return data;
};
export const usersList = async ({role}) => {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/getByRole?role=${role}&orgId=${orgId}`,
    options
  );
  return data;
};
export const deliveryStatus = async ({month,year,btn}) => {
  const url =
  btn === "DAILY"
    ? `daily?month=${month}&year=${year}`
    : btn === "WEEKLY"
    ? `weekly?month=${month}&year=${year}`
    : `monthyly?year=${year}`;
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/admindashboard/chartdeliverystatus/${url}`,
    options
  );
  return data;
};