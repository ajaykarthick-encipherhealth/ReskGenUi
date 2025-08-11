import { jest } from '@jest/globals';

// Mock the antd module
jest.mock('antd', () => ({
  notification: jest.fn()
}));

// Mock the network utils module
jest.mock('../../../../src/utils/network', () => ({
  requestPortal: jest.fn()
}));

// Mock the storages utils module
jest.mock('../../../../src/utils/storages', () => ({
  getStorage: jest.fn()
}));

// Now import the actual modules
const network = require('../../../../src/stores/admin/notifications/network');
const { requestPortal } = require('../../../../src/utils/network');
const { getStorage } = require('../../../../src/utils/storages');

describe('admin/notifications network', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications function', () => {
    test('should be properly exported', () => {
      expect(network.getNotifications).toBeDefined();
      expect(typeof network.getNotifications).toBe('function');
    });

    test('should call requestPortal with correct URL and options for complete parameters', async () => {
      const mockResponse = { data: 'test-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const params = {
        searchText: 'test search',
        users: 'user1,user2',
        selectedDateRanges: { startDate: '2024-01-01', endDate: '2024-01-31' },
        selectedOption: { users: 'user1,user2', Priority: 'HIGH' },
        page: 1,
        limit: 20
      };

      const result = await network.getNotifications(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=test search&userTo=user1,user2&createdDateStart2024-01-01=&createdDateEnd=2024-01-31&notificationCategories=HIGH&page=1&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty parameters gracefully', async () => {
      const mockResponse = { data: 'empty-params-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({});

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle undefined parameters gracefully', async () => {
      const mockResponse = { data: 'undefined-params-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        searchText: undefined,
        users: undefined,
        selectedDateRanges: undefined,
        selectedOption: undefined,
        page: undefined,
        limit: undefined
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle null parameters gracefully', async () => {
      const mockResponse = { data: 'null-params-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        searchText: null,
        users: null,
        selectedDateRanges: null,
        selectedOption: null,
        page: null,
        limit: null
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle partial parameters correctly', async () => {
      const mockResponse = { data: 'partial-params-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        searchText: 'partial search',
        page: 5
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=partial search&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=5&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle selectedOption with only users', async () => {
      const mockResponse = { data: 'users-only-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        selectedOption: { users: 'user1' }
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=user1&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle selectedOption with only Priority', async () => {
      const mockResponse = { data: 'priority-only-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        selectedOption: { Priority: 'MEDIUM' }
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=MEDIUM&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle selectedDateRanges with only startDate', async () => {
      const mockResponse = { data: 'start-date-only-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        selectedDateRanges: { startDate: '2024-01-01' }
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart2024-01-01=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle selectedDateRanges with only endDate', async () => {
      const mockResponse = { data: 'end-date-only-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        selectedDateRanges: { endDate: '2024-01-31' }
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=2024-01-31&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle custom page parameter', async () => {
      const mockResponse = { data: 'custom-page-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        page: 10
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=10&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should always use hardcoded limit of 12 regardless of parameter', async () => {
      const mockResponse = { data: 'hardcoded-limit-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        limit: 50
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle network errors gracefully', async () => {
      const mockError = new Error('Network error');
      requestPortal.mockRejectedValue(mockError);

      await expect(network.getNotifications({})).rejects.toThrow('Network error');
      expect(requestPortal).toHaveBeenCalled();
    });

    test('should handle requestPortal throwing synchronous errors', async () => {
      const mockError = new Error('Sync error');
      requestPortal.mockImplementation(() => {
        throw mockError;
      });

      await expect(network.getNotifications({})).rejects.toThrow('Sync error');
    });
  });

  describe('getPostNotifications function', () => {
    test('should be properly exported', () => {
      expect(network.getPostNotifications).toBeDefined();
      expect(typeof network.getPostNotifications).toBe('function');
    });

    test('should call requestPortal with correct URL and options for simple data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const notificationData = { message: 'Test notification' };
      const result = await network.getPostNotifications(notificationData);

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify(notificationData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle complex notification data', async () => {
      const mockResponse = { success: true, id: 123 };
      requestPortal.mockResolvedValue(mockResponse);

      const notificationData = {
        message: 'Complex notification',
        priority: 'HIGH',
        recipients: ['user1', 'user2'],
        metadata: { category: 'alert', timestamp: Date.now() }
      };

      const result = await network.getPostNotifications(notificationData);

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify(notificationData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty notification data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getPostNotifications({});

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle null notification data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getPostNotifications(null);

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify(null)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle undefined notification data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getPostNotifications(undefined);

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify(undefined)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle string notification data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getPostNotifications('Simple string message');

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify('Simple string message')
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle number notification data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getPostNotifications(42);

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify(42)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle boolean notification data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getPostNotifications(true);

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify(true)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle array notification data', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const notificationData = ['notification1', 'notification2'];
      const result = await network.getPostNotifications(notificationData);

      expect(requestPortal).toHaveBeenCalledWith(
        'communication/push-notifications/admin/send',
        {
          method: 'POST',
          body: JSON.stringify(notificationData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle network errors gracefully', async () => {
      const mockError = new Error('Network error');
      requestPortal.mockRejectedValue(mockError);

      await expect(network.getPostNotifications({})).rejects.toThrow('Network error');
      expect(requestPortal).toHaveBeenCalled();
    });

    test('should handle requestPortal throwing synchronous errors', async () => {
      const mockError = new Error('Sync error');
      requestPortal.mockImplementation(() => {
        throw mockError;
      });

      await expect(network.getPostNotifications({})).rejects.toThrow('Sync error');
    });

    test('should handle JSON.stringify errors gracefully', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      // Create an object with circular reference that will cause JSON.stringify to fail
      const circularObj = {};
      circularObj.self = circularObj;

      // Mock JSON.stringify to throw an error
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn(() => {
        throw new Error('Circular reference error');
      });

      await expect(network.getPostNotifications(circularObj)).rejects.toThrow('Circular reference error');

      // Restore original JSON.stringify
      JSON.stringify = originalStringify;
    });
  });

  describe('URL construction edge cases', () => {
    test('should handle special characters in searchText', async () => {
      const mockResponse = { data: 'special-chars-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        searchText: 'test@email.com & special chars'
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=test@email.com & special chars&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty string values in parameters', async () => {
      const mockResponse = { data: 'empty-strings-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        searchText: '',
        users: '',
        selectedOption: { users: '', Priority: '' }
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle zero values in numeric parameters', async () => {
      const mockResponse = { data: 'zero-values-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.getNotifications({
        page: 0,
        limit: 0
      });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/notification/get/sentnotification?searchString=&userTo=&createdDateStart=&createdDateEnd=&notificationCategories=&page=0&limit=12',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('function behavior validation', () => {
    test('should return promises from both functions', () => {
      const getNotificationsPromise = network.getNotifications({});
      const getPostNotificationsPromise = network.getPostNotifications({});

      expect(getNotificationsPromise).toBeInstanceOf(Promise);
      expect(getPostNotificationsPromise).toBeInstanceOf(Promise);
    });

    test('should call requestPortal exactly once per function call', async () => {
      requestPortal.mockResolvedValue({ data: 'test' });

      await network.getNotifications({});
      expect(requestPortal).toHaveBeenCalledTimes(1);

      await network.getPostNotifications({});
      expect(requestPortal).toHaveBeenCalledTimes(2);
    });

    test('should maintain consistent behavior across multiple calls', async () => {
      const mockResponse = { data: 'consistent-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result1 = await network.getNotifications({ searchText: 'test' });
      const result2 = await network.getNotifications({ searchText: 'test' });

      expect(result1).toEqual(result2);
      expect(requestPortal).toHaveBeenCalledTimes(2);
    });
  });
}); 