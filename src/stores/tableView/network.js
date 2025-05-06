import { requestPortal } from "../../utils/network";
import {
  convertToCustomParams,
  convertToCustomParamsDatePicker,
} from "../../utils/reusable";
import { getStorage } from "../../utils/storages";

// export async function getTableView({
//   pageId,
//   pageNo,
//   pageSize,
//   selectedOption,
//   sort,
//   selectedDateRanges,
//   searchText,
//   activeStatus,
//   roleId,
//   // projectId,
//   selectedRole,
//   isReAssigned,
//   isQueried,
//   patientAllocated,
//   queryStatus,
//   isAdmin,
//   tin = "",
//   allTinIds,
//   cilentBased,
//   reloadTrue,
// }) {
//   if (!reloadTrue) {
//     const options = { method: "GET" };
//     let searchTextParams = null;
//     let selectParams = null;
//     let dateRagngesParams = null;

//     if (searchText) {
//       searchTextParams = convertToCustomParams(searchText);
//     }
//     if (selectedOption) {
//       selectParams = convertToCustomParams(selectedOption);
//     }
//     if (selectedDateRanges) {
//       dateRagngesParams = convertToCustomParamsDatePicker(selectedDateRanges);
//     }

//     const statusKey = isQueried ? "approvalStatus" : "processedStatus";
//     const uId = getStorage("userId");

//     const role = getStorage("proxyRole");

//     let baseUrl = `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${
//       pageSize || 15
//     }&${statusKey}=${activeStatus || ""}&roleId=${roleId || ""}&aliasName=${
//       selectedRole || ""
//     }&queryStatus=${queryStatus || ""}&isAdmin=${isAdmin || ""}&sortDirection=${
//       sort?.sortDir ? sort?.sortDir : ""
//     }&sortField=${sort?.sortField ? sort?.sortField : ""}`;

//     const allowedPageIds = [
//       "e76aaa6c-319e-44d3-b7ae-aadb17dfb664",
//       "a9d5c555-7954-4382-a2ef-3f66b292cf8f",
//       "da4958c3-7795-4bcc-8ab0-24d93cd52c25",
//     ];
//     const clientBasesPageIds = [
//       "8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
//       "1406dafa-46fa-4f69-ac1b-e354ebc03dad",
//     ];

//     if (allowedPageIds.includes(pageId)) {
//       baseUrl += `&isReAssigned=${isReAssigned || false}&isQueried=${
//         isQueried || false
//       }`;
//     }

//     if (clientBasesPageIds.includes(pageId)) {
//       baseUrl += `&cilentBased=${cilentBased || false}`;
//     }
//     if (role !== "TENANT_ADMIN") {
//       baseUrl += `&patientAllocated=${patientAllocated || ""}`;
//     }
//     const tinPageIds = [
//       "d80f80fd-aab8-496e-a9fc-89677d5ac174",
//       "6cd166eb-79ac-4c12-ab0f-07be2983ca70",
//       "937b0477-f0cd-46e7-b8ab-fefb38f91859",
//       "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
//       "2d7cb7f7-6dad-41fb-970b-d805fb3f195f",
//     ];

//     if (tinPageIds.includes(pageId)) {
//       baseUrl += `&tin=${tin || ""}&
// allTinIds=${allTinIds || false}`;
//     }

//     const qaCodersPageIds = [
//       "da4958c3-7795-4bcc-8ab0-24d93cd52c25",
//       "a9d5c555-7954-4382-a2ef-3f66b292cf8f",
//       "e76aaa6c-319e-44d3-b7ae-aadb17dfb664",
//     ];
//     if (qaCodersPageIds.includes(pageId)) {
//       baseUrl += `&tin=${tin || ""}&
// allTinIds=${allTinIds || false}`;
//     }
//     const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
//       dateRagngesParams || ""
//     }`;

//     const data = await requestPortal(finalUrl, options);
//     return data;
//   } else {
//     return null;
//   }
// }
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

    const allowedPageIds = [
      "e76aaa6c-319e-44d3-b7ae-aadb17dfb664",
      "a9d5c555-7954-4382-a2ef-3f66b292cf8f",
      "da4958c3-7795-4bcc-8ab0-24d93cd52c25",
    ];
    const clientBasesPageIds = [
      "8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
      "1406dafa-46fa-4f69-ac1b-e354ebc03dad",
    ];
    const qaCodersPageIds = [
      "da4958c3-7795-4bcc-8ab0-24d93cd52c25",
      "a9d5c555-7954-4382-a2ef-3f66b292cf8f",
      "e76aaa6c-319e-44d3-b7ae-aadb17dfb664",
      "2d7cb7f7-6dad-41fb-970b-d805fb3f195f",
    ];

    if (allowedPageIds.includes(pageId)) {
      baseUrl += `&isReAssigned=${isReAssigned || false}&isQueried=${
        isQueried || false
      }`;
    }

    if (clientBasesPageIds.includes(pageId)) {
      baseUrl += `&cilentBased=${cilentBased || false}`;
    }

    if (role !== "TENANT_ADMIN") {
      baseUrl += `&patientAllocated=${patientAllocated || ""}`;
    }
    if (role === "QA" && qaCodersPageIds.includes(pageId)) {
      baseUrl += `&tin=${tin || ""}&allTinIds=${allTinIds || false}`;
    }

    const finalUrl = `${baseUrl}${searchTextParams || ""}${selectParams || ""}${
      dateRagngesParams || ""
    }`;

    const data = await requestPortal(finalUrl, options);
    return data;
  } else {
    return null;
  }

const tinPageIds = [
  "d80f80fd-aab8-496e-a9fc-89677d5ac174",
  "6cd166eb-79ac-4c12-ab0f-07be2983ca70",
  "937b0477-f0cd-46e7-b8ab-fefb38f91859",
  "8c1eebaf-eb20-4758-b968-6ae15e6fc031",
  "2d7cb7f7-6dad-41fb-970b-d805fb3f195f",
];
if (tinPageIds.includes(pageId)) {
  baseUrl += `&tin=${tin || ""}&
allTinIds=${allTinIds || false}`;

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
  }&isQueried=${isQueried || false}&patientAllocated=${patientAllocated || ""}`;

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
  activeStatus,
  roleId,
  selectedRole,
  allPatientIds,
}) {
  const options = {
    method: "GET",
  };
  const tin = getStorage("tinNumber");
  const data = await requestPortal(
    `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&aliasName=${
      selectedRole ? selectedRole : ""
    }&allPatientIds=${allPatientIds ? allPatientIds : ""}&tin=${tin || ""}`,
    options
  );
  return data;
}

export async function getTinViewChecked({
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
  allTinIds,
}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortal(
    `dbservice/table/view?pageId=${pageId}&page=${pageNo}&size=${pageSize}&status=${
      activeStatus ? activeStatus : ""
    }&roleId=${roleId ? roleId : ""}&aliasName=${
      selectedRole ? selectedRole : ""
    }&allTinIds=${allTinIds ? allTinIds : ""}`,
    options
  );
  return data;
}

export async function getTinCount({}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortal(`dbservice/tin/get-tin-counts`, options);
  return data;
}