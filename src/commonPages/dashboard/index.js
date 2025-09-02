import { Button, Skeleton, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Widget from "./component/modal/widget";
import DragAndDrap from "./component/modal/dragAndDrap";
import {
  DefaultWidget,
  filterWidgetsByRole,
  InvalidWidget,
  WorkflowWidget,
  workQueueWidget,
} from "./component/function";
import { getResponePopup, getRoleIdByRole } from "../../utils/reusable";
import DashboardPages from "./pages";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import actions from "../../stores/admin/dashboard1/actions";
import style from "./style.module.css";
import CardSkeleton from "../../components/skeleton/card";
import { getLocalStored } from "../../utils/storages";

const roles = [
  "Admin",
  "Coder 1",
  "Coder 2",
  "Owner",
  "QA",
  "QA Lead",
  "Project Lead",
  "Downloader",
  "Client",
];

const DynamicDashboard = ({
  dispatch,
  getSelectedWidgets,
  getSelectedWidgetsLoader,
}) => {
  const { roleId = "" } = getLocalStored();
  const [tabNames, setTabNames] = useState([]);
  const [dynamicModal, setDynamicModal] = useState("");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [pagesLoader, setPagesLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Default");
  const [selectedTabPage, setSelectedTabPage] = useState("");
  const [dashboard, setDashboard] = useState([]);
  const [selectedItems, setSelectedItem] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const handleApiCalls = async ({ actionType = "", params }) => {
    const actionKey = `${actionType}Action`;
    return await dispatch(actions[actionKey](params));
  };
  const handleCancel = () => {
    setDynamicModal("");
    setSelectedItem([]);
    setSelectedRole("Admin");
    setSelectedTab("Default");
    getWidgetsListActionApi();
  };

  const getWidgetsListActionApi = async () => {
    const getRoleId = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );

    try {
      const res = await handleApiCalls({
        actionType: "getWidgetsList",
        params: {
          role: roleId,
          dashBoardPage:
            selectedTabPage == "Workflow"
              ? "WORKFLOWS"
              : selectedTabPage.toUpperCase(),
        },
      });
    } catch (error) {}
  };

  const handleSelect = (item) => {
    const isSelected = selectedItems.some(
      (el) => el.widgetId === item.widgetId
    );
    if (isSelected) {
      setSelectedItem((prev) =>
        prev.filter((el) => el.widgetId !== item.widgetId)
      );
    } else {
      const apiItem = getSelectedWidgets.find(
        (el) => el.widgetId === item.widgetId
      );
      setSelectedItem((prev) => [...prev, apiItem || item]);
    }
  };

  const getWidgets = (value) => {
    const widgets = (() => {
      switch (value) {
        case "Default":
          return DefaultWidget;
        case "Workflows":
          return WorkflowWidget;
        case "Invalid":
          return InvalidWidget;
        case "WorkQueue":
          return workQueueWidget;
        default:
          return [];
      }
    })();
    return filterWidgetsByRole(widgets, selectedRole);
  };

  const handleSelectAll = (value) => {
    if (!value) {
      setSelectedItem([]);
      return;
    }

    const widgetList = getWidgets(selectedTab);
    const existingIds = new Set(selectedItems.map((item) => item.widgetId));

    const remaining = widgetList.filter(
      (widget) => !existingIds.has(widget.widgetId)
    );

    const uniqueItems = [...selectedItems, ...remaining];

    setSelectedItem(uniqueItems);
  };

  const handleSaveWidgets = async () => {
    const getRoleId = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    const obj = selectedItems?.map((item) => ({
      ...item,
      role: getRoleId,
    }));
    try {
      setSaveLoading(true);
      const res = await handleApiCalls({
        actionType: "setWidgets",
        params: obj,
      });
      if (res.status == "SUCCESS") {
        handleGetWidgets();
        getResponePopup({
          status: "SUCCESS",
          message: "Widget Saved Successfully",
        });
      } else {
        getResponePopup(res);
      }
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  };

  const handleGetWidgets = async () => {
    const getRoleId = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgets",
        params: {
          role: getRoleId,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
      if (res.status == "SUCCESS") {
        setSelectedItem(res.response);
      } else {
        getResponePopup(res);
      }
    } catch (error) {}
  };

  const handleGetSelectedWidget = async () => {
    const getRoleId = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    try {
      const res = await handleApiCalls({
        actionType: "getWidgets",
        params: {
          role: getRoleId,
          dashBoardPage: selectedTab.toUpperCase(),
        },
      });
      if (res.status == "SUCCESS") {
        setDashboard(
          res.response
            .filter((d) => d.active)
            .sort((a, b) => a.orderValue - b.orderValue)
        );
      } else {
        getResponePopup(res);
      }
    } catch (error) {}
  };

  const handleSaveShowWidgets = async () => {
    const getRoleId = getRoleIdByRole(
      selectedRole.toUpperCase().replaceAll(" ", "_")
    );
    let orderId = dashboard.length;
    const obj = getSelectedWidgets.map((item, index) => {
      orderId += 1;
      return {
        ...item,
        orderValue:
          +dashboard.find((e) => e.widgetId == item.widgetId)?.orderValue ||
          orderId,
        active: dashboard.some((e) => e.widgetId == item.widgetId),
        selectedChart:
          dashboard.find((e) => e.widgetId == item.widgetId)?.selectedChart ||
          item.selectedChart,
        role: getRoleId,
      };
    });
    setSaveLoading(true);
    try {
      const res = await handleApiCalls({
        actionType: "setWidgets",
        params: obj,
      });
      if (res.status == "SUCCESS") {
        handleGetWidgets();
        getResponePopup({
          status: "SUCCESS",
          message: "Widget Changed Successfully",
        });
      } else {
        getResponePopup(res);
      }
    } catch (error) {
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSave = () => {
    setPagesLoader(true);
    setTimeout(() => {
      if (dynamicModal === "widget") {
        handleSaveWidgets();
      } else {
        handleSaveShowWidgets();
      }
      setPagesLoader(false);
    }, 300);
  };
  const handleTapChange = () => {
    setSelectedItem(getSelectedWidgets || []);
  };

  const getTabAccessApi = async () => {
    try {
      const res = await handleApiCalls({
        actionType: "getTabAccess",
        params: {
          role: getRoleIdByRole(
            selectedRole.toUpperCase().replaceAll(" ", "_")
          ),
        },
      });
      if (res.status == "SUCCESS") {
        const tabs = res.response.map((item) =>
          item == "WORKQUEUE"
            ? "WorkQueue"
            : item.charAt(0) + item.slice(1).toLowerCase()
        );
        setTabNames(tabs);
        setSelectedTab(tabs[0]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getTabAccessApi();
  }, [selectedRole]);

  useEffect(() => {
    if (dynamicModal === "widget") {
      handleGetWidgets();
    } else if (dynamicModal) {
      handleGetSelectedWidget();
    }
  }, [dynamicModal, selectedRole, selectedTab]);

  useEffect(() => {
    if (dynamicModal === "widget") {
      const temp = getSelectedWidgets
        ?.map((item) => ({
          widgetId: item.widgetId,
        }))
        ?.sort((a, b) => a.widgetId?.localeCompare(b.widgetId));
      const temp2 = selectedItems
        ?.map((item) => ({
          widgetId: item.widgetId,
        }))
        ?.sort((a, b) => a.widgetId?.localeCompare(b.widgetId));
      setIsDisable(JSON.stringify(temp) == JSON.stringify(temp2));
    } else {
      const temp = getSelectedWidgets
        ?.sort((a, b) => a.orderValue - b.orderValue)
        ?.filter((item) => item.active)
        .map((item) => ({
          widgetId: item.widgetId,
          orderValue: +item.orderValue,
          selectedChart: item.selectedChart,
        }));
      const temp2 = dashboard.map((item) => ({
        widgetId: item.widgetId,
        orderValue: +item.orderValue,
        selectedChart: item.selectedChart,
      }));
      setIsDisable(JSON.stringify(temp) == JSON.stringify(temp2));
    }
  }, [dashboard, selectedItems]);

  return (
    <div className={style.showHeight}>
      <DashboardPages
        setDynamicModal={setDynamicModal}
        selectedRole={selectedRole}
        pagesLoader={pagesLoader}
        dynamicModal={dynamicModal}
        setSelectedTab={setSelectedTabPage}
        selectedTab={selectedTabPage}
      />
      <Modal
        show={dynamicModal}
        onHide={handleCancel}
        size="xl"
        centered
        scrollable
        className="dynamicDashboardModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {dynamicModal === "widget" ? "Widget" : "Dashboard"} Customization
            <div className="small text-muted">
              <span style={{ color: "red" }}>*</span> Choose the appropriate
              widgets for the selected role to enable customization and save
              preferences.
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex flex-wrap gap-2 my-4">
              {roles.map((role) => (
                <Button
                  key={role}
                  size="sm"
                  className={`rounded-pill ${
                    selectedRole === role
                      ? style.btnActive
                      : "outline-secondary"
                  }`}
                  onClick={() => {
                    setSelectedRole(role);
                    setSelectedTab("Default");
                  }}
                >
                  {role}
                </Button>
              ))}
            </div>

            <div className="d-flex flex-wrap gap-5 my-4 align-items-center">
              {dynamicModal === "widget" && (
                <div className="d-flex align-items-center">
                  <div className="fw-bold">
                    Total Widgets Selected:{" "}
                    <span style={{ color: "#04306F" }}>
                      {selectedItems?.length}
                    </span>
                  </div>

                  <div className="form-check ms-3">
                    <input
                      className="form-check-input cr-pointer"
                      type="checkbox"
                      id="selectAll"
                      checked={selectedItems.length &&
                        (getWidgets(selectedTab)?.length ===
                        selectedItems?.length)
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="selectAll">
                      Select All
                    </label>
                  </div>
                </div>
              )}

              <div className="d-flex gap-1">
                <Button
                  className="btn btn-sm  w-full text-ellipsis"
                  style={{ background: "#A6A8AC", color: "white" }}
                  onClick={handleTapChange}
                >
                  Cancel
                </Button>
                <Button
                  className=" btn-sm w-full text-ellipsis tableButton"
                  onClick={handleSave}
                  // disabled={dynamicModal === "widget" || (dynamicModal === "widget" && selectedItems.length <= 0)}
                  disabled={isDisable}
                  loading={saveLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div className="d-flex gap-4 mx-1">
            {tabNames.map((tab) => (
              <div
                key={tab}
                onClick={() => {
                  setSelectedTab(tab);
                  setSelectedItem([]);
                }}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedTab === tab ? "bold" : "normal",
                  borderBottom:
                    selectedTab === tab ? "3px solid #04306F" : "none",
                  color: selectedTab === tab ? "#04306F" : "inherit",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {getSelectedWidgetsLoader ? (
            <CardSkeleton count={5} height={200} />
          ) : dynamicModal === "widget" ? (
            <Widget
              selectedTab={selectedTab}
              selectedItems={selectedItems}
              setSelectedItem={setSelectedItem}
              handleSelect={handleSelect}
              dashboard={dashboard}
              setDashboard={setDashboard}
              selectedRole={selectedRole}
            />
          ) : (
            <DragAndDrap
              selectedTab={selectedTab}
              selectedItems={selectedItems}
              setSelectedItem={setSelectedItem}
              handleSelect={handleSelect}
              dashboard={dashboard}
              setDashboard={setDashboard}
              selectedRole={selectedRole}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

const enhancer = connect((state) => ({
  getSelectedWidgets: state.admin.dashboard1.getWidgets?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard1.getWidgetsLoader,
}))(DynamicDashboard);

// {
//     setWidget: DashboardAction.setWidgetsAction,
//     getWidget: DashboardAction.getWidgetsAction,
//     getWidgetsListAction: DashboardAction.getWidgetsListAction,
//   }

export default enhancer;
