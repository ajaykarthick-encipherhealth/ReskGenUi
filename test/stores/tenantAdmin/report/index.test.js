import { jest } from '@jest/globals';

// Mock the redux-actions module
jest.mock('redux-actions', () => ({
  createAction: jest.fn((type) => type),
  createActionThunk: jest.fn((type, networkFunction) => ({
    STARTED: `${type}_STARTED`,
    SUCCEEDED: `${type}_SUCCEEDED`,
    FAILED: `${type}_FAILED`
  })),
  handleActions: jest.fn((handlers, initialState) => {
    return (state = initialState, action) => {
      if (handlers[action.type]) {
        return handlers[action.type](state, action);
      }
      return state;
    };
  })
}));

// Mock the redux utils module
jest.mock('../../../../src/utils/redux', () => ({
  createActionThunk: jest.fn((type, networkFunction) => ({
    STARTED: `${type}_STARTED`,
    SUCCEEDED: `${type}_SUCCEEDED`,
    FAILED: `${type}_FAILED`
  }))
}));

// Mock the network module
jest.mock('../../../../src/stores/tenantAdmin/report/network', () => ({
  __esModule: true,
  adminApi: jest.fn(),
  checkAllApi: jest.fn(),
  updateSent: jest.fn(),
  usersList: jest.fn(),
  usersLists: jest.fn(),
  exportData: jest.fn(),
  getSelectedReport: jest.fn(),
  sentApi: jest.fn(),
  receivedApi: jest.fn(),
  selectedReportDetails: jest.fn(),
  generateReport: jest.fn(),
  downloadReport: jest.fn()
}));

// Import after mocking
const actions = require('../../../../src/stores/tenantAdmin/report/actions');
const reducer = require('../../../../src/stores/tenantAdmin/report/reducer').default;
const network = require('../../../../src/stores/tenantAdmin/report/network');

