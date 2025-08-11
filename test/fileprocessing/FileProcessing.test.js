import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";

// Mocks
let pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// CSS import used in the module
jest.mock("react-facebook-loading/dist/react-facebook-loading.css", () => ({}));

const notifSuccess = jest.fn();
const notifWarning = jest.fn();
jest.mock("antd", () => ({
  __esModule: true,
  notification: {
    success: (...args) => notifSuccess(...args),
    warning: (...args) => notifWarning(...args),
  },
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <i data-testid="fa-icon" />,
}));

// Header pulls in notification/websocket reducers; mock to avoid deep deps
jest.mock("../../src/jsx/layouts/nav/Header", () => () => <div data-testid="mock-header" />);

// HeaderFilters pulls patientSync reducers; stub with a minimal component
jest.mock("../../src/components/headerFilters", () => () => (
  <div data-testid="mock-header-filters" />
));

// Mock stores that depend on redux-actions
jest.mock("../../src/stores/tenantAdmin/users", () => ({ actions: {} }));
jest.mock("../../src/stores/tenantAdmin/fileProcessing", () => ({ actions: {} }));
jest.mock("../../src/stores/admin/workqueue", () => ({ actions: {} }));

// identity connect so we can pass props directly
jest.mock("react-redux", () => ({ connect: () => (C) => C }));

// Minimal table to exercise templates and actions
jest.mock(
  "../../src/components/table/tenantTable/FileProcessing/FileProcessing",
  () =>
    function MockTable(props) {
      const { patinetListAll = [], statusBodyTemplate, actionBodyTemplate, gotoPatientDetails } = props;
      return (
        <div data-testid="mock-table">
          {patinetListAll.map((row, idx) => (
            <div key={idx} data-testid={`row-${idx}`}>
              <div data-testid={`status-${idx}`}>{statusBodyTemplate?.(row)}</div>
              <div data-testid={`action-${idx}`}>{actionBodyTemplate?.(row)}</div>
              <button data-testid={`goto-${idx}`} onClick={() => gotoPatientDetails?.(row)}>
                goto
              </button>
            </div>
          ))}
        </div>
      );
    }
);

// Lightweight children to observe props and trigger callbacks
jest.mock("../../src/commonPages/fileprocessing/FileUploading", () =>
  function MockFileUploading(props) {
    const { addPatient, inputValue, handleSubmit, onChangeFile } = props;
    return (
      <div data-testid="fileuploading">
        <div data-testid="fu-addPatient">{String(!!addPatient)}</div>
        <div data-testid="fu-patientId">{inputValue?.patientId ?? ""}</div>
        <div data-testid="fu-name">{inputValue?.name ?? ""}</div>
        <button
          data-testid="fu-set-file"
          onClick={() => onChangeFile?.([new File(["x"], "file.pdf", { type: "application/pdf" })])}
        >
          setfile
        </button>
        <button
          data-testid="fu-submit"
          onClick={() =>
            handleSubmit?.({
              preventDefault: () => {},
              stopPropagation: () => {},
              currentTarget: { checkValidity: () => true },
            })
          }
        >
          submit
        </button>
      </div>
    );
  }
);

jest.mock("../../src/commonPages/fileprocessing/Addpatiens", () =>
  function MockAddpatients(props) {
    const { handleChangePatientId, handleSubmitPatientId, addPatientId } = props;
    return (
      <div data-testid="addpatients">
        <div data-testid="ap-visible">{String(!!addPatientId)}</div>
        <button
          data-testid="ap-fill"
          onClick={() => {
            handleChangePatientId?.({ target: { name: "patientId", value: "PID-1" } });
            handleChangePatientId?.({ target: { name: "patientName", value: "John" } });
          }}
        >
          fill
        </button>
        <button
          data-testid="ap-submit"
          onClick={() =>
            handleSubmitPatientId?.({
              preventDefault: () => {},
              currentTarget: { checkValidity: () => true },
            })
          }
        >
          submit-id
        </button>
      </div>
    );
  }
);

// Storages
const getStorageMock = jest.fn((key) => ({ tenantId: "TEN-1", userId: "USR-1", orgId: "ORG-1" }[key]));
const setStorageMock = jest.fn();
jest.mock("../../src/utils/storages", () => ({
  getStorage: (...args) => getStorageMock(...args),
  setStorage: (...args) => setStorageMock(...args),
}));

// Load component after mocks
function loadComponent() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../../src/commonPages/fileprocessing").default;
}

const sampleRows = [
  { patientId: "P1", patientName: "A", processedStatus: "COMPLETED", computing: 2 },
  { patientId: "P2", patientName: "B", processedStatus: "PENDING", computing: 1 },
  { patientId: "P3", patientName: "C", processedStatus: "DECLINED", computing: 0 },
  { patientId: "P4", patientName: "D", processedStatus: "NOTCOMPUTED", computing: 0 },
  { patientId: "P5", patientName: "E", processedStatus: "COMPUTED", computing: 0 },
  { patientId: "P6", patientName: "F", processedStatus: "HOLD", computing: 0 },
  { patientId: "P7", patientName: "G", processedStatus: null, computing: 0 },
];

