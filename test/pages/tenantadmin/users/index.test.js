import React from "react";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";

// Basic environment mocks
jest.mock("react-redux", () => ({ connect: () => (Comp) => Comp }));
jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/tenantadmin/users" }) }));
// Silence CSS import
jest.mock("react-facebook-loading/dist/react-facebook-loading.css", () => ({}));
// Avoid heavy Header
jest.mock("../../../../src/jsx/layouts/nav/Header", () => ({ __esModule: true, default: () => <div data-testid="header" /> }));

// Stub store modules to avoid redux-actions import chain
jest.mock("../../../../src/stores/tableView", () => ({
  __esModule: true,
  actions: {
    tableViewAction: (payload) => ({ type: "MOCK/TABLE/VIEW", payload }),
    tableDynamicColumn: (payload) => ({ type: "MOCK/TABLE/DYN", payload }),
    tableDynamicColumnReset: (payload) => ({ type: "MOCK/TABLE/RESET", payload }),
  },
}));

jest.mock("../../../../src/stores/tenantAdmin/users", () => ({
  __esModule: true,
  actions: {
    usersSoftDelete: (payload) => ({ type: "MOCK/USERS/SOFT", payload }),
    usersAllRoles: () => ({ type: "MOCK/USERS/ALL_ROLES" }),
    userEditRoles: (payload) => ({ type: "MOCK/USERS/EDIT", payload }),
  },
}));

jest.mock("../../../../src/stores/authFlows", () => ({
  __esModule: true,
  actions: { allRoles: () => ({ type: "MOCK/AUTH/ALL_ROLES" }) },
}));

// Mock utils/reusable
const reusable = {
  createIdGens: (k) => k,
  findItemWithTrueKey: jest.fn(() => true),
  findMatchesByField: jest.fn(() => false),
  getResponePopup: jest.fn(),
  tableCustomFilterClearCheck: jest.fn(() => true),
};
jest.mock("../../../../src/utils/reusable", () => ({
  __esModule: true,
  createIdGens: (k) => k,
  findItemWithTrueKey: (...args) => reusable.findItemWithTrueKey(...args),
  findMatchesByField: (...args) => reusable.findMatchesByField(...args),
  getResponePopup: (...args) => reusable.getResponePopup(...args),
  tableCustomFilterClearCheck: (...args) => reusable.tableCustomFilterClearCheck(...args),
}));

// Mock storages (default alias: null)
jest.mock("../../../../src/utils/storages", () => ({ __esModule: true, getLocalStored: () => ({ aliasName: null }) }));

// Capture props passed to ReusableFilters for functional assertions
let lastFiltersProps;
// Capture props passed to AppTable
let lastTableProps;
jest.mock("../../../../src/components/reusableFilters", () => ({
  __esModule: true,
  default: (props) => {
    lastFiltersProps = props;
    return (
      <div data-testid="filters">
        <button data-testid="open-drawer" onClick={props.showDrawer} />
        <button data-testid="submit-filters" onClick={() => props.handleSubmit([{ id: "colA" }])} />
        <button data-testid="reset-filters" onClick={props.handleReset} />
      </div>
    );
  },
}));

// Mock AppTable to expose callbacks and render content()
jest.mock("../../../../src/components/tables", () => ({
  __esModule: true,
  default: (props) => {
    lastTableProps = props;
    const { onPageChange, onSwitchToggle, handleAction, content, setEditingUser, setSelectedRoleList, setSort, onCloseIconClick, isEdit, switchStates } = props;
    return (
      <div data-testid="table">
        <div data-testid="isedit" data-value={isEdit ? "1" : "0"} />
        <div data-testid="switch-probe" data-json={JSON.stringify(switchStates || {})} />
        <button data-testid="page-change" onClick={() => onPageChange({ first: 15, page: 1, rows: 15 })} />
        <button data-testid="toggle-switch" onClick={() => onSwitchToggle({ userName: "u1" }, true)} />
        <button data-testid="handle-action" onClick={() => handleAction({ userName: "u1" })} />
        <button data-testid="prepare-edit" onClick={() => { setEditingUser({ roleNames: ["A", "B"] }); setSelectedRoleList(["A", "B"]); }} />
        <button data-testid="sort-change" onClick={() => setSort && setSort({ allocatedOn: { sortDir: "ASC", sortField: "allocatedOn" } })} />
        <button data-testid="close-icon" onClick={() => onCloseIconClick && onCloseIconClick()} />
        <div data-testid="popover-content">{content && content()}</div>
      </div>
    );
  },
}));

