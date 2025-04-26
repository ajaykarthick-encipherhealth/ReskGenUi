import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import {
  getLogin,
  getMFAValidation,
  getQrCode,
  getValidateCode,
  getTenant,
  getOrganization,
  getTotalElements,
  getUserDetails,
  getUpdateImage,
  getCoderDetails,
  getAccuracy,
  getRefreshToken,
  deleteProfileImg,
  proxyRoles,
  clientId,
  clientDetails,
  projectDetails,
  allRoles,
  tinsDropdown
} from "./actions";

const initialState = {
  loading: true,
  data: null,
  error: null,
  initialdata: null,
  isInitialVal: true,
};

const menuSelected = (action) =>
  handleActions(
    {
      [action.toString()]: (state, { payload }) => payload,
    },
    {}
  );

const createReducer = (actionType) =>
  handleActions(
    {
      [actionType.STARTED]: (state, action) => ({
        ...state,
        loading: true,
        error: null,
      }),
      [actionType.SUCCEEDED]: (state, action) => ({
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      }),
      [actionType.FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
      }),
    },

    initialState
  );
const getUsersDetailsLoading = (type) =>
  handleActions(
    {
      [type.START]: () => true,
      [type.SUCCEEDED]: () => false,
      [type.FAILED]: () => false,
    },
    false
  );
const authReducer = combineReducers({
  mfaInfo: createReducer(getMFAValidation),
  qrImage: createReducer(getQrCode),
  tenantsList: createReducer(getTenant),
  orgList: createReducer(getOrganization),
  totalElements: createReducer(getTotalElements),
  userDetails: createReducer(getUserDetails),
  loginData: createReducer(getLogin),
  getUpdateImage: createReducer(getUpdateImage),
  getCoderDetails: createReducer(getCoderDetails),
  getAccuracy: createReducer(getAccuracy),
  getRefreshToken: createReducer(getRefreshToken),
  deleteProfileImg: createReducer(deleteProfileImg),
  getAllProxyRoles: createReducer(proxyRoles),
  getClientId: createReducer(clientId),
  getClientDetails: createReducer(clientDetails),
  getProjectDetails:createReducer(projectDetails),
  getAllRoles:createReducer(allRoles),
  getTinDropdown:createReducer(tinsDropdown),

  // loaders
  mfaLoader: getUsersDetailsLoading(getMFAValidation),
  qrLoader: getUsersDetailsLoading(getQrCode),
  loginLoader: getUsersDetailsLoading(getLogin),
  codeValidateLoader: getUsersDetailsLoading(getValidateCode),
  totalLoader: getUsersDetailsLoading(getTotalElements),
  getUpdateImageLoading: getUsersDetailsLoading(getUpdateImage),
  getCoderDetailsLoading: getUsersDetailsLoading(getCoderDetails),
  getAccuracyLoading: getUsersDetailsLoading(getAccuracy),
});

export default authReducer;