const orgListProp = {
  response: [
    { id: "ORG-1", name: "Org One" },
    { id: "ORG-2", name: "Org Two" },
  ],
};

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

function renderWithProps(overrides = {}) {
  const getUsersList = jest.fn().mockResolvedValue({
    data: { response: { content: sampleRows, totalElements: sampleRows.length } },
  });
  const addPatientFiles = jest.fn().mockResolvedValue({ status: 200, data: { message: "OK" } });
  const getUploadFile = jest.fn().mockResolvedValue({ status: 202 });
  const uploadFilesRadiology = jest.fn().mockResolvedValue({ status: 202 });
  const patientDetails = jest.fn();
  const getPatients = jest.fn();

  const props = {
    getAllOrganizationList: jest.fn(),
    organizationList: orgListProp,
    patientDetails,
    getPatients,
    getUsersList,
    addPatientFiles,
    getUploadFile,
    uploadFilesRadiology,
    ...overrides,
  };

  const Comp = loadComponent();
  const utils = render(<Comp {...props} />);
  return { ...utils, props };
}

it("loads list, renders all status badges, and maps org list without crashing", async () => {
  renderWithProps();
  // statuses
  await waitFor(() => {
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getByText("Declined")).toBeInTheDocument();
    expect(screen.getByText("Not Computed")).toBeInTheDocument();
    expect(screen.getByText("Computed")).toBeInTheDocument();
    expect(screen.getByText("Hold")).toBeInTheDocument();
  });
});

it("action upload sets addPatient true and populates inputValue for FileUploading", async () => {
  renderWithProps();
  // Click the action button inside actionBodyTemplate (class 'action-btn')
  await waitFor(() => expect(document.querySelectorAll(".action-btn").length).toBeGreaterThan(0));
  fireEvent.click(document.querySelectorAll(".action-btn")[0]);

  expect(screen.getByTestId("fu-addPatient").textContent).toBe("true");
  expect(screen.getByTestId("fu-patientId").textContent).toBe("P1");
  expect(screen.getByTestId("fu-name").textContent).toBe("A");
});

it("submits patient file successfully and closes upload", async () => {
  renderWithProps();
  await waitFor(() => expect(document.querySelectorAll(".action-btn").length).toBeGreaterThan(0));
  fireEvent.click(document.querySelectorAll(".action-btn")[0]);
  fireEvent.click(screen.getByTestId("fu-set-file"));
  fireEvent.click(screen.getByTestId("fu-submit"));

  // success notification and modal closed (look for message text rendered by antd notification)
  await waitFor(() => expect(screen.getByText("Patient File Upload Successfully!")).toBeInTheDocument(), { timeout: 2000 });
  await waitFor(() => expect(screen.getByTestId("fu-addPatient").textContent).toBe("false"));
});

it("navigates to details when computing == 2, otherwise warns", async () => {
  renderWithProps();
  // computing == 2 for first row
  await waitFor(() => expect(screen.getByTestId("goto-0")).toBeInTheDocument());
  fireEvent.click(screen.getByTestId("goto-0"));
  expect(pushMock).toHaveBeenCalledWith("/reviewer/patients/details");
  expect(setStorageMock).toHaveBeenCalledWith("patientId", "P1");

  // computing != 2 warns
  fireEvent.click(screen.getByTestId("goto-1"));
  await waitFor(() => expect(screen.getByText("P2 file not processed Please wait")).toBeInTheDocument());
});

it("submits patient ID flow and shows success", async () => {
  const { props } = renderWithProps({
    addPatientFiles: jest.fn().mockResolvedValue({ status: 200, data: { message: "created" } }),
  });
  fireEvent.click(screen.getByTestId("ap-fill"));
  fireEvent.click(screen.getByTestId("ap-submit"));

  await waitFor(() => expect(screen.getByText("Patient ID Created Successfully!")).toBeInTheDocument(), { timeout: 2000 });
  expect(props.getPatients).toHaveBeenCalled();
});

it("patient ID already present shows warning path", async () => {
  renderWithProps({ addPatientFiles: jest.fn().mockResolvedValue({ status: 200, data: { message: "patient Already Present" } }) });
  fireEvent.click(screen.getByTestId("ap-fill"));
  fireEvent.click(screen.getByTestId("ap-submit"));
  await waitFor(() => expect(screen.getByText("Patient ID Already Present")).toBeInTheDocument(), { timeout: 2000 });
});

it("handles empty list response without crashing (negative)", async () => {
  renderWithProps({ getUsersList: jest.fn().mockResolvedValue({ data: null }) });
  // Table should render, but with zero rows; ensure no statuses present
  await waitFor(() => {
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });
});


