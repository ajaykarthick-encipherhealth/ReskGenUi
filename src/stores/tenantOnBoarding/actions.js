import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const getAllOnBoarding = createActionThunk(
  "GET_ALL_ONBOARDING",
  network.getAllOnBoarding
);
