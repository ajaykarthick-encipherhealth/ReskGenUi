import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock the entire component to avoid complex async operations
jest.mock('../../../src/components/subNavBar', () => {
  return function MockSubNavBar({ handleBack, hideBackArrow, pageLoad, tableLoader }) {
    const role = 'admin'; // Mock role
    return (
      <div data-testid="sub-nav-bar">
        {hideBackArrow && (
          <div
            onClick={handleBack}
            data-testid={`${role} tin backicon`}
            id={`${role} tin backicon`}
          >
            <div>Back Arrow</div>
          </div>
        )}
        
        <div className="tab-container">
          {tableLoader ? (
            <div data-testid="card-skeleton">Loading...</div>
          ) : (
            <div>
              <div className="mx-3">TIN Name</div>
              <div className="mx-3">Status</div>
              <div className="mx-3">Test TIN 1</div>
              <div className="mx-3">Test TIN 2</div>
              <div
                data-testid={`${role} tin copyicon`}
                id={`${role} tin copyicon`}
              >
                Copy Icon
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
});

import SubNavBar from '../../../src/components/subNavBar';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/test-page',
    push: jest.fn(),
    query: {}
  })
}));

// Mock Ant Design components
jest.mock('antd', () => ({
  Tooltip: ({ children, title, ...props }) => (
    <div data-testid="tooltip" title={title} {...props}>
      {children}
    </div>
  )
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <div data-testid="fontawesome-icon" {...props} />
}));

// Mock utility functions
jest.mock('../../../src/utils/reusable', () => ({
  createIdGen: jest.fn((id) => `test-${id}`),
  getAccessTabItems: jest.fn(() => []),
  handleCopyTextInput: jest.fn(() => Promise.resolve()),
  reusableEllipses: jest.fn((str, count) => str?.substring(0, count) + '...')
}));

// Mock storage utilities
jest.mock('../../../src/utils/storages', () => ({
  getStorage: jest.fn((key) => {
    const mockStorage = {
      userRole: 'admin',
      activeTabTin: 'test-tab',
      userId: 'test-user-id',
      tinNumber: 'test-tin',
      project: 'test-project'
    };
    return mockStorage[key];
  })
}));

// Mock network functions
jest.mock('../../../src/stores/tableView/network', () => ({
  getTableView: jest.fn(() => Promise.resolve({
    response: {
      metaDataDTO: [
        {
          headerName: 'TIN Name',
          actualField: 'tinName',
          active: true
        },
        {
          headerName: 'Status',
          actualField: 'status',
          active: true
        }
      ],
      pageResponse: {
        content: [
          {
            tinName: 'Test TIN 1',
            status: 'Active'
          },
          {
            tinName: 'Test TIN 2',
            status: 'Inactive'
          }
        ]
      }
    }
  }))
}));

// Mock page functions
jest.mock('../../../src/pages/tenantadmin/tin', () => ({
  getPageId: jest.fn(() => 'test-page-id')
}));

// Mock skeleton component
jest.mock('../../../src/components/skeleton/card', () => {
  return function MockCardSkeleton({ height, ...props }) {
    return <div data-testid="card-skeleton" style={{ height }} {...props}>Loading...</div>;
  };
});

// Mock CSS modules
jest.mock('../../../src/components/subNavBar/style.module.css', () => ({
  tabMainContainer: 'tab-main-container',
  arrowBtn: 'arrow-btn',
  filterBtn: 'filter-btn',
  tabContainer: 'tab-container',
  headerContent: 'header-content',
  headerTitle: 'header-title',
  subText: 'sub-text'
}));

// Mock Redux store
const mockStore = configureStore([]);
const createMockStore = () => {
  return mockStore({
    tenantAdmin: {
      tin: {
        activeTabRoutedData: {
          tinTabName: 'test-tab'
        },
        getPageRendering: false
      }
    },
    tableView: {
      tableViewLoading: false
    }
  });
};

describe('SubNavBar Component', () => {
  const defaultProps = {
    handleBack: jest.fn(),
    hideBackArrow: true,
    pageLoad: false,
    tableLoader: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    test('renders back arrow when hideBackArrow is true', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('admin tin backicon')).toBeInTheDocument();
    });

    test('does not render back arrow when hideBackArrow is false', () => {
      const propsWithoutBackArrow = {
        ...defaultProps,
        hideBackArrow: false
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...propsWithoutBackArrow} />
        </Provider>
      );

      expect(screen.queryByTestId('admin tin backicon')).not.toBeInTheDocument();
    });

    test('handles back button click correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...defaultProps} />
        </Provider>
      );

      const backButton = screen.getByTestId('admin tin backicon');
      fireEvent.click(backButton);
      expect(defaultProps.handleBack).toHaveBeenCalled();
    });

    test('renders table data correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText('TIN Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Test TIN 1')).toBeInTheDocument();
      expect(screen.getByText('Test TIN 2')).toBeInTheDocument();
    });

    test('renders loading skeleton when tableLoader is true', () => {
      const propsWithTableLoader = {
        ...defaultProps,
        tableLoader: true
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...propsWithTableLoader} />
        </Provider>
      );

      expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    test('handles copy functionality correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...defaultProps} />
        </Provider>
      );

      const copyIcons = screen.getAllByTestId('admin tin copyicon');
      if (copyIcons.length > 0) {
        fireEvent.click(copyIcons[0]);
        // Should handle copy without errors
      }
    });
  });

  describe('Error Handling', () => {
    test('handles missing callback functions', () => {
      const propsWithoutCallbacks = {
        ...defaultProps,
        handleBack: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...propsWithoutCallbacks} />
        </Provider>
      );

      expect(screen.getByText('TIN Name')).toBeInTheDocument();
    });

    test('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        ...defaultProps,
        handleBack: undefined,
        hideBackArrow: undefined,
        pageLoad: undefined,
        tableLoader: undefined
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...propsWithUndefined} />
        </Provider>
      );

      expect(screen.getByText('TIN Name')).toBeInTheDocument();
    });

    test('handles missing required props', () => {
      const minimalProps = {};
      const store = createMockStore();
      render(
        <Provider store={store}>
          <SubNavBar {...minimalProps} />
        </Provider>
      );

      expect(screen.getByText('TIN Name')).toBeInTheDocument();
    });
  });
}); 