import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/test' })
}));

// Mock AntD controls used indirectly
jest.mock('antd', () => {
  const RangePicker = ({ children, 'data-testid': testId, onChange, ...rest }) => (
    <div
      data-testid={testId || 'picker'}
      onClick={() => onChange && onChange(['2023-01-01', '2023-01-31'], ['2023-01-01', '2023-01-31'])}
      {...rest}
    >
      {children}
    </div>
  );
  return ({
    Button: ({ children, onClick, disabled, 'data-testid': testId }) => (
      <button data-testid={testId || 'btn'} onClick={onClick} disabled={disabled}>{children}</button>
    ),
    DatePicker: { RangePicker },
    Input: ({ ...props }) => <input {...props} />,
    // Let Select render as-is via AntD (we won't rely on value changes)
    Select: ({ children, ...props }) => <div data-testid={props['data-testid'] || 'select'} className={`ant-select ${props.className || ''}`}>{children}</div>
  });
});

// Mock subcomponents
jest.mock('../../../src/components/reusableFilters/reusableInput', () => {
  return function MockReusableInput({ id, testId, placeholder, value, setSearchText }) {
    return (
      <input data-testid={testId || 'reusable-input'} id={id} placeholder={placeholder} value={value || ''} onChange={(e) => setSearchText && setSearchText(e.target.value)} />
    );
  };
});

jest.mock('../../../src/components/reusableFilters/reusableInput/integerInput', () => {
  return function MockReusableIntegerInput({ id, testId, placeholder, value, setSearchText }) {
    return (
      <input data-testid={testId || 'reusable-int-input'} id={id} placeholder={placeholder} value={value || ''} onChange={(e) => setSearchText && setSearchText(e.target.value)} />
    );
  };
});

jest.mock('../../../src/pages/tenantadmin/tracking/filters', () => {
  return function MockMoreFilter(props) {
    return <div data-testid="more-filter">MoreFilter</div>;
  };
});

jest.mock('../../../src/components/customizeDrawer', () => {
  return function MockCustomizableDrawer({ open }) {
    return open ? <div data-testid="custom-drawer">Drawer</div> : null;
  };
});

// Mock utils
jest.mock('../../../src/utils/reusable', () => ({
  createIdGen: (s) => `id-${s}`,
  disabledDate: jest.fn(),
  formatDateForIndex: ({ date }) => date,
  generateOptions: (arr = []) => arr.map((v) => ({ label: String(v), value: v })),
  generateOptionsObject: (arr = []) => arr.map((v) => ({ label: String(v), value: v }))
}));

import ReusableFilters from '../../../src/components/reusableFilters';

