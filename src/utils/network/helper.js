import { osName } from "react-device-detect";
// import { tokenKey } from "../config";
// import { removeStorage, setStorage } from "../storages";

const defaultHeaders = {
  "Content-Type": "application/json",
  // systemName: osName || "Unknown",
};

export const setHeaders = async () => {
  return { ...defaultHeaders };
};

export async function checkStatus(response) {
  const data = await response.json();
  if (data.logout) {
    await removeStorage(tokenKey);
    window.open("/", "_self");
    return;
  }
  if (response.status !== 202) {
    const error = {
      ...data,
    };
    throw error;
  }
  return data;
}
