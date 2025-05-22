import React, { useEffect, useState } from "react";
import styles from "../../reports/report.module.css";

const Tab = ({ activeTab, handleTabs, tabs, width, margin, padding }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !tabs || tabs.length === 0) return null;

  return (
    <div
    style={{
      width:
        width ||
        (tabs?.length === 2
          ? "30%"
          : tabs?.length === 3
          ? "45%"
          : tabs?.length === 4
          ? "60%"
          : "60%"), 
      margin: margin || "auto",
    }}
      className={styles.buttonContainer}
    >
      <div
        id={`reportTab-${activeTab}`}
        name={`reportTab-${activeTab}`}
        className={styles.group}
        style={{ padding: padding || "0px" }}
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
