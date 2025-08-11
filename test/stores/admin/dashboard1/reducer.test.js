import { jest } from '@jest/globals';
import reducer from '../../../../src/stores/admin/dashboard1/reducer';
import actions from '../../../../src/stores/admin/dashboard1/actions';

describe('Dashboard1 Reducer', () => {
  let initialState;

  beforeEach(() => {
    // Get the initial state by calling reducer with undefined state and empty action
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('Data Reducer Behavior', () => {
    it('should handle START action correctly', () => {
      const action = { type: actions.defaultTop10CodesAction.START };
      const newState = reducer(initialState, action);

      expect(newState.defaultTop10Codes).toEqual({
        loading: true,
        data: null,
        error: null,
      });
    });

    it('should handle SUCCEEDED action correctly', () => {
      const payload = { codes: ['code1', 'code2', 'code3'] };
      const action = { 
        type: actions.defaultTop10CodesAction.SUCCEEDED, 
        payload 
      };
      const newState = reducer(initialState, action);

      expect(newState.defaultTop10Codes).toEqual({
        loading: false,
        data: payload,
        error: null,
      });
    });

    it('should handle FAILED action correctly', () => {
      const error = 'API request failed';
      const action = { 
        type: actions.defaultTop10CodesAction.FAILED, 
        payload: error 
      };
      const newState = reducer(initialState, action);

      expect(newState.defaultTop10Codes).toEqual({
        loading: false,
        data: null,
        error: error,
      });
    });

    it('should preserve other state properties during updates', () => {
      // First, set some data
      const payload = { codes: ['code1', 'code2'] };
      const succeedAction = { 
        type: actions.defaultTop10CodesAction.SUCCEEDED, 
        payload 
      };
      let newState = reducer(initialState, succeedAction);

      // Then update with new data
      const newPayload = { codes: ['code3', 'code4'] };
      const updateAction = { 
        type: actions.defaultTop10CodesAction.SUCCEEDED, 
        payload: newPayload 
      };
      newState = reducer(newState, updateAction);

      // Check that the updated reducer changed
      expect(newState.defaultTop10Codes.data).toEqual(newPayload);
      expect(newState.defaultTop10Codes.loading).toBe(false);

      // Check that other reducers remain unchanged
      expect(newState.defaultTop10OIG).toEqual(initialState.defaultTop10OIG);
    });
  });

  describe('Loader Reducer Behavior', () => {
    it('should handle START action correctly for loader', () => {
      const action = { type: actions.defaultTop10CodesAction.START };
      const newState = reducer(initialState, action);

      expect(newState.defaultTop10CodesLoader).toBe(true);
    });

    it('should handle SUCCEEDED action correctly for loader', () => {
      const action = { type: actions.defaultTop10CodesAction.SUCCEEDED };
      const newState = reducer(initialState, action);

      expect(newState.defaultTop10CodesLoader).toBe(false);
    });

    it('should handle FAILED action correctly for loader', () => {
      const action = { type: actions.defaultTop10CodesAction.FAILED };
      const newState = reducer(initialState, action);

      expect(newState.defaultTop10CodesLoader).toBe(false);
    });
  });

  describe('Unknown Action Types', () => {
    it('should return unchanged state for unknown action types', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION_TYPE' };
      const newState = reducer(initialState, unknownAction);

      expect(newState).toEqual(initialState);
    });
  });
}); 