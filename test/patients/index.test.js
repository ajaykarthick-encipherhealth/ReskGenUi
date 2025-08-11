// react-redux connect passthrough
jest.mock('react-redux', () => ({ connect: () => (C) => C }));
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// connect passthrough
jest.mock('react-redux', () => ({ connect: () => (C) => C }));

// Router
const pushMock = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ push: pushMock, pathname: '/tenantadmin/project' }) }));

// Avoid pulling Header heavy deps (redux-actions)
jest.mock('../../src/jsx/layouts/nav/Header', () => () => <div data-testid="header" />);
jest.mock('redux-actions', () => ({ createAction: jest.fn(), handleActions: jest.fn() }), { virtual: true });

// Mock heavy store modules to avoid pulling utils/redux
jest.mock('../../src/stores/tenantAdmin/patients', () => ({ actions: {} }));
jest.mock('../../src/stores/tenantAdmin/patientSync', () => ({ actions: {} }));
jest.mock('../../src/stores/admin/patientAllocation', () => ({ actions: {} }));
jest.mock('../../src/stores/admin/workqueue', () => ({ actions: {} }));
jest.mock('../../src/stores/reviewer/workqueue', () => ({ actions: {} }));
jest.mock('../../src/stores/tableView', () => ({ actions: {} }));

// FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({ FontAwesomeIcon: () => <i data-testid="fa" /> }));

// antd mocks
const notif = { warning: jest.fn() };
jest.mock('antd', () => {
  const React = require('react');
  const Badge = ({ children }) => <div data-testid="Badge">{children}</div>;
  const Button = ({ children, onClick, ...rest }) => <button onClick={onClick} {...rest}>{children}</button>;
  const Popover = ({ children }) => <div data-testid="Popover">{children}</div>;
  const Tooltip = ({ children }) => <span data-testid="Tooltip">{children}</span>;
  const Spin = ({ children }) => <div data-testid="Spin">{children}</div>;
  const Form = ({ children }) => <form data-testid="Form">{children}</form>;
  Form.useForm = () => [({ resetFields: jest.fn() })];
  return { __esModule: true, Badge, Button, Popover, Tooltip, Spin, Form, notification: notif };
});
jest.mock('@ant-design/icons', () => ({ LoadingOutlined: () => <span data-testid="loading-icon" /> }));

// storages
const setStorageMock = jest.fn();
jest.mock('../../src/utils/storages', () => ({
  getStorage: (k) => ({ tenantId: 'TEN-1', userId: 'UID-1', orgId: 'ORG-1', tinNumber: 'TIN-1', userRole: 'OWNER' })[k] || null,
  setStorage: (...args) => require('../../test/patients/index.test.js').__mocks__.setStorage(...args),
}));
export const __mocks__ = { setStorage: setStorageMock };

// reusable helpers
const popupMock = jest.fn();
jest.mock('../../src/utils/reusable', () => ({
  createIdGens: (k) => `id-${k}`,
  findItemWithTrueKey: () => true,
  findMatchesByField: () => false,
  getResponePopup: (...args) => popupMock(...args),
  tableCustomFilterClearCheck: () => true,
}));

// validateYear
jest.mock('../../src/components/headerFilters/functions', () => ({ validateYear: jest.fn(() => true) }));

// Child components
jest.mock('../../src/components/reusableFilters', () => (props) => (
  <div>
    <button data-testid="customize-submit" onClick={() => props.handleSubmit([{ id: 'col1' }])}>customize-submit</button>
    <button data-testid="customize-reset" onClick={() => props.handleReset()}>customize-reset</button>
  </div>
));

jest.mock('../../src/components/tables', () => (props) => (
  <div>
    <button data-testid="row-positive" onClick={() => props.onRowClick({ patientId: 'P1', computing: 2 })}>row+</button>
    <button data-testid="row-negative" onClick={() => props.onRowClick({ patientId: 'P2', computing: 1 })}>row-</button>
    <div data-testid="status-render">
      {props.statusBodyTemplate({ patientId: 'a', computing: 0 })}
      {props.statusBodyTemplate({ patientId: 'b', computing: 1 })}
      {props.statusBodyTemplate({ patientId: 'c', computing: 2 })}
      {props.statusBodyTemplate({ patientId: 'd', computing: 3 })}
    </div>
    <div data-testid="flag-render">
      {props.renderFlagCell({ flagList: [] })}
      {props.renderFlagCell({ flagList: [{ flagColour: '#f00', flagName: 'X', priority: 1 }] })}
    </div>
    <button data-testid="paginate" onClick={() => props.onPageChange({ first: 5, page: 1 })}>paginate</button>
    <button data-testid="action-template" onClick={() => props.actionBodyTemplate({ processedStatus: 'DONE', uploadDisable: false })}>action</button>
  </div>
));

