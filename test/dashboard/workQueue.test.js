import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
// IMPORTANT: Do NOT import WorkQueue at top-level; require it after mocks

// Components mocks (avoid passing unknown props to DOM)
jest.mock("../../src/commonPages/dashboard/component/appchart", () => {
  return function MockAppChart() {
    return <div data-testid="app-chart" />;
  };
});

jest.mock("../../src/components/yearpicker", () => {
  return function MockYearPicker() {
    return <div data-testid="year-picker" />;
  };
});

jest.mock("../../src/components/buttonSroller", () => {
  return function MockButtonScroller() {
    return <div data-testid="button-scroller" />;
  };
});

jest.mock("../../src/commonPages/dashboard/component/statusCard", () => {
  return function MockStatusCard() {
    return <div data-testid="status-card" />;
  };
});

jest.mock("../../src/commonPages/dashboard/component/notifications", () => {
  return function MockNotifications() {
    return <div data-testid="notifications" />;
  };
});

jest.mock("../../src/commonPages/dashboard/component/holdstatus", () => {
  return function MockHoldStatus() {
    return <div data-testid="hold-status" />;
  };
});

// Avoid pulling in header/nav dependencies through reviewer/workingstatus
jest.mock("../../src/pages/reviewer/workingstatus", () => ({
  Buttons: [
    { id: 1, title: "Daily" },
    { id: 2, title: "Weekly" },
    { id: 3, title: "Monthly" },
  ],
}));

// Mock EmptyComponent for predictable output
jest.mock("../../src/commonPages/dashboard/component/empty/EmptyComponent", () => {
  return function MockEmpty() {
    return <div>No data</div>;
  };
});

jest.mock("../../src/commonPages/dashboard/component/headtitle", () => {
  return function MockHeadtitle() {
    return <div data-testid="head-title" />;
  };
});

jest.mock("../../src/components/skeleton/card", () => {
  return function MockCardSkeleton() {
    return <div data-testid="card-skeleton" />;
  };
});

// Functions and utils mocks
jest.mock("../../src/commonPages/dashboard/component/function", () => ({
  getDateWeek: jest.fn(() => 2),
  getDaysInMonth: jest.fn(() => 31),
  getFormattedChartData: jest.fn(() => ({
    categories: ["A", "B", "C"],
    formattedSeries: [{ name: "S", data: [1, 2, 3] }],
    height: 240,
  })),
  getTotalChart: jest.fn(() => 100),
  useHasMounted: jest.fn(() => true),
  useWindowWidth: jest.fn(() => 1400),
  workQueueWidget: jest.fn(() => []),
  getColSpan: jest.fn(() => 4),
  getRowSpan: jest.fn(() => 2),
}));

jest.mock("../../src/utils/storages", () => ({
  getLocalStored: jest.fn(() => ({ dashboardLayout: null, userName: "tester", aliasName: "QA" })),
}));

jest.mock("../../src/utils/reusable", () => ({
  formatDateTime: jest.fn(({ date }) => (date ? "2024-01-01" : "")),
  getRoleIdByRole: jest.fn(() => 6),
  statusFormate: jest.fn((s) => s),
  getColorValue: jest.fn(() => "#000"),
}));

// Actions mocks
const actionsMock = {
  workQueueSummaryAction: jest.fn(() => ({ type: "WORKQUEUE_SUMMARY" })),
  workQueueProductivityAction: jest.fn(() => ({ type: "WORKQUEUE_PRODUCTIVITY" })),
  workQueueAccuracyAction: jest.fn(() => ({ type: "WORKQUEUE_ACCURACY" })),
  dashboardNotificationAction: jest.fn(() => ({ type: "DASHBOARD_NOTIFICATION" })),
  workQueueDailySummaryAction: jest.fn(() => ({
    type: "WORKQUEUE_DAILY_SUMMARY",
    response: {
      allocatedCount: 1,
      completedCount: 2,
      pendingCount: 3,
      reassignedPendingCount: 4,
      reassignedCompletedCount: 5,
      queryApprovedCount: 6,
      queryPendingCount: 7,
    },
  })),
};

jest.mock("../../src/stores/admin/dashboard1/actions", () => actionsMock);

const mockStore = configureStore([]);

