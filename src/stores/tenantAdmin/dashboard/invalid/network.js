import { requestPortal } from "../../../../utils/network";

export async function getInvalidDashboard(
  flagNameList,
  startDate,
  endDate,
  organizationId
) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/invalid/dashboard/count/flag?flagNameList=${flagNameList}&startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""}`,
    options
  );
  return data;
}
