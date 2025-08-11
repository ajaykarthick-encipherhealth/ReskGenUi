import { jest } from '@jest/globals';

// Mock the storages module
jest.mock('../../../../src/utils/storages', () => ({
  __esModule: true,
  getStorage: jest.fn()
}));

// Mock the network module
jest.mock('../../../../src/utils/network', () => ({
  __esModule: true,
  requestPortal: jest.fn()
}));

// Import after mocking
const { getStorage } = require('../../../../src/utils/storages');
const { requestPortal } = require('../../../../src/utils/network');
const { fetchFromEndpoint, fetchFromEndpointPost } = require('../../../../src/stores/admin/dashboard1/network');

describe('Dashboard1 Network', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock to return our test value
    getStorage.mockImplementation((k) => (k === 'orgId' ? 'test-org-id' : 'default-value'));
    requestPortal.mockResolvedValue({ data: 'test-response' });
  });

  describe('fetchFromEndpoint', () => {
    it('should fetch data from endpoint with orgId', async () => {
      const result = await fetchFromEndpoint({ endpoint: 'test-endpoint' });
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith('dbservice/test-endpoint?organizationId=test-org-id', { method: 'GET' });
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should handle endpoint with existing query parameters', async () => {
      const result = await fetchFromEndpoint({ endpoint: 'test-endpoint', params: { param: 'value' } });
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith('dbservice/test-endpoint?organizationId=test-org-id&param=value', { method: 'GET' });
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should handle endpoint with trailing slash', async () => {
      const result = await fetchFromEndpoint({ endpoint: 'test-endpoint/' });
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith('dbservice/test-endpoint/?organizationId=test-org-id', { method: 'GET' });
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('fetchFromEndpointPost', () => {
    it('should post data to endpoint with orgId in body', async () => {
      const postData = { key: 'value' };
      const result = await fetchFromEndpointPost({ endpoint: 'test-endpoint', params: postData });
      
      expect(requestPortal).toHaveBeenCalledWith('dbservice/test-endpoint', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should handle empty post data', async () => {
      const result = await fetchFromEndpointPost({ endpoint: 'test-endpoint' });
      
      expect(requestPortal).toHaveBeenCalledWith('dbservice/test-endpoint', {
        method: 'POST',
        body: JSON.stringify({})
      });
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should handle null post data', async () => {
      const result = await fetchFromEndpointPost({ endpoint: 'test-endpoint', params: null });
      
      expect(requestPortal).toHaveBeenCalledWith('dbservice/test-endpoint', {
        method: 'POST',
        body: JSON.stringify(null)
      });
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('error handling', () => {
    it('should propagate errors from requestPortal', async () => {
      const error = new Error('Network error');
      requestPortal.mockRejectedValue(error);
      
      await expect(fetchFromEndpoint({ endpoint: 'test-endpoint' })).rejects.toThrow('Network error');
    });

    it('should handle storage errors gracefully', async () => {
      getStorage.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      await expect(fetchFromEndpoint({ endpoint: 'test-endpoint' })).rejects.toThrow('Storage error');
    });
  });
}); 