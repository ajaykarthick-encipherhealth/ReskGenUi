import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function reviewerAllocation({
  allocate = true,
  search,
  sort,
  selectedOption,
  selectedDateRanges,
  batchCount,
  pageNo,
  searchList,
}) {
  const { searchbycode = "", searchbydescription = "" } = searchList;
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");

  const res = await requestPortal(
    `dbservice/patient/admin/computation/filter?page=${
      pageNo ? pageNo : 0
    }&size=${15}&userId=${uId}&diagnosisCode=${searchbycode}&description=${searchbydescription}&computationStart=${
      selectedDateRanges?.computedDate?.startDate
        ? selectedDateRanges?.computedDate?.startDate
        : ""
    }&computationEnd=${
      selectedDateRanges?.computedDate?.endDate
        ? selectedDateRanges?.computedDate?.endDate
        : ""
    }&isAllocation=${allocate ? allocate : ""}&status=${2}&searchString=${
      search ? search : ""
    }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&sortfield=${
      sort?.sortField ? sort?.sortField : ""
    }&priority=${
      selectedOption?.priority ? selectedOption?.priority : ""
    }&batchCount=${batchCount ? batchCount : ""}&organizationId=${
      selectedOption?.organization ? selectedOption?.organization : ""
    }
    `,
    options
  );
  return res;
}

export async function checkedReviewersList({
  pageNumber,
  size,
  computationStartDate,
  computationEndDate,
  selectedStatus,
  searchString,
  sort,
  selectedPriority,
  batchCount,
}) {
  const uId = getStorage("userId");
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/patient/admin/computation/filter?page=${
      pageNumber ? pageNumber : 0
    }&size=${15}&userId=${uId}&organizationId=${orgId}&computationStart=${
      computationStartDate || ""
    }&computationEnd=${computationEndDate || ""}&isAllocation=${true}&status=${
      selectedStatus ? selectedStatus : 2
    }&searchString=${searchString || ""}&sortdirection=${
      sort?.sortDir || ""
    }&sortfield=${sort?.sortField || ""}&priority=${
      selectedPriority || ""
    }&batchCount=${batchCount || ""}`,
    options
  );
  return res;
}
export async function usersList({ roleId }) {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/user/get/role?roleId=${roleId}`,
    options
  );
  return res;
}

export async function usersCheckedList({ selectEmail }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `/management/admin/getProcessedStatus?userName=${selectEmail}`,
    options
  );
  return res;
}

export async function usersAllocate({ data, isSupervisor }) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const url = isSupervisor
    ? "dbservice/patient/admin/assignPatients/l2audit"
    : "dbservice/patient/admin/assignPatients";
  const res = await requestPortal(url, options);
  return res;
}

// supervisor allocation

export const supervisorsList = async ({
  pageNo,
  searchText,
  selectedOption,
}) => {
  let orgId = getStorage("orgId");
  let tenantid = getStorage("tenantId");
  const options = {
    method: "GET",
  };
  let resoureUrl = `dbservice/l2audit?tenantid=${tenantid}&page=${
    pageNo ? pageNo : 0
  }&size=${15}&searchstring=${searchText ? searchText : ""}&orgId=${
    selectedOption?.organization ? selectedOption?.organization : ""
  }`;
  const res = await requestPortal(resoureUrl, options);
  return res;
};
export const selectedList = async ({
  userName,
  pageNum,
  sort,
  searchString,
  selectedOption,
  allocatedOption,
}) => {
  let orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `dbservice/l2audit/patients?username=${userName}&organizationId=${orgId}&page=${
      pageNum ? pageNum : 0
    }&size=13&sortdirection=${
      sort?.sortDir ? sort?.sortDir : "DESC"
    }&sortfield=${sort?.sortField ? sort?.sortField : "dueDate"}&searchstring=${
      searchString || ""
    }&processedStatus=${selectedOption || ""}&patientAllocated=${
      allocatedOption || ""
    }
  `,
    options
  );
  return res;
};

