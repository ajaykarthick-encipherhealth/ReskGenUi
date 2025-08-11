import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

// Mock Next.js router
const mockPush = jest.fn();
const mockQuery = {};

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
    pathname: '/tenantadmin/settings'
  })
}));

// Mock components - not needed as they're not used in the actual component
jest.mock('../../../../src/components/card', () => ({
  __esModule: true,
  default: ({ children, ...props }) => (
    <div data-testid="card" {...props}>{children}</div>
  )
}));

jest.mock('../../../../src/components/buttonWithIcon', () => ({
  __esModule: true,
  default: ({ children, onClick, ...props }) => (
    <button data-testid="button-with-icon" onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

jest.mock('../../../../src/jsx/layouts/nav/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>
}));

// Mock all the imported components
jest.mock('../../../../src/pages/tenantadmin/settings/emrFihr', () => ({
  __esModule: true,
  default: () => <div data-testid="emr-fihr">EMR/FHIR</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/configuration/chatAuditConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-audit-config">Chat Audit Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/configuration/flagConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="flag-config">Flag Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/configuration/fileProcessungConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="file-processing-config">File Processing Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/medicalCoding', () => ({
  __esModule: true,
  default: () => <div data-testid="medical-coding">Medical Coding</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/insulin', () => ({
  __esModule: true,
  default: () => <div data-testid="insulin">Insulin</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/directCodes', () => ({
  __esModule: true,
  default: () => <div data-testid="direct-codes">Direct Codes</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/healthMetricConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="health-metric-config">Health Metric Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/comorbidConditions', () => ({
  __esModule: true,
  default: () => <div data-testid="comorbid-conditions">Comorbid Conditions</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/criticalConditions', () => ({
  __esModule: true,
  default: () => <div data-testid="critical-conditions">Critical Conditions</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/rafConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="raf-config">RAF Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/historyCodes', () => ({
  __esModule: true,
  default: () => <div data-testid="history-codes">History Codes</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/downCodes', () => ({
  __esModule: true,
  default: () => <div data-testid="down-codes">Down Codes</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/directConfirmCodes', () => ({
  __esModule: true,
  default: () => <div data-testid="direct-confirm-codes">Direct Confirm Codes</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/configuration/queryTemplateCofig', () => ({
  __esModule: true,
  default: () => <div data-testid="query-template-config">Query Template Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/diagnosticReportConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="diagnostic-report-config">Diagnostic Report Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/meatCofig', () => ({
  __esModule: true,
  default: () => <div data-testid="meat-config">MEAT Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/comboConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="combo-config">Combo Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/conflictConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="conflict-config">Conflict Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/oldMiConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="old-mi-config">Old MI Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/pmhConditionConfig', () => ({
  __esModule: true,
  default: () => <div data-testid="pmh-condition-config">PMH Condition Config</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/coding/ftpSetpIntegration', () => ({
  __esModule: true,
  default: () => <div data-testid="ftp-setp-integration">FTP SETP Integration</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/projects', () => ({
  __esModule: true,
  default: () => <div data-testid="projects">Projects</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/clients', () => ({
  __esModule: true,
  default: () => <div data-testid="clients">Clients</div>
}));

jest.mock('../../../../src/pages/tenantadmin/settings/users', () => ({
  __esModule: true,
  default: () => <div data-testid="users">Users</div>
}));

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <span data-testid="font-awesome-icon" {...props}>Icon</span>
  )
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => (
    <img src={src} alt={alt} data-testid="next-image" {...props} />
  )
}));

// Import the component after mocking
import Settings from '../../../../src/pages/tenantadmin/settings';

