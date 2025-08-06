import React, { useEffect, useState } from "react";
import Default from "./default";
import Invalid from "./invalid/Invalid";
import Workflow from "./workflow";
import WorkQueue from "./workQueue";
import HeaderFilters from "./components/headerFilters";
import { formatDateForIndex, getRoleIdByRole } from "../../../utils/reusable";
import moment from "moment";
import { getLocalStored } from "../../../utils/storages";
import { useRouter } from "next/router";
import { roleAccessList } from "../component/function";
import { connect } from "react-redux";
import styles from "../style.module.css"
import actions from "../../../stores/admin/dashboard1/actions";

const DashboardPages = ({
  setDynamicModal,
  selectedRole,
  setSelectedTab,
  selectedTab,
  dispatch,
}) => {
  const { aliasName = null } = getLocalStored();
  const router = useRouter();
  const [currentAliasName, setCurrentAliasName] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: formatDateForIndex({
      date: moment().subtract(29, "days").format("YYYY-MM-DD"),
      index: 0,
    }),

    endDate: formatDateForIndex({
      date: moment().format("YYYY-MM-DD"),
      index: 1,
    }),
  });
  const formatRole =
    currentAliasName?.split("_").join("")[0] +
    currentAliasName?.split("_").join("").slice(1).toLowerCase();
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [selectDos, setSelectDos] = useState("DOSWISE");

  const handleApiCalls = async ({ actionType = "", params }) => {
    const actionKey = `${actionType}Action`;
    return await dispatch(actions[actionKey](params));
  };

  const handleOrganizationChange = (value) => {
    setSelectedOrganization(value);
  };
  const handleChange = (value) => {
    setSelectDos(value);
  };

  const handleGetWidgets = async () => {
    const getRoleId = getRoleIdByRole(
      aliasName?.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgetsList",
        params: {
          role: getRoleId,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
      if (res.status !== "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {}
  };
  const getAllDatesInRange = (dateRange) => {
    const dates = [];
    let currentDate = moment(dateRange?.startDate);

    while (currentDate.isSameOrBefore(dateRange?.endDate)) {
      dates.push(currentDate.format("MMMDD"));
      currentDate = currentDate.add(1, "days");
    }

    return dates;
  };

  useEffect(() => {
    if (selectedTab) {
      handleGetWidgets();
    }
  }, [selectedTab]);

  useEffect(() => {
    const customRange = getAllDatesInRange(dateRange);
    setCustomDate(customRange);
  }, [dateRange]);
  useEffect(() => {
    const role =
      aliasName?.split("_").join("")[0] +
      aliasName?.split("_").join("").slice(1).toLowerCase();
    setTimeout(() => {
      if(router.pathname === "/reviewer/dashboard")
        setSelectedTab("WorkQueue");
      else
      setSelectedTab(roleAccessList[role]?.[0]);
    }, 200);
    setCurrentAliasName(aliasName);
  }, []);

  return (
    <div className={styles.maincontainer}>
      {router.pathname !== "/reviewer/dashboard" &&
      !roleAccessList[formatRole]?.includes("WorkQueue") ? (
        <div>
          <div className="mx-2">
            <HeaderFilters
              activeBtn={selectedTab}
              setActiveBtn={setSelectedTab}
              setDateRange={setDateRange}
              handleOrganizationChange={handleOrganizationChange}
              setSelectedOrganization={setSelectedOrganization}
              selectedOrganization={selectedOrganization}
              setSelectedValue={setSelectedValue}
              dateRange={dateRange}
              handleChange={handleChange}
              setDynamicModal={setDynamicModal}
              selectedRole={formatRole}
            />
          </div>

          {selectedTab === "Default" && (
            <Default
              selectedRole={selectedRole}
              dateRange={dateRange}
              selectedValue={selectedValue}
              customDate={customDate}
            />
          )}
          {selectedTab === "Workflows" && (
            <Workflow
              selectedRole={selectedRole}
              dateRange={dateRange}
              selectedValue={selectedValue}
              customDate={customDate}
            />
          )}
          {selectedTab === "Invalid" && (
            <Invalid
              selectedRole={selectedRole}
              dateRange={dateRange}
              selectedOrganization={selectedOrganization}
              selectedValue={selectedValue}
              customDate={customDate}
            />
          )}
          {selectedTab === "WorkQueue" && (
            <WorkQueue
              selectedRole={selectedRole}
            />
          )}
        </div>
      ) : (
        <WorkQueue selectedRole={selectedRole} />
      )}
    </div>
  );
};

const enhancer = connect((state) => ({
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
}))(DashboardPages);

// {
//   getWidgetList: DashboardAction.getWidgetsListAction,
// }
export default enhancer;
