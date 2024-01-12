import axios from "axios";
import swal from "sweetalert";
import { loginConfirmedAction, Logout } from "../store/actions/AuthActions";
import axiosApi from "../utility/axiosConfig";
import ENDPOINTS from "../utility/enpoints";

export function signUp(email, password) {
  //axios call
  const postData = {
    email,
    password,
    returnSecureToken: true,
  };
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
    postData
  );
}

export function login(email, password) {
  const postData = {
    username: email,
    password: password,
    returnSecureToken: true,
  };
  return axiosApi.post(ENDPOINTS.apiEndoint + `auth/login`, postData);
}

export function formatError(errorResponse) {
  switch (errorResponse.error.message) {
    case "EMAIL_EXISTS":
      swal("Oops", "Email already exists", "error");
      break;
    case "EMAIL_NOT_FOUND":
      swal("Oops", "Email not found", "error", { button: "Try Again!" });
      break;
    case "INVALID_PASSWORD":
      swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
      break;
    case "USER_DISABLED":
      return "User Disabled";

    default:
      return "";
  }
}

export function saveTokenInLocalStorage(tokenDetails) {
  tokenDetails.expireDate = new Date(
    new Date().getTime() + tokenDetails.expires_in * 1000
  );
  localStorage.setItem("userDetails", JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
  setTimeout(() => {
    //dispatch(Logout(history));
    dispatch(Logout(navigate));
  }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
  const tokenDetailsString = localStorage.getItem("userDetails");
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
  const tokenDetailsString = localStorage.getItem("userDetails");

  if (tokenDetailsString) {
    return true;
  } else {
    return false;
  }
}

export const Coder = async ({ name,search, router }) => {
  const token = localStorage.getItem("token");
  const codeName = name === "icd-10" ? "icd" : name;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/disease/${codeName}?disease=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      router?.push("/userlogin");
    }
  }
};
