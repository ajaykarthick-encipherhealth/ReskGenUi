import { requestPortal, requestPortalFiles } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";


export async function getAllBatch() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/batch/getallbatch`, options);
  return data;
}
// addProvider
export async function addProvider({ payload }) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const res = await requestPortal(
    `dbservice/v1/provider/save`,
    options
  );
  return res;
}
//NPI List
export async function getProviderNPIList({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const res = await requestPortal(
    `management/v1/provider/get/npi-number`,
    options
  );
  return res;
}
// NPI Name list
export async function getProviderNameList(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const res = await requestPortal(
    `management/v1/provider/get/name`,
    options
  );
  return res;
}


