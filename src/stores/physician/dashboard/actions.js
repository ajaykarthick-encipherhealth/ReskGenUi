import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllPhysician = createActionThunk(
  "GET_ALL_PHYSISCIANS",
  network.getAllPhysicianApi
);
