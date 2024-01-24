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
} from "../../services/AuthService";
import { notification } from "antd";

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

export const getMFAValidation = (username, route,password) => {
  localStorage.setItem("password", password);
  return (dispatch) => {
    mfaValidation(username, route).then((response) => {
      const skip = response?.data?.response?.skipEntryAvailable;
      const mfa = response?.data?.response?.mfaIsEnabled;
      if (response?.data?.response) {
        route?.push(
          `/twofactorAuthentication/Authentication?mfa=${mfa}&skipEntry=${skip}&username=${username}`
        );
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
export const getValidateCode = (username, code, route, validate) => {
  const password = localStorage.getItem("password");
  return (dispatch) => {
    verifyCode(username, code, route).then((response) => {
      if (response?.data?.response) {
        if (validate && password) {
          dispatch(loginAction(username, route, code));
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

export function LogInRoute(navigate) {
  navigate("/dashboard");
}

export function loginAction(email, router, code) {
  const password = localStorage.getItem("password");
  return (dispatch) => {
    login(email, password, code)
      .then((response) => {
        var result = response.data.response;
        let emailSplit = email?.split("@");

        if (response?.data?.status === "SUCCESS") {
          localStorage.setItem("roles", result?.roles);
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("tenantId", result.tenantId);
          localStorage.setItem("userId", result.userEmail);
          localStorage.setItem("orgId", result.organizationId);
          localStorage.setItem("userName", emailSplit[0]);
          localStorage.setItem("loginCheck", true);
          router?.push(`/twofactorAuthentication/SelectRole?username=${email}`);
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
