import { jest } from '@jest/globals';

// Mock the redux module
jest.mock('redux', () => ({
  combineReducers: jest.fn((reducers) => {
    return (state = {}, action) => {
      const newState = {};
      Object.keys(reducers).forEach(key => {
        newState[key] = reducers[key](state[key], action);
      });
      return newState;
    };
  })
}));

// Mock the redux-actions module
jest.mock('redux-actions', () => ({
  handleActions: jest.fn((handlers, initialState) => {
    return (state = initialState, action) => {
      if (handlers[action.type]) {
        return handlers[action.type](state, action);
      }
      return state;
    };
  })
}));

// Mock the actions module
jest.mock('../../../../src/stores/admin/notifications/actions', () => ({
  getNotificationList: {
    STARTED: 'GET_NOTIFICATION_LIST_STARTED',
    SUCCEEDED: 'GET_NOTIFICATION_LIST_SUCCEEDED',
    FAILED: 'GET_NOTIFICATION_LIST_FAILED',
    START: 'GET_NOTIFICATION_LIST_START'
  }
}));

// Now import the actual modules
const reducer = require('../../../../src/stores/admin/notifications/reducer').default;
const actions = require('../../../../src/stores/admin/notifications/actions');

describe('admin/notifications reducer', () => {
  let initialState;

  beforeEach(() => {
    jest.clearAllMocks();
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('initial state', () => {
    test('should have correct initial state structure', () => {
      expect(initialState).toBeDefined();
      expect(initialState.list).toBeDefined();
      expect(initialState.loader).toBeDefined();
    });

    test('should have correct initial list state', () => {
      expect(initialState.list).toEqual({
        loading: true,
        data: null,
        error: null
      });
    });

    test('should have correct initial loader state', () => {
      expect(initialState.loader).toBe(false);
    });
  });

  describe('list reducer - STARTED action', () => {
    test('should handle GET_NOTIFICATION_LIST_STARTED action correctly', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_STARTED' };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(true);
      expect(newState.list.error).toBeNull();
      expect(newState.list.data).toBeNull();
    });

    test('should preserve existing data when handling STARTED action', () => {
      const currentState = {
        list: { loading: false, data: ['existing'], error: 'old error' },
        loader: false
      };
      
      const action = { type: 'GET_NOTIFICATION_LIST_STARTED' };
      const newState = reducer(currentState, action);
      
      expect(newState.list.loading).toBe(true);
      expect(newState.list.error).toBeNull();
      expect(newState.list.data).toEqual(['existing']); // Data should be preserved
      expect(newState.loader).toBe(false); // Loader should remain unchanged
    });

    test('should handle STARTED action with additional payload gracefully', () => {
      const action = { 
        type: 'GET_NOTIFICATION_LIST_STARTED', 
        payload: { extra: 'data' } 
      };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(true);
      expect(newState.list.error).toBeNull();
    });
  });

  describe('list reducer - SUCCEEDED action', () => {
    test('should handle GET_NOTIFICATION_LIST_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, message: 'test notification' }];
      const action = { 
        type: 'GET_NOTIFICATION_LIST_SUCCEEDED', 
        payload: mockData 
      };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toEqual(mockData);
      expect(newState.list.error).toBeNull();
    });

    test('should handle SUCCEEDED action with empty payload', () => {
      const action = { 
        type: 'GET_NOTIFICATION_LIST_SUCCEEDED', 
        payload: [] 
      };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toEqual([]);
      expect(newState.list.error).toBeNull();
    });

    test('should handle SUCCEEDED action with null payload', () => {
      const action = { 
        type: 'GET_NOTIFICATION_LIST_SUCCEEDED', 
        payload: null 
      };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toBeNull();
      expect(newState.list.error).toBeNull();
    });

    test('should preserve other state properties when handling SUCCEEDED action', () => {
      const currentState = {
        list: { loading: true, data: null, error: 'old error' },
        loader: true
      };
      
      const action = { 
        type: 'GET_NOTIFICATION_LIST_SUCCEEDED', 
        payload: ['new data'] 
      };
      const newState = reducer(currentState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toEqual(['new data']);
      expect(newState.list.error).toBeNull();
      expect(newState.loader).toBe(false); // Loader should change to false on SUCCEEDED
    });
  });

  describe('list reducer - FAILED action', () => {
    test('should handle GET_NOTIFICATION_LIST_FAILED action correctly', () => {
      const errorMessage = 'Network error occurred';
      const action = { 
        type: 'GET_NOTIFICATION_LIST_FAILED', 
        payload: errorMessage 
      };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.error).toBe(errorMessage);
      expect(newState.list.data).toBeNull();
    });

    test('should handle FAILED action with error object', () => {
      const errorObj = { message: 'Error message', code: 500 };
      const action = { 
        type: 'GET_NOTIFICATION_LIST_FAILED', 
        payload: errorObj 
      };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.error).toEqual(errorObj);
      expect(newState.list.data).toBeNull();
    });

    test('should handle FAILED action with null error', () => {
      const action = { 
        type: 'GET_NOTIFICATION_LIST_FAILED', 
        payload: null 
      };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.error).toBeNull();
      expect(newState.list.data).toBeNull();
    });

    test('should preserve existing data when handling FAILED action', () => {
      const currentState = {
        list: { loading: true, data: ['existing'], error: null },
        loader: true
      };
      
      const action = { 
        type: 'GET_NOTIFICATION_LIST_FAILED', 
        payload: 'new error' 
      };
      const newState = reducer(currentState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.error).toBe('new error');
      expect(newState.list.data).toEqual(['existing']); // Data should be preserved
      expect(newState.loader).toBe(false); // Loader should change to false on FAILED
    });
  });

  describe('loader reducer', () => {
    test('should handle GET_NOTIFICATION_LIST_START action correctly', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_START' };
      const newState = reducer(initialState, action);
      
      expect(newState.loader).toBe(true);
    });

    test('should handle GET_NOTIFICATION_LIST_SUCCEEDED action correctly', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);
      
      expect(newState.loader).toBe(false);
    });

    test('should handle GET_NOTIFICATION_LIST_FAILED action correctly', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_FAILED' };
      const newState = reducer(initialState, action);
      
      expect(newState.loader).toBe(false);
    });

    test('should preserve list state when handling loader actions', () => {
      const currentState = {
        list: { loading: false, data: ['test'], error: null },
        loader: false
      };
      
      const action = { type: 'GET_NOTIFICATION_LIST_START' };
      const newState = reducer(currentState, action);
      
      expect(newState.loader).toBe(true);
      expect(newState.list).toEqual(currentState.list);
    });
  });

  describe('unknown actions', () => {
    test('should return current state for unknown action types', () => {
      const currentState = {
        list: { loading: false, data: ['test'], error: null },
        loader: false
      };
      
      const action = { type: 'UNKNOWN_ACTION' };
      const newState = reducer(currentState, action);
      
      expect(newState).toEqual(currentState);
    });

    test('should return initial state for unknown action when no current state', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const newState = reducer(undefined, action);
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('state immutability', () => {
    test('should not mutate the original state object', () => {
      const currentState = {
        list: { loading: false, data: ['test'], error: null },
        loader: false
      };
      const originalState = JSON.parse(JSON.stringify(currentState));
      
      const action = { type: 'GET_NOTIFICATION_LIST_STARTED' };
      reducer(currentState, action);
      
      expect(currentState).toEqual(originalState);
    });

    test('should not mutate nested objects in state', () => {
      const currentState = {
        list: { loading: false, data: ['test'], error: null },
        loader: false
      };
      const originalList = { ...currentState.list };
      
      const action = { type: 'GET_NOTIFICATION_LIST_STARTED' };
      reducer(currentState, action);
      
      expect(currentState.list).toEqual(originalList);
    });
  });

  describe('edge cases', () => {
    test('should handle action with undefined payload', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toBeUndefined();
      expect(newState.list.error).toBeNull();
    });

    test('should handle action with empty string payload', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_SUCCEEDED', payload: '' };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toBe('');
      expect(newState.list.error).toBeNull();
    });

    test('should handle action with zero payload', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_SUCCEEDED', payload: 0 };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toBe(0);
      expect(newState.list.error).toBeNull();
    });

    test('should handle action with false payload', () => {
      const action = { type: 'GET_NOTIFICATION_LIST_SUCCEEDED', payload: false };
      const newState = reducer(initialState, action);
      
      expect(newState.list.loading).toBe(false);
      expect(newState.list.data).toBe(false);
      expect(newState.list.error).toBeNull();
    });
  });

  describe('reducer behavior validation', () => {
    test('should handle multiple actions in sequence correctly', () => {
      let state = reducer(undefined, { type: '@@INIT' });
      
      // Start action
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_STARTED' });
      expect(state.list.loading).toBe(true);
      expect(state.list.error).toBeNull();
      
      // Success action
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_SUCCEEDED', payload: ['data1'] });
      expect(state.list.loading).toBe(false);
      expect(state.list.data).toEqual(['data1']);
      expect(state.list.error).toBeNull();
      
      // Start action again (should preserve data)
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_STARTED' });
      expect(state.list.loading).toBe(true);
      expect(state.list.error).toBeNull();
      expect(state.list.data).toEqual(['data1']); // Data preserved
      
      // Fail action (should preserve data)
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_FAILED', payload: 'error' });
      expect(state.list.loading).toBe(false);
      expect(state.list.error).toBe('error');
      expect(state.list.data).toEqual(['data1']); // Data preserved
    });

    test('should handle loader state changes independently', () => {
      let state = reducer(undefined, { type: '@@INIT' });
      
      // Start loader
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_START' });
      expect(state.loader).toBe(true);
      
      // Success should stop loader
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_SUCCEEDED', payload: ['data'] });
      expect(state.loader).toBe(false);
      
      // Start loader again
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_START' });
      expect(state.loader).toBe(true);
      
      // Fail should stop loader
      state = reducer(state, { type: 'GET_NOTIFICATION_LIST_FAILED', payload: 'error' });
      expect(state.loader).toBe(false);
    });
  });
}); 