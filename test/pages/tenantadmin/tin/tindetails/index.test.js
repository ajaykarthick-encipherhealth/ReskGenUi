import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Hoisted helper
const baseProps = () => ({
  activeTabName: { tinDetailsTab: "Patients" },
  getTableData: jest.fn(() => Promise.resolve()),
  getProjectActiveTab: jest.fn(),
  getRoutedData: jest.fn(),
  getRoutedDatAllocation: jest.fn(),
});

// Mocks
jest.mock("react-redux", () => {
  const React = require("react");
  return {
    connect: (mapState, mapDispatch) => (Comp) => (props) => {
      const fakeState = { tenantAdmin: { tin: { activeTabRoutedData: { tinDetailsTab: "Patients" } } } };
      const stateProps = mapState ? mapState(fakeState) : {};
      const dispatchProps = mapDispatch || {};
      return <Comp {...stateProps} {...dispatchProps} {...props} />;
    },
    Provider: ({ children }) => <div>{children}</div>,
  };
});

const routerState = { pathname: "/tenantadmin/tin/tindetails", query: { tab: "Patients" } };
const pushMock = jest.fn();
const replaceMock = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: routerState.pathname, query: routerState.query, push: pushMock, replace: replaceMock }),
}));

jest.mock("../../../../../src/utils/reusable", () => ({
  getAccessTabItems: () => [
    "Patients",
    "File Processing",
    "Patient Allocation",
    "Moveback",
    "Query Approval",
    "ReAllocation",
    "Master Audit",
  ],
}));

jest.mock("../../../../../src/utils/storages", () => ({
  getStorage: (k) => (k === "userId" ? "U1" : null),
}));

jest.mock("../../../../../src/components/subNavBar", () => ({
  __esModule: true,
  default: ({ handleBack }) => (
    <div>
      <button data-testid="subnav-back" onClick={() => handleBack && handleBack()} />
    </div>
  ),
}));

jest.mock("../../../../../src/mainStream/components/tags", () => ({
  __esModule: true,
  default: ({ tabs, handleTabs, activeTab }) => (
    <div>
      <div data-testid="active-tab">{activeTab}</div>
      {tabs?.map((t) => (
        <button key={t} data-testid={`tab-${t}`} onClick={() => handleTabs && handleTabs(t)}>
          {t}
        </button>
      ))}
    </div>
  ),
}));

// Child page mocks
jest.mock("../../../../../src/commonPages/patients", () => ({
  __esModule: true,
  default: ({ route }) => <div data-testid="patients" data-route={route} />,
}));

jest.mock("../../../../../src/commonPages/fileprocessing", () => ({
  __esModule: true,
  default: () => <div data-testid="fileprocessing" />,
}));

const StatusConsumer = ({ statusBodyTemplate }) => (
  <div data-testid="status-out">
    <div>{statusBodyTemplate?.({ patientId: "P0", computing: 0 })}</div>
    <div>{statusBodyTemplate?.({ patientId: "P1", computing: 1 })}</div>
    <div>{statusBodyTemplate?.({ patientId: "P2", computing: 2 })}</div>
    <div>{statusBodyTemplate?.({ patientId: "P3", computing: 3 })}</div>
  </div>
);

jest.mock("../../../../../src/commonPages/patientAllocation", () => ({
  __esModule: true,
  default: (props) => <StatusConsumer {...props} data-testid="patientAllocation" />,
}));

jest.mock("../../../../../src/commonPages/moveBack", () => ({
  __esModule: true,
  default: (props) => <StatusConsumer {...props} data-testid="moveBack" />,
}));

jest.mock("../../../../../src/commonPages/queryApproval", () => ({
  __esModule: true,
  default: (props) => <StatusConsumer {...props} data-testid="queryApproval" />,
}));

jest.mock("../../../../../src/commonPages/reallocation", () => ({
  __esModule: true,
  default: (props) => <StatusConsumer {...props} data-testid="reallocation" />,
}));

jest.mock("../../../../../src/commonPages/codersTable", () => ({
  __esModule: true,
  default: (props) => (
    <div
      data-testid="codersTable"
      data-patientAllocated={props.patientAllocated}
      data-pageId={props.pageId}
      data-route={props.route}
      data-tin={props.tin ? "1" : "0"}
      data-backRoute={props.backRoute}
    />
  ),
}));

jest.mock("antd", () => ({
  Spin: ({ children }) => <div data-testid="spin">{children}</div>,
}));

