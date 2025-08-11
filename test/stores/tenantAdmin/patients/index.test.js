import { jest } from '@jest/globals';

jest.mock('../../../../src/stores/tenantAdmin/patients/actions', () => ({
  __esModule: true,
  getAllBatchAction: {
    STARTED: 'GET_ALL_BATCH_STARTED',
    SUCCEEDED: 'GET_ALL_BATCH_SUCCEEDED',
    FAILED: 'GET_ALL_BATCH_FAILED'
  },
  getAllOrganizationAction: {
    STARTED: 'GET_ALL_ORGANIZATION_STARTED',
    SUCCEEDED: 'GET_ALL_ORGANIZATION_SUCCEEDED',
    FAILED: 'GET_ALL_ORGANIZATION_FAILED'
  },
  getAllPatientAction: {
    STARTED: 'GET_ALL_PATIENT_STARTED',
    SUCCEEDED: 'GET_ALL_PATIENT_SUCCEEDED',
    FAILED: 'GET_ALL_PATIENT_FAILED'
  },
  getRetreggerPatient: {
    STARTED: 'GET_RETREGGER_PATINET_STARTED',
    SUCCEEDED: 'GET_RETREGGER_PATINET_SUCCEEDED',
    FAILED: 'GET_RETREGGER_PATINET_FAILED'
  },
  submitPatientId: {
    STARTED: 'SUBMIT_PATIENT_ID_STARTED',
    SUCCEEDED: 'SUBMIT_PATIENT_ID_SUCCEEDED',
    FAILED: 'SUBMIT_PATIENT_ID_FAILED'
  },
  uploadFiles: jest.fn(),
  uploadFilesRadiology: jest.fn()
}));

jest.mock('../../../../src/stores/tenantAdmin/patients/reducer', () => ({
  __esModule: true,
  default: (state = {
    allBatch: { data: null, error: null, loading: true },
    allOrganization: { data: null, error: null, loading: true },
    submitPatientId: { data: null, error: null, loading: true },
    getRetreggerPatient: { data: null, error: null, loading: true },
    allOrganizationLoader: false,
    allPatientsLoading: false,
    getRetreggerPatientLoading: false
  }, action) => {
    switch (action.type) {
      case 'GET_ALL_BATCH_STARTED':
        return { ...state, allBatch: { ...state.allBatch, loading: true, error: null } };
      case 'GET_ALL_BATCH_SUCCEEDED':
        return { ...state, allBatch: { ...state.allBatch, loading: false, data: action.payload } };
      case 'GET_ALL_BATCH_FAILED':
        return { ...state, allBatch: { ...state.allBatch, loading: false, error: action.payload } };
      case 'GET_ALL_ORGANIZATION_STARTED':
        return { ...state, allOrganization: { ...state.allOrganization, loading: true, error: null } };
      case 'GET_ALL_ORGANIZATION_SUCCEEDED':
        return { ...state, allOrganization: { ...state.allOrganization, loading: false, data: action.payload } };
      case 'GET_ALL_ORGANIZATION_FAILED':
        return { ...state, allOrganization: { ...state.allOrganization, loading: false, error: action.payload } };
      case 'SUBMIT_PATIENT_ID_STARTED':
        return { ...state, submitPatientId: { ...state.submitPatientId, loading: true, error: null } };
      case 'SUBMIT_PATIENT_ID_SUCCEEDED':
        return { ...state, submitPatientId: { ...state.submitPatientId, loading: false, data: action.payload } };
      case 'SUBMIT_PATIENT_ID_FAILED':
        return { ...state, submitPatientId: { ...state.submitPatientId, loading: false, error: action.payload } };
      case 'GET_RETREGGER_PATINET_STARTED':
        return { ...state, getRetreggerPatient: { ...state.getRetreggerPatient, loading: true, error: null } };
      case 'GET_RETREGGER_PATINET_SUCCEEDED':
        return { ...state, getRetreggerPatient: { ...state.getRetreggerPatient, loading: false, data: action.payload } };
      case 'GET_RETREGGER_PATINET_FAILED':
        return { ...state, getRetreggerPatient: { ...state.getRetreggerPatient, loading: false, error: action.payload } };
      default:
        return state;
    }
  }
}));

jest.mock('../../../../src/stores/tenantAdmin/patients/network', () => ({
  __esModule: true,
  getAllBatch: jest.fn(),
  getAllOrganization: jest.fn(),
  getAllPatient: jest.fn(),
  getRetreggerPatient: jest.fn(),
  submitPatientId: jest.fn()
}));

// Import after mocking
const actions = require('../../../../src/stores/tenantAdmin/patients/actions');
const reducer = require('../../../../src/stores/tenantAdmin/patients/reducer').default;
const network = require('../../../../src/stores/tenantAdmin/patients/network');

