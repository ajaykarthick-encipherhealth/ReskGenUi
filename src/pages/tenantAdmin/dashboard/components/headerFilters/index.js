import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions as dashbaordActions } from "../../../../../stores/tenantAdmin/workFlow";
import styles from "./styles.module.css";
import { Select } from "antd";
import moment from "moment";

const index = ({
  activeBtn,
  setActiveBtn,
  setDateRange,
  organizationStatusData,
  getOrganizationStatusData,
  handleOrganizationChange,
}) => {
  const handleDateChange = (value) => {
    let startDate;
    if (value === "last_1_week") {
      startDate =
        moment().subtract(6, "days").format("YYYY-MM-DD") + "T00:00:00.000Z";
    } else if (value === "last_1_month") {
      startDate =
        moment().subtract(30, "days").format("YYYY-MM-DD") + "T00:00:00.000Z";
    } else {
      startDate = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    }
    const endDate = moment().format("YYYY-MM-DD") + "T23:59:59.000Z";
    setDateRange({ startDate: startDate, endDate: endDate });
  };

  useEffect(() => {
    getOrganizationStatusData();
  }, []);

  const organizationOptions = organizationStatusData?.response?.map(
    (org, index) => ({
      value: org.id,
      label: org.name,
    })
  );


  return (
    <div className={styles.container}>
      <div
        className="d-flex justify-content-between w-[40%]"
        style={{ width: "40%" }}
      >
        <div className="d-flex" style={{ width: "50%" }}>
          <div className={styles.flterContainer} style={{ width: "35%" }}>
            Organization
          </div>
          <div className="tenantSelector" style={{ width: "65%" }}>
            <Select
              placeholder="Organization"
              options={organizationOptions}
              allowClear
              onChange={handleOrganizationChange}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              showSearch
            />
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
              onChange={handleDateChange}
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
const enhancer = connect(
  (state) => (
    {
    organizationStatusData: state.tenantAdmin.workFlow.organizationStatus.data,
  }
),

  {
    getOrganizationStatusData: dashbaordActions.organizationStatusAction,
  }
);
export default enhancer(index);
