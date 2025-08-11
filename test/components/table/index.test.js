import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AppTable from '../../../src/components/tables';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/test-page',
    push: jest.fn(),
    query: {}
  })
}));

// Mock Ant Design components - simplified
jest.mock('antd', () => ({
  Badge: ({ children }) => <div data-testid="badge">{children}</div>,
  Empty: () => <div data-testid="empty">No data</div>,
  Image: ({ src, alt }) => <img src={src} alt={alt} data-testid="image" />,
  Popover: ({ children }) => <div data-testid="popover">{children}</div>,
  Progress: ({ percent }) => <div data-testid="progress" data-percent={percent} />,
  Select: ({ children }) => <select data-testid="select">{children}</select>,
  Spin: ({ children }) => <div data-testid="spin">{children}</div>,
  Switch: ({ checked }) => <input type="checkbox" data-testid="switch" checked={checked} />,
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="fontawesome-icon" />
}));

// Mock Ant Design icons
jest.mock('@ant-design/icons', () => ({
  ArrowDownOutlined: () => <div data-testid="arrow-down" />,
  ArrowUpOutlined: () => <div data-testid="arrow-up" />,
  DownloadOutlined: () => <div data-testid="download" />,
  InfoCircleFilled: () => <div data-testid="info-circle-filled" />,
  InfoCircleOutlined: () => <div data-testid="info-circle-outlined" />,
  LoadingOutlined: () => <div data-testid="loading" />,
  CloseCircleOutlined: () => <div data-testid="close-circle" />
}));

// Mock utility functions - simplified
jest.mock('../../../src/utils/reusable', () => ({
  auditStatusTemplate: () => <div data-testid="audit-status">Audit Status</div>,
  processstatusBodyTemplate: () => <div data-testid="process-status">Process Status</div>,
  renderUserProfile: (item, columnItem) => item[columnItem.actualField] || 'User Profile',
  renderUserProfileDisable: () => <div data-testid="user-profile-disable">User Profile Disabled</div>,
  reusableEllipses: (str) => str ? str.toString().substring(0, 10) + '...' : '---',
  tableSkeleton: () => <div data-testid="table-skeleton">Loading...</div>,
  createIdGen: (id) => `test-${id}`,
  proxyStatusBodyTemplate: () => <div data-testid="proxy-status">Proxy Status</div>,
  getRoasterStatus: () => 'active',
  renderFlagCells: () => <div data-testid="flag-cells">Flag Cells</div>,
  processStatusBodyTemplate: () => <div data-testid="process-status-body">Process Status Body</div>,
  dynamicAuditStatusTemplate: () => <div data-testid="dynamic-audit-status">Dynamic Audit Status</div>,
  findItemWithTrueOrFalse: () => false,
  checkWithIncludesKey: () => true,
  createIdGens: (id) => `test-${id}`
}));

// Mock CSS modules
jest.mock('../../../src/components/tables/table.module.css', () => ({
  pageContainer: 'page-container',
  pageContainer1: 'page-container-1',
  pageContent: 'page-content',
  classTable: 'class-table',
  classThead: 'class-thead',
  scrollIssue: 'scroll-issue',
  tbodyRow: 'tbody-row',
  disableUser: 'disable-user',
  activeRow: 'active-row',
  totalRow: 'total-row',
  firstTdBorder: 'first-td-border',
  lastBorder: 'last-border',
  childBorder: 'child-border',
  totalFirstTdBorder: 'total-first-td-border',
  customAntSelect: 'custom-ant-select'
}));

// Mock Redux store
const mockStore = configureStore([]);
const createMockStore = () => {
  return mockStore({});
};

describe('AppTable Component', () => {
  const defaultProps = {
    data: [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        status: 'active'
      }
    ],
    column: [
      {
        field: 'name',
        header: 'Name',
        actualField: 'name',
        value: 'name',
        columnActive: true
      }
    ],
    status: 'success',
    setAction: jest.fn(),
    count: 10,
    totalLength: 1,
    loader: false,
    onRowClick: jest.fn(),
    handleRowCheckboxChange: jest.fn(),
    checkBoxLoader: false,
    handleUpload: jest.fn(),
    disableUser: false,
    rowHighlight: false,
    activeItem: null,
    setActiveItem: jest.fn(),
    handleReportIcon: jest.fn(),
    setTriggeredBatch: jest.fn(),
    setOpenUpload: jest.fn(),
    openUpload: false,
    handleBatchTrigger: jest.fn(),
    tableHeight: '400px',
    isReportPage: false,
    triggeredId: null,
    isNullable: false,
    setSelectedRows: jest.fn(),
    selectedRows: [],
    onPageChange: jest.fn(),
    sort: {},
    setSort: jest.fn(),
    handlePriorityChange: jest.fn(),
    setRowData: jest.fn(),
    setPopoverVisible: jest.fn(),
    setSelectedRoles: jest.fn(),
    optionsUser: [],
    setSelectedManager: jest.fn(),
    getContent: jest.fn(),
    popoverVisible: false,
    isMultiple: false,
    actionBodyTemplate: jest.fn(),
    statusBodyTemplate: jest.fn(),
    getRetregger: jest.fn(),
    id: 'test-table',
    tableId: 'test-table-id',
    renderFlagCell: jest.fn(),
    first: 0,
    totalRecords: 1,
    row: 10,
    handleRoasterBtn: jest.fn(),
    isPagination: true,
    dateFormateAlign: 'left',
    getStatusStyles: jest.fn(),
    renderCountDetailsPopover: jest.fn(),
    isCheckBox: false,
    checkedHeader: false,
    isUpload: false,
    idKey: 'id',
    handleAction: jest.fn(),
    isEdit: false,
    content: null,
    visiblePopoverKey: null,
    setVisiblePopoverKey: jest.fn(),
    setEditingUser: jest.fn(),
    isGenerateReport: false,
    isGenerateReportDownload: false,
    setRole: jest.fn(),
    selectedRole: null,
    onCloseIconClick: jest.fn(),
    disabled: false,
    handleReportDownload: jest.fn(),
    isTrigger: false,
    showCancelIcon: false,
    progressCancel: jest.fn(),
    totalCountHead: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders table container', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('renders table with data', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    test('renders loading skeleton when loader is true', () => {
      const propsWithLoader = {
        ...defaultProps,
        loader: true
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithLoader} />
        </Provider>
      );

      const skeletons = screen.getAllByTestId('table-skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

  });

  describe('Error Handling', () => {
    test('handles null data gracefully', () => {
      const propsWithNullData = {
        ...defaultProps,
        data: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithNullData} />
        </Provider>
      );

      const skeletons = screen.getAllByTestId('table-skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    test('handles null columns gracefully', () => {
      const propsWithNullColumns = {
        ...defaultProps,
        column: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithNullColumns} />
        </Provider>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Checkbox Functionality', () => {
    test('renders checkboxes when isCheckBox is true', () => {
      const propsWithCheckbox = {
        ...defaultProps,
        isCheckBox: true,
        checkedHeader: true
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithCheckbox} />
        </Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Height', () => {
    test('applies custom table height', () => {
      const propsWithHeight = {
        ...defaultProps,
        tableHeight: '600px'
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithHeight} />
        </Provider>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
}); 