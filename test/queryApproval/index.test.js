import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// connect passthrough
jest.mock('react-redux', () => {
  const calls = [];
  return {
    connect: (map, actions) => {
      calls.push([map, actions]);
      return (C) => C;
    },
    __getConnectCalls: () => calls,
  };
});

// Router
const pushMock = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ push: pushMock }) }));

// react-bootstrap Tab/Nav stubs
jest.mock('react-bootstrap', () => {
  const React = require('react');
  const Tab = ({ children, className }) => <div data-testid="Tab" className={className}>{children}</div>;
  const NavBase = ({ children, ...rest }) => <div data-testid="Nav" {...rest}>{children}</div>;
  NavBase.Item = ({ children, ...rest }) => <div data-testid="NavItem" {...rest}>{children}</div>;
  NavBase.Link = ({ children, onClick, eventKey, className }) => (
    <button data-testid={`nav-link-${eventKey}`} className={className} onClick={onClick}>{children}</button>
  );
  return { __esModule: true, Tab, Nav: NavBase };
});

// Avoid Header heavy deps (redux-actions)
jest.mock('../../src/jsx/layouts/nav/Header', () => () => <div data-testid="header" />);
jest.mock('redux-actions', () => ({ createAction: jest.fn(), handleActions: jest.fn() }), { virtual: true });

// antd minimal stubs
jest.mock('antd', () => {
  const React = require('react');
  const Button = ({ children, onClick, ...rest }) => (
    <button data-testid={rest['data-testid'] || 'btn'} onClick={onClick}>{children}</button>
  );
  const Input = (props) => <input data-testid="input" {...props} />;
  const Tooltip = ({ children }) => <span data-testid="tooltip">{children}</span>;
  const Space = ({ children }) => <div data-testid="space">{children}</div>;
  const Modal = ({ open, children, onCancel, onOk }) => open ? (
    <div data-testid="modal">
      {children}
      <button data-testid="modal-ok" onClick={onOk}>ok</button>
      <button data-testid="modal-cancel" onClick={onCancel}>cancel</button>
    </div>
  ) : null;
  return { __esModule: true, Button, Input, Tooltip, Space, Modal };
});

// Child components
jest.mock('../../src/components/reusableFilters', () => (props) => (
  <div>
    <button data-testid="filters-submit" onClick={() => props.handleSubmit([{ id: 'c1' }])}>submit</button>
    <button data-testid="filters-reset" onClick={() => props.handleReset()}>reset</button>
  </div>
));
jest.mock('../../src/components/skeleton/card', () => () => <div data-testid="card-skeleton" />);
jest.mock('../../src/components/tables', () => (props) => (
  <div>
    <button data-testid="table-page" onClick={() => props.onPageChange({ first: 5, page: 1 })}>page</button>
    <button data-testid="table-row" onClick={() => props.onRowClick({ patientId: 'P1' })}>row</button>
  </div>
));
jest.mock('../../src/components/button', () => ({ __esModule: true, default: ({ name, onClick }) => (
  <button data-testid={`regular-${name}`} onClick={onClick}>{name}</button>
) }));

// utils
const popupMock = jest.fn();
const setStorageMock = jest.fn();
jest.mock('../../src/utils/reusable', () => ({
  findMatchesByField: () => false,
  getResponePopup: (...args) => require('../../test/queryApproval/index.test.js').__mocks__.popup(...args),
  tableCustomFilterClearCheck: () => true,
}));
jest.mock('../../src/utils/storages', () => ({
  getStorage: (k) => ({ tinNumber: 'TIN-1' }[k] || null),
  setStorage: (...args) => require('../../test/queryApproval/index.test.js').__mocks__.setStorage(...args),
}));
export const __mocks__ = { popup: popupMock, setStorage: setStorageMock };

// Stores/action modules (avoid reducers)
jest.mock('../../src/stores/tenantAdmin/patientAllocations', () => ({ actions: {} }));
jest.mock('../../src/stores/tenantAdmin/users', () => ({ actions: {} }));
jest.mock('../../src/stores/tenantAdmin/tin', () => ({ actions: { getAllocationRoutedData: jest.fn() } }));
jest.mock('../../src/stores/tableView', () => ({ actions: { tableViewAction: jest.fn(), tableDynamicColumn: jest.fn(), tableDynamicColumnReset: jest.fn() } }));

function loadQueryApproval() {
  return require('../../src/commonPages/queryApproval').default;
}
function loadQueryTable() {
  return require('../../src/commonPages/queryApproval/queryTable').default;
}

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

function renderQueryApproval(overrides = {}) {
  const getTableData = jest.fn();
  const getAllTabRoles = jest.fn().mockResolvedValue({ status: 'SUCCESS', response: { allocationRoles: [
    { aliasName: 'CODER_1', roleId: '4' },
    { aliasName: 'QA', roleId: '6' },
  ] } });
  const props = {
    organizationList: {},
    getTableData,
    getAllTabRoles,
    routedData: null,
    allRoles: { allocationRoles: [ { aliasName: 'CODER_1', roleId: '4' } ] },
    rolesLoader: false,
    tableLoader: false,
    data: { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } },
    tableDynamicColumn: jest.fn().mockResolvedValue({ status: 'SUCCESS' }),
    tableDynamicColumnReset: jest.fn().mockResolvedValue({ status: 'SUCCESS' }),
    route: '/tenantadmin/tin/tindetails/querydetails',
    pageLoad: false,
    statusBodyTemplate: () => null,
    backRoute: '',
    getRoutedData: jest.fn(),
    ...overrides,
  };
  const Comp = loadQueryApproval();
  return { ...render(<Comp {...props} />), props };
}

