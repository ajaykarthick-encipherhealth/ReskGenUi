import {
  activeTinPageId,
  assignUserPageId,
  generatedReportsPageId,
  generateViewPageId,
  moveBackPageId,
  patientAllocationPageId,
  patientPageId,
  queriedPageId,
  queryApprovalPageId,
  reAllocationPageId,
  reAssignedPageId,
  userCreatePageId,
  workQueuePageId,
} from "../../utils/pageIds";
import { requestPortal } from "../../utils/network";
import {
  convertToCustomParams,
  convertToCustomParamsDatePicker,
} from "../../utils/reusable";
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
  allTinIds,
  cilentBased,
  reloadTrue,
  search,
  tincompleted,
  qaLead,
  projectLead,
  isMasterAudit,
  router,
  allClient,
  allProject,
  allTin,
  clientId,
  projectId,
  reportCategory,
}) {
  if (!reloadTrue) {
    const options = { method: "GET" };
    let searchTextParams = null;
    let selectParams = null;
    let dateRagngesParams = null;
    let searchIntParams = null;
    if (searchText) {
      searchTextParams = convertToCustomParams(searchText);
    }
    if (search) {
      searchIntParams = convertToCustomParams(search);
    }
    if (selectedOption) {
      if (selectedOption?.tinIds) {
        allTin = false;
      }
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
    }&${statusKey}=${activeStatus || ""}&roleId=${roleId || ""}&aliasName=${
      selectedRole || ""
    }&queryStatus=${queryStatus || ""}&isAdmin=${isAdmin || ""}&sortDirection=${
      sort?.sortDir ? sort?.sortDir : "DESC"
    }&sortField=${sort?.sortField ? sort?.sortField : ""}&allClient=${
      allClient || false
    }&allProject=${allProject || false}&allTin=${allTin || false}&clientId=${
      clientId || ""
    }&projectId=${projectId || ""}`;

    const allowedPageIds = [reAssignedPageId, queriedPageId, workQueuePageId];
    const clientBasesPageIds = [assignUserPageId, userCreatePageId];
    const masterAuditpageIds = [patientAllocationPageId, reAllocationPageId];
    if (masterAuditpageIds.includes(pageId)) {
      baseUrl += `&isMasterAudit=${isMasterAudit || false}`;
    }

    if (allowedPageIds.includes(pageId)) {
      baseUrl += `&isReAssigned=${isReAssigned || false}&isQueried=${
        isQueried || false
      }`;
    }

    if (clientBasesPageIds.includes(pageId)) {
      baseUrl += `&cilentBased=${cilentBased || false}`;
    }
    //     if (role !== "TENANT_ADMIN" && role !== "OWNER" && role !== "DOWNLOADER") {
    //    baseUrl += `&patientAllocated=${patientAllocated || ""}`;
    //  }
    const allowedPageIdsForOwner = [
      workQueuePageId,
      queriedPageId,
      reAssignedPageId,
    ];

    if (
      (role !== "TENANT_ADMIN" &&
        role !== "QA_LEAD" &&
        role !== "OWNER" &&
        role !== "PROJECT_LEAD" &&
        role !== "DOWNLOADER") ||
      (role === "OWNER" && allowedPageIdsForOwner.includes(pageId)) ||
      (role !== "QA_LEAD" && allowedPageIdsForOwner.includes(pageId)) ||
      (role !== "PROJECT_LEAD" && allowedPageIdsForOwner.includes(pageId))
    ) {
      baseUrl += `&patientAllocated=${patientAllocated || ""}`;
    }
    const tinPageIds = [
      patientPageId,
      patientAllocationPageId,
      moveBackPageId,
      queryApprovalPageId,
      activeTinPageId,
      reAllocationPageId,
    ];

    if (tinPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&
allTinIds=${allTinIds || false}`;
    }

    const reportIds = [generateViewPageId];
    if (reportIds.includes(pageId)) {
      baseUrl += `&tincompleted=${tincompleted || ""}`;
    }
    const reportCategories = [generateViewPageId, generatedReportsPageId];
    if (reportCategories.includes(pageId)) {
      baseUrl += `&reportCategory=${reportCategory || ""}`;
    }

    const qaCodersPageIds = [workQueuePageId, queriedPageId, reAssignedPageId];
    const usersPageIds = [assignUserPageId];
    if (role === "QA" && qaCodersPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${allTinIds || false}`;
    }
    if (role === "QA_LEAD" && usersPageIds.includes(pageId)) {
      baseUrl += `&qaLead=${qaLead || false}`;
    }
    if (role === "PROJECT_LEAD" && usersPageIds.includes(pageId)) {
      baseUrl += `&projectLead=${projectLead || false}`;
    }

    const masterPageIds = [workQueuePageId];

    if (
      router?.pathname?.endsWith("/tindetails") &&
      masterPageIds.includes(pageId)
    ) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${
        allTinIds || false
      }&isMasterAudit=true`;
    }
    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }${searchIntParams || ""}`;

    const data = await requestPortal(finalUrl, options);
    return data;
  } else {
    return null;
  }
}

export async function getStatusTableView({
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
  allTinIds,
  cilentBased,
  reloadTrue,
  search,
  tincompleted,
  router,
}) {
  if (!reloadTrue) {
    const options = { method: "GET" };
    let searchTextParams = null;
    let selectParams = null;
    let dateRagngesParams = null;
    let searchIntParams = null;
    if (searchText) {
      searchTextParams = convertToCustomParams(searchText);
    }
    if (search) {
      searchIntParams = convertToCustomParams(search);
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
    }&${statusKey}=${activeStatus || ""}&roleId=${roleId || ""}&aliasName=${
      selectedRole || ""
    }&queryStatus=${queryStatus || ""}&isAdmin=${isAdmin || ""}&sortDirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&sortField=${sort?.sortField ? sort?.sortField : ""}`;

    const allowedPageIds = [reAssignedPageId, queriedPageId, workQueuePageId];
    const clientBasesPageIds = [assignUserPageId, userCreatePageId];

    if (allowedPageIds.includes(pageId)) {
      baseUrl += `&isReAssigned=${isReAssigned || false}&isQueried=${
        isQueried || false
      }`;
    }

    if (clientBasesPageIds.includes(pageId)) {
      baseUrl += `&cilentBased=${cilentBased || false}`;
    }

    // if (role !== "TENANT_ADMIN" && role !== "DOWNLOADER") {
    //   baseUrl += `&patientAllocated=${patientAllocated || ""}`;
    // }
    const allowedPageIdsForOwner = [
      workQueuePageId,
      queriedPageId,
      reAssignedPageId,
    ];

    if (
      (role !== "TENANT_ADMIN" &&
        role !== "QA_LEAD" &&
        role !== "OWNER" &&
        role !== "PROJECT_LEAD" &&
        role !== "DOWNLOADER") ||
      (role === "OWNER" && allowedPageIdsForOwner.includes(pageId)) ||
      (role !== "QA_LEAD" && allowedPageIdsForOwner.includes(pageId)) ||
      (role !== "PROJECT_LEAD" && allowedPageIdsForOwner.includes(pageId))
    ) {
      baseUrl += `&patientAllocated=${patientAllocated || ""}`;
    }

    const tinPageIds = [
      patientPageId,
      patientAllocationPageId,
      moveBackPageId,
      queryApprovalPageId,
      activeTinPageId,
    ];

    if (tinPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&
allTinIds=${allTinIds || false}`;
    }
    const reportIds = [generateViewPageId];
    if (reportIds.includes(pageId)) {
      baseUrl += `&tincompleted=${tincompleted || ""}`;
    }
    const qaCodersPageIds = [workQueuePageId, queriedPageId, reAssignedPageId];
    if (role === "QA" && qaCodersPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${allTinIds || false}`;
    }
    const masterPageIds = [workQueuePageId];

    if (
      router?.pathname?.endsWith("/tindetails") &&
      masterPageIds.includes(pageId)
    ) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${
        allTinIds || false
      }&isMasterAudit=true`;
    }

    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }${searchIntParams || ""}`;

    const data = await requestPortal(finalUrl, options);
    return data;
  } else {
    return null;
  }
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
  activeStatus,
  roleId,
  selectedRole,
  allPatientIds,
  search,
  searchText,
  selectedOption,
  selectedDateRanges,
  reloadTrue,
  isMasterAudit,
}) {
  if (!reloadTrue) {
    const options = {
      method: "GET",
    };
    const tin = getStorage("tinNumber");
    let searchTextParams = null;
    let selectParams = null;
    let dateRagngesParams = null;
    let searchIntParams = null;
    if (searchText) {
      searchTextParams = convertToCustomParams(searchText);
    }
    if (search) {
      searchIntParams = convertToCustomParams(search);
    }
    if (selectedOption) {
      selectParams = convertToCustomParams(selectedOption);
    }
    if (selectedDateRanges) {
      dateRagngesParams = convertToCustomParamsDatePicker(selectedDateRanges);
    }

    let baseUrl = `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&aliasName=${
      selectedRole ? selectedRole : ""
    }&allPatientIds=${allPatientIds ? allPatientIds : ""}&tin=${
      tin || ""
    }&isMasterAudit=${isMasterAudit || false}`;
    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }${searchIntParams || ""}`;
    const data = await requestPortal(finalUrl, options);
    return data;
  } else {
    return null;
  }
}

export async function getTinViewChecked({
  pageId,
  pageNo,
  pageSize,
  selectedOption,
  selectedDateRanges,
  searchText,
  activeStatus,
  roleId,
  selectedRole,
  allTinIds,
  reloadTrue,
}) {
  if (!reloadTrue) {
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

    let baseUrl = `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&aliasName=${
      selectedRole ? selectedRole : ""
    }&allTinIds=${allTinIds ? allTinIds : ""}`;
    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }`;
    const data = await requestPortal(finalUrl, options);
    return data;
  } else {
    return null;
  }
}

export async function getTinCount({}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortal(`dbservice/tin/get-tin-counts`, options);
  return data;
}
