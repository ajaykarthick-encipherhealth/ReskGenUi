import React, { useState } from "react";
import styles from "./styles.module.css";

const Tabs = ({ tabsList, activeTab, onChangeTabs }) => {
  return (
    <div className={`${styles.tabMainConatiner}`}>
      <div className={`${styles.tabContainer} d-flex`}>
        {tabsList?.length > 0 &&
          tabsList.map((item) => {
            const isActive = item?.key == activeTab;
            return item?.label && !item?.isAvailable ? (
              <div
                key={item?.key}
                data-testid={`tabs${item?.key}`}
                className={`${
                  isActive ? styles.activeTab : styles.inactiveTab
                } ${styles.tabItem} cr-pointer`}
                onClick={() => !isActive && onChangeTabs(item)}
              >
                {item?.label}
              </div>
            ) : (
              <div
                key={item?.key}
                data-testid={`tabs${item?.key}`}
                className={`${
                  isActive ? styles.activeTab : styles.inactiveTab
                } ${styles.tabItem}`}
                // onClick={() => !isActive && onChangeTabs(item)}
              >
                <label className={styles.inNotAvalTab}>{item?.label}</label>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Tabs;
