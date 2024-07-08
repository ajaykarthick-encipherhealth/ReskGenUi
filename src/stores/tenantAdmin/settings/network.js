import { requestPortal } from "../../../utils/network";

export async function configurationSettings({ type }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`management/tenantAdmin/fileProcessingConfig?type=${type}`,
    options
  );
  return data;
}

export async function codingGuidelines({ type }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`management/tenantAdmin/medicalCodingGuidelines?type=${type}`,
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

export async function manualAdd(obj) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  const data = await requestPortalForTenant(`tenantadmin/manualAdd`, options);
  return data;
}

export async function healthMetricAdd(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortalForTenant(
    `tenantadmin/addHealthMetric`,
    options
  );
  return data;
}