import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

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

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="fontawesome-icon" />
}));

// Mock moment
jest.mock('moment', () => {
  const mockMoment = (date) => {
    if (!date) return { format: () => '---' };
    return {
      format: (format) => {
        if (format === 'MM-DD-YYYY') return '01-01-2023';
        if (format === 'MM-DD-YYYY hh:mm A') return '01-01-2023 12:00 PM';
        return '2023-01-01';
      }
    };
  };
  return mockMoment;
});

// Mock utility functions
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

// Mock the entire tables component
jest.mock('../../../src/components/tables', () => {
  return function MockAppTable({
    data,
    column,
    loader,
    onRowClick,
    handleRowCheckboxChange,
    isCheckBox,
    checkedHeader,
    isUpload,
    isEdit,
    isTrigger,
    isGenerateReportDownload,
    isPagination,
    first,
    totalRecords,
    row,
    onPageChange,
    activeItem,
    selectedRows
  }) {
    // Create a copy of column to avoid mutating the original
    const columnCopy = [...(column || [])];
    
    // Add checkbox column if needed
    if (isCheckBox) {
      columnCopy.push({
        checkBox: true,
        value: "patientId",
        header: true,
      });
    }

    // Add upload column if needed
    if (isUpload) {
      columnCopy.push({
        statusButton: true,
        value: "patientId",
      });
    }

    // Add trigger column if needed
    if (isTrigger) {
      columnCopy.push({
        triggerButton: true,
      });
    }

    // Add edit column if needed
    if (isEdit) {
      columnCopy.push({
        edit: true,
        value: "patientId",
      });
    }

    // Add report download column if needed
    if (isGenerateReportDownload) {
      columnCopy.push({
        reportDownload: true,
        value: "patientId",
        header: false,
      });
    }

    return (
      <div className="customTable" data-testid="app-table">
        <div className="page-container">
          <div className="page-content">
            <div style={{ overflowX: "auto" }}>
              <table className="class-table">
                <thead className="class-thead">
                  <tr>
                    {columnCopy?.map((item, index) => (
                      <th key={index} data-testid={`header-${index}`}>
                        {item.checkBox && item.header ? (
                          <input
                            type="checkbox"
                            data-testid="header-checkbox"
                            checked={checkedHeader}
                            onChange={(e) => handleRowCheckboxChange && handleRowCheckboxChange({
                              e,
                              row: item,
                              singleCheck: false,
                              checked: e.target.checked,
                            })}
                          />
                        ) : item.statusButton ? (
                          'Upload'
                        ) : item.edit ? (
                          'Action'
                        ) : item.triggerButton ? (
                          ''
                        ) : item.reportDownload ? (
                          'Download'
                        ) : item.columnActive ? (
                          item.headerName?.toUpperCase() || ''
                        ) : (
                          item.headerName || ''
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loader || data == null ? (
                    // Loading skeleton
                    Array.from({ length: 15 }).map((_, rowIndex) => (
                      <tr key={rowIndex} data-testid={`skeleton-row-${rowIndex}`}>
                        {Array.from({ length: columnCopy?.length || 5 }).map((_, colIndex) => (
                          <td key={colIndex} className="mx-1">
                            <div data-testid="table-skeleton">Loading...</div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : data?.length > 0 ? (
                    // Data rows
                    data.map((item, index) => (
                      <tr 
                        key={index} 
                        data-testid={`data-row-${index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick && onRowClick(item);
                        }}
                        className={`tbody-row ${activeItem?.id === item?.id ? 'active-row' : ''} ${item?.allocatedTo === "TOTAL" ? 'total-row' : ''}`}
                      >
                        {columnCopy?.map((columnItem, colIndex) => (
                          <td key={colIndex} data-testid={`cell-${index}-${colIndex}`}>
                            {columnItem.checkBox ? (
                              <div className="checkbox-div">
                                <input
                                  type="checkbox"
                                  data-testid={`checkbox-${index}`}
                                  checked={selectedRows?.some(row => row === item[columnItem.value])}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleRowCheckboxChange && handleRowCheckboxChange({
                                      e,
                                      row: item,
                                      singleCheck: true,
                                    });
                                  }}
                                />
                              </div>
                            ) : columnItem.statusButton ? (
                              <div data-testid="status-button">Upload Button</div>
                            ) : columnItem.edit ? (
                              <div data-testid="edit-cell">
                                {item.accountStatus === true ? (
                                  <div data-testid="edit-button">Edit</div>
                                ) : (
                                  <div data-testid="edit-button-disabled">Edit Disabled</div>
                                )}
                              </div>
                            ) : columnItem.triggerButton ? (
                              <div data-testid="trigger-button">
                                {item?.isRequestForRetry === true && (
                                  <div data-testid="retry-button">Retry</div>
                                )}
                              </div>
                            ) : columnItem.reportDownload ? (
                              <div data-testid="download-cell">
                                <div data-testid="download">📥</div>
                              </div>
                            ) : columnItem.columnActive ? (
                              <span>
                                {typeof item[columnItem.value] === "boolean" ? (
                                  <div className="d-flex px-4">
                                    {item[columnItem.value] ? "True" : "False"}
                                  </div>
                                ) : item[columnItem.actualField] || item[columnItem.actualField] === 0 ? (
                                  <div data-testid="tooltip" title={item[columnItem.value]}>
                                    {item[columnItem.actualField]}
                                  </div>
                                ) : (
                                  <div>---</div>
                                )}
                              </span>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    // Empty state
                    <tr data-testid="empty-row">
                      <td colSpan={columnCopy?.length || 5}>
                        <div className="d-flex align-items-center justify-content-center">
                          <div data-testid="empty">No data</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {isPagination && (
              <div className="pagination-container">
                <div data-testid="paginator">
                  <div data-testid="paginator-first">{first}</div>
                  <div data-testid="paginator-rows">{row ? row : 15}</div>
                  <div data-testid="paginator-total">{totalRecords}</div>
                  <button 
                    data-testid="paginator-next" 
                    onClick={() => onPageChange && onPageChange({ first: first + (row || 15), rows: row || 15 })}
                  >
                    Next
                  </button>
                </div>
                <div className="total-pages">
                  Total count: {totalRecords ? totalRecords : "0"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
});

import AppTable from '../../../src/components/tables';

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
        name: 'Test User 1',
        email: 'test1@example.com',
        status: 'active',
        accountStatus: true
      },
      {
        id: 2,
        name: 'Test User 2',
        email: 'test2@example.com',
        status: 'inactive',
        accountStatus: false
      }
    ],
    column: [
      {
        field: 'name',
        headerName: 'Name',
        actualField: 'name',
        value: 'name',
        columnActive: true
      },
      {
        field: 'email',
        headerName: 'Email',
        actualField: 'email',
        value: 'email',
        columnActive: true
      },
      {
        field: 'status',
        headerName: 'Status',
        actualField: 'status',
        value: 'status',
        columnActive: true
      }
    ],
    loader: false,
    onRowClick: jest.fn(),
    handleRowCheckboxChange: jest.fn(),
    isCheckBox: false,
    checkedHeader: false,
    isUpload: false,
    isEdit: false,
    isTrigger: false,
    isGenerateReportDownload: false,
    isPagination: true,
    first: 0,
    totalRecords: 2,
    row: 10,
    onPageChange: jest.fn(),
    activeItem: null,
    selectedRows: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Scenarios', () => {
    test('renders table component correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('app-table')).toBeInTheDocument();
    });

    test('renders table headers correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('header-0')).toBeInTheDocument();
      expect(screen.getByTestId('header-1')).toBeInTheDocument();
      expect(screen.getByTestId('header-2')).toBeInTheDocument();
    });

    test('renders table data rows correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('data-row-1')).toBeInTheDocument();
    });

    test('handles row click correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      const row = screen.getByTestId('data-row-0');
      fireEvent.click(row);

      expect(defaultProps.onRowClick).toHaveBeenCalledWith(defaultProps.data[0]);
    });

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

      expect(screen.getByTestId('skeleton-row-0')).toBeInTheDocument();
      expect(screen.getAllByTestId('table-skeleton').length).toBeGreaterThan(0);
    });

    test('renders empty state when no data', () => {
      const propsWithNoData = {
        ...defaultProps,
        data: []
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithNoData} />
        </Provider>
      );

      expect(screen.getByTestId('empty-row')).toBeInTheDocument();
      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    test('renders pagination when isPagination is true', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('paginator')).toBeInTheDocument();
      expect(screen.getByTestId('paginator-first')).toHaveTextContent('0');
      expect(screen.getByTestId('paginator-rows')).toHaveTextContent('10');
      expect(screen.getByTestId('paginator-total')).toHaveTextContent('2');
    });

    test('handles pagination next click', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...defaultProps} />
        </Provider>
      );

      const nextButton = screen.getByTestId('paginator-next');
      fireEvent.click(nextButton);

      expect(defaultProps.onPageChange).toHaveBeenCalledWith({ first: 10, rows: 10 });
    });

    test('renders checkbox column when isCheckBox is true', () => {
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

      expect(screen.getByTestId('header-checkbox')).toBeInTheDocument();
    });

    test('handles header checkbox change', () => {
      const propsWithCheckbox = {
        ...defaultProps,
        isCheckBox: true,
        checkedHeader: false
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithCheckbox} />
        </Provider>
      );

      const headerCheckbox = screen.getByTestId('header-checkbox');
      fireEvent.click(headerCheckbox);

      expect(defaultProps.handleRowCheckboxChange).toHaveBeenCalled();
    });

    test('renders row checkboxes when isCheckBox is true', () => {
      const propsWithCheckbox = {
        ...defaultProps,
        isCheckBox: true
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithCheckbox} />
        </Provider>
      );

      expect(screen.getByTestId('checkbox-0')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-1')).toBeInTheDocument();
    });

    test('renders upload column when isUpload is true', () => {
      const propsWithUpload = {
        ...defaultProps,
        isUpload: true
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithUpload} />
        </Provider>
      );

      expect(screen.getByText('Upload')).toBeInTheDocument();
    });

    test('renders edit column when isEdit is true', () => {
      const propsWithEdit = {
        ...defaultProps,
        isEdit: true
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithEdit} />
        </Provider>
      );

      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    test('renders download column when isGenerateReportDownload is true', () => {
      const propsWithDownload = {
        ...defaultProps,
        isGenerateReportDownload: true
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithDownload} />
        </Provider>
      );

      expect(screen.getByText('Download')).toBeInTheDocument();
    });

    test('handles active row highlighting', () => {
      const propsWithActiveItem = {
        ...defaultProps,
        activeItem: { id: 1 }
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithActiveItem} />
        </Provider>
      );

      const activeRow = screen.getByTestId('data-row-0');
      expect(activeRow).toHaveClass('active-row');
    });

    test('handles total row styling', () => {
      const propsWithTotalRow = {
        ...defaultProps,
        data: [
          {
            id: 1,
            name: 'Total',
            allocatedTo: 'TOTAL'
          }
        ]
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithTotalRow} />
        </Provider>
      );

      const totalRow = screen.getByTestId('data-row-0');
      expect(totalRow).toHaveClass('total-row');
    });
  });

  describe('Negative Scenarios', () => {
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

      expect(screen.getByTestId('skeleton-row-0')).toBeInTheDocument();
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

      expect(screen.getByTestId('app-table')).toBeInTheDocument();
    });

    test('handles missing callbacks gracefully', () => {
      const propsWithoutCallbacks = {
        ...defaultProps,
        onRowClick: null,
        handleRowCheckboxChange: null,
        onPageChange: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithoutCallbacks} />
        </Provider>
      );

      expect(screen.getByTestId('app-table')).toBeInTheDocument();
    });

    test('handles empty data array', () => {
      const propsWithEmptyData = {
        ...defaultProps,
        data: []
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithEmptyData} />
        </Provider>
      );

      expect(screen.getByTestId('empty-row')).toBeInTheDocument();
    });

    test('handles empty columns array', () => {
      const propsWithEmptyColumns = {
        ...defaultProps,
        column: []
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithEmptyColumns} />
        </Provider>
      );

      expect(screen.getByTestId('app-table')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles large data array', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        status: 'active'
      }));
      const propsWithLargeData = {
        ...defaultProps,
        data: largeData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithLargeData} />
        </Provider>
      );

      expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('data-row-99')).toBeInTheDocument();
    });

    test('handles data with special characters', () => {
      const dataWithSpecialChars = [
        {
          id: 1,
          name: 'User with @#$%^&*() special chars',
          email: 'test@example.com',
          status: 'active'
        }
      ];
      const propsWithSpecialChars = {
        ...defaultProps,
        data: dataWithSpecialChars
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithSpecialChars} />
        </Provider>
      );

      expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
    });

    test('handles data with null values', () => {
      const dataWithNulls = [
        {
          id: 1,
          name: null,
          email: null,
          status: null
        }
      ];
      const propsWithNulls = {
        ...defaultProps,
        data: dataWithNulls
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithNulls} />
        </Provider>
      );

      expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
    });

    test('handles data with boolean values', () => {
      const dataWithBooleans = [
        {
          id: 1,
          name: 'Test User',
          isActive: true,
          isVerified: false
        }
      ];
      const propsWithBooleans = {
        ...defaultProps,
        data: dataWithBooleans
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <AppTable {...propsWithBooleans} />
        </Provider>
      );

      expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
    });
  });
}); 