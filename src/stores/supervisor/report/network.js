import { requestPortal } from "../../../utils/network";

export async function auditApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  filter = "",
  sort,
  size
}) {
  const options = {
    method: "GET",
  };
  const searchValue = filter === "ALL" ? "" : filter;
  const sortField = sort?.sortField === "undefined" ? "" : sort?.sortField;
  const sortDirection = sort?.sortDir === "undefined" ? "" : sort?.sortDir;
  const orgId = localStorage.getItem("orgId");
  const data = await requestPortal(
    `dbservice/patient/auditor/assinedreport?pageno=${pagenum}&size=${size?size:7}&startdate=${startDate}&enddate=${endDate}&status=${searchValue?searchValue:""}&searchstring=${search?search:""}&orgid=${orgId}&sortfield=${sortField}&sortdirection=${sortDirection}
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
  sort,
  size
}) {
  const options = {
    method: "GET",
  };
  const orgId = localStorage.getItem("orgId");
  const data = await requestPortal(
    `dbservice/patient/auditorreport?pageno=${pagenum}&size=${size?size:7}&startdate=${startDate}&enddate=${endDate}&searchstring=${search?search:""}&orgid=${orgId}&sortfield=${sort?.sortField?sort?.sortField:""}&sortdirection=${sort?.sortDir?sort?.sortDir:""}
  `,
    options
  );
  return data;
}

