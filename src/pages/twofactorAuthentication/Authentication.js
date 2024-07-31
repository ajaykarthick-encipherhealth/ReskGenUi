import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { notification } from "antd";
import styles from "../../styles/auth.module.css";
import twofactorImage from "../../images/svg/twofactorAuthentication.svg";
import { encyptingPass } from "../../components/headerFilters/functions";
import RegularButton from "../../components/button";
import { getValidateCode, loginAction } from "../../stores/authflow/actions";
import { useSelector } from "react-redux";

export const codeLength = 6;
export const generateCodeArray = () =>
  Array.from({ length: codeLength + 1 }, (_, index) => index + 1);

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginResponse = useSelector((state) => state.auth.authInfo);
  const [seconds, setSeconds] = useState(30);
  const [enableMFA, setEnableMFA] = useState(false);
  const [username, setUsername] = useState();
  const [skip, setSkip] = useState();
  const [code, setCode] = useState([]);
  const [password, setPassword] = useState();

  const inputRefs = Array.from({ length: codeLength + 1 }, () => useRef(null));

  useEffect(() => {
    inputRefs[1]?.current?.focus();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedParams = urlParams.get("params");
    const decodedParams = JSON.parse(atob(encodedParams));
    setEnableMFA(decodedParams?.mfa);
    setUsername(decodedParams?.username);
    setPassword(decodedParams?.password);
    const skipParam = decodedParams?.skipEntry;
    setSkip(skipParam);
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
      dispatch(
        getValidateCode(
          username,
          encyptingPass(codeString),
          router,
          "validate",
          password,
          enableMFA
        )
      );
    }
  };

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
              {/* The purpose of Multi-Factor Authentication (MFA) is to enhance the
              security of digital accounts, systems, and sensitive information
              by adding an extra layer of verification beyond just a password.
              Traditional password-based authentication systems have
              vulnerabilities, and MFA addresses some of these weaknesses by
              requiring users to provide multiple forms of identification. The
              goal is to create a more robust and resilient authentication
              process that significantly enhances the security posture of
              digital systems and accounts. */}
              Enhance your security measures by activating the newest
              Multi-Factor Authentication (MFA) feature. This provides an
              additional level of protection against unauthorized access and
              potential security risks. Want to learn more about MFA? Click here
              to enable it. If you require additional time to prepare, you can
              choose to skip this step, though adopting MFA will be compulsory
              in the future.
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
                    dispatch(
                      getValidateCode(
                        username,
                        encyptingPass(codeString),
                        router,
                        "validate",
                        password,
                        enableMFA
                      )
                    );
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
                      pathname: `/twofactorAuthentication/GetOTP`,
                      search: `params=${encodedParams}`,
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
                    dispatch(
                      loginAction(
                        username,
                        router,
                        code?.join(""),
                        password,
                        enableMFA,
                        skip
                      )
                    );
                  }}
                  name="SETUP LATER"
                  width="100%"
                  loading={loginResponse?.loading}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
