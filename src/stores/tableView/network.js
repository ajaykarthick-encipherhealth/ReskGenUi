import { requestPortal, requestPortalRoleBased } from "../../utils/network";
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
}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortalRoleBased(
    `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize ? pageSize : 15 }&processedStatus=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&projectId=${
      projectId ? projectId : ""
    }&aliasName=${selectedRole ? selectedRole : ""}&isReAssigned=${
      isReAssigned ? isReAssigned : ""
    }&isQueried=${isQueried ? isQueried : ""}&patientAllocated=${
      patientAllocated ? patientAllocated : ""
    }&queryStatus=${queryStatus ? queryStatus : ""}&isAdmin=${isAdmin ? isAdmin : ""}`,
    options
  );
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
