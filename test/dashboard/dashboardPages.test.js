import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Mutable router pathname for tests
let routerPathname = "/";
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: routerPathname }),
}));

// Mutable aliasName from storages
let aliasNameMock = "ADMIN";
jest.mock("../../src/utils/storages", () => ({
  getLocalStored: () => ({ aliasName: aliasNameMock }),
}));

// Utilities used by the page
jest.mock("../../src/utils/reusable", () => ({
  // return the incoming date for predictability
  formatDateForIndex: ({ date }) => date,
  getRoleIdByRole: (s) => `ROLE_${String(s || "").toUpperCase()}`,
}));

// Global popup, not imported by the file but referenced
// eslint-disable-next-line no-undef
global.getResponePopup = jest.fn();

// roleAccessList used for default tab decision and header visibility
jest.mock("../../src/commonPages/dashboard/component/function", () => ({
  roleAccessList: {
    Admin: ["Default", "Workflows", "Invalid"],
    Reviewer: ["WorkQueue"],
  },
}));

// Mock children pages to simple markers that also expose received props
jest.mock("../../src/commonPages/dashboard/pages/default", () => {
  return function MockDefault(props) {
    return (
      <div data-testid="default-page">
        <span data-testid="customDate-len">{props.customDate?.length ?? 0}</span>
      </div>
    );
  };
});

jest.mock("../../src/commonPages/dashboard/pages/workflow", () => () => (
  <div data-testid="workflow-page" />
));

jest.mock("../../src/commonPages/dashboard/pages/invalid/Invalid", () => () => (
  <div data-testid="invalid-page" />
));

jest.mock("../../src/commonPages/dashboard/pages/workQueue", () => () => (
  <div data-testid="workqueue-page" />
));

// HeaderFilters mock exposes a way to invoke callbacks
jest.mock("../../src/commonPages/dashboard/pages/components/headerFilters", () => {
  return function MockHeaderFilters(props) {
    return (
      <div data-testid="header-filters">
        <button data-testid="hf-change-org" onClick={() => props.handleOrganizationChange("ORG-X")}>
          Org
        </button>
        <button data-testid="hf-change-dos" onClick={() => props.handleChange("DOSWISE")}>
          DOS
        </button>
        <button
          data-testid="hf-date-range"
          onClick={() => props.setDateRange({ startDate: "2024-01-01", endDate: "2024-01-03" })}
        >
          Date
        </button>
      </div>
    );
  };
});

// Actions used via handleApiCalls
jest.mock("../../src/stores/admin/dashboard1/actions", () => ({
  getWidgetsListAction: (params) => ({ type: "GET_WIDGETS_LIST", params }),
}));

const mockStore = configureStore([]);

function createStore(overrides = {}, dispatchImpl) {
  const baseState = { admin: { dashboard1: {} } };
  const state = { ...baseState, ...overrides };
  const store = mockStore(state);
  store.dispatch = jest.fn(
    dispatchImpl || ((action) => {
      if (action?.type === "GET_WIDGETS_LIST") {
        return Promise.resolve({ status: "SUCCESS", response: [] });
      }
      return Promise.resolve({});
    })
  );
  return store;
}

