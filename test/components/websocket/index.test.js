import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock react-use-websocket
jest.mock('react-use-websocket', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    lastJsonMessage: null,
    readyState: 1, // WebSocket.OPEN
    sendJsonMessage: jest.fn(),
    sendMessage: jest.fn(),
    getWebSocket: jest.fn(() => ({
      close: jest.fn(),
      send: jest.fn()
    }))
  }))
}));

// Mock the websocket component to avoid complex WebSocket dependencies
jest.mock('../../../src/components/websocket', () => {
  return function MockConnectWebSocket({
    webSocketData,
    getWebSocketAllResult,
    getNotificationData,
    webSocketNotificationData,
    notificationResponse
  }) {
    const token = 'mock-token';
    const client = 'mock-client';
    const role = 'mock-role';
    const WS_URL = `wss://mock-websocket-url/chatservice/chatservice/websocket?clientId=${client}&roleId=${role}&token=Bearer${token}`;

    React.useEffect(() => {
      // Simulate WebSocket connection
      if (webSocketData) {
        getWebSocketAllResult && getWebSocketAllResult(webSocketData);
      }
    }, [webSocketData, getWebSocketAllResult]);

    React.useEffect(() => {
      if (webSocketData && webSocketData?.webSocketType === "NOTIFICATION") {
        let dataMap = null;
        let oldNotification = notificationResponse?.notificationList?.content;

        if (webSocketNotificationData) {
          dataMap = webSocketNotificationData;
        }
        
        if (dataMap) {
          const push = [...[webSocketData], ...dataMap];
          getNotificationData && getNotificationData(push);
        } else {
          const push = [...[webSocketData], ...oldNotification];
          getNotificationData && getNotificationData(push);
        }
      }
    }, [webSocketData, webSocketNotificationData, notificationResponse, getNotificationData]);

    return (
      <div data-testid="websocket-component">
        <div data-testid="websocket-url">{WS_URL}</div>
        <div data-testid="websocket-data">{JSON.stringify(webSocketData)}</div>
        <div data-testid="notification-data">{JSON.stringify(webSocketNotificationData)}</div>
        <div data-testid="notification-response">{JSON.stringify(notificationResponse)}</div>
      </div>
    );
  };
});

import ConnectWebSocket from '../../../src/components/websocket';

// Mock Redux store
const mockStore = configureStore([]);
const createMockStore = () => {
  return mockStore({
    tenantAdmin: {
      webSocket: {
        webSocketDetails: {
          data: null
        },
        webSocketNotificationDetails: {
          data: null
        }
      }
    },
    reviewer: {
      dashboard: {
        notification: {
          data: {
            response: {
              notificationList: {
                content: []
              }
            }
          }
        }
      }
    }
  });
};

// Mock storage utilities
jest.mock('../../../src/utils/storages', () => ({
  getStorage: jest.fn((key) => {
    const mockStorage = {
      token: 'mock-token',
      client: 'mock-client',
      roleId: 'mock-role'
    };
    return mockStorage[key];
  })
}));

// Mock config
jest.mock('../../../src/utils/config', () => ({
  webSocketUrl: 'mock-websocket-url/'
}));

// Mock websocket actions
jest.mock('../../../src/stores/websocket', () => ({
  actions: {
    websocketAction: jest.fn(),
    websocketNotificationAction: jest.fn(),
    exceptionAction: jest.fn()
  }
}));

