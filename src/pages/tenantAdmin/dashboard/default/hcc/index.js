import React from "react";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";

const index = () => {
  return (
    <div className="d-flex justify-content-between">
      <div className="remianingLineGraph" style={{ width: "33%" }}>
        <div className="d-flex justify-content-between">
          <div className={styles.header}>HCC Codes</div>
          <div>
            <div className={styles.header}>Total Codes</div>
            <div className={styles.price}>3000</div>
          </div>
        </div>
        <CodesGraph
          gradientColor1={"#04B700"}
          gradientColor2={"#FAFFFA"}
          borderColor={"#04B700"}
          isHcc={true}
        />
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#F0ECFE",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-1`}>RAF</div>
          <div className="p-1">
            <div className={styles.header}>Overall RAF</div>
            <div className={styles.price}>3000</div>
          </div>
        </div>
        <RafGraph rafColor={"#8E68F7"} isHcc={true} />
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#EBFCFF",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-1`}>Revenue</div>
          <div className="p-1">
            <div className={styles.header}>Overall Revenue</div>
            <div className={styles.price}>$ 3000</div>
          </div>
        </div>
        <RevenueGraph hccColor="#02BBDE" />
      </div>
    </div>
  );
};

export default index;
