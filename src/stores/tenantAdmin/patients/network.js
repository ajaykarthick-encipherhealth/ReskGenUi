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
  selectedOption,
  searchText,
  selectedDateRanges,
  sort,
}) {
  const options = {
    method: "GET",
  };

  const uId = getStorage("userId");
  try {
    const data = await requestPortal(
      `dbservice/patient/admin/computation/filter?page=${
        pageNo || 0
      }&size=15&userId=${uId}&organizationId=${
        selectedOption?.organization ? selectedOption?.organization : ""
      }&batchId=${selectedOption?.Batch ? selectedOption?.Batch : ""}&flagName=${
        selectedOption?.flag || ""
      }&isAllocation=false&computationStart=${
        selectedDateRanges?.computedDate?.startDate || ""
      }&computationEnd=${
        selectedDateRanges?.computedDate?.endDate || ""
      }&status=${
        selectedOption?.status ? selectedOption?.status : ""
      }&searchString=${searchText ? searchText : ""}&createdStartDate=${
        selectedDateRanges?.createdDateRange?.startDate
          ? selectedDateRanges?.createdDateRange?.startDate
          : ""
      }&createdEndDate=${
        selectedDateRanges?.createdDateRange?.endDate
          ? selectedDateRanges?.createdDateRange?.endDate
          : ""
      }&patientCreatedBy=${
        selectedOption?.createdBy || ""
      }&patientAllocatedTo=${""}&patientAllocatedBy=${""}&sortfield=${
        sort?.sortField ? sort?.sortField : ""
      }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}`,
      options
    );
    return data;
  }

  catch (err) {
    return null

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
export async function getRetreggerPatient({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortalFiles(
    `management/temporal/retry`,
    options
  );
  return data;
}
