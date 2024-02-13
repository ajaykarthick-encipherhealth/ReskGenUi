import {
  formatError,
  login,
  runLogoutTimer,
  saveTokenInLocalStorage,
  signUp,
  Coder,
  mfaValidation,
  enableMFA,
  verifyCode,
  accuracy,
  filters,
  CurrentUser,
  currentUser,
} from "../../services/AuthService";
import { notification } from "antd";
import ENDPOINTS from "../../utility/enpoints";
import axios from "axios";

export const SIGNUP_CONFIRMED_ACTION = "[signup action] confirmed signup";
export const SIGNUP_FAILED_ACTION = "[signup action] failed signup";
export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";
export const NAVTOGGLE = "NAVTOGGLE";
export const PATIENT_DETAILS = "";
export const SELECTEDROLE = "SELECTEDROLE";
export const CODER = "CODER";
export const ENABLEMFA = "ENABLEMFA";
export const VERIFYCODE = "VERIFYCODE";
export const ACCURACYSCRORE = "ACCURACYSCRORE";
export const FILTER = "FILTER";
export const PROFILE_URL = "PROFILE_URL";
export const CURRENTUSER = "CURRENTUSER";

export const selectedUserRole = (data) => ({
  type: SELECTEDROLE,
  payload: data,
});
export function signupAction(email, password, navigate) {
  return (dispatch) => {
    signUp(email, password)
      .then((response) => {
        saveTokenInLocalStorage(response.data);
        runLogoutTimer(
          dispatch,
          response.data.expiresIn * 1000
          //history,
        );
        dispatch(confirmedSignupAction(response.data));
        navigate("/dashboard");
        //history.push('/dashboard');
      })
      .catch((error) => {
        const errorMessage = formatError(error.response.data);
        dispatch(signupFailedAction(errorMessage));
      });
  };
}

export function Logout(navigate) {
  localStorage.removeItem("userDetails");
  navigate("/login");
  return {
    type: LOGOUT_ACTION,
  };
}

export const getMFAValidation = (username, route, password) => {
  return () => {
    mfaValidation(username, route).then((response) => {
      const skip = response?.data?.response?.skipEntryAvailable;
      const mfa = response?.data?.response?.mfaIsEnabled;
      if (response?.data?.response) {
        const encodedParams = btoa(
          JSON.stringify({
            mfa: mfa,
            skipEntry: skip,
            username: username,
            password: password,
          })
        );
        route?.push({
          pathname: `/twofactorAuthentication/Authentication`,
          search: `params=${encodedParams}`,
        });
      }
    });
  };
};

export const getQrCode = (username, route) => {
  return (dispatch) => {
    enableMFA(username, route).then((response) => {
      if (response?.data?.response) {
        dispatch({
          type: VERIFYCODE,
          payload: response?.data?.response?.secretImageUri,
        });
      }
    });
  };
};
export const getValidateCode = (username, code, route, validate, password) => {
  return (dispatch) => {
    verifyCode(username, code, route).then((response) => {
      if (response?.data?.response) {
        if (validate && password) {
          dispatch(loginAction(username, route, code, password));
        } else {
          notification.success({
            message: "Code verified successfully",
            duration: 1,
          });
          route?.push(`/login`);
        }
      } else {
        notification.error({
          description: "Entered pin is wrong.Re-verify the pin",
        });
      }
    });
  };
};

export const getAccuracy = () => {
  return (dispatch) => {
    try {
      accuracy().then((response) => {
        if (response) {
          dispatch({
            type: ACCURACYSCRORE,
            payload: response,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export function LogInRoute(navigate) {
  navigate("/dashboard");
}

export function loginAction(email, router, code, password, mfa, skip) {
  return (dispatch) => {
    login(email, password, code)
      .then((response) => {
        var result = response?.data?.response;
        let emailSplit = email?.split("@");

        if (response?.data?.status === "SUCCESS") {
          localStorage.setItem("roles", JSON.stringify(result?.roles));
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("tenantId", result.tenantId);
          localStorage.setItem("userId", result.userEmail);
          localStorage.setItem("orgId", result.organizationId);
          localStorage.setItem("userName", emailSplit[0]);
          localStorage.setItem("loginCheck", true);
          const encodedParams = btoa(
            JSON.stringify({
              mfa: mfa,
              skipEntry: skip,
              username: email,
              password: password,
            })
          );
          router?.push({
            pathname: `/twofactorAuthentication/SelectRole`,
            search: `params=${encodedParams}`,
          });
          // router?.push(`/twofactorAuthentication/SelectRole?username=${email}&params=${decodedParams}`);
        }
        if (response.data?.response === null) {
          notification.error({
            description: response?.data?.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function loginConfirmedAction(data) {
  return {
    type: LOGIN_CONFIRMED_ACTION,
    payload: data,
  };
}

export function confirmedSignupAction(payload) {
  return {
    type: SIGNUP_CONFIRMED_ACTION,
    payload,
  };
}

export function signupFailedAction(message) {
  return {
    type: SIGNUP_FAILED_ACTION,
    payload: message,
  };
}

export function loadingToggleAction(status) {
  return {
    type: LOADING_TOGGLE_ACTION,
    payload: status,
  };
}

export const navtoggle = () => {
  // alert(1);
  return {
    type: "NAVTOGGLE",
  };
};

export function patientDetails(data) {
  return {
    type: PATIENT_DETAILS,
    payload: data,
  };
}
export const getCoderDetails = ({ name, search, selectedOption, router }) => {
  return (dispatch) => {
    try {
      Coder({ name, search, selectedOption, router }).then((response) => {
        dispatch({
          type: CODER,
          payload: response,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getFilters = (field, username, pageQueue) => {
  return (dispatch) => {
    dispatch({
      type: FILTER,
      payload: {
        loading: true,
        data: null,
      },
    });
    try {
      filters(field, username, pageQueue).then((response) => {
        dispatch({
          type: FILTER,
          payload: {
            data: response,
            loading: false,
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getCurrentUser = (userId, router) => {
  return (dispatch) => {
    try {
      CurrentUser(userId, router).then((response) => {
        dispatch({
          type: CURRENTUSER,
          payload: response,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const preSendURl = (type, file) => async (dispatch) => {
  const token = localStorage.getItem("token");

  if (type) {
    try {
      let response = await axios.get(
        `${ENDPOINTS?.apiEndoint}dbservice/user/getuploadurl?filetype=${type}&filelocation=PROFILE_IMAGE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        if (response?.data?.response) {
          dispatch(getUrl(response?.data?.response, type, file));
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};
export const getUrl = (url, extention, file) => async (dispatch) => {
  const type =
    extention === "jpg" || extention === "jpeg" ? "image/jpeg" : "image/png";
  if (url && file) {
    try {
      const headers = new Headers();
      headers.append("x-ms-blob-type", "BlockBlob");
      headers.append("Content-Type", type);
      headers.append("Content-Length", file?.size);

      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: headers,
      });

      if (response.status === 201) {
        dispatch(updateImage(url));
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const updateImage = (url) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const splitUrl = url?.split("?").shift();
  const userId = localStorage.getItem("userId");

  if (url) {
    try {
      const response = await axios.put(
        `${ENDPOINTS?.apiEndoint}dbservice/user/profileimage`,
        { profileImageUrl: splitUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data) {
        dispatch(getCurrentUser(userId));
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};
