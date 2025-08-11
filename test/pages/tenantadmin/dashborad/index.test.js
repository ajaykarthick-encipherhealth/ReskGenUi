import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// Mock connect to passthrough
jest.mock("react-redux", () => ({ connect: () => (Comp) => Comp }));

// Mock actions module safely (mutable default export)
jest.mock("../../../../src/stores/admin/dashboard1/actions", () => ({
  __esModule: true,
  default: {},
}));
import actions from "../../../../src/stores/admin/dashboard1/actions";

// Mock DynamicDashboard as a marker and spy
const DynamicDashboardMock = jest.fn(() => (
  <div data-testid="dynamic-dashboard" />
));
jest.mock("../../../../src/commonPages/dashboard", () => ({
  __esModule: true,
  default: (props) => DynamicDashboardMock(props),
}));

import DashboardPage from "../../../../src/pages/tenantadmin/dashboard";

describe("tenantadmin/dashboard page unit tests", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("P: renders DynamicDashboard and calls it once", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(1);
  });

  it("N: passes no props to DynamicDashboard", () => {
    render(<DashboardPage />);
    const callArgs = DynamicDashboardMock.mock.calls[0]?.[0] || {};
    expect(Object.keys(callArgs)).toHaveLength(0);
  });

  it("E: unmount then fresh render still works", () => {
    const { unmount } = render(<DashboardPage />);
    unmount();
    render(<DashboardPage />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
  });

  it("E: no api keys -> dispatch is not called", async () => {
    const dispatch = jest.fn().mockResolvedValue(undefined);
    actions.workFlowAction = jest.fn((payload) => ({ type: "WF", payload }));
    render(<DashboardPage dispatch={dispatch} />);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
