import React from "react";
import styles from "../../reports/report.module.css";

const Tab = ({ activeTab, handleTabs, tabs , icon,width }) => {
  return (
    <div style={{width: width ?width:"30%"}} className={styles.buttonContainer}>
      <div
        id={`reportTab-${activeTab}`}
        name={`reportTab-${activeTab}`}
        className={styles.group}
      >
        {tabs?.map((tab) => (
          <button
            id={activeTab}
            name={activeTab}
            key={tab}
            className={activeTab === tab ? `${styles.active}` : ""}
            onClick={() => handleTabs(tab)}
          >
           {icon} {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tab;
