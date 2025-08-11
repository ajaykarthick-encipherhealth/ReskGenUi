import React from "react";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// Pass-through connect
jest.mock("react-redux", () => ({ connect: () => (C) => C }));

// Mock util used inside component
jest.mock("../../src/utils/reusable", () => ({
  findItemWithTrueKey: () => true,
}));

// Mock AppTable to expose controls and show received props
jest.mock("../../src/components/tables", () =>
  function MockAppTable(props) {
    const { handleRowCheckboxChange, onPageChange, selectedRows, first } = props;
    return (
      <div data-testid="app-table">
        <div data-testid="selectedRows-count">{String(selectedRows?.length || 0)}</div>
        <div data-testid="first-prop">{String(first)}</div>
        <button
          data-testid="bulk-check"
          onClick={() =>
            handleRowCheckboxChange?.({
              e: {},
              row: {},
              singleCheck: false,
              checked: [
                { patientId: "A", patientName: "A" },
                { patientId: "B", patientName: "B" },
              ],
            })
          }
        >
          bulk-check
        </button>
        <button
          data-testid="bulk-uncheck"
          onClick={() => handleRowCheckboxChange?.({ e: {}, row: {}, singleCheck: false, checked: false })}
        >
          bulk-uncheck
        </button>
        <button
          data-testid="single-check"
          onClick={() =>
            handleRowCheckboxChange?.({
              e: { target: { checked: true } },
              row: { patientId: "C", patientName: "C" },
              singleCheck: true,
            })
          }
        >
          single-check
        </button>
        <button
          data-testid="single-uncheck"
          onClick={() =>
            handleRowCheckboxChange?.({
              e: { target: { checked: false } },
              row: { patientId: "C", patientName: "C" },
              singleCheck: true,
            })
          }
        >
          single-uncheck
        </button>
        <button data-testid="page-next" onClick={() => onPageChange?.({ first: 15, page: 1 })}>
          page-next
        </button>
      </div>
    );
  }
);

// Mock actions modules to avoid redux-actions import in reducers
jest.mock("../../src/stores/tenantAdmin/patientAllocations", () => ({ actions: {} }));
jest.mock("../../src/stores/tableView", () => ({ actions: {} }));

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

function loadComponent() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../../src/commonPages/patientAllocation/reviewerAllocation").default;
}

function renderWith(overrides = {}) {
  const getTableData = jest.fn().mockResolvedValue({
    status: "SUCCESS",
    response: { patientIds: [{ patientId: "A", patientName: "A" }, { patientId: "B", patientName: "B" }] },
  });

  function Harness(props) {
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [selectedRowsId, setSelectedRowsId] = React.useState([]);
    const [selectedUserName, setSelectedUserName] = React.useState([]);
    const [pageNo, setPageNo] = React.useState(0);
    const [paginationFirst, setPaginationFirst] = React.useState(0);
    const [sort, setSort] = React.useState({});

    const Comp = loadComponent();
    return (
      <Comp
        setSelectedRowsId={setSelectedRowsId}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        pageNo={pageNo}
        setPageNo={setPageNo}
        paginationFirst={paginationFirst}
        setPaginationFirst={setPaginationFirst}
        setSelectedUserName={setSelectedUserName}
        sort={sort}
        setSort={setSort}
        data={{
          response: {
            pageResponse: {
              content: [{ id: 1, patientId: "A", patientName: "A" }],
              totalElements: 2,
            },
            metaDataDTO: [
              { id: "c1", active: true },
              { id: "c2", active: false },
            ],
            staticDesign: [{ checkBox: true }],
          },
        }}
        tableLoader={false}
        getTableData={getTableData}
        roleId={"RID"}
        search={null}
        setCheckedHeader={jest.fn()}
        statusBodyTemplate={jest.fn()}
        selectedDateRanges={{}}
        searchText={null}
        selectedOption={{}}
        roleAliasName={"QA"}
        {...overrides}
      />
    );
  }

  const ui = render(<Harness />);
  return { ui, getTableData };
}

it("bulk select path fetches and sets rows", async () => {
  const { getTableData } = renderWith();
  fireEvent.click(screen.getByTestId("bulk-check"));
  await waitFor(() => expect(getTableData).toHaveBeenCalled());
  // selectedRows should be 2 now
  await waitFor(() => expect(screen.getByTestId("selectedRows-count").textContent).toBe("2"));
});

it("bulk uncheck clears rows", async () => {
  renderWith();
  fireEvent.click(screen.getByTestId("bulk-check"));
  await waitFor(() => expect(screen.getByTestId("selectedRows-count").textContent).toBe("2"));
  fireEvent.click(screen.getByTestId("bulk-uncheck"));
  await waitFor(() => expect(screen.getByTestId("selectedRows-count").textContent).toBe("0"));
});

it("single select add and remove row", () => {
  renderWith();
  fireEvent.click(screen.getByTestId("single-check"));
  expect(screen.getByTestId("selectedRows-count").textContent).toBe("1");
  fireEvent.click(screen.getByTestId("single-uncheck"));
  expect(screen.getByTestId("selectedRows-count").textContent).toBe("0");
});

it("page change updates first prop to 15", () => {
  renderWith();
  // first initially 0
  expect(screen.getByTestId("first-prop").textContent).toBe("0");
  fireEvent.click(screen.getByTestId("page-next"));
  expect(screen.getByTestId("first-prop").textContent).toBe("15");
});