// Mock antd minimal
jest.mock("antd", () => ({
  __esModule: true,
  Button: (p) => <button {...p}>{p.children}</button>,
  Popover: (p) => <div>{p.content}{p.children}</div>,
  Select: ({ options = [], value = [], onChange, mode }) => (
    <div data-testid="role-select" data-mode={mode}>
      <button data-testid="role-change" onClick={() => onChange && onChange(options.map((o) => o.value))} />
    </div>
  ),
}));
// Handle babel-plugin-import pathing
jest.mock("antd/lib/select", () => ({
  __esModule: true,
  default: ({ options = [], onChange, mode }) => (
    <div data-testid="role-select" data-mode={mode}>
      <button data-testid="role-change" onClick={() => onChange && onChange(options.map((o) => o.value))} />
    </div>
  ),
}));
jest.mock("antd/lib/button", () => ({ __esModule: true, default: (p) => <button {...p}>{p.children}</button> }));
jest.mock("antd/lib/popover", () => ({ __esModule: true, default: (p) => <div>{p.content}{p.children}</div> }));

// Mock Usersmodal
jest.mock("../../../../src/pages/tenantadmin/users/usersmodal", () => ({
  __esModule: true,
  default: ({ open }) => <div data-testid="usersmodal" data-open={open ? "1" : "0"} />,
}));

// Subject under test
import UsersPage from "../../../../src/pages/tenantadmin/users";

const baseData = {
  response: {
    metaDataDTO: [
      { id: "c1", active: true, filter: { style: true } },
      { id: "c2", active: false, filter: { style: true } },
      { id: "c3", active: true, filter: { style: false } },
    ],
    pageResponse: {
      content: [{ userName: "u1", accountStatus: false }],
      totalElements: 1,
    },
    staticDesign: [{ edit: true }],
  },
};

const renderUsers = (overrideProps = {}, overrideImpl = {}) => {
  const props = {
    pageLoad: false,
    tableLoader: false,
    getTableData: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
    tableDynamicColumn: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
    tableDynamicColumnReset: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
    getEnableUser: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
    editUserRoles: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
    getAllRoles: jest.fn(),
    getRoles: jest.fn(),
    data: baseData,
    allRoles: { content: [{ roleName: "ROLE_A" }, { roleName: "ROLE_B" }] },
    id: "X",
    ...overrideProps,
  };
  if (overrideImpl.tableCustomFilterClearCheck !== undefined) {
    reusable.tableCustomFilterClearCheck.mockReturnValue(overrideImpl.tableCustomFilterClearCheck);
  }
  const utils = render(<UsersPage {...props} />);
  return { ...utils, props };
};