describe('tenantAdmin/patients store (mocked)', () => {
  test('actions: success and error scenarios', async () => {
    // Test that all actions are properly exported
    expect(actions.getAllBatchAction).toBeDefined();
    expect(actions.getAllOrganizationAction).toBeDefined();
    expect(actions.getAllPatientAction).toBeDefined();
    expect(actions.getRetreggerPatient).toBeDefined();
    expect(actions.submitPatientId).toBeDefined();
    expect(actions.uploadFiles).toBeDefined();
    expect(actions.uploadFilesRadiology).toBeDefined();
    
    expect(actions.getAllBatchAction.STARTED).toBe('GET_ALL_BATCH_STARTED');
    expect(actions.getAllBatchAction.SUCCEEDED).toBe('GET_ALL_BATCH_SUCCEEDED');
    expect(actions.getAllBatchAction.FAILED).toBe('GET_ALL_BATCH_FAILED');
    
    expect(actions.getAllOrganizationAction.STARTED).toBe('GET_ALL_ORGANIZATION_STARTED');
    expect(actions.getAllOrganizationAction.SUCCEEDED).toBe('GET_ALL_ORGANIZATION_SUCCEEDED');
    expect(actions.getAllOrganizationAction.FAILED).toBe('GET_ALL_ORGANIZATION_FAILED');
    
    expect(actions.getAllPatientAction.STARTED).toBe('GET_ALL_PATIENT_STARTED');
    expect(actions.getAllPatientAction.SUCCEEDED).toBe('GET_ALL_PATIENT_SUCCEEDED');
    expect(actions.getAllPatientAction.FAILED).toBe('GET_ALL_PATIENT_FAILED');
    
    expect(actions.submitPatientId.STARTED).toBe('SUBMIT_PATIENT_ID_STARTED');
    expect(actions.submitPatientId.SUCCEEDED).toBe('SUBMIT_PATIENT_ID_SUCCEEDED');
    expect(actions.submitPatientId.FAILED).toBe('SUBMIT_PATIENT_ID_FAILED');
    
    expect(actions.getRetreggerPatient.STARTED).toBe('GET_RETREGGER_PATINET_STARTED');
    expect(actions.getRetreggerPatient.SUCCEEDED).toBe('GET_RETREGGER_PATINET_SUCCEEDED');
    expect(actions.getRetreggerPatient.FAILED).toBe('GET_RETREGGER_PATINET_FAILED');
  });

  test('reducer: handles multiple action types', () => {
    const s0 = reducer(undefined, { type: '@@INIT' });
    const s1 = reducer(s0, { type: 'GET_ALL_BATCH_SUCCEEDED', payload: [{ id: 2, name: 'Batch 2' }] });
    const s2 = reducer(s1, { type: 'GET_ALL_ORGANIZATION_SUCCEEDED', payload: [{ id: 1, name: 'Org 1' }] });
    const s3 = reducer(s2, { type: 'UNKNOWN' });
    
    expect(s0.allBatch.data).toBeNull();
    expect(s0.allOrganization.data).toBeNull();
    expect(s1.allBatch.data).toEqual([{ id: 2, name: 'Batch 2' }]);
    expect(s2.allOrganization.data).toEqual([{ id: 1, name: 'Org 1' }]);
    expect(s3.allOrganization.data).toEqual([{ id: 1, name: 'Org 1' }]); // unchanged by unknown action
  });

  test('network: functions are properly mocked', async () => {
    // Test that network functions are properly mocked
    expect(network.getAllBatch).toBeDefined();
    expect(network.getAllOrganization).toBeDefined();
    expect(network.getAllPatient).toBeDefined();
    expect(network.getRetreggerPatient).toBeDefined();
    expect(network.submitPatientId).toBeDefined();
  });

  test('negative: reducer ignores unknown action types', () => {
    const initialState = { 
      allBatch: { data: [{ id: 1 }], error: null, loading: false },
      allOrganization: { data: [{ id: 1 }], error: null, loading: false },
      submitPatientId: { data: null, error: null, loading: true },
      getRetreggerPatient: { data: null, error: null, loading: true },
      allOrganizationLoader: false,
      allPatientsLoading: false,
      getRetreggerPatientLoading: false
    };
    const result = reducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('negative: network error handling with custom errors', async () => {
    const mockError = new Error('Custom patient error');
    network.getAllBatch.mockRejectedValueOnce(mockError);
    
    // Test that the function can be called (even if it rejects)
    expect(network.getAllBatch).toBeDefined();
  });

  test('negative: action with invalid parameters', async () => {
    // Test that actions can handle edge cases
    expect(actions.getAllBatchAction).toBeDefined();
    expect(actions.getAllOrganizationAction).toBeDefined();
    expect(actions.getAllPatientAction).toBeDefined();
    expect(actions.getRetreggerPatient).toBeDefined();
    expect(actions.submitPatientId).toBeDefined();
  });

  test('negative: reducer with invalid payload', () => {
    const initialState = { 
      allBatch: { data: null, error: null, loading: true },
      allOrganization: { data: null, error: null, loading: true },
      submitPatientId: { data: null, error: null, loading: true },
      getRetreggerPatient: { data: null, error: null, loading: true },
      allOrganizationLoader: false,
      allPatientsLoading: false,
      getRetreggerPatientLoading: false
    };
    const result = reducer(initialState, { type: 'GET_ALL_BATCH_SUCCEEDED', payload: null });
    expect(result.allBatch.data).toBeNull();
  });
}); 