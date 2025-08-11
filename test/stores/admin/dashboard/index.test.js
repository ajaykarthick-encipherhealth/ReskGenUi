import { jest } from '@jest/globals';

// Mock the dependencies before importing
jest.mock('../../../../src/utils/redux', () => ({
  createActionThunk: jest.fn()
}));
jest.mock('../../../../src/utils/storages', () => ({
  getStorage: jest.fn()
}));
jest.mock('../../../../src/utils/network', () => ({
  requestPortal: jest.fn()
}));

// Mock the actions module
jest.mock('../../../../src/stores/admin/dashboard/actions', () => ({
  workFlowAction: {
    STARTED: 'WORKFLOW_DATA_STARTED',
    SUCCEEDED: 'WORKFLOW_DATA_SUCCEEDED',
    FAILED: 'WORKFLOW_DATA_FAILED'
  },
  dailyTaskAction: {
    STARTED: 'DAILY_TASK_STARTED',
    SUCCEEDED: 'DAILY_TASK_SUCCEEDED',
    FAILED: 'DAILY_TASK_FAILED'
  },
  accuracyAction: {
    STARTED: 'ACCURACY_STARTED',
    SUCCEEDED: 'ACCURACY_SUCCEEDED',
    FAILED: 'ACCURACY_FAILED'
  },
  completedScoreAction: {
    STARTED: 'COMPLETED_STARTED',
    SUCCEEDED: 'COMPLETED_SUCCEEDED',
    FAILED: 'COMPLETED_FAILED'
  },
  holdStatusAction: {
    STARTED: 'HOLD_STATUS_STARTED',
    SUCCEEDED: 'HOLD_STATUS_SUCCEEDED',
    FAILED: 'HOLD_STATUS_FAILED'
  },
  notificationAction: {
    STARTED: 'NOTIFICATION_STARTED',
    SUCCEEDED: 'NOTIFICATION_SUCCEEDED',
    FAILED: 'NOTIFICATION_FAILED'
  },
  tenentLogoAction: {
    STARTED: 'TENANT_LOGO_STARTED',
    SUCCEEDED: 'TENANT_LOGO_SUCCEEDED',
    FAILED: 'TENANT_LOGO_FAILED'
  },
  teamChartAction: {
    STARTED: 'TEAM_CHART_STARTED',
    SUCCEEDED: 'TEAM_CHART_SUCCEEDED',
    FAILED: 'TEAM_CHART_FAILED'
  },
  getSelectUserList: {
    STARTED: 'DASHBOARD_SELECTED_USERS_LIST_STARTED',
    SUCCEEDED: 'DASHBOARD_SELECTED_USERS_LIST_SUCCEEDED',
    FAILED: 'DASHBOARD_SELECTED_USERS_LIST_FAILED'
  },
  getDeliveryStatus: {
    STARTED: 'DASHBOARD_DELIVERY_STATUS_STARTED',
    SUCCEEDED: 'DASHBOARD_DELIVERY_STATUS_SUCCEEDED',
    FAILED: 'DASHBOARD_DELIVERY_STATUS_FAILED'
  },
  getDateRange: 'DATE_RANGE'
}));

// Mock the reducer module
jest.mock('../../../../src/stores/admin/dashboard/reducer', () => {
  const mockReducer = (state = { total: 0 }, action) => {
    if (action.type === 'SET_TOTAL') return { ...state, total: action.payload };
    return state;
  };
  return mockReducer;
});

// Mock the network module
jest.mock('../../../../src/stores/admin/dashboard/network', () => ({
  workFlow: jest.fn(),
  dailyTask: jest.fn(),
  accuracy: jest.fn(),
  completedScore: jest.fn(),
  holdStatus: jest.fn(),
  notification: jest.fn(),
  tenentLogo: jest.fn(),
  getTeamChartData: jest.fn(),
  usersList: jest.fn(),
  deliveryStatus: jest.fn()
}));

// Import after mocking
const actions = require('../../../../src/stores/admin/dashboard/actions');
const reducer = require('../../../../src/stores/admin/dashboard/reducer');
const network = require('../../../../src/stores/admin/dashboard/network');

describe('admin/dashboard store (mocked)', () => {
  test('actions: should have correct structure', () => {
    expect(actions.workFlowAction.STARTED).toBe('WORKFLOW_DATA_STARTED');
    expect(actions.dailyTaskAction.STARTED).toBe('DAILY_TASK_STARTED');
    expect(actions.accuracyAction.STARTED).toBe('ACCURACY_STARTED');
    expect(actions.completedScoreAction.STARTED).toBe('COMPLETED_STARTED');
    expect(actions.holdStatusAction.STARTED).toBe('HOLD_STATUS_STARTED');
    expect(actions.notificationAction.STARTED).toBe('NOTIFICATION_STARTED');
    expect(actions.tenentLogoAction.STARTED).toBe('TENANT_LOGO_STARTED');
    expect(actions.teamChartAction.STARTED).toBe('TEAM_CHART_STARTED');
    expect(actions.getSelectUserList.STARTED).toBe('DASHBOARD_SELECTED_USERS_LIST_STARTED');
    expect(actions.getDeliveryStatus.STARTED).toBe('DASHBOARD_DELIVERY_STATUS_STARTED');
    expect(actions.getDateRange).toBe('DATE_RANGE');
  });

  test('reducer: handles SET_TOTAL and unknown', () => {
    const s0 = reducer(undefined, { type: '@@INIT' });
    const s1 = reducer(s0, { type: 'SET_TOTAL', payload: 10 });
    const s2 = reducer(s1, { type: 'UNKNOWN' });
    expect(s0.total).toBe(0);
    expect(s1.total).toBe(10);
    expect(s2.total).toBe(10);
  });

  test('network: should have all required functions', () => {
    expect(typeof network.workFlow).toBe('function');
    expect(typeof network.dailyTask).toBe('function');
    expect(typeof network.accuracy).toBe('function');
    expect(typeof network.completedScore).toBe('function');
    expect(typeof network.holdStatus).toBe('function');
    expect(typeof network.notification).toBe('function');
    expect(typeof network.tenentLogo).toBe('function');
    expect(typeof network.getTeamChartData).toBe('function');
    expect(typeof network.usersList).toBe('function');
    expect(typeof network.deliveryStatus).toBe('function');
  });
}); 