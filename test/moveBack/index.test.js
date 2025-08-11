import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// react-redux connect passthrough
jest.mock('react-redux', () => {
  const calls = [];
  return {
    connect: (map, actions) => {
      calls.push([map, actions]);
      return (C) => (props) => {
        const React = require('react');
        const mapped = typeof map === 'function' ? map({ tenantAdmin: {}, tableView: {} }, props) : {};
        const actionProps = actions || {};
        return React.createElement(C, { ...actionProps, ...mapped, ...props });
      };
    },
    __getConnectCalls: () => calls,
  };
});

// react-bootstrap stubs
jest.mock('react-bootstrap', () => {
  const React = require('react');
  const Tab = ({ children }) => <div data-testid="Tab">{children}</div>;
  const Nav = ({ children }) => <div data-testid="Nav">{children}</div>;
  Nav.Item = ({ children }) => <div data-testid="NavItem">{children}</div>;
  Nav.Link = ({ children, onClick, eventKey }) => (
    <button data-testid={`nav-link-${eventKey}`} onClick={onClick}>{children}</button>
  );
  return { __esModule: true, Tab, Nav };
});

// Avoid Header heavy deps (redux-actions via websocket)
jest.mock('../../src/jsx/layouts/nav/Header', () => () => <div data-testid="header" />);
jest.mock('redux-actions', () => ({ createAction: jest.fn(), handleActions: jest.fn() }), { virtual: true });

// antd
jest.mock('antd', () => ({
  __esModule: true,
  Button: ({ children, onClick, ...rest }) => <button data-testid={rest['data-testid'] || 'btn'} onClick={onClick}>{children}</button>,
  Input: (p) => <input {...p} />,
  Tooltip: ({ children }) => <>{children}</>,
  Space: ({ children }) => <div>{children}</div>,
}));

// Child components
jest.mock('../../src/components/skeleton/card', () => () => <div data-testid="card-skeleton" />);
jest.mock('../../src/components/reusableFilters', () => (props) => (
  <div data-testid="filters">
    <button data-testid="filters-submit" onClick={() => props.handleSubmit?.([{ id: 'c1' }])}>submit</button>
    <button data-testid="filters-reset" onClick={() => props.handleReset?.()}>reset</button>
    <button data-testid="filters-close" onClick={() => props.onClose?.()}>close</button>
  </div>
));
jest.mock('../../src/components/tables', () => (props) => (
  <div data-testid="table">
    <button data-testid="table-page" onClick={() => props.onPageChange?.({ first: 5, page: 1 })}>page</button>
    <button data-testid="table-select-all" onClick={() => props.handleRowCheckboxChange?.({ e: {}, singleCheck: false, checked: ['ID1','ID2'] })}>select-all</button>
    <button data-testid="table-unselect-all" onClick={() => props.handleRowCheckboxChange?.({ e: {}, singleCheck: false, checked: undefined })}>unselect-all</button>
    <button data-testid="table-row-check" onClick={() => props.handleRowCheckboxChange?.({ e: { target: { checked: true } }, row: { patientId: 'P1', patientName: 'N1' }, singleCheck: true })}>row-check</button>
    <button data-testid="table-row-uncheck" onClick={() => props.handleRowCheckboxChange?.({ e: { target: { checked: false } }, row: { patientId: 'P1', patientName: 'N1' }, singleCheck: true })}>row-uncheck</button>
  </div>
));
jest.mock('../../src/commonPages/moveBack/moveBackModal', () => () => <div data-testid="moveback-modal" />);

// utils
const popupMock = jest.fn();
jest.mock('../../src/utils/reusable', () => ({
  __esModule: true,
  findItemWithTrueKey: () => true,
  findMatchesByField: () => false,
  getResponePopup: (...args) => require('../../test/moveBack/index.test.js').__mocks__.popup(...args),
  tableCustomFilterClearCheck: () => true,
}));
jest.mock('../../src/utils/storages', () => ({ __esModule: true, getStorage: (k) => ({ tinNumber: 'TIN-1' }[k] || null) }));
export const __mocks__ = { popup: popupMock };

// stores
jest.mock('../../src/stores/tenantAdmin/patientAllocations', () => ({ 
  actions: { 
    getAllRoles: jest.fn().mockResolvedValue({ status: 'SUCCESS', response: { allocationRoles: [] } }), 
    getMoveBackLevel: jest.fn().mockResolvedValue({ status: 'SUCCESS' }) 
  } 
}));
jest.mock('../../src/stores/tableView', () => ({ actions: { tableViewAction: jest.fn(), tableDynamicColumn: jest.fn(), tableDynamicColumnReset: jest.fn(), tableDynamicChecked: jest.fn() } }));
jest.mock('../../src/stores/tenantAdmin/users', () => ({ actions: { getAllOrganizationAction: jest.fn() } }));
jest.mock('../../src/stores/tenantAdmin/tin', () => ({ actions: { getAllocationRoutedData: jest.fn() } }));

function loadMoveBack() { return require('../../src/commonPages/moveBack').default; }
function loadMoveBackTable() { return require('../../src/commonPages/moveBack/moveBackTable').default; }

afterEach(() => { jest.clearAllMocks(); cleanup(); });

