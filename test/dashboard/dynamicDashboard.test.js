import React from "react";
import { render, screen, fireEvent, waitFor, act, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// IMPORTANT: import the connected component (enhancer default)
import DynamicDashboard from "../../src/commonPages/dashboard";

// Mocks for deeply imported components to keep tests light and deterministic
jest.mock("../../src/commonPages/dashboard/component/modal/widget", () => {
  return function MockWidget(props) {
    return (
      <div data-testid="widget">
        <div data-testid="selected-tab">{props.selectedTab}</div>
        <button
          data-testid="widget-select"
          onClick={() =>
            props.handleSelect({ widgetId: "w-1", widgetName: "W1", selectedChart: "bar", orderValue: 1, active: true })
          }
        >
          Select One
        </button>
      </div>
    );
  };
});

jest.mock("../../src/commonPages/dashboard/component/modal/dragAndDrap", () => {
  return function MockDragAndDrap(props) {
    return (
      <div data-testid="drag-drop">
        <div data-testid="drag-dashboard-len">{props.dashboard?.length || 0}</div>
      </div>
    );
  };
});

// Mock DashboardPages so we can control setDynamicModal and setSelectedTab
jest.mock("../../src/commonPages/dashboard/pages", () => {
  return function MockDashboardPages(props) {
    return (
      <div data-testid="dashboard-pages">
        <button data-testid="open-widget-modal" onClick={() => props.setDynamicModal("widget")}>Open Widget Modal</button>
        <button data-testid="open-dashboard-modal" onClick={() => props.setDynamicModal("dashboard")}>Open Dashboard Modal</button>
        <button data-testid="set-tab-workflows" onClick={() => props.setSelectedTab("Workflow")}>Set Tab Workflow</button>
        <div data-testid="selected-tab-page">{props.selectedTab}</div>
      </div>
    );
  };
});

// Mock Modal composite from react-bootstrap to avoid DOM complexity
jest.mock("react-bootstrap/Modal", () => {
  const React = require("react");
  const Modal = ({ show, onHide, children }) =>
    show ? (
      <div data-testid="modal">
        {children}
        <button data-testid="modal-close" onClick={onHide}>Close</button>
      </div>
    ) : null;
  Modal.Header = ({ children }) => <div data-testid="modal-header">{children}</div>;
  Modal.Title = ({ children }) => <div data-testid="modal-title">{children}</div>;
  Modal.Body = ({ children }) => <div data-testid="modal-body">{children}</div>;
  return Modal;
});

jest.mock("../../src/components/skeleton/card", () => {
  return function MockCardSkeleton() {
    return <div data-testid="card-skeleton" />;
  };
});

// Mock utilities
const mockGetResponsePopup = jest.fn();
jest.mock("../../src/utils/reusable", () => ({
  getResponePopup: (...args) => require("../../test/dashboard/dynamicDashboard.test.js").__mocks__.getResponePopup(...args),
  getRoleIdByRole: (s) => `ROLE_${String(s || "").toUpperCase()}`,
}));

// Expose mock handlers to jest runtime
export const __mocks__ = { getResponePopup: mockGetResponsePopup };

jest.mock("../../src/utils/storages", () => ({
  getLocalStored: () => ({ roleId: "RID-ADMIN" }),
}));

// Mock widget configuration and filter helper
jest.mock("../../src/commonPages/dashboard/component/function", () => ({
  DefaultWidget: [
    { widgetId: "w-1", widgetName: "W1", selectedChart: "bar", orderValue: 1, active: true },
    { widgetId: "w-2", widgetName: "W2", selectedChart: "line", orderValue: 2, active: true },
  ],
  WorkflowWidget: [ { widgetId: "wf-1", widgetName: "WF1", selectedChart: "bar", orderValue: 1, active: true } ],
  InvalidWidget: [ { widgetId: "inv-1", widgetName: "INV1", selectedChart: "bar", orderValue: 1, active: true } ],
  workQueueWidget: [ { widgetId: "wq-1", widgetName: "WQ1", selectedChart: "bar", orderValue: 1, active: true } ],
  filterWidgetsByRole: (widgets) => widgets,
}));

// Mock actions invoked via handleApiCalls
jest.mock("../../src/stores/admin/dashboard1/actions", () => ({
  getTabAccessAction: () => "getTabAccessAction",
  getWidgetsAction: () => "getWidgetsAction",
  getWidgetsListAction: () => "getWidgetsListAction",
  setWidgetsAction: () => "setWidgetsAction",
}));

const mockStore = configureStore([]);

function createStore(overrides = {}) {
  const baseState = {
    admin: {
      dashboard1: {
        getWidgets: { data: { response: [
          { widgetId: "w-1", widgetName: "W1", selectedChart: "bar", active: true, orderValue: 1 },
          { widgetId: "w-2", widgetName: "W2", selectedChart: "line", active: false, orderValue: 2 },
        ] } },
        getWidgetsLoader: false,
      },
    },
  };
  const state = { ...baseState, ...overrides };
  const store = mockStore(state);
  // Custom dispatch to return promises for our mocked actions
  store.dispatch = jest.fn((action) => {
    switch (action) {
      case "getTabAccessAction":
        return Promise.resolve({ status: "SUCCESS", response: ["DEFAULT", "WORKFLOWS", "INVALID", "WORKQUEUE"] });
      case "getWidgetsAction":
        return Promise.resolve({ status: "SUCCESS", response: state.admin.dashboard1.getWidgets.data.response });
      case "getWidgetsListAction":
        return Promise.resolve({ status: "SUCCESS" });
      case "setWidgetsAction":
        return Promise.resolve({ status: "SUCCESS" });
      default:
        return Promise.resolve({});
    }
  });
  return store;
}

function renderWithStore(stateOverrides = {}, propsOverrides = {}) {
  const store = createStore(stateOverrides);
  const ui = (
    <Provider store={store}>
      <DynamicDashboard {...propsOverrides} />
    </Provider>
  );
  return { ...render(ui), store };
}

describe("DynamicDashboard (modal, tabs, selections)", () => {
  beforeEach(() => {
    jest.useRealTimers();
    mockGetResponsePopup.mockReset?.();
    mockGetResponsePopup.mockClear?.();
  });

  afterEach(() => {
    try { jest.runOnlyPendingTimers(); } catch {}
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  it("loads tabs from getTabAccessApi and shows them", async () => {
    renderWithStore();
    // Tabs are rendered inside the modal body, so open the modal first
    fireEvent.click(screen.getByTestId("open-widget-modal"));
    await waitFor(() => {
      expect(screen.getAllByText("Default").length).toBeGreaterThan(0);
      expect(screen.getByText("Workflows")).toBeInTheDocument();
      expect(screen.getByText("Invalid")).toBeInTheDocument();
      expect(screen.getByText("WorkQueue")).toBeInTheDocument();
    });
  });

  it("opens widget modal, selects items, toggles Select All, and saves successfully", async () => {
    jest.useFakeTimers();
    try {
      // Start with no pre-selected widgets so Save is enabled after selection
      const emptyState = {
        admin: { dashboard1: { getWidgets: { data: { response: [] } }, getWidgetsLoader: false } },
      };
      const { store } = renderWithStore(emptyState);

      // open modal
      fireEvent.click(screen.getByTestId("open-widget-modal"));
      expect(screen.getByTestId("modal")).toBeInTheDocument();

      // Initially, Total Widgets Selected shows 0
      expect(screen.getByText(/Total Widgets Selected:/)).toBeInTheDocument();

      // Select one item via Widget mock
      fireEvent.click(screen.getByTestId("widget-select"));

      // Toggle Select All
      const selectAll = screen.getByLabelText("Select All");
      fireEvent.click(selectAll);

      // Save
      fireEvent.click(screen.getByText("Save"));
      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      // setWidgetsAction was dispatched and success popup shown
      expect(store.dispatch).toHaveBeenCalledWith("setWidgetsAction");
      expect(mockGetResponsePopup).toHaveBeenCalled();
    } finally {
      try { jest.runOnlyPendingTimers(); } catch {}
      jest.useRealTimers();
      jest.clearAllTimers();
    }
  });

  it("opens dashboard modal (drag and drop) and executes save path", async () => {
    jest.useFakeTimers();
    try {
      const { store } = renderWithStore();
      fireEvent.click(screen.getByTestId("open-dashboard-modal"));
      expect(screen.getByTestId("drag-drop")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Save"));
      await act(async () => {
        jest.advanceTimersByTime(350);
      });
      expect(store.dispatch).toHaveBeenCalledWith("setWidgetsAction");
      expect(mockGetResponsePopup).toHaveBeenCalled();
    } finally {
      try { jest.runOnlyPendingTimers(); } catch {}
      jest.useRealTimers();
      jest.clearAllTimers();
    }
  });

  it("handleCancel resets state and re-fetches widgets list", async () => {
    const { store } = renderWithStore();
    fireEvent.click(screen.getByTestId("open-widget-modal"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("modal-close"));
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith("getWidgetsListAction");
    });
  });

  it("shows skeleton when getSelectedWidgetsLoader is true", () => {
    renderWithStore({
      admin: { dashboard1: { getWidgets: { data: { response: [] } }, getWidgetsLoader: true } },
    });
    fireEvent.click(screen.getByTestId("open-widget-modal"));
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });

  it("setSelectedTab from DashboardPages updates internal state (Workflow mapping)", () => {
    renderWithStore();
    fireEvent.click(screen.getByTestId("set-tab-workflows"));
    expect(screen.getByTestId("selected-tab-page")).toHaveTextContent("Workflow");
  });
});

describe("DynamicDashboard negative paths", () => {
  it("handles getTabAccessApi failure gracefully (no tabs rendered)", async () => {
    // Override dispatch to reject for getTabAccessAction
    const store = createStore();
    store.dispatch = jest.fn((action) => {
      if (action === "getTabAccessAction") return Promise.reject(new Error("fail"));
      if (action === "getWidgetsAction") return Promise.resolve({ status: "SUCCESS", response: [] });
      return Promise.resolve({ status: "SUCCESS" });
    });
    render(
      <Provider store={store}>
        <DynamicDashboard />
      </Provider>
    );
    // Open modal and assert tabs are not shown
    fireEvent.click(screen.getByTestId("open-widget-modal"));
    await waitFor(() => {
      expect(screen.queryByText("Workflows")).not.toBeInTheDocument();
      expect(screen.queryByText("Invalid")).not.toBeInTheDocument();
      expect(screen.queryByText("WorkQueue")).not.toBeInTheDocument();
    });
  });

  it("setWidgets failure path triggers error popup in widget save", async () => {
    jest.useFakeTimers();
    try {
      const store = createStore();
      store.dispatch = jest.fn((action) => {
        switch (action) {
          case "getTabAccessAction":
            return Promise.resolve({ status: "SUCCESS", response: ["DEFAULT"] });
          case "setWidgetsAction":
            return Promise.resolve({ status: "ERROR", message: "Bad" });
          case "getWidgetsAction":
            return Promise.resolve({ status: "SUCCESS", response: store.getState().admin.dashboard1.getWidgets.data.response });
          default:
            return Promise.resolve({ status: "SUCCESS" });
        }
      });
      render(
        <Provider store={store}>
          <DynamicDashboard />
        </Provider>
      );
      fireEvent.click(screen.getByTestId("open-widget-modal"));
      fireEvent.click(screen.getByText("Save"));
      await act(async () => {
        jest.advanceTimersByTime(350);
      });
      expect(mockGetResponsePopup).toHaveBeenCalled();
    } finally {
      try { jest.runOnlyPendingTimers(); } catch {}
      jest.useRealTimers();
      jest.clearAllTimers();
    }
  });

  it("getWidgets error path in selection modal does not crash and keeps modal", async () => {
    const store = createStore();
    store.dispatch = jest.fn((action) => {
      if (action === "getWidgetsAction") return Promise.resolve({ status: "ERROR" });
      if (action === "getTabAccessAction") return Promise.resolve({ status: "SUCCESS", response: ["DEFAULT"] });
      return Promise.resolve({ status: "SUCCESS" });
    });
    render(
      <Provider store={store}>
        <DynamicDashboard />
      </Provider>
    );
    fireEvent.click(screen.getByTestId("open-dashboard-modal"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });
});