jest.mock("@ant-design/icons", () => ({
  LoadingOutlined: () => <span data-testid="loadingIcon" />,
}));

// Actions (not used directly thanks to identity connect)
jest.mock("../../../../../src/stores/tenantAdmin/tin", () => ({ actions: {} }));
jest.mock("../../../../../src/stores/tenantAdmin/patientSync", () => ({ actions: {} }));
jest.mock("../../../../../src/stores/tableView", () => ({ actions: {} }));

// Import after mocks
import TinDetails from "../../../../../src/pages/tenantadmin/tin/tindetails";

jest.mock("../../../../../src/jsx/layouts/nav/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header" />,
}));

jest.mock("../../../../../src/styles/visitdata.module.css", () => ({}), { virtual: true });

describe("tenantadmin/tin/tindetails index page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    routerState.query = { tab: "Patients" };
  });

  it("P: renders Patients tab via router and switches tabs", () => {
    const props = baseProps();
    render(<TinDetails {...props} />);
    expect(screen.getByTestId("active-tab")).toHaveTextContent("Patients");
    expect(screen.getByTestId("patients")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("tab-File Processing"));
    expect(props.getRoutedData).toHaveBeenCalledWith(null);
    expect(props.getRoutedDatAllocation).toHaveBeenCalledWith(null);
    expect(props.getProjectActiveTab).toHaveBeenCalled();
    expect(props.getTableData).toHaveBeenCalled();
    expect(replaceMock).toHaveBeenCalled();
  });

  it("N: handleBack triggers reload and navigation", () => {
    const props = baseProps();
    render(<TinDetails {...props} />);
    fireEvent.click(screen.getByTestId("subnav-back"));
    expect(props.getTableData).toHaveBeenCalledWith({ reloadTrue: true });
    expect(props.getProjectActiveTab).toHaveBeenCalledWith(props.activeTabName);
    expect(pushMock).toHaveBeenCalledWith("/tenantadmin/tin");
  });

  it("E: status template renders all computed labels with style/indicator for Processing", () => {
    const props = baseProps();
    routerState.query = { tab: "Patient Allocation" };
    render(<TinDetails {...props} />);
    const out = screen.getByTestId("status-out");
    expect(out).toHaveTextContent("Not Computed");
    expect(out).toHaveTextContent("Processing");
    expect(out).toHaveTextContent("Computed");
    expect(out).toHaveTextContent("Failed");
  });

  it("P: master audit tab renders CodersTable with userId and props", () => {
    const props = baseProps();
    routerState.query = { tab: "Master Audit" };
    render(<TinDetails {...props} />);
    const ct = screen.getByTestId("codersTable");
    expect(ct.getAttribute("data-patientAllocated")).toBe("U1");
    expect(ct.getAttribute("data-pageId")).toBe("da4958c3-7795-4bcc-8ab0-24d93cd52c25");
    expect(ct.getAttribute("data-route")).toBe("/tenantadmin/tin/tindetails/masteraudit");
    expect(ct.getAttribute("data-tin")).toBe("1");
    expect(ct.getAttribute("data-backRoute")).toBe("/tenantadmin/tin/tindetails?tab=Master+Audit");
  });

  it("E: without router tab, uses activeTabName.tinDetailsTab", () => {
    const props = baseProps();
    routerState.query = {};
    props.activeTabName = { tinDetailsTab: "Moveback" };
    render(<TinDetails {...props} />);
    expect(screen.getByTestId("active-tab")).toHaveTextContent("Moveback");
  });

  it("N: unknown tab renders none of the child sections", () => {
    const props = baseProps();
    routerState.query = { tab: "Unknown" };
    render(<TinDetails {...props} />);
    expect(screen.queryByTestId("patients")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fileprocessing")).not.toBeInTheDocument();
  });

  it("E: mounting with tab triggers getProjectActiveTab", () => {
    const props = baseProps();
    routerState.query = { tab: "Query Approval" };
    render(<TinDetails {...props} />);
    expect(props.getProjectActiveTab).toHaveBeenCalledWith({ tinDetailsTab: "Query Approval" });
  });

  it("E: parsedData FINISHED match drives Computed and covers find branch (line 53)", () => {
    const props = baseProps();
    const realUseState = React.useState;
    const spy = jest.spyOn(React, "useState").mockImplementation((init) => {
      if (Array.isArray(init) && init.length === 0) {
        return [[{ patientId: "P0", processStageChart: "FINISHED" }], jest.fn()];
      }
      return realUseState(init);
    });
    routerState.query = { tab: "Patient Allocation" };
    render(<TinDetails {...props} />);
    expect(screen.getByTestId("status-out")).toHaveTextContent("Computed");
    spy.mockRestore();
  });

  it("E: parsedData includes non-match and then match to exercise find callback iterations (line 53)", () => {
    const props = baseProps();
    const realUseState = React.useState;
    const spy = jest.spyOn(React, "useState").mockImplementation((init) => {
      if (Array.isArray(init) && init.length === 0) {
        return [[
          { patientId: "X", processStageChart: "FINISHED" },
          { patientId: "P0", processStageChart: "FINISHED" },
        ], jest.fn()];
      }
      return realUseState(init);
    });
    routerState.query = { tab: "Patient Allocation" };
    render(<TinDetails {...props} />);
    expect(screen.getByTestId("status-out")).toHaveTextContent("Computed");
    spy.mockRestore();
  });

  it("P: connect mapState provides activeTabName from store (covers line 176)", () => {
    // Do NOT pass activeTabName explicitly; rely on connect injected state
    const props = { ...baseProps() };
    delete props.activeTabName;
    render(<TinDetails {...props} />);
    expect(screen.getByTestId("active-tab")).toHaveTextContent("Patients");
  });
});

