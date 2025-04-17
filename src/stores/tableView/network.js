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
}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortalRoleBased(
    `dbservice/table/view?pageId=${pageId}&pageNo=${pageNo}&pageSize=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&projectId=${projectId ? projectId : ""}&aliasName=${selectedRole?selectedRole:''}`,
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
  console.log(payload, "test");

  const data = await requestPortal(`dbservice/table/column`, options);
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
    `dbservice/table/view?pageId=${pageId}&pageNo=${pageNo}&pageSize=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&projectId=${projectId ? projectId : ""}&aliasName=${selectedRole?selectedRole:''}&allPatientIds=${allPatientIds?allPatientIds:""}`,
    options
  );
  return data;
}
