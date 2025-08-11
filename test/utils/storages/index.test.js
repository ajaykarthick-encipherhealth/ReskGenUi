import { getStorage, setStorage, removeStorage, getLocalStored } from '../../../src/utils/storages';

// Mock CryptoJS
jest.mock('crypto-js', () => ({
  SHA256: jest.fn((key) => ({
    toString: jest.fn(() => `hashed-${key}`)
  })),
  AES: {
    encrypt: jest.fn((value, key) => ({
      toString: jest.fn(() => `encrypted-${value}`)
    })),
    decrypt: jest.fn((value, key) => ({
      toString: jest.fn(() => 'decrypted-value')
    }))
  },
  enc: {
    Utf8: 'utf8'
  }
}));

// Mock config with factory function
let serverControlValue = 'development';
jest.mock('../../../src/utils/config', () => ({
  salt: 'test-salt',
  get serverControl() {
    return serverControlValue;
  }
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 2
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockClear();
    mockSessionStorage.setItem.mockClear();
    mockSessionStorage.removeItem.mockClear();
    mockSessionStorage.clear.mockClear();
    mockSessionStorage.key.mockClear();
    // Reset to development mode by default
    serverControlValue = 'development';
  });

  describe('getStorage', () => {
    test('retrieves value from sessionStorage in development mode', () => {
      mockSessionStorage.getItem.mockReturnValue('test-value');
      
      const result = getStorage('test-key');
      
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    test('returns null when value does not exist', () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      
      const result = getStorage('non-existent-key');
      
      expect(result).toBeNull();
    });

    test('handles encryption in production mode', () => {
      serverControlValue = 'production';
      
      mockSessionStorage.getItem.mockReturnValue('encrypted-value');
      
      const result = getStorage('test-key');
      
      expect(result).toBe('decrypted-value');
    });

    test('handles decryption errors gracefully', () => {
      serverControlValue = 'production';
      
      const { AES } = require('crypto-js');
      AES.decrypt.mockImplementation(() => {
        throw new Error('Decryption error');
      });
      
      const result = getStorage('test-key');
      
      expect(result).toBeNull();
    });

    test('handles general errors gracefully', () => {
      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = getStorage('test-key');
      
      expect(result).toBeNull();
    });
  });

  describe('setStorage', () => {
    test('sets value in sessionStorage in development mode', async () => {
      const result = await setStorage('test-key', 'test-value');
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
      expect(result).toBeUndefined();
    });

    test('sets string value correctly', async () => {
      await setStorage('test-key', 'string-value');
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', 'string-value');
    });

    test('sets object value correctly', async () => {
      const objectValue = { name: 'test', id: 123 };
      await setStorage('test-key', objectValue);
      
      // In development mode, objects are passed directly to sessionStorage
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', objectValue);
    });

    test('handles encryption in production mode', async () => {
      serverControlValue = 'production';
      
      await setStorage('test-key', 'test-value');
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('hashed-test-key', 'encrypted-test-value');
    });

    test('handles encryption errors gracefully', async () => {
      serverControlValue = 'production';
      
      const { AES } = require('crypto-js');
      AES.encrypt.mockImplementation(() => {
        throw new Error('Encryption error');
      });
      
      const result = await setStorage('test-key', 'test-value');
      
      expect(result).toBeNull();
    });

    test('handles general errors gracefully', async () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = await setStorage('test-key', 'test-value');
      
      expect(result).toBeNull();
    });
  });

  describe('removeStorage', () => {
    test('removes specific key from sessionStorage in development mode', async () => {
      const result = await removeStorage('test-key');
      
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(result).toBeUndefined();
    });

    test('clears all storage when no key provided', async () => {
      const result = await removeStorage();
      
      expect(mockSessionStorage.clear).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    test('handles encryption in production mode', async () => {
      serverControlValue = 'production';
      
      await removeStorage('test-key');
      
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('hashed-test-key');
    });

    test('handles general errors gracefully', async () => {
      mockSessionStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = await removeStorage('test-key');
      
      expect(result).toBeNull();
    });

    test('handles clear errors gracefully', async () => {
      mockSessionStorage.clear.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = await removeStorage();
      
      expect(result).toBeNull();
    });
  });

  describe('getLocalStored', () => {
    test('returns all sessionStorage items', () => {
      mockSessionStorage.length = 2;
      mockSessionStorage.key
        .mockReturnValueOnce('key1')
        .mockReturnValueOnce('key2');
      mockSessionStorage.getItem
        .mockReturnValueOnce('value1')
        .mockReturnValueOnce('value2');
      
      const result = getLocalStored();
      
      expect(result).toEqual({
        key1: 'value1',
        key2: 'value2'
      });
    });

    test('returns empty object when no items exist', () => {
      mockSessionStorage.length = 0;
      
      const result = getLocalStored();
      
      expect(result).toEqual({});
    });

    test('handles undefined window gracefully', () => {
      const originalWindow = global.window;
      delete global.window;
      
      const result = getLocalStored();
      
      expect(result).toEqual({});
      
      global.window = originalWindow;
    });

    test('handles undefined sessionStorage gracefully', () => {
      const originalSessionStorage = global.sessionStorage;
      delete global.sessionStorage;
      
      const result = getLocalStored();
      
      expect(result).toEqual({});
      
      global.sessionStorage = originalSessionStorage;
    });

    test('handles sessionStorage errors gracefully', () => {
      mockSessionStorage.key.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const result = getLocalStored();
      
      expect(result).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    test('handles null key in getStorage', () => {
      const result = getStorage(null);
      expect(result).toBeNull();
    });

    test('handles undefined key in getStorage', () => {
      const result = getStorage(undefined);
      expect(result).toBeNull();
    });

    test('handles null key in setStorage', async () => {
      await setStorage(null, 'test-value');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(null, 'test-value');
    });

    test('handles undefined key in setStorage', async () => {
      await setStorage(undefined, 'test-value');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(undefined, 'test-value');
    });

    test('handles null value in setStorage', async () => {
      await setStorage('test-key', null);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', null);
    });

    test('handles undefined value in setStorage', async () => {
      await setStorage('test-key', undefined);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', undefined);
    });

    test('handles null key in removeStorage', async () => {
      await removeStorage(null);
      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });

    test('handles undefined key in removeStorage', async () => {
      await removeStorage(undefined);
      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });

    test('handles empty string key in removeStorage', async () => {
      await removeStorage('');
      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    test('integrates with CryptoJS correctly', () => {
      const { SHA256, AES } = require('crypto-js');
      
      // Test in production mode to trigger CryptoJS usage
      serverControlValue = 'production';
      
      // Mock an encrypted value to trigger decryption
      mockSessionStorage.getItem.mockReturnValue('encrypted-value');
      getStorage('test-key');
      setStorage('test-key', 'test-value');
      
      expect(SHA256).toHaveBeenCalled();
      expect(AES.encrypt).toHaveBeenCalled();
      expect(AES.decrypt).toHaveBeenCalled();
    });

    test('integrates with config correctly', () => {
      const { salt, serverControl } = require('../../../src/utils/config');
      
      expect(salt).toBeDefined();
      expect(serverControl).toBeDefined();
    });

    test('integrates with sessionStorage correctly', () => {
      // Reset mocks to ensure clean state
      jest.clearAllMocks();
      
      // Set up mock data for getLocalStored
      mockSessionStorage.length = 2;
      mockSessionStorage.key
        .mockReturnValueOnce('key1')
        .mockReturnValueOnce('key2');
      mockSessionStorage.getItem
        .mockReturnValueOnce('value1')
        .mockReturnValueOnce('value2');
      
      getStorage('test-key');
      setStorage('test-key', 'test-value');
      removeStorage('test-key');
      getLocalStored();
      
      expect(mockSessionStorage.getItem).toHaveBeenCalled();
      expect(mockSessionStorage.setItem).toHaveBeenCalled();
      expect(mockSessionStorage.removeItem).toHaveBeenCalled();
      expect(mockSessionStorage.key).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('handles CryptoJS errors in getStorage', () => {
      const { SHA256 } = require('crypto-js');
      SHA256.mockImplementation(() => {
        throw new Error('CryptoJS error');
      });
      
      const result = getStorage('test-key');
      // In the actual implementation, when CryptoJS fails, it returns the encrypted value
      expect(result).toBe('encrypted-value');
    });

    test('handles CryptoJS errors in setStorage', async () => {
      const { AES } = require('crypto-js');
      AES.encrypt.mockImplementation(() => {
        throw new Error('CryptoJS error');
      });
      
      const result = await setStorage('test-key', 'test-value');
      expect(result).toBeNull();
    });

    test('handles sessionStorage errors in getStorage', () => {
      mockSessionStorage.getItem.mockImplementation(() => {
        throw new Error('SessionStorage error');
      });
      
      const result = getStorage('test-key');
      expect(result).toBeNull();
    });

    test('handles sessionStorage errors in setStorage', async () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('SessionStorage error');
      });
      
      const result = await setStorage('test-key', 'test-value');
      expect(result).toBeNull();
    });

    test('handles sessionStorage errors in removeStorage', async () => {
      mockSessionStorage.removeItem.mockImplementation(() => {
        throw new Error('SessionStorage error');
      });
      
      const result = await removeStorage('test-key');
      expect(result).toBeNull();
    });
  });
}); 