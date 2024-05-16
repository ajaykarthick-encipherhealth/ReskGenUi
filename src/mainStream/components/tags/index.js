
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveTab } from "../../store/actions/l2Action/AuditReportAction";
import styles from '../../../resusablereport/reports/report.module.css';

const TabNavigation = ({ tabs }) => {
  const dispatch = useDispatch();
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);

  const handleTabs = (name) => {
    localStorage.setItem("activeTab", name);
    dispatch(getActiveTab(name));
  };

  return (
    <div className={styles.buttonContainer}>
      <div className={styles.group}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={reportActiveTab === tab ? `${styles.active}` : ""}
            onClick={() => handleTabs(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
