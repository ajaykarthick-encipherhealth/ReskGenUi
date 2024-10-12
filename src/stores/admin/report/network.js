import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function adminApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  filter = "",
  userName = "",
  sort = "",
  selectManager = "",
  flagsList,
}) {
  const options = {
    method: "GET",
  };
  const searchValue = filter === "ALL" ? "" : filter;
  const data = await requestPortal(
    `dbservice/patient/adminreport?pageno=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&status=${searchValue}&searchstring=${search}&sortfield=${
      sort?.sortField
    }&sortdirection=${sort?.sortDir}&username=${
      userName === "REVIEWER" ? selectManager : ""
    }&managerid=${
      userName === "SUPERVISOR" ? selectManager : ""
    }&orgid=${orgId}&
    patientIds=${flagsList ? flagsList : ""}
  `,
    options
  );
  return data;
}

export async function sentApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/reportdetails/sent?pageNo=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${
      sort.sortField || ""
    }&sortdirection=${sort.sortDir || ""}
  `,
    options
  );
  return data;
}

export async function receivedApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/reportdetails/received?pageNo=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}
  `,
    options
  );
  return data;
}

export async function checkAllApi({
  pagenum = 0,
  startDate = "",
  endDate = "",
  search,
  searchValue = "",
  sort,
  size,
  selectAllFlags,
  selectManager,
  selectAll,
  userName,
}) {
  const options = {
    method: "GET",
  };
  const orgId = getStorage("orgId");
  const role = getStorage("role");
  const data = await requestPortal(
    `dbservice/patient/adminreport?pageno=${pagenum}&size=${
      size ? size : 7
    }&startdate=${startDate}&enddate=${endDate}&status=${searchValue}&searchstring=${search}&sortfield=${
      sort?.sortField ? sort?.sortField : ""
    }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&username=${
      userName === "REVIEWER" ? selectManager : ""
    }&managerid=${userName === "SUPERVISOR" ? selectManager : ""}&orgid=${
      role == "tenant_admin" ? "" : orgId
    }&allPatientIds=${selectAll}&allFlags=${selectAllFlags}`,
    options
  );
  return data;
}
