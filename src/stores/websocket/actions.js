import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const websocketAction = createActionThunk(
  "WEB_SOCKET_DETAILS",
  network.websocketList
);