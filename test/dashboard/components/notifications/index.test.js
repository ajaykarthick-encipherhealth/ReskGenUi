import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Notifications from '../../../../src/commonPages/dashboard/component/notifications';

// Mock only the dependencies that actually exist
jest.mock('next/image', () => {
  return function MockImage({ src, alt, className }) {
    return <img src={src} alt={alt} className={className} data-testid="next-image" />;
  };
});

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid="fontawesome-icon">{icon.iconName}</span>
}));

jest.mock('../../../../images/dashboard/no-notification.webp', () => 'no-notification.webp');

// Create a simple mock store
const createMockStore = () => {
  return {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn()
  };
};

describe("Notifications component", () => {
  test("renders with default props", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );
    expect(screen.getByText('Rebuttal Notifications')).toBeInTheDocument();
  });

  test("renders with notification data", () => {
    const store = createMockStore();
    const mockData = [
      {
        id: 1,
        content: "Test notification",
        createdDate: "2024-01-15T10:30:00Z",
        fromUserDetails: {
          firstName: "John",
          lastName: "Doe"
        }
      }
    ];

    const notificationResponse = {
      data: {
        response: {
          notificationList: {
            content: mockData
          }
        }
      }
    };

    render(
      <Provider store={store}>
        <Notifications notificationResponse={notificationResponse} />
      </Provider>
    );
    
    expect(screen.getByText('Rebuttal Notifications')).toBeInTheDocument();
  });

  test("renders empty state", () => {
    const store = createMockStore();
    const notificationResponse = {
      data: {
        response: {
          notificationList: {
            content: []
          }
        }
      }
    };

    render(
      <Provider store={store}>
        <Notifications notificationResponse={notificationResponse} />
      </Provider>
    );
    
    expect(screen.getByText('Rebuttal Notifications')).toBeInTheDocument();
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

}); 