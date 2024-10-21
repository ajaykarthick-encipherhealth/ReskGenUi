import { requestPortal } from "../../utils/network";

export const ChatBot = async (msg) => {
  const options = {
    method: "POST",
    body: {},
  };
  const data = await requestPortal(`aiservice/ai/chat?input=${msg}`, options);
  return data;
};

export const chatHistory = async (userName) => {
  const options = {
    method: "GET",
  };

  const response = await requestPortal(
    `chatservice/api/get/history?receiver=${userName}`,
    options
  );
  return response;
};

export async function usersList(userName) {
  const options = {
    method: "GET",
  };

  const response = await requestPortal(`chatservice/api/users`, options);
  return response;
}

export async function handleChatHistory(
  secondaryUser,
  userName,
  pageNumber,
  pageSize
) {
  const options = {
    method: "GET",
  };
  const response = await requestPortal(
    `chatservice/api/messages/private?sender=${secondaryUser}&receiver=${userName}&pageNo=${pageNumber}&pageSize=${pageSize}`,
    options
  );
  return response;
}

export async function handleResetReadHistory(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(
    `chatservice/api/change/status`,
    options
  );
  return response;
}

export async function handleFilePost(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(`chatservice/api/uploadFile`, options);
  return response;
}

export async function addUser(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(`chatservice/api/uploadFile`, options);
  return response;
}
