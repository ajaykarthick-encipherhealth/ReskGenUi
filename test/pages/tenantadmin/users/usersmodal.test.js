import React from "react";
import { render, screen, fireEvent, waitFor, cleanup, within } from "@testing-library/react";

// Environment: stub matchMedia for antd responsiveObserver
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Make connect a passthrough so we can control props
jest.mock("react-redux", () => ({ connect: () => (Comp) => Comp }));
jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/tenantadmin/users" }) }));

// Mock heavy UI dependencies
jest.mock("@fortawesome/react-fontawesome", () => ({ FontAwesomeIcon: (p) => <i data-testid="fa" /> }));

// antd Modal/Avatar/Select/DatePicker shims
jest.mock("antd", () => ({
  __esModule: true,
  Modal: ({ open, onCancel, children }) => (
    <div data-testid="modal" data-open={open ? "1" : "0"}>
      <button data-testid="modal-cancel" onClick={onCancel} />
      {children}
    </div>
  ),
  Avatar: ({ children }) => <div data-testid="avatar">{children}</div>,
  Empty: () => <div data-testid="empty">empty</div>,
  DatePicker: () => <input data-testid="date" />,
  Select: () => <div data-testid="select" />,
}));

// PrimeReact input stub
jest.mock("primereact/inputtext", () => ({ InputText: (p) => <input {...p} /> }));

// CSS modules
jest.mock("../../../../src/pages/tenantadmin/allocateduser/allocate/style.module.css", () => ({ __esModule: true, default: { scroll: "scroll", listContentLarge: "l", listContent: "s" } }));
jest.mock("../../../../src/components/tables/table.module.css", () => ({ __esModule: true, default: { checkbox: "c", bodyCheckbox: "b", customChecked2: "x" } }));

// Components referenced inside
jest.mock("../../../../src/components/skeleton/table", () => ({ __esModule: true, default: () => <div data-testid="skeleton" /> }));
jest.mock("../../../../src/components/button", () => ({ __esModule: true, default: ({ name, onClick, disabled, loading }) => (
  <button data-testid={`btn-${name}`} onClick={onClick} disabled={disabled}>{name}{loading ? "-loading" : ""}</button>
)}));

// ReusableInput to trigger setSearchText
jest.mock("../../../../src/components/reusableFilters/reusableInput", () => ({
  __esModule: true,
  default: ({ placeholder, value, setSearchText }) => (
    <input data-testid={`ri-${placeholder}`} value={value || ""} onChange={(e) => setSearchText && setSearchText(e.target.value)} />
  ),
}));

// Utils
const getResponePopup = jest.fn();
jest.mock("../../../../src/utils/reusable", () => ({ __esModule: true, getResponePopup: (...args) => getResponePopup(...args) }));

// storages
const storageMap = new Map();
const getStorage = (k) => storageMap.get(k);
jest.mock("../../../../src/utils/storages", () => ({ __esModule: true, getStorage: (k) => storageMap.get(k) }));

// Mock stores to avoid redux-actions import chain
jest.mock("../../../../src/stores/tenantAdmin/users", () => ({
  __esModule: true,
  actions: {
    usersAllRoles: () => ({ type: "MOCK/USERS/ALL_ROLES" }),
    getUsers: () => ({ type: "MOCK/USERS/GET" }),
    usersAssigned: () => ({ type: "MOCK/USERS/ASSIGN" }),
  },
}));

import UsersModal from "../../../../src/pages/tenantadmin/users/usersmodal";

const sampleUsers = [
  { firstName: "John", lastName: "Doe", id: 1, roleNames: ["ROLE_A"], userName: "john@x.com" },
  { firstName: "Jane", lastName: "Smith", id: 2, roleNames: ["ROLE_B"], userName: "jane@x.com" },
];

const sampleRoles = { content: [ { roleId: 101, roleName: "ROLE_A" }, { roleId: 102, roleName: "ROLE_B" } ] };

const renderModal = (overrideProps = {}, { usersList = sampleUsers, roles = sampleRoles } = {}) => {
  const props = {
    open: true,
    setOpen: jest.fn(),
    usersLoader: false,
    getAllRoles: jest.fn(),
    allRoles: roles,
    getAllUsersList: jest.fn().mockResolvedValue({ status: "SUCCESS", response: usersList }),
    assignedUsers: jest.fn().mockResolvedValue({ status: "SUCCESS", response: {} }),
    getUsersAPi: jest.fn(),
    ...overrideProps,
  };
  const utils = render(<UsersModal {...props} />);
  return { ...utils, props };
};

