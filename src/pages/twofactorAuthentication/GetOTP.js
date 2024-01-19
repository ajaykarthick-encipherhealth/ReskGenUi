import { QRCode } from "antd";
import React from "react";
import Image from "next/image";
import styles from "../../styles/auth.module.css";
import twofactorImage from "../../images/svg/twofactorAuthentication.svg";
import redirect from "../../images/svg/redirect.svg";
import hamburgermenu from "../../images/svg/hamburgermenu.svg";
import settings from "../../images/svg/settings.svg";

const GetOTP = () => {
  return (
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
                  <span style={{ marginLeft: "20px" }} className={styles.links}>
                    App Store <Image src={redirect} alt="noimg" />
                  </span>
                </div>
              </li>
              <li className={styles.steps}>
                Open One Authentication on your mobile or tab.
              </li>
              <li className={styles.steps}>
                Tap Menu <Image src={hamburgermenu} alt="noimg" /> or settings{" "}
                <Image src={settings} alt="noimg" /> and select Linked devices.
              </li>
              <li className={styles.steps}>
                Tap link a device and point your phone to this screen to capture
                the code
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className={styles.qrDIv}>
        <QRCode type="svg" value="https://ant.design/" size={300} />
      </div>
    </div>
  );
};

export default GetOTP;
