import { createActionThunk } from "../../utils/redux";
import * as network from "./network";

export const getMFAValidation = createActionThunk(
  "GET_MFA_VALIDATION",
  network.mfaValidation
);

export const getLogin = createActionThunk(
  "GET_LOGIN",
  network.login
);

export const getQrCode = createActionThunk(
  "GET_QRCODE",
  network.qrCodeFunc
);

export const getValidateCode = createActionThunk(
  "GET_VALIDATE_CODE",
  network.validateCode
);

export const getTenant = createActionThunk(
  "GET_TENANT",
  network.tenantsInfo
);

export const getOrganization = createActionThunk(
  "GET_ORGANIZATION",
  network.orgInfo
);
export const getTotalElements = createActionThunk(
  "GET_TOTAL_ELEMENTS",
  network.totalElements
);

export const getUserDetails = createActionThunk(
  "GET_USER_DETAILS",
  network.getUser
);

export const getPreSendURlMethoD=createActionThunk(
  "PRE_SEND_URL",
  network.preSendUrl
)

export const getUpdateImage=createActionThunk(
  "UPDATE-IMAGE",
  network.updateImage
)
export const getCoderDetails=createActionThunk(
  "GET_CODER_DETAILS",
  network.getCoderDetails
)
export const getAccuracy=createActionThunk(
  "GET_ACCURACY_DATA",
  network.getAccuracy
)

export const getRefreshToken=createActionThunk(
  "GET_REFRESH_TOKEN",
  network.refreshToken
)

export const deleteProfileImg=createActionThunk(
  "DELETE_PROFILE_IMAGE",
  network.deleteImage
)

export const proxyRoles=createActionThunk(
  "GET_PROXY_ROLES",
  network.getProxyRole
)
export const clientId=createActionThunk(
  "GET_CLIENT_ID",
  network.getClientId
)
export const clientDetails=createActionThunk(
  "GET_CLIENT_DETAILS",
  network.getClientDetails
)
export const projectDetails=createActionThunk(
  "GET_PROJECT_DETAILS",
  network.getProjectDetails
)
export const allRoles=createActionThunk(
  "GET_ALL_ROLES",
  network.getAllRoles
)








