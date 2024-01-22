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

const GetOTP = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const url = useSelector((state) => state.auth.qrcode);
  const inputRefs = Array.from({ length: codeLength + 1 }, () => useRef(null));
  const [username, setUsername] = useState();
  const [code, setCode] = useState([]);

  const handleInput = (index, e) => {
    const value = e.target.value;
    setCode((prev) => [...prev, ...value]);
    if (value?.length === 1 && index < inputRefs?.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setUsername(searchParams.get("username"));
    dispatch(getQrCode(searchParams.get("username"), router));
  }, []);

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
              <input
                key={index}
                type="text"
                maxLength="1"
                className={styles.codeInput}
                onInput={(e) => handleInput(index, e)}
                ref={inputRefs[index]}
              />
            ))}
        </div>
        <div className={styles.btnDiv}>
          <button
            className={styles.sendBtn}
            style={{ width: "16%", margin: "auto" }}
            onClick={() => {
              const codeString = code?.join("");
              dispatch(getValidateCode(username, codeString, router));
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
