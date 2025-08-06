import { connect } from "react-redux";
import DynamicDashboard from "../../../commonPages/dashboard";
import React, { useEffect } from "react";
import actions from "../../../stores/admin/dashboard1/actions";

const Dashboard = ({ dispatch, data }) => {

  const getApiCall = async () => {
    try {
      const apiKeys = [
        // "workFlow",
        // "dailyTask",
        // "accuracy",
        // "completedScore",
        // "holdStatus",
        // "notification",
        // "tenentLogo",
        // "teamChart",
        // "getSelectUserList",
        // "getDeliveryStatus",
        // "getDateRange",
      ];

      for (const item of apiKeys) {
        const actionKey = `${item}Action`;

        if (typeof actions[actionKey] === "function") {
          await dispatch(
            actions[actionKey]({
              startDate: "2024-01-01",
              endDate: "2024-01-31",
            })
          );
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    getApiCall();
  }, []);

  return <DynamicDashboard />;
};

const enhancer = connect((state) => ({
  data: state.admin.dashboard, // You can now access loaders here
}))(Dashboard);

export default enhancer;
