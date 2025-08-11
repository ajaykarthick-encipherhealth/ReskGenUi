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

// Mock the network module
jest.mock('../../../../src/stores/admin/patientAllocation/network', () => ({
  allocatedGetList: jest.fn(),
  l2List: jest.fn(),
  selectedList: jest.fn(),
  filters: jest.fn(),
  patientAllocatedFilters: jest.fn(),
  auditAssignedFilters: jest.fn(),
  allocatedByFilters: jest.fn(),
  reviewerCheckedList: jest.fn(),
  supervisorCheckedList: jest.fn(),
  usersList: jest.fn(),
  allocateUsers: jest.fn()
}));

// Now import the actual modules
const actions = require('../../../../src/stores/admin/patientAllocation/actions');
const reducer = require('../../../../src/stores/admin/patientAllocation/reducer').default;
const network = require('../../../../src/stores/admin/patientAllocation/network');

describe('admin/patientAllocation store', () => {
  test('actions: should have correct structure for all action types', () => {
    // Check that actions are properly exported
    expect(actions.getAllList).toBeDefined();
    expect(actions.getSupervisorsList).toBeDefined();
    expect(actions.getSelectedSupervisorList).toBeDefined();
    expect(actions.getFiltersList).toBeDefined();
    expect(actions.getPatientAllocatedList).toBeDefined();
    expect(actions.getAuditAssignedList).toBeDefined();
    expect(actions.getAllocatedByList).toBeDefined();
    expect(actions.getAllCheckedListForReviewer).toBeDefined();
    expect(actions.getAllCheckedListForSupervisor).toBeDefined();
    expect(actions.getL1UsersList).toBeDefined();
    expect(actions.getAllocateUsers).toBeDefined();
    
    // Check that all actions have the expected structure
    const expectedActions = [
      'getAllList',
      'getSupervisorsList',
      'getSelectedSupervisorList',
      'getFiltersList',
      'getPatientAllocatedList',
      'getAuditAssignedList',
      'getAllocatedByList',
      'getAllCheckedListForReviewer',
      'getAllCheckedListForSupervisor',
      'getL1UsersList',
      'getAllocateUsers'
    ];

    expectedActions.forEach(actionName => {
      expect(actions[actionName].STARTED).toBeDefined();
      expect(actions[actionName].SUCCEEDED).toBeDefined();
      expect(actions[actionName].FAILED).toBeDefined();
    });
  });

  test('actions: should have correct action type constants', () => {
    expect(actions.getAllList.STARTED).toBe('LIST_STARTED');
    expect(actions.getAllList.SUCCEEDED).toBe('LIST_SUCCEEDED');
    expect(actions.getAllList.FAILED).toBe('LIST_FAILED');
    
    expect(actions.getSupervisorsList.STARTED).toBe('L2_LIST_STARTED');
    expect(actions.getSupervisorsList.SUCCEEDED).toBe('L2_LIST_SUCCEEDED');
    expect(actions.getSupervisorsList.FAILED).toBe('L2_LIST_FAILED');
    
    expect(actions.getSelectedSupervisorList.STARTED).toBe('SELECTED_SUPERVISOR_STARTED');
    expect(actions.getSelectedSupervisorList.SUCCEEDED).toBe('SELECTED_SUPERVISOR_SUCCEEDED');
    expect(actions.getSelectedSupervisorList.FAILED).toBe('SELECTED_SUPERVISOR_FAILED');
  });

  test('reducer: should handle initial state', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    expect(initialState).toBeDefined();
    
    // Check that expected reducers exist
    expect(initialState.allocatedList).toBeDefined();
    expect(initialState.loader).toBeDefined();
    expect(initialState.l2AllocatedList).toBeDefined();
    expect(initialState.l2Loader).toBeDefined();
    expect(initialState.selectedSupervisors).toBeDefined();
    expect(initialState.supervisorLoader).toBeDefined();
    expect(initialState.filtersList).toBeDefined();
    expect(initialState.patientAllocatedFilters).toBeDefined();
    expect(initialState.auditAssignedFilters).toBeDefined();
    expect(initialState.allocatedByFilters).toBeDefined();
    expect(initialState.allCheckBoxLoaderData).toBeDefined();
    expect(initialState.allCheckBoxLoader).toBeDefined();
    expect(initialState.allSupervisorCheckBoxLoaderData).toBeDefined();
    expect(initialState.allSupervisorCheckBoxLoader).toBeDefined();
    expect(initialState.getL2PatientList).toBeDefined();
    expect(initialState.getUsersLoading).toBeDefined();
    
    // Check initial state structure for a few key reducers
    expect(initialState.allocatedList.loading).toBe(true);
    expect(initialState.allocatedList.data).toBeNull();
    expect(initialState.allocatedList.error).toBeNull();
    
    expect(initialState.l2AllocatedList.loading).toBe(true);
    expect(initialState.l2AllocatedList.data).toBeNull();
    expect(initialState.l2AllocatedList.error).toBeNull();
  });

  test('reducer: should handle LIST_STARTED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'LIST_STARTED' };
    const newState = reducer(initialState, action);
    
    expect(newState.allocatedList.loading).toBe(true);
    expect(newState.allocatedList.error).toBeNull();
  });

  test('reducer: should handle LIST_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'LIST_SUCCEEDED', payload: [{ id: 1, name: 'Item 1' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.allocatedList.loading).toBe(false);
    expect(newState.allocatedList.data).toEqual([{ id: 1, name: 'Item 1' }]);
    expect(newState.allocatedList.error).toBeNull();
  });

  test('reducer: should handle L2_LIST_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'L2_LIST_SUCCEEDED', payload: [{ id: 1, name: 'L2 Item 1' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.l2AllocatedList.loading).toBe(false);
    expect(newState.l2AllocatedList.data).toEqual([{ id: 1, name: 'L2 Item 1' }]);
    expect(newState.l2AllocatedList.error).toBeNull();
  });

  test('network: should have all required functions', () => {
    expect(network.allocatedGetList).toBeDefined();
    expect(network.l2List).toBeDefined();
    expect(network.selectedList).toBeDefined();
    expect(network.filters).toBeDefined();
    expect(network.patientAllocatedFilters).toBeDefined();
    expect(network.auditAssignedFilters).toBeDefined();
    expect(network.allocatedByFilters).toBeDefined();
    expect(network.reviewerCheckedList).toBeDefined();
    expect(network.supervisorCheckedList).toBeDefined();
    expect(network.usersList).toBeDefined();
    expect(network.allocateUsers).toBeDefined();
  });
}); 