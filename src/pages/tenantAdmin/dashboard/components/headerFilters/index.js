import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions as dashboardActions } from "../../../../../stores/tenantAdmin/dashboard/workFlow";
import styles from "./styles.module.css";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { disableFutureDates } from "../../../../../components/headerFilters/functions";
const { RangePicker } = DatePicker;
const index = ({
  activeBtn,
  setActiveBtn,
  setDateRange,
  organizationStatusData,
  getOrganizationStatusData,
  handleOrganizationChange,
  setSelectedValue,
  dateRange,
}) => {
  const [isCustom, setIsCustom] = useState(false);

  const handleDateChange = (value) => {
    if (value == "custom") {
      setIsCustom(true);
      setSelectedValue(value);
    } else {
      setIsCustom(false);
      let startDate;
      if (value === "last_1_week") {
        startDate =
          moment().subtract(6, "days").format("YYYY-MM-DD") + "T00:00:00.000Z";
        setSelectedValue(value);
      } else if (value === "last_1_month") {
        startDate =
          moment().subtract(29, "days").format("YYYY-MM-DD") + "T00:00:00.000Z";
        setSelectedValue(value);
      } else if (value == undefined) {
        setDateRange({ startDate: "", endDate: "" });
      }
      if (value != undefined) {
        const endDate = moment().format("YYYY-MM-DD") + "T23:59:59.000Z";
        setDateRange({ startDate: startDate, endDate: endDate });
      }
    }
  };
  const handleRange = (e) => {
    if (!e || !e[0] || !e[1]) {
      const range = {
        startDate:
          moment().subtract(29, "days").format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: moment().format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      setDateRange(range);
    } else {
      const range = {
        startDate: moment(e[0]).format("YYYY-MM-DD") + "T00:00:00.000Z",
        endDate: moment(e[1]).format("YYYY-MM-DD") + "T23:59:59.000Z",
      };
      setDateRange(range);
    }
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

  const disabled1YearDate = (current, { from }) => {
    if (disableFutureDates(current)) {
      return true;
    }
    if (from) {
      return Math.abs(current.diff(from, "years")) >= 1;
    }
    return false;
  };

  return (
    <div className={styles.container}>
      <div className="row" style={{ width: "60%" }}>
        <div className="col-4 d-flex">
          <div className={styles.flterContainer}>Organization</div>
          <div className="tenantSelector" style={{ width: "100%" }}>
            <Select
              placeholder="Organization"
              options={organizationOptions}
              allowClear
              onChange={handleOrganizationChange}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              showSearch
            />
          </div>
        </div>
        <div className="col-3 d-flex">
          <div className={styles.flterContainer}>Date</div>
          <div className="tenantSelector" style={{ width: "100%" }}>
            <Select
              placeholder="Date"
              defaultValue="Last 30 days"
              options={[
                { label: "Last 7 days", value: "last_1_week" },
                { label: "Last 30 days", value: "last_1_month" },
                { label: "Custom Date", value: "custom" },
              ]}
              onChange={handleDateChange}
            />
          </div>
        </div>
        {isCustom && (
          <div className="col-5 d-flex">
            <div
              className={`${styles.flterContainer}`}
              style={{ fontSize: "14px" }}
            >
              Custom Date
            </div>
            <div className="tenantSelector" style={{ width: "100%" }}>
              <RangePicker
                size="large"
                disabledDate={disabled1YearDate}
                onChange={(e, value) => handleRange(value)}
                format={"MM-DD-YYYY"}
                allowClear={true}
              />
            </div>
          </div>
        )}
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
            setSelectedValue("last_1_month");
          }}
        >
          Workflow
        </button>
      </div>
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    organizationStatusData:
      state.tenantAdmin?.dashboard?.workFlow?.organizationStatus?.data,
  }),

  {
    getOrganizationStatusData: dashboardActions?.organizationStatusAction,
  }
);
export default enhancer(index);
