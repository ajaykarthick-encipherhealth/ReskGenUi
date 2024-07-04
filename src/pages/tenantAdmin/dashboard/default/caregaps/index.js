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
          <div className={styles.header}>Care Gap Codes</div>
          <div>
            <div className={styles.header}>Total Codes</div>
            <div className={styles.price}>3000</div>
          </div>
        </div>
        <CodesGraph
          gradientColor1={"#FF9209"}
          gradientColor2={"#FFFDFA"}
          borderColor={"#FF9209"}
          isCargaps={true}
        />
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#E2F1F3",
          borderRadius: "16px",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-2`}>RAF</div>
          <div className="p-2">
            <div className={styles.header}>Overall RAF</div>
            <div className={styles.price}>3000</div>
          </div>
        </div>
        <RafGraph rafColor={"#4AA1AB"} isCargaps={true} />
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#DAE0FC",
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
        <RevenueGraph cargapColor="#5A75F2"/>
      </div>
    </div>
  );
};

export default index;
