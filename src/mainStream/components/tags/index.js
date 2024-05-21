import React from "react";
import styles from "../../reports/report.module.css";

const Tab = ({ activeTab, handleTabs, tabs }) => {
  return (
    <div className={styles.buttonContainer}>
      <div className={styles.group}>
        {tabs?.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? `${styles.active}` : ""}
            onClick={() => handleTabs(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tab;
