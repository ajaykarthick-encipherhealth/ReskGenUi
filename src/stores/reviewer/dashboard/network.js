import { requestPortal } from "../../utils/network";

export async function loadDashboard() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/patient/getbyuser?userId=ajith01@encipherhealth.onmicrosoft.com&page=0&size=10
  `, options);
  return data;
}