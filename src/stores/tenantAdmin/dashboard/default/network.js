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
export async function getAllRaf(startDate, endDate) {
  const options = {
    method: "GET",
  };
  const formattedStartDate = startDate ? new Date(startDate).toISOString() : "";
  const formattedEndDate = endDate ? new Date(endDate).toISOString() : "";

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/premium/chart?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    options
  );
  return data;
}

export async function getAllComputing(startDate, endDate) {
  const options = {
    method: "GET",
  };
  const formattedStartDate = startDate ? new Date(startDate).toISOString() : "";
  const formattedEndDate = endDate ? new Date(endDate).toISOString() : "";

  const url = `dbservice/tenantadmin/dashboard/computingstatus/chart?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
  const data = await requestPortal(url, options);
  return data;
}

export async function getTop10Diseases(startDate, endDate) {
  const options = {
    method: "GET",
  };
  const formattedStartDate = startDate ? new Date(startDate).toISOString() : "";
  const formattedEndDate = endDate ? new Date(endDate).toISOString() : "";

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/gettophcccodes?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    options
  );
  return data;
}

export async function getTopOigCodes() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/gettopoighcccodes`,
    options
  );
  return data;
}

export async function getComputingStatus(startDate, endDate) {
  const options = {
    method: "GET",
  };
  const formattedStartDate = startDate ? new Date(startDate).toISOString() : "";
  const formattedEndDate = endDate ? new Date(endDate).toISOString() : "";
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/computingstatus/tile/chart?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    options
  );
  return data;
}

export async function getRafScore() {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/score`,
    options
  );
  return data;
}
