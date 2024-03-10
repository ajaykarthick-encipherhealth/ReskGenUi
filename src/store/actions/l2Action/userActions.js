import {
  l2Users,
  L2IndividualUser,
  CurrentUserInfo
} from "../../../services/l2Service/userService";

export const USERS = "USERS";
export const INDIVIAULUSER = "INDIVIAULUSER";
export const CLICK_USER_DETAILS = "CLICK_USER_DETAILS";
export const GET_USERINFO='GET_USERINFO'

export const getL2Users = (page, search) => {
  return (dispatch) => {
    dispatch({
      type: USERS,
      payload: {
        loading: true,
      },
    });
    try {
      l2Users(page, search).then((response) => {
        if (response) {
          dispatch({
            type: USERS,
            payload: {
              data: response,
              loading: false,
            },
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getL2IndividualUser = (datas) => {
  return (dispatch) => {
    // dispatch({
    //   type: INDIVIAULUSER,
    //   payload: {
    //     loading: true,
    //   },
    // });
    try {
      L2IndividualUser(datas).then((response) => {
        if (response) {
          dispatch({
            type: INDIVIAULUSER,
            payload: {
              data: response?.data,
              loading: false,
            },
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const storeUserValues = (data) => {
  return (dispatch) => {
    try {
        dispatch({
          type: CLICK_USER_DETAILS,
          payload: data,
        });
    } catch (err) {
      console.log(err);
    }
  };
};
export const getCurrentUserDetails = (userId, router) => {
  return (dispatch) => {
    try {
      CurrentUserInfo(userId, router).then((response) => {
        dispatch({
          type: GET_USERINFO,
          payload: response,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};