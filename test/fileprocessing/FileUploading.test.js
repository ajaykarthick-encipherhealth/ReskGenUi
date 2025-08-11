import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// Mock antd Select and message only for this file
const messageErrorMock = jest.fn();

// Polyfill matchMedia for react-bootstrap Offcanvas/hook usage
beforeAll(() => {
  if (!window.matchMedia) {
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
  }
});
// Mock antd once for the suite
jest.mock("antd", () => {
  const React = require("react");
  return {
    __esModule: true,
    Select: ({ onChange, options = [], value, "data-testid": dtid, ...rest }) => (
      <select
        data-testid={dtid}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value, { label: e.target.value, value: e.target.value })}
        {...rest}
      >
        <option value="">--select--</option>
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ),
    message: { error: (...args) => messageErrorMock(...args) },
  };
});

// Mock react-bootstrap once for the suite
jest.mock("react-bootstrap", () => ({
  __esModule: true,
  Offcanvas: ({ show, onHide, children, ...rest }) =>
    show ? (
      <div data-testid="offcanvas" {...rest}>
        <button data-testid="offcanvas-hide" onClick={onHide}>
          hide
        </button>
        {children}
      </div>
    ) : null,
  Button: ({ children, ...rest }) => <button {...rest}>{children}</button>,
}));

jest.mock("react-bootstrap/Form", () => {
  const React = require("react");
  const Form = ({ onSubmit, children, "data-testid": dtid, ...rest }) => (
    <form data-testid={dtid} onSubmit={(e) => { e.preventDefault(); onSubmit?.(e); }} {...rest}>
      {children}
    </form>
  );
  Form.Label = ({ children }) => <label>{children}</label>;
  Form.Control = (props) => <input {...props} />;
  return { __esModule: true, default: Form };
});

// Component under test (after mocks)
import FileUploading from "../../src/commonPages/fileprocessing/FileUploading";

describe("FileUploading", () => {
  const baseProps = {
    addPatient: true,
    setAddPatient: jest.fn(),
    validated: false,
    handleSubmit: jest.fn(),
    inputValue: { patientId: "", year: null },
    handleChange: jest.fn(),
    isLoadingBtn: false,
    onChangeFile: jest.fn(),
    errors: {},
    setEmrType: jest.fn(),
    handleClose: jest.fn(),
    emrType: null,
    isUpload: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it("renders Add patient form variant and submits", () => {
    render(<FileUploading {...baseProps} />);
    expect(screen.getByText("Add Patient Details")).toBeInTheDocument();
    expect(screen.getByTestId("Add-patient-form")).toBeInTheDocument();
    fireEvent.submit(screen.getByTestId("Add-patient"));
    expect(baseProps.handleSubmit).toHaveBeenCalled();
  });

  it("renders Upload variant, disables patientId, and header close works", () => {
    render(<FileUploading {...baseProps} isUpload={true} inputValue={{ patientId: "123" }} />);
    expect(screen.getByText("Upload Patient Details")).toBeInTheDocument();
    expect(screen.getByTestId("upload-form")).toBeInTheDocument();
    const patientIdInput = screen.getByTestId("patientId");
    expect(patientIdInput).toBeDisabled();

    // Header close button
    fireEvent.click(document.querySelector(".btn-close"));
    expect(baseProps.handleClose).toHaveBeenCalled();

    // Offcanvas onHide trigger is internal; we already covered close via header
  });

  it("Cancel button calls setAddPatient(false)", () => {
    render(<FileUploading {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(baseProps.setAddPatient).toHaveBeenCalledWith(false);
  });

  it("file input accepts only single .pdf without double extension (positive)", () => {
    render(<FileUploading {...baseProps} />);
    const fileInput = screen.getByTestId("fileInput");
    const file = new File(["doc"], "report.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(baseProps.onChangeFile).toHaveBeenCalledWith([file]);
    expect(messageErrorMock).not.toHaveBeenCalled();
  });

  it("rejects invalid file types and double extensions (negative)", () => {
    render(<FileUploading {...baseProps} />);
    const fileInput = screen.getByTestId("fileInput");
    const badType = new File(["doc"], "report.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [badType] } });
    // onChangeFile should NOT be called for invalid file
    expect(baseProps.onChangeFile).not.toHaveBeenCalled();

    messageErrorMock.mockClear();
    const doubleExt = new File(["doc"], "report.pdf.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [doubleExt] } });
    expect(baseProps.onChangeFile).not.toHaveBeenCalled();
  });

  it("ignores change when no file selected (early return)", () => {
    render(<FileUploading {...baseProps} />);
    const fileInput = screen.getByTestId("fileInput");
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(messageErrorMock).not.toHaveBeenCalled();
    expect(baseProps.onChangeFile).not.toHaveBeenCalled();
  });

  it("renders Year select and shows provided error text (no change event)", () => {
    const props = { ...baseProps, errors: { year: "Year is required" } };
    render(<FileUploading {...props} />);
    expect(screen.getByTestId("select-year")).toBeInTheDocument();
    expect(screen.getByText("Year is required")).toBeInTheDocument();
  });

  it("renders EMR select (no change event)", () => {
    render(<FileUploading {...baseProps} />);
    expect(screen.getByTestId("emr-select")).toBeInTheDocument();
    expect(screen.getByText("EMR Type")).toBeInTheDocument();
  });

  // Offcanvas onHide is internal; header close already tested above

  it("shows loading button when isLoadingBtn true", () => {
    render(<FileUploading {...baseProps} isLoadingBtn={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});


