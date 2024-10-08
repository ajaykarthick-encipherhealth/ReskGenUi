import axios from "../utility/axiosConfig";
import ENDPOINTS from "../utility/enpoints";
import { getStorage } from "../utils/storages";

export async function getChatHistory(userName) {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint1}chatservice/api/get/history?receiver=${userName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getUsers(userName) {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint1}chatservice/api/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getHandleChatHistory(
  secondaryUser,
  userName,
  pageNumber,
  pageSize
) {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint1}chatservice/api/messages/private?sender=${userName}&receiver=${secondaryUser}&pageNo=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json',
          'X-Tenant':'default'
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getHandleResetReadHistory(data) {
  const token = getStorage("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint1}chatservice/api/change/status`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function handleFilePost(data) {
    const token = getStorage("token");
    try {
      const response = await axios.post(
        `${ENDPOINTS?.apiEndoint1}chatservice/api/uploadFile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  export async function addUser(data) {
    const token = getStorage("token");
    try {
      const response = await axios.post(
        `${ENDPOINTS?.apiEndoint1}chatservice/api/uploadFile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }