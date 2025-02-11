import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions as dashboardActions } from "../../../../../stores/tenantAdmin/dashboard/workFlow";
import styles from "./styles.module.css";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { disabledDate as reusableDisabledDate } from "../../../../../utils/reusable"; // Import reusable function
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const index = ({
  activeBtn,
  setActiveBtn,
  setDateRange,
  organizationStatusData,
  getOrganizationStatusData,
  handleOrganizationChange,
  setSelectedValue,
  handleChange,
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

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
    setSelectedDates(e);
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
  const disabled1YearDate = (current) => {
    const isDisabledByReusableFunction = reusableDisabledDate(
      current,
      selectedDates
    );

    if (isDisabledByReusableFunction) {
      return true;
    }

    if (selectedDates && selectedDates[0]) {
      const from = dayjs(selectedDates[0]);
      return Math.abs(current.diff(from, "years")) >= 1;
    }

    return false;
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
      <div style={{width:"80%"}}>
        <div className="d-flex gap-3 ">
          <div style={{width:"250px"}}>
            <div className="d-flex">
              <div className={styles.flterContainer}>Organization</div>
              <div className="tenantSelector" style={{ width: "100%" }}>
                <Select
                  id="select-organization"
                  name="select-organization"
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
          </div>
          {activeBtn === "default" ? (
          <div style={{width:"250px"}}>
              <div className="d-flex">
                <div className={styles.flterContainer}>DOS/YEAR</div>
                <div className="tenantSelector" style={{ width: "100%" }}>
                  <Select
                    id="dos-year"
                    name="dos-year"
                    placeholder="Dos"
                    options={[
                      { value: "DOSWISE", label: "DOS" },
                      { value: "YEARWISE", label: "Year" },
                    ]}
                    onChange={handleChange}
                    showSearch
                    defaultValue="DOSWISE"
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div style={{width:"250px"}}>
          <div  className="d-flex">
              <div className={styles.flterContainer}>Date</div>
              <div className="tenantSelector" style={{ width: "100%" }}>
                <Select
                  id="select-days"
                  name="select-days"
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
          </div>
          {isCustom && (
              <div style={{width:"400px"}}>
              <div className="d-flex">
                <div className={`${styles.flterContainer}`}>Custom Date</div>
                <div className="tenantSelector">
                  <RangePicker
                    id="select-customDate"
                    name="select-customDate"
                    size="large"
                    disabledDate={disabled1YearDate}
                    onCalendarChange={(val) => setSelectedDates(val)}
                    onChange={(e, value) => handleRange(value)}
                    format={"MM-DD-YYYY"}
                    allowClear={true}
                  />
                </div>
              </div>
            </div>
          )}
      </div>
      </div>
      <div >
      <div className={styles.btnContainer}>
        <button
          className={
            activeBtn === "default" ? styles.activeBtn : styles.headerBtn
          }
          onClick={() => {
            setActiveBtn("default");
          }}
          id="default-btn"
          name="default-btn"
        >
          Default
        </button>
        <button
          id="workflow-btn"
          name="workflow-btn"
          className={
            activeBtn === "workflow" ? styles.activeBtn : styles.headerBtn
          }
          onClick={() => {
            setActiveBtn("workflow");
          }}
        >
          Workflow
        </button>
        <button
          id="invalid-btn"
          name="invalid-btn"
          className={
            activeBtn === "Invalid" ? styles.activeBtn : styles.headerBtn
          }
          onClick={() => {
            setActiveBtn("Invalid");
          }}
        >
          Invalid
        </button>
      </div>
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
