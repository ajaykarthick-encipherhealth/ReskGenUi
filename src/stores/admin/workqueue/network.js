import { requestPortal, requestPortalFiles } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function PatientsList({ data }) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const orgId = getStorage("orgId");

  const url = `page=${
    data?.pageNo
  }&size=15&userId=${uId}&organizationId=${orgId}&isAllocation=false&computationStart=${
    data?.computedStartDate
  }&computationEnd=${data?.computedEndDate}&status=${
    data?.selectedOption
  }&searchString=${data?.search}&createdStartDate=${
    data?.completedStartDate
  }&createdEndDate=${data?.completedEndDate}&patientCreatedBy=${
    data?.selAllocatedBy === "All" ? "" : data?.selAllocatedBy
  }&patientAllocatedTo=${
    data?.selAllocatedTo === "All" ? "" : data?.selAllocatedTo
  }&patientAllocatedBy=${
    data?.selCreatedBy === "All" ? "" : data?.selCreatedBy
  }&sortfield=${
    data?.sort?.sortField ? data?.sort?.sortField : ""
  }&sortdirection=${data?.sort?.sortDir ? data?.sort?.sortDir : ""}`;
  const res = await requestPortal(
    `dbservice/patient/admin/computation/filter?${url}`,
    options
  );
  return res;
}
export const TrackingList = async ({ data }) => {
  const uId = getStorage("userId");
  const orgId = getStorage("orgId");
  const filteredStatus =
    data?.selectedOption === undefined ? "" : data?.selectedOption;
  const filteredDStart =
    data?.dueDateStart === undefined ? "" : data?.dueDateStart;

  const url = `userId=${uId}&organizationId=${orgId}&page=${
    data?.pageNo
  }&size=15&processedStatus=${filteredStatus}&processedStart=${filteredDStart}&processedEnd=${
    data?.dueDateEnd
  }&searchString=${data?.searchTextValue}&patientAllocated=${
    data?.selAllocatedTo === "All" ? "" : data?.selAllocatedTo
  }&auditAllocatedStart=${data?.allocatedStartDate}&auditAllocatedEnd=${
    data?.allocatedEndDate
  }&allocatedOnStart=${data?.auditedStartDate}&allocatedOnEnd=${
    data?.auditedEndDate
  }&allocatedBy=${data?.selAllocatedBy}&auditedStartDate=${
    data?.auditedDueStartDate
  }&auditedEndDate=${data?.auditedDueEndDate}&auditedStatus=${
    data?.auditSelectedOption ? data?.auditSelectedOption : ""
  }&auditAllocatedBy=${
    data?.selAuditAllocatedBy ? data?.selAuditAllocatedBy : ""
  }&auditedAssigned=${
    data?.auditSelAllocatedTo ? data?.auditSelAllocatedTo : ""
  }&sortfield=${
    data?.sort?.sortField ? data?.sort?.sortField : ""
  }&sortdirection=${data?.sort?.sortDir ? data?.sort?.sortDir : ""}`;
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/patient/admin/filter?${url}
  `,
    options
  );
  return res;
};

// addPatient
export async function addPatient({ data }) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(`dbservice/patient`, options);
  return res;
}
// uploadFile
export async function uploadFile({ data }) {
  const options = {
    method: "POST",
    body: data
  };
  const res = await requestPortalFiles(`aiservice/ai/upload`, options);
  return res;
}
export async function uploadRadiologyFile({ data }) {
  const options = {
    method: "POST",
    body: data,
  };
  const res = await requestPortalFiles(`aiservice/ai/upload/radiology`, options);
  return res;
}

export async function uploadLabFile({ data }) {
  const options = {
    method: "POST",
    body: data,
  };
  const res = await requestPortalFiles(`aiservice/ai/upload/lab`, options);
  return res;
}
export const getUsers = async ({ pageNo,pageSize }) => {
  const uId=getStorage("userId")
  const url = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}`;
  const options = {
    method: "GET"
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};