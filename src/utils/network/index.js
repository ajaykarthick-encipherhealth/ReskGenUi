import { checkStatus } from "./helper";
import { getStorage } from "../storages";
import { portalUrl, tokenKey } from "../config";
import ENDPOINTS from "../../utility/enpoints";

export async function requestPortal(url, options) {
  const token = await getStorage(tokenKey);
  const actualUrl = `${ENDPOINTS.apiEndoint}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer"+ " " + token}` ,
      "Content-Type": "application/json",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestExternal(url, options) {
  const actualOptions = {
    ...options,
  };
  return fetch(url, actualOptions).then(checkStatus);
}
