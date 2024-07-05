import { requestPortal } from "../../../utils/network";

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
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/totalcodes/chart`,
    options
  );
  return data;
}

//rafScore
export async function getAllRafScore() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenantadmin/dashboard/raf/score/chart`,
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
