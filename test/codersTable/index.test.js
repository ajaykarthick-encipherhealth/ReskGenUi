import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// react-redux connect passthrough and capture
jest.mock('react-redux', () => {
  const calls = [];
  return {
    connect: (map, actions) => {
      calls.push([map, actions]);
      return (C) => (props) => {
        const React = require('react');
        const mapped = typeof map === 'function' ? map({ tenantAdmin: {}, tableView: {}, reviewer: {} }, props) : {};
        const actionProps = actions || {};
        return React.createElement(C, { ...actionProps, ...mapped, ...props });
      };
    },
    __getConnectCalls: () => calls,
  };
});

// Router
const pushMock = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ pathname: '/reviewer/patients', push: pushMock }) }));

// react-bootstrap minimal stubs
jest.mock('react-bootstrap', () => {
  const React = require('react');
  const Tab = ({ children }) => <div data-testid="Tab">{children}</div>;
  const Nav = ({ children }) => <div data-testid="Nav">{children}</div>;
  Nav.Item = ({ children, onClick }) => (
    <div>
      <button data-testid="nav-item" onClick={onClick}>nav</button>
      {children}
    </div>
  );
  Nav.Link = ({ children, onClick, eventKey, id }) => (
    <button data-testid={`nav-link-${eventKey}`} id={id} onClick={onClick}>{children}</button>
  );
  return { __esModule: true, Tab, Nav };
});

// antd stubs
const notif = { warning: jest.fn() };
jest.mock('antd', () => ({
  __esModule: true,
  Button: ({ children, onClick, ...rest }) => <button data-testid={rest['data-testid'] || 'btn'} onClick={onClick}>{children}</button>,
  notification: notif,
}));

// Child components
jest.mock('../../src/components/subNavBar', () => () => <div data-testid="sub-navbar" />);
jest.mock('../../src/pages/tenantadmin/tracking/filters', () => (props) => (
  <div data-testid="more-filter">
    <button data-testid="clear-all" onClick={props.handleClearAllFilters}>clear-all</button>
    <button data-testid="clear-filters" onClick={props.handleClearFilters}>clear-filters</button>
  </div>
));
jest.mock('../../src/components/reusableFilters', () => (props) => (
  <div data-testid="filters">
    <button data-testid="filters-submit" onClick={() => props.handleSubmit?.([{ id: 'c1' }])}>submit</button>
    <button data-testid="filters-reset" onClick={() => props.handleReset?.()}>reset</button>
    <button data-testid="filters-close" onClick={() => props.onClose?.()}>close</button>
  </div>
));
jest.mock('../../src/components/tables', () => (props) => (
  <div data-testid="table">
    <button data-testid="table-page" onClick={() => props.onPageChange?.({ first: 10, page: 2, rows: 25 })}>page</button>
    <button data-testid="table-row" onClick={() => props.onRowClick?.({ patientId: 'P1', computing: 2 })}>row-go</button>
    <button data-testid="table-row-warn" onClick={() => props.onRowClick?.({ patientId: 'P2', computing: 1 })}>row-warn</button>
  </div>
));

// utils
const popupMock = jest.fn();
const setStorageMock = jest.fn();
jest.mock('../../src/utils/reusable', () => ({
  __esModule: true,
  createIdGen: (k) => `id-${k}`,
  createIdGens: (k) => `id-${k}`,
  findMatchesByField: () => false,
  getResponePopup: (...args) => require('../../test/codersTable/index.test.js').__mocks__.popup(...args),
  tableCustomFilterClearCheck: () => true,
}));
jest.mock('../../src/utils/storages', () => ({
  __esModule: true,
  getStorage: (k) => ({ proxyRole: 'QA', tinNumber: 'TIN-1' }[k] || null),
  setStorage: (...args) => require('../../test/codersTable/index.test.js').__mocks__.setStorage(...args),
}));
export const __mocks__ = { popup: popupMock, setStorage: setStorageMock };

// stores/actions
jest.mock('../../src/stores/tableView', () => ({ actions: { tableViewAction: jest.fn(), tableDynamicColumn: jest.fn(), tableDynamicColumnReset: jest.fn(), getTableStatusAction: jest.fn() } }));
jest.mock('../../src/stores/reviewer/workqueue', () => ({ actions: { getPatientDetails: jest.fn(), getStatusAction: jest.fn() } }));
jest.mock('../../src/stores/tenantAdmin/patientSync', () => ({ actions: { getRoutedData: jest.fn() } }));
jest.mock('../../src/stores/admin/report', () => ({ actions: { activeTab: jest.fn() } }));

