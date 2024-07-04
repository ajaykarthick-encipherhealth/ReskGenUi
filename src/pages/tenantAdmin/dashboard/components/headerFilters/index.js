import React from "react";
import styles from "./styles.module.css";
import { Select } from "antd";

const index = ({activeBtn, setActiveBtn}) => {
  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between w-[40%]" style={{ width: "40%" }}>
        <div className="d-flex" style={{ width: "50%" }}>
          <div className={styles.flterContainer} style={{ width: "35%" }}>
            Organization
          </div>
          <div className="tenantSelector" style={{ width: "65%" }}>
            <Select placeholder="Organization" options={[]} allowClear />
          </div>
        </div>
        <div className="d-flex" style={{ width: "47%" }}>
          <div className={styles.flterContainer} style={{ width: "20%" }}>
            Date
          </div>
          <div className="tenantSelector" style={{ width: "80%" }}>
            <Select
              placeholder="Date"
              options={[
                { label: "Last 7 days", value: "last_1_week" },
                { label: "Last 30 days", value: "last_1_month" },
                { label: "Custom range Picker", value: "custom" },
              ]}
              allowClear
            />
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <button
          className={
            activeBtn === "default" ? styles.activeBtn : styles.headerBtn
          }
          onClick={() => {
            setActiveBtn("default");
          }}
        >
          Default
        </button>
        <button
          className={
            activeBtn === "workflow" ? styles.activeBtn : styles.headerBtn
          }
          onClick={() => {
            setActiveBtn("workflow");
          }}
        >
          Workflow
        </button>
      </div>
    </div>
  );
};

export default index;
