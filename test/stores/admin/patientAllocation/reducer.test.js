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
jest.mock('../../../../src/stores/admin/patientAllocation/actions', () => ({
  getAllList: {
    STARTED: 'LIST_STARTED',
    SUCCEEDED: 'LIST_SUCCEEDED',
    FAILED: 'LIST_FAILED',
    START: 'LIST_START'
  },
  getSupervisorsList: {
    STARTED: 'L2_LIST_STARTED',
    SUCCEEDED: 'L2_LIST_SUCCEEDED',
    FAILED: 'L2_LIST_FAILED',
    START: 'L2_LIST_START'
  },
  getSelectedSupervisorList: {
    STARTED: 'SELECTED_SUPERVISOR_STARTED',
    SUCCEEDED: 'SELECTED_SUPERVISOR_SUCCEEDED',
    FAILED: 'SELECTED_SUPERVISOR_FAILED',
    START: 'SELECTED_SUPERVISOR_START'
  },
  getFiltersList: {
    STARTED: 'FILTERS_LIST_STARTED',
    SUCCEEDED: 'FILTERS_LIST_SUCCEEDED',
    FAILED: 'FILTERS_LIST_FAILED',
    START: 'FILTERS_LIST_START'
  },
  getPatientAllocatedList: {
    STARTED: 'FILTERS_LIST_PATIENT_ALLOCATED_STARTED',
    SUCCEEDED: 'FILTERS_LIST_PATIENT_ALLOCATED_SUCCEEDED',
    FAILED: 'FILTERS_LIST_PATIENT_ALLOCATED_FAILED',
    START: 'FILTERS_LIST_PATIENT_ALLOCATED_START'
  },
  getAuditAssignedList: {
    STARTED: 'FILTERS_LIST_AUDIT_ASSIGNED_STARTED',
    SUCCEEDED: 'FILTERS_LIST_AUDIT_ASSIGNED_SUCCEEDED',
    FAILED: 'FILTERS_LIST_AUDIT_ASSIGNED_FAILED',
    START: 'FILTERS_LIST_AUDIT_ASSIGNED_START'
  },
  getAllocatedByList: {
    STARTED: 'FILTERS_LIST_ALLOCATED_BY_STARTED',
    SUCCEEDED: 'FILTERS_LIST_ALLOCATED_BY_SUCCEEDED',
    FAILED: 'FILTERS_LIST_ALLOCATED_BY_FAILED',
    START: 'FILTERS_LIST_ALLOCATED_BY_START'
  },
  getAllCheckedListForReviewer: {
    STARTED: 'REVIEWER_CHECKED_LIST_STARTED',
    SUCCEEDED: 'REVIEWER_CHECKED_LIST_SUCCEEDED',
    FAILED: 'REVIEWER_CHECKED_LIST_FAILED',
    START: 'REVIEWER_CHECKED_LIST_START'
  },
  getAllCheckedListForSupervisor: {
    STARTED: 'SUPERVISOR_CHECKED_LIST_STARTED',
    SUCCEEDED: 'SUPERVISOR_CHECKED_LIST_SUCCEEDED',
    FAILED: 'SUPERVISOR_CHECKED_LIST_FAILED',
    START: 'SUPERVISOR_CHECKED_LIST_START'
  },
  getL2PatientList: {
    STARTED: 'GET_L2_PATIENT_LIST_STARTED',
    SUCCEEDED: 'GET_L2_PATIENT_LIST_SUCCEEDED',
    FAILED: 'GET_L2_PATIENT_LIST_FAILED',
    START: 'GET_L2_PATIENT_LIST_START'
  },
  getL1UsersList: {
    STARTED: 'GET_L1_USERS_LIST_STARTED',
    SUCCEEDED: 'GET_L1_USERS_LIST_SUCCEEDED',
    FAILED: 'GET_L1_USERS_LIST_FAILED',
    START: 'GET_L1_USERS_LIST_START'
  }
}));

// Now import the actual modules
const reducer = require('../../../../src/stores/admin/patientAllocation/reducer').default;

