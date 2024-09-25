import axios from "../utility/axiosConfig";
import ENDPOINTS from "../utility/enpoints";
import { getStorage } from "../utils/storages";

export async function getChatHistory(userName) {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}chatservice/api/get/history?receiver=${userName}`,
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
      `${ENDPOINTS?.apiEndoint}chatservice/api/users`,
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
      `${ENDPOINTS?.apiEndoint}chatservice/api/messages/private?sender=${secondaryUser}&receiver=${userName}&pageNo=${pageNumber}&pageSize=${pageSize}`,
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

export async function getHandleResetReadHistory(data) {
  const token = getStorage("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}chatservice/api/change/status`,
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
        `${ENDPOINTS?.apiEndoint}chatservice/api/uploadFile`,
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
        `${ENDPOINTS?.apiEndoint}chatservice/api/uploadFile`,
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
  
