import React, { useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import styles from "../styles/auth.module.css";
import LoginBack from "../images/logo/login-back.jpg";
import { encyptingPass } from "../components/headerFilters/functions";
import RegularButton from "../components/button";
import { actions as allActions } from "../stores/authFlows";
import { getResponePopup } from "../utils/reusable";
import { getLogoImage } from "./twofactorAuthentication/reusableFun";

const Login = ({ getMFAValidation, loginResponse }) => {
  const router = useRouter();
  const [enteredEmail, setEmail] = useState("");
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  const [emailErro, setEmailError] = useState("");

  const validateEmail = (enteredEmail) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    setEmailError({ email: "" });

    if (enteredEmail?.length === 0) {
      setEmailError({
        email: "Please enter the email",
      });

      return false;
    }
    if (enteredEmail?.length > 0 && !emailRegex.test(enteredEmail)) {
      setEmailError({
        email: "Invalid email",
      });
      return false;
    }

    return true;
  };
  const onLogin = async (e) => {
    e.preventDefault();
    const emailValidation = validateEmail(enteredEmail);
    // const passValidation = getValidatePassword(password, setErrors);
    if (emailValidation) {
      setErrors({
        email: "",
        password: "",
      });
      const res = await getMFAValidation({
        username: enteredEmail,
        route: router,
        password: encyptingPass(password),
      });
      if (res?.status !== "SUCCESS") {
        getResponePopup(res);
      }
    } else {
      return;
    }
  };

  return (
    <div className="page-wraper">
      <div className="login-account">
        <div className={`row ${styles.loginContainer}`}>
          <div className="col-lg-6 align-self-start">
            <div
              className="account-info-area"
              style={{ backgroundImage: "url(" + { LoginBack } + ")" }}
            >
              <div
                className="login-content"
                style={{ position: "relative", textAlign: "center" }}
              >
                <p className="sub-title"></p>
                {getLogoImage()}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
            <div className="login-form">
              <div className="login-head">
                <h5 className="title">Log in to your account</h5>
              </div>
              <h6 className="login-title">
                <span>Login</span>
              </h6>

              <form onSubmit={onLogin} autoComplete="off">
                <div className="mb-4">
                  <label className="mb-1 text-dark">Email</label>
                  <input
                    type="email"
                    className="form-control px-2"
                    value={enteredEmail}
                    onChange={(e) => {
                      setEmail(e.target.value), validateEmail(e.target.value);
                    }}
                    placeholder="Enter Email"
                  />
                  {emailErro?.email && (
                    <div className="text-danger fs-12 mt-3">
                      {emailErro?.email}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="mb-1 text-dark">Password</label>
                  <div>
                    <input
                      type={"password"}
                      className="form-control px-2"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      placeholder="Enter Password"
                    />
                    {/* <div className="input-group-append">
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
                    </div> */}
                  </div>
                  {errors?.password && (
                    <div className="text-danger fs-12">{errors?.password}</div>
                  )}
                </div>
                <div className="text-center mb-4">
                  <RegularButton
                    type="submit"
                    name="LOGIN"
                    width="100%"
                    loading={loginResponse}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    loginResponse: state?.authReducer?.mfaLoader,
  }),
  {
    getMFAValidation: allActions.getMFAValidation,
  }
);
export default connector(Login);
