import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const getChatReply = createActionThunk("CHAT_BOT", network.ChatBot);
export const getEhChatReply = createActionThunk("EH_BOT", network.EhBot);
export const getChatHistory = createActionThunk(
  "CHAT_HISTORY",
  network.chatHistory
);
export const getUsersList = createActionThunk(
  "CHAT_USERS_LIST",
  network.usersList
);
export const getHandleChatHistory = createActionThunk(
  "HANDLE_CHAT_HISTORY",
  network.handleChatHistory
);
export const getHandleResetReadHistory = createActionThunk(
  "HANDLE_RESET_READ_HISTORY",
  network.handleResetReadHistory
);
export const getHandleFilePost = createActionThunk(
  "HANDLE_FILE_POST",
  network.handleFilePost
);
export const getDddUser = createActionThunk("CHAT_ADD_USER", network.addUser);
