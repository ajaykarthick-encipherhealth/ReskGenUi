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

// Mock the antd module
jest.mock('antd', () => ({
  notification: jest.fn()
}));

// Mock the network module
jest.mock('../../../../src/utils/network', () => ({
  requestPortal: jest.fn()
}));

// Mock the storages module
jest.mock('../../../../src/utils/storages', () => ({
  getStorage: jest.fn()
}));

// Now import the actual modules
const actions = require('../../../../src/stores/admin/notifications/actions');
const reducer = require('../../../../src/stores/admin/notifications/reducer').default;
const network = require('../../../../src/stores/admin/notifications/network');

describe('admin/notifications store', () => {
  test('actions: should have correct structure for all action types', () => {
    // Check that actions are properly exported
    expect(actions.getNotificationList).toBeDefined();
    expect(actions.getPostNotificationList).toBeDefined();
    
    // Check that actions have the expected structure
    expect(actions.getNotificationList.STARTED).toBeDefined();
    expect(actions.getNotificationList.SUCCEEDED).toBeDefined();
    expect(actions.getNotificationList.FAILED).toBeDefined();
    
    expect(actions.getPostNotificationList.STARTED).toBeDefined();
    expect(actions.getPostNotificationList.SUCCEEDED).toBeDefined();
    expect(actions.getPostNotificationList.FAILED).toBeDefined();
  });

  test('reducer: should handle initial state', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    expect(initialState).toBeDefined();
    
    // Check that expected reducers exist
    expect(initialState.list).toBeDefined();
    expect(initialState.list.loading).toBe(true);
    expect(initialState.list.data).toBeNull();
    expect(initialState.list.error).toBeNull();
    
    expect(initialState.loader).toBeDefined();
  });

  test('reducer: should handle GET_NOTIFICATION_LIST_STARTED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'GET_NOTIFICATION_LIST_STARTED' };
    const newState = reducer(initialState, action);
    
    expect(newState.list.loading).toBe(true);
    expect(newState.list.error).toBeNull();
  });

  test('reducer: should handle GET_NOTIFICATION_LIST_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'GET_NOTIFICATION_LIST_SUCCEEDED', payload: [{ id: 1, message: 'test' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.list.loading).toBe(false);
    expect(newState.list.data).toEqual([{ id: 1, message: 'test' }]);
    expect(newState.list.error).toBeNull();
  });

  test('reducer: should handle GET_NOTIFICATION_LIST_FAILED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'GET_NOTIFICATION_LIST_FAILED', payload: 'error message' };
    const newState = reducer(initialState, action);
    
    expect(newState.list.loading).toBe(false);
    expect(newState.list.error).toBe('error message');
  });

  test('network: should have getNotifications and getPostNotifications functions', () => {
    expect(network.getNotifications).toBeDefined();
    expect(typeof network.getNotifications).toBe('function');
    expect(network.getPostNotifications).toBeDefined();
    expect(typeof network.getPostNotifications).toBe('function');
  });

  test('network: should handle getNotifications with parameters', async () => {
    const { requestPortal } = require('../../../../src/utils/network');
    
    requestPortal.mockResolvedValue({ data: 'test-response' });
    
    const result = await network.getNotifications({
      searchText: 'test',
      users: 'user1',
      selectedDateRanges: { startDate: '2024-01-01', endDate: '2024-01-31' },
      selectedOption: { users: 'user1', Priority: 'HIGH' },
      page: 0,
      limit: 12
    });
    
    expect(requestPortal).toHaveBeenCalledWith(
      'dbservice/notification/get/sentnotification?searchString=test&userTo=user1&createdDateStart2024-01-01=&createdDateEnd=2024-01-31&notificationCategories=HIGH&page=0&limit=12',
      { method: 'GET' }
    );
    expect(result).toEqual({ data: 'test-response' });
  });

  test('network: should handle getPostNotifications with data', async () => {
    const { requestPortal } = require('../../../../src/utils/network');
    
    requestPortal.mockResolvedValue({ data: 'test-response' });
    
    const notificationData = { message: 'test notification', priority: 'HIGH' };
    const result = await network.getPostNotifications(notificationData);
    
    expect(requestPortal).toHaveBeenCalledWith(
      'communication/push-notifications/admin/send',
      { 
        method: 'POST',
        body: JSON.stringify(notificationData)
      }
    );
    expect(result).toEqual({ data: 'test-response' });
  });

  test('network: should handle getNotifications with empty parameters', async () => {
    const { requestPortal } = require('../../../../src/utils/network');
    
    requestPortal.mockResolvedValue({ data: 'test-response' });
    
    const result = await network.getNotifications({});
    
    expect(requestPortal).toHaveBeenCalledWith(
      'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
      { method: 'GET' }
    );
    expect(result).toEqual({ data: 'test-response' });
  });
}); 