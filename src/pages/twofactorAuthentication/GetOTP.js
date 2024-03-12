import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "../../styles/auth.module.css";
import twofactorImage from "../../images/svg/twofactorAuthentication.svg";
import redirect from "../../images/svg/redirect.svg";
import hamburgermenu from "../../images/svg/hamburgermenu.svg";
import settings from "../../images/svg/settings.svg";
import { codeLength, generateCodeArray } from "./Authentication";
import { getQrCode, getValidateCode } from "../../store/actions/AuthActions";
import { useSelector } from "react-redux";
import { encyptingPass } from "../../components/headerFilters/functions";

const GetOTP = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const url = useSelector((state) => state.auth.qrcode);
  const inputRefs = Array.from({ length: codeLength + 1 }, () => useRef(null));
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [code, setCode] = useState([]);

  useEffect(() => {
    inputRefs[1]?.current?.focus();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedParams = urlParams.get("params");
    if (encodedParams) {
      const decodedParams = JSON.parse(atob(encodedParams));
      const { username, password } = decodedParams;
      setUsername(decodedParams?.username);
      setPassword(decodedParams?.password);
      dispatch(getQrCode(decodedParams?.username, router));
    }
  }, []);

  const handleInput = (index, e) => {
    const value = e.target.value;
    const numbers = code.slice(0, 6);
    if (!isNaN(value) && value?.length === 1) {
      numbers.push(value);
    }
    setCode(numbers);
    if (code[index - 1] && value) {
      const addOndigit = value[1];
      const splittedVal = [...code, ...addOndigit];
      setCode(splittedVal);
      inputRefs[index + 1]?.current?.focus();
    }
    if (value?.length === 1 && index < inputRefs?.length - 1) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.keyCode === 8 && index > 0) {
      e.preventDefault();
      const updatedCode = [...code?.slice(0, 6)];
      updatedCode.splice(index - 1, 1);
      setCode(updatedCode);
      inputRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <div className={styles.contentMainDIv}>
      <div className={styles.mfaMainDiv}>
        <div className={styles.instrucDIv}>
          <div className={styles.innerdiv}>
            <Image src={twofactorImage} alt="noimg" className={styles.imgDiv} />
            <span className={styles.header}>MF Authentication</span>
            <div className={styles.pointsDiv}>
              <ol>
                <li className={styles.steps}>
                  To Download the one Authentication on your Mobile or tab.
                  <div
                    style={{
                      width: "60%",
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <span className={styles.links}>
                      Play Store <Image src={redirect} alt="noimg" />
                    </span>
                    <span
                      style={{ marginLeft: "20px" }}
                      className={styles.links}
                    >
                      App Store <Image src={redirect} alt="noimg" />
                    </span>
                  </div>
                </li>
                <li className={styles.steps}>
                  Open One Authentication on your mobile or tab.
                </li>
                <li className={styles.steps}>
                  Tap Menu <Image src={hamburgermenu} alt="noimg" /> or settings{" "}
                  <Image src={settings} alt="noimg" /> and select Linked
                  devices.
                </li>
                <li className={styles.steps}>
                  Tap link a device and point your phone to this screen to
                  capture the code
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className={styles.qrDIv}>
          {url && <Image src={url} alt="noimg" width={300} height={300} />}
        </div>
      </div>
      <div className={styles.verifyDiv}>
        <div className={styles.codeBox}>
          {generateCodeArray()
            .slice(0, generateCodeArray().length - 1)
            .map((index) => (
              <>
                <input
                  key={index}
                  type="number"
                  maxLength="1"
                  pattern="[0-9]"
                  value={
                    code?.length > 0
                      ? code[index - 1]
                        ? code[index - 1]
                        : ""
                      : ""
                  }
                  className={styles.codeInput}
                  onInput={(e) => handleInput(index, e)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  ref={inputRefs[index]}
                />
              </>
            ))}
        </div>

        <div className={styles.btnDiv}>
          <button
            className={styles.sendBtn}
            style={{ width: "16%", margin: "auto" }}
            onClick={() => {
              const codeString = code?.join("");
              if (codeString?.length > 0) {
                dispatch(
                  getValidateCode(
                    username,
                    encyptingPass(codeString),
                    router,
                    "",
                    password
                  )
                );
              }
            }}
          >
            VALIDATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetOTP;
