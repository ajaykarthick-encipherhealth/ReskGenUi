import React from "react";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// Router
jest.mock("next/router", () => ({ useRouter: () => ({ pathname: "/tenantadmin/alloc" }) }));

// Minimal antd stubs
const resetFieldsMock = jest.fn();
jest.mock("antd", () => ({
  __esModule: true,
  Button: ({ children, onClick, disabled, "data-testid": dtid }) => (
    <button data-testid={dtid} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
  Tooltip: ({ children }) => <span>{children}</span>,
  Form: { useForm: () => [{ resetFields: resetFieldsMock }] },
}));

// Bootstrap Tab/Nav stubs
jest.mock("react-bootstrap", () => {
  const Tab = {
    Container: ({ children }) => <div data-testid="tab-container">{children}</div>,
    Content: ({ children }) => <div data-testid="tab-content">{children}</div>,
    Pane: ({ children }) => <div data-testid="tab-pane">{children}</div>,
  };
  const Nav = ({ children }) => <ul data-testid="nav">{children}</ul>;
  Nav.Item = ({ children, ...rest }) => (
    <li data-testid="nav-item" {...rest}>
      {children}
    </li>
  );
  Nav.Link = ({ children, onClick, ...rest }) => (
    <button data-testid="nav-link" onClick={onClick} {...rest}>
      {children}
    </button>
  );
  return { Tab, Nav };
});

// Utilities
const popupMock = jest.fn();
const clearCheckMock = jest.fn().mockReturnValue(true);
const findMatchesMock = jest.fn().mockReturnValue(true);
jest.mock("../../src/utils/reusable", () => ({
  createIdGen: (id) => `tid-${String(id)}`,
  findMatchesByField: (...args) => require("../../test/patientAllocation/PatientAllocation.test.js").__mocks__.findMatchesByField(...args),
  getResponePopup: (...args) => require("../../test/patientAllocation/PatientAllocation.test.js").__mocks__.getResponePopup(...args),
  tableCustomFilterClearCheck: (...args) => require("../../test/patientAllocation/PatientAllocation.test.js").__mocks__.tableCustomFilterClearCheck(...args),
}));
export const __mocks__ = { getResponePopup: popupMock, tableCustomFilterClearCheck: clearCheckMock, findMatchesByField: findMatchesMock };

// Storages
jest.mock("../../src/utils/storages", () => ({ getStorage: (k) => (k === "tinNumber" ? "TIN-123" : null) }));

// Heavy children stubs
jest.mock("../../src/commonPages/patientAllocation/reviewerAllocation", () =>
  function MockReviewerAllocation(props) {
    const { setSelectedRowsId, setSelectedRows } = props;
    return (
      <div data-testid="reviewer-allocation">
        <button
          data-testid="select-one"
          onClick={() => {
            setSelectedRows?.([{ id: 1 }]);
            setSelectedRowsId?.([1]);
          }}
        >
          select-one
        </button>
      </div>
    );
  }
);
jest.mock("../../src/commonPages/patientAllocation/reviewerAllocation/randomSamplingModal", () =>
  function MockRandomSamplingModal(props) {
    const { open, setOpen, showModal } = props;
    return (
      <div data-testid="random-modal">
        <div data-testid="random-open">{String(!!open)}</div>
        <button data-testid="random-open-btn" onClick={() => showModal && showModal()}>
          open-sampling
        </button>
        <button data-testid="random-close-btn" onClick={() => setOpen && setOpen(false)}>
          close
        </button>
      </div>
    );
  }
);
jest.mock("../../src/commonPages/patientAllocation/reviewerAllocation/reviewerAllocationModal", () =>
  function MockReviewerAllocationModal(props) {
    const { open, setOpen } = props;
    return (
      <div data-testid="allocation-modal">
        <div data-testid="allocation-open">{String(!!open)}</div>
        <button data-testid="allocation-close-btn" onClick={() => setOpen && setOpen(false)}>
          close
        </button>
      </div>
    );
  }
);

jest.mock("../../src/components/reusableFilters", () =>
  function MockReusableFilters(props) {
    const { handleSubmit, handleReset } = props;
    return (
      <div data-testid="reusable-filters">
        <button data-testid="filters-submit" onClick={() => handleSubmit?.([{ id: "colA" }, { id: "colB" }])}>
          submit
        </button>
        <button data-testid="filters-reset" onClick={() => handleReset?.()}>
          reset
        </button>
      </div>
    );
  }
);

// CardSkeleton
jest.mock("../../src/components/skeleton/card", () => () => <div data-testid="card-skeleton" />);

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

// Identity connect to avoid Redux wiring
jest.mock("react-redux", () => ({ connect: () => (C) => C }));

// Mock stores that import redux-actions in reducers
jest.mock("../../src/stores/tenantAdmin/patientAllocations", () => ({ actions: {} }));
jest.mock("../../src/stores/tenantAdmin/tin", () => ({ actions: {} }));
jest.mock("../../src/stores/tableView", () => ({ actions: {} }));

function loadComponent() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../../src/commonPages/patientAllocation").default;
}

