// import { osName } from "react-device-detect";
// import { tokenKey } from "../config";
// import { removeStorage, setStorage } from "../storages";

import Swal from "sweetalert2";

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
  if (response.status !== 200) {
    const error = {
      ...data,
    };
    throw error;
  }
  if(response.status===401){
    Swal.fire({
      title: '',
      text: 'Your session has timed out. Please log in again.',
      icon: 'warning',
      confirmButtonText: 'Logout',
      confirmButtonColor: "#DD6B55",
      closeOnConfirm: false
    }).then((result) => { 
      if (result.isConfirmed) {
         window.location = "/login"
        } 
    })
  }
  return data;
}

export async function checkAuth(response) {
  const data = await response.json();
  if (data.logout) {
    await removeStorage(tokenKey);
    window.open("/", "_self");
    return;
  }
  if (response.status !== 200) {
    const error = {
      ...data,
    };
    throw error;
  }
  return data;
}
