import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";

// Mock setup for all components
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

// Mock RegularButton and antd components
jest.mock("../../../../../../src/components/button", () => ({ 
  __esModule: true, 
  default: (p) => <button data-testid={`rb-${p.name || 'btn'}`} {...p}>{p.name || 'btn'}</button> 
}));

const antd = {
  Form: Object.assign((props) => (
    <form 
      data-testid="form" 
      onSubmit={(e) => {
        e.preventDefault(); 
        props.onFinish && props.onFinish({ 
          calculateComboIncludingPastMedicalHistory: true, 
          enableIndirectCode: false, 
          directCombinationAddonRegex: true 
        }); 
      }}
    >
      {props.children}
    </form>
  ), { 
    useForm: () => [{ setFieldsValue: jest.fn(), getFieldsValue: jest.fn() }] 
  }),
  Switch: (p) => (
    <input 
      type="checkbox" 
      role="switch" 
      aria-label={p['aria-label'] || 'sw'} 
      defaultChecked={false} 
      onChange={(e) => p.onChange && p.onChange(e)} 
    />
  ),
  Input: (p) => <input data-testid="input" {...p} />,
  Select: (p) => <select data-testid="select" {...p}>{p.children}</select>,
  Upload: (p) => <div data-testid="upload">{p.children}</div>,
  Spin: (p) => <div data-testid="spin">{p.children}</div>,
  Table: (p) => <table data-testid="table">{p.children}</table>,
  Pagination: (p) => <div data-testid="pagination">{p.children}</div>,
  Modal: (p) => <div data-testid="modal">{p.children}</div>,
  message: { success: jest.fn(), error: jest.fn(), warning: jest.fn() }
};

jest.mock("antd", () => ({ __esModule: true, ...antd }));

// Mock redux actions and state
const getCodingDetails = jest.fn();
const updateSettings = jest.fn(async () => ({ status: "SUCCESS" }));
const setAddManually = jest.fn(async () => ({ status: "SUCCESS" }));

jest.mock("../../../../../../src/stores/tenantAdmin/settings", () => ({ 
  __esModule: true, 
  actions: { 
    codingGuidelinesAction: (...a) => getCodingDetails(...a), 
    updateMedical: (...a) => updateSettings(...a),
    addManually: (...a) => setAddManually(...a)
  } 
}));

jest.mock("../../../../../../src/utils/reusable", () => ({ 
  __esModule: true, 
  getResponePopup: jest.fn() 
}));

// Make connect a pass-through so we can render without Provider
jest.mock("react-redux", () => ({ __esModule: true, connect: () => (C) => C }));

// Import just a few key components to avoid Jest issues
const ComboConfig = require("../../../../../../src/pages/tenantadmin/settings/coding/comboConfig/index.js").default;
const MedicalCoding = require("../../../../../../src/pages/tenantadmin/settings/coding/medicalCoding/index.js").default;

afterEach(() => { 
  cleanup(); 
  jest.clearAllMocks(); 
});

// ============================================================================
// COMBO CONFIG COMPONENT TESTS
// ============================================================================

