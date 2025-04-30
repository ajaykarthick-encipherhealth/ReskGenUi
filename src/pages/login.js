import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import styles from "../styles/auth.module.css";
import LoginBack from "../images/logo/login-back.jpg";
import { encyptingPass } from "../components/headerFilters/functions";
import RegularButton from "../components/button";
import { actions as allActions } from "../stores/authFlows";
import { getResponePopup } from "../utils/reusable";
import { getLogoImage } from "./twofactorauthentication/reusableFun";
import IsAdmin from "./twofactorauthentication/isAdmin";
import MS_Logo from "../images/logo/logos_microsoft-icon.png";
import GoogleLogo from "../images/logo/devicon_google.png";
import Image from "next/image";
import { useMsal } from "@azure/msal-react";
import { setStorage } from "../utils/storages";
import PageLoading from "../components/page-loading";

const Login = ({ getMFAValidation, loginResponse }) => {
  const router = useRouter();
  const [enteredEmail, setEmail] = useState("");
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  const [emailErro, setEmailError] = useState("");
  const [isClickAuth, setClickAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const { instance, accounts, inProgress } = useMsal();
  const handleClick = () => {
    if (inProgress !== "none") return;

    // Always redirect to login when accounts are empty
    if (accounts.length === 0) {
      console.log("No session found. Forcing Outlook SSO login...");

      // Use prompt=login to force MS login page even if SSO cookie is present
      instance
        .loginRedirect({
          prompt: "login", // ✅ Forces user to re-enter credentials
        })
        .catch((error) => {
          console.error("Login error:", error);
        });

      return;
    }
  };

  useEffect(() => {
    if (accounts.length > 0) {
      setIsLoading(false);
      setStorage("token", accounts[0].idToken);
      router.push("/projects");
    } else {
      const timeout = setTimeout(() => {
        if (!accounts || accounts.length === 0) {
          setIsLoading(false);
          router.push("/login");
        }
      }, 5000); 

      return () => clearTimeout(timeout); 
    }
  }, [instance, accounts, inProgress]);

  if (isLoading) {
    return (
      <div>
        {/* <PageLoading /> */}
      </div>
    );
  }

  return (
    <div className="page-wraper">
      <div className="login-account">
        <div className={`row ${styles.loginContainer}`}>
          <div className="col-lg-6 align-self-start">
            <div
              className="account-info-area"
              style={{ backgroundImage: `url(${LoginBack})` }}
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
          {!isClickAuth ? (
            <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
              <div className="login-form">
                <div className="d-flex align-items-center justify-content-center">
                  <h2 className="title fontWeight2">Login to Your Account</h2>
                </div>

                <h6 className="login-title">
                  <span>Login</span>
                </h6>

                <form onSubmit={onLogin} autoComplete="off">
                  <div className="mb-4">
                    <label className="mb-1 text-dark">Email</label>
                    <div id="select-email" name="select-email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control px-2"
                        value={enteredEmail}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        placeholder="Enter Email"
                      />
                    </div>
                    {emailErro?.email && (
                      <div className="text-danger fs-12 mt-3">
                        {emailErro?.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="mb-1 text-dark">Password</label>
                    <div id="select-password" name="select-password">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control px-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                      />
                    </div>
                    {errors?.password && (
                      <div className="text-danger fs-12">
                        {errors?.password}
                      </div>
                    )}
                  </div>

                  <div
                    id="login-submit"
                    name="login-submit"
                    className="text-center mt-5"
                  >
                    <RegularButton
                      type="submit"
                      name="LOGIN"
                      width="100%"
                      loading={loginResponse}
                      disabled
                    />
                  </div>

                  <div className="social-login mt-3 text-center">
                    <div className="d-flex align-items-center justify-content-center or-divider mb-3">
                      <div className={`flex-grow-1 ${styles.line}`}></div>
                      <span className="mx-2 text-muted">Or</span>
                      <div className={`flex-grow-1 ${styles.line}`}></div>
                    </div>
                    <div className="d-flex justify-content-center gap-3">
                      <div
                        id="click-ms-login"
                        className="cr-pointer"
                        onClick={() => {
                          // setClickAuth("MS");
                          handleClick();
                        }}
                      >
                        <Image
                          className="login-logo mx-3"
                          src={MS_Logo}
                          style={{ width: "40px", height: "40px" }}
                        />
                      </div>

                      <div
                        id="click-google-login"
                        className="cr-pointer"
                        onClick={() => {
                          setClickAuth("Client");
                        }}
                      >
                        <Image
                          className="login-logo"
                          src={GoogleLogo}
                          style={{ width: "40px", height: "40px" }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <IsAdmin setClickAuth={setClickAuth} isClickAuth={isClickAuth} />
          )}
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
