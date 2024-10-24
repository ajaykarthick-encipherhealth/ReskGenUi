import CryptoJS from "crypto-js";
import { salt } from "../config";
import Swal from "sweetalert2";
import { removeStorage, setStorage } from "../storages";
const defaultHeaders = {
  "Content-Type": "application/json",
};

let err = false;
export const setHeaders = async () => {
  return { ...defaultHeaders };
};

export async function checkStatus2(response) {
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

function decryptData(encryptedData, key, iv) {
  try {
    // Assume yourEncryptedDataString is the Base64 string of the encrypted data
    encryptedData = CryptoJS.enc.Base64.parse(encryptedData); // Decode from Base64
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const ivUtf8 = CryptoJS.enc.Utf8.parse("Ne8ZXeHhilLBuAcW");

    const dec111 = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData },
      keyUtf8,
      {
        iv: ivUtf8,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    // Convert the decrypted data to a string
    const decryptedText = dec111.toString(CryptoJS.enc.Utf8);
    return decryptedText.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

export async function checkStatus(response) {
  setStorage("loginCheck", false);
  if (response?.status === 401) {
    Swal.fire({
      title: "",
      text: "Your session has timed out. Please log in again.",
      icon: "warning",
      confirmButtonText: "Logout",
      confirmButtonColor: "#DD6B55",
      closeOnConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location = "/login";
      }
      removeStorage()
    });} 
  else {
    const data = await response.text();
    try {
      err = false;
      const res = decryptData(data, salt, "Or-F1IjTa]1LiOt30en36,Py6z5Hz^Z=");
      return JSON.parse(res);
    } catch (error) {
      console.error(err);
    }
  }
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

export function resetSessionTimeoutFlag() {
  err = false;
}
