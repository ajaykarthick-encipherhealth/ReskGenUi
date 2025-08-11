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
jest.mock('../../../../src/stores/admin/workqueue/network', () => ({
  PatientsList: jest.fn(),
  TrackingList: jest.fn(),
  addPatient: jest.fn(),
  uploadFile: jest.fn(),
  uploadRadiologyFile: jest.fn(),
  uploadLabFile: jest.fn(),
  getUsers: jest.fn()
}));

// Now import the actual modules
const actions = require('../../../../src/stores/admin/workqueue/actions');
const reducer = require('../../../../src/stores/admin/workqueue/reducer').default;
const network = require('../../../../src/stores/admin/workqueue/network');

describe('admin/workqueue store', () => {
  test('actions: should be properly exported', () => {
    expect(actions.patientsAction).toBeDefined();
    expect(actions.getTrackingList).toBeDefined();
    expect(actions.getPatientDetails).toBeDefined();
    expect(actions.getAddPatient).toBeDefined();
    expect(actions.getUploadFile).toBeDefined();
    expect(actions.getUploadRadiologyFile).toBeDefined();
    expect(actions.getUploadLabFile).toBeDefined();
    expect(actions.getUsersList).toBeDefined();
  });

  test('actions: should have correct structure for thunk actions', () => {
    expect(actions.patientsAction.STARTED).toBe('PATIENTS_LIST_STARTED');
    expect(actions.patientsAction.SUCCEEDED).toBe('PATIENTS_LIST_SUCCEEDED');
    expect(actions.patientsAction.FAILED).toBe('PATIENTS_LIST_FAILED');
    
    expect(actions.getTrackingList.STARTED).toBe('TRACKING_STARTED');
    expect(actions.getTrackingList.SUCCEEDED).toBe('TRACKING_SUCCEEDED');
    expect(actions.getTrackingList.FAILED).toBe('TRACKING_FAILED');
    
    expect(actions.getAddPatient.STARTED).toBe('GET_ADD_PATIENT_STARTED');
    expect(actions.getAddPatient.SUCCEEDED).toBe('GET_ADD_PATIENT_SUCCEEDED');
    expect(actions.getAddPatient.FAILED).toBe('GET_ADD_PATIENT_FAILED');
    
    expect(actions.getUploadFile.STARTED).toBe('GET_UPLOAD_PATIENT_FILE_STARTED');
    expect(actions.getUploadFile.SUCCEEDED).toBe('GET_UPLOAD_PATIENT_FILE_SUCCEEDED');
    expect(actions.getUploadFile.FAILED).toBe('GET_UPLOAD_PATIENT_FILE_FAILED');
    
    expect(actions.getUploadRadiologyFile.STARTED).toBe('GET_UPLOAD_PATIENT_RADIOLOGY_FILE_STARTED');
    expect(actions.getUploadRadiologyFile.SUCCEEDED).toBe('GET_UPLOAD_PATIENT_RADIOLOGY_FILE_SUCCEEDED');
    expect(actions.getUploadRadiologyFile.FAILED).toBe('GET_UPLOAD_PATIENT_RADIOLOGY_FILE_FAILED');
    
    expect(actions.getUploadLabFile.STARTED).toBe('GET_UPLOAD_PATIENT_Lab_FILE_STARTED');
    expect(actions.getUploadLabFile.SUCCEEDED).toBe('GET_UPLOAD_PATIENT_Lab_FILE_SUCCEEDED');
    expect(actions.getUploadLabFile.FAILED).toBe('GET_UPLOAD_PATIENT_Lab_FILE_FAILED');
    
    expect(actions.getUsersList.STARTED).toBe('GET_BY_USERS_STARTED');
    expect(actions.getUsersList.SUCCEEDED).toBe('GET_BY_USERS_SUCCEEDED');
    expect(actions.getUsersList.FAILED).toBe('GET_BY_USERS_FAILED');
  });

  test('actions: should have correct structure for simple actions', () => {
    expect(actions.getPatientDetails).toBe('GET_ALL_PATIENTS_FILES');
  });

  test('reducer: should handle initial state', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    expect(initialState).toBeDefined();
    
    // Check that expected reducers exist
    expect(initialState.patients).toBeDefined();
    expect(initialState.patientsLoading).toBeDefined();
    expect(initialState.trackingList).toBeDefined();
    expect(initialState.trackingLoader).toBeDefined();
    expect(initialState.patientDetails).toBeDefined();
    
    // Check initial state structure
    expect(initialState.patients.loading).toBe(true);
    expect(initialState.patients.data).toBeNull();
    expect(initialState.patients.error).toBeNull();
    
    expect(initialState.trackingList.loading).toBe(true);
    expect(initialState.trackingList.data).toBeNull();
    expect(initialState.trackingList.error).toBeNull();
    
    expect(initialState.patientDetails).toBe('');
  });

  test('reducer: should handle PATIENTS_LIST_STARTED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'PATIENTS_LIST_STARTED' };
    const newState = reducer(initialState, action);
    
    expect(newState.patients.loading).toBe(true);
    expect(newState.patients.error).toBeNull();
  });

  test('reducer: should handle PATIENTS_LIST_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'PATIENTS_LIST_SUCCEEDED', payload: [{ id: 1, name: 'Patient 1' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.patients.loading).toBe(false);
    expect(newState.patients.data).toEqual([{ id: 1, name: 'Patient 1' }]);
    expect(newState.patients.error).toBeNull();
  });

  test('reducer: should handle TRACKING_STARTED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'TRACKING_STARTED' };
    const newState = reducer(initialState, action);
    
    expect(newState.trackingList.loading).toBe(true);
    expect(newState.trackingList.error).toBeNull();
  });

  test('reducer: should handle TRACKING_SUCCEEDED action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'TRACKING_SUCCEEDED', payload: [{ id: 1, status: 'tracking' }] };
    const newState = reducer(initialState, action);
    
    expect(newState.trackingList.loading).toBe(false);
    expect(newState.trackingList.data).toEqual([{ id: 1, status: 'tracking' }]);
    expect(newState.trackingList.error).toBeNull();
  });

  test('reducer: should handle GET_ALL_PATIENTS_FILES action', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    const action = { type: 'GET_ALL_PATIENTS_FILES', payload: 'patient files data' };
    const newState = reducer(initialState, action);
    
    expect(newState.patientDetails).toBe('patient files data');
  });

  test('network: functions should be properly exported', () => {
    expect(network.PatientsList).toBeDefined();
    expect(network.TrackingList).toBeDefined();
    expect(network.addPatient).toBeDefined();
    expect(network.uploadFile).toBeDefined();
    expect(network.uploadRadiologyFile).toBeDefined();
    expect(network.uploadLabFile).toBeDefined();
    expect(network.getUsers).toBeDefined();
  });
}); 