describe('admin/patientAllocation reducer', () => {
  let initialState;

  beforeEach(() => {
    jest.clearAllMocks();
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('initial state', () => {
    test('should have correct initial state structure', () => {
      expect(initialState).toBeDefined();
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
    });

    test('should have correct initial state values', () => {
      expect(initialState.allocatedList).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.loader).toBe(false);
      expect(initialState.l2AllocatedList).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.l2Loader).toBe(false);
      expect(initialState.selectedSupervisors).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.supervisorLoader).toBe(false);
      expect(initialState.filtersList).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.patientAllocatedFilters).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.auditAssignedFilters).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.allocatedByFilters).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.allCheckBoxLoaderData).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.allCheckBoxLoader).toBe(false);
      expect(initialState.allSupervisorCheckBoxLoaderData).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.allSupervisorCheckBoxLoader).toBe(false);
      expect(initialState.getL2PatientList).toEqual({
        loading: true,
        data: null,
        error: null
      });
      expect(initialState.getUsersLoading).toBe(false);
    });
  });

  describe('allocatedList reducer', () => {
    test('should handle LIST_STARTED action correctly', () => {
      const action = { type: 'LIST_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(true);
      expect(newState.allocatedList.error).toBeNull();
      expect(newState.allocatedList.data).toBeNull();
    });

    test('should handle LIST_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Patient 1' }];
      const action = { type: 'LIST_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(false);
      expect(newState.allocatedList.data).toEqual(mockData);
      expect(newState.allocatedList.error).toBeNull();
    });

    test('should handle LIST_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch list';
      const action = { type: 'LIST_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(false);
      expect(newState.allocatedList.error).toBe(errorMessage);
      expect(newState.allocatedList.data).toBeNull();
    });

    test('should preserve existing data when handling STARTED action', () => {
      const currentState = {
        ...initialState,
        allocatedList: { loading: false, data: ['existing'], error: 'old error' }
      };

      const action = { type: 'LIST_STARTED' };
      const newState = reducer(currentState, action);

      expect(newState.allocatedList.loading).toBe(true);
      expect(newState.allocatedList.error).toBeNull();
      expect(newState.allocatedList.data).toEqual(['existing']);
    });
  });

  describe('l2AllocatedList reducer', () => {
    test('should handle L2_LIST_STARTED action correctly', () => {
      const action = { type: 'L2_LIST_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.l2AllocatedList.loading).toBe(true);
      expect(newState.l2AllocatedList.error).toBeNull();
      expect(newState.l2AllocatedList.data).toBeNull();
    });

    test('should handle L2_LIST_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'L2 Patient 1' }];
      const action = { type: 'L2_LIST_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.l2AllocatedList.loading).toBe(false);
      expect(newState.l2AllocatedList.data).toEqual(mockData);
      expect(newState.l2AllocatedList.error).toBeNull();
    });

    test('should handle L2_LIST_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch L2 list';
      const action = { type: 'L2_LIST_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.l2AllocatedList.loading).toBe(false);
      expect(newState.l2AllocatedList.error).toBe(errorMessage);
      expect(newState.l2AllocatedList.data).toBeNull();
    });
  });

  describe('selectedSupervisors reducer', () => {
    test('should handle SELECTED_SUPERVISOR_STARTED action correctly', () => {
      const action = { type: 'SELECTED_SUPERVISOR_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.selectedSupervisors.loading).toBe(true);
      expect(newState.selectedSupervisors.error).toBeNull();
      expect(newState.selectedSupervisors.data).toBeNull();
    });

    test('should handle SELECTED_SUPERVISOR_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Supervisor 1' }];
      const action = { type: 'SELECTED_SUPERVISOR_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.selectedSupervisors.loading).toBe(false);
      expect(newState.selectedSupervisors.data).toEqual(mockData);
      expect(newState.selectedSupervisors.error).toBeNull();
    });

    test('should handle SELECTED_SUPERVISOR_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch supervisors';
      const action = { type: 'SELECTED_SUPERVISOR_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.selectedSupervisors.loading).toBe(false);
      expect(newState.selectedSupervisors.error).toBe(errorMessage);
      expect(newState.selectedSupervisors.data).toBeNull();
    });
  });

  describe('filtersList reducer', () => {
    test('should handle FILTERS_LIST_STARTED action correctly', () => {
      const action = { type: 'FILTERS_LIST_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.filtersList.loading).toBe(true);
      expect(newState.filtersList.error).toBeNull();
      expect(newState.filtersList.data).toBeNull();
    });

    test('should handle FILTERS_LIST_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Filter 1' }];
      const action = { type: 'FILTERS_LIST_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.filtersList.loading).toBe(false);
      expect(newState.filtersList.data).toEqual(mockData);
      expect(newState.filtersList.error).toBeNull();
    });

    test('should handle FILTERS_LIST_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch filters';
      const action = { type: 'FILTERS_LIST_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.filtersList.loading).toBe(false);
      expect(newState.filtersList.error).toBe(errorMessage);
      expect(newState.filtersList.data).toBeNull();
    });
  });

  describe('patientAllocatedFilters reducer', () => {
    test('should handle FILTERS_LIST_PATIENT_ALLOCATED_STARTED action correctly', () => {
      const action = { type: 'FILTERS_LIST_PATIENT_ALLOCATED_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.patientAllocatedFilters.loading).toBe(true);
      expect(newState.patientAllocatedFilters.error).toBeNull();
      expect(newState.patientAllocatedFilters.data).toBeNull();
    });

    test('should handle FILTERS_LIST_PATIENT_ALLOCATED_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Patient Allocated Filter 1' }];
      const action = { type: 'FILTERS_LIST_PATIENT_ALLOCATED_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.patientAllocatedFilters.loading).toBe(false);
      expect(newState.patientAllocatedFilters.data).toEqual(mockData);
      expect(newState.patientAllocatedFilters.error).toBeNull();
    });

    test('should handle FILTERS_LIST_PATIENT_ALLOCATED_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch patient allocated filters';
      const action = { type: 'FILTERS_LIST_PATIENT_ALLOCATED_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.patientAllocatedFilters.loading).toBe(false);
      expect(newState.patientAllocatedFilters.error).toBe(errorMessage);
      expect(newState.patientAllocatedFilters.data).toBeNull();
    });
  });

  describe('auditAssignedFilters reducer', () => {
    test('should handle FILTERS_LIST_AUDIT_ASSIGNED_STARTED action correctly', () => {
      const action = { type: 'FILTERS_LIST_AUDIT_ASSIGNED_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.auditAssignedFilters.loading).toBe(true);
      expect(newState.auditAssignedFilters.error).toBeNull();
      expect(newState.auditAssignedFilters.data).toBeNull();
    });

    test('should handle FILTERS_LIST_AUDIT_ASSIGNED_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Audit Assigned Filter 1' }];
      const action = { type: 'FILTERS_LIST_AUDIT_ASSIGNED_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.auditAssignedFilters.loading).toBe(false);
      expect(newState.auditAssignedFilters.data).toEqual(mockData);
      expect(newState.auditAssignedFilters.error).toBeNull();
    });

    test('should handle FILTERS_LIST_AUDIT_ASSIGNED_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch audit assigned filters';
      const action = { type: 'FILTERS_LIST_AUDIT_ASSIGNED_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.auditAssignedFilters.loading).toBe(false);
      expect(newState.auditAssignedFilters.error).toBe(errorMessage);
      expect(newState.auditAssignedFilters.data).toBeNull();
    });
  });

  describe('allocatedByFilters reducer', () => {
    test('should handle FILTERS_LIST_ALLOCATED_BY_STARTED action correctly', () => {
      const action = { type: 'FILTERS_LIST_ALLOCATED_BY_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.allocatedByFilters.loading).toBe(true);
      expect(newState.allocatedByFilters.error).toBeNull();
      expect(newState.allocatedByFilters.data).toBeNull();
    });

    test('should handle FILTERS_LIST_ALLOCATED_BY_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Allocated By Filter 1' }];
      const action = { type: 'FILTERS_LIST_ALLOCATED_BY_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.allocatedByFilters.loading).toBe(false);
      expect(newState.allocatedByFilters.data).toEqual(mockData);
      expect(newState.allocatedByFilters.error).toBeNull();
    });

    test('should handle FILTERS_LIST_ALLOCATED_BY_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch allocated by filters';
      const action = { type: 'FILTERS_LIST_ALLOCATED_BY_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.allocatedByFilters.loading).toBe(false);
      expect(newState.allocatedByFilters.error).toBe(errorMessage);
      expect(newState.allocatedByFilters.data).toBeNull();
    });
  });

  describe('allCheckBoxLoaderData reducer', () => {
    test('should handle REVIEWER_CHECKED_LIST_STARTED action correctly', () => {
      const action = { type: 'REVIEWER_CHECKED_LIST_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.allCheckBoxLoaderData.loading).toBe(true);
      expect(newState.allCheckBoxLoaderData.error).toBeNull();
      expect(newState.allCheckBoxLoaderData.data).toBeNull();
    });

    test('should handle REVIEWER_CHECKED_LIST_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Reviewer Checked Item 1' }];
      const action = { type: 'REVIEWER_CHECKED_LIST_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.allCheckBoxLoaderData.loading).toBe(false);
      expect(newState.allCheckBoxLoaderData.data).toEqual(mockData);
      expect(newState.allCheckBoxLoaderData.error).toBeNull();
    });

    test('should handle REVIEWER_CHECKED_LIST_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch reviewer checked list';
      const action = { type: 'REVIEWER_CHECKED_LIST_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.allCheckBoxLoaderData.loading).toBe(false);
      expect(newState.allCheckBoxLoaderData.error).toBe(errorMessage);
      expect(newState.allCheckBoxLoaderData.data).toBeNull();
    });
  });

  describe('allSupervisorCheckBoxLoaderData reducer', () => {
    test('should handle SUPERVISOR_CHECKED_LIST_STARTED action correctly', () => {
      const action = { type: 'SUPERVISOR_CHECKED_LIST_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.allSupervisorCheckBoxLoaderData.loading).toBe(true);
      expect(newState.allSupervisorCheckBoxLoaderData.error).toBeNull();
      expect(newState.allSupervisorCheckBoxLoaderData.data).toBeNull();
    });

    test('should handle SUPERVISOR_CHECKED_LIST_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'Supervisor Checked Item 1' }];
      const action = { type: 'SUPERVISOR_CHECKED_LIST_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.allSupervisorCheckBoxLoaderData.loading).toBe(false);
      expect(newState.allSupervisorCheckBoxLoaderData.data).toEqual(mockData);
      expect(newState.allSupervisorCheckBoxLoaderData.error).toBeNull();
    });

    test('should handle SUPERVISOR_CHECKED_LIST_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch supervisor checked list';
      const action = { type: 'SUPERVISOR_CHECKED_LIST_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.allSupervisorCheckBoxLoaderData.loading).toBe(false);
      expect(newState.allSupervisorCheckBoxLoaderData.error).toBe(errorMessage);
      expect(newState.allSupervisorCheckBoxLoaderData.data).toBeNull();
    });
  });

  describe('getL2PatientList reducer', () => {
    test('should handle GET_L2_PATIENT_LIST_STARTED action correctly', () => {
      const action = { type: 'GET_L2_PATIENT_LIST_STARTED' };
      const newState = reducer(initialState, action);

      expect(newState.getL2PatientList.loading).toBe(true);
      expect(newState.getL2PatientList.error).toBeNull();
      expect(newState.getL2PatientList.data).toBeNull();
    });

    test('should handle GET_L2_PATIENT_LIST_SUCCEEDED action correctly', () => {
      const mockData = [{ id: 1, name: 'L2 Patient 1' }];
      const action = { type: 'GET_L2_PATIENT_LIST_SUCCEEDED', payload: mockData };
      const newState = reducer(initialState, action);

      expect(newState.getL2PatientList.loading).toBe(false);
      expect(newState.getL2PatientList.data).toEqual(mockData);
      expect(newState.getL2PatientList.error).toBeNull();
    });

    test('should handle GET_L2_PATIENT_LIST_FAILED action correctly', () => {
      const errorMessage = 'Failed to fetch L2 patient list';
      const action = { type: 'GET_L2_PATIENT_LIST_FAILED', payload: errorMessage };
      const newState = reducer(initialState, action);

      expect(newState.getL2PatientList.loading).toBe(false);
      expect(newState.getL2PatientList.error).toBe(errorMessage);
      expect(newState.getL2PatientList.data).toBeNull();
    });
  });

  describe('loader reducers', () => {
    test('should handle LIST_START action correctly', () => {
      const action = { type: 'LIST_START' };
      const newState = reducer(initialState, action);

      expect(newState.loader).toBe(true);
    });

    test('should handle LIST_SUCCEEDED action correctly', () => {
      const action = { type: 'LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.loader).toBe(false);
    });

    test('should handle LIST_FAILED action correctly', () => {
      const action = { type: 'LIST_FAILED' };
      const newState = reducer(initialState, action);

      expect(newState.loader).toBe(false);
    });

    test('should handle L2_LIST_START action correctly', () => {
      const action = { type: 'L2_LIST_START' };
      const newState = reducer(initialState, action);

      expect(newState.l2Loader).toBe(true);
    });

    test('should handle L2_LIST_SUCCEEDED action correctly', () => {
      const action = { type: 'L2_LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.l2Loader).toBe(false);
    });

    test('should handle L2_LIST_FAILED action correctly', () => {
      const action = { type: 'L2_LIST_FAILED' };
      const newState = reducer(initialState, action);

      expect(newState.l2Loader).toBe(false);
    });

    test('should handle SELECTED_SUPERVISOR_START action correctly', () => {
      const action = { type: 'SELECTED_SUPERVISOR_START' };
      const newState = reducer(initialState, action);

      expect(newState.supervisorLoader).toBe(true);
    });

    test('should handle SELECTED_SUPERVISOR_SUCCEEDED action correctly', () => {
      const action = { type: 'SELECTED_SUPERVISOR_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.supervisorLoader).toBe(false);
    });

    test('should handle SELECTED_SUPERVISOR_FAILED action correctly', () => {
      const action = { type: 'SELECTED_SUPERVISOR_FAILED' };
      const newState = reducer(initialState, action);

      expect(newState.supervisorLoader).toBe(false);
    });

    test('should handle REVIEWER_CHECKED_LIST_START action correctly', () => {
      const action = { type: 'REVIEWER_CHECKED_LIST_START' };
      const newState = reducer(initialState, action);

      expect(newState.allCheckBoxLoader).toBe(true);
    });

    test('should handle REVIEWER_CHECKED_LIST_SUCCEEDED action correctly', () => {
      const action = { type: 'REVIEWER_CHECKED_LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.allCheckBoxLoader).toBe(false);
    });

    test('should handle REVIEWER_CHECKED_LIST_FAILED action correctly', () => {
      const action = { type: 'REVIEWER_CHECKED_LIST_FAILED' };
      const newState = reducer(initialState, action);

      expect(newState.allCheckBoxLoader).toBe(false);
    });

    test('should handle SUPERVISOR_CHECKED_LIST_START action correctly', () => {
      const action = { type: 'SUPERVISOR_CHECKED_LIST_START' };
      const newState = reducer(initialState, action);

      expect(newState.allSupervisorCheckBoxLoader).toBe(true);
    });

    test('should handle SUPERVISOR_CHECKED_LIST_SUCCEEDED action correctly', () => {
      const action = { type: 'SUPERVISOR_CHECKED_LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.allSupervisorCheckBoxLoader).toBe(false);
    });

    test('should handle SUPERVISOR_CHECKED_LIST_FAILED action correctly', () => {
      const action = { type: 'SUPERVISOR_CHECKED_LIST_FAILED' };
      const newState = reducer(initialState, action);

      expect(newState.allSupervisorCheckBoxLoader).toBe(false);
    });

    test('should handle GET_L2_PATIENT_LIST_START action correctly', () => {
      const action = { type: 'GET_L2_PATIENT_LIST_START' };
      const newState = reducer(initialState, action);

      expect(newState.getL2PatientList.loading).toBe(true);
    });

    test('should handle GET_L2_PATIENT_LIST_SUCCEEDED action correctly', () => {
      const action = { type: 'GET_L2_PATIENT_LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.getL2PatientList.loading).toBe(false);
    });

    test('should handle GET_L2_PATIENT_LIST_FAILED action correctly', () => {
      const action = { type: 'GET_L2_PATIENT_LIST_FAILED' };
      const newState = reducer(initialState, action);

      expect(newState.getL2PatientList.loading).toBe(false);
    });

    test('should handle GET_L1_USERS_LIST_START action correctly', () => {
      const action = { type: 'GET_L1_USERS_LIST_START' };
      const newState = reducer(initialState, action);

      expect(newState.getUsersLoading).toBe(true);
    });

    test('should handle GET_L1_USERS_LIST_SUCCEEDED action correctly', () => {
      const action = { type: 'GET_L1_USERS_LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.getUsersLoading).toBe(false);
    });

    test('should handle GET_L1_USERS_LIST_FAILED action correctly', () => {
      const action = { type: 'GET_L1_USERS_LIST_FAILED' };
      const newState = reducer(initialState, action);

      expect(newState.getUsersLoading).toBe(false);
    });
  });

  describe('unknown actions', () => {
    test('should return current state for unknown action types', () => {
      const currentState = {
        allocatedList: { loading: false, data: ['test'], error: null },
        loader: false
      };

      const action = { type: 'UNKNOWN_ACTION' };
      const newState = reducer(currentState, action);

      // Only check the specific properties we're testing, not the entire state
      expect(newState.allocatedList).toEqual(currentState.allocatedList);
      expect(newState.loader).toBe(currentState.loader);
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
        allocatedList: { loading: false, data: ['test'], error: null },
        loader: false
      };
      const originalState = JSON.parse(JSON.stringify(currentState));

      const action = { type: 'LIST_STARTED' };
      reducer(currentState, action);

      expect(currentState).toEqual(originalState);
    });

    test('should not mutate nested objects in state', () => {
      const currentState = {
        allocatedList: { loading: false, data: ['test'], error: null },
        loader: false
      };
      const originalList = { ...currentState.allocatedList };

      const action = { type: 'LIST_STARTED' };
      reducer(currentState, action);

      expect(currentState.allocatedList).toEqual(originalList);
    });
  });

  describe('edge cases', () => {
    test('should handle action with undefined payload', () => {
      const action = { type: 'LIST_SUCCEEDED' };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(false);
      expect(newState.allocatedList.data).toBeUndefined();
      expect(newState.allocatedList.error).toBeNull();
    });

    test('should handle action with null payload', () => {
      const action = { type: 'LIST_SUCCEEDED', payload: null };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(false);
      expect(newState.allocatedList.data).toBeNull();
      expect(newState.allocatedList.error).toBeNull();
    });

    test('should handle action with empty string payload', () => {
      const action = { type: 'LIST_SUCCEEDED', payload: '' };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(false);
      expect(newState.allocatedList.data).toBe('');
      expect(newState.allocatedList.error).toBeNull();
    });

    test('should handle action with zero payload', () => {
      const action = { type: 'LIST_SUCCEEDED', payload: 0 };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(false);
      expect(newState.allocatedList.data).toBe(0);
      expect(newState.allocatedList.error).toBeNull();
    });

    test('should handle action with false payload', () => {
      const action = { type: 'LIST_SUCCEEDED', payload: false };
      const newState = reducer(initialState, action);

      expect(newState.allocatedList.loading).toBe(false);
      expect(newState.allocatedList.data).toBe(false);
      expect(newState.allocatedList.error).toBeNull();
    });
  });

  describe('reducer behavior validation', () => {
    test('should handle multiple actions in sequence correctly', () => {
      let state = reducer(undefined, { type: '@@INIT' });

      // Start action
      state = reducer(state, { type: 'LIST_STARTED' });
      expect(state.allocatedList.loading).toBe(true);
      expect(state.allocatedList.error).toBeNull();

      // Success action
      state = reducer(state, { type: 'LIST_SUCCEEDED', payload: ['data1'] });
      expect(state.allocatedList.loading).toBe(false);
      expect(state.allocatedList.data).toEqual(['data1']);
      expect(state.allocatedList.error).toBeNull();

      // Start action again (should preserve data)
      state = reducer(state, { type: 'LIST_STARTED' });
      expect(state.allocatedList.loading).toBe(true);
      expect(state.allocatedList.error).toBeNull();
      expect(state.allocatedList.data).toEqual(['data1']);

      // Fail action (should preserve data)
      state = reducer(state, { type: 'LIST_FAILED', payload: 'error' });
      expect(state.allocatedList.loading).toBe(false);
      expect(state.allocatedList.error).toBe('error');
      expect(state.allocatedList.data).toEqual(['data1']);
    });

    test('should handle loader state changes independently', () => {
      let state = reducer(undefined, { type: '@@INIT' });

      // Start loader
      state = reducer(state, { type: 'LIST_START' });
      expect(state.loader).toBe(true);

      // Success should stop loader
      state = reducer(state, { type: 'LIST_SUCCEEDED', payload: ['data'] });
      expect(state.loader).toBe(false);

      // Start loader again
      state = reducer(state, { type: 'LIST_START' });
      expect(state.loader).toBe(true);

      // Fail should stop loader
      state = reducer(state, { type: 'LIST_FAILED', payload: 'error' });
      expect(state.loader).toBe(false);
    });

    test('should handle multiple reducers independently', () => {
      let state = reducer(undefined, { type: '@@INIT' });

      // Start multiple actions
      state = reducer(state, { type: 'LIST_STARTED' });
      state = reducer(state, { type: 'L2_LIST_STARTED' });
      state = reducer(state, { type: 'FILTERS_LIST_STARTED' });

      expect(state.allocatedList.loading).toBe(true);
      expect(state.l2AllocatedList.loading).toBe(true);
      expect(state.filtersList.loading).toBe(true);

      // Complete one action
      state = reducer(state, { type: 'LIST_SUCCEEDED', payload: ['data'] });
      expect(state.allocatedList.loading).toBe(false);
      expect(state.allocatedList.data).toEqual(['data']);
      expect(state.l2AllocatedList.loading).toBe(true);
      expect(state.filtersList.loading).toBe(true);
    });
  });
}); 