function renderWithStore(props = {}, storeOverrides = {}, dispatchImpl) {
  const store = createStore(storeOverrides, dispatchImpl);
  const Component = require("../../src/commonPages/dashboard/pages").default;
  const ui = (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
  return { ...render(ui), store };
}

beforeEach(() => {
  jest.useRealTimers();
  aliasNameMock = "ADMIN";
  routerPathname = "/";
  // eslint-disable-next-line no-undef
  getResponePopup.mockReset?.();
  cleanup();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  cleanup();
});

describe("DashboardPages - rendering by selectedTab", () => {
  it("shows HeaderFilters and Default when not reviewer and role lacks WorkQueue", () => {
    const setSelectedTab = jest.fn();
    renderWithStore({ selectedTab: "Default", setSelectedTab });
    expect(screen.getByTestId("header-filters")).toBeInTheDocument();
    expect(screen.getByTestId("default-page")).toBeInTheDocument();
  });

  it("renders Workflow, Invalid, and WorkQueue views based on selectedTab", () => {
    const setSelectedTab = jest.fn();
    const { rerender } = (() => {
      const { container, store } = renderWithStore({ selectedTab: "Workflows", setSelectedTab });
      expect(screen.getByTestId("workflow-page")).toBeInTheDocument();
      cleanup();
      return { rerender: (props) => renderWithStore(props, {}, store.dispatch), store };
    })();

    renderWithStore({ selectedTab: "Invalid", setSelectedTab });
    expect(screen.getByTestId("invalid-page")).toBeInTheDocument();
    cleanup();

    renderWithStore({ selectedTab: "WorkQueue", setSelectedTab });
    expect(screen.getByTestId("workqueue-page")).toBeInTheDocument();
  });
});

describe("DashboardPages - effects and API calls", () => {
  it("calls setSelectedTab('WorkQueue') after 200ms when on reviewer dashboard", () => {
    jest.useFakeTimers();
    routerPathname = "/reviewer/dashboard";
    const setSelectedTab = jest.fn();
    renderWithStore({ selectedTab: "Default", setSelectedTab });
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(setSelectedTab).toHaveBeenCalledWith("WorkQueue");
  });

  it("calls setSelectedTab with first tab from roleAccessList for alias role", () => {
    jest.useFakeTimers();
    aliasNameMock = "ADMIN"; // formats to "Admin"
    const setSelectedTab = jest.fn();
    renderWithStore({ selectedTab: "", setSelectedTab });
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(setSelectedTab).toHaveBeenCalledWith("Default");
  });

  it("triggers getWidgetsList on mount when selectedTab is truthy (SUCCESS path)", async () => {
    const setSelectedTab = jest.fn();
    const { store } = renderWithStore({ selectedTab: "Default", setSelectedTab });
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch.mock.calls[0][0]).toMatchObject({ type: "GET_WIDGETS_LIST" });
  });

  it("ERROR path does not crash (silent catch)", async () => {
    const dispatchImpl = (action) => {
      if (action?.type === "GET_WIDGETS_LIST") {
        return Promise.resolve({ status: "ERROR", message: "Bad" });
      }
      return Promise.resolve({});
    };
    expect(() =>
      renderWithStore({ selectedTab: "Default", setSelectedTab: jest.fn() }, {}, dispatchImpl)
    ).not.toThrow();
  });

  it("computes customDate from initial dateRange and passes to Default", () => {
    // Given our formatDateForIndex passthrough, start = today-29d, end=today ⇒ ~30 days
    const { } = renderWithStore({ selectedTab: "Default", setSelectedTab: jest.fn() });
    const len = Number(screen.getByTestId("customDate-len").textContent);
    expect(len).toBeGreaterThanOrEqual(28);
  });
});

describe("DashboardPages - header toggling", () => {
  it("when roleAccessList includes WorkQueue for role, header is hidden and WorkQueue is shown", () => {
    aliasNameMock = "REVIEWER"; // formats to "Reviewer"
    // Update roleAccessList mock for this role via jest.isolateModules if needed
    // But our mock maps Reviewer to ["WorkQueue"], so condition should hide header
    renderWithStore({ selectedTab: "WorkQueue", setSelectedTab: jest.fn() });
    expect(screen.queryByTestId("header-filters")).not.toBeInTheDocument();
    expect(screen.getByTestId("workqueue-page")).toBeInTheDocument();
  });

  it("invokes header callbacks: organization, DOS change, and date range update", async () => {
    const setSelectedTab = jest.fn();
    renderWithStore({ selectedTab: "Default", setSelectedTab });
    // exercise header callbacks to cover handleOrganizationChange/handleChange and date range effect
    await act(async () => {
      screen.getByTestId("hf-change-org").click();
      screen.getByTestId("hf-change-dos").click();
      screen.getByTestId("hf-date-range").click();
    });
    // customDate should now be for 3 days; wait for effect to flush
    await act(async () => {});
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.getByTestId("customDate-len").textContent).toBe("3");
  });
});