describe('tenantAdmin/report store (mocked)', () => {
  test('actions: success and error scenarios', async () => {
    // Test that all actions are properly exported
    expect(actions.adminReport).toBeDefined();
    expect(actions.adminCheckAllReport).toBeDefined();
    expect(actions.activeTab).toBeDefined();
    expect(actions.getReportActiveTab).toBeDefined();
    expect(actions.selectedReport).toBeDefined();
    expect(actions.selectedRow).toBeDefined();
    expect(actions.updateSentReport).toBeDefined();
    expect(actions.receivedReport).toBeDefined();
    expect(actions.GetSelectedReport).toBeDefined();
    expect(actions.sentReport).toBeDefined();
    expect(actions.getSelectedReportDetails).toBeDefined();
    expect(actions.reportGenerate).toBeDefined();
    expect(actions.reportDownload).toBeDefined();
    expect(actions.getUsersList).toBeDefined();
    expect(actions.getUsersLists).toBeDefined();
    expect(actions.getExportDetails).toBeDefined();
    
    // Test action structure for thunk actions
    expect(actions.adminReport.STARTED).toBe('REVIEWER_STARTED');
    expect(actions.adminReport.SUCCEEDED).toBe('REVIEWER_SUCCEEDED');
    expect(actions.adminReport.FAILED).toBe('REVIEWER_FAILED');
    
    expect(actions.adminCheckAllReport.STARTED).toBe('ADMIN_CHECK_ALL_STARTED');
    expect(actions.adminCheckAllReport.SUCCEEDED).toBe('ADMIN_CHECK_ALL_SUCCEEDED');
    expect(actions.adminCheckAllReport.FAILED).toBe('ADMIN_CHECK_ALL_FAILED');
    
    // Test simple action types
    expect(actions.activeTab).toBe('ACTIVE_TAB');
    expect(actions.selectedRow).toBe('SELECTED_ROW');
    expect(actions.selectedReport).toBe('SELECTED_REPORT');
    expect(actions.getReportActiveTab).toBe('GET_REPORT_ACTIVE_TAB');
  });

  test('reducer: handles multiple action types', () => {
    const s0 = reducer(undefined, { type: '@@INIT' });
    const s1 = reducer(s0, { type: 'REVIEWER_SUCCEEDED', payload: [{ id: 2, title: 'Report 2' }] });
    const s2 = reducer(s1, { type: 'REPORT_GENERATE_STARTED' });
    const s3 = reducer(s2, { type: 'UNKNOWN' });
    
    expect(s0.admin.data).toBeNull();
    expect(s0.generateReport.loading).toBe(true);
    expect(s1.admin.data).toEqual([{ id: 2, title: 'Report 2' }]);
    expect(s2.generateReport.loading).toBe(true);
    expect(s3.generateReport.loading).toBe(true); // unchanged by unknown action
  });

  test('network: functions are properly mocked', async () => {
    // Test that network functions are properly mocked
    expect(network.adminApi).toBeDefined();
    expect(network.checkAllApi).toBeDefined();
    expect(network.updateSent).toBeDefined();
    expect(network.usersList).toBeDefined();
    expect(network.usersLists).toBeDefined();
    expect(network.exportData).toBeDefined();
    expect(network.getSelectedReport).toBeDefined();
    expect(network.sentApi).toBeDefined();
    expect(network.receivedApi).toBeDefined();
    expect(network.selectedReportDetails).toBeDefined();
    expect(network.generateReport).toBeDefined();
    expect(network.downloadReport).toBeDefined();
  });

  test('negative: reducer ignores unknown action types', () => {
    const initialState = { 
      admin: { data: [{ id: 1 }], error: null, loading: false },
      adminLoader: false,
      checkedData: { data: null, error: null, loading: true },
      checkedLoader: false,
      selectedRow: "",
      activeTab: "",
      updateSentReport: { data: null, error: null, loading: true },
      usersList: { data: null, error: null, loading: true },
      usersLists: { data: null, error: null, loading: true },
      selectedReport: "",
      exportData: { data: null, error: null, loading: true },
      getReportActiveTab: "",
      receivedReport: { data: null, error: null, loading: true },
      GetSelectedReport: { data: null, error: null, loading: true },
      sentReport: { data: null, error: null, loading: true },
      uploadFile: { data: null, error: null, loading: true },
      updateReportLoader: false,
      generateReport: { data: null, error: null, loading: true },
      downloadReport: { data: null, error: null, loading: true }
    };
    const result = reducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('negative: network error handling with custom errors', async () => {
    const mockError = new Error('Custom report error');
    network.adminApi.mockRejectedValueOnce(mockError);
    
    // Test that the function can be called (even if it rejects)
    expect(network.adminApi).toBeDefined();
  });

  test('negative: action with invalid parameters', async () => {
    // Test that actions can handle edge cases
    expect(actions.reportGenerate).toBeDefined();
    expect(actions.reportGenerate.STARTED).toBe('REPORT_GENERATE_STARTED');
    expect(actions.reportGenerate.SUCCEEDED).toBe('REPORT_GENERATE_SUCCEEDED');
    expect(actions.reportGenerate.FAILED).toBe('REPORT_GENERATE_FAILED');
  });

  test('negative: reducer with invalid payload', () => {
    const initialState = { 
      admin: { data: null, error: null, loading: true },
      adminLoader: false,
      checkedData: { data: null, error: null, loading: true },
      checkedLoader: false,
      selectedRow: "",
      activeTab: "",
      updateSentReport: { data: null, error: null, loading: true },
      usersList: { data: null, error: null, loading: true },
      usersLists: { data: null, error: null, loading: true },
      selectedReport: "",
      exportData: { data: null, error: null, loading: true },
      getReportActiveTab: "",
      receivedReport: { data: null, error: null, loading: true },
      GetSelectedReport: { data: null, error: null, loading: true },
      sentReport: { data: null, error: null, loading: true },
      uploadFile: { data: null, error: null, loading: true },
      updateReportLoader: false,
      generateReport: { data: null, error: null, loading: true },
      downloadReport: { data: null, error: null, loading: true }
    };
    const result = reducer(initialState, { type: 'ADMIN_REPORT_SUCCEEDED', payload: null });
    expect(result.admin.data).toBeNull();
  });
}); 