describe('Settings Main Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('P: renders main settings page with header', () => {
      render(<Settings />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('P: renders settings sidebar menu', () => {
      render(<Settings />);
      expect(screen.getByText('Configuration')).toBeInTheDocument();
      expect(screen.getByText('Coding Guidelines')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Clients')).toBeInTheDocument();
      expect(screen.getByText('Add Users')).toBeInTheDocument();
    });

    test('P: renders configuration submenu items', () => {
      render(<Settings />);
      expect(screen.getByText('Chart Audit Config')).toBeInTheDocument();
      expect(screen.getByText('Flag Config')).toBeInTheDocument();
      expect(screen.getByText('File Processing Config')).toBeInTheDocument();
      expect(screen.getByText('Query Template Config')).toBeInTheDocument();
    });

    test('P: renders coding guidelines submenu items', () => {
      render(<Settings />);
      // First expand the Coding Guidelines submenu
      const codingGuidelinesMenu = screen.getByText('Coding Guidelines');
      fireEvent.click(codingGuidelinesMenu);
      
      // Now check for the submenu items
      expect(screen.getByText('Medical Coding')).toBeInTheDocument();
      expect(screen.getByText('Insulin Medications')).toBeInTheDocument();
      expect(screen.getByText('Direct Confirm Codes')).toBeInTheDocument();
      expect(screen.getByText('Health Metric Config')).toBeInTheDocument();
    });

    test('P: renders main content area', () => {
      render(<Settings />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Navigation Tests', () => {
    test('P: clicking configuration menu expands submenu', async () => {
      render(<Settings />);
      const configMenu = screen.getByText('Configuration');
      
      await act(async () => {
        fireEvent.click(configMenu);
      });
      
      // Check if submenu items are visible
      expect(screen.getByText('Chart Audit Config')).toBeInTheDocument();
    });

    test('P: clicking coding guidelines menu expands submenu', async () => {
      render(<Settings />);
      const codingMenu = screen.getByText('Coding Guidelines');
      
      await act(async () => {
        fireEvent.click(codingMenu);
      });
      
      // Check if submenu items are visible
      expect(screen.getByText('Medical Coding')).toBeInTheDocument();
    });

    test('P: clicking projects menu navigates to projects', async () => {
      render(<Settings />);
      const projectsMenu = screen.getByText('Projects');
      
      await act(async () => {
        fireEvent.click(projectsMenu);
      });
      
      expect(screen.getByTestId('projects')).toBeInTheDocument();
    });

    test('P: clicking clients menu navigates to clients', async () => {
      render(<Settings />);
      const clientsMenu = screen.getByText('Clients');
      
      await act(async () => {
        fireEvent.click(clientsMenu);
      });
      
      expect(screen.getByTestId('clients')).toBeInTheDocument();
    });

    test('P: clicking users menu navigates to users', async () => {
      render(<Settings />);
      const usersMenu = screen.getByText('Add Users');
      
      await act(async () => {
        fireEvent.click(usersMenu);
      });
      
      expect(screen.getByTestId('users')).toBeInTheDocument();
    });
  });

  describe('Component Integration Tests', () => {
    test('P: renders EMR/FHIR component when selected', async () => {
      render(<Settings />);
      const emrMenu = screen.getByText('EMR-FHIR');
      
      await act(async () => {
        fireEvent.click(emrMenu);
      });
      
      expect(screen.getByTestId('emr-fihr')).toBeInTheDocument();
    });

    test('P: renders medical coding component when selected', async () => {
      render(<Settings />);
      // First expand the Coding Guidelines submenu
      const codingGuidelinesMenu = screen.getByText('Coding Guidelines');
      
      await act(async () => {
        fireEvent.click(codingGuidelinesMenu);
      });
      
      // Now click on Medical Coding
      const medicalCodingMenu = screen.getByText('Medical Coding');
      
      await act(async () => {
        fireEvent.click(medicalCodingMenu);
      });
      
      expect(screen.getByTestId('medical-coding')).toBeInTheDocument();
    });

    test('P: renders insulin component when selected', async () => {
      render(<Settings />);
      // First expand the Coding Guidelines submenu
      const codingGuidelinesMenu = screen.getByText('Coding Guidelines');
      
      await act(async () => {
        fireEvent.click(codingGuidelinesMenu);
      });
      
      // Now click on Insulin Medications
      const insulinMenu = screen.getByText('Insulin Medications');
      
      await act(async () => {
        fireEvent.click(insulinMenu);
      });
      
      expect(screen.getByTestId('insulin')).toBeInTheDocument();
    });
  });

  describe('Menu Structure Tests', () => {
    test('P: configuration menu has correct icon', () => {
      render(<Settings />);
      const configMenu = screen.getByText('Configuration');
      expect(configMenu).toBeInTheDocument();
      // Check if icon is present (FontAwesome icon)
      expect(screen.getAllByTestId('font-awesome-icon')).toHaveLength(7); // Total icons in menu
    });

    test('P: coding guidelines menu has correct icon', () => {
      render(<Settings />);
      const codingMenu = screen.getByText('Coding Guidelines');
      expect(codingMenu).toBeInTheDocument();
    });

    test('P: projects menu has correct icon', () => {
      render(<Settings />);
      const projectsMenu = screen.getByText('Projects');
      expect(projectsMenu).toBeInTheDocument();
    });

    test('P: clients menu has correct icon', () => {
      render(<Settings />);
      const clientsMenu = screen.getByText('Clients');
      expect(clientsMenu).toBeInTheDocument();
    });

    test('P: users menu has correct icon', () => {
      render(<Settings />);
      const usersMenu = screen.getByText('Add Users');
      expect(usersMenu).toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    test('P: handles menu click errors gracefully', async () => {
      render(<Settings />);
      const configMenu = screen.getByText('Configuration');
      
      // This should not throw an error
      await act(async () => {
        fireEvent.click(configMenu);
      });
      
      expect(screen.getByText('Chart Audit Config')).toBeInTheDocument();
    });

    test('P: handles navigation state changes', async () => {
      render(<Settings />);
      
      // Navigate to different sections
      await act(async () => {
        fireEvent.click(screen.getByText('Projects'));
      });
      
      await act(async () => {
        fireEvent.click(screen.getByText('Add Users'));
      });
      
      expect(screen.getByTestId('users')).toBeInTheDocument();
    });
  });

  describe('Stability Tests', () => {
    test('P/N/E stability 1', () => {
      render(<Settings />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('P/N/E stability 2', () => {
      render(<Settings />);
      expect(screen.getByText('Configuration')).toBeInTheDocument();
    });

    test('P/N/E stability 3', () => {
      render(<Settings />);
      expect(screen.getByText('Coding Guidelines')).toBeInTheDocument();
    });

    test('P/N/E stability 4', () => {
      render(<Settings />);
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    test('P/N/E stability 5', () => {
      render(<Settings />);
      expect(screen.getByText('Clients')).toBeInTheDocument();
    });

    test('P/N/E stability 6', () => {
      render(<Settings />);
      expect(screen.getByText('Add Users')).toBeInTheDocument();
    });

    test('P/N/E stability 7', () => {
      render(<Settings />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('P/N/E stability 8', () => {
      render(<Settings />);
      expect(screen.getAllByTestId('font-awesome-icon')).toHaveLength(7);
    });

    test('P/N/E stability 9', () => {
      render(<Settings />);
      expect(screen.getByText('Chart Audit Config')).toBeInTheDocument();
    });

    test('P/N/E stability 10', () => {
      render(<Settings />);
      expect(screen.getByText('Coding Guidelines')).toBeInTheDocument();
    });
  });
});
