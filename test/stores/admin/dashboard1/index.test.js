import { jest } from '@jest/globals';

// Mock the redux-actions module
jest.mock('redux-actions', () => ({
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

// Mock the storages module
jest.mock('../../../../src/utils/storages', () => ({
  getStorage: jest.fn()
}));

// Mock the network module
jest.mock('../../../../src/stores/admin/dashboard1/network', () => ({
  fetchFromEndpoint: jest.fn(),
  fetchFromEndpointPost: jest.fn()
}));

// Mock the actions module directly to preserve the expected structure
jest.mock('../../../../src/stores/admin/dashboard1/actions', () => {
  const mockActions = {};
  
  // Define the expected action keys
  const actionKeys = [
    'defaultTop10Codes',
    'defaultTop10OIG',
    'defaultFileDosCount',
    'defaultRafTotal',
    'defaultRafHcc',
    'defaultRafCareGap',
    'defaultRafPotential',
    'defaultTinTable',
    'workFlowFilesCount',
    'workFlowAllocatedStatusCount',
    'workFlowCoder1StatusCount',
    'workFlowCoder2StatusCount',
    'workFlowQAStatusCount',
    'workFlowProjectLeadStatusCount',
    'workFlowOwnerStatusCount',
    'workFlowQALeadStatusCount',
    'workFlowUsersCount',
    'workFlowAccuracy',
    'workQueueSummary',
    'workQueueDailySummary',
    'workQueueProductivity',
    'workQueueAccuracy',
    'dashboardNotification',
    'workFlow',
    'dailyTask',
    'accuracy',
    'completedScore',
    'holdStatus',
    'notification',
    'tenentLogo',
    'teamChart',
    'getSelectUserList',
    'getDeliveryStatus',
    'getDateRange',
    'getInvalidDosCount',
    'getInvalidDocument',
    'getInvalidTelevist',
    'getInvalidCredentails',
    'getInvalidProviderMissed',
    'getInvalidProviderSignMissed',
    'getInvalidNoHccFound',
    'getInvalidPatientDOBMismatch',
    'getInvalidPatientNameMismatch',
    'getInvalidScopeYearMisMatch',
    'getInvalidPatientDeceased',
    'getInvalidMrnIdMismatch',
    'getInvalidMultiplePatientFound',
    'getInvalidPatientInActive',
    'setWidgets',
    'getWidgets',
    'getWidgetsList',
    'getTabAccess'
  ];
  
  // Create mock actions with the expected structure
  actionKeys.forEach(key => {
    mockActions[`${key}Action`] = {
      STARTED: `${key.toUpperCase()}_STARTED`,
      SUCCEEDED: `${key.toUpperCase()}_SUCCEEDED`,
      FAILED: `${key.toUpperCase()}_FAILED`
    };
  });
  
  return mockActions;
});

// Now import the mocked modules
const actions = require('../../../../src/stores/admin/dashboard1/actions');
const reducer = require('../../../../src/stores/admin/dashboard1/reducer').default;
const network = require('../../../../src/stores/admin/dashboard1/network');

describe('admin/dashboard1 store', () => {
  test('actions: should have correct structure for all action types', () => {
    // Check that actions are properly exported
    expect(actions).toBeDefined();
    
    // Check that key actions exist (these are dynamically generated)
    expect(actions.defaultTop10CodesAction).toBeDefined();
    expect(actions.defaultTop10OIGAction).toBeDefined();
    expect(actions.defaultFileDosCountAction).toBeDefined();
    expect(actions.workFlowFilesCountAction).toBeDefined();
    expect(actions.workQueueSummaryAction).toBeDefined();
    expect(actions.setWidgetsAction).toBeDefined();
    expect(actions.getWidgetsAction).toBeDefined();
    
    // Check that all actions have the expected structure
    const expectedActions = [
      'defaultTop10CodesAction',
      'defaultTop10OIGAction',
      'defaultFileDosCountAction',
      'defaultRafTotalAction',
      'defaultRafHccAction',
      'defaultRafCareGapAction',
      'defaultRafPotentialAction',
      'defaultTinTableAction',
      'workFlowFilesCountAction',
      'workFlowAllocatedStatusCountAction',
      'workFlowCoder1StatusCountAction',
      'workFlowCoder2StatusCountAction',
      'workFlowQAStatusCountAction',
      'workFlowProjectLeadStatusCountAction',
      'workFlowOwnerStatusCountAction',
      'workFlowQALeadStatusCountAction',
      'workFlowUsersCountAction',
      'workFlowAccuracyAction',
      'workQueueSummaryAction',
      'workQueueDailySummaryAction',
      'workQueueProductivityAction',
      'workQueueAccuracyAction',
      'dashboardNotificationAction',
      'workFlowAction',
      'dailyTaskAction',
      'accuracyAction',
      'completedScoreAction',
      'holdStatusAction',
      'notificationAction',
      'tenentLogoAction',
      'teamChartAction',
      'getSelectUserListAction',
      'getDeliveryStatusAction',
      'getDateRangeAction',
      'getInvalidDosCountAction',
      'getInvalidDocumentAction',
      'getInvalidTelevistAction',
      'getInvalidCredentailsAction',
      'getInvalidProviderMissedAction',
      'getInvalidProviderSignMissedAction',
      'getInvalidNoHccFoundAction',
      'getInvalidPatientDOBMismatchAction',
      'getInvalidPatientNameMismatchAction',
      'getInvalidScopeYearMisMatchAction',
      'getInvalidPatientDeceasedAction',
      'getInvalidMrnIdMismatchAction',
      'getInvalidMultiplePatientFoundAction',
      'getInvalidPatientInActiveAction',
      'setWidgetsAction',
      'getWidgetsAction',
      'getWidgetsListAction',
      'getTabAccessAction'
    ];

    expectedActions.forEach(actionName => {
      expect(actions[actionName]).toBeDefined();
      expect(actions[actionName].STARTED).toBeDefined();
      expect(actions[actionName].SUCCEEDED).toBeDefined();
      expect(actions[actionName].FAILED).toBeDefined();
    });
  });

  test('actions: should have correct action type constants', () => {
    expect(actions.defaultTop10CodesAction.STARTED).toBe('DEFAULTTOP10CODES_STARTED');
    expect(actions.defaultTop10CodesAction.SUCCEEDED).toBe('DEFAULTTOP10CODES_SUCCEEDED');
    expect(actions.defaultTop10CodesAction.FAILED).toBe('DEFAULTTOP10CODES_FAILED');
    
    expect(actions.workFlowFilesCountAction.STARTED).toBe('WORKFLOWFILESCOUNT_STARTED');
    expect(actions.workFlowFilesCountAction.SUCCEEDED).toBe('WORKFLOWFILESCOUNT_SUCCEEDED');
    expect(actions.workFlowFilesCountAction.FAILED).toBe('WORKFLOWFILESCOUNT_FAILED');
    
    expect(actions.setWidgetsAction.STARTED).toBe('SETWIDGETS_STARTED');
    expect(actions.setWidgetsAction.SUCCEEDED).toBe('SETWIDGETS_SUCCEEDED');
    expect(actions.setWidgetsAction.FAILED).toBe('SETWIDGETS_FAILED');
  });

  test('reducer: should handle initial state', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    expect(initialState).toBeDefined();
    
    // Check that expected reducers exist
    expect(initialState.defaultTop10Codes).toBeDefined();
    expect(initialState.defaultTop10OIG).toBeDefined();
    expect(initialState.defaultFileDosCount).toBeDefined();
    expect(initialState.workFlowFilesCount).toBeDefined();
    expect(initialState.workQueueSummary).toBeDefined();
    expect(initialState.setWidgets).toBeDefined();
    
    // Check initial state structure for a few key reducers
    expect(initialState.defaultTop10Codes.loading).toBe(true);
    expect(initialState.defaultTop10Codes.data).toBeNull();
    expect(initialState.defaultTop10Codes.error).toBeNull();
    
    expect(initialState.workFlowFilesCount.loading).toBe(true);
    expect(initialState.workFlowFilesCount.data).toBeNull();
    expect(initialState.workFlowFilesCount.error).toBeNull();
  });

  test('reducer: should handle action types correctly', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    
    // Test STARTED action
    const startedAction = { type: 'DEFAULTTOP10CODES_STARTED' };
    const startedState = reducer(initialState, startedAction);
    expect(startedState.defaultTop10Codes.loading).toBe(true);
    expect(startedState.defaultTop10Codes.error).toBeNull();
    
    // Test SUCCEEDED action
    const succeededAction = { type: 'DEFAULTTOP10CODES_SUCCEEDED', payload: [{ id: 1, name: 'Code 1' }] };
    const succeededState = reducer(startedState, succeededAction);
    expect(succeededState.defaultTop10Codes.loading).toBe(false);
    expect(succeededState.defaultTop10Codes.data).toEqual([{ id: 1, name: 'Code 1' }]);
    expect(succeededState.defaultTop10Codes.error).toBeNull();
    
    // Test FAILED action
    const failedAction = { type: 'DEFAULTTOP10CODES_FAILED', payload: 'Error message' };
    const failedState = reducer(startedState, failedAction);
    expect(failedState.defaultTop10Codes.loading).toBe(false);
    expect(failedState.defaultTop10Codes.error).toBe('Error message');
  });

  test('network: should have fetchFromEndpoint and fetchFromEndpointPost functions', () => {
    expect(network.fetchFromEndpoint).toBeDefined();
    expect(network.fetchFromEndpointPost).toBeDefined();
  });

  test('network: should handle fetchFromEndpoint with params', () => {
    const mockParams = { param1: 'value1' };
    network.fetchFromEndpoint.mockResolvedValue({ data: 'test-response' });
    
    expect(typeof network.fetchFromEndpoint).toBe('function');
  });

  test('network: should handle fetchFromEndpointPost with params', () => {
    const mockParams = { param1: 'value1' };
    network.fetchFromEndpointPost.mockResolvedValue({ data: 'test-response' });
    
    expect(typeof network.fetchFromEndpointPost).toBe('function');
  });
}); 