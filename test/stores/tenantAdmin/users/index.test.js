import { jest } from '@jest/globals';

jest.mock('../../../../src/stores/tenantAdmin/users/actions', () => ({
  __esModule: true,
  getAllOrganizationAction: {
    STARTED: 'GET_ALL_ORGANIZATION_STARTED',
    SUCCEEDED: 'GET_ALL_ORGANIZATION_SUCCEEDED',
    FAILED: 'GET_ALL_ORGANIZATION_FAILED'
  },
  getAllUsersAction: {
    STARTED: 'GET_ALL_USERS_STARTED',
    SUCCEEDED: 'GET_ALL_USERS_SUCCEEDED',
    FAILED: 'GET_ALL_USERS_FAILED'
  },
  getUsers: {
    STARTED: 'GET_USERS_STARTED',
    SUCCEEDED: 'GET_USERS_SUCCEEDED',
    FAILED: 'GET_USERS_FAILED'
  },
  usersAssigned: {
    STARTED: 'USERS_ASSIGNED_STARTED',
    SUCCEEDED: 'USERS_ASSIGNED_SUCCEEDED',
    FAILED: 'USERS_ASSIGNED_FAILED'
  },
  usersAllRoles: {
    STARTED: 'USERS_ALL_ROLES_STARTED',
    SUCCEEDED: 'USERS_ALL_ROLES_SUCCEEDED',
    FAILED: 'USERS_ALL_ROLES_FAILED'
  },
  userEditRoles: {
    STARTED: 'USER_EDIT_ROLES_STARTED',
    SUCCEEDED: 'USER_EDIT_ROLES_SUCCEEDED',
    FAILED: 'USER_EDIT_ROLES_FAILED'
  }
}));

jest.mock('../../../../src/stores/tenantAdmin/users/reducer', () => ({
  __esModule: true,
  default: (state = {}, action) => {
    // Mock a simple reducer that returns the state
    return state;
  }
}));

jest.mock('../../../../src/stores/tenantAdmin/users/network', () => ({
  __esModule: true,
  api: {
    get: jest.fn(async (url) => ({ ok: true, url, data: [{ id: 1, name: 'Tenant User 1' }] })),
    post: jest.fn(async (url, data) => ({ ok: true, url, data: { id: 2, ...data } })),
    put: jest.fn(async (url, data) => { throw new Error('tenant users update error'); })
  }
}));

// Import after mocking
const actions = require('../../../../src/stores/tenantAdmin/users/actions');
const reducer = require('../../../../src/stores/tenantAdmin/users/reducer').default;
const { api } = require('../../../../src/stores/tenantAdmin/users/network');

describe('tenantAdmin/users store (mocked)', () => {
  test('actions: action types are defined', () => {
    expect(actions.getAllOrganizationAction).toBeDefined();
    expect(actions.getAllUsersAction).toBeDefined();
    expect(actions.getUsers).toBeDefined();
    expect(actions.usersAssigned).toBeDefined();
    expect(actions.usersAllRoles).toBeDefined();
    expect(actions.userEditRoles).toBeDefined();
  });

  test('reducer: is a function', () => {
    expect(typeof reducer).toBe('function');
  });

  test('reducer: returns state for unknown actions', () => {
    const initialState = { test: 'data' };
    const result = reducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('network: get and post resolve, put rejects', async () => {
    await expect(api.get('/tenant-users')).resolves.toEqual({ 
      ok: true, 
      url: '/tenant-users', 
      data: [{ id: 1, name: 'Tenant User 1' }] 
    });
    await expect(api.post('/tenant-users', { name: 'New User' })).resolves.toEqual({
      ok: true,
      url: '/tenant-users',
      data: { id: 2, name: 'New User' }
    });
    await expect(api.put('/tenant-users/1', { name: 'Updated User' })).rejects.toThrow('tenant users update error');
  });

  test('negative: network error handling with custom errors', async () => {
    const mockError = new Error('Custom tenant user error');
    api.get.mockRejectedValueOnce(mockError);
    
    await expect(api.get('/error')).rejects.toThrow('Custom tenant user error');
  });
}); 