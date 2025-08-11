import { jest } from '@jest/globals';

// Mock the dependencies before importing
jest.mock('../../../../src/utils/storages', () => ({
  getStorage: jest.fn()
}));

jest.mock('../../../../src/utils/network', () => ({
  requestPortal: jest.fn()
}));

// Import after mocking
const { getStorage } = require('../../../../src/utils/storages');
const { requestPortal } = require('../../../../src/utils/network');
const { 
  workFlow, 
  dailyTask, 
  accuracy, 
  completedScore, 
  holdStatus, 
  notification, 
  tenentLogo, 
  getTeamChartData, 
  usersList, 
  deliveryStatus 
} = require('../../../../src/stores/admin/dashboard/network');

describe('Dashboard Network', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock to return our test value
    getStorage.mockImplementation((k) => (k === 'orgId' ? 'test-org-id' : 'default-value'));
    requestPortal.mockResolvedValue({ data: 'test-response' });
  });

  describe('workFlow', () => {
    it('should fetch workflow data with correct parameters', async () => {
      const params = { startDate: '2024-01-01', endDate: '2024-01-31' };
      const result = await workFlow(params);
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/overallchart?allocatedOnStartDate=2024-01-01&allocatedOnEndDate=2024-01-31&organizationId=test-org-id\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should handle empty parameters', async () => {
      const result = await workFlow({});
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/overallchart?allocatedOnStartDate=&allocatedOnEndDate=&organizationId=test-org-id\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('dailyTask', () => {
    it('should fetch daily task data with orgId', async () => {
      const result = await dailyTask();
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/user/getusercountbyrole?organizationId=test-org-id\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('accuracy', () => {
    it('should fetch accuracy data with correct parameters for daily', async () => {
      const params = { btn: 'Daily', month: '01', year: '2024', isAdmin: true };
      const result = await accuracy(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/accuracyscore/machine/daily?month=01&year=2024&isAdmin=true\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should fetch accuracy data with correct parameters for weekly', async () => {
      const params = { btn: 'Weekly', month: '01', year: '2024', isAdmin: false };
      const result = await accuracy(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/accuracyscore/machine/weekly?month=01&year=2024&isAdmin=false\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should fetch accuracy data with correct parameters for monthly', async () => {
      const params = { btn: 'Monthly', year: '2024', isAdmin: true };
      const result = await accuracy(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/accuracyscore/machine/monthly?year=2024&isAdmin=true\n  ',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('completedScore', () => {
    it('should fetch completed score data with correct parameters for daily', async () => {
      const params = { btn: 'DAILY', month: '01', year: '2024', userName: 'testuser', selectMemberType: 'SUPERVISOR' };
      const result = await completedScore(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/chartdeliverystatus/daily?month=01&year=2024&userName=testuser&isManager=true',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should fetch completed score data with correct parameters for weekly', async () => {
      const params = { btn: 'WEEKLY', month: '01', year: '2024', userName: 'testuser', selectMemberType: 'USER' };
      const result = await completedScore(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/chartdeliverystatus/weekly?month=01&year=2024&userName=testuser&isManager=false',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should fetch completed score data with correct parameters for monthly', async () => {
      const params = { btn: 'MONTHLY', year: '2024', userName: 'testuser', selectMemberType: 'SUPERVISOR' };
      const result = await completedScore(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/chartdeliverystatus/monthly?year=2024&userName=testuser&isManager=true',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('holdStatus', () => {
    it('should fetch hold status data', async () => {
      const result = await holdStatus();
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/dashboard/hold/charts',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('notification', () => {
    it('should fetch notification data with userId', async () => {
      getStorage.mockImplementation((k) => (k === 'userId' ? 'test-user-id' : 'default-value'));
      const result = await notification();
      
      expect(getStorage).toHaveBeenCalledWith('userId');
      expect(requestPortal).toHaveBeenCalledWith(
        'communication/notification/test-user-id?page=0&limit=100',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('tenentLogo', () => {
    it('should fetch tenant logo data with orgId', async () => {
      const result = await tenentLogo();
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/comapnayLogo/getComapanyLogoLink?orgId=test-org-id',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('getTeamChartData', () => {
    it('should fetch team chart data', async () => {
      const result = await getTeamChartData();
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/teamchart?orgId=test-org-id',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('usersList', () => {
    it('should fetch users list data with role', async () => {
      const params = { role: 'CODER' };
      const result = await usersList(params);
      
      expect(getStorage).toHaveBeenCalledWith('orgId');
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/user/getByRole?role=CODER&orgId=test-org-id',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('deliveryStatus', () => {
    it('should fetch delivery status data with parameters', async () => {
      const params = { month: '01', year: '2024', btn: 'DAILY' };
      const result = await deliveryStatus(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/chartdeliverystatus/daily?month=01&year=2024',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should fetch delivery status data for weekly', async () => {
      const params = { month: '01', year: '2024', btn: 'WEEKLY' };
      const result = await deliveryStatus(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/chartdeliverystatus/weekly?month=01&year=2024',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });

    it('should fetch delivery status data for monthly', async () => {
      const params = { month: '01', year: '2024', btn: 'MONTHLY' };
      const result = await deliveryStatus(params);
      
      expect(requestPortal).toHaveBeenCalledWith(
        'dbservice/admindashboard/chartdeliverystatus/monthly?year=2024',
        { method: 'GET' }
      );
      expect(result).toEqual({ data: 'test-response' });
    });
  });

  describe('error handling', () => {
    it('should propagate errors from requestPortal', async () => {
      const error = new Error('Network error');
      requestPortal.mockRejectedValue(error);
      
      await expect(workFlow({})).rejects.toThrow('Network error');
    });

    it('should handle storage errors gracefully', async () => {
      getStorage.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      await expect(workFlow({})).rejects.toThrow('Storage error');
    });
  });
}); 