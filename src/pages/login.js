import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/auth.module.css";
import LoginBack from "../images/logo/login-back.jpg";
import { IMAGES } from "../jsx/constant/theme";
import {
  encyptingPass,
  getValidatePassword,
  handleTogglePasswordVisibility,
} from "../components/headerFilters/functions";
import RegularButton from "../components/button";
import { getMFAValidation } from "../stores/authflow/actions";
import { useSelector } from "react-redux";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginResponse=useSelector(state=>state.auth.mfa)
  const [enteredEmail, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    const passValidation = getValidatePassword(password, setErrors);
    if (emailValidation && passValidation) {
      setErrors({
        email: "",
        password: "",
      });
      dispatch(getMFAValidation(enteredEmail, router, encyptingPass(password)));
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
                      type={showPassword ? "text" : "password"}
                      className="form-control px-2"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      placeholder="Enter Password"
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
                <div className="text-center mb-4">
                  <RegularButton type="submit" name="LOGIN" width="100%" loading={loginResponse?.loading} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
