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
export async function getAllPatient({
  pageNo,
  computationStart = "",
  computationEnd = "",
  selectedOption,
  searchVal,
  createdStartDate = "",
  createdEndDate = "",
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy,
  sort,
  selectOrgList,
  selectBatchList,
  flagList,
}) {
  const options = {
    method: "GET",
  };

  const uId = getStorage("userId");
  const filteredStatus = selectedOption === undefined ? "" : selectedOption;
  const selectOrgId = selectOrgList === "ALL" || selectOrgList == undefined ? "" : selectOrgList;
  const selectBatchId =
    selectBatchList === "ALL" || selectBatchList == undefined
      ? ""
      : selectBatchList;
  try {
    const data = await requestPortal(
      `dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&organizationId=${
        selectOrgId || ""
      }&batchId=${selectBatchId || ""}&flagName=${
        flagList || ""
      }&isAllocation=false&computationStart=${computationStart}&computationEnd=${computationEnd}&status=${
        filteredStatus || ""
      }&searchString=${searchVal || ""}&createdStartDate=${
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
  } catch (err) {
    return null;
  }
}

export async function submitPatientId({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/patient`, options);
  return data;
}

export async function uploadFiles({ obj }) {
  const options = {
    method: "POST",
    body: obj,
  };
  const data = await requestPortalFiles(`aiservice/ai/upload`, options);
  return data;
}

export async function uploadFilesRadiology({ obj }) {
  const options = {
    method: "POST",
    body: obj,
  };
  const data = await requestPortalFiles(
    `aiservice/ai/upload/radiology`,
    options
  );
  return data;
}
