import { checkStatus } from "./helper";
import { getStorage } from "../storages";
import { portalMockoon, portalUrl, tokenKey } from "../config";

// export async function requestPortal(url, options) {
//   const token = getStorage(tokenKey);
//   const actualUrl = `${portalUrl}${url}`;
//   const actualOptions = {
//     ...options,
//     headers: {
//       Authorization: `${"Bearer" + " " + token}`,
//       "Content-Type": "application/json",
//     },
//   };
//   return fetch(actualUrl, actualOptions).then(checkStatus);
// }
export async function requestPortal(url, options) {
  const token = getStorage(tokenKey);
  const clientId = getStorage("clientId");
  const userRoleId = getStorage("roleId");
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer" + " " + token}`,
      "Content-Type": "application/json",
      "X-Role-Id": userRoleId,
      "X-Client": "test",
      "X-Org": "test",
      "X-Project": "test",
      "X-Org-based": "true",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestPortalMockoon(url, options) {
  const token = getStorage(tokenKey);
  const actualUrl = `${portalMockoon}${url}`;
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
  const token = getStorage(tokenKey);
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      // "Content-Type": "multipart/form-data",
      Authorization: `${"Bearer" + " " + token}`,
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestPortalImgUpload(url, options) {
  const actualUrl = `${url}`;
  const actualOptions = {
    ...options,
  };
  return fetch(actualUrl, actualOptions).then((res) => res);
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
        `/twofactorauthentication/authentication?params=${searchParams.toString()}`,
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

export async function authRequestPortal(url, options) {
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestPortalRoleBased(url, options) {
  const token = getStorage(tokenKey);
  const userRoleId = getStorage("roleId");
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer" + " " + token}`,
      "Content-Type": "application/json",
      "X-Role-Id": userRoleId,
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}
