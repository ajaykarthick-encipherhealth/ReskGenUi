import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getCustomUsersAction=createActionThunk(
  'GET_CUSTOM_USERS',
  network.getCustomAllUsers
)