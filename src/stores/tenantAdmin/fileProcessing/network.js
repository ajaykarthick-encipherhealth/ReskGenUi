import { requestPortal, requestPortalFiles } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";


export async function uploadRadiologyFile({ data }) {
  const options = {
    method: "POST",
    body: data,
  };
  const res = await requestPortalFiles(`aiservice/ai/upload/radiology`, options);
  return res;
}

export async function uploadFile({ data }) {
  const options = {
    method: "POST",
    body: data
  };
  const res = await requestPortalFiles(`aiservice/ai/upload`, options);
  return res;
}
export async function uploadFilesRadiology({ data }) {
  const options = {
    method: "POST",
    body: data
  };
  const res = await requestPortalFiles(`aiservice/ai/upload/radiology`, options);
  return res;
}

export async function addPatient({ data }) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(`dbservice/patient`, options);
  return res;
}

export const getUsers = async ({ pageNo,pageSize,selectOrgList="" }) => {
  const uId=getStorage("userId")
  const url = `dbservice/patient/getbyuser?userId=${uId}&page=${pageNo}&size=${pageSize}&orgId=${selectOrgList}`;
  const options = {
    method: "GET"
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};


