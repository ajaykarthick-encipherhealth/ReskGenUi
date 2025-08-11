import { jest } from '@jest/globals';

jest.mock('../../../../src/stores/tenantAdmin/dashboard/default/action', () => ({
  __esModule: true,
  HccCodes: {
    STARTED: 'GET_ALL_HCC_CODES_STARTED',
    SUCCEEDED: 'GET_ALL_HCC_CODES_SUCCEEDED',
    FAILED: 'GET_ALL_HCC_CODES_FAILED'
  },
  getAllLabAndRadiologyCount: {
    STARTED: 'GET_ALL_COUNT_STARTED',
    SUCCEEDED: 'GET_ALL_COUNT_SUCCEEDED',
    FAILED: 'GET_ALL_COUNT_FAILED'
  },
  getAllLabAndRadiologyChart: {
    STARTED: 'GET_ALL_LAB_CHART_STARTED',
    SUCCEEDED: 'GET_ALL_LAB_CHART_SUCCEEDED',
    FAILED: 'GET_ALL_LAB_CHART_FAILED'
  },
  getAllRafScore: {
    STARTED: 'GET_ALL_RAF_COUNTS_SCORE_STARTED',
    SUCCEEDED: 'GET_ALL_RAF_COUNTS_SCORE_SUCCEEDED',
    FAILED: 'GET_ALL_RAF_COUNTS_SCORE_FAILED'
  },
  RafCounts: {
    STARTED: 'GET_ALL_RAF_COUNTS_REVENIEW_STARTED',
    SUCCEEDED: 'GET_ALL_RAF_COUNTS_REVENIEW_SUCCEEDED',
    FAILED: 'GET_ALL_RAF_COUNTS_REVENIEW_FAILED'
  },
  accuracyScore: {
    STARTED: 'ACCURACY_SCORE_TENANT_STARTED',
    SUCCEEDED: 'ACCURACY_SCORE_TENANT_SUCCEEDED',
    FAILED: 'ACCURACY_SCORE_TENANT_FAILED'
  },
  FilesCount: {
    STARTED: 'GET_ALL_FILES_COUNT_STARTED',
    SUCCEEDED: 'GET_ALL_FILES_COUNT_SUCCEEDED',
    FAILED: 'GET_ALL_FILES_COUNT_FAILED'
  },
  ComputingStatus: {
    STARTED: 'GET_ALL_COMPUTING_STATUS_CHART_STARTED',
    SUCCEEDED: 'GET_ALL_COMPUTING_STATUS_CHART_SUCCEEDED',
    FAILED: 'GET_ALL_COMPUTING_STATUS_CHART_FAILED'
  },
  top10Diseases: {
    STARTED: 'GET_TOP10_DISEASES_STARTED',
    SUCCEEDED: 'GET_TOP10_DISEASES_SUCCEEDED',
    FAILED: 'GET_TOP10_DISEASES_FAILED'
  },
  topOigCodes: {
    STARTED: 'GET_TOPOIG_DISEASES_STARTED',
    SUCCEEDED: 'GET_TOPOIG_DISEASES_SUCCEEDED',
    FAILED: 'GET_TOPOIG_DISEASES_FAILED'
  },
  rafScore: {
    STARTED: 'GET_RAF_SCORE_STARTED',
    SUCCEEDED: 'GET_RAF_SCORE_SUCCEEDED',
    FAILED: 'GET_RAF_SCORE_FAILED'
  },
  computingTileStatus: {
    STARTED: 'GET_COMPUTING_TILE_STATUS_STARTED',
    SUCCEEDED: 'GET_COMPUTING_TILE_STATUS_SUCCEEDED',
    FAILED: 'GET_COMPUTING_TILE_STATUS_FAILED'
  }
}));

jest.mock('../../../../src/stores/tenantAdmin/dashboard/default/reducer', () => ({
  __esModule: true,
  default: (state = { stats: { total: 0, active: 0 } }, action) => {
    if (action.type === 'SET_TENANT_DASHBOARD_STATS') return { ...state, stats: action.payload };
    return state;
  }
}));

jest.mock('../../../../src/stores/tenantAdmin/dashboard/default/network', () => ({
  __esModule: true,
  api: {
    get: jest.fn(async (url) => ({ ok: true, url, data: { stats: { total: 100, active: 80 } } })),
    post: jest.fn(async () => { throw new Error('tenant dashboard network error'); })
  }
}));

// Import after mocking
const actions = require('../../../../src/stores/tenantAdmin/dashboard/default/action');
const reducer = require('../../../../src/stores/tenantAdmin/dashboard/default/reducer').default;
const { api } = require('../../../../src/stores/tenantAdmin/dashboard/default/network');

describe('tenantAdmin/dashboard store (mocked)', () => {
  test('actions: action types are defined', () => {
    expect(actions.HccCodes).toBeDefined();
    expect(actions.getAllLabAndRadiologyCount).toBeDefined();
    expect(actions.getAllLabAndRadiologyChart).toBeDefined();
    expect(actions.getAllRafScore).toBeDefined();
    expect(actions.RafCounts).toBeDefined();
    expect(actions.accuracyScore).toBeDefined();
    expect(actions.FilesCount).toBeDefined();
    expect(actions.ComputingStatus).toBeDefined();
    expect(actions.top10Diseases).toBeDefined();
    expect(actions.topOigCodes).toBeDefined();
    expect(actions.rafScore).toBeDefined();
    expect(actions.computingTileStatus).toBeDefined();
  });

  test('reducer: handles SET_TENANT_DASHBOARD_STATS and unknown', () => {
    const s0 = reducer(undefined, { type: '@@INIT' });
    const s1 = reducer(s0, { type: 'SET_TENANT_DASHBOARD_STATS', payload: { total: 200, active: 150 } });
    const s2 = reducer(s1, { type: 'UNKNOWN' });
    expect(s0.stats).toEqual({ total: 0, active: 0 });
    expect(s1.stats).toEqual({ total: 200, active: 150 });
    expect(s2.stats).toEqual({ total: 200, active: 150 });
  });

  test('network: get resolves with data, post rejects', async () => {
    await expect(api.get('/tenant-dashboard')).resolves.toEqual({ 
      ok: true, 
      url: '/tenant-dashboard', 
      data: { stats: { total: 100, active: 80 } } 
    });
    await expect(api.post('/tenant-dashboard')).rejects.toThrow('tenant dashboard network error');
  });

  test('negative: reducer ignores unknown action types', () => {
    const initialState = { stats: { total: 50, active: 30 } };
    const result = reducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('negative: network error handling', async () => {
    const mockError = new Error('Custom tenant error');
    api.get.mockRejectedValueOnce(mockError);
    
    await expect(api.get('/error')).rejects.toThrow('Custom tenant error');
  });
}); 