import { requestPortal, requestPortalFiles } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";


export async function getAllBatch() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/batch/getallbatch`, options);
  return data;
}