const baseRoles = {
  allocationRoles: [
    { roleId: "RID-QA", aliasName: "QA" },
    { roleId: "RID-MA", aliasName: "MASTER_AUDIT" },
  ],
};

const baseData = {
  response: {
    metaDataDTO: [
      { id: "f1", active: true, filter: { style: true } },
      { id: "f2", active: false, filter: { style: false } },
    ],
  },
};

function renderWith(overrides = {}) {
  const getAllTabRoles = jest.fn().mockResolvedValue({ status: "SUCCESS", response: baseRoles });
  const getTableData = jest.fn().mockResolvedValue({ status: "SUCCESS" });
  const tableDynamicColumn = jest.fn().mockResolvedValue({ status: "SUCCESS" });
  const tableDynamicColumnReset = jest.fn().mockResolvedValue({ status: "SUCCESS" });

  const Comp = loadComponent();
  const props = {
    getAllTabRoles,
    getTableData,
    data: baseData,
    allRoles: baseRoles,
    rolesLoader: false,
    tableLoader: false,
    pageLoad: false,
    tableDynamicColumn,
    tableDynamicColumnReset,
    statusBodyTemplate: jest.fn(),
    id: "X",
    ...overrides,
  };

  const ui = render(<Comp {...props} />);
  return { ui, props };
}

it("loads roles, triggers initial allocation fetch, shows tabs and buttons", async () => {
  const { props } = renderWith();
  await waitFor(() => expect(props.getAllTabRoles).toHaveBeenCalled());
  // After roleId set, effect should call getTableData
  await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
  // Buttons rendered
  expect(screen.getByText("Allocate")).toBeInTheDocument();
  expect(screen.getByText("Table Customization")).toBeInTheDocument();
});

it("opens and closes ReviewerAllocationModal via Allocate button", async () => {
  renderWith();
  // enable allocate by selecting one row
  fireEvent.click(screen.getByTestId("select-one"));
  fireEvent.click(screen.getByText("Allocate"));
  expect(screen.getByTestId("allocation-open").textContent).toBe("true");
  fireEvent.click(screen.getByTestId("allocation-close-btn"));
  expect(screen.getByTestId("allocation-open").textContent).toBe("false");
});

it("Random Sampling button visible for QA; Master Audit Sampling visible for MASTER_AUDIT", async () => {
  renderWith();
  // Click first role by text
  fireEvent.click(screen.getByText("QA"));
  await waitFor(() => expect(screen.getByText("Random Sampling")).toBeInTheDocument());

  // Click second role by text
  fireEvent.click(screen.getByText("MASTER AUDIT"));
  await waitFor(() => expect(screen.getByText("Master Audit Sampling")).toBeInTheDocument());
});

it("handleSubmit success with filter clear true triggers getAllAllocation and popup", async () => {
  const { props } = renderWith();
  fireEvent.click(screen.getByTestId("filters-submit"));
  await waitFor(() => expect(props.tableDynamicColumn).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();
  // getTableData called from internal getAllAllocation pathway
  await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
});

it("handleSubmit error path calls getResponePopup with error", async () => {
  const err = { response: { status: 500 } };
  const { props } = renderWith({ tableDynamicColumn: jest.fn().mockRejectedValue(err) });
  fireEvent.click(screen.getByTestId("filters-submit"));
  await waitFor(() => expect(popupMock).toHaveBeenCalledWith(err.response));
});

it("handleReset success triggers getAllAllocation and popup", async () => {
  const { props } = renderWith();
  fireEvent.click(screen.getByTestId("filters-reset"));
  await waitFor(() => expect(props.tableDynamicColumnReset).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();
  await waitFor(() => expect(props.getTableData).toHaveBeenCalled());
});

it("when rolesLoader true shows skeleton and no buttons", () => {
  renderWith({ rolesLoader: true });
  expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  expect(screen.queryByText("Allocate")).not.toBeInTheDocument();
});


