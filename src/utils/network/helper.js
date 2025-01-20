import CryptoJS from "crypto-js";
import { isEncrypted, salt } from "../config";
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
    encryptedData = CryptoJS.enc.Base64.parse(encryptedData);
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
    const decryptedText = dec111.toString(CryptoJS.enc.Utf8);
    return decryptedText.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

export async function checkStatus(response) {
  setStorage("loginCheck", false);
  const showModal = async (
    message,
    buttonText = "Back", 
    showCloseButton = true,
    clearStorage = false
  ) => {
    if (showCloseButton) appendCloseButtonStyle();
    const result = await Swal.fire({
      title: "",
      text: message,
      icon: "warning",
      confirmButtonText: buttonText,
      confirmButtonColor: "#DD6B55",
      showCloseButton,
    });

    if (result.isConfirmed && clearStorage) {
      removeStorage();
      window.location = "/login";
    }
  };
  const appendCloseButtonStyle = () => {
    const existingStyle = document.getElementById("swal2-close-style");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "swal2-close-style";
      style.innerHTML = `
        .swal2-close {
          font-size: 32px !important;
          top: 10px !important;
          right: 10px !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const handleDecryption = async (data) => {
    try {
      const decrypted = decryptData(
        data,
        salt,
        "Or-F1IjTa]1LiOt30en36,Py6z5Hz^Z="
      );
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt response data");
    }
  };

  if (!response) return;

  const { status } = response;

  switch (status) {
    case 401: {
      await showModal(
        "Your session has timed out. Please log in again.",
        "Logout",
        false,
        true
      );
      break;
    }
    case 500: {
      await showModal(
        "Something went wrong on our end. Please try again later."
      );
      break;
    }
    case 403: {
      await showModal("You don't have permission to access this page.");
      break;
    }
    case 512:
    case 513: {
      await showModal(
        "An error occurred due to unhandled exceptions or unexpected conditions within the system."
      );
      break;
    }
    default: {
      const data =
        isEncrypted === "true" ? await response.text() : await response.json();
      if (isEncrypted === "true") {
        return await handleDecryption(data);
      } else {
        if (data.logout) {
          await removeStorage(tokenKey);
          window.open("/", "_self");
          return;
        }
        if (status !== 200) {
          throw { ...data };
        }
        return data;
      }
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