it('QueryApproval: render roles, click nav, open customize, submit & reset, navigate on row', async () => {
  const { props } = renderQueryApproval();

  // Wait for useEffect to complete
  await waitFor(() => expect(props.getAllTabRoles).toHaveBeenCalled());

  // Click first role nav link (tab)
  const firstTab = screen.getByRole('tab', { name: /CODER 1/i });
  fireEvent.click(firstTab);

  // Nav link click: simulate by clicking first Nav.Link wrapped button (we rely on getTableData calls in onClick)
  // In our stub, Nav.Link is rendered as part of Nav; so we simulate via calling getTableData through table custom button
  fireEvent.click(screen.getByTestId('table-custom'));
  // open drawer flag set; ReusableFilters triggers submit/reset
  fireEvent.click(screen.getByTestId('filters-submit'));
  await waitFor(() => expect(props.tableDynamicColumn).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();

  fireEvent.click(screen.getByTestId('filters-reset'));
  await waitFor(() => expect(props.tableDynamicColumnReset).toHaveBeenCalled());

  // QueryTable row click should navigate when active Pending
  fireEvent.click(screen.getByTestId('table-row'));
  await waitFor(() => expect(setStorageMock).toHaveBeenCalled());
  await waitFor(() => expect(pushMock).toHaveBeenCalled());

  // Execute mapStateToProps to cover connector mapping lines
  const rr = require('react-redux');
  const calls = rr.__getConnectCalls();
  // First connect comes from QueryTable (maps { data }), second from QueryApproval (maps organizationList, etc.)
  const mapState = (calls[calls.length - 1] || calls[0])[0];
  const mapped = mapState({
    tenantAdmin: {
      users: { allOrganization: { data: {} } },
      patientsAllocation: {
        reviewersList: { data: { response: { patientDtoList: [] } } },
        loader: false,
        filterOptions: { data: { response: {} } },
        getRoles: { data: { response: {} } },
        rolesLoader: false,
      },
      tin: { allocationRoutedData: {}, getPageRendering: false },
    },
    tableView: { tableViewLoading: false, tableView: { data: {} } },
  });
  expect(mapped).toHaveProperty('organizationList');
}, 10000); // Increased timeout to 10 seconds

function renderQueryTable(overrides = {}) {
  const props = {
    data: { response: { metaDataDTO: [{ id: 'c1', active: true }], pageResponse: { content: [], totalElements: 0 } } },
    active: 'Pending',
    setActive: jest.fn(),
    setActiveStatus: jest.fn(),
    tableLoader: false,
    gotoPatientDetails: jest.fn(),
    setSort: jest.fn(),
    sort: {},
    statusBodyTemplate: () => null,
    ...overrides,
  };
  const Comp = loadQueryTable();
  return { ...render(<Comp {...props} />), props };
}

it('QueryTable: buttons change status; row click shows modal for Approved/Rejected and goto for Pending; pagination works', async () => {
  const { props } = renderQueryTable();

  // Change to Approved
  fireEvent.click(screen.getByTestId('regular-Approved'));
  expect(props.setActive).toHaveBeenCalledWith('Approved');
  expect(props.setActiveStatus).toHaveBeenCalledWith('APPROVED');

  // With active Approved, clicking row opens modal (assert via Ok button presence)
  cleanup();
  renderQueryTable({ active: 'Approved' });
  fireEvent.click(screen.getByTestId('table-row'));
  expect(screen.getByTestId('regular-Ok')).toBeInTheDocument();
  // Close via ok
  fireEvent.click(screen.getByTestId('regular-Ok'));

  // Pending path calls gotoPatientDetails
  cleanup();
  const { props: props2 } = renderQueryTable({ active: 'Pending' });
  fireEvent.click(screen.getByTestId('table-row'));
  expect(props2.gotoPatientDetails).toHaveBeenCalled();

  // Pagination
  fireEvent.click(screen.getByTestId('table-page'));
}, 10000); // Added timeout to prevent potential issues

it('QueryApproval: rolesLoader skeleton and error paths for submit/reset', async () => {
  // skeleton branch
  renderQueryApproval({ rolesLoader: true });
  expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  cleanup();

  // error path for submit/reset
  const { props } = renderQueryApproval({
    tableDynamicColumn: jest.fn().mockRejectedValue(new Error('boom')),
    tableDynamicColumnReset: jest.fn().mockRejectedValue(new Error('boom2')),
  });
  fireEvent.click(screen.getByTestId('table-custom'));
  fireEvent.click(screen.getByTestId('filters-submit'));
  await waitFor(() => expect(popupMock).toHaveBeenCalled());
  fireEvent.click(screen.getByTestId('filters-reset'));
  await waitFor(() => expect(popupMock).toHaveBeenCalled());
});


