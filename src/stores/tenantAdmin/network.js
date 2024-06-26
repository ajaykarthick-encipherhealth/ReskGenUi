import { requestPortal } from "../../utils/network";

export async function batchUploadCall({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `aiservice/ai/batch/upload
  `,
    options
  );
  return data;
}

export async function getAllOrganization() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenant/getall/organization`,
    options
  );
  return data;
}

export async function getallUsers({
  pageCount = 0,
  search = "",
  startDate = "",
  endDate = "",
  status = "",
  role = "",
  sort,
  orgId = "",
}) {
  const options = {
    method: "GET",
  };
  const selectedStatus = status === "ALL" ? "" : status;
  const selectOrgId = orgId === "ALL" ? "" : orgId;

  const data = await requestPortal(
    `dbservice/user/admin/filter?page=${pageCount}&size=15&searchString=${search}&organizationId=${selectOrgId}&createdDateStart=${startDate}&createdDateEnd=${endDate}&isEnabled=${selectedStatus}&role=${role}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}`,
    options
  );
  return data;
}

export async function getAllPatient(
  pageNo,
  computationStart = "",
  computationEnd = "",
  status,
  search = "",
  createdStartDate,
  createdEndDate,
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy,
  sort,
  orgId
) {
  const options = {
    method: "GET",
  };
  const uId = localStorage.getItem("userId");
  const filteredStatus = status === undefined ? "" : status;
  const selectOrgId = orgId === "ALL" || orgId == undefined ? "" : orgId;
  const data = await requestPortal(
    `dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&organizationId=${selectOrgId}&isAllocation=false&computationStart=${computationStart}&computationEnd=${computationEnd}&status=${filteredStatus}&searchString=${search}&createdStartDate=${createdStartDate}&createdEndDate=${createdEndDate}&patientCreatedBy=${
      selAllocatedBy === "All" ? "" : selAllocatedBy
    }&patientAllocatedTo=${
      selAllocatedTo === "All" ? "" : selAllocatedTo
    }&patientAllocatedBy=${
      selCreatedBy === "All" ? "" : selCreatedBy
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }`,
    options
  );
  return data;
}

export async function getAllTracking(datas) {
  const uId = localStorage.getItem("userId");
  const options = {
    method: "GET",
  };
  const filteredStatus =
    datas?.selectedOption === undefined ? "" : datas?.selectedOption;
  const filteredDStart =
    datas?.dueDateStart === undefined ? "" : datas?.dueDateStart;

  const data = await requestPortal(
    `dbservice/patient/admin/filter?userId=${uId}&organizationId=${
      datas?.selectOrgId
    }&page=${
      datas?.pageNo
    }&size=15&processedStatus=${filteredStatus}&dueDateStart=${filteredDStart}&dueDateEnd=${
      datas?.dueDateEnd
    }&auditedStartDate=${datas?.processedStart}&auditedEndDate=${
      datas?.processedEnd
    }&searchString=${datas?.searchTextValue}&patientAllocated=${
      datas?.selAllocatedTo === "All" ? "" : datas?.selAllocatedTo
    }&auditAllocatedStart=${datas?.allocatedStartDate}&auditAllocatedEnd=${
      datas?.allocatedEndDate
    }&allocatedOnStart=${datas?.auditedStartDate}&allocatedOnEnd=${
      datas?.auditedEndDate
    }&allocatedBy=${datas?.selAllocatedBy}&auditDueDateStart=${
      datas?.auditedDueStartDate
    }&auditDueDateEnd=${datas?.auditedDueEndDate}&auditedStatus=${
      datas?.auditSelectedOption ? datas?.auditSelectedOption : ""
    }&auditAllocatedBy=${
      datas?.selAuditAllocatedBy ? datas?.selAuditAllocatedBy : ""
    }&auditedAssigned=${
      datas?.auditSelAllocatedTo ? datas?.auditSelAllocatedTo : ""
    }&sortfield=${
      datas?.sort?.sortField ? datas?.sort?.sortField : ""
    }&sortdirection=${datas?.sort?.sortDir ? datas?.sort?.sortDir : ""}`,
    options
  );
  return data;
}

export async function getAllFileProcess(
  searchstring = "",
  status = "",
  startdate = "",
  enddate = ""
) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/file-process/status`, options);
  return data;
}

export async function allBatches({ page }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/batch/batchupload?page=${page}&size=15`,
    options
  );
  return data;
}
export async function createBatch({ info }) {
  const options = {
    method: "POST",
    body: JSON.stringify(info),
  };
  const data = await requestPortal(`management/batch`, options);
  return data;
}
export async function uploadFile({ info }) {
  console.log(info,JSON.stringify(info))
  const options = {
    method: "POST",
    body: JSON.stringify(info),
  };
  const data = await requestPortal(`management/batch/upload`, options);
  return data;
}