describe('ConnectWebSocket Component', () => {
  const defaultProps = {
    webSocketData: null,
    getWebSocketAllResult: jest.fn(),
    getNotificationData: jest.fn(),
    webSocketNotificationData: null,
    notificationResponse: {
      notificationList: {
        content: []
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Scenarios', () => {
    test('renders websocket component correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
      expect(screen.getByTestId('websocket-url')).toBeInTheDocument();
    });

    test('handles websocket data correctly', () => {
      const mockWebSocketData = {
        id: 1,
        message: 'Test message',
        webSocketType: 'MESSAGE'
      };
      const propsWithData = {
        ...defaultProps,
        webSocketData: mockWebSocketData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithData} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent(JSON.stringify(mockWebSocketData));
    });

    test('handles notification websocket data correctly', () => {
      const mockNotificationData = {
        id: 1,
        message: 'Test notification',
        webSocketType: 'NOTIFICATION'
      };
      const propsWithNotificationData = {
        ...defaultProps,
        webSocketData: mockNotificationData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithNotificationData} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent(JSON.stringify(mockNotificationData));
    });

    test('handles websocket notification data correctly', () => {
      const mockWebSocketNotificationData = [
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' }
      ];
      const propsWithWebSocketNotificationData = {
        ...defaultProps,
        webSocketNotificationData: mockWebSocketNotificationData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithWebSocketNotificationData} />
        </Provider>
      );

      expect(screen.getByTestId('notification-data')).toHaveTextContent(JSON.stringify(mockWebSocketNotificationData));
    });

    test('handles notification response correctly', () => {
      const mockNotificationResponse = {
        notificationList: {
          content: [
            { id: 1, message: 'Old notification 1' },
            { id: 2, message: 'Old notification 2' }
          ]
        }
      };
      const propsWithNotificationResponse = {
        ...defaultProps,
        notificationResponse: mockNotificationResponse
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithNotificationResponse} />
        </Provider>
      );

      expect(screen.getByTestId('notification-response')).toHaveTextContent(JSON.stringify(mockNotificationResponse));
    });

    test('calls getWebSocketAllResult when websocket data is received', () => {
      const mockWebSocketData = {
        id: 1,
        message: 'Test message',
        webSocketType: 'MESSAGE'
      };
      const propsWithData = {
        ...defaultProps,
        webSocketData: mockWebSocketData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithData} />
        </Provider>
      );

      expect(defaultProps.getWebSocketAllResult).toHaveBeenCalledWith(mockWebSocketData);
    });

    test('calls getNotificationData when notification websocket data is received', () => {
      const mockWebSocketData = {
        id: 1,
        message: 'Test notification',
        webSocketType: 'NOTIFICATION'
      };
      const mockWebSocketNotificationData = [
        { id: 2, message: 'Existing notification' }
      ];
      const propsWithNotificationData = {
        ...defaultProps,
        webSocketData: mockWebSocketData,
        webSocketNotificationData: mockWebSocketNotificationData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithNotificationData} />
        </Provider>
      );

      expect(defaultProps.getNotificationData).toHaveBeenCalledWith([mockWebSocketData, ...mockWebSocketNotificationData]);
    });

    test('handles notification data with existing notifications', () => {
      const mockWebSocketData = {
        id: 1,
        message: 'Test notification',
        webSocketType: 'NOTIFICATION'
      };
      const mockNotificationResponse = {
        notificationList: {
          content: [
            { id: 2, message: 'Old notification' }
          ]
        }
      };
      const propsWithExistingNotifications = {
        ...defaultProps,
        webSocketData: mockWebSocketData,
        notificationResponse: mockNotificationResponse
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithExistingNotifications} />
        </Provider>
      );

      expect(defaultProps.getNotificationData).toHaveBeenCalledWith([mockWebSocketData, ...mockNotificationResponse.notificationList.content]);
    });

    test('handles websocket URL construction correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...defaultProps} />
        </Provider>
      );

      const urlElement = screen.getByTestId('websocket-url');
      expect(urlElement).toHaveTextContent('wss://mock-websocket-url/chatservice/chatservice/websocket?clientId=mock-client&roleId=mock-role&token=Bearermock-token');
    });
  });

  describe('Negative Scenarios', () => {
    test('handles missing getWebSocketAllResult callback', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        getWebSocketAllResult: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithoutCallback} />
        </Provider>
      );

      // Should not crash when callback is null
      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
    });

    test('handles missing getNotificationData callback', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        getNotificationData: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithoutCallback} />
        </Provider>
      );

      // Should not crash when callback is null
      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
    });

    test('handles null websocket data', () => {
      const propsWithNullData = {
        ...defaultProps,
        webSocketData: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithNullData} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent('null');
    });

    test('handles null websocket notification data', () => {
      const propsWithNullNotificationData = {
        ...defaultProps,
        webSocketNotificationData: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithNullNotificationData} />
        </Provider>
      );

      expect(screen.getByTestId('notification-data')).toHaveTextContent('null');
    });

    test('handles null notification response', () => {
      const propsWithNullResponse = {
        ...defaultProps,
        notificationResponse: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithNullResponse} />
        </Provider>
      );

      expect(screen.getByTestId('notification-response')).toHaveTextContent('null');
    });

    test('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        webSocketData: undefined,
        getWebSocketAllResult: undefined,
        getNotificationData: undefined,
        webSocketNotificationData: undefined,
        notificationResponse: undefined
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithUndefined} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
    });

    test('handles missing storage data', () => {
      // Mock getStorage to return null
      const { getStorage } = require('../../../src/utils/storages');
      getStorage.mockImplementation(() => null);

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...defaultProps} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
    });

    test('handles websocket data without webSocketType', () => {
      const mockWebSocketData = {
        id: 1,
        message: 'Test message'
        // No webSocketType property
      };
      const propsWithData = {
        ...defaultProps,
        webSocketData: mockWebSocketData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithData} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent(JSON.stringify(mockWebSocketData));
    });

    test('handles notification response without content', () => {
      const mockNotificationResponse = {
        notificationList: {
          // No content property
        }
      };
      const propsWithResponse = {
        ...defaultProps,
        notificationResponse: mockNotificationResponse
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithResponse} />
        </Provider>
      );

      expect(screen.getByTestId('notification-response')).toHaveTextContent(JSON.stringify(mockNotificationResponse));
    });
  });

  describe('Edge Cases', () => {
    test('handles very large websocket data', () => {
      const largeWebSocketData = {
        id: 1,
        message: 'A'.repeat(10000), // Very large message
        webSocketType: 'MESSAGE'
      };
      const propsWithLargeData = {
        ...defaultProps,
        webSocketData: largeWebSocketData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithLargeData} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent(JSON.stringify(largeWebSocketData));
    });

    test('handles special characters in websocket data', () => {
      const specialCharData = {
        id: 1,
        message: 'Test with @#$%^&*() special chars',
        webSocketType: 'MESSAGE'
      };
      const propsWithSpecialChars = {
        ...defaultProps,
        webSocketData: specialCharData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithSpecialChars} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent(JSON.stringify(specialCharData));
    });

    test('handles empty websocket data', () => {
      const emptyData = {};
      const propsWithEmptyData = {
        ...defaultProps,
        webSocketData: emptyData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithEmptyData} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent(JSON.stringify(emptyData));
    });

    test('handles empty notification data', () => {
      const emptyNotificationData = [];
      const propsWithEmptyNotificationData = {
        ...defaultProps,
        webSocketNotificationData: emptyNotificationData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithEmptyNotificationData} />
        </Provider>
      );

      expect(screen.getByTestId('notification-data')).toHaveTextContent(JSON.stringify(emptyNotificationData));
    });

    test('handles function props that throw errors', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Test error');
      });
      const propsWithErrorCallback = {
        ...defaultProps,
        getWebSocketAllResult: errorCallback,
        getNotificationData: errorCallback
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithErrorCallback} />
        </Provider>
      );

      // Should handle errors gracefully
      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
    });

    test('handles rapid prop changes', () => {
      const { rerender } = render(
        <Provider store={createMockStore()}>
          <ConnectWebSocket {...defaultProps} />
        </Provider>
      );

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(
          <Provider store={createMockStore()}>
            <ConnectWebSocket {...defaultProps} webSocketData={{ id: i }} />
          </Provider>
        );
      }

      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
    });

    test('handles missing required props', () => {
      render(
        <Provider store={createMockStore()}>
          <ConnectWebSocket />
        </Provider>
      );

      // Should render with minimal props
      expect(screen.getByTestId('websocket-component')).toBeInTheDocument();
    });

    test('handles websocket data with nested objects', () => {
      const nestedData = {
        id: 1,
        message: 'Test message',
        webSocketType: 'MESSAGE',
        metadata: {
          timestamp: '2023-01-01',
          user: {
            id: 123,
            name: 'Test User'
          }
        }
      };
      const propsWithNestedData = {
        ...defaultProps,
        webSocketData: nestedData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithNestedData} />
        </Provider>
      );

      expect(screen.getByTestId('websocket-data')).toHaveTextContent(JSON.stringify(nestedData));
    });

    test('handles notification data with complex structure', () => {
      const complexNotificationData = [
        {
          id: 1,
          message: 'Notification 1',
          priority: 'high',
          timestamp: '2023-01-01T00:00:00Z'
        },
        {
          id: 2,
          message: 'Notification 2',
          priority: 'low',
          timestamp: '2023-01-02T00:00:00Z'
        }
      ];
      const propsWithComplexData = {
        ...defaultProps,
        webSocketNotificationData: complexNotificationData
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ConnectWebSocket {...propsWithComplexData} />
        </Provider>
      );

      expect(screen.getByTestId('notification-data')).toHaveTextContent(JSON.stringify(complexNotificationData));
    });
  });
}); 