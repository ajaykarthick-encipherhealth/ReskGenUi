import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "../../styles/auth.module.css";
import twofactorImage from "../../images/svg/twofactorAuthentication.svg";
import {
  getQrCode,
  getValidateCode,
  loginAction,
} from "../../store/actions/AuthActions";
import { encyptingPass } from "../../components/headerFilters/functions";

export const codeLength = 6;
export const generateCodeArray = () =>
  Array.from({ length: codeLength + 1 }, (_, index) => index + 1);

const index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(30);
  const [enableMFA, setEnableMFA] = useState(false);
  const [username, setUsername] = useState();
  const [skip, setSkip] = useState();
  const [code, setCode] = useState([]);
  const [password, setPassword] = useState();

  const inputRefs = Array.from({ length: codeLength + 1 }, () => useRef(null));

  const handleInput = (index, e) => {
    const value = e.target.value;
    setCode((prev) => [...prev, ...value]);
    if (value.length === 1 && index < inputRefs?.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedParams = urlParams.get("params");
    const decodedParams = JSON.parse(atob(encodedParams));
    const { mfa, skipEntry, username, password } = decodedParams;
    setEnableMFA(decodedParams?.mfa);
    setUsername(decodedParams?.username);
    setPassword(decodedParams?.password);
    const skipParam = decodedParams?.skipEntry;
    setSkip(skipParam);
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(intervalId);
        }
        return Math.max(0, prevSeconds - 1);
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.maindiv}>
      <section className={styles.innerdiv}>
        <Image src={twofactorImage} alt="noimg" className={styles.imgDiv} />
        <span className={styles.header}>MF Authentication</span>
        {enableMFA ? (
          <>
            <div className={styles.content}>
              Protecting your tickets is our top priority. Please confirm your
              account by entering the authorization code sent to
              **********@cogentai.com
            </div>
            {/* code Input */}
            <div className={styles.codeBox}>
              {generateCodeArray()
                .slice(0, generateCodeArray().length - 1)
                .map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    pattern="[0-9]"
                    className={styles.codeInput}
                    onInput={(e) => handleInput(index, e)}
                    ref={inputRefs[index]}
                  />
                ))}
            </div>
            <div className={styles.timer}>
              00:{String(seconds).padStart(2, "0")} s
            </div>
          </>
        ) : (
          <div className={styles.contentDiv}>
            <div style={{ width: "60%" }}>
              The purpose of Multi-Factor Authentication (MFA) is to enhance the
              security of digital accounts, systems, and sensitive information
              by adding an extra layer of verification beyond just a password.
              Traditional password-based authentication systems have
              vulnerabilities, and MFA addresses some of these weaknesses by
              requiring users to provide multiple forms of identification. The
              goal is to create a more robust and resilient authentication
              process that significantly enhances the security posture of
              digital systems and accounts.
            </div>
          </div>
        )}

        <div className={styles.lastContainer}>
          {enableMFA ? (
            <>
              <button
                className={styles.sendBtn}
                onClick={() => {
                  const codeString = code?.join("");
                  dispatch(
                    getValidateCode(
                      username,
                      encyptingPass(codeString),
                      router,
                      "validate",
                      password
                    )
                  );
                }}
              >
                SUBMIT
              </button>
              <button
                className={styles.backBtn}
                onClick={() => {
                  router.push("/login");
                }}
              >
                BACK
              </button>
              {/* <div className={styles.redirect}>
                <span className={styles.code}> Didn't get a Code? </span>
                <span className={styles.link}>Send again</span>
              </div> */}
            </>
          ) : (
            <>
              <button
                className={styles.sendBtn}
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
              >
                ENABLE MFA
              </button>
              {skip && (
                <button
                  className={styles.sendBtn}
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
                >
                  SETUP LATER
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default index;
