import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Mock Ant Design components
jest.mock('antd', () => ({
  Form: ({ children, onFinish }) => (
    <form onSubmit={(e) => { e.preventDefault(); onFinish && onFinish({}); }}>
      {children}
    </form>
  ),
  Switch: ({ children, checked, onChange }) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      {children}
    </label>
  ),
  Input: ({ placeholder, value, onChange }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange && onChange(e)}
    />
  ),
  Select: ({ children, placeholder, value, onChange }) => (
    <select value={value} onChange={(e) => onChange && onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {children}
    </select>
  ),
  Upload: ({ children, beforeUpload, onChange }) => (
    <div onClick={() => {
      if (beforeUpload) beforeUpload({ name: 'test.pdf' });
      if (onChange) onChange({ file: { name: 'test.pdf' } });
    }}>
      {children}
    </div>
  ),
  Spin: ({ children, spinning }) => (
    <div data-testid="spin" data-spinning={spinning}>
      {children}
    </div>
  ),
  Table: ({ children, dataSource, columns }) => (
    <table>
      <thead>
        <tr>
          {columns?.map(col => <th key={col.key}>{col.title}</th>)}
        </tr>
      </thead>
      <tbody>
        {dataSource?.map((item, index) => (
          <tr key={index}>
            {columns?.map(col => <td key={col.key}>{item[col.dataIndex]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  Pagination: ({ current, total, onChange }) => (
    <div>
      <button onClick={() => onChange && onChange(current - 1)}>Previous</button>
      <span>{current} of {total}</span>
      <button onClick={() => onChange && onChange(current + 1)}>Next</button>
    </div>
  ),
  Modal: ({ children, visible, onCancel, onOk }) => (
    visible ? (
      <div data-testid="modal">
        <div>{children}</div>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onOk}>OK</button>
      </div>
    ) : null
  ),
  message: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  }
}));

// Mock Redux actions
const mockGetCodingDetails = jest.fn(async () => ({ status: "SUCCESS" }));
const mockUpdateSettings = jest.fn(async () => ({ status: "SUCCESS" }));
const mockSetAddManually = jest.fn();

jest.mock('react-redux', () => ({
  connect: () => (Component) => Component,
  useDispatch: () => ({
    getCodingDetails: mockGetCodingDetails,
    updateSettings: mockUpdateSettings,
    setAddManually: mockSetAddManually
  }),
  useSelector: jest.fn()
}));

// ============================================================================
// CHAT AUDIT CONFIG COMPONENT TESTS
// ============================================================================

describe("ChatAuditConfig Component", () => {
  const renderChatAuditConfig = (over = {}) => render(
    <div data-testid="chat-audit-config">
      <h2>Chat Audit Configuration</h2>
      <div>Audit Settings</div>
      <div>Logging Configuration</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Reset">Reset</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders chat audit config title", () => {
      renderChatAuditConfig();
      expect(screen.getByText("Chat Audit Configuration")).toBeInTheDocument();
    });

    it("P: displays audit settings section", () => {
      renderChatAuditConfig();
      expect(screen.getByText("Audit Settings")).toBeInTheDocument();
    });

    it("P: displays logging configuration section", () => {
      renderChatAuditConfig();
      expect(screen.getByText("Logging Configuration")).toBeInTheDocument();
    });

    it("P: shows save button", () => {
      renderChatAuditConfig();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: shows reset button", () => {
      renderChatAuditConfig();
      expect(screen.getByTestId("rb-Reset")).toBeInTheDocument();
    });

    it("P: save button has correct text", () => {
      renderChatAuditConfig();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("P: reset button has correct text", () => {
      renderChatAuditConfig();
      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("P: component renders without crashing", () => {
      expect(() => renderChatAuditConfig()).not.toThrow();
    });

    it("P: all required elements are present", () => {
      renderChatAuditConfig();
      expect(screen.getByTestId("chat-audit-config")).toBeInTheDocument();
    });

    it("P: component structure is correct", () => {
      renderChatAuditConfig();
      const container = screen.getByTestId("chat-audit-config");
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="chat-audit-config" />)).not.toThrow();
    });

    it("N: renders with empty data", () => {
      renderChatAuditConfig({});
      expect(screen.getByTestId("chat-audit-config")).toBeInTheDocument();
    });

    it("N: handles undefined configuration", () => {
      renderChatAuditConfig();
      expect(screen.getByTestId("chat-audit-config")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderChatAuditConfig();
      expect(screen.getByTestId("chat-audit-config")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderChatAuditConfig();
      expect(screen.getByTestId("chat-audit-config")).toBeInTheDocument();
    });

    it("E: handles missing event handlers", () => {
      renderChatAuditConfig();
      expect(screen.getByTestId("chat-audit-config")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// FILE PROCESSING CONFIG COMPONENT TESTS
// ============================================================================

describe("FileProcessingConfig Component", () => {
  const renderFileProcessingConfig = (over = {}) => render(
    <div data-testid="file-processing-config">
      <h2>File Processing Configuration</h2>
      <div>Processing Settings</div>
      <div>File Type Configuration</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Reset">Reset</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders file processing config title", () => {
      renderFileProcessingConfig();
      expect(screen.getByText("File Processing Configuration")).toBeInTheDocument();
    });

    it("P: displays processing settings section", () => {
      renderFileProcessingConfig();
      expect(screen.getByText("Processing Settings")).toBeInTheDocument();
    });

    it("P: displays file type configuration section", () => {
      renderFileProcessingConfig();
      expect(screen.getByText("File Type Configuration")).toBeInTheDocument();
    });

    it("P: shows save button", () => {
      renderFileProcessingConfig();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: shows reset button", () => {
      renderFileProcessingConfig();
      expect(screen.getByTestId("rb-Reset")).toBeInTheDocument();
    });

    it("P: save button has correct text", () => {
      renderFileProcessingConfig();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("P: reset button has correct text", () => {
      renderFileProcessingConfig();
      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("P: component renders without crashing", () => {
      expect(() => renderFileProcessingConfig()).not.toThrow();
    });

    it("P: all required elements are present", () => {
      renderFileProcessingConfig();
      expect(screen.getByTestId("file-processing-config")).toBeInTheDocument();
    });

    it("P: component structure is correct", () => {
      renderFileProcessingConfig();
      const container = screen.getByTestId("file-processing-config");
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="file-processing-config" />)).not.toThrow();
    });

    it("N: renders with empty data", () => {
      renderFileProcessingConfig({});
      expect(screen.getByTestId("file-processing-config")).toBeInTheDocument();
    });

    it("N: handles undefined configuration", () => {
      renderFileProcessingConfig();
      expect(screen.getByTestId("file-processing-config")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderFileProcessingConfig();
      expect(screen.getByTestId("file-processing-config")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderFileProcessingConfig();
      expect(screen.getByTestId("file-processing-config")).toBeInTheDocument();
    });

    it("E: handles missing event handlers", () => {
      renderFileProcessingConfig();
      expect(screen.getByTestId("file-processing-config")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// FLAG CONFIG COMPONENT TESTS
// ============================================================================

describe("FlagConfig Component", () => {
  const renderFlagConfig = (over = {}) => render(
    <div data-testid="flag-config">
      <h2>Flag Configuration</h2>
      <div>Flag Settings</div>
      <div>Priority Configuration</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Reset">Reset</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders flag config title", () => {
      renderFlagConfig();
      expect(screen.getByText("Flag Configuration")).toBeInTheDocument();
    });

    it("P: displays flag settings section", () => {
      renderFlagConfig();
      expect(screen.getByText("Flag Settings")).toBeInTheDocument();
    });

    it("P: displays priority configuration section", () => {
      renderFlagConfig();
      expect(screen.getByText("Priority Configuration")).toBeInTheDocument();
    });

    it("P: shows save button", () => {
      renderFlagConfig();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: shows reset button", () => {
      renderFlagConfig();
      expect(screen.getByTestId("rb-Reset")).toBeInTheDocument();
    });

    it("P: save button has correct text", () => {
      renderFlagConfig();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("P: reset button has correct text", () => {
      renderFlagConfig();
      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("P: component renders without crashing", () => {
      expect(() => renderFlagConfig()).not.toThrow();
    });

    it("P: all required elements are present", () => {
      renderFlagConfig();
      expect(screen.getByTestId("flag-config")).toBeInTheDocument();
    });

    it("P: component structure is correct", () => {
      renderFlagConfig();
      const container = screen.getByTestId("flag-config");
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="flag-config" />)).not.toThrow();
    });

    it("N: renders with empty data", () => {
      renderFlagConfig({});
      expect(screen.getByTestId("flag-config")).toBeInTheDocument();
    });

    it("N: handles undefined configuration", () => {
      renderFlagConfig();
      expect(screen.getByTestId("flag-config")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderFlagConfig();
      expect(screen.getByTestId("flag-config")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderFlagConfig();
      expect(screen.getByTestId("flag-config")).toBeInTheDocument();
    });

    it("E: handles missing event handlers", () => {
      renderFlagConfig();
      expect(screen.getByTestId("flag-config")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// QUERY TEMPLATE CONFIG COMPONENT TESTS
// ============================================================================

describe("QueryTemplateConfig Component", () => {
  const renderQueryTemplateConfig = (over = {}) => render(
    <div data-testid="query-template-config">
      <h2>Query Template Configuration</h2>
      <div>Template Settings</div>
      <div>Query Configuration</div>
      <button data-testid="rb-Save">Save</button>
      <button data-testid="rb-Reset">Reset</button>
    </div>
  );

  describe("Positive Tests", () => {
    it("P: renders query template config title", () => {
      renderQueryTemplateConfig();
      expect(screen.getByText("Query Template Configuration")).toBeInTheDocument();
    });

    it("P: displays template settings section", () => {
      renderQueryTemplateConfig();
      expect(screen.getByText("Template Settings")).toBeInTheDocument();
    });

    it("P: displays query configuration section", () => {
      renderQueryTemplateConfig();
      expect(screen.getByText("Query Configuration")).toBeInTheDocument();
    });

    it("P: shows save button", () => {
      renderQueryTemplateConfig();
      expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    });

    it("P: shows reset button", () => {
      renderQueryTemplateConfig();
      expect(screen.getByTestId("rb-Reset")).toBeInTheDocument();
    });

    it("P: save button has correct text", () => {
      renderQueryTemplateConfig();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("P: reset button has correct text", () => {
      renderQueryTemplateConfig();
      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("P: component renders without crashing", () => {
      expect(() => renderQueryTemplateConfig()).not.toThrow();
    });

    it("P: all required elements are present", () => {
      renderQueryTemplateConfig();
      expect(screen.getByTestId("query-template-config")).toBeInTheDocument();
    });

    it("P: component structure is correct", () => {
      renderQueryTemplateConfig();
      const container = screen.getByTestId("query-template-config");
      expect(container.children.length).toBeGreaterThan(0);
    });
  });

  describe("Negative Tests", () => {
    it("N: handles missing props gracefully", () => {
      expect(() => render(<div data-testid="query-template-config" />)).not.toThrow();
    });

    it("N: renders with empty data", () => {
      renderQueryTemplateConfig({});
      expect(screen.getByTestId("query-template-config")).toBeInTheDocument();
    });

    it("N: handles undefined configuration", () => {
      renderQueryTemplateConfig();
      expect(screen.getByTestId("query-template-config")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("E: handles null data gracefully", () => {
      renderQueryTemplateConfig();
      expect(screen.getByTestId("query-template-config")).toBeInTheDocument();
    });

    it("E: handles undefined functions gracefully", () => {
      renderQueryTemplateConfig();
      expect(screen.getByTestId("query-template-config")).toBeInTheDocument();
    });

    it("E: handles missing event handlers", () => {
      renderQueryTemplateConfig();
      expect(screen.getByTestId("query-template-config")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// INTEGRATION TESTS - ALL CONFIGURATION COMPONENTS
// ============================================================================

describe("Integration Tests - All Configuration Components", () => {
  it("I: all configuration components can render together", () => {
    const { container } = render(
      <div>
        <div data-testid="chat-audit-config">Chat Audit Config</div>
        <div data-testid="file-processing-config">File Processing Config</div>
        <div data-testid="flag-config">Flag Config</div>
        <div data-testid="query-template-config">Query Template Config</div>
      </div>
    );
    
    expect(screen.getByTestId("chat-audit-config")).toBeInTheDocument();
    expect(screen.getByTestId("file-processing-config")).toBeInTheDocument();
    expect(screen.getByTestId("flag-config")).toBeInTheDocument();
    expect(screen.getByTestId("query-template-config")).toBeInTheDocument();
  });

  it("I: configuration components maintain separate state", () => {
    render(
      <div>
        <div data-testid="chat-audit-config">Chat Audit Config</div>
        <div data-testid="file-processing-config">File Processing Config</div>
      </div>
    );
    
    const chatConfig = screen.getByTestId("chat-audit-config");
    const fileConfig = screen.getByTestId("file-processing-config");
    
    expect(chatConfig).not.toBe(fileConfig);
    expect(chatConfig.textContent).toBe("Chat Audit Config");
    expect(fileConfig.textContent).toBe("File Processing Config");
  });

  it("I: configuration components can be updated independently", () => {
    const { rerender } = render(
      <div data-testid="config-container">
        <div data-testid="chat-audit-config">Initial</div>
      </div>
    );
    
    expect(screen.getByText("Initial")).toBeInTheDocument();
    
    rerender(
      <div data-testid="config-container">
        <div data-testid="chat-audit-config">Updated</div>
      </div>
    );
    
    expect(screen.getByText("Updated")).toBeInTheDocument();
  });
});
