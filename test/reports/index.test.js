import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// react-redux connect passthrough capturing calls
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

// Header and Tab mocks (avoid heavy UI)
jest.mock('../../src/jsx/layouts/nav/Header', () => () => <div data-testid="header" />);
jest.mock('../../src/mainStream/components/tags', () => ({
  __esModule: true,
  default: ({ tabs, activeTab, handleTabs, icon }) => (
    <div data-testid="tabs">
      {tabs.map((t) => (
        <button key={t} data-testid={`tab-${t}`} onClick={() => handleTabs(t)}>{t}</button>
      ))}
      <div data-testid="active-tab">{activeTab}</div>
    </div>
  ),
}));

// antd basic stubs
jest.mock('antd', () => {
  const React = require('react');
  const Button = ({ children, onClick, ...rest }) => (
    <button data-testid={rest['data-testid'] || `regular-${children}`} onClick={onClick}>{children}</button>
  );
  const Input = ({ value = '', onChange, ...rest }) => (
    <input data-testid="input" value={value} onChange={onChange} {...rest} />
  );
  const Modal = ({ open, onCancel, children }) => open ? (
    <div data-testid="modal">
      {children}
      <button data-testid="modal-close" onClick={onCancel}>close</button>
    </div>
  ) : null;
  const Radio = () => null;
  Radio.Group = ({ options = [], value, onChange }) => (
    <div data-testid="radio-group">
      {options.map((o) => (
        <button key={o.value} data-testid={`radio-${o.value}`} onClick={() => onChange?.({ target: { value: o.value } })}>{o.label}</button>
      ))}
      <div data-testid="radio-value">{String(value)}</div>
    </div>
  );
  return { __esModule: true, Button, Input, Modal, Radio };
});

// RegularButton
jest.mock('../../src/components/button', () => ({ __esModule: true, default: ({ name, onClick }) => (
  <button data-testid={`regular-${name}`} onClick={onClick}>{name}</button>
) }));

// ReusableFilters and AppTable stubs
jest.mock('../../src/components/reusableFilters', () => (props) => (
  <div>
    <button data-testid="filters-submit" onClick={() => props.handleSubmit?.([{ id: 'col1' }])}>filters-submit</button>
    <button data-testid="filters-reset" onClick={() => props.handleReset?.()}>filters-reset</button>
    <button data-testid="filters-close" onClick={() => props.onClose?.()}>filters-close</button>
    {props.btnName ? (
      <button data-testid="filters-open-gen" onClick={() => props.setIsModalOpen?.(true)}>open-gen-modal</button>
    ) : null}
  </div>
));
jest.mock('../../src/components/tables', () => (props) => (
  <div>
    <button data-testid="table-page" onClick={() => props.onPageChange?.({ first: 5, page: 1 })}>page</button>
    <button data-testid="row-checkbox" onClick={() => props.handleRowCheckboxChange?.({ e: { target: { checked: true } }, row: { id: 'TIN-1' } })}>row-checkbox</button>
    <button data-testid="row-uncheck" onClick={() => props.handleRowCheckboxChange?.({ e: { target: { checked: false } }, row: { id: 'TIN-1' } })}>row-uncheck</button>
    {props.generateBtnClick ? (
      <button data-testid="table-generate" onClick={() => props.generateBtnClick?.()}>generate</button>
    ) : null}
  </div>
));

// utils
const popupMock = jest.fn();
jest.mock('../../src/utils/reusable', () => ({
  __esModule: true,
  findItemWithTrueKey: () => true,
  findMatchesByField: () => false,
  getResponePopup: (...args) => require('../../test/reports/index.test.js').__mocks__.popup(...args),
  tableCustomFilterClearCheck: () => true,
}));
const getStorageMap = { tinNumber: 'TIN-1', userId: 'U-1', client: 'C-1' };
jest.mock('../../src/utils/storages', () => ({
  __esModule: true,
  getStorage: (k) => getStorageMap[k] || null,
}));
export const __mocks__ = { popup: popupMock };

// Stores modules (avoid reducers)
jest.mock('../../src/stores/tableView', () => ({ actions: { tableViewAction: jest.fn(), tableDynamicColumn: jest.fn(), tableDynamicColumnReset: jest.fn() } }));
jest.mock('../../src/stores/tenantAdmin/tin', () => ({ actions: { getProjectActiveTab: jest.fn(), getAllocationRoutedData: jest.fn() } }));
jest.mock('../../src/stores/tenantAdmin/report', () => ({ actions: { reportGenerate: jest.fn(), reportDownload: jest.fn() } }));

function loadProject() {
  return require('../../src/commonPages/reports').default;
}
function loadGenerateView() {
  return require('../../src/commonPages/reports/generateView').default;
}
function loadGeneratedReports() {
  return require('../../src/commonPages/reports/generatedReports').default;
}
function loadExportReportModal() {
  return require('../../src/commonPages/reports/exportReport').default;
}
function loadGenerateReportModal() {
  return require('../../src/commonPages/reports/generateReportDownload').default;
}

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

it('Project (reports): switches tabs and dispatches actions', () => {
  const getProjectActiveTab = jest.fn();
  const getTableData = jest.fn();
  const Comp = loadProject();
  render(<Comp getProjectActiveTab={getProjectActiveTab} getTableData={getTableData} activeTabName={undefined} />);
  // default active tab present
  expect(screen.getByTestId('active-tab')).toHaveTextContent('Report Generate View');
  // switch to Generated Reports
  fireEvent.click(screen.getByTestId('tab-Generated Reports'));
  expect(getTableData).toHaveBeenCalled();
  expect(getProjectActiveTab).toHaveBeenCalledWith({ reportTab: 'Generated Reports' });
});

