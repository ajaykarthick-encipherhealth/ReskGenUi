import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const loadNotification = createActionThunk(
  "NOTIFICATION",
  network.loadNotification
);