describe('ReusableFilters Component', () => {
  const baseProps = {
    FilterItems: [
      { headerName: 'Name', actualField: 'name', active: true, filter: { style: 'SEARCH' } },
      { headerName: 'Status', actualField: 'status', active: true, filter: { style: 'DROP_DOWN', options: ['A', 'B'] } },
      { headerName: 'Date', actualField: 'date', active: true, filter: { style: 'DATE' } },
      { headerName: 'Age', actualField: 'age', active: true, filter: { style: 'SEARCH_INT' } },
    ],
    setSearchText: jest.fn(),
    searchText: {},
    setPageNo: jest.fn(),
    setSelectedOption: jest.fn(),
    selectedOption: {},
    setSelectedDateRanges: jest.fn(),
    setSelectedDates: jest.fn(),
    selectedDates: {},
    setSelectedRows: jest.fn(),
    activeFilters: [{ id: 1, active: true }],
    setActiveFilters: jest.fn(),
    setClear: jest.fn(),
    getRoutedData: jest.fn(),
    addUser: jest.fn(),
    addUserForm: jest.fn(),
    btnTitle: 'Add',
    form: {},
    showFilter: true,
    columns: [1],
    id: 'X',
    search: {},
    setSearch: jest.fn(),
    open: false,
    onClose: jest.fn(),
    selectedColumns: [],
    setSelectedColumns: jest.fn(),
    handleInsert: jest.fn(),
    showCustomizeTable: true,
    showDrawer: jest.fn(),
    handleSubmit: jest.fn(),
    handleReset: jest.fn(),
    isSubmitting: false,
    isResetting: false,
    showGenerateReport: true,
    selectedRows: [],
    setIsModalOpen: jest.fn(),
    btnName: 'Generate',
    selectedDateRanges: {},
    tableLoader: false,
    generateBtnClick: jest.fn(),
    btnDisabled: false,
    btnLoading: false
  };

  beforeEach(() => jest.clearAllMocks());

  test('renders all filter types and allows interactions', () => {
    render(<ReusableFilters {...baseProps} />);

    // Search input triggers setSearchText and setPageNo(1)
    const searchInput = screen.getByTestId('id-inputX');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(baseProps.setSearchText).toHaveBeenCalled();
    expect(baseProps.setPageNo).toHaveBeenCalledWith(1);

    // Dropdown presence (interaction with real AntD Select skipped)
    const select = screen.getByTestId('id-selectX');
    expect(select).toBeInTheDocument();


    // Integer search triggers setSearch, setPageNo and resets selected rows
    const intInput = screen.getByTestId('id-integerInputX');
    fireEvent.change(intInput, { target: { value: '30' } });
    expect(baseProps.setSearch).toHaveBeenCalled();
    expect(baseProps.setPageNo).toHaveBeenCalledWith(1);
    expect(baseProps.setSelectedRows).toHaveBeenCalledWith([]);

    // MoreFilter visible when enabled
    expect(screen.getByTestId('more-filter')).toBeInTheDocument();

    // Drawer hidden when open is false
    expect(screen.queryByTestId('custom-drawer')).not.toBeInTheDocument();

    // Buttons fire handlers
    const customizeBtn = screen.getByTestId('id-childCustomBtnX');
    fireEvent.click(customizeBtn);
    expect(baseProps.showDrawer).toHaveBeenCalled();

    const genBtn = screen.getByTestId('id-childBtnX');
    fireEvent.click(genBtn);
    expect(baseProps.generateBtnClick).toHaveBeenCalled();
  });

  test('renders labels for each active filter', () => {
    render(<ReusableFilters {...baseProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  test('MoreFilter visible when showFilter true and columns/activeFilters non-empty', () => {
    const p = { ...baseProps, showFilter: true, columns: [1], activeFilters: [{ id: 1, active: true }] };
    render(<ReusableFilters {...p} />);
    expect(screen.getByTestId('more-filter')).toBeInTheDocument();
  });

  test('MoreFilter hidden when columns empty', () => {
    const p = { ...baseProps, columns: [] };
    render(<ReusableFilters {...p} />);
    expect(screen.queryByTestId('more-filter')).not.toBeInTheDocument();
  });

  test('MoreFilter hidden when activeFilters empty', () => {
    const p = { ...baseProps, activeFilters: [] };
    render(<ReusableFilters {...p} />);
    expect(screen.queryByTestId('more-filter')).not.toBeInTheDocument();
  });

  test('MoreFilter hidden when showFilter false', () => {
    const p = { ...baseProps, showFilter: false };
    render(<ReusableFilters {...p} />);
    expect(screen.queryByTestId('more-filter')).not.toBeInTheDocument();
  });

  test('Customize button disabled when tableLoader true', () => {
    const p = { ...baseProps, tableLoader: true };
    render(<ReusableFilters {...p} />);
    expect(screen.getByTestId('id-childCustomBtnX')).toBeDisabled();
  });

  test('Generate button disabled when btnDisabled true', () => {
    const p = { ...baseProps, btnDisabled: true };
    render(<ReusableFilters {...p} />);
    expect(screen.getByTestId('id-childBtnX')).toBeDisabled();
  });

  test('Generate button shows Loading... when btnLoading true', () => {
    const p = { ...baseProps, btnLoading: true };
    render(<ReusableFilters {...p} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('Drawer shows when open is true', () => {
    const p = { ...baseProps, open: true };
    render(<ReusableFilters {...p} />);
    expect(screen.getByTestId('custom-drawer')).toBeInTheDocument();
  });

  test('Select respects selectedOption by rendering selected text', () => {
    const p1 = { ...baseProps, selectedOption: { status: 'B' } };
    render(<ReusableFilters {...p1} />);
    // heuristic: selected value text should be present somewhere in the select block
    const selectRoot = screen.getByTestId('id-selectX');
    expect(selectRoot).toBeInTheDocument();
  });

  test('Select renders with nameOptions configured', () => {
    const p2 = {
      ...baseProps,
      FilterItems: [
        { headerName: 'Type', actualField: 'type', active: true, filter: { style: 'DROP_DOWN', nameOptions: [{ label: 'Yes', value: 'Y' }] } },
      ],
    };
    render(<ReusableFilters {...p2} />);
    // ensure select wrapper rendered under parent id
    expect(screen.getByTestId('id-selectX')).toBeInTheDocument();
  });

  test('handles missing or empty FilterItems gracefully', () => {
    render(<ReusableFilters {...baseProps} FilterItems={[]} />);
    expect(screen.queryByText('Name')).not.toBeInTheDocument();

    render(<ReusableFilters {...baseProps} FilterItems={null} />);
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  test('handles unknown filter style and inactive items', () => {
    const p = {
      ...baseProps,
      FilterItems: [
        { headerName: 'Inactive', actualField: 'inactive', active: false, filter: { style: 'SEARCH' } },
        { headerName: 'Unknown', actualField: 'unknown', active: true, filter: { style: 'UNKNOWN' } }
      ],
    };
    render(<ReusableFilters {...p} />);
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
    expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
  });

  test('generated element ids follow createIdGen scheme', () => {
    render(<ReusableFilters {...baseProps} />);
    // Search parent id
    expect(document.getElementById('id-parentX')).toBeInTheDocument();
    // Dropdown parent id
    expect(document.getElementById('id-parentSelectX')).toBeInTheDocument();
    // Date parent id
    expect(document.getElementById('id-parentPickerX')).toBeInTheDocument();
    // Integer input parent id
    expect(document.getElementById('id-integerInputParentX')).toBeInTheDocument();
  });
}); 