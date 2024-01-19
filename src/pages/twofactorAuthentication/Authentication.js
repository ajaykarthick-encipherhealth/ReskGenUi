import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../../styles/auth.module.css";
import twofactorImage from "../../images/svg/twofactorAuthentication.svg";

const codeLength = 6;
const index = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(30);
  const [enableMFA, setEnableMFA] = useState(false);
  const generateCodeArray = () =>
    Array.from({ length: codeLength + 1 }, (_, index) => index + 1);
  const inputRefs = Array.from({ length: codeLength + 1 }, () => useRef(null));

  const handleInput = (index, e) => {
    const value = e.target.value;

    if (value.length === 1 && index < inputRefs?.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  useEffect(() => {
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
        {!enableMFA ? (
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
          {!enableMFA ? (
            <>
              <button
                className={styles.sendBtn}
                onClick={() => {
                  setEnableMFA(true);
                }}
              >
                SUBMIT
              </button>
              <button
                className={styles.backBtn}
                onClick={() => {
                  router.push("/userlogin");
                }}
              >
                BACK
              </button>
              <div className={styles.redirect}>
                <span className={styles.code}> Didn't get a Code? </span>
                <Link href="/" className={styles.link}>
                  Send again
                </Link>
              </div>
            </>
          ) : (
            <>
              <button
                className={styles.sendBtn}
                onClick={() => {
                  router?.push("/twofactorAuthentication/GetOTP");
                }}
              >
                ENABLE MFA
              </button>
              <button
                className={styles.sendBtn}
                onClick={() => {
                  setEnableMFA(false);
                }}
              >
                SETUP LATER
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default index;
