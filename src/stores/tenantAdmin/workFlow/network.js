import { requestPortal } from "../../../utils/network";


export async function getUserStatus(startDate, endDate) {
    const options = {
      method: "GET",
    };
    const data = await requestPortal(
      `dbservice/tenantadmin/dashboard/getUsersCountByRole?startDate=${startDate}&endDate=${endDate}`,
      options
    );
    return data;
  }


export async function getAuditorStatus(startDate, endDate,organizationId) {
  const options = {
    method: "GET",
  };
  const url = `dbservice/tenantadmin/dashboard/auditorstatus/chart?startDate=${startDate}&endDate=${endDate}&organizationId=${organizationId}`;
  const data = await requestPortal(url, options);
  return data;
}


export async function getAllocatedStatus(startDate, endDate) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/getAllocatedStats?startDate=${startDate}&endDate=${endDate}`,
    options
  );
  return data;
}


export async function getReviewerStatus(startDate, endDate,organizationId) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/reviewerstatus/chart?startDate=${startDate}&endDate=${endDate}&organizationId=${organizationId}`,
    options
  );
  return data;
}


export async function getAllOrganization() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/organization/getallorganisation/page`,
    options
  );
  return data;
}