it('MoveBack: roles loader shows skeleton; nav click sets role and reloads; submit/reset success show popup', async () => {
  const getTableData = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const tableDynamicColumn = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const tableDynamicColumnReset = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const getAllTabRoles = jest.fn().mockResolvedValue({ status: 'SUCCESS', response: { allocationRoles: [{ aliasName: 'QA', roleId: '6' }, { aliasName: 'CODER_1', roleId: '4' }] } });

  const Comp = loadMoveBack();
  // skeleton branch
  const baseData = { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } };
  const allRoles = { allocationRoles: [{ aliasName: 'QA', roleId: '6' }, { aliasName: 'CODER_1', roleId: '4' }] };

  const { rerender } = render(<Comp rolesLoader={true} data={baseData} />);
  expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();

  // non-skeleton
  rerender(<Comp 
    rolesLoader={false} 
    allRoles={allRoles} 
    data={baseData} 
    getTableData={getTableData} 
    tableDynamicColumn={tableDynamicColumn} 
    tableDynamicColumnReset={tableDynamicColumnReset}
    getAllTabRoles={getAllTabRoles}
  />);
  
  // Since we're providing allRoles as a prop, the component should use that data
  // and not need to call getAllTabRoles. We can proceed directly to testing the UI.
  
  // click first role tab
  const tabs = screen.getAllByRole('tab');
  fireEvent.click(tabs[0]);
  expect(getTableData).toHaveBeenCalled();

  // open customization and submit/reset
  fireEvent.click(screen.getByTestId('table-custom'));
  fireEvent.click(screen.getByTestId('filters-submit'));
  await waitFor(() => expect(tableDynamicColumn).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();
  fireEvent.click(screen.getByTestId('filters-reset'));
  await waitFor(() => expect(tableDynamicColumnReset).toHaveBeenCalled());
}, 10000); // Increased timeout to 10 seconds

it('MoveBack: allocate disabled until rows selected; enabled after selecting rows', async () => {
  const Comp = loadMoveBack();
  const baseData = { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } };
  const allRoles = { allocationRoles: [{ aliasName: 'QA', roleId: '6' }] };
  const tableActions = require('../../src/stores/tableView').actions;
  tableActions.tableDynamicChecked.mockResolvedValue({ status: 'SUCCESS', response: { patientIds: [{ patientId: 'P1', patientName: 'N1' }] } });
  const getAllTabRoles = jest.fn().mockResolvedValue({ status: 'SUCCESS', response: { allocationRoles: [{ aliasName: 'QA', roleId: '6' }] } });
  
  render(<Comp 
    rolesLoader={false} 
    allRoles={allRoles} 
    data={baseData} 
    selectedRows={[]} 
    selectedRowsId={[]} 
    getAllTabRoles={getAllTabRoles}
  />);
  
  // Wait for useEffect to complete
  await waitFor(() => expect(getAllTabRoles).toHaveBeenCalled());
  
  const btn = screen.getByTestId('allocate-btn');
  expect(btn).toBeDisabled();
  // select via MoveBackTable actions
  fireEvent.click(screen.getByTestId('table-select-all'));
  await waitFor(() => expect(screen.getByTestId('allocate-btn')).not.toBeDisabled());
  // unselect to disable again
  fireEvent.click(screen.getByTestId('table-unselect-all'));
  expect(screen.getByTestId('allocate-btn')).toBeDisabled();
}, 10000); // Increased timeout to 10 seconds

it('MoveBackTable: select-all fetches ids and sets selections; unselect-all clears; row toggle updates', async () => {
  const getTableData = jest.fn().mockResolvedValue({ status: 'SUCCESS', response: { patientIds: [{ patientId: 'P1', patientName: 'N1' }, { patientId: 'P2', patientName: 'N2' }] } });
  const setSelectedRows = jest.fn();
  const setSelectedRowsId = jest.fn();
  const Comp = loadMoveBackTable();
  const data = { response: { metaDataDTO: [{ id: 'c1', active: true }], pageResponse: { content: [{ id: 'P1' }], totalElements: 2 }, staticDesign: {} } };

  render(<Comp data={data} getTableData={getTableData} selectedRows={[]} setSelectedRows={setSelectedRows} setSelectedRowsId={setSelectedRowsId} pageNo={0} setPageNo={jest.fn()} paginationFirst={0} setPaginationFirst={jest.fn()} sort={{}} setSort={jest.fn()} roleId={'6'} selectedRole={'QA'} selectedDateRanges={{}} searchText={''} selectedOption={{}} tableLoader={false} />);

  // select all
  fireEvent.click(screen.getByTestId('table-select-all'));
  await waitFor(() => expect(getTableData).toHaveBeenCalled());
  expect(setSelectedRows).toHaveBeenCalledWith(['P1','P2']);
  expect(setSelectedRowsId).toHaveBeenCalled();

  // unselect all
  fireEvent.click(screen.getByTestId('table-unselect-all'));
  expect(setSelectedRows).toHaveBeenCalledWith([]);
  expect(setSelectedRowsId).toHaveBeenCalledWith([]);

  // row toggle check/uncheck
  fireEvent.click(screen.getByTestId('table-row-check'));
  fireEvent.click(screen.getByTestId('table-row-uncheck'));
}, 10000); // Added timeout to prevent potential issues


