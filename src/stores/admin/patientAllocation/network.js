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

  const res = await requestPortal(
    `${url}`,
    options
  );
  return res;
};
export const patientAllocatedFilters = async ({ field, username, pageQueue }) => {
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

  const res = await requestPortal(
    `${url}`,
    options
  );
  return res;
};export const auditAssignedFilters = async ({ field, username, pageQueue }) => {
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

  const res = await requestPortal(
    `${url}`,
    options
  );
  return res;
};export const allocatedByFilters = async ({ field, username, pageQueue }) => {
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

  const res = await requestPortal(
    `${url}`,
    options
  );
  return res;
};