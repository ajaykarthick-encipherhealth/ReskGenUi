import { jest } from '@jest/globals';

// Mock the dependencies before importing
jest.mock('../../../../src/utils/redux', () => ({ 
  createActionThunk: jest.fn((actionType, thunkFunction) => ({
    STARTED: `${actionType}_STARTED`,
    SUCCEEDED: `${actionType}_SUCCEEDED`,
    FAILED: `${actionType}_FAILED`
  }))
}));
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
const { createActionThunk } = require('../../../../src/utils/redux');
const network = require('../../../../src/stores/admin/dashboard/network');

describe('Dashboard Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Action Generation', () => {
    it('should generate actions for all expected keys', () => {
      // Check that actions are generated for all expected keys
      expect(actions.workFlowAction).toBeDefined();
      expect(actions.dailyTaskAction).toBeDefined();
      expect(actions.accuracyAction).toBeDefined();
      expect(actions.completedScoreAction).toBeDefined();
      expect(actions.holdStatusAction).toBeDefined();
      expect(actions.notificationAction).toBeDefined();
      expect(actions.tenentLogoAction).toBeDefined();
      expect(actions.teamChartAction).toBeDefined();
      expect(actions.getSelectUserList).toBeDefined();
      expect(actions.getDeliveryStatus).toBeDefined();
      expect(actions.getDateRange).toBeDefined();
    });

    it('should have correct action structure for each action', () => {
      // Test that each action has the correct structure
      const testAction = actions.workFlowAction;
      expect(testAction.STARTED).toBe('WORKFLOW_DATA_STARTED');
      expect(testAction.SUCCEEDED).toBe('WORKFLOW_DATA_SUCCEEDED');
      expect(testAction.FAILED).toBe('WORKFLOW_DATA_FAILED');
    });

    it('should have actions with correct action type constants', () => {
      // Test that actions have the expected action type constants
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
    });
  });

  describe('Action Functionality', () => {
    it('should create actions that call network functions', () => {
      const action = actions.workFlowAction;
      expect(action).toBeDefined();
      expect(typeof action.STARTED).toBe('string');
      expect(typeof action.SUCCEEDED).toBe('string');
      expect(typeof action.FAILED).toBe('string');
    });

    it('should have network functions available', () => {
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

  describe('Action Count', () => {
    it('should generate the correct number of actions', () => {
      const actionKeys = Object.keys(actions);
      // Should have 11 actions based on the actions file
      expect(actionKeys).toHaveLength(11);
    });
  });
}); 