export const getFilters = async ({ field, username, pageQueue }) => {
  const role = getStorage("userRole");
  const userRole = role?.toUpperCase();
  const url = username
    ? `dbservice/patient/filter/field/list?username=${username}&field=${field}&role=${userRole}`
    : `dbservice/patient/filter/field/list?field=${field}&role=${userRole}&page=${
        pageQueue || 0
      }`;
  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url} `, options);
  return res;
};

export async function supervisorCheckedList({
  userName,
  pageNum,
  sort,
  searchString,
  selectedOption,
  allocatedOption,
  allPatientIds,
}) {
  let orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `dbservice/l2audit/patients?organizationId=${orgId}&username=${userName}&page=${
      pageNum ? pageNum : 0
    }&size=13&sortdirection=${
      sort?.sortDir ? sort?.sortDir : "DESC"
    }&sortfield=${sort?.sortField ? sort?.sortField : "dueDate"}&searchstring=${
      searchString || ""
    }&processedStatus=${selectedOption?.status || ""}&patientAllocated=${
      selectedOption?.reviewer || ""
    }&isAllPatients=${allPatientIds?allPatientIds:false}
  `,
    options
  );
  return res;
}

export async function supervisorAllocatedList({ selectEmail }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/l2audit/statistics?userName=${selectEmail}`,
    options
  );
  return res;
}

export async function getAllocationList({
  data,
  pageNo,
  sort,
  searchText,
  selectedOption,
  search
}) {
  const { searchbycode = "", searchbydescription = "" } = search;
  const options = {
    method: "GET",
  };
  let resoureUrl = `dbservice/l2audit/patients?username=${
    data?.userName
  }&page=${pageNo ? pageNo : 0}&size=${15}&diagnosisCode=${searchbycode}&description=${searchbydescription}&sortdirection=${
    sort?.sortDir ? sort?.sortDir : ""
  }&sortfield=${sort?.sortField ? sort?.sortField : ""}&searchstring=${
    searchText ? searchText : ""
  }&processedStatus=${
    selectedOption?.status ? selectedOption?.status : ""
  }&patientAllocated=${
    selectedOption?.reviewer ? selectedOption?.reviewer : ""
  }`;
  const res = await requestPortal(resoureUrl, options);
  return res;
}

export async function allocatedCount() {
  const options = {
    method: "GET",
  };
  const batchId = getStorage("batchId");
  const res = await requestPortal(
    `dbservice/cornadai/allocation/get/nonallocated/count?batchId=${
      batchId ? batchId : ""
    }`,
    options
  );
  return res;
}

export async function updateAllocation(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(
    `dbservice/cornadai/allocation/batch`,
    options
  );
  return response;
}

export const reviewerCheckedList = async ({
  batchCount,
  totalElements,
  sort,
  searchString,
  selectedOption,
  allPatientIds,
}) => {
  const uId = getStorage("userId");
  const url = `dbservice/patient/admin/computation/filter?page=${0}&size=${0}&userId=${uId}&computationStart=&computationEnd=&isAllocation=true&status=2&searchString=${
    searchString || ""
  }&sortdirection=${sort?.sortDir || ""}&sortfield=${
    sort?.sortField || ""
  }&priority=${selectedOption ? selectedOption : ""}&batchCount=${
    batchCount || ""
  }&allPatientIds=${allPatientIds}`;
  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};

export async function randomSampling(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(
    `management/allocation/random-sampling`,
    options
  );
  return response;
}

export async function getmoveBackLevel({roleId}) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/v1/move-back/get-role-status-details?roleId=${roleId}`,
    options
  );
  return res;
}

export async function moveBack(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(
    `management/v1/move-back`,
    options
  );
  return response;
}

export async function getRoles() {
  const tin = getStorage("tinNumber")
  const options = {
    method: "GET",
  };
  const res = await requestPortal(`dbservice/allocation/roles?tin=${tin}`, options);
  return res;
}
