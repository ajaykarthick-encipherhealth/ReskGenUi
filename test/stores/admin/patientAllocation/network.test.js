import { jest } from '@jest/globals';

// Mock the http module
jest.mock('http', () => ({
  get: jest.fn()
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
const network = require('../../../../src/stores/admin/patientAllocation/network');
const { requestPortal } = require('../../../../src/utils/network');
const { getStorage } = require('../../../../src/utils/storages');

describe('admin/patientAllocation network', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('allocatedGetList function', () => {
    test('should be properly exported', () => {
      expect(network.allocatedGetList).toBeDefined();
      expect(typeof network.allocatedGetList).toBe('function');
    });

    test('should call requestPortal with correct URL and options', async () => {
      const mockResponse = { data: 'test-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const params = { url: 'test=value&page=1' };
      const result = await network.allocatedGetList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/admin/computation/filter?test=value&page=1',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty url parameter', async () => {
      const mockResponse = { data: 'empty-url-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.allocatedGetList({ url: '' });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/admin/computation/filter?',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle undefined url parameter', async () => {
      const mockResponse = { data: 'undefined-url-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.allocatedGetList({ url: undefined });

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/admin/computation/filter?undefined',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle network errors gracefully', async () => {
      const mockError = new Error('Network error');
      requestPortal.mockRejectedValue(mockError);

      await expect(network.allocatedGetList({ url: 'test' })).rejects.toThrow('Network error');
    });
  });

  describe('l2List function', () => {
    test('should be properly exported', () => {
      expect(network.l2List).toBeDefined();
      expect(typeof network.l2List).toBe('function');
    });

    test('should call requestPortal with correct URL and options', async () => {
      const mockResponse = { data: 'l2-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const params = { url: 'dbservice/l2/list' };
      const result = await network.l2List(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/l2/list\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty url parameter', async () => {
      const mockResponse = { data: 'empty-l2-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.l2List({ url: '' });

      expect(requestPortal).toHaveBeenCalledWith(
        '\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('selectedList function', () => {
    test('should be properly exported', () => {
      expect(network.selectedList).toBeDefined();
      expect(typeof network.selectedList).toBe('function');
    });

    test('should call requestPortal with correct URL and options', async () => {
      const mockResponse = { data: 'selected-response' };
      requestPortal.mockResolvedValue(mockResponse);

      const params = { url: 'dbservice/selected/list' };
      const result = await network.selectedList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/selected/list\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('filters function', () => {
    test('should be properly exported', () => {
      expect(network.filters).toBeDefined();
      expect(typeof network.filters).toBe('function');
    });

    test('should call requestPortal with username and field parameters', async () => {
      const mockResponse = { data: 'filters-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('supervisor');

      const params = { field: 'testField', username: 'testUser', pageQueue: 'page1' };
      const result = await network.filters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?username=testUser&field=testField&role=SUPERVISOR',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should call requestPortal without username parameter', async () => {
      const mockResponse = { data: 'filters-no-username-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('reviewer');

      const params = { field: 'testField', pageQueue: 'page1' };
      const result = await network.filters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?field=testField&role=REVIEWER&page=page1',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle supervisor role with patientAllocated field', async () => {
      const mockResponse = { data: 'supervisor-patient-allocated-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('supervisor');

      const params = { field: 'patientAllocated', pageQueue: 'page1' };
      const result = await network.filters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?field=patientAllocated&role=SUPERVISOR&page=auditedqueue',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle undefined role from storage', async () => {
      const mockResponse = { data: 'undefined-role-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue(undefined);

      const params = { field: 'testField', pageQueue: 'page1' };
      const result = await network.filters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?field=testField&role=undefined&page=page1',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle null role from storage', async () => {
      const mockResponse = { data: 'null-role-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue(null);

      const params = { field: 'testField', pageQueue: 'page1' };
      const result = await network.filters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?field=testField&role=undefined&page=page1',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('patientAllocatedFilters function', () => {
    test('should be properly exported', () => {
      expect(network.patientAllocatedFilters).toBeDefined();
      expect(typeof network.patientAllocatedFilters).toBe('function');
    });

    test('should call requestPortal with correct parameters', async () => {
      const mockResponse = { data: 'patient-allocated-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('supervisor');

      const params = { field: 'testField', username: 'testUser', pageQueue: 'page1' };
      const result = await network.patientAllocatedFilters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?username=testUser&field=testField&role=SUPERVISOR',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('auditAssignedFilters function', () => {
    test('should be properly exported', () => {
      expect(network.auditAssignedFilters).toBeDefined();
      expect(typeof network.auditAssignedFilters).toBe('function');
    });

    test('should call requestPortal with correct parameters', async () => {
      const mockResponse = { data: 'audit-assigned-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('reviewer');

      const params = { field: 'testField', username: 'testUser', pageQueue: 'page1' };
      const result = await network.auditAssignedFilters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?username=testUser&field=testField&role=REVIEWER',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('allocatedByFilters function', () => {
    test('should be properly exported', () => {
      expect(network.allocatedByFilters).toBeDefined();
      expect(typeof network.allocatedByFilters).toBe('function');
    });

    test('should call requestPortal with correct parameters', async () => {
      const mockResponse = { data: 'allocated-by-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('supervisor');

      const params = { field: 'testField', username: 'testUser', pageQueue: 'page1' };
      const result = await network.allocatedByFilters(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/filter/field/list?username=testUser&field=testField&role=SUPERVISOR',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reviewerCheckedList function', () => {
    test('should be properly exported', () => {
      expect(network.reviewerCheckedList).toBeDefined();
      expect(typeof network.reviewerCheckedList).toBe('function');
    });

    test('should call requestPortal with fromTenant=true', async () => {
      const mockResponse = { data: 'reviewer-tenant-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = {
        batchCount: 10,
        totalElements: 100,
        sort: { sortDir: 'ASC', sortField: 'name' },
        searchString: 'test',
        selectedOption: 'HIGH',
        fromTenant: true,
        allPatientIds: '1,2,3'
      };
      const result = await network.reviewerCheckedList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/admin/computation/filter?page=0&size=0&userId=org123&computationStart=&computationEnd=&isAllocation=true&status=2&searchString=test&sortdirection=ASC&sortfield=name&priority=HIGH&batchCount=10&allPatientIds=1,2,3',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should call requestPortal with fromTenant=false', async () => {
      const mockResponse = { data: 'reviewer-org-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = {
        batchCount: 10,
        totalElements: 100,
        sort: { sortDir: 'DESC', sortField: 'date' },
        searchString: 'test',
        selectedOption: 'MEDIUM',
        fromTenant: false
      };
      const result = await network.reviewerCheckedList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/admin/computation/filter?organizationId=org123&page=0&size=10&userId=org123&computationStart=&computationEnd=&isAllocation=true&status=2&searchString=test&sortdirection=DESC&sortfield=date&priority=MEDIUM&batchCount=10',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle undefined parameters gracefully', async () => {
      const mockResponse = { data: 'undefined-params-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = {};
      const result = await network.reviewerCheckedList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/patient/admin/computation/filter?organizationId=org123&page=0&size=undefined&userId=org123&computationStart=&computationEnd=&isAllocation=true&status=2&searchString=undefined&sortdirection=undefined&sortfield=undefined&priority=&batchCount=undefined',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('supervisorCheckedList function', () => {
    test('should be properly exported', () => {
      expect(network.supervisorCheckedList).toBeDefined();
      expect(typeof network.supervisorCheckedList).toBe('function');
    });

    test('should call requestPortal with fromTenant=true', async () => {
      const mockResponse = { data: 'supervisor-tenant-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = {
        userName: 'testUser',
        pageNo: 1,
        sort: { sortDir: 'ASC', sortField: 'name' },
        searchString: 'test',
        selectedOption: 'HIGH',
        allocatedOption: 'allocated',
        fromTenant: true,
        pageSize: 20
      };
      const result = await network.supervisorCheckedList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/l2audit/patients?username=testUser&page=1&size=20&sortdirection=ASC&sortfield=name&searchstring=test&processedStatus=HIGH&patientAllocated=allocated',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should call requestPortal with fromTenant=false', async () => {
      const mockResponse = { data: 'supervisor-org-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = {
        userName: 'testUser',
        pageNo: 2,
        sort: { sortDir: 'DESC', sortField: 'date' },
        searchString: 'test',
        selectedOption: 'MEDIUM',
        allocatedOption: 'not-allocated',
        fromTenant: false,
        pageSize: 25
      };
      const result = await network.supervisorCheckedList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/l2audit/patients?organizationId=org123&username=testUser&page=2&size=25&sortdirection=DESC&sortfield=date&searchstring=test&processedStatus=MEDIUM&patientAllocated=not-allocated',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should use default sort values when sort parameters are missing', async () => {
      const mockResponse = { data: 'default-sort-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = {
        userName: 'testUser',
        pageNo: 1,
        searchString: 'test',
        fromTenant: true,
        pageSize: 20
      };
      const result = await network.supervisorCheckedList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/l2audit/patients?username=testUser&page=1&size=20&sortdirection=DESC&sortfield=dueDate&searchstring=test&processedStatus=&patientAllocated=',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('usersList function', () => {
    test('should be properly exported', () => {
      expect(network.usersList).toBeDefined();
      expect(typeof network.usersList).toBe('function');
    });

    test('should call requestPortal with all parameters', async () => {
      const mockResponse = { data: 'users-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = { roleId: 'role1', search: 'test', masterAudit: true };
      const result = await network.usersList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/user/get/role?roleId=role1&searchString=test&masterAudit=true',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle default search parameter', async () => {
      const mockResponse = { data: 'default-search-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = { roleId: 'role1', masterAudit: false };
      const result = await network.usersList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/user/get/role?roleId=role1&searchString=&masterAudit=false',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle undefined masterAudit parameter', async () => {
      const mockResponse = { data: 'undefined-master-audit-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue('org123');

      const params = { roleId: 'role1', search: 'test' };
      const result = await network.usersList(params);

      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/user/get/role?roleId=role1&searchString=test&masterAudit=false',
        { method: 'GET' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('allocateUsers function', () => {
    test('should be properly exported', () => {
      expect(network.allocateUsers).toBeDefined();
      expect(typeof network.allocateUsers).toBe('function');
    });

    test('should call requestPortal with POST method and JSON body', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const data = { userId: 'user1', patientId: 'patient1' };
      const result = await network.allocateUsers({ data });

      expect(requestPortal).toHaveBeenCalledWith(
        'management/allocation/manual',
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty data object', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const result = await network.allocateUsers({ data: {} });

      expect(requestPortal).toHaveBeenCalledWith(
        'management/allocation/manual',
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle complex data object', async () => {
      const mockResponse = { success: true };
      requestPortal.mockResolvedValue(mockResponse);

      const data = {
        users: ['user1', 'user2'],
        patients: ['patient1', 'patient2'],
        metadata: { priority: 'HIGH', notes: 'Test allocation' }
      };
      const result = await network.allocateUsers({ data });

      expect(requestPortal).toHaveBeenCalledWith(
        'management/allocation/manual',
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle network errors gracefully', async () => {
      const mockError = new Error('Allocation failed');
      requestPortal.mockRejectedValue(mockError);

      await expect(network.allocateUsers({ data: {} })).rejects.toThrow('Allocation failed');
    });
  });

  describe('error handling and edge cases', () => {
    test('should handle requestPortal throwing synchronous errors', async () => {
      const mockError = new Error('Sync error');
      requestPortal.mockImplementation(() => {
        throw mockError;
      });

      await expect(network.allocatedGetList({ url: 'test' })).rejects.toThrow('Sync error');
    });

    test('should handle JSON.stringify errors in allocateUsers', async () => {
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

      await expect(network.allocateUsers({ data: circularObj })).rejects.toThrow('Circular reference error');

      // Restore original JSON.stringify
      JSON.stringify = originalStringify;
    });

    test('should handle getStorage returning undefined for all functions', async () => {
      const mockResponse = { data: 'undefined-storage-response' };
      requestPortal.mockResolvedValue(mockResponse);
      getStorage.mockReturnValue(undefined);

      // Test filters function
      const result1 = await network.filters({ field: 'test', pageQueue: 'page1' });
      expect(result1).toEqual(mockResponse);

      // Test reviewerCheckedList function
      const result2 = await network.reviewerCheckedList({ fromTenant: false });
      expect(result2).toEqual(mockResponse);

      // Test supervisorCheckedList function
      const result3 = await network.supervisorCheckedList({ userName: 'test', pageNo: 1, pageSize: 20, fromTenant: false });
      expect(result3).toEqual(mockResponse);
    });
  });

  describe('function behavior validation', () => {
    test('should return promises from all functions', () => {
      const functions = [
        () => network.allocatedGetList({ url: 'test' }),
        () => network.l2List({ url: 'test' }),
        () => network.selectedList({ url: 'test' }),
        () => network.filters({ field: 'test', pageQueue: 'page1' }),
        () => network.patientAllocatedFilters({ field: 'test', pageQueue: 'page1' }),
        () => network.auditAssignedFilters({ field: 'test', pageQueue: 'page1' }),
        () => network.allocatedByFilters({ field: 'test', pageQueue: 'page1' }),
        () => network.reviewerCheckedList({}),
        () => network.supervisorCheckedList({ userName: 'test', pageNo: 1, pageSize: 20 }),
        () => network.usersList({ roleId: 'role1' }),
        () => network.allocateUsers({ data: {} })
      ];

      functions.forEach(fn => {
        const result = fn();
        expect(result).toBeInstanceOf(Promise);
      });
    });

    test('should call requestPortal exactly once per function call', async () => {
      requestPortal.mockResolvedValue({ data: 'test' });

      await network.allocatedGetList({ url: 'test' });
      expect(requestPortal).toHaveBeenCalledTimes(1);

      await network.l2List({ url: 'test' });
      expect(requestPortal).toHaveBeenCalledTimes(2);

      await network.filters({ field: 'test', pageQueue: 'page1' });
      expect(requestPortal).toHaveBeenCalledTimes(3);
    });
  });
}); 