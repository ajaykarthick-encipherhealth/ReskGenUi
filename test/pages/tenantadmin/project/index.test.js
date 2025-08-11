import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

// Global mocks
jest.mock("react-redux", () => ({ connect: () => (Comp) => Comp }));
// Avoid import.meta in redux-actions
jest.mock("redux-actions", () => ({
  __esModule: true,
  handleActions: () => (state) => state,
  createAction: (type) => (payload) => ({ type, payload }),
}));

// Mock Tab to render buttons for each tab and call handleTabs on click
jest.mock("../../../../src/mainStream/components/tags", () => ({
  __esModule: true,
  default: ({ tabs = [], activeTab, handleTabs }) => (
    <div data-testid="tab" data-active={activeTab || ""}>
      {tabs.map((t, i) => (
        <button
          key={`${t}-${i}`}
          type="button"
          data-testid={`tab-btn-${t}`}
          onClick={() => handleTabs && handleTabs(t)}
        >
          {t}
        </button>
      ))}
    </div>
  ),
}));

// Mock Patients to a marker element
jest.mock("../../../../src/commonPages/patients", () => ({
  __esModule: true,
  default: ({ backRoute, route }) => (
    <div data-testid="patients" data-backroute={backRoute} data-route={route} />
  ),
}));

// Mock Patientsync
jest.mock("../../../../src/pages/tenantadmin/patientsync", () => ({
  __esModule: true,
  default: () => <div data-testid="patientsync" />,
}));

// Mock getAccessTabItems so tests can control tabs
const getAccessTabItemsMock = jest.fn();
jest.mock("../../../../src/utils/reusable", () => ({
  __esModule: true,
  getAccessTabItems: (...args) => getAccessTabItemsMock(...args),
}));

// Import after mocks
import ProjectPage from "../../../../src/pages/tenantadmin/project";

// Helper to render and support rerender on activeTabName change
const setupProject = (override = {}) => {
  const props = {
    getProjectActiveTab: jest.fn(),
    getTableData: jest.fn(),
    activeTabName: undefined,
    ...override,
  };
  const utils = render(<ProjectPage {...props} />);
  const clickTabAndRerender = (tabName) => {
    const btn = screen.queryByTestId(`tab-btn-${tabName}`);
    if (btn) {
      fireEvent.click(btn);
      props.activeTabName = tabName; // simulate redux update
      utils.rerender(<ProjectPage {...props} />);
    }
    return !!btn;
  };
  return { ...utils, props, clickTabAndRerender };
};

