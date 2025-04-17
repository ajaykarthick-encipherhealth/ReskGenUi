import React, { useEffect, useState } from "react";
import styles from "../../reports/report.module.css";

const Tab = ({ activeTab, handleTabs, tabs, width }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !tabs || tabs.length === 0) return null;

  return (
    <div style={{ width: width || "30%" }} className={styles.buttonContainer}>
      <div
        id={`reportTab-${activeTab}`}
        name={`reportTab-${activeTab}`}
        className={styles.group}
      >
        {tabs?.map((tab) => (
          <button
            id={`tab-${tab}`}
            name={`tab-${tab}`}
            key={`tab-${tab}`}
            className={activeTab === tab ? styles.active : ""}
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
