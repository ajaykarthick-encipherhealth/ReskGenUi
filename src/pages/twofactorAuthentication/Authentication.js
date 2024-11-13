import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Image from "next/image";
import { notification } from "antd";
import styles from "../../styles/auth.module.css";
import twofactorImage from "../../images/svg/twofactorAuthentication.svg";
import RegularButton from "../../components/button";
import { actions as AllActions } from "../../stores/authFlows";
import { getStorage, removeStorage, setStorage } from "../../utils/storages";

export const codeLength = 6;
export const generateCodeArray = () =>
  Array.from({ length: codeLength + 1 }, (_, index) => index + 1);

const Index = ({ getValidateCode, getLogin, loginLoader }) => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(30);
  const [enableMFA, setEnableMFA] = useState(false);
  const [username, setUsername] = useState();
  const [skip, setSkip] = useState();
  const [code, setCode] = useState([]);
  const [password, setPassword] = useState();

  const inputRefs = Array.from({ length: codeLength + 1 }, () => useRef(null));
  const handleInput = (index, e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length === 1) {
      const updatedCode = [...code];
      updatedCode[index - 1] = value;
      setCode(updatedCode);
      if (index === inputRefs?.length) {
        inputRefs[index]?.current?.focus();
      } else {
        inputRefs[index + 1]?.current?.focus();
      }
    }
  };

  const handleBackspace = (index, e) => {
    if (e.keyCode === 8 && index > 0) {
      e.preventDefault();
      const updatedCode = [...code];
      updatedCode[index - 1] = "";
      setCode(updatedCode);
      if (index <= 5 && index === inputRefs?.length) {
        inputRefs[index]?.current?.focus();
      } else {
        inputRefs[index - 1]?.current?.focus();
      }
    }
    if (e.code == "Enter" && code.length >= 6) {
      const codeString = code?.join("");
      getValidateCode({
        username: username,
        code: encryptedCode,
        route: router,
        validate: "validate",
        userpassword: encryptedPassword,
      });
    }
  };

  useEffect(() => {
    inputRefs[1]?.current?.focus();
    const mfa=JSON.parse(getStorage("mfa"))
    const username=getStorage("username")
    const password=getStorage("password")
    const skipParam =JSON.parse(getStorage("skipEntry"));
    setEnableMFA(mfa);
    setUsername(username);
    setPassword(JSON.parse(password));
    setSkip(skipParam);
    removeStorage("password")
    if(!username){
      router.push("/login")
    }
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      setCode([]);
      inputRefs[1].current?.focus();
      if (enableMFA) {
        notification.warning({
          description: "Oops! your time is expired",
          duration: 10,
          onClose: () => {
            setSeconds(30);
          },
        });
      }
    }
  }, [seconds]);

  useEffect(() => {
    if (seconds > 0) {
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            clearInterval(intervalId);
          }
          return Math.max(0, prevSeconds - 1);
        });
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [seconds]);
  useEffect(() => {
    const isPageRefresh = JSON.parse(getStorage('isPageRefresh'));if (isPageRefresh) {
      router.push('/login');
    } else {
      setStorage('isPageRefresh', true);
    }
    router.beforePopState(({ url }) => {
      router.push('/login');
      return false;
    });
    return () => {
      router.beforePopState(() => true);
      removeStorage('isPageRefresh');
    };
  }, [router]);

  return (
    <div className={styles.maindiv}>
      <section className={styles.innerdiv}>
        <Image src={twofactorImage} alt="noimg" className={styles.imgDiv} />
        <span className={styles.header}>MF Authentication</span>
        {enableMFA ? (
          <>
            <div className={styles.content}>
              Safeguarding your tickets is our highest concern. Please validate
              your account by entering the authorization code sent to
              *****@cogentai.com
            </div>
            {/* code Input */}
            <div className={styles.codeBox}>
              {generateCodeArray()
                .slice(0, generateCodeArray().length - 1)
                .map((index) => (
                  <input
                    key={index}
                    type="number"
                    maxLength="1"
                    pattern="[0-9]"
                    value={
                      code?.length > 0 && code[index - 1] ? code[index - 1] : ""
                    }
                    className={styles.codeInput}
                    onInput={(e) => handleInput(index, e)}
                    onKeyDown={(e) => handleBackspace(index, e)}
                    ref={inputRefs[index]}
                  />
                ))}
            </div>
            <div className={styles.timer}>
              00:{String(seconds)?.padStart(2, "0")} s
            </div>
          </>
        ) : (
          <div className={styles.contentDiv}>
            <div style={{ width: "60%" }}>
              Enhance your security measures by activating the newest
              Multi-Factor Authentication (MFA) feature. This provides an
              additional level of protection against unauthorized access and
              potential security risks. Want to learn more about MFA? Click
              ENABLE MFA to enable it. If you require additional time to
              prepare, you can choose to skip this step, though adopting MFA
              will be compulsory in the future.
            </div>
          </div>
        )}

        <div className={styles.lastContainer}>
          {enableMFA ? (
            <>
              <div className={styles.enableMfaBtn}>
                <RegularButton
                  type="submit"
                  onClick={() => {
                    const codeString = code?.join("");
                    getValidateCode({
                      username: username,
                      code: encryptedCode,
                      route: router,
                      validate: "validate",
                      userpassword: encryptedPassword,
                    });
                  }}
                  name="SUBMIT"
                  width="100%"
                />
              </div>
              <RegularButton
                type="outline"
                name="BACK"
                className={styles.backBtn}
                onClick={() => {
                  router.push("/login");
                }}
                width="100%"
              />
            </>
          ) : (
            <>
              <div className={styles.enableMfaBtn}>
                <RegularButton
                  type="submit"
                  onClick={() => {
                    const encodedParams = btoa(
                      JSON.stringify({
                        username: username,
                        password: password,
                      })
                    );

                    router?.push({
                      pathname: `/twofactorAuthentication/GetOTP`
                    });
                  }}
                  name="ENABLE MFA"
                  width="100%"
                />
              </div>
              {skip && (
                <RegularButton
                  type="submit"
                  onClick={() => {
                    getLogin({
                      email: username,
                      router: router,
                      code: code.length > 0 ? encryptingPass(code) : "",
                      password: password,
                      mfa: enableMFA,
                      skip: skip,
                    });
                  }}
                  name="SETUP LATER"
                  width="100%"
                  loading={loginLoader}
                  disabled={loginLoader}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const connector = connect(
  (state) => ({
    loginLoader: state.authReducer.loginLoader,
  }),
  {
    getLogin: AllActions.getLogin,
    getValidateCode: AllActions.getValidateCode,
  }
);

export default connector(Index);
