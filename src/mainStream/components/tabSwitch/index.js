import React from "react";
const TabSwitcher = ({ activeTab, handleTabs, styles }) => {
  return (
    <div className={styles.userContainer}>
      <div className={styles.user}>
        <button
          className={activeTab === "Supervisor" ? `${styles.active}` : ""}
          onClick={() => handleTabs("Supervisor")}
        >
          Supervisor
        </button>
        <button
          className={activeTab === "Admin" ? `${styles.active}` : ""}
          onClick={() => handleTabs("Admin")}
        >
          Admin
        </button>
      </div>
    </div>
  );
};

export default TabSwitcher;
