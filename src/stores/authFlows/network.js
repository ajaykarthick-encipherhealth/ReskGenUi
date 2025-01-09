import { notification } from "antd";
import { authRequestPortal, requestPortal } from "../../utils/network";
import { getStorage, setStorage } from "../../utils/storages";
import { getResponePopup } from "../../utils/reusable";

export async function mfaValidation({ username, password, route }) {
  const params = {
    userName: username,
    password: password?.pass,
    passwordIv: password?.iv,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(params),
  };

  const data = await authRequestPortal(
    `securityservice/auth/mfaValidation`,
    options
  );
  const skip = data?.response?.skipEntryAvailable;
  const mfa = data?.response?.mfaIsEnabled;

  if (data?.response) {;
    setStorage("userId", username);
    setStorage("password", JSON.stringify(password));
    setStorage("skipEntry", skip);
    setStorage("mfa", mfa);
    route?.push({
      pathname: `/twofactorauthentication/authentication`
    });
  } else {
    getResponePopup(data);
  }
}

export async function login({ email, router, code, password, mfa, skip }) {
  const postData = {
    username: email,
    password: password,
    passwordIv: password?.iv,
    code: code?.pass,
    codeIv: code?.iv,
  };
  const params =
    code?.length > 0
      ? postData
      : {
          username: email,
          password: password?.pass,
          passwordIv: password?.iv,
          code: code?.pass,
          codeIv: code?.iv,
        };
  const options = {
    method: "POST",
    body: JSON.stringify(params),
  };

  try {
    const data = await authRequestPortal(`securityservice/auth/login`, options);
    let emailSplit = email.split("@");
    if (data?.status === "SUCCESS") {
      setStorage("token", data?.response?.access_token);
      setStorage("userId", data?.response?.userEmail);
      setStorage("orgId", data?.response?.organizationId);
      setStorage("tenantId", data?.response?.tenantId);
      setStorage("loginCheck", true);
      setStorage("roles", JSON.stringify(data?.response?.roles));
      setStorage("refreshToken", data?.response?.refresh_token);
      setStorage("userName", emailSplit[0]);
      // setStorage("username", email);
      setStorage("password", JSON.stringify(password));
      setStorage("skipEntry", skip);
      setStorage("mfa", mfa);
      // setStorage("refreshTokenTime", Date.now());
      router?.push({
        pathname: `/twofactorauthentication/selectrole`
      });
      setStorage("loginTime", Date.now());
    }
    if (data?.response === null) {
      notification.error({
        description: data?.message,
      });
    }
    return data;
  } catch (err) {
    notification.error({
      description: err?.message,
    });
  }
}
export async function validateCode({
  username,
  code,
  route,
  validate,
  userpassword,
}) {
  const options = {
    method: "POST",
    body: JSON.stringify({
      username: username,
      code: code?.pass,
      codeIv: code?.iv,
      newMfa: true,
      password: userpassword?.pass,
      passwordIv: userpassword?.iv,
    }),
  };
  try {
    const data = await authRequestPortal(
      `securityservice/auth/verify/mfa`,
      options
    );
    if (data?.status === "SUCCESS") {
      if (userpassword) {
        login({
          email: username,
          router: route,
          code: code,
          password: userpassword,
          mfa: true,
          skip: false
        });
      } else {
        notification.success({
          message: "Code verified successfully",
          duration: 1,
        });
      }
    } else {
      if (!data?.response) {
        notification.error({
          description: data?.message,
        });
      }
    }
  } catch (err) {
    notification.error({
      description: err?.message,
    });
  }
}

export async function qrCodeFunc({ username }) {
  const options = {
    method: "POST",
  };
  try {
    const data = await authRequestPortal(
      `securityservice/auth/enablemfa?userName=${username}`,
      options
    );
    if (data?.response) {
      return data?.response;
    }
    if (!data?.response) {
      notification.error({
        description: data?.message,
      });
    }
  } catch (err) {
    notification.error({
      description: err?.message,
    });
  }
}

export async function tenantsInfo({ orgId }) {
  const options = {
    method: "GET",
  };
  //new API
  const data = await requestPortal(
    `tenant/getalltenant?organizationId=${
      orgId !== "undefined" && orgId ? orgId : ""
    }`,
    options
  );

  return data?.response;
}

export async function getCoderDetails({ name, search, selectedOption }) {
  const codeName = name === "icd-10" ? "icd" : name;
  const options = {
    method: "GET",
  };
  //new API
  const data = await requestPortal(
    `dbservice/disease/${codeName}?disease=${search}&filter=${
      name === "hcc" ? selectedOption : ""
    }`,
    options
  );

  return data;
}

export async function getAccuracy() {
  const options = {
    method: "GET",
  };
  //new API
  const data = await requestPortal(
    `dbservice/l2dashboard/loggedinuseraccuracy`,
    options
  );
  return data;
}

export async function orgInfo() {
  const tenantId = getStorage("tenantId");
  const options = {
    method: "GET",
  };
  //New API
  const data = await requestPortal(
    `organization/getallorganization?tenantId=${
      tenantId ? tenantId : "default"
    }`,
    options
  );
  return data;
}

export async function totalElements({ totalElementsType }) {
  const tenantId = getStorage("tenantId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `combocode/totalcount?entityType=${totalElementsType}&tenantId=${
      tenantId ? tenantId : "default"
    }`,
    options
  );
  return data;
}

export async function getUser() {
  const options = {
    method: "GET",
  };
  const username = getStorage("userId");
  const data = await requestPortal(
    `dbservice/user/get?userName=${username}`,
    options
  );
  return data;
}

export async function preSendUrl({ imgType }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/getuploadurl?filetype=${imgType}&filelocation=PROFILE_IMAGE`,
    options
  );
  return data;
}
export async function portalForGetUrl(url, file, extention) {
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
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
}

export async function updateImage(url) {
  const splitUrl = url?.split("?").shift();
  const options = {
    method: "PUT",
    body: JSON.stringify({ profileImageUrl: splitUrl }),
  };
  const data = await requestPortal(`dbservice/user/profileimage`, options);
  return data;
}

export async function deleteImage(url) {
  const options = {
    method: "DELETE",
  };
  const data = await requestPortal(`dbservice/user/profileimage`, options);
  return data;
}

export async function refreshToken() {
  const refreshToken = getStorage("refreshToken");
  const token = getStorage("token");
  const options = {
    method: "POST",
    body: JSON.stringify({ refreshToken: refreshToken }),
  };
  const data = await requestPortal(
    `securityservice/token/refreshtoken`,
    options
  );
  if (response) {
    const newToken = response?.data?.response;
    setStorage("refreshTokenTime", Date.now());
    setStorage("token", newToken);
    setStorage("loginTime", Date.now());
  }
  return data;
}
