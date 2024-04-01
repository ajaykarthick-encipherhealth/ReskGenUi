import { requestPortal } from "../../../utils/network";

export async function workFlow({startDate, endDate}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`management/dashboard/tile/statistics?start=${startDate}&end=${endDate}
  `, options);
  return data;
}