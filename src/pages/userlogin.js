import React, { useState } from "react";
import { useRouter } from "next/router";
import { notification } from "antd";
import Image from "next/image";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/auth.module.css";
import ENDPOINTS from "../utility/enpoints";
import axios from "../utility/axiosConfig";
import LoginBack from "../images/logo/login-back.jpg";
import { IMAGES } from "../jsx/constant/theme";
import { getMFAValidation } from "../store/actions/AuthActions";
import { useDispatch } from "react-redux";

export default function UserLogin() {
  const router = useRouter();
  const dispatch=useDispatch()
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    dispatch(getMFAValidation(email,router,password))
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="page-wraper">
      <div className="login-account">
        <div className="row h-100">
          <div className="col-lg-6 align-self-start">
            <div
              className="account-info-area"
              style={{ backgroundImage: "url(" + LoginBack + ")" }}
            >
              <div className="login-content">
                <p className="sub-title"></p>
                <Image className="login-logo" src={IMAGES.loginPageLogo} />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
            <div className="login-form">
              <div className="login-head">
                <h5 className="title">Log in to your account</h5>
                {/* <p>Login page allows users to enter login credentials for authentication and access to secure content.</p> */}
              </div>
              <h6 className="login-title">
                <span>Login</span>
              </h6>

              <form onSubmit={onLogin}>
                <div className="mb-4">
                  <label className="mb-1 text-dark">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="text-danger fs-12 mt-3">{errors.email}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="mb-1 text-dark">Password</label>
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="input-group-append">
                      <span className={styles.passwordBox}>
                        <FontAwesomeIcon
                          onClick={handleTogglePasswordVisibility}
                          icon={showPassword ? faEye : faEyeSlash}
                        />
                      </span>
                    </div>
                  </div>
                  {errors.password && (
                    <div className="text-danger fs-12">{errors.password}</div>
                  )}
                </div>
                <div className="text-center mb-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    {isLoading ? "Loading..." : "LOGIN"}
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
