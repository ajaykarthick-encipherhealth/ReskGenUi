import CryptoJS from "crypto-js";
const secretKey = "B27AA05B9A2490D1AE59B33B45CFD4B0";
const hashKey = (key) => {
  return CryptoJS.SHA256(key).toString();
};
export const getStorage = (key) => {
  try {
    const hashedKey = hashKey(key);
    const encryptedValue = sessionStorage.getItem(hashedKey);
    if (!encryptedValue) return null;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
    const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedValue;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setStorage = (key, value) => {
  try {
    const hashedKey = hashKey(key);
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value); 
    const encryptedValue = CryptoJS.AES.encrypt(stringValue, secretKey).toString();
    sessionStorage.setItem(hashedKey, encryptedValue);
    return Promise.resolve();
  } catch (error) {
    console.error(error);
    return null;
  }
};



export const removeStorage = (key) => {
  try {
    const hashedKey = hashKey(key);
    sessionStorage.removeItem(hashedKey);
    return Promise.resolve();
  } catch (error) {
    console.error(error);
    return null;
  }
};
