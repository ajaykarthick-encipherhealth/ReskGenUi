import { requestPortal } from "../../../../utils/network";

export async function getAllFilesCount() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/getFilePageAndDosCount?organizationId=`,
    options
  );
  return data;
}

export async function getAllHccCodes(startDate, endDate) {
  const options = {
    method: "GET",
  };
  const formattedStartDate = startDate ? new Date(startDate).toISOString() : "";
  const formattedEndDate = endDate ? new Date(endDate).toISOString() : "";

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/totalcodes/chart?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    options
  );
  return data;
}

//rafScore
export async function getAllRafScore(startDate, endDate) {
  const options = {
    method: "GET",
  };
  const formattedStartDate = startDate ? new Date(startDate).toISOString() : "";
  const formattedEndDate = endDate ? new Date(endDate).toISOString() : "";

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/score/chart?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    options
  );
  return data;
}

//reveniew
export async function getAllRaf() {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/premium/chart`,
    options
  );
  return data;
}

export async function getAllComputing() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/computingstatus/chart`,
    options
  );
  return data;
}

export async function getTop10Diseases(startDate, endDate,organizationId) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/gettophcccodes?startDate=${startDate}&endDate=${endDate}&organizationId=${organizationId}`,
    options
  );
  return data;
}

export async function getTopOigCodes(startDate, endDate,organizationId) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/gettopoighcccodes?startDate=${startDate}&endDate=${endDate}&organizationId=${organizationId}`,
    options
  );
  return data;
}

export async function getComputingStatus() {

  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/computingstatus/tile/chart`,
    options
  );
  return data;
}

export async function getRafScore(startDate, endDate,organizationId) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/score?startDate=${startDate}&endDate=${endDate}&organizationId=${organizationId}`,
    options
  );
  return data;
}