jest.mock('../../src/components/patientDetails/details/components/svg/svg', () => () => <i data-testid="svg-flag" />);

jest.mock('../../src/commonPages/fileprocessing/FileUploading', () => (props) => (
  <div>
    <button data-testid="set-emr" onClick={() => props.setEmrType('EMR')}>set-emr</button>
    <button data-testid="set-year" onClick={() => props.handleChange('2024', 'year')}>set-year</button>
    <button data-testid="choose-file" onClick={() => props.onChangeFile([new File(['a'], 'a.pdf')])}>choose-file</button>
    <button
      data-testid="submit-file"
      onClick={() => props.handleSubmit({ currentTarget: { checkValidity: () => true }, preventDefault: () => {}, stopPropagation: () => {} })}
    >submit-file</button>
  </div>
));

jest.mock('../../src/commonPages/fileprocessing/Addpatiens', () => (props) => (
  <div>
    {props.addPatientId ? <div data-testid="addpatients-open" /> : null}
    <button data-testid="submit-patient-id" onClick={() => props.handleSubmitPatientId({ patientId: 'P123', patientName: 'John', processStageId: 'STG' }, { resetFields: jest.fn() })}>submit-id</button>
    <button data-testid="submit-patient-id-error" onClick={() => props.handleSubmitPatientId({ patientId: 'E1', patientName: 'Err', processStageId: 'STG' }, { resetFields: jest.fn() })}>submit-id-err</button>
  </div>
));

function loadComponent() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('../../src/commonPages/patients').default;
}

function renderWith(overrides = {}) {
  const getPatientId = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const uploadFiles = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const uploadFilesRadiology = jest.fn().mockResolvedValue({ status: 202 });
  const getRetreggerPatient = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const tableDynamicColumn = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const tableDynamicColumnReset = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const getRoutedData = jest.fn();
  const getAllFlags = jest.fn();
  const getTableData = jest.fn();

  const props = {
    organizationList: { response: [{ id: 'O1', name: 'Org' }] },
    allPatientList: { data: { response: { patientDtoList: { content: [] } } } },
    webSocketData: null,
    tableLoader: false,
    getPatientId,
    uploadFiles,
    uploadFilesRadiology,
    getRetreggerPatient,
    getFilters: jest.fn(),
    filteredList: [],
    routedData: null,
    getAllBatchList: jest.fn(),
    batchList: {},
    getRoutedData,
    getAllFlags,
    route: '/tenantadmin/patients/details',
    getTableData,
    patientDetails: jest.fn(),
    data: { response: { metaDataDTO: [{ id: 'c1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 }, staticDesign: 'upload' } },
    tableDynamicColumn,
    tableDynamicColumnReset,
    pageLoad: false,
    ...overrides,
  };
  const Comp = loadComponent();
  return { ...render(<Comp {...props} />), props };
}

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

it('positive flows: add patient, submit id, customize table, go to details, file upload', async () => {
  const { props } = renderWith();
  // Add Patient button
  const addBtn = screen.getByText(/Add Patient/i);
  fireEvent.click(addBtn);
  expect(screen.getByTestId('addpatients-open')).toBeInTheDocument();

  // Submit PatientId success
  fireEvent.click(screen.getByTestId('submit-patient-id'));
  await waitFor(() => expect(props.getPatientId).toHaveBeenCalled());
  await waitFor(() => expect(props.getTableData).toHaveBeenCalled());

  // Customize table save and reset
  fireEvent.click(screen.getByTestId('customize-submit'));
  await waitFor(() => expect(props.tableDynamicColumn).toHaveBeenCalled());
  fireEvent.click(screen.getByTestId('customize-reset'));
  await waitFor(() => expect(props.tableDynamicColumnReset).toHaveBeenCalled());

  // Row click - computed triggers patientDetails and would navigate in app
  fireEvent.click(screen.getByTestId('row-positive'));
  await waitFor(() => expect(props.patientDetails).toHaveBeenCalled());

  // Row click - processing negative path executes without navigation
  fireEvent.click(screen.getByTestId('row-negative'));

  // File upload flow
  fireEvent.click(screen.getByTestId('set-emr'));
  fireEvent.click(screen.getByTestId('set-year'));
  fireEvent.click(screen.getByTestId('choose-file'));
  fireEvent.click(screen.getByTestId('submit-file'));
  await waitFor(() => expect(props.uploadFiles).toHaveBeenCalled());

  // Status and flags rendered
  expect(screen.getByTestId('status-render')).toBeInTheDocument();
  expect(screen.getByTestId('flag-render')).toBeInTheDocument();

  // Pagination
  fireEvent.click(screen.getByTestId('paginate'));
});


