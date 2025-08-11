import { jest } from '@jest/globals';

// Mock the redux utils module
jest.mock('../../../../src/utils/redux', () => ({
  createActionThunk: jest.fn((type, networkFunction) => {
    const mockFactory = jest.fn();
    mockFactory.NAME = type;
    mockFactory.START = `${type}_STARTED`;
    mockFactory.SUCCEEDED = `${type}_SUCCEEDED`;
    mockFactory.FAILED = `${type}_FAILED`;
    mockFactory.ENDED = `${type}_ENDED`;
    return mockFactory;
  })
}));

// Mock the network module
jest.mock('../../../../src/stores/tenantAdmin/notification/network', () => ({
  getCustomAllUsers: jest.fn()
}));

// Now import the actual modules
const actions = require('../../../../src/stores/tenantAdmin/notification/actions');
const network = require('../../../../src/stores/tenantAdmin/notification/network');

describe('tenantAdmin/notification actions', () => {
  test('should have getCustomUsersAction exported', () => {
    expect(actions.getCustomUsersAction).toBeDefined();
  });

  test('should have correct action type structure for getCustomUsersAction', () => {
    expect(actions.getCustomUsersAction.START).toBeDefined();
    expect(actions.getCustomUsersAction.SUCCEEDED).toBeDefined();
    expect(actions.getCustomUsersAction.FAILED).toBeDefined();
    expect(actions.getCustomUsersAction.ENDED).toBeDefined();
    
    expect(actions.getCustomUsersAction.START).toBe('GET_CUSTOM_USERS_STARTED');
    expect(actions.getCustomUsersAction.SUCCEEDED).toBe('GET_CUSTOM_USERS_SUCCEEDED');
    expect(actions.getCustomUsersAction.FAILED).toBe('GET_CUSTOM_USERS_FAILED');
    expect(actions.getCustomUsersAction.ENDED).toBe('GET_CUSTOM_USERS_ENDED');
  });

  test('should have correct NAME property', () => {
    expect(actions.getCustomUsersAction.NAME).toBe('GET_CUSTOM_USERS');
  });

  test('should use createActionThunk with correct parameters', () => {
    const { createActionThunk } = require('../../../../src/utils/redux');
    
    expect(createActionThunk).toHaveBeenCalledWith(
      'GET_CUSTOM_USERS',
      network.getCustomAllUsers
    );
  });
}); 