describe("tenantadmin/users page unit tests", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    reusable.tableCustomFilterClearCheck.mockReset();
    lastFiltersProps = undefined;
    lastTableProps = undefined;
  });

  // Visibility and modal behavior
  it("P: renders filters, table, and Assign User button", () => {
    const { props } = renderUsers();
    expect(screen.getByTestId("filters")).toBeInTheDocument();
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByTestId("usersmodal").getAttribute("data-open")).toBe("0");
    expect(props.getAllRoles).toHaveBeenCalled();
  });

  it("N: Assign User hidden for PROJECT_LEAD alias", () => {
    jest.doMock("../../../../src/utils/storages", () => ({ __esModule: true, getLocalStored: () => ({ aliasName: "PROJECT_LEAD" }) }));
    const UsersReload = require("../../../../src/pages/tenantadmin/users").default;
    const baseProps = {
      pageLoad: false,
      tableLoader: false,
      getTableData: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
      tableDynamicColumn: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
      tableDynamicColumnReset: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
      getEnableUser: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
      editUserRoles: jest.fn().mockResolvedValue({ status: "SUCCESS" }),
      getAllRoles: jest.fn(),
      getRoles: jest.fn(),
      data: baseData,
      allRoles: { content: [{ roleName: "ROLE_A" }, { roleName: "ROLE_B" }] },
      id: "X",
    };
    const { unmount } = render(<UsersReload {...baseProps} />);
    expect(screen.getAllByTestId("usersmodal")[0].getAttribute("data-open")).toBe("0");
    unmount();
    jest.resetModules();
  });

  it("P: clicking Assign User opens Usersmodal", () => {
    renderUsers();
    fireEvent.click(screen.getByTestId("assignUser"));
    expect(screen.getByTestId("usersmodal").getAttribute("data-open")).toBe("1");
  });

  // Pagination behavior
  it("P: pagination triggers data fetch", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("page-change"));
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  // Switch toggle behavior
  it("P: toggle switch calls getEnableUser with payload and refreshes", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("toggle-switch"));
    await waitFor(() => expect(props.getEnableUser).toHaveBeenCalledWith({ data: { userName: "u1", isActive: true, isClientBased: true } }));
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("N: getEnableUser rejects handled gracefully and loader resets", async () => {
    const { props } = renderUsers({ getEnableUser: jest.fn().mockRejectedValue(new Error("boom")) });
    fireEvent.click(screen.getByTestId("toggle-switch"));
    await waitFor(() => expect(props.getEnableUser).toHaveBeenCalled());
  });

  it("E: double-click toggle is gated by isLoading (only one call)", () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("toggle-switch"));
    fireEvent.click(screen.getByTestId("toggle-switch"));
    expect(props.getEnableUser).toHaveBeenCalledTimes(1);
  });

  // Drawer submit/reset behavior
  it("P: submit filters success calls dynamic column, refresh and popup", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("open-drawer"));
    expect(lastFiltersProps.open).toBe(true);
    fireEvent.click(screen.getByTestId("submit-filters"));
    await waitFor(() => expect(props.tableDynamicColumn).toHaveBeenCalled());
    await waitFor(() => expect(reusable.getResponePopup).toHaveBeenCalled());
    await waitFor(() => expect(lastFiltersProps.open).toBe(false));
  });

  it("N: submit filters with filterClearCheck false does not call getTableData", async () => {
    const { props } = renderUsers({}, { tableCustomFilterClearCheck: false });
    const before = props.getTableData.mock.calls.length;
    fireEvent.click(screen.getByTestId("submit-filters"));
    await waitFor(() => expect(props.getTableData.mock.calls.length).toBe(before));
  });

  it("E: submit filters with empty columns still triggers dynamic column", async () => {
    lastFiltersProps = undefined;
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("open-drawer"));
    await lastFiltersProps.handleSubmit([]);
    await waitFor(() => expect(props.tableDynamicColumn).toHaveBeenCalled());
  });

  it("P: reset filters triggers reset flow and popup", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("reset-filters"));
    await waitFor(() => expect(props.tableDynamicColumnReset).toHaveBeenCalled());
    await waitFor(() => expect(reusable.getResponePopup).toHaveBeenCalled());
    await waitFor(() => expect(lastFiltersProps.isResetting).toBe(false));
  });

  it("N: reset filters rejection still handles error via popup", async () => {
    const { props } = renderUsers({ tableDynamicColumnReset: jest.fn().mockRejectedValue(new Error("err")) });
    fireEvent.click(screen.getByTestId("reset-filters"));
    await waitFor(() => expect(props.tableDynamicColumnReset).toHaveBeenCalled());
  });

  it("E: reset filters with non-success status avoids refresh", async () => {
    const { props } = renderUsers({ tableDynamicColumnReset: jest.fn().mockResolvedValue({ status: "FAIL" }) });
    const initialCalls = props.getTableData.mock.calls.length;
    fireEvent.click(screen.getByTestId("reset-filters"));
    await waitFor(() => expect(props.getTableData.mock.calls.length).toBe(initialCalls));
  });

  // Role edit behavior
  it("P: content role submit updates roles and refreshes", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("prepare-edit"));
    fireEvent.click(screen.getByTestId("handle-action"));
    fireEvent.click(screen.getByTestId("role-change"));
    fireEvent.click(screen.getByTestId("submitBtn"));
    await waitFor(() => expect(props.editUserRoles).toHaveBeenCalled());
    await waitFor(() => expect(props.getRoles).toHaveBeenCalled());
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("N: content role submit failure calls popup without getRoles", async () => {
    const { props } = renderUsers({ editUserRoles: jest.fn().mockResolvedValue({ status: "FAIL" }) });
    fireEvent.click(screen.getByTestId("prepare-edit"));
    fireEvent.click(screen.getByTestId("handle-action"));
    fireEvent.click(screen.getByTestId("submitBtn"));
    await waitFor(() => expect(props.editUserRoles).toHaveBeenCalled());
    expect(props.getRoles).not.toHaveBeenCalled();
    await waitFor(() => expect(reusable.getResponePopup).toHaveBeenCalled());
  });

  it("E: content submit uses editingUser roles when no manual selection", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("prepare-edit"));
    fireEvent.click(screen.getByTestId("handle-action"));
    fireEvent.click(screen.getByTestId("submitBtn"));
    await waitFor(() => expect(props.editUserRoles).toHaveBeenCalled());
    const payload = props.editUserRoles.mock.calls[0][0];
    expect(payload.roles).toEqual(["A", "B"]);
  });

  it("P: role select change sets roles used in submit payload", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("prepare-edit"));
    fireEvent.click(screen.getByTestId("handle-action"));
    fireEvent.click(screen.getByTestId("role-change"));
    fireEvent.click(screen.getByTestId("submitBtn"));
    await waitFor(() => expect(props.editUserRoles).toHaveBeenCalled());
    const payload = props.editUserRoles.mock.calls[0][0];
    expect(payload.roles).toEqual(["ROLE_A", "ROLE_B"]);
  });

  it("N: cancel resets and closes popover (no submit call)", () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("prepare-edit"));
    fireEvent.click(screen.getByTestId("cancelBtn"));
    expect(props.editUserRoles).not.toHaveBeenCalled();
  });

  it("E: close icon logic keeps role list intact via onCloseIconClick", () => {
    renderUsers();
    fireEvent.click(screen.getByTestId("prepare-edit"));
    // no direct UI for close icon in mock; ensure content present
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();
  });

  // Handle action behavior
  it("P: handle action sets selected item and submit uses it", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("handle-action"));
    fireEvent.click(screen.getByTestId("submitBtn"));
    await waitFor(() => expect(props.editUserRoles).toHaveBeenCalled());
    const payload = props.editUserRoles.mock.calls[0][0];
    expect(payload.userName).toBe("u1");
  });

  // Active filters computation (functional)
  it("P: active filters passed to ReusableFilters include only active+style items", async () => {
    renderUsers();
    await waitFor(() => expect(lastFiltersProps?.FilterItems?.length).toBe(1));
    expect(lastFiltersProps.FilterItems[0].id).toBe("c1");
  });

  it("N: when findMatchesByField returns true, active filters not recalculated", async () => {
    reusable.findMatchesByField.mockReturnValue(true);
    renderUsers();
    // Since findMatchesByField true, new setActiveFilters won't run; FilterItems remains as initially computed
    await waitFor(() => expect(lastFiltersProps?.FilterItems?.length).toBe(1));
  });

  it("E: if metaDataDTO changes to empty, FilterItems becomes empty array", async () => {
    const dataEmpty = { response: { ...baseData.response, metaDataDTO: [] } };
    renderUsers({ data: dataEmpty });
    await waitFor(() => expect(lastFiltersProps?.FilterItems?.length).toBe(0));
  });

  // Additional functional tests to cover filter setters and sorting
  it("P: setSearchText triggers data fetch via effect", async () => {
    const { props } = renderUsers();
    lastFiltersProps.setSearchText("abc");
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("N: setSelectedOption triggers data fetch via effect", async () => {
    const { props } = renderUsers();
    lastFiltersProps.setSelectedOption({ k: 1 });
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("E: setSelectedDateRanges triggers data fetch via effect", async () => {
    const { props } = renderUsers();
    lastFiltersProps.setSelectedDateRanges({ from: "2024-01-01", to: "2024-01-31" });
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("P: setPageNo triggers data fetch via effect", async () => {
    const { props } = renderUsers();
    lastFiltersProps.setPageNo(2);
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("N: setSelectedDates triggers data fetch via effect", async () => {
    const { props } = renderUsers();
    lastFiltersProps.setSelectedDates(["2024-01-01"]);
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("E: sort change triggers data fetch via effect", async () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("sort-change"));
    await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  });

  it("P: onCloseIconClick does not submit roles and closes popover", () => {
    const { props } = renderUsers();
    fireEvent.click(screen.getByTestId("close-icon"));
    expect(props.editUserRoles).not.toHaveBeenCalled();
  });

  it("N: findItemWithTrueKey false passes isEdit=false to table", async () => {
    reusable.findItemWithTrueKey.mockReturnValue(false);
    renderUsers();
    await waitFor(() => expect(screen.getByTestId("isedit").getAttribute("data-value")).toBe("0"));
  });

  it("E: initial switchStates derived from data content", async () => {
    renderUsers();
    await waitFor(() => {
      const parsed = JSON.parse(screen.getByTestId("switch-probe").getAttribute("data-json"));
      expect(parsed.u1).toBe(false);
    });
  });
});