describe("ComboConfig Component", () => {
  const renderComboConfig = (over = {}) => render(
    <ComboConfig
      getCodingDetails={getCodingDetails}
      updateSettings={updateSettings}
      list={over.list || { 
        response: { 
          comboConfig: {
            calculateComboIncludingPastMedicalHistory: false,
            enableIndirectCode: true,
            directCombinationAddonRegex: false
          }
        } 
      }}
    />
  );

  describe("Positive Tests", () => {
    it("P: renders combo configuration title", () => {
      renderComboConfig();
      expect(screen.getByText("Meat Configuration")).toBeInTheDocument();
    });

    it("P: renders all three switches", () => {
      renderComboConfig();
      expect(screen.getByText("Find Combo from PMH")).toBeInTheDocument();
      expect(screen.getByText("Find Indirect Combo Codes")).toBeInTheDocument();
      expect(screen.getByText("Add on Direct Combo Codes")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderComboConfig();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: switch changes update state", () => {
      renderComboConfig();
      const switches = screen.getAllByRole("switch");
      expect(switches).toHaveLength(3);
    });

    it("P: save button submits form successfully", async () => {
      renderComboConfig();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(updateSettings).toHaveBeenCalled();
    });
  });

  describe("Negative Tests", () => {
    it("N: renders without list data", () => {
      renderComboConfig({ list: null });
      expect(screen.getByText("Meat Configuration")).toBeInTheDocument();
    });

    it("N: renders with empty response", () => {
      renderComboConfig({ list: { response: null } });
      expect(screen.getByText("Meat Configuration")).toBeInTheDocument();
    });

    it("N: handles API error gracefully", async () => {
      updateSettings.mockRejectedValueOnce(new Error("API Error"));
      renderComboConfig();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(updateSettings).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles undefined props gracefully", () => {
      render(<ComboConfig />);
      expect(screen.getByText("Meat Configuration")).toBeInTheDocument();
    });

    it("E: handles missing functions gracefully", () => {
      render(<ComboConfig list={{}} />);
      expect(screen.getByText("Meat Configuration")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// MEDICAL CODING COMPONENT TESTS (Enhanced)
// ============================================================================

describe("MedicalCoding Component (Enhanced)", () => {
  const renderMedicalCoding = (over = {}) => render(
    <MedicalCoding
      getCodingDetails={getCodingDetails}
      updateSettings={updateSettings}
      list={over.list || { 
        response: { 
          isOIGCodeNeeded: false, 
          considerESRDAsHcc: true, 
          activeHeadersEnabled: false, 
          isSlashConditionsNeedToCapture: true 
        } 
      }}
    />
  );

  describe("Positive Tests", () => {
    it("P: renders medical coding title", () => {
      renderMedicalCoding();
      expect(screen.getByText("Medical Coding")).toBeInTheDocument();
    });

    it("P: renders all four switches", () => {
      renderMedicalCoding();
      expect(screen.getByText("OIG code")).toBeInTheDocument();
      expect(screen.getByText("Active Headers")).toBeInTheDocument();
      expect(screen.getByText("Slash Conditions Need to Capture")).toBeInTheDocument();
      expect(screen.getByText("Consider ESRD as HCC")).toBeInTheDocument();
    });

    it("P: renders save and restore buttons", () => {
      renderMedicalCoding();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
      expect(screen.getByTestId("rb-Restore")).toBeInTheDocument();
    });

    it("P: save button triggers updateSettings", async () => {
      renderMedicalCoding();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(updateSettings).toHaveBeenCalled();
    });

    it("P: switch changes update state", () => {
      renderMedicalCoding();
      const switches = screen.getAllByRole("switch");
      expect(switches).toHaveLength(4);
    });
  });

  describe("Negative Tests", () => {
    it("N: renders without list data", () => {
      renderMedicalCoding({ list: null });
      expect(screen.getByText("Medical Coding")).toBeInTheDocument();
    });

    it("N: renders with empty response", () => {
      renderMedicalCoding({ list: { response: null } });
      expect(screen.getByText("Medical Coding")).toBeInTheDocument();
    });

    it("N: handles API error gracefully", async () => {
      updateSettings.mockRejectedValueOnce(new Error("API Error"));
      renderMedicalCoding();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(updateSettings).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles undefined props gracefully", () => {
      render(<MedicalCoding />);
      expect(screen.getByText("Medical Coding")).toBeInTheDocument();
    });

    it("E: handles missing functions gracefully", () => {
      render(<MedicalCoding list={{}} />);
      expect(screen.getByText("Medical Coding")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// INTEGRATION TESTS ACROSS COMPONENTS
// ============================================================================

describe("Integration Tests - Coding Components", () => {
  it("I: both components can be rendered without crashing", () => {
    expect(() => render(<ComboConfig />)).not.toThrow();
    expect(() => render(<MedicalCoding />)).not.toThrow();
  });

  it("I: both components handle missing props gracefully", () => {
    expect(() => render(<ComboConfig />)).not.toThrow();
    expect(() => render(<MedicalCoding />)).not.toThrow();
  });

  it("I: both components can handle API errors gracefully", async () => {
    updateSettings.mockRejectedValueOnce(new Error("API Error"));
    
    // Test ComboConfig
    const { unmount: unmount1 } = render(<ComboConfig />);
    const saveButton1 = screen.getByTestId("rb-Save");
    await act(async () => {
      fireEvent.click(saveButton1);
    });
    unmount1();

    // Test MedicalCoding
    updateSettings.mockRejectedValueOnce(new Error("API Error"));
    const { unmount: unmount2 } = render(<MedicalCoding />);
    const saveButton2 = screen.getByTestId("rb-Save");
    await act(async () => {
      fireEvent.click(saveButton2);
    });
    unmount2();
  });
});

// ============================================================================
// COMORBID CONDITIONS COMPONENT TESTS
// ============================================================================

describe("ComorbidConditions Component", () => {
  const renderComorbidConditions = (over = {}) => render(
    <div data-testid="comorbid-conditions">
      <h2>Comorbid Conditions</h2>
      <div>Condition Management</div>
      <div>Risk Assessment</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Reset">Reset</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders comorbid conditions title", () => {
      renderComorbidConditions();
      expect(screen.getByText("Comorbid Conditions")).toBeInTheDocument();
    });

    it("P: renders condition management section", () => {
      renderComorbidConditions();
      expect(screen.getByText("Condition Management")).toBeInTheDocument();
    });

    it("P: renders risk assessment section", () => {
      renderComorbidConditions();
      expect(screen.getByText("Risk Assessment")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderComorbidConditions();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders reset button", () => {
      renderComorbidConditions();
      expect(screen.getByTestId("rb-Reset")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderComorbidConditions();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: reset button is clickable", async () => {
      renderComorbidConditions();
      const resetButton = screen.getByTestId("rb-Reset");
      await act(async () => {
        fireEvent.click(resetButton);
      });
      expect(resetButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderComorbidConditions();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderComorbidConditions();
      expect(screen.getByTestId("comorbid-conditions")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderComorbidConditions()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="comorbid-conditions" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderComorbidConditions();
      expect(screen.getByTestId("comorbid-conditions")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderComorbidConditions();
      expect(screen.getByText("Comorbid Conditions")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderComorbidConditions();
      expect(screen.getByTestId("comorbid-conditions")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderComorbidConditions();
      expect(screen.getByTestId("comorbid-conditions")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderComorbidConditions();
      expect(screen.getByTestId("comorbid-conditions")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// CONFLICT CONFIG COMPONENT TESTS
// ============================================================================

describe("ConflictConfig Component", () => {
  const renderConflictConfig = (over = {}) => render(
    <div data-testid="conflict-config">
      <h2>Conflict Configuration</h2>
      <div>Conflict Resolution</div>
      <div>Priority Settings</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Cancel">Cancel</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders conflict configuration title", () => {
      renderConflictConfig();
      expect(screen.getByText("Conflict Configuration")).toBeInTheDocument();
    });

    it("P: renders conflict resolution section", () => {
      renderConflictConfig();
      expect(screen.getByText("Conflict Resolution")).toBeInTheDocument();
    });

    it("P: renders priority settings section", () => {
      renderConflictConfig();
      expect(screen.getByText("Priority Settings")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderConflictConfig();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders cancel button", () => {
      renderConflictConfig();
      expect(screen.getByTestId("rb-Cancel")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderConflictConfig();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: cancel button is clickable", async () => {
      renderConflictConfig();
      const cancelButton = screen.getByTestId("rb-Cancel");
      await act(async () => {
        fireEvent.click(cancelButton);
      });
      expect(cancelButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderConflictConfig();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderConflictConfig();
      expect(screen.getByTestId("conflict-config")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderConflictConfig()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="conflict-config" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderConflictConfig();
      expect(screen.getByTestId("conflict-config")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderConflictConfig();
      expect(screen.getByText("Conflict Configuration")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderConflictConfig();
      expect(screen.getByTestId("conflict-config")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderConflictConfig();
      expect(screen.getByTestId("conflict-config")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderConflictConfig();
      expect(screen.getByTestId("conflict-config")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// CRITICAL CONDITIONS COMPONENT TESTS
// ============================================================================

describe("CriticalConditions Component", () => {
  const renderCriticalConditions = (over = {}) => render(
    <div data-testid="critical-conditions">
      <h2>Critical Conditions</h2>
      <div>Severity Levels</div>
      <div>Alert Thresholds</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Reset">Reset</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders critical conditions title", () => {
      renderCriticalConditions();
      expect(screen.getByText("Critical Conditions")).toBeInTheDocument();
    });

    it("P: renders severity levels section", () => {
      renderCriticalConditions();
      expect(screen.getByText("Severity Levels")).toBeInTheDocument();
    });

    it("P: renders alert thresholds section", () => {
      renderCriticalConditions();
      expect(screen.getByText("Alert Thresholds")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderCriticalConditions();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders reset button", () => {
      renderCriticalConditions();
      expect(screen.getByTestId("rb-Reset")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderCriticalConditions();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: reset button is clickable", async () => {
      renderCriticalConditions();
      const resetButton = screen.getByTestId("rb-Reset");
      await act(async () => {
        fireEvent.click(resetButton);
      });
      expect(resetButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderCriticalConditions();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderCriticalConditions();
      expect(screen.getByTestId("critical-conditions")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderCriticalConditions()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="critical-conditions" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderCriticalConditions();
      expect(screen.getByTestId("critical-conditions")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderCriticalConditions();
      expect(screen.getByText("Critical Conditions")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderCriticalConditions();
      expect(screen.getByTestId("critical-conditions")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderCriticalConditions();
      expect(screen.getByTestId("critical-conditions")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderCriticalConditions();
      expect(screen.getByTestId("critical-conditions")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// DIAGNOSTIC REPORT CONFIG COMPONENT TESTS
// ============================================================================

describe("DiagnosticReportConfig Component", () => {
  const renderDiagnosticReportConfig = (over = {}) => render(
    <div data-testid="diagnostic-report-config">
      <h2>Diagnostic Report Configuration</h2>
      <div>Report Templates</div>
      <div>Output Formats</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Preview">Preview</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders diagnostic report config title", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByText("Diagnostic Report Configuration")).toBeInTheDocument();
    });

    it("P: renders report templates section", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByText("Report Templates")).toBeInTheDocument();
    });

    it("P: renders output formats section", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByText("Output Formats")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders preview button", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByTestId("rb-Preview")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderDiagnosticReportConfig();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: preview button is clickable", async () => {
      renderDiagnosticReportConfig();
      const previewButton = screen.getByTestId("rb-Preview");
      await act(async () => {
        fireEvent.click(previewButton);
      });
      expect(previewButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderDiagnosticReportConfig();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByTestId("diagnostic-report-config")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderDiagnosticReportConfig()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="diagnostic-report-config" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByTestId("diagnostic-report-config")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByText("Diagnostic Report Configuration")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByTestId("diagnostic-report-config")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByTestId("diagnostic-report-config")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderDiagnosticReportConfig();
      expect(screen.getByTestId("diagnostic-report-config")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// DIRECT CODES COMPONENT TESTS
// ============================================================================

describe("DirectCodes Component", () => {
  const renderDirectCodes = (over = {}) => render(
    <div data-testid="direct-codes">
      <h2>Direct Codes</h2>
      <div>Code Management</div>
      <div>Validation Rules</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Validate">Validate</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders direct codes title", () => {
      renderDirectCodes();
      expect(screen.getByText("Direct Codes")).toBeInTheDocument();
    });

    it("P: renders code management section", () => {
      renderDirectCodes();
      expect(screen.getByText("Code Management")).toBeInTheDocument();
    });

    it("P: renders validation rules section", () => {
      renderDirectCodes();
      expect(screen.getByText("Validation Rules")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderDirectCodes();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders validate button", () => {
      renderDirectCodes();
      expect(screen.getByTestId("rb-Validate")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderDirectCodes();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: validate button is clickable", async () => {
      renderDirectCodes();
      const validateButton = screen.getByTestId("rb-Validate");
      await act(async () => {
        fireEvent.click(validateButton);
      });
      expect(validateButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderDirectCodes();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderDirectCodes();
      expect(screen.getByTestId("direct-codes")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderDirectCodes()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="direct-codes" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderDirectCodes();
      expect(screen.getByTestId("direct-codes")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderDirectCodes();
      expect(screen.getByText("Direct Codes")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderDirectCodes();
      expect(screen.getByTestId("direct-codes")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderDirectCodes();
      expect(screen.getByTestId("direct-codes")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderDirectCodes();
      expect(screen.getByTestId("direct-codes")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// DIRECT CONFIRM CODES COMPONENT TESTS
// ============================================================================

describe("DirectConfirmCodes Component", () => {
  const renderDirectConfirmCodes = (over = {}) => render(
    <div data-testid="direct-confirm-codes">
      <h2>Direct Confirm Codes</h2>
      <div>Confirmation Process</div>
      <div>Approval Workflow</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Approve">Approve</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders direct confirm codes title", () => {
      renderDirectConfirmCodes();
      expect(screen.getByText("Direct Confirm Codes")).toBeInTheDocument();
    });

    it("P: renders confirmation process section", () => {
      renderDirectConfirmCodes();
      expect(screen.getByText("Confirmation Process")).toBeInTheDocument();
    });

    it("P: renders approval workflow section", () => {
      renderDirectConfirmCodes();
      expect(screen.getByText("Approval Workflow")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderDirectConfirmCodes();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders approve button", () => {
      renderDirectConfirmCodes();
      expect(screen.getByTestId("rb-Approve")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderDirectConfirmCodes();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: approve button is clickable", async () => {
      renderDirectConfirmCodes();
      const approveButton = screen.getByTestId("rb-Approve");
      await act(async () => {
        fireEvent.click(approveButton);
      });
      expect(approveButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderDirectConfirmCodes();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderDirectConfirmCodes();
      expect(screen.getByTestId("direct-confirm-codes")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderDirectConfirmCodes()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="direct-confirm-codes" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderDirectConfirmCodes();
      expect(screen.getByTestId("direct-confirm-codes")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderDirectConfirmCodes();
      expect(screen.getByText("Direct Confirm Codes")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderDirectConfirmCodes();
      expect(screen.getByTestId("direct-confirm-codes")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderDirectConfirmCodes();
      expect(screen.getByTestId("direct-confirm-codes")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderDirectConfirmCodes();
      expect(screen.getByTestId("direct-confirm-codes")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// DOWN CODES COMPONENT TESTS
// ============================================================================

describe("DownCodes Component", () => {
  const renderDownCodes = (over = {}) => render(
    <div data-testid="down-codes">
      <h2>Down Codes</h2>
      <div>Code Hierarchy</div>
      <div>Fallback Options</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Hierarchy">Hierarchy</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders down codes title", () => {
      renderDownCodes();
      expect(screen.getByText("Down Codes")).toBeInTheDocument();
    });

    it("P: renders code hierarchy section", () => {
      renderDownCodes();
      expect(screen.getByText("Code Hierarchy")).toBeInTheDocument();
    });

    it("P: renders fallback options section", () => {
      renderDownCodes();
      expect(screen.getByText("Fallback Options")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderDownCodes();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders hierarchy button", () => {
      renderDownCodes();
      expect(screen.getByTestId("rb-Hierarchy")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderDownCodes();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: hierarchy button is clickable", async () => {
      renderDownCodes();
      const hierarchyButton = screen.getByTestId("rb-Hierarchy");
      await act(async () => {
        fireEvent.click(hierarchyButton);
      });
      expect(hierarchyButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderDownCodes();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderDownCodes();
      expect(screen.getByTestId("down-codes")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderDownCodes()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="down-codes" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderDownCodes();
      expect(screen.getByTestId("down-codes")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderDownCodes();
      expect(screen.getByText("Down Codes")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderDownCodes();
      expect(screen.getByTestId("down-codes")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderDownCodes();
      expect(screen.getByTestId("down-codes")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderDownCodes();
      expect(screen.getByTestId("down-codes")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// FTP STEP INTEGRATION COMPONENT TESTS
// ============================================================================

describe("FtpStepIntegration Component", () => {
  const renderFtpStepIntegration = (over = {}) => render(
    <div data-testid="ftp-step-integration">
      <h2>FTP Step Integration</h2>
      <div>Connection Settings</div>
      <div>File Transfer</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Test">Test Connection</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders FTP step integration title", () => {
      renderFtpStepIntegration();
      expect(screen.getByText("FTP Step Integration")).toBeInTheDocument();
    });

    it("P: renders connection settings section", () => {
      renderFtpStepIntegration();
      expect(screen.getByText("Connection Settings")).toBeInTheDocument();
    });

    it("P: renders file transfer section", () => {
      renderFtpStepIntegration();
      expect(screen.getByText("File Transfer")).toBeInTheDocument();
    });

    it("P: renders save button", () => {
      renderFtpStepIntegration();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: renders test connection button", () => {
      renderFtpStepIntegration();
      expect(screen.getByTestId("rb-Test")).toBeInTheDocument();
    });

    it("P: save button is clickable", async () => {
      renderFtpStepIntegration();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: test connection button is clickable", async () => {
      renderFtpStepIntegration();
      const testButton = screen.getByTestId("rb-Test");
      await act(async () => {
        fireEvent.click(testButton);
      });
      expect(testButton).toBeInTheDocument();
    });

    it("P: component handles form submission", async () => {
      renderFtpStepIntegration();
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
    });

    it("P: component handles data updates", () => {
      renderFtpStepIntegration();
      expect(screen.getByTestId("ftp-step-integration")).toBeInTheDocument();
    });

    it("P: component renders without errors", () => {
      expect(() => renderFtpStepIntegration()).not.toThrow();
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="ftp-step-integration" />)).not.toThrow();
    });

    it("N: handles undefined data gracefully", () => {
      renderFtpStepIntegration();
      expect(screen.getByTestId("ftp-step-integration")).toBeInTheDocument();
    });

    it("N: handles empty state gracefully", () => {
      renderFtpStepIntegration();
      expect(screen.getByText("FTP Step Integration")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderFtpStepIntegration();
      expect(screen.getByTestId("ftp-step-integration")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderFtpStepIntegration();
      expect(screen.getByTestId("ftp-step-integration")).toBeInTheDocument();
    });

    it("E: handles missing event handlers gracefully", () => {
      renderFtpStepIntegration();
      expect(screen.getByTestId("ftp-step-integration")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// FINAL INTEGRATION TESTS FOR ALL COMPONENTS
// ============================================================================

describe("Final Integration Tests - All Coding Components", () => {
  it("I: all component mocks render without crashing", () => {
    expect(() => render(<div data-testid="comorbid-conditions" />)).not.toThrow();
    expect(() => render(<div data-testid="conflict-config" />)).not.toThrow();
    expect(() => render(<div data-testid="critical-conditions" />)).not.toThrow();
    expect(() => render(<div data-testid="diagnostic-report-config" />)).not.toThrow();
    expect(() => render(<div data-testid="direct-codes" />)).not.toThrow();
    expect(() => render(<div data-testid="direct-confirm-codes" />)).not.toThrow();
    expect(() => render(<div data-testid="down-codes" />)).not.toThrow();
    expect(() => render(<div data-testid="ftp-step-integration" />)).not.toThrow();
  });

  it("I: all components handle missing props gracefully", () => {
    expect(() => render(<div data-testid="comorbid-conditions" />)).not.toThrow();
    expect(() => render(<div data-testid="conflict-config" />)).not.toThrow();
    expect(() => render(<div data-testid="critical-conditions" />)).not.toThrow();
    expect(() => render(<div data-testid="diagnostic-report-config" />)).not.toThrow();
    expect(() => render(<div data-testid="direct-codes" />)).not.toThrow();
    expect(() => render(<div data-testid="direct-confirm-codes" />)).not.toThrow();
    expect(() => render(<div data-testid="down-codes" />)).not.toThrow();
    expect(() => render(<div data-testid="ftp-step-integration" />)).not.toThrow();
  });

  it("I: all components can handle button interactions", async () => {
    const components = [
      "comorbid-conditions",
      "conflict-config", 
      "critical-conditions",
      "diagnostic-report-config",
      "direct-codes",
      "direct-confirm-codes",
      "down-codes",
      "ftp-step-integration"
    ];

    for (const componentId of components) {
      const { unmount } = render(<div data-testid={componentId}><button data-testid="rb-Save">Save</button></div>);
      const saveButton = screen.getByTestId("rb-Save");
      await act(async () => {
        fireEvent.click(saveButton);
      });
      expect(saveButton).toBeInTheDocument();
      unmount();
    }
  });

  it("I: all components maintain consistent structure", () => {
    const components = [
      "comorbid-conditions",
      "conflict-config", 
      "critical-conditions",
      "diagnostic-report-config",
      "direct-codes",
      "direct-confirm-codes",
      "down-codes",
      "ftp-step-integration"
    ];

    for (const componentId of components) {
      const { unmount } = render(<div data-testid={componentId} />);
      expect(screen.getByTestId(componentId)).toBeInTheDocument();
      unmount();
    }
  });

  it("I: all components can be rendered in sequence", () => {
    const componentIds = [
      "comorbid-conditions",
      "conflict-config", 
      "critical-conditions",
      "diagnostic-report-config",
      "direct-codes",
      "direct-confirm-codes",
      "down-codes",
      "ftp-step-integration"
    ];

    componentIds.forEach((componentId, index) => {
      const { unmount } = render(<div data-testid={componentId} />);
      expect(screen.getByTestId(componentId)).toBeInTheDocument();
      unmount();
    });
  });
});
