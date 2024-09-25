import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notification } from "antd";
import styles from "../styles/auth.module.css";
import LoginBack from "../images/logo/login-back.jpg";
import { IMAGES } from "../jsx/constant/theme";
import {
  getValidatePassword,
  handleTogglePasswordVisibility,
  encyptingPass,
} from "../components/headerFilters/functions";
import AthenaLogo from "../images/ehr/athena.png";
import EpicLogo from "../images/ehr/epic_1.png";
import worksLogo from "../images/ehr/eclinicalworks.png";
import cernerLogo from "../images/ehr/cerner.png";
import { submitLogin } from "../stores/authflow/actions";
import { setStorage } from "../utils/storages";

export default function Login() {
  const router = useRouter();
  const [enteredEmail, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectEHR, setSelectEHR] = useState(0);

  const validateEmail = (enteredEmail) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (enteredEmail?.length === 0) {
      setErrors({
        email: "Please enter the email",
      });

      setIsLoading(false);
      return false;
    }
    if (enteredEmail?.length > 0 && !emailRegex.test(enteredEmail)) {
      setErrors({
        email: "Invalid email",
      });
      setIsLoading(false);
      return false;
    }

    return true;
  };
  const onLogin = async (e) => {
    e.preventDefault();
    const emailValidation = validateEmail(enteredEmail);
    const passValidation = getValidatePassword(
      password,
      setErrors,
      setIsLoading
    );
    if (emailValidation && passValidation) {
      setIsLoading(true);
      setErrors({
        email: "",
        password: "",
      });
      setStorage("userRole", "ehr");
      let response = await submitLogin(enteredEmail, encyptingPass(password));
      console.log(response);
      let result = response?.data?.response;
      if (response?.data?.status === "SUCCESS") {
        let emailSplit = enteredEmail?.split("@");
        notification.success({
          message: "Login Successfully",
          duration: 1,
        });
        let rolesArray = ["EHR"];
        setStorage("role", "ehr");
        setStorage("roles", rolesArray);
        setStorage("token", result.access_token);
        setStorage("refreshToken", result?.refresh_token);
        setStorage("tenantId", result.tenantId);
        setStorage("userId", result.userEmail);
        setStorage("orgId", result.organizationId);
        setStorage("userName", emailSplit[0]);
        setStorage("loginCheck", true);
        router.push("ehr/patients");
      } else {
        notification.error({
          description: response?.data?.message,
        });
      }
    } else {
      return;
    }
  };

  return (
    <div className="page-wraper">
      <div className="login-account">
        <div className={`row h-100 ${styles.loginContainer}`}>
          <div className="col-lg-6 align-self-start">
            <div
              className="account-info-area"
              style={{ backgroundImage: "url(" + { LoginBack } + ")" }}
            >
              <div className="login-content">
                <p className="sub-title"></p>
                <Image className="login-logo" src={IMAGES.loginPageLogo1} />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
            <div className="login-form">
              <div className="login-head">
                <h5 className="title">Connect to EHR Account</h5>
              </div>
              <h6 className="login-title">
                <span>Login</span>
              </h6>

              <form onSubmit={onLogin} autoComplete="off">
                <div className="mb-4">
                  <label className="mb-1 text-dark">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={enteredEmail}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors?.email && (
                    <div className="text-danger fs-12 mt-3">
                      {errors?.email}
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <label className="mb-1 text-dark">Password</label>
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <div className="input-group-append">
                      <span className={styles.loginpasswordBox}>
                        <FontAwesomeIcon
                          onClick={() =>
                            handleTogglePasswordVisibility(
                              showPassword,
                              setShowPassword
                            )
                          }
                          icon={showPassword ? faEye : faEyeSlash}
                        />
                      </span>
                    </div>
                  </div>
                  {errors?.password && (
                    <div className="text-danger fs-12">{errors?.password}</div>
                  )}
                </div>
                <div className={styles.ehrlogoContainer}>
                  <div
                    onClick={() => setSelectEHR(1)}
                    className={
                      selectEHR === 1
                        ? `${styles.ehrlogoMainActive}`
                        : `${styles.ehrlogoMain}`
                    }
                  >
                    <Image className={styles.ehrLogo} src={EpicLogo} alt="" />
                  </div>
                  <div
                    onClick={() => setSelectEHR(2)}
                    className={
                      selectEHR === 2
                        ? `${styles.ehrlogoMainActive} ${styles.ml_10}`
                        : `${styles.ehrlogoMain} ${styles.ml_10}`
                    }
                  >
                    <Image
                      className={styles.auth_ehrLogo2}
                      src={cernerLogo}
                      alt=""
                    />
                  </div>
                </div>
                <div className={`mb-4 ${styles.ehrlogoContainer}`}>
                  <div
                    onClick={() => setSelectEHR(3)}
                    className={
                      selectEHR === 3
                        ? `${styles.ehrlogoMainActive}`
                        : `${styles.ehrlogoMain}`
                    }
                  >
                    <Image
                      className={styles.auth_ehrLogo3}
                      src={worksLogo}
                      alt=""
                    />
                  </div>
                  <div
                    onClick={() => setSelectEHR(4)}
                    className={
                      selectEHR === 4
                        ? `${styles.ehrlogoMainActive} ${styles.ml_10}`
                        : `${styles.ehrlogoMain} ${styles.ml_10}`
                    }
                  >
                    <Image
                      className={styles.auth_ehrLogo2}
                      src={AthenaLogo}
                      alt=""
                    />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <button
                    type="submit"
                    className={`btn btn-block ${styles.btnColor} `}
                  >
                    {isLoading ? "Loading..." : "Connect"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