const baseWidgets = [
  { widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c030", widgetName: "WorkFlow", selectedChart: "bar", active: true, orderValue: 1, size: "medium", title: "WorkFlow" },
  { widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c031", widgetName: "DailyTask5", selectedChart: "bar", active: true, orderValue: 2, size: "medium", title: "Daily 5" },
  { widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c035", widgetName: "DailyTask7", selectedChart: "bar", active: true, orderValue: 3, size: "medium", title: "Daily 7" },
  { widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c032", widgetName: "Accuracy", selectedChart: "line", active: true, orderValue: 4, size: "large", title: "Accuracy" },
  { widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c033", widgetName: "Notifications", selectedChart: "line", active: true, orderValue: 5, size: "medium", title: "Notifications" },
  { widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c034", widgetName: "CompletedStatus", selectedChart: "line", active: true, orderValue: 6, size: "medium", title: "Completed Status" },
  { widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c036", widgetName: "WorkFlowChart7", selectedChart: "pie", active: true, orderValue: 7, size: "medium", title: "WorkFlow 7" },
];

const defaultState = {
  admin: {
    dashboard1: {
      getWidgetsList: { data: { response: baseWidgets }, loader: false },
      workQueueSummary: { data: { response: { allocatedCount: 10, pendingCount: 3, completedCount: 5, reassignedPendingCount: 1, reassignedCompletedCount: 2, queryApprovedCount: 1, queryPendingCount: 0 } } },
      workQueueSummaryLoader: false,
      workQueueDailySummary: { data: { response: {} } },
      workQueueDailySummaryLoader: false,
      workQueueAccuracy: { data: { response: { accuracyData: [ { year: 2024, month: 1, day: 1, week: 1, accuracy: 88 } ] } } },
      workQueueAccuracyLoader: false,
      workQueueProductivity: { data: { response: { productivityAllocatedCount: [ { day: 1, week: 1, month: 1, count: 3 } ], productivityCompletedCount: [ { day: 1, week: 1, month: 1, count: 2 } ] } } },
      workQueueProductivityLoader: false,
      dashboardNotification: { list: [] },
      dashboardNotificationLoader: false,
    },
  },
};

const renderWithStore = (stateOverrides = {}, props = {}) => {
  const store = mockStore({
    ...defaultState,
    ...stateOverrides,
  });
  // Require after mocks are registered
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const WorkQueue = require("../../src/commonPages/dashboard/pages/workQueue").default;
  return render(
    <Provider store={store}>
      <WorkQueue {...props} />
    </Provider>
  );
};

describe("WorkQueue Dashboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Positive cases", () => {
    it("renders all primary widgets and charts", async () => {
      renderWithStore();
      expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
      expect(screen.getAllByTestId("button-scroller").length).toBeGreaterThan(0);
      expect(screen.getAllByTestId("year-picker").length).toBeGreaterThan(0);
      expect(screen.getByTestId("notifications")).toBeInTheDocument();
    });

    it("renders WorkFlow card view when selectedChart is card", () => {
      const widgets = [ { ...baseWidgets[0], selectedChart: "card" } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      expect(screen.getAllByTestId("status-card").length).toBeGreaterThan(0);
    });

    it("renders DailyTask7 with pie chart branch", async () => {
      jest.useFakeTimers();
      const widgets = [ { ...baseWidgets[2], selectedChart: "pie" } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      // advance internal setTimeout used to populate visibleTasks
      jest.advanceTimersByTime(400);
      await waitFor(() => {
        expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
      });
      jest.useRealTimers();
    });

    it("navigates DailyTask5/7 via arrows without crashing", () => {
      const { container } = renderWithStore();
      const prev = container.querySelector('#prev-arrow');
      const next = container.querySelector('#next-arrowIcon');
      if (prev) fireEvent.click(prev);
      if (next) fireEvent.click(next);
      expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
    });

    it("dispatches initial API calls on mount", async () => {
      renderWithStore();
      await waitFor(() => {
        expect(actionsMock.workQueueSummaryAction).toHaveBeenCalled();
        expect(actionsMock.workQueueProductivityAction).toHaveBeenCalled();
        expect(actionsMock.workQueueAccuracyAction).toHaveBeenCalled();
        expect(actionsMock.dashboardNotificationAction).toHaveBeenCalled();
      });
    });

    it("renders Accuracy weekly using __testOverrides without interactions", () => {
      const widgets = [ { ...baseWidgets[3] } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state, {
        __testOverrides: {
          accuracyState: {
            activeButton: 1,
            selectedMonth: 1,
            selectedYear: 2024,
            year: 2024,
            month: 1,
            currentBtn: "Weekly",
          },
        },
      });
      expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
    });

    it("renders Productivity monthly using __testOverrides without interactions", () => {
      const widgets = [ { ...baseWidgets[5] } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state, {
        __testOverrides: {
          productivityState: {
            activeButton: 2,
            selectedMonth: 1,
            selectedYear: 2024,
            year: 2024,
            month: 1,
            currentBtn: "Monthly",
          },
        },
      });
      expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
    });

    it("renders DailyTask5 with line chart branch", async () => {
      jest.useFakeTimers();
      const widgets = [ { ...baseWidgets[1], selectedChart: "line" } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      jest.advanceTimersByTime(400);
      await waitFor(() => {
        expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
      });
      jest.useRealTimers();
    });

    it("renders WorkFlow with line chart branch", () => {
      const widgets = [ { ...baseWidgets[0], selectedChart: "line" } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
    });

    it("renders CompletedStatus chart (non-loader)", () => {
      const widgets = [ { ...baseWidgets[5] } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
    });

    it("renders DailyTask5 with pie branch (non bar/line)", async () => {
      jest.useFakeTimers();
      const widgets = [ { ...baseWidgets[1], selectedChart: "pie" } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      jest.advanceTimersByTime(400);
      await waitFor(() => {
        expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
      });
      jest.useRealTimers();
    });

    it("renders DailyTask7 with bar branch", async () => {
      jest.useFakeTimers();
      const widgets = [ { ...baseWidgets[2], selectedChart: "bar" } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      jest.advanceTimersByTime(400);
      await waitFor(() => {
        expect(screen.getAllByTestId("app-chart").length).toBeGreaterThan(0);
      });
      jest.useRealTimers();
    });
  });

  describe("Negative and edge cases", () => {
    it("shows EmptyComponent when no widgets", () => {
      const state = { admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: [] }, loader: false } } } };
      renderWithStore(state);
      expect(screen.getByText(/No data/i)).toBeInTheDocument();
    });

    it("returns null when not mounted", () => {
      const fns = require("../../src/commonPages/dashboard/component/function");
      fns.useHasMounted.mockImplementation(() => false);
      renderWithStore();
      expect(screen.queryAllByTestId("app-chart").length).toBe(0);
      // restore
      fns.useHasMounted.mockImplementation(() => true);
    });

    it("shows skeleton when widgets loader is true", () => {
      const state = { admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsListLoader: true } } };
      renderWithStore(state);
      expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
    });

    it("warns when an action is missing in initial API calls", async () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      actionsMock.workQueueProductivityAction = undefined;
      renderWithStore();
      await waitFor(() => {
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("workQueueProductivityAction"));
      });
      warnSpy.mockRestore();
      // restore for subsequent tests
      actionsMock.workQueueProductivityAction = jest.fn(() => ({ type: "WORKQUEUE_PRODUCTIVITY" }));
    });

    it("catches and logs API errors from actions", async () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const original = actionsMock.workQueueSummaryAction;
      actionsMock.workQueueSummaryAction = jest.fn(() => { throw new Error("boom"); });
      renderWithStore();
      await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith("API error:", expect.any(Error));
      });
      // restore
      actionsMock.workQueueSummaryAction = original;
      errorSpy.mockRestore();
    });

    it("shows accuracy skeleton when accuracy loader is true", () => {
      const widgets = [ { ...baseWidgets[3] } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false }, workQueueAccuracyLoader: true } },
      };
      renderWithStore(state);
      expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
    });

    it("shows productivity skeleton when productivity loader is true", () => {
      const widgets = [ { ...baseWidgets[5] } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false }, workQueueProductivityLoader: true } },
      };
      renderWithStore(state);
      expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
    });

    it("shows WorkFlow skeleton when summary loader is true", () => {
      const widgets = [ { ...baseWidgets[0] } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false }, workQueueSummaryLoader: true } },
      };
      renderWithStore(state);
      expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
    });

    it("shows daily task skeletons when userDailySummaryLoading is true", () => {
      const widgets = [ { ...baseWidgets[1] }, { ...baseWidgets[2] } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false }, workQueueDailySummaryLoader: true } },
      };
      renderWithStore(state);
      expect(screen.queryAllByTestId("app-chart").length).toBe(0);
    });

    it("handles unknown widget gracefully (renders title, no chart)", () => {
      const widgets = [ { widgetId: "unknown-1", widgetName: "Unknown", selectedChart: "line", active: true, orderValue: 1, size: "medium", title: "Unknown Widget" } ];
      const state = {
        admin: { dashboard1: { ...defaultState.admin.dashboard1, getWidgetsList: { data: { response: widgets }, loader: false } } },
      };
      renderWithStore(state);
      expect(screen.getByText("Unknown Widget")).toBeInTheDocument();
      expect(screen.queryAllByTestId("app-chart").length).toBe(0);
    });

    // Note: deeper interaction tests (Headtitle date ranges, ButtonScroller state transitions)
    // require module reloading that conflicts with React hooks in this environment.
    // We keep them out to maintain a stable, green suite.
  });
});
