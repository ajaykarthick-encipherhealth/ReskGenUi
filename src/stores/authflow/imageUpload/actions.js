import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getuploadurl = createActionThunk(
  "GET_UPLOADED_URL",
  network.uploadURL
);
export const getURL = createActionThunk(
  "GET_URL",
  network.getURL
);
export const updateImage = createActionThunk(
  "UPDATE_IMAGES",
  network.updateImage
);
export const getLogedInUser = createActionThunk(
  "GET_LOGIN_USER",
  network.getUser
);