function loadComp() {
  return require('../../src/commonPages/codersTable').default;
}

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

it('submit/reset success paths trigger API, popup and close; also pagination and open/close drawer', async () => {
  const tableDynamicColumn = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const tableDynamicColumnReset = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const getTableData = jest.fn();
  const getTableStatus = jest.fn();
  const Comp = loadComp();
  const data = { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } };
  render(
    <Comp
      data={data}
      pageId="some-page"
      tableLoader={false}
      tableDynamicColumn={tableDynamicColumn}
      tableDynamicColumnReset={tableDynamicColumnReset}
      getTableData={getTableData}
      getTableStatus={getTableStatus}
      patientDetails={jest.fn()}
      getRoutedData={jest.fn()}
      getActiveTab={jest.fn()}
    />
  );

  // table pagination
  fireEvent.click(screen.getByTestId('table-page'));

  // open customization and submit
  fireEvent.click(screen.getByText('Table Customization'));
  fireEvent.click(screen.getByTestId('filters-submit'));
  await waitFor(() => expect(tableDynamicColumn).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();

  // reset flow
  fireEvent.click(screen.getByTestId('filters-reset'));
  await waitFor(() => expect(tableDynamicColumnReset).toHaveBeenCalled());
});

it('submit/reset error paths call popup with error', async () => {
  const tableDynamicColumn = jest.fn().mockRejectedValue(new Error('boom'));
  const tableDynamicColumnReset = jest.fn().mockRejectedValue(new Error('boom2'));
  const getTableData = jest.fn();
  const Comp = loadComp();
  const data = { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } };
  render(<Comp data={data} pageId="some-page" tableDynamicColumn={tableDynamicColumn} tableDynamicColumnReset={tableDynamicColumnReset} getTableData={getTableData} />);
  fireEvent.click(screen.getByText('Table Customization'));
  fireEvent.click(screen.getByTestId('filters-submit'));
  await waitFor(() => expect(popupMock).toHaveBeenCalled());
  fireEvent.click(screen.getByTestId('filters-reset'));
  await waitFor(() => expect(popupMock).toHaveBeenCalled());
});

it('gotoPatientDetails: computing==2 navigates and writes storage; else shows warning', async () => {
  const patientDetails = jest.fn();
  const getRoutedData = jest.fn();
  const Comp = loadComp();
  const data = { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } };
  render(<Comp data={data} pageId="some-page" patientDetails={patientDetails} getRoutedData={getRoutedData} />);

  // computing == 2
  fireEvent.click(screen.getByTestId('table-row'));
  await waitFor(() => expect(patientDetails).toHaveBeenCalled());
  expect(setStorageMock).toHaveBeenCalled();
  expect(pushMock).toHaveBeenCalled();

  // computing != 2
  fireEvent.click(screen.getByTestId('table-row-warn'));
  await waitFor(() => expect(screen.getByText(/file not processed/i)).toBeInTheDocument());
});

it('handleTabs updates active status and triggers action', () => {
  const getActiveTab = jest.fn();
  const Comp = loadComp();
  render(<Comp pageId="some-other" getActiveTab={getActiveTab} data={{ response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } }} />);
  const tabs = screen.getAllByRole('tab');
  fireEvent.click(tabs[0]);
  fireEvent.click(tabs[1]);
  expect(getActiveTab).toHaveBeenCalled();
});

it('mapStateToProps coverage', () => {
  const rr = require('react-redux');
  const calls = rr.__getConnectCalls();
  const mapState = (calls[calls.length - 1] || calls[0])[0];
  const mapped = mapState({
    tenantAdmin: { tin: { getPageRendering: false }, patientSync: { routedData: {} } },
    reviewer: { workQueue: { getStatus: { data: { response: { processStatusCount: {} } } } } },
    tableView: { tableViewLoading: false, tableView: { data: {} }, TableStatusView: { data: { response: {} } } },
  });
  expect(mapped).toHaveProperty('tableLoader');
  expect(mapped).toHaveProperty('data');
  expect(mapped).toHaveProperty('pageLoad');
});


