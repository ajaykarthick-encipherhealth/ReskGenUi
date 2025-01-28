import { requestPortal, requestPortalFiles } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

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
export async function getAllBatch() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/batch/getallbatch`, options);
  return data;
}
export async function getAllPatient(
  pageNo,
  computationStart = "",
  computationEnd = "",
  status,
  search = "",
  createdStartDate = "",
  createdEndDate = "",
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy,
  sort,
  orgId,
  selectBatchList
) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const filteredStatus = status === undefined ? "" : status;
  const selectOrgId = orgId === "ALL" || orgId == undefined ? "" : orgId;
  const selectBatchId =
    selectBatchList === "ALL" || selectBatchList == undefined
      ? ""
      : selectBatchList;
  const data = await requestPortal(
    `dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&organizationId=${
      selectOrgId || ""
    }&batchId=${
      selectBatchId || ""
    }&isAllocation=false&computationStart=${computationStart}&computationEnd=${computationEnd}&status=${
      filteredStatus || ""
    }&searchString=${search || ""}&createdStartDate=${
      createdStartDate || ""
    }&createdEndDate=${createdEndDate || ""}&patientCreatedBy=${
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

export async function submitPatientId({obj}) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `dbservice/patient`,
    options
  );
  return data;
}

export async function uploadFiles({obj}) {
  const options = {
    method: "POST",
    body: obj
  };
  const data = await requestPortalFiles(
    `aiservice/ai/upload`,
    options
  );
  return data;
}

export async function uploadFilesRadiology({obj}) {
  const options = {
    method: "POST",
    body: obj
  };
  const data = await requestPortalFiles(
    `aiservice/ai/upload/radiology`,
    options
  );
  return data;
}