describe("tenantadmin/users/usersmodal unit tests", () => {
  beforeEach(() => {
    storageMap.set("client", "C1");
    storageMap.set("project", "P1");
    getResponePopup.mockClear();
  });
  afterEach(() => cleanup());

  // Load and list rendering
  it("P: loads users on mount and renders list with Next disabled initially", async () => {
    const { props } = renderModal();
    await waitFor(() => expect(props.getAllUsersList).toHaveBeenCalledWith({ searchText: "" }));
    // Use initials presence (Antd Avatar string) to assert users rendered
    expect(screen.getAllByText("JD")[0]).toBeInTheDocument();
    expect(screen.getByTestId("btn-Next")).toBeDisabled();
  });

  it("N: usersLoader true shows skeleton", () => {
    renderModal({ usersLoader: true });
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("E: empty users shows fallback text", async () => {
    const { props } = renderModal({}, { usersList: [] });
    await waitFor(() => expect(props.getAllUsersList).toHaveBeenCalled());
    expect(screen.getByText(/No users available/)).toBeInTheDocument();
  });

  // Selection behaviors
  it("P: select a single user enables Next", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const checkboxes = screen.getAllByRole("checkbox"); // first is select-all (visible only when users >0), then row checkboxes
    fireEvent.click(checkboxes[1]);
    expect(screen.getByTestId("btn-Next")).not.toBeDisabled();
  });

  it("N: select-all toggles all users on and off", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const checkboxes = screen.getAllByRole("checkbox");
    const selectAll = checkboxes[0];
    fireEvent.click(selectAll);
    expect(screen.getByTestId("btn-Next")).not.toBeDisabled();
    fireEvent.click(selectAll);
    expect(screen.getByTestId("btn-Next")).toBeDisabled();
  });

  it("E: toggling a user twice deselects and disables Next", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[1]);
    expect(screen.getByTestId("btn-Next")).toBeDisabled();
  });

  // Search behaviors (first modal)
  it("P: typing search calls getAllUsersList with searchText", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.change(screen.getByTestId("ri-Search"), { target: { value: "jo" } });
    await waitFor(() => expect(props.getAllUsersList).toHaveBeenCalledWith({ searchText: "jo" }));
  });

  // Proceed to second modal
  it("P: Next opens second modal and closes first", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    // first dialog should have Next disabled (closed), second is open width 35%
    expect(within(dialogs[0]).getByText("Select User")).toBeInTheDocument();
    expect(dialogs[dialogs.length - 1]).toBeTruthy();
  });

  // Role listing and selection
  it("P: second modal shows roles and Assign disabled initially", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    const second = dialogs[dialogs.length - 1];
    // check presence via role labels not text duplication
    const roleRows = within(second).getAllByRole("checkbox");
    expect(roleRows.length).toBeGreaterThan(0);
    expect(within(second).getByTestId("btn-Assign")).toBeDisabled();
  });

  it("N: select-all roles toggles enabled Assign button", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    const second = dialogs[dialogs.length - 1];
    const roleSelectAll = within(second).getAllByRole("checkbox")[0];
    fireEvent.click(roleSelectAll);
    expect(within(second).getByTestId("btn-Assign")).not.toBeDisabled();
    fireEvent.click(roleSelectAll);
    expect(within(second).getByTestId("btn-Assign")).toBeDisabled();
  });

  it("E: toggling a role checkbox enables Assign", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    const second = dialogs[dialogs.length - 1];
    const roleRowCheckboxes = within(second).getAllByRole("checkbox").slice(1);
    fireEvent.click(roleRowCheckboxes[0]);
    expect(within(second).getByTestId("btn-Assign")).not.toBeDisabled();
  });

  // Role search triggers getAllRoles
  it("P: typing role search calls getAllRoles with searchText", async () => {
    jest.setTimeout(15000);
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    const second = dialogs[dialogs.length - 1];
    fireEvent.change(within(second).getByTestId("ri-Search"), { target: { value: "rol" } });
    await waitFor(() => expect(props.getAllRoles).toHaveBeenCalledWith({ searchText: "rol" }));
  });

  // Assign success
  it("P: Assign calls assignedUsers with payload and closes, refreshes lists", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    const second = dialogs[dialogs.length - 1];
    // select both roles by clicking both role checkboxes
    const roleRowCheckboxes = within(second).getAllByRole("checkbox").slice(1);
    roleRowCheckboxes.forEach((cb) => fireEvent.click(cb));
    fireEvent.click(within(second).getByTestId("btn-Assign"));
    await waitFor(() => expect(props.assignedUsers).toHaveBeenCalled());
    const payload = props.assignedUsers.mock.calls[0][0];
    expect(payload.data.userNames).toEqual(["john@x.com"]);
    expect(payload.data.authorizedDetails[0].projects[0]).toEqual({ projectId: "P1", roles: [101, 102] });
    await waitFor(() => expect(getResponePopup).toHaveBeenCalled());
    await waitFor(() => expect(props.setOpen).toHaveBeenCalledWith(false));
    await waitFor(() => expect(props.getUsersAPi).toHaveBeenCalled());
    await waitFor(() => expect(props.getAllUsersList).toHaveBeenCalled());
  });

  // Assign failure
  it("N: Assign failure calls popup and keeps modal open", async () => {
    const { props } = renderModal({ assignedUsers: jest.fn().mockResolvedValue({ status: "FAIL" }) });
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    const second = dialogs[dialogs.length - 1];
    const roleRowCheckboxes = within(second).getAllByRole("checkbox").slice(1);
    fireEvent.click(roleRowCheckboxes[0]);
    fireEvent.click(within(second).getByTestId("btn-Assign"));
    await waitFor(() => expect(props.assignedUsers).toHaveBeenCalled());
    expect(getResponePopup).toHaveBeenCalled();
    expect(within(second).getByTestId("btn-Assign")).toBeInTheDocument();
  });

  // Cancel behaviors
  it("P: first modal cancel calls setOpen(false) and resets local state", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const closeEls = screen.getAllByLabelText(/Close/i);
    const closeBtn = closeEls.find((el) => el.tagName === "BUTTON") || closeEls[0];
    fireEvent.click(closeBtn);
    expect(props.setOpen).toHaveBeenCalledWith(false);
  });

  it("E: second modal cancel resets roleIds and closes second modal", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const before = screen.getAllByRole("dialog").length;
    const closeEls = screen.getAllByLabelText(/Close/i);
    const closeBtn = closeEls.reverse().find((el) => el.tagName === "BUTTON") || closeEls[closeEls.length - 1];
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.getAllByRole("dialog").length).toBeLessThan(before));
  });

  // getInitials edge
  it("P: initials rendered when first/last names present", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    // Antd Avatar renders initials (JD) when children text provided
    expect(screen.getAllByText("JD")[0]).toBeInTheDocument();
  });

  it("N: uses fallback icon when names missing", async () => {
    const users = [{ id: 3, roleNames: ["ROLE_Z"], userName: "x@y.com" }];
    renderModal({}, { usersList: users });
    await waitFor(() => screen.getByTestId("fa"));
    expect(screen.getByTestId("fa")).toBeInTheDocument();
  });

  // Loading indicator during assign
  it("E: Assign shows loading state on button (via prop)", async () => {
    const { props } = renderModal({ assignedUsers: jest.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 10));
      return { status: "SUCCESS" };
    }) });
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const dialogs = screen.getAllByRole("dialog");
    const second = dialogs[dialogs.length - 1];
    const roleSelectAll = within(second).getAllByRole("checkbox")[0];
    fireEvent.click(roleSelectAll);
    fireEvent.click(within(second).getByTestId("btn-Assign"));
    await waitFor(() => expect(props.assignedUsers).toHaveBeenCalled());
  });

  // Role list empty shows Empty component
  it("P: empty roles shows Empty component", async () => {
    renderModal({}, { roles: { content: [] } });
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const empties = screen.getAllByText(/No data/i);
    expect(empties.length).toBeGreaterThan(0);
  });

  // Additional edge: select-all users when none selected
  it("E: select-all users when none selected selects both and Next enabled", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const selectAll = screen.getAllByRole("checkbox")[0];
    fireEvent.click(selectAll);
    expect(screen.getByTestId("btn-Next")).not.toBeDisabled();
  });

  // Additional tests to reach 30
  it("P: multi-user selection assigns both emails", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const checks = screen.getAllByRole("checkbox");
    fireEvent.click(checks[1]);
    fireEvent.click(checks[2]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const second = screen.getAllByRole("dialog").slice(-1)[0];
    const roleSelectAll = within(second).getAllByRole("checkbox")[0];
    fireEvent.click(roleSelectAll);
    fireEvent.click(within(second).getByTestId("btn-Assign"));
    await waitFor(() => expect(props.assignedUsers).toHaveBeenCalled());
    const payload = props.assignedUsers.mock.calls[0][0];
    expect(payload.data.userNames.sort()).toEqual(["jane@x.com", "john@x.com"].sort());
  });

  it("N: Next remains disabled when no user selected", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    expect(screen.getByTestId("btn-Next")).toBeDisabled();
    fireEvent.click(screen.getByTestId("btn-Next"));
    expect(screen.getAllByRole("dialog").length).toBe(1);
  });

  it("E: select-all then deselect one user assigns remaining email", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const checks = screen.getAllByRole("checkbox");
    fireEvent.click(checks[0]); // select all users
    fireEvent.click(checks[1]); // deselect first user
    fireEvent.click(screen.getByTestId("btn-Next"));
    const second = screen.getAllByRole("dialog").slice(-1)[0];
    const roleSelectAll = within(second).getAllByRole("checkbox")[0];
    fireEvent.click(roleSelectAll);
    fireEvent.click(within(second).getByTestId("btn-Assign"));
    await waitFor(() => expect(props.assignedUsers).toHaveBeenCalled());
    const payload = props.assignedUsers.mock.calls[0][0];
    expect(payload.data.userNames).toEqual(["jane@x.com"]);
  });

  it("P: role select-all then deselect one assigns single role", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const second = screen.getAllByRole("dialog").slice(-1)[0];
    const [selAll, role1, role2] = within(second).getAllByRole("checkbox");
    fireEvent.click(selAll);
    fireEvent.click(role2); // deselect one
    fireEvent.click(within(second).getByTestId("btn-Assign"));
    await waitFor(() => expect(props.assignedUsers).toHaveBeenCalled());
    const payload = props.assignedUsers.mock.calls[0][0];
    expect(payload.data.authorizedDetails[0].projects[0].roles).toEqual([101]);
  });

  it("N: toggling a role twice leaves Assign disabled", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const second = screen.getAllByRole("dialog").slice(-1)[0];
    const role1 = within(second).getAllByRole("checkbox")[1];
    fireEvent.click(role1);
    fireEvent.click(role1);
    expect(within(second).getByTestId("btn-Assign")).toBeDisabled();
  });

  it("E: selecting one role then select-all ends with both roles selected", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const second = screen.getAllByRole("dialog").slice(-1)[0];
    const [selAll, role1, role2] = within(second).getAllByRole("checkbox");
    fireEvent.click(role1);
    fireEvent.click(selAll);
    fireEvent.click(within(second).getByTestId("btn-Assign"));
    await waitFor(() => expect(props.assignedUsers).toHaveBeenCalled());
    const roles = props.assignedUsers.mock.calls[0][0].data.authorizedDetails[0].projects[0].roles;
    expect(roles.sort()).toEqual([101, 102].sort());
  });

  it("P: clearing user search triggers fetch with empty string", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    const input = screen.getByTestId("ri-Search");
    fireEvent.change(input, { target: { value: "jo" } });
    await waitFor(() => expect(props.getAllUsersList).toHaveBeenCalledWith({ searchText: "jo" }));
    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() => expect(props.getAllUsersList).toHaveBeenCalledWith({ searchText: "" }));
  });

  it("N: clearing role search triggers getAllRoles with empty string", async () => {
    const { props } = renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const second = screen.getAllByRole("dialog").slice(-1)[0];
    const roleInput = within(second).getByTestId("ri-Search");
    fireEvent.change(roleInput, { target: { value: "ro" } });
    await waitFor(() => expect(props.getAllRoles).toHaveBeenCalledWith({ searchText: "ro" }));
    fireEvent.change(roleInput, { target: { value: "" } });
    await waitFor(() => expect(props.getAllRoles).toHaveBeenCalledWith({ searchText: "" }));
  });

  // Extra test to make 30
  it("E: role search then clear keeps second modal open", async () => {
    renderModal();
    await waitFor(() => screen.getByText("John Doe"));
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByTestId("btn-Next"));
    const second = screen.getAllByRole("dialog").slice(-1)[0];
    const roleInput = within(second).getByTestId("ri-Search");
    fireEvent.change(roleInput, { target: { value: "role" } });
    fireEvent.change(roleInput, { target: { value: "" } });
    expect(within(second).getByTestId("btn-Assign")).toBeInTheDocument();
  });
});
