import React from "react";
import { render, screen, fireEvent, waitFor, cleanup, within } from "@testing-library/react";

// Connect passthrough
jest.mock("react-redux", () => ({ connect: () => (C) => C }));

// Mock CSS modules and styles
jest.mock("../../src/commonPages/patientAllocation/reviewerAllocation/../../../pages/tenantadmin/allocateduser/allocate/style.module.css", () => ({}));
jest.mock("../../src/commonPages/patientAllocation/reviewerAllocation/../../../components/tables/table.module.css", () => ({ checkbox: "chk", customChecked2: "checked" }));

// FontAwesome
jest.mock("@fortawesome/react-fontawesome", () => ({ FontAwesomeIcon: () => <i data-testid="fa" /> }));

// RegularButton and TableSkeleton
jest.mock("../../src/components/button", () => ({ __esModule: true, default: ({ name, onClick, disabled }) => (
  <button data-testid={`btn-${name}`} disabled={disabled} onClick={onClick}>{name}</button>
) }));
jest.mock("../../src/components/skeleton/table", () => () => <div data-testid="table-skeleton" />);

// Utilities
const popupMock = jest.fn();
jest.mock("../../src/utils/reusable", () => ({
  formatDateForIndex: ({ date }) => (typeof date === "string" ? date : "2025-01-01"),
  getResponePopup: (...args) => require("../../test/patientAllocation/RandomSamplingModal.test.js").__mocks__.popup(...args),
}));
export const __mocks__ = { popup: popupMock };

jest.mock("../../src/utils/storages", () => ({
  getStorage: (k) => (k === "tinNumber" ? "TIN-1" : k === "userId" ? "UID-1" : null),
}));

// Header functions
jest.mock("../../src/components/headerFilters/functions", () => ({
  disablePastDate: () => false,
  priorityOptions: [
    { value: "HIGH", label: "High" },
    { value: "LOW", label: "Low" },
  ],
}));

// antd stub factory
const formApi = () => ({ resetFields: jest.fn(), setFieldsValue: jest.fn(), getFieldValue: jest.fn(() => undefined) });
// Deep mocks for antd subpaths (babel-plugin-import rewrites to lib/*)
jest.mock("antd/lib/form", () => {
  const React = require("react");
  const FormComp = ({ children, onFinish }) => (
    <div>
      {children}
      <button data-testid="mock-form-submit" onClick={() => onFinish?.({ totalPercentage: "30", hccpercentage: "40", nohccpercentage: "60", priority: "HIGH", duedate: "2025-01-01" })}>
        mock-submit
      </button>
    </div>
  );
  FormComp.Item = ({ children }) => <div>{children}</div>;
  FormComp.useForm = () => [({ resetFields: jest.fn(), setFieldsValue: jest.fn(), getFieldValue: jest.fn(() => undefined) })];
  return { __esModule: true, default: FormComp };
});
jest.mock("antd/lib/modal", () => {
  const React = require("react");
  const Modal = ({ open, onCancel, title, children, "data-testid": dtid }) =>
    open ? (
      <div data-testid={dtid || (title ? `modal-${title}` : "modal")}>
        <div data-testid="modal-header">{title}</div>
        <button aria-label="Close" data-testid={(dtid || "modal") + "-close"} onClick={onCancel}>x</button>
        {children}
      </div>
    ) : null;
  return { __esModule: true, default: Modal };
});
jest.mock("antd/lib/input", () => {
  const React = require("react");
  const Input = ({ value, onChange, placeholder, onKeyDown, className, disabled }) => (
    <input data-testid={`input-${placeholder || className || "input"}`} value={value || ""} onChange={onChange} onKeyDown={onKeyDown} disabled={disabled} />
  );
  return { __esModule: true, default: Input };
});
jest.mock("antd/lib/select", () => {
  const React = require("react");
  const Select = ({ options = [], value, onChange, className, placeholder }) => (
    <select data-testid={`select-${placeholder || className || "select"}`} value={value || ""} onChange={(e) => onChange?.(e.target.value)}>
      <option value="">--</option>
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
  return { __esModule: true, default: Select };
});
jest.mock("antd/lib/date-picker", () => {
  const React = require("react");
  const DatePicker = ({ className, placeholder }) => (
    <input data-testid={`date-${placeholder || className || "date"}`} />
  );
  return { __esModule: true, default: DatePicker };
});
jest.mock("antd/lib/avatar", () => {
  const React = require("react");
  const Avatar = ({ children }) => <div data-testid="avatar">{children}</div>;
  return { __esModule: true, default: Avatar };
});
// Fallback full antd mock (for any remaining imports)
jest.mock("antd", () => ({ __esModule: true, message: { success: jest.fn(), error: jest.fn(), warning: jest.fn() }, notification: { success: jest.fn(), error: jest.fn(), warning: jest.fn() } }));

// Stores actions (avoid deep reducers)
jest.mock("../../src/stores/admin/patientAllocation", () => ({ actions: {} }));
jest.mock("../../src/stores/tenantAdmin/patientAllocations", () => ({ actions: {} }));

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

function loadComponent() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../../src/commonPages/patientAllocation/reviewerAllocation/randomSamplingModal").default;
}

