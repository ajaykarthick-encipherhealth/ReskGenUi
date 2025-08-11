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
jest.mock('../../../../src/stores/admin/users/network', () => ({
  getAllOrganization: jest.fn(),
  getallUsers: jest.fn(),
  AddUser: jest.fn(),
  enableUser: jest.fn(),
  patientDetails: jest.fn()
}));

// Now import the actual modules
const actions = require('../../../../src/stores/admin/users/actions');
const reducer = require('../../../../src/stores/admin/users/reducer').default;
const network = require('../../../../src/stores/admin/users/network');

describe('admin/users store', () => {
  test('actions: should be properly exported', () => {
    expect(actions.getAllOrganizationAction).toBeDefined();
    expect(actions.getAllUsersAction).toBeDefined();
    expect(actions.getAddUser).toBeDefined();
    expect(actions.getEnableUser).toBeDefined();
    expect(actions.selectedRoWDetails).toBeDefined();
    expect(actions.getPatientsList).toBeDefined();
  });

  test('actions: should have correct structure for thunk actions', () => {
    expect(actions.getAllOrganizationAction.STARTED).toBe('GET_ALL_ORGANIZATION_STARTED');
    expect(actions.getAllOrganizationAction.SUCCEEDED).toBe('GET_ALL_ORGANIZATION_SUCCEEDED');
    expect(actions.getAllOrganizationAction.FAILED).toBe('GET_ALL_ORGANIZATION_FAILED');
    
    expect(actions.getAllUsersAction.STARTED).toBe('GET_ALL_USERS_STARTED');
    expect(actions.getAllUsersAction.SUCCEEDED).toBe('GET_ALL_USERS_SUCCEEDED');
    expect(actions.getAllUsersAction.FAILED).toBe('GET_ALL_USERS_FAILED');
    
    expect(actions.getAddUser.STARTED).toBe('ADD_USER_STARTED');
    expect(actions.getAddUser.SUCCEEDED).toBe('ADD_USER_SUCCEEDED');
    expect(actions.getAddUser.FAILED).toBe('ADD_USER_FAILED');
    
    expect(actions.getEnableUser.STARTED).toBe('ENABLE_USER_STARTED');
    expect(actions.getEnableUser.SUCCEEDED).toBe('ENABLE_USER_SUCCEEDED');
    expect(actions.getEnableUser.FAILED).toBe('ENABLE_USER_FAILED');
    
    expect(actions.getPatientsList.STARTED).toBe('GET-PATIENTS-DETAILS_STARTED');
    expect(actions.getPatientsList.SUCCEEDED).toBe('GET-PATIENTS-DETAILS_SUCCEEDED');
    expect(actions.getPatientsList.FAILED).toBe('GET-PATIENTS-DETAILS_FAILED');
  });

  test('actions: should have correct structure for simple actions', () => {
    expect(actions.selectedRoWDetails).toBe('SELECTED_ROW_DETAILS');
  });

  test('reducer: should handle initial state', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    expect(initialState).toBeDefined();
    
    // Check that expected reducers exist
    expect(initialState.allOrganization).toBeDefined();
    expect(initialState.allUsers).toBeDefined();
    expect(initialState.allOrganizationLoader).toBeDefined();
    expect(initialState.allUsersLoading).toBeDefined();
    expect(initialState.selectedRoWDetails).toBeDefined();
    
    // Check initial state structure
    expect(initialState.allOrganization.loading).toBe(true);
    expect(initialState.allOrganization.data).toBeNull();
    expect(initialState.allOrganization.error).toBeNull();
    
    expect(initialState.allUsers.loading).toBe(true);
    expect(initialState.allUsers.data).toBeNull();
    expect(initialState.allUsers.error).toBeNull();
    
    expect(initialState.selectedRoWDetails).toBe('');
  });

  test('reducer: should handle GET_ALL_ORGANIZATION_STARTED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'GET_ALL_ORGANIZATION_STARTED' };
    const newState = reducer(initialState, action);
    
    expect(newState.allOrganization.loading).toBe(true);
    expect(newState.allOrganization.error).toBeNull();
  });

  test('reducer: should handle GET_ALL_ORGANIZATION_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'GET_ALL_ORGANIZATION_SUCCEEDED', payload: [{ id: 1, name: 'Org 1' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.allOrganization.loading).toBe(false);
    expect(newState.allOrganization.data).toEqual([{ id: 1, name: 'Org 1' }]);
    expect(newState.allOrganization.error).toBeNull();
  });

  test('reducer: should handle GET_ALL_USERS_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'GET_ALL_USERS_SUCCEEDED', payload: [{ id: 1, name: 'User 1' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.allUsers.loading).toBe(false);
    expect(newState.allUsers.data).toEqual([{ id: 1, name: 'User 1' }]);
    expect(newState.allUsers.error).toBeNull();
  });

  test('reducer: should handle SELECTED_ROW_DETAILS action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'SELECTED_ROW_DETAILS', payload: 'selected data' };
    const newState = reducer(initialState, action);
    
    expect(newState.selectedRoWDetails).toBe('selected data');
  });

  test('network: functions should be properly exported', () => {
    expect(network.getAllOrganization).toBeDefined();
    expect(network.getallUsers).toBeDefined();
    expect(network.AddUser).toBeDefined();
    expect(network.enableUser).toBeDefined();
    expect(network.patientDetails).toBeDefined();
  });
}); 