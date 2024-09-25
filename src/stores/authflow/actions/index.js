import { notification } from "antd";
import axios from "axios";
import axiosConfig from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";
import { getResponePopup } from "../../../utils/reusable";
import exp from "constants";
import { getStorage } from "../../../utils/storages";

export const ENABLEMFA = "ENABLEMFA";
export const VALIDATE_CODE = "VALIDATE_CODE";
export const VERIFYCODE = "VERIFYCODE";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const ACCURACYSCRORE = "ACCURACYSCRORE";
export const CURRENTUSER_INFO = "CURRENTUSER_INFO";
export const CODER = "CODER";
export const PROFILE_URL = "PROFILE_URL";
export const FILTER = "FILTER";
export const NAVTOGGLE = "NAVTOGGLE";
export const PATIENT_DETAILS = "";
export const AUTHENTICATION = "AUTHENTICATION";
export const VERIFYMFA = "VERIFYMFA";

export const navtoggle = () => {
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
export const getMFAValidation =
  (username, route, password) => async (dispatch) => {
    dispatch({
      type: ENABLEMFA,
      payload: { data: null, loading: true },
    });
    try {
      const response = await axios.post(
        `${ENDPOINTS?.apiEndoint}securityservice/auth/mfaValidation`,
        {
          userName: username,
          password: password?.pass,
          passwordIv: password?.iv,
        }
      );
      const skip = response?.data?.response?.skipEntryAvailable;
      const mfa = response?.data?.response?.mfaIsEnabled;
      if (response.data.status != "SUCCESS") {
        getResponePopup(response);
      }
      if (response?.data?.response) {
        dispatch({
          type: ENABLEMFA,
          payload: { data: response.data, loading: false },
        });
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
      } else {
        dispatch({
          type: ENABLEMFA,
          payload: { data: null, loading: trfalsee },
        });
      }
    } catch (err) {
      dispatch({
        type: ENABLEMFA,
        payload: { data: null, loading: false },
      });
      if (err?.response?.status == "513") {
        getResponePopup(err.response);
      }
    }
  };

export const getValidateCode =
  (username, code, route, validate, userpassword, enableMFA = false) =>
  async (dispatch) => {
    const datas = {
      username: username,
      code: code?.pass,
      codeIv: code?.iv,
      newMfa: !enableMFA,
      password: userpassword?.pass,
      passwordIv: userpassword?.iv,
    };
    dispatch({
      type: VERIFYMFA,
      payload: { data: null, loading: true },
    });
    try {
      const response = await axios.post(
        `${ENDPOINTS?.apiEndoint}securityservice/auth/verify/mfa`,
        datas
      );
      if (response?.data?.response) {
        dispatch({
          type: VERIFYMFA,
          payload: { data: response?.data, loading: true },
        });
        if (validate && userpassword) {
          dispatch(loginAction(username, route, code, userpassword));
        } else {
          notification.success({
            message: "Code verified successfully",
            duration: 1,
          });
          route?.push(`/login`);
        }
      } else {
        if (!response?.data?.response) {
          dispatch({
            type: VERIFYMFA,
            payload: { data: null, loading: false },
          });
          notification.error({
            description: response?.data?.message,
          });
        }
      }
    } catch (err) {
      dispatch({
        type: VERIFYMFA,
        payload: { data: null, loading: false },
      });

      notification.error({
        description: err?.response?.data?.message,
      });
    }
  };

export const loginAction =
  (email, router, code, password, mfa, skip) => async (dispatch) => {
    const postData = {
      username: email,
      password: password?.pass,
      passwordIv: password?.iv,
      code: code?.pass,
      codeIv: code?.iv,
    };
    const datas =
      code?.length > 0
        ? postData
        : {
            username: email,
            password: password?.pass,
            passwordIv: password?.iv,
            code: code?.pass,
            codeIv: code?.iv,
          };
    dispatch({
      type: AUTHENTICATION,
      payload: { data: null, loading: true },
    });
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `securityservice/auth/login`,
        datas
      );
      if (response?.data) {
        let result = response?.data?.response;
        let emailSplit = email?.split("@");
        dispatch({
          type: AUTHENTICATION,
          payload: { data: result, loading: false },
        });
        if (response?.data?.status === "SUCCESS") {
          localStorage.setItem("roles", JSON.stringify(result?.roles));
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("refreshToken", result?.refresh_token);
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
          localStorage.setItem("loginTime", Date.now());
        }
        if (response.data?.response === null) {
          dispatch({
            type: AUTHENTICATION,
            payload: { data: null, loading: false },
          });
          notification.error({
            description: response?.data?.message,
          });
        }
      } else {
        dispatch({
          type: AUTHENTICATION,
          payload: { data: result, loading: false },
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATION,
        payload: { data: null, loading: false },
      });
      notification.error({
        message: err?.response?.data?.message,
        duration: 1,
      });
    }
  };

