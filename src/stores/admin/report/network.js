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
  const orgId = getStorage("orgId");
  const searchValue = filter === "ALL" ? "" : filter;
  const data = await requestPortal(
    `dbservice/patient/adminreport?pageno=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&status=${searchValue}&searchstring=${search}&sortfield=${
      sort?.sortField
    }&sortdirection=${sort?.sortDir}&username=${
      userName === "REVIEWER" ? selectManager : ""
    }&managerid=${
      userName === "SUPERVISOR" ? selectManager : ""
    }&orgid=${orgId}&allFlags=${flagsList ? flagsList : ""}
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
  const role = getStorage("userRole");
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

export async function updateSent(data) {
  const options = {
    method: "POST",
    body:JSON.stringify(data)
  };

  const res = await requestPortal(
    `dbservice/reportdetails/updatereportstatus`,
    options
  );
  return res;
}
export const usersList = async(search) => {
  const id=getStorage("orgId");
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `dbservice/user/getUsersForL1Report?orgid=${id}&searchString=${search}`,
    options
  );
  return res;
};
export const getSelectedReport = async({reportId=""}) => {
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `dbservice/reportdetails/get?reportId=${reportId?reportId:""}`,
    options
  );
  return res;
};


export const usersLists = async(search) => {
  const id=getStorage("orgId");
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `dbservice/user/getuser/report`,
    options
  );
  return res;
};
export const exportData = async(data) => {
  const options = {
    method: "POST",
    body:JSON.stringify(data)
  };

  const res = await requestPortal(
    `management/patient/report/export`,
    options
  );
  return res;
};