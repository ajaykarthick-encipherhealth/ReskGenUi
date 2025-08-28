import React, { useEffect, useState } from "react";
import styles from "../../reports/report.module.css";
import { useRouter } from "next/router";
import { createIdGen } from '../../../utils/reusable'

const Tab = ({ activeTab, handleTabs, tabs, id, padding }) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !tabs || tabs.length === 0) return null;

  return (
    <div>
      <label>
        <div
          id={
            id
              ? createIdGen("tabs" + id )
              : createIdGen("tabs" + router.pathname.replaceAll("/", " "))
          }
          className={` d-flex gap-3 ${styles.group} ${styles.buttonContainer}`}
          style={{ padding: padding || "3px" }}
        >
          {tabs?.map((tab) => (
            <label className="mb-0 p-1">
              <button
                id={
                  id
                    ? createIdGen("activeTab" + id + tab)
                    : createIdGen("activeTab" + router.pathname.replaceAll("/", " ") + tab)
                }
                key={`tab-${tab}`}
                className={activeTab === tab ? styles.active : ""}
                onClick={() => handleTabs(tab)}
              >
                {/* This is only for demo purposes, as told by Logesh. */}
                {tab == "ReAllocation" ? "Re-Allocation" : tab } 
              </button>
            </label>
          ))}
        </div>
      </label>
    </div>
  );
};

export default Tab;
