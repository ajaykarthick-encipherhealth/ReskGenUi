import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getL2UsersList = createActionThunk(
  "GET_L2_USERS_LIST",
  network.usersList
);
export const getAllocateUsers = createActionThunk(
  "ALLOCATE_USERS_in_L2",
  network.allocateUsers
);