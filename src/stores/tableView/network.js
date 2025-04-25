import { requestPortal, requestPortalRoleBased } from "../../utils/network";
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
  projectId,
  selectedRole,
  isReAssigned,
  isQueried,
  patientAllocated,
  queryStatus,
  isAdmin,
  tin,
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
  const baseUrl = `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${
    pageSize ? pageSize : 15
  }&processedStatus=${activeStatus || ""}&roleId=${roleId || ""}&projectId=${
    projectId || ""
  }&aliasName=${selectedRole || ""}&isReAssigned=${
    isReAssigned || ""
  }&isQueried=${isQueried || ""}&patientAllocated=${
    patientAllocated || ""
  }&queryStatus=${queryStatus || ""}&isAdmin=${isAdmin || ""}&tin=${
    tin ? tin : ""
  }`;

  const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
    dateRagngesParams || ""
  }`;

  const data = await requestPortalRoleBased(finalUrl, options);
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
  const data = await requestPortalRoleBased(
    `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&projectId=${projectId ? projectId : ""}&aliasName=${selectedRole?selectedRole:''}&allPatientIds=${allPatientIds?allPatientIds:""}`,
    options
  );
  return data;
}
