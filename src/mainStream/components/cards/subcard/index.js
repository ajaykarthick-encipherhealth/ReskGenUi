import React from "react";
import styles from "../../../../resusablereport/reports/report.module.css";

const SubCard = ({ title, value }) => {
  return (
    <div className={`col-xl-4 ${styles.subCard}`}>
      <div>
        <div>{title}</div>
        <h4>{value}</h4>
      </div>
    </div>
  );
};

export default SubCard;
