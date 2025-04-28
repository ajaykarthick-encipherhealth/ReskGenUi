import { requestPortal } from "../../utils/network";
import { convertToCustomParams, convertToCustomParamsDatePicker } from "../../utils/reusable";
import { getStorage } from "../../utils/storages";

export async function getTableView({
  pageId,
  pageNo,
  pageSize,
  selectedOption,
  sort,
  selectedDateRanges,
  searchText,
  activeStatus,
  roleId,
  // projectId,
  selectedRole,
  isReAssigned,
  isQueried,
  patientAllocated,
  queryStatus,
  isAdmin,
  tin = "",
}) {
  const options = { method: "GET" };
  let searchTextParams = null;
  let selectParams = null;
  let dateRagngesParams = null;

  if (searchText) {
    searchTextParams = convertToCustomParams(searchText);
  }
  if (selectedOption) {
    selectParams = convertToCustomParams(selectedOption);
  }
  if (selectedDateRanges) {
    dateRagngesParams = convertToCustomParamsDatePicker(selectedDateRanges);
  }

  const statusKey = isQueried ? "approvalStatus" : "processedStatus";
  const uId = getStorage("userId");

   const role = getStorage("proxyRole");

  let baseUrl = `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${
    pageSize || 15
  }&${statusKey}=${activeStatus || ""}&roleId=${roleId || ""}&aliasName=${selectedRole || ""}&queryStatus=${queryStatus || ""}&isAdmin=${isAdmin || ""}&tin=${tin || ""}`;

  const allowedPageIds = [
    "e76aaa6c-319e-44d3-b7ae-aadb17dfb664",
    "a9d5c555-7954-4382-a2ef-3f66b292cf8f",
    "da4958c3-7795-4bcc-8ab0-24d93cd52c25",
  ];


  if (allowedPageIds.includes(pageId)) {
    baseUrl += `&isReAssigned=${isReAssigned || false}&isQueried=${
      isQueried || false
    }`;
  }
   if (role !== "TENANT_ADMIN") {
     baseUrl += `&patientAllocated=${patientAllocated || ""}`;
   }


  const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
    dateRagngesParams || ""
  }`;

  const data = await requestPortal(finalUrl, options);
  return data;
}

export async function getStatusTableView({
  selectedOption,
  selectedDateRanges,
  searchText,
  isReAssigned,
  isQueried,
  patientAllocated,
}) {
  const options = {
    method: "GET",
  };
  let searchTextParams = null;
  let selectParams = null;
  let dateRagngesParams = null;
  if (searchText) {
    searchTextParams = convertToCustomParams(searchText);
  }
  if (selectedOption) {
    selectParams = convertToCustomParams(selectedOption);
  }
  if (selectedDateRanges) {
    dateRagngesParams = convertToCustomParamsDatePicker(selectedDateRanges);
  }
  const uId = getStorage("userId");
  const baseUrl = `dbservice/get-count?&isReAssigned=${
    isReAssigned || false
  }&isQueried=${isQueried || false}&patientAllocated=${
    patientAllocated || ""
  }`;

  const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
    dateRagngesParams || ""
  }`;

  const data = await requestPortal(finalUrl, options);
  return data;
}

export async function dynamicColumn({ payload }) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const data = await requestPortal(`dbservice/table/column`, options);
  return data;
}
export async function dynamicColumnReset({ payload }) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const data = await requestPortal(`dbservice/table/column/reset`, options);
  return data;
}
export async function changeTinStatus({ payload }) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const data = await requestPortal(
    `dbservice/tin/change-active-status`,
    options
  );
  return data;
}
export async function getTableViewChecked({
  pageId,
  pageNo,
  pageSize,
  selectedOption,
  sort,
  selectedDateRanges,
  searchText,
  activeStatus,
  roleId,
  projectId,
  selectedRole,
  allPatientIds,
}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortal(
    `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&aliasName=${selectedRole?selectedRole:''}&allPatientIds=${allPatientIds?allPatientIds:""}`,
    options
  );
  return data;
}

export async function getTinCount({
}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortal(`dbservice/tin/get-tin-counts`, options);
  return data;
}