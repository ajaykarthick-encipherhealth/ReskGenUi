import { checkStatus } from "./helper";
import { getStorage } from "../storages";
import { portalUrl, tokenKey } from "../config";
import ENDPOINTS from "../../utility/enpoints";

export async function requestPortal(url, options) {
  const token = await getStorage(tokenKey);
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer" + " " + token}`,
      "Content-Type": "application/json",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestPortalFiles(url, options) {
  const token = await getStorage(tokenKey);
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer" + " " + token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestAUthflow(url, options) {
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      // Authorization: `${"Bearer"+ " " + token}`,
      "Content-Type": "application/json",
    },
  };
  return fetch(actualUrl, actualOptions).then(async (res) => {
    const response = await res.json();
    const userDetails = JSON.parse(options.body);
    const skip = response?.response?.skipEntryAvailable;
    const mfa = response?.response?.mfaIsEnabled;
    if (response?.response) {
      const encodedParams = btoa(
        JSON.stringify({
          mfa: mfa,
          skipEntry: skip,
          username: userDetails.username,
          password: userDetails.password,
        })
      );
      const searchParams = new URLSearchParams();
      searchParams.append("params", encodedParams);
      window.open(
        `/twofactorAuthentication/Authentication?params=${searchParams.toString()}`,
        "_self"
      );
    } else {
      notification.error({
        message: response.message,
        duration: 1,
      });
    }
  });
}
