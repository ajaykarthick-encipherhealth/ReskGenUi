export const getStorage = (key) => {
  try {
    const encryptedKey = btoa(JSON.stringify(key));
    const data = sessionStorage.getItem(encryptedKey);
    return JSON.parse(atob(data));
  } catch (error) {
    console.error(`Error getting '${key}' from LocalStorage`);
    console.error(error);
    return null;
  }
};

export const setStorage = (key, value) => {
  try {
    const encryptedKey = btoa(JSON.stringify(key));
    const encryptedValue = btoa(JSON.stringify(value));
    sessionStorage.setItem(encryptedKey, encryptedValue);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error setting '${key}' in LocalStorage`);
    console.error(error);
    return null;
  }
};

export const removeStorage = (key) => {
  try {
    const encryptedKey = btoa(JSON.stringify(key));
    sessionStorage.removeItem(encryptedKey);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error removing token ${key} from LocalStorage`);
    console.error(error);
    return null;
  }
};
