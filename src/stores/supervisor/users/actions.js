import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getUsers = createActionThunk(
  "GET_USERS",
  network.usersList
);
export const getIndividualUsers = createActionThunk(
  "INDIVIDUAL_USER",
  network.individualUsersList
);
export const getCurrentUserInfo = createActionThunk(
  "CURRENT_USER",
  network.CurrentUserInfo
);