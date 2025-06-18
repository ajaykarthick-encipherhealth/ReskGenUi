import React, { useEffect, useState } from "react";
import styles from "../../reports/report.module.css";

const Tab = ({ activeTab, handleTabs, tabs, width, margin, padding }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !tabs || tabs.length === 0) return null;

  return (
    <div>
      <label 
      >
        <div
          id={`reportTab-${activeTab}`}
          name={`reportTab-${activeTab}`}
          className={ ` d-flex gap-3 ${styles.group} ${styles.buttonContainer}`}
          style={{ padding: padding || "3px" }}
        >
          {tabs?.map((tab) => (
            <label className="mb-0 p-1">
              <button
                id={`tab-${tab}`}
                name={`tab-${tab}`}
                key={`tab-${tab}`}
                className={activeTab === tab ? styles.active : ""}
                onClick={() => handleTabs(tab)}
              >
                {tab}
              </button>
            </label>
          ))}
        </div>
      </label>
    </div>
  );
};

export default Tab;