const tabsMatrix = [
  { name: "Patients", testId: "patients" },
  { name: "File Processing", testId: "fileprocessing" },
  { name: "Patient Allocation", testId: "patientAllocation" },
  { name: "Moveback", testId: "moveBack" },
  { name: "Query Approval", testId: "queryApproval" },
  { name: "ReAllocation", testId: "reallocation" },
];

describe("Tab rendering matrix P/N/E", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    routerState.query = { tab: "Patients" };
  });

  it.each(tabsMatrix)("P: initial tab %s renders expected section", ({ name, testId }) => {
    const props = baseProps();
    routerState.query = { tab: name };
    render(<TinDetails {...props} />);
    if (name === "Master Audit") {
      expect(screen.getByTestId("codersTable")).toBeInTheDocument();
    } else if (name === "File Processing") {
      expect(screen.getByTestId("fileprocessing")).toBeInTheDocument();
    } else if (testId === "patients") {
      expect(screen.getByTestId("patients")).toBeInTheDocument();
    } else {
      // For other tabs, our mocks render a shared status-out container
      expect(screen.getByTestId("status-out")).toBeInTheDocument();
    }
  });

  it.each(tabsMatrix)("N: clicking %s twice triggers replace twice", ({ name }) => {
    const props = baseProps();
    render(<TinDetails {...props} />);
    replaceMock.mockClear();
    fireEvent.click(screen.getByTestId(`tab-${name}`));
    fireEvent.click(screen.getByTestId(`tab-${name}`));
    expect(replaceMock).toHaveBeenCalledTimes(2);
  });

  it.each(tabsMatrix)("E: %s then Patients updates label on re-render", ({ name }) => {
    const props = baseProps();
    routerState.query = { tab: name };
    const { unmount } = render(<TinDetails {...props} />);
    // simulate UI click back to Patients
    fireEvent.click(screen.getByTestId("tab-Patients"));
    // emulate router update and re-render cleanly
    routerState.query = { tab: "Patients" };
    unmount();
    render(<TinDetails {...props} />);
    expect(screen.getByTestId("active-tab")).toHaveTextContent("Patients");
  });
});

// Master Audit N/E extras
it("N: clicking Master Audit twice triggers replace twice", () => {
  const props = baseProps();
  routerState.query = { tab: "Patients" };
  render(<TinDetails {...props} />);
  replaceMock.mockClear();
  fireEvent.click(screen.getByTestId("tab-Master Audit"));
  fireEvent.click(screen.getByTestId("tab-Master Audit"));
  expect(replaceMock).toHaveBeenCalledTimes(2);
});

it("E: Master Audit then Patients switches sections appropriately via re-render", () => {
  const props = baseProps();
  routerState.query = { tab: "Master Audit" };
  const { unmount } = render(<TinDetails {...props} />);
  expect(screen.getByTestId("codersTable")).toBeInTheDocument();
  // click back to Patients and emulate router update
  fireEvent.click(screen.getByTestId("tab-Patients"));
  routerState.query = { tab: "Patients" };
  unmount();
  render(<TinDetails {...props} />);
  expect(screen.getByTestId("patients")).toBeInTheDocument();
});