export const getQrCode = (username) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}securityservice/auth/enablemfa?userName=${username}`
    );
    if (response?.data?.response) {
      dispatch({
        type: VERIFYCODE,
        payload: response?.data?.response?.secretImageUri,
      });
    }
  } catch (err) {
    notification.error({
      description: err?.response?.data?.message,
    });
  }
};
export const checkDeviceLogin = async () => {
  const token = getStorage("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}securityservice/gateway/login`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    notification.error({
      description: err?.response?.data?.message,
    });
  }
};

export const logoutAllDevice = async () => {
  const token = getStorage("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}securityservice/gateway/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const refreshToken = () => async (dispatch) => {
  const refreshToken = getStorage("refreshToken");
  const token = getStorage("token");
  try {
    const response = await axiosConfig.post(
      `${ENDPOINTS.apiEndoint}securityservice/token/refreshtoken`,
      { refreshToken: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: REFRESH_TOKEN,
        payload: {
          loading: false,
          data: response.data,
        },
      });
      localStorage.setItem("refreshTokenTime", Date.now());
      const newtoken = response?.data?.response;
      localStorage.setItem("token", newtoken);
      localStorage.setItem("loginTime", Date.now());
    }
  } catch (err) {
    console.log(err);
  }
};

export const submitLogin = async (email, password) => {
  const datas = {
    username: email,
    password: password?.pass,
    passwordIv: password?.iv,
  };
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}securityservice/auth/login`,
      datas
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getAccuracy = () => async (dispatch) => {
  const token = getStorage("token");
  try {
    const response = await axiosConfig.get(
      `${ENDPOINTS?.apiEndoint}dbservice/l2dashboard/loggedinuseraccuracy`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: ACCURACYSCRORE,
        payload: response,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentUser = (userId) => async (dispatch) => {
  const token = getStorage("token");
  try {
    const response = await axiosConfig.get(
      `${ENDPOINTS?.apiEndoint}dbservice/user/get?userName=${userId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      dispatch({
        type: CURRENTUSER_INFO,
        payload: response,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const preSendURl = (type, file) => async (dispatch) => {
  const token = getStorage("token");
  dispatch({
    type: PROFILE_URL,
    payload: {
      loading: true,
    },
  });
  if (type) {
    try {
      let response = await axiosConfig.get(
        `${ENDPOINTS?.apiEndoint}dbservice/user/getuploadurl?filetype=${type}&filelocation=PROFILE_IMAGE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
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
        dispatch({
          type: PROFILE_URL,
          payload: {
            loading: false,
          },
        });
      }

      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const updateImage = (url) => async (dispatch) => {
  const token = getStorage("token");
  const splitUrl = url?.split("?").shift();
  if (url) {
    try {
      const response = await axiosConfig.put(
        `${ENDPOINTS?.apiEndoint}dbservice/user/profileimage`,
        { profileImageUrl: splitUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // if (response?.data) {
      //   dispatch(getCurrentUser(userId));
      //   dispatch({
      //     type: PROFILE_URL,
      //     payload: {
      //       loading: false,
      //     },
      //   });
      // }
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
};
export const getFilters = (field, username, pageQueue) => async (dispatch) => {
  const token = getStorage("token");
  const role = getStorage("userRole");
  const userRole = role?.toUpperCase();
  const url = username
    ? `dbservice/patient/filter/field/list?username=${username}&field=${field}&role=${userRole}`
    : `dbservice/patient/filter/field/list?field=${field}&role=${userRole}&page=${
        pageQueue ? pageQueue : 0
      }`;

  dispatch({
    type: `SET_FILTERS_${field.toUpperCase()}`,
    payload: {
      loading: true,
      data: null,
    },
  });
  try {
    const response = await axiosConfig.get(`${ENDPOINTS?.apiEndoint}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      dispatch({
        type: `SET_FILTERS_${field.toUpperCase()}`,
        payload: {
          data: response,
          loading: false,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getCoderDetails =
  ({ name, search, selectedOption, router }) =>
  async (dispatch) => {
    const token = getStorage("token");
    const codeName = name === "icd-10" ? "icd" : name;
    try {
      const response = await axiosConfig.get(
        `${
          ENDPOINTS?.apiEndoint
        }dbservice/disease/${codeName}?disease=${search}&filter=${
          name === "hcc" ? selectedOption : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch({
          type: CODER,
          payload: response?.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

export function checkAutoLogin(dispatch, navigate) {
  const tokenDetailsString = getStorage("userDetails");
  let tokenDetails = "";
  if (!tokenDetailsString) {
    dispatch(Logout(navigate));
    return;
  }

  tokenDetails = JSON.parse(tokenDetailsString);
  let expireDate = new Date(tokenDetails.expireDate);
  let todaysDate = new Date();

  if (todaysDate > expireDate) {
    dispatch(Logout(navigate));
    return;
  }

  dispatch(loginConfirmedAction(tokenDetails));

  const timer = expireDate.getTime() - todaysDate.getTime();
  runLogoutTimer(dispatch, timer, navigate);
}

export function isLogin() {
  const tokenDetailsString = getStorage("userDetails");
  if (tokenDetailsString) {
    return true;
  } else {
    return false;
  }
}
