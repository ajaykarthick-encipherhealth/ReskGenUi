import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function auditApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  filter = "",
  sort,
  size,
  flagsList,
}) {
  const options = {
    method: "GET",
  };
  const searchValue = filter === "ALL" ? "" : filter;
  const sortField = sort?.sortField === "undefined" ? "" : sort?.sortField;
  const sortDirection = sort?.sortDir === "undefined" ? "" : sort?.sortDir;
  const orgId = getStorage("orgId");
  const data = await requestPortal(
    `dbservice/patient/auditor/assinedreport?pageno=${pagenum}&size=${
      size ? size : 7
    }&startdate=${startDate}&enddate=${endDate}&status=${
      searchValue ? searchValue : ""
    }&searchstring=${
      search ? search : ""
    }&orgid=${orgId}&sortfield=${sortField}&sortdirection=${sortDirection}&allFlags=${flagsList}
  `,
    options
  );
  return data;
}

export async function teamApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  filter = "",
  sort,
  size,
  flagsList,
}) {
  const options = {
    method: "GET",
  };
  const searchValue = filter === "ALL" ? "" : filter;
  const orgId = getStorage("orgId");
  const data = await requestPortal(
    `dbservice/patient/auditorreport?pageno=${pagenum}&size=${
      size ? size : 7
    }&startdate=${startDate}&enddate=${endDate}&status=${
      searchValue ? searchValue : ""
    }&searchstring=${search ? search : ""}&orgid=${orgId}&sortfield=${
      sort?.sortField ? sort?.sortField : ""
    }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&allFlags=${flagsList}
  `,
    options
  );
  return data;
}

export async function auditCheck({ totalElements, selectAllFlags, selectAll }) {
  const options = {
    method: "GET",
  };
  const orgId = getStorage("orgId");
  const data = await requestPortal(
    `dbservice/patient/auditor/assinedreport?pageno=0&size=${totalElements}&orgid=${orgId}&allPatientIds=${selectAll}&allFlags=${selectAllFlags}
  `,
    options
  );
  return data;
}
export async function teamCheck({ totalElements, selectAllFlags, selectAll }) {
  const options = {
    method: "GET",
  };
  const orgId = getStorage("orgId");
  const data = await requestPortal(
    `dbservice/patient/auditorreport?pageno=0&size=${totalElements}&orgid=${orgId}&allPatientIds=${
      selectAll
    }&allFlags=${selectAllFlags}
  `,
    options
  );
  return data;
}

export async function sendReport(pagenum,
  startDate = "",
  endDate = "",
  search,
  sort) {
  const options = {
    method: "GET",
  };
  const url = `dbservice/reportdetails/sent?pageNo=${pagenum}&size=7&startdate=${
    startDate ? startDate : ""
  }&enddate=${endDate ? endDate : ""}&searchstring=${
    search ? search : ""
  }&sortfield=${sort?.sortField ? sort?.sortField : ""}&sortdirection=${
    sort?.sortDir ? sort?.sortDir : ""
  }`;
  const data = await requestPortal(url,
    options
  );
  return data;
}

export async function receivedReport(pagenum,
  startDate = "",
  endDate = "",
  search,
  sort) {
  const options = {
    method: "GET",
  };
  const url = `dbservice/reportdetails/received?pageNo=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}`;
  const data = await requestPortal(url,
    options
  );
  return data;
}

export async function selectedReportDetails(reportId, reportInfo) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/reportdetails/get?reportId=${reportId}`,
    options
  );
  return data;
}


export async function getFileDetailsReport(pathname) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`management/patient/report/getfile?blobName=${pathname}`,
    options
  );
  return data;
}