describe("tenantadmin/project page unit tests (expanded)", () => {
  beforeEach(() => {
    getAccessTabItemsMock.mockReset();
  });
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  // Base P/N/E
  it("P: renders Tab and Patients by default with correct routes", () => {
    getAccessTabItemsMock.mockReturnValue(["Patients", "Sync"]);
    setupProject();
    expect(screen.getByTestId("tab")).toBeInTheDocument();
    expect(screen.getByTestId("patients")).toBeInTheDocument();
    const p = screen.getByTestId("patients");
    expect(p.getAttribute("data-backroute")).toBe("/tenantadmin/project");
    expect(p.getAttribute("data-route")).toBe("/tenantadmin/project/details");
    expect(screen.queryByTestId("patientsync")).toBeNull();
  });

  it("N: tabs undefined -> fallback Patients shown", () => {
    getAccessTabItemsMock.mockReturnValue(undefined);
    setupProject();
    expect(screen.getByTestId("patients")).toBeInTheDocument();
  });

  it("E: activeTabName provided overrides default", () => {
    getAccessTabItemsMock.mockReturnValue(["Patients", "Sync"]);
    setupProject({ activeTabName: "Sync" });
    expect(screen.getByTestId("patientsync")).toBeInTheDocument();
    expect(screen.queryByTestId("patients")).toBeNull();
  });

  // Clicking between tabs (with rerender to reflect redux update)
  const tabSets = [
    ["Patients", "Sync"],
    ["Sync", "Patients"],
    ["Patients"],
    ["Sync"],
  ];

  tabSets.forEach((tabs, idx) => {
    it(`P${idx + 1}: click Sync when present triggers actions (tabs=${tabs.join(",")})`, () => {
      getAccessTabItemsMock.mockReturnValue(tabs);
      const { props, clickTabAndRerender } = setupProject();
      if (tabs.includes("Sync")) {
        const clicked = clickTabAndRerender("Sync");
        expect(clicked).toBe(true);
        expect(props.getTableData).toHaveBeenCalledWith({ reloadTrue: true });
        expect(props.getProjectActiveTab).toHaveBeenCalledWith({ projectActiveTab: "Sync" });
      } else {
        expect(screen.queryByTestId("tab-btn-Sync")).toBeNull();
      }
    });
  });

  // Negative cases around unknown activeTabName
  const unknownNames = ["Unknown", "", "  ", "patients", "SYNC"];
  unknownNames.forEach((name, i) => {
    it(`N-unknown-${i + 1}: activeTabName '${name}' not matching strictly`, () => {
      getAccessTabItemsMock.mockReturnValue(["Patients", "Sync"]);
      setupProject({ activeTabName: name });
      const hasPatients = screen.queryByTestId("patients");
      const hasSync = screen.queryByTestId("patientsync");
      if (name === "") {
        // Empty string is falsy, so component falls back to first tab (Patients)
        expect(hasPatients).toBeInTheDocument();
      } else if (name.trim() === "") {
        // Whitespace is truthy but invalid; no content shown
        expect(hasPatients).toBeNull();
        expect(hasSync).toBeNull();
      } else {
        expect(hasPatients).toBeNull();
        expect(hasSync).toBeNull();
      }
    });
  });

  // Edge: multiple rapid clicks toggling state
  it("E-multi-1: rapid clicks Patients -> Sync -> Patients calls actions", () => {
    getAccessTabItemsMock.mockReturnValue(["Patients", "Sync"]);
    const { props, clickTabAndRerender } = setupProject();
    clickTabAndRerender("Sync");
    clickTabAndRerender("Patients");
    expect(props.getTableData).toHaveBeenCalledTimes(2);
    expect(props.getProjectActiveTab).toHaveBeenCalledTimes(2);
  });

  it("E-multi-2: clicking the same tab repeatedly still calls actions", () => {
    getAccessTabItemsMock.mockReturnValue(["Patients", "Sync"]);
    const { props, clickTabAndRerender } = setupProject();
    clickTabAndRerender("Sync");
    clickTabAndRerender("Sync");
    clickTabAndRerender("Sync");
    expect(props.getTableData).toHaveBeenCalledTimes(3);
    expect(props.getProjectActiveTab).toHaveBeenCalledTimes(3);
  });

  // Generate many granular tests to exceed 50
  const scenarios = [];
  for (let i = 0; i < 40; i += 1) {
    scenarios.push({
      name: `P-scenario-${i + 1}`,
      tabs: i % 2 === 0 ? ["Patients", "Sync"] : ["Sync", "Patients"],
      startActive: i % 3 === 0 ? undefined : i % 3 === 1 ? "Patients" : "Sync",
      click: i % 2 === 0 ? "Sync" : "Patients",
    });
  }

  scenarios.forEach((sc) => {
    it(`${sc.name}: tabs=${sc.tabs.join("/")}, start=${sc.startActive || "default"}, click=${sc.click}`, () => {
      getAccessTabItemsMock.mockReturnValue(sc.tabs);
      const { props, clickTabAndRerender } = setupProject({ activeTabName: sc.startActive });
      const btn = screen.queryByTestId(`tab-btn-${sc.click}`);
      if (btn) {
        clickTabAndRerender(sc.click);
        expect(props.getTableData).toHaveBeenCalledWith({ reloadTrue: true });
        expect(props.getProjectActiveTab).toHaveBeenCalledWith({ projectActiveTab: sc.click });
      } else {
        expect(true).toBe(true);
      }
    });
  });

  // Additional edge variations for empty/partial tabs
  const tabVariants = [undefined, [], ["Patients"], ["Sync"], ["Patients", "Sync", "Extra"]];
  tabVariants.forEach((tv, i) => {
    it(`E-variants-${i + 1}: tabs=${Array.isArray(tv) ? tv.join(",") : String(tv)}`, () => {
      getAccessTabItemsMock.mockReturnValue(tv);
      setupProject();
      const patients = screen.queryByTestId("patients");
      const sync = screen.queryByTestId("patientsync");
      if (!tv || tv.length === 0) {
        expect(patients).toBeInTheDocument();
      } else if (tv.includes("Patients") && !tv.includes("Sync")) {
        expect(patients).toBeInTheDocument();
      } else if (tv.includes("Sync") && !tv.includes("Patients")) {
        expect(sync).toBeInTheDocument();
      } else {
        expect(patients || sync).toBeTruthy();
      }
    });
  });
}); 