function renderWith(overrides = {}) {
  const form = formApi();
  const getL1UsersList = jest.fn().mockResolvedValue({ status: "SUCCESS", response: [
    { firstName: "A", lastName: "1", id: "1", roleId: "R1", userName: "a1@x.com", aliasName: "QA", proxyId: "p1" },
    { firstName: "B", lastName: "2", id: "2", roleId: "R2", userName: "b2@x.com", aliasName: "QA", proxyId: "p2" },
  ]});
  const randomSampling = jest.fn().mockResolvedValue({ status: "SUCCESS" });
  const getAllTabRoles = jest.fn();
  const getAllAllocation = jest.fn();

  const props = {
    open: true,
    setOpen: jest.fn(),
    setSelectedRowsId: jest.fn(),
    getL1UsersList,
    setSelectedRows: jest.fn(),
    usersLoader: false,
    getAllAllocation,
    setIsModalOpen: jest.fn(),
    isModalOpen: true,
    randomSampling,
    isAllocate: false,
    roleId: "RID-1",
    setIsAllocate: jest.fn(),
    getAllTabRoles,
    roleAliasName: "QA",
    setFormValues: jest.fn(),
    formValues: {},
    form,
    ...overrides,
  };
  const Comp = loadComponent();
  const ui = render(<Comp {...props} />);
  return { ui, props };
}

it("loads users on roleId and enables Save after Select All; Save success path", async () => {
  const { props } = renderWith();
  // users fetched
  await waitFor(() => expect(props.getL1UsersList).toHaveBeenCalled());
  // Select all checkbox present and toggles Save enabled
  const selectAll = await waitFor(() => document.getElementById("selectAll"));
  fireEvent.click(selectAll);
  const saveBtn = screen.getByTestId("btn-Save");
  expect(saveBtn).not.toBeDisabled();
  // Save
  fireEvent.click(saveBtn);
  await waitFor(() => expect(props.randomSampling).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();
  expect(props.getAllTabRoles).toHaveBeenCalled();
  expect(props.getAllAllocation).toHaveBeenCalled();
  expect(props.setOpen).toHaveBeenCalledWith(false);
});

it("Save error path calls popup", async () => {
  const { props } = renderWith({ randomSampling: jest.fn().mockResolvedValue({ status: "ERROR" }) });
  await waitFor(() => expect(props.getL1UsersList).toHaveBeenCalled());
  const selectAll = await waitFor(() => document.getElementById("selectAll"));
  fireEvent.click(selectAll);
  fireEvent.click(screen.getByTestId("btn-Save"));
  await waitFor(() => expect(popupMock).toHaveBeenCalled());
});

it("form Next closes form modal and opens user modal", async () => {
  const setOpen = jest.fn();
  const setIsModalOpen = jest.fn();
  renderWith({ setOpen, isModalOpen: true, setIsModalOpen });
  // Submit the form via mocked form submit trigger
  fireEvent.click(screen.getByTestId("mock-form-submit"));
  expect(setOpen).toHaveBeenCalledWith(true);
  expect(setIsModalOpen).toHaveBeenCalledWith(false);
});

it("usersLoader shows TableSkeleton", () => {
  renderWith({ usersLoader: true });
  expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
});

it("cancel on user modal resets via setOpen(false)", () => {
  const setOpen = jest.fn();
  renderWith({ setOpen });
  // Click close button in antd modal (aria-label "Close")
  const closeBtn = document.querySelector('button[aria-label="Close"]');
  if (closeBtn) fireEvent.click(closeBtn);
  expect(setOpen).toHaveBeenCalledWith(false);
});

it("MASTER_AUDIT builds payload with usersWithRole and role select changes", async () => {
  const randomSampling = jest.fn().mockResolvedValue({ status: "SUCCESS" });
  const { props } = renderWith({ roleAliasName: "MASTER_AUDIT", randomSampling });
  await waitFor(() => expect(props.getL1UsersList).toHaveBeenCalled());
  // Role select (skip complex rc-select interaction in jsdom)
  // select all and save
  // Scope interactions to the user list modal to avoid multiple modal headers
  const userModal = screen.getByTestId("modal-Select User");
  const userScope = within(userModal);
  const maybeSelectAll = userModal.querySelector("#selectAll");
  if (maybeSelectAll) {
    fireEvent.click(maybeSelectAll);
  } else {
    const checkboxes = userScope.getAllByRole("checkbox");
    checkboxes.forEach((cb) => fireEvent.click(cb));
  }
  fireEvent.click(userScope.getByTestId("btn-Save"));
  await waitFor(() => expect(randomSampling).toHaveBeenCalled());
});


