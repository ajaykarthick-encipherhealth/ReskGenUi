import { jest } from '@jest/globals';

// Mock the redux-actions module
jest.mock('redux-actions', () => ({
  createAction: jest.fn((type) => type),
  handleActions: jest.fn((handlers, initialState) => (state = initialState, action) => {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }
    return state;
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
jest.mock('../../../../src/stores/admin/report/network', () => ({
  adminApi: jest.fn(),
  checkAllApi: jest.fn(),
  updateSent: jest.fn(),
  usersList: jest.fn(),
  usersLists: jest.fn(),
  exportData: jest.fn(),
  getSelectedReport: jest.fn(),
  sentApi: jest.fn(),
  receivedApi: jest.fn()
}));

// Now import the actual modules
const actions = require('../../../../src/stores/admin/report/actions');
const reducer = require('../../../../src/stores/admin/report/reducer').default;
const network = require('../../../../src/stores/admin/report/network');

describe('admin/report store', () => {
  test('actions: should have correct structure for all action types', () => {
    // Check that actions are properly exported
    expect(actions.adminReport).toBeDefined();
    expect(actions.adminCheckAllReport).toBeDefined();
    expect(actions.selectedRow).toBeDefined();
    expect(actions.activeTab).toBeDefined();
    expect(actions.selectedReport).toBeDefined();
    expect(actions.getReportActiveTab).toBeDefined();
    expect(actions.updateSentReport).toBeDefined();
    expect(actions.getUsersList).toBeDefined();
    expect(actions.getUsersLists).toBeDefined();
    expect(actions.getExportDetails).toBeDefined();
    expect(actions.GetSelectedReport).toBeDefined();
    expect(actions.sentReport).toBeDefined();
    expect(actions.receivedReport).toBeDefined();
    
    // Check that thunk actions have the expected structure
    expect(actions.adminReport.STARTED).toBeDefined();
    expect(actions.adminReport.SUCCEEDED).toBeDefined();
    expect(actions.adminReport.FAILED).toBeDefined();
    
    expect(actions.adminCheckAllReport.STARTED).toBeDefined();
    expect(actions.adminCheckAllReport.SUCCEEDED).toBeDefined();
    expect(actions.adminCheckAllReport.FAILED).toBeDefined();
    
    expect(actions.updateSentReport.STARTED).toBeDefined();
    expect(actions.updateSentReport.SUCCEEDED).toBeDefined();
    expect(actions.updateSentReport.FAILED).toBeDefined();
    
    expect(actions.getUsersList.STARTED).toBeDefined();
    expect(actions.getUsersList.SUCCEEDED).toBeDefined();
    expect(actions.getUsersList.FAILED).toBeDefined();
    
    expect(actions.getUsersLists.STARTED).toBeDefined();
    expect(actions.getUsersLists.SUCCEEDED).toBeDefined();
    expect(actions.getUsersLists.FAILED).toBeDefined();
    
    expect(actions.getExportDetails.STARTED).toBeDefined();
    expect(actions.getExportDetails.SUCCEEDED).toBeDefined();
    expect(actions.getExportDetails.FAILED).toBeDefined();
    
    expect(actions.GetSelectedReport.STARTED).toBeDefined();
    expect(actions.GetSelectedReport.SUCCEEDED).toBeDefined();
    expect(actions.GetSelectedReport.FAILED).toBeDefined();
    
    expect(actions.sentReport.STARTED).toBeDefined();
    expect(actions.sentReport.SUCCEEDED).toBeDefined();
    expect(actions.sentReport.FAILED).toBeDefined();
    
    expect(actions.receivedReport.STARTED).toBeDefined();
    expect(actions.receivedReport.SUCCEEDED).toBeDefined();
    expect(actions.receivedReport.FAILED).toBeDefined();
  });

  test('actions: should have correct action type constants', () => {
    expect(actions.adminReport.STARTED).toBe('REVIEWER_STARTED');
    expect(actions.adminReport.SUCCEEDED).toBe('REVIEWER_SUCCEEDED');
    expect(actions.adminReport.FAILED).toBe('REVIEWER_FAILED');
    
    expect(actions.adminCheckAllReport.STARTED).toBe('ADMIN_CHECK_ALL_STARTED');
    expect(actions.adminCheckAllReport.SUCCEEDED).toBe('ADMIN_CHECK_ALL_SUCCEEDED');
    expect(actions.adminCheckAllReport.FAILED).toBe('ADMIN_CHECK_ALL_FAILED');
    
    expect(actions.selectedRow).toBe('SELECTED_ROW');
    expect(actions.activeTab).toBe('ACTIVE_TAB');
    expect(actions.selectedReport).toBe('SELECTED_REPORT');
    expect(actions.getReportActiveTab).toBe('GET_REPORT_ACTIVE_TAB');
  });

  test('reducer: should handle initial state', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    expect(initialState).toBeDefined();
    
    // Check that expected reducers exist
    expect(initialState.admin).toBeDefined();
    expect(initialState.adminLoader).toBeDefined();
    expect(initialState.checkedData).toBeDefined();
    expect(initialState.checkedLoader).toBeDefined();
    expect(initialState.selectedRow).toBeDefined();
    expect(initialState.activeTab).toBeDefined();
    expect(initialState.updateSentReport).toBeDefined();
    expect(initialState.usersList).toBeDefined();
    expect(initialState.usersLists).toBeDefined();
    expect(initialState.selectedReport).toBeDefined();
    expect(initialState.exportData).toBeDefined();
    expect(initialState.exportLoader).toBeDefined();
    expect(initialState.reportActiveTab).toBeDefined();
    expect(initialState.receivedReport).toBeDefined();
    expect(initialState.GetSelectedReport).toBeDefined();
    expect(initialState.sentReport).toBeDefined();
    
    // Check initial state structure for a few key reducers
    expect(initialState.admin.loading).toBe(true);
    expect(initialState.admin.data).toBeNull();
    expect(initialState.admin.error).toBeNull();
    
    expect(initialState.checkedData.loading).toBe(true);
    expect(initialState.checkedData.data).toBeNull();
    expect(initialState.checkedData.error).toBeNull();
    
    expect(initialState.selectedRow).toEqual([]);
    expect(initialState.activeTab).toBe('');
    expect(initialState.selectedReport).toBe('');
  });

  test('reducer: should handle REVIEWER_STARTED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'REVIEWER_STARTED' };
    const newState = reducer(initialState, action);
    
    expect(newState.admin.loading).toBe(true);
    expect(newState.admin.error).toBeNull();
  });

  test('reducer: should handle REVIEWER_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'REVIEWER_SUCCEEDED', payload: [{ id: 1, title: 'Report 1' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.admin.loading).toBe(false);
    expect(newState.admin.data).toEqual([{ id: 1, title: 'Report 1' }]);
    expect(newState.admin.error).toBeNull();
  });

  test('reducer: should handle SELECTED_ROW action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'SELECTED_ROW', payload: [{ id: 1, name: 'Row 1' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.selectedRow).toEqual([{ id: 1, name: 'Row 1' }]);
  });

  test('reducer: should handle ACTIVE_TAB action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'ACTIVE_TAB', payload: 'tab1' };
    const newState = reducer(initialState, action);
    
    expect(newState.activeTab).toBe('tab1');
  });

  test('network: should have all required functions', () => {
    expect(network.adminApi).toBeDefined();
    expect(network.checkAllApi).toBeDefined();
    expect(network.updateSent).toBeDefined();
    expect(network.usersList).toBeDefined();
    expect(network.usersLists).toBeDefined();
    expect(network.exportData).toBeDefined();
    expect(network.getSelectedReport).toBeDefined();
    expect(network.sentApi).toBeDefined();
    expect(network.receivedApi).toBeDefined();
  });
}); 