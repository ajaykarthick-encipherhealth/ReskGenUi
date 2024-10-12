import { get } from "http";
import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function allocatedGetList({ url }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/patient/admin/computation/filter?${url}`,
    options
  );
  return res;
}
export const l2List = async ({ url }) => {
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `${url}
  `,
    options
  );
  return res;
};
export const selectedList = async ({ url }) => {
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `${url}
  `,
    options
  );
  return res;
};
// filters
export const filters = async ({ field, username, pageQueue }) => {
  const role = getStorage("userRole");
  const userRole = role?.toUpperCase();
  const url = username
    ? `dbservice/patient/filter/field/list?username=${username}&field=${field}&role=${userRole}`
    : `dbservice/patient/filter/field/list?field=${field}&role=${userRole}&page=${
        customPage ? customPage : 0
      }`;

  const customPage =
    field === "patientAllocated" && role === "supervisor"
      ? "auditedqueue"
      : pageQueue;
  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
export const patientAllocatedFilters = async ({
  field,
  username,
  pageQueue,
}) => {
  const role = getStorage("userRole");
  const userRole = role?.toUpperCase();
  const url = username
    ? `dbservice/patient/filter/field/list?username=${username}&field=${field}&role=${userRole}`
    : `dbservice/patient/filter/field/list?field=${field}&role=${userRole}&page=${
        customPage ? customPage : 0
      }`;

  const customPage =
    field === "patientAllocated" && role === "supervisor"
      ? "auditedqueue"
      : pageQueue;
  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
export const auditAssignedFilters = async ({ field, username, pageQueue }) => {
  const role = getStorage("userRole");
  const userRole = role?.toUpperCase();
  const url = username
    ? `dbservice/patient/filter/field/list?username=${username}&field=${field}&role=${userRole}`
    : `dbservice/patient/filter/field/list?field=${field}&role=${userRole}&page=${
        customPage ? customPage : 0
      }`;

  const customPage =
    field === "patientAllocated" && role === "supervisor"
      ? "auditedqueue"
      : pageQueue;
  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
export const allocatedByFilters = async ({ field, username, pageQueue }) => {
  const role = getStorage("userRole");
  const userRole = role?.toUpperCase();
  const url = username
    ? `dbservice/patient/filter/field/list?username=${username}&field=${field}&role=${userRole}`
    : `dbservice/patient/filter/field/list?field=${field}&role=${userRole}&page=${
        customPage ? customPage : 0
      }`;

  const customPage =
    field === "patientAllocated" && role === "supervisor"
      ? "auditedqueue"
      : pageQueue;
  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};

export const reviewerCheckedList = async ({
  batchCount,
  totalElements,
  sort,
  searchString,
  selectedOption,
  fromTenant,
}) => {
  const orgId = getStorage("orgId");
  const uId = getStorage("userId");
  const url = fromTenant
    ? `dbservice/patient/admin/computation/filter?page=${0}&size=${
        batchCount ? batchCount : totalElements
      }&userId=${uId}&computationStart=&computationEnd=&isAllocation=true&status=2&searchString=${searchString}&sortdirection=${
        sort?.sortDir
      }&sortfield=${sort?.sortField}&priority=${
        selectedOption ? selectedOption : ""
      }&batchCount=${batchCount}`
    : `dbservice/patient/admin/computation/filter?organizationId=${orgId}&page=${0}&size=${
        batchCount ? batchCount : totalElements
      }&userId=${uId}&computationStart=&computationEnd=&isAllocation=true&status=2&searchString=${searchString}&sortdirection=${
        sort?.sortDir
      }&sortfield=${sort?.sortField}&priority=${
        selectedOption ? selectedOption : ""
      }&batchCount=${batchCount}`;

  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};

export const supervisorCheckedList = async ({
  userName,
  pageNo,
  sort,
  searchString,
  selectedOption,
  allocatedOption,
  fromTenant,
}) => {
  const orgId = getStorage("orgId");
  const url = fromTenant
    ? `dbservice/l2audit/patients?username=${userName}&page=${pageNo}&size=${15}&sortdirection=${
        sort?.sortDir ? sort?.sortDir : "DESC"
      }&sortfield=${
        sort?.sortField ? sort?.sortField : "dueDate"
      }&searchstring=${searchString}&processedStatus=${
        selectedOption ? selectedOption : ""
      }&patientAllocated=${allocatedOption ? allocatedOption : ""}`
    : `dbservice/l2audit/patients?organizationId=${orgId}&username=${userName}&page=${pageNo}&size=${15}&sortdirection=${
        sort?.sortDir ? sort?.sortDir : "DESC"
      }&sortfield=${
        sort?.sortField ? sort?.sortField : "dueDate"
      }&searchstring=${searchString}&processedStatus=${
        selectedOption ? selectedOption : ""
      }&patientAllocated=${allocatedOption ? allocatedOption : ""}`;

  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};

export const usersList = async ({ search }) => {
  const orgId = getStorage("orgId");
  const url = `dbservice/user/getL1UsersByOrgIdAndTenantId?orgid=${orgId}&searchString=${search}`;

  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
export const allocateUsers = async ({ data }) => {
  const url = `dbservice/patient/admin/assignPatients`;
  const options = {
    method: "POST",
    body:JSON.stringify(data)
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};