it('GenerateView: submit/reset customization and open modal via ReusableFilters', async () => {
  const getTableData = jest.fn();
  const tableDynamicColumn = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const tableDynamicColumnReset = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const Comp = loadGenerateView();
  const data = { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } };
  render(<Comp getTableData={getTableData} data={data} tableLoader={false} tableDynamicColumn={tableDynamicColumn} tableDynamicColumnReset={tableDynamicColumnReset} />);

  fireEvent.click(screen.getByTestId('filters-submit'));
  await waitFor(() => expect(tableDynamicColumn).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();

  fireEvent.click(screen.getByTestId('filters-reset'));
  await waitFor(() => expect(tableDynamicColumnReset).toHaveBeenCalled());

  // open modal path through ReusableFilters button when btnName is provided in this view
  fireEvent.click(screen.getByTestId('filters-open-gen'));
  // Modal from GenateReportModal should render when open is true; assert presence via modal container from our antd stub
  // It will be present in DOM; no further interaction here (covered in modal tests below)
});

it('GeneratedReports: submit/reset, select/unselect row, open/close export modal, and pagination', async () => {
  const getTableData = jest.fn();
  const tableDynamicColumn = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const tableDynamicColumnReset = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const Comp = loadGeneratedReports();
  const data = { response: { metaDataDTO: [{ id: 'h1', active: true, filter: { style: true } }], pageResponse: { content: [], totalElements: 0 } } };
  render(<Comp getTableData={getTableData} data={data} tableLoader={false} tableDynamicColumn={tableDynamicColumn} tableDynamicColumnReset={tableDynamicColumnReset} routedData={{ pageNo: 1, selectedDates: [], selectedDateRanges: {}, selectedOption: {}, searchText: '', activeFilters: [], paginationFirst: 0, sort: {} }} />);
  // page change
  fireEvent.click(screen.getByTestId('table-page'));
  // filters submit/reset
  fireEvent.click(screen.getByTestId('filters-submit'));
  await waitFor(() => expect(tableDynamicColumn).toHaveBeenCalled());
  fireEvent.click(screen.getByTestId('filters-reset'));
  await waitFor(() => expect(tableDynamicColumnReset).toHaveBeenCalled());
  // close drawer
  fireEvent.click(screen.getByTestId('filters-close'));
  // select a row then open generate modal
  fireEvent.click(screen.getByTestId('row-checkbox'));
  fireEvent.click(screen.getByTestId('table-generate'));
  // uncheck row
  fireEvent.click(screen.getByTestId('row-uncheck'));
});

it('ExportReportModal: success triggers popup, closes modal, clears selection, and downloads link', async () => {
  const downloadReport = jest.fn().mockResolvedValue({ status: 'SUCCESS', response: 'https://example.com/report.xlsx' });
  const setIsModalOpen = jest.fn();
  const setSelectedRows = jest.fn();

  const appendSpy = jest.spyOn(document.body, 'appendChild');
  const removeSpy = jest.spyOn(document.body, 'removeChild');

  const Comp = loadExportReportModal();
  render(<Comp open={true} selectedRows={[1]} setIsModalOpen={setIsModalOpen} setSelectedRows={setSelectedRows} downloadReport={downloadReport} />);

  fireEvent.click(screen.getByTestId('regular-Download'));
  await waitFor(() => expect(downloadReport).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();
  expect(setIsModalOpen).toHaveBeenCalledWith(false);
  expect(setSelectedRows).toHaveBeenCalledWith([]);
  expect(appendSpy).toHaveBeenCalled();
  expect(removeSpy).toHaveBeenCalled();

  appendSpy.mockRestore();
  removeSpy.mockRestore();
});

it('ExportReportModal: error keeps modal open', async () => {
  const downloadReport = jest.fn().mockResolvedValue({ status: 'ERROR' });
  const setIsModalOpen = jest.fn();
  const setSelectedRows = jest.fn();
  const Comp = loadExportReportModal();
  render(<Comp open={true} selectedRows={[1]} setIsModalOpen={setIsModalOpen} setSelectedRows={setSelectedRows} downloadReport={downloadReport} />);
  fireEvent.click(screen.getByTestId('regular-Download'));
  await waitFor(() => expect(downloadReport).toHaveBeenCalled());
  expect(setIsModalOpen).toHaveBeenCalledWith(true);
});

it('GenerateReportModal: default name, edit, and success closes modal, clears input and selection', async () => {
  const generateReport = jest.fn().mockResolvedValue({ status: 'SUCCESS' });
  const setIsModalOpen = jest.fn();
  const setSelectedRows = jest.fn();
  const getGenerateReport = jest.fn();
  const Comp = loadGenerateReportModal();
  render(<Comp open={true} selectedRows={[1]} setIsModalOpen={setIsModalOpen} setSelectedRows={setSelectedRows} getGenerateReport={getGenerateReport} generateReport={generateReport} />);

  // default value exists (from moment); change it
  const input = screen.getByPlaceholderText('Report Name');
  fireEvent.change(input, { target: { value: 'My Report' } });
  expect(screen.getByPlaceholderText('Report Name').value).toBe('My Report');

  // click Generate
  fireEvent.click(screen.getByTestId('regular-Generate'));
  await waitFor(() => expect(generateReport).toHaveBeenCalled());
  expect(popupMock).toHaveBeenCalled();
  expect(getGenerateReport).toHaveBeenCalled();
  expect(setIsModalOpen).toHaveBeenCalledWith(false);
  expect(setSelectedRows).toHaveBeenCalledWith([]);
});


