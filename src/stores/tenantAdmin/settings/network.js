import { requestPortal, requestPortalFiles } from "../../../utils/network";

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

export async function allBatches({
  page,
  search,
  batchUploadStatus,
  startDate,
  endDate,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/batch/batchupload?page=${page}&size=15&searchString=${
      search ? search : ""
    }&batchUploadStatus=${
      batchUploadStatus ? batchUploadStatus : ""
    }&startDate=${startDate ? startDate : ""}&endDate=${
      endDate ? endDate : ""
    }`,
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

export async function batchDetails({
  batchId,
  page,
  search,
  startDate,
  endDate,
  fileStatus,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/batch/batchuploaddetails?batchId=${batchId}&page=${page}&size=15&searchString=${search}&fileStatus=${
      fileStatus ? fileStatus : ""
    }&startDate=${startDate ? startDate : ""}&endDate=${
      endDate ? endDate : ""
    }`,
    options
  );
  return data;
}

export async function getCustomAllUsers() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/user/getuser/page`, options);
  return data;
}

export async function configurationSettings({ type }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/tenantAdmin/fileProcessingConfig?type=${type}`,
    options
  );
  return data;
}
export async function configurationFlags() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/flag/getAllFlag`,
    options
  );
  return data;
}

export async function configurationUpdateSettings(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/fileProcessingConfig/update`,
    options
  );
  return data;
}

export async function updateChatAuditConf(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/fileProcessingConfig/updateChartAuditConfig`,
    options
  );
  return data;
}
export async function updateMedicalCoding(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/update`,
    options
  );
  return data;
}

export async function codingGuidelines({ type }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines?type=${type}`,
    options
  );
  return data;
}

export async function updateSettings(obj) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  const data = await requestPortalForTenant(
    `tenantadmin/updateSettings`,
    options
  );
  return data;
}

export async function updateInsulinConfigs(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/updateInsulin`,
    options
  );
  return data;
}

export async function updateMedications(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines`,
    options
  );
  return data;
}
export async function updateFlag(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `dbservice/flag/saveflag`,
    options
  );
  return data;
}
export async function deleteFlag(id) {
  const options = {
    method: "DELETE",
  };
  const data = await requestPortal(
    `dbservice/flag/deleteflag?flagId=${id}`,
    options
  );
  return data;
}

export async function updateDirectCodes(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/updateDirectConfirmCodeConfig`,
    options
  );
  return data;
}
export async function updateComorbidConditions(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/updateComorbidConditionConfig`,
    options
  );
  return data;
}
export async function updateCriticalConditions(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/updateCriticalConditionConfig`,
    options
  );
  return data;
}
export async function updateHistoryCodes(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/updateHistoryCodeConfig`,
    options
  );
  return data;
}
export async function updateDownCode(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/updateDownCodeConfig`,
    options
  );
  return data;
}
export async function updateRafConfig(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/medicalCodingGuidelines/updateRaf`,
    options
  );
  return data;
}
export async function uploadFile(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortalFiles(
    `management/tenantAdmin/codes/upload`,
    options
  );
  return data;
}
export async function editHealthMertic(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/codes/update`,
    options
  );
  return data;
}
export async function editComoridCondition(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/codes/update`,
    options
  );
  return data;
}
export async function deleteComoridCondition(obj) {
  const options = {
    method: "POST",
    // body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `management/tenantAdmin/codes/delete?id=${obj.id}&isActive=false&target=${obj.target}`,
    options
  );
  return data;
}