import React from "react";
import styles from "./styles.module.css";

const LogoLoader = () => {
  return (
    <div className={styles.progress_loader}>
      <div className={styles.loading_spinner}>
        <div className={styles.logo}></div>
        <svg className={styles.spinner} viewBox="25 25 50 50">
          <circle
            className={styles.path}
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke-width="2"
            stroke-miterlimit="10"
          />
        </svg>
      </div>
    </div>
  );
};

export default LogoLoader;
