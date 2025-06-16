import React, { useState } from "react";
import styles from "./styles.module.css";
import { Skeleton } from "antd";
import { useRouter } from "next/router";
import { createIdGen } from "../../utils/reusable";

const Tabs = ({ tabsList, activeTab, onChangeTabs }) => {
  const router = useRouter();
  return (
    <div className={`${styles.tabMainConatiner}`}>
      <div className={`${styles.tabContainer} d-flex`}>
        {tabsList.map((item) => (
          <div
            fileId={item?.fileId}
            id={createIdGen(
              router.pathname.replaceAll("/", " ") + " " + item?.fileSource
            )}
            data-testid={createIdGen(
              router.pathname.replaceAll("/", " ") + " " + item?.fileSource
            )}
            className={`${
              activeTab?.fileSource == item.fileSource
                ? styles.activeTab
                : styles.inactiveTab
            } ${styles.tabItem}`}
            onClick={() => onChangeTabs(item)}
          >
            <label className={`my-0 cr-pointer`}>
              {item?.fileSource?.replaceAll("_", " ")}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
