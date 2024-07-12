import { requestPortal } from "../../../../utils/network";

export async function getAllFilesCount(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/getFilePageAndDosCount?&startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}

export async function getAllHccCodes(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/totalcodes/chart?startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}

//rafScore
export async function getAllRafScore(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/score/chart?startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}

//reveniew
export async function getAllRaf(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/premium/chart?startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}

export async function getAllComputing(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const url = `dbservice/tenantadmin/dashboard/computingstatus/chart?startDate=${startDate}&endDate=${endDate}&organizationId=${
    organizationId ? organizationId : ""
  }`;
  const data = await requestPortal(url, options);
  return data;
}

export async function getTop10Diseases(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/gettophcccodes?startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}

export async function getTopOigCodes(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/gettopoighcccodes?startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}

export async function getComputingStatus(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/computingstatus/tile/chart?startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}

export async function getRafScore(startDate, endDate, organizationId) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/score?startDate=${startDate}&endDate=${endDate}&organizationId=${
      organizationId ? organizationId : ""
    }`,
    options
  );
  return data;
}
