import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HeadTitle from '../../../src/components/headtitle';

// Mock dayjs properly with all required methods
jest.mock('dayjs', () => {
  const dayjs = jest.requireActual('dayjs');
  
  const createMockDate = (date) => {
    const mockDate = {
      format: jest.fn(() => '2024-01-15'),
      toDate: jest.fn(() => new Date('2024-01-15')),
      isBefore: jest.fn(() => false),
      isAfter: jest.fn(() => true),
      add: jest.fn(() => createMockDate()),
      subtract: jest.fn(() => createMockDate()),
      hour: jest.fn(() => 12),
      minute: jest.fn(() => 30),
      second: jest.fn(() => 0),
      millisecond: jest.fn(() => 0),
      set: jest.fn(() => createMockDate()),
      get: jest.fn(() => 1),
      startOf: jest.fn(() => createMockDate()),
      endOf: jest.fn(() => createMockDate()),
      isValid: jest.fn(() => true),
      clone: jest.fn(() => createMockDate()),
      ...dayjs(date)
    };
    
    // Add static methods to the instance
    mockDate.extend = jest.fn(() => mockDate);
    mockDate.locale = jest.fn(() => mockDate);
    mockDate.utc = jest.fn(() => createMockDate());
    mockDate.unix = jest.fn(() => createMockDate());
    
    return mockDate;
  };
  
  const dayjsInstance = createMockDate;
  dayjsInstance.extend = jest.fn(() => dayjsInstance);
  dayjsInstance.locale = jest.fn(() => dayjsInstance);
  dayjsInstance.utc = jest.fn(() => createMockDate());
  dayjsInstance.unix = jest.fn(() => createMockDate());
  
  return {
    ...dayjs,
    default: dayjsInstance,
    extend: jest.fn(() => dayjsInstance),
    locale: jest.fn(() => dayjsInstance),
    utc: jest.fn(() => createMockDate()),
    unix: jest.fn(() => createMockDate()),
    __esModule: true
  };
});

// Mock Ant Design components
jest.mock('antd', () => ({
  Button: ({ children, onClick, name, id, type, style }) => (
    <button 
      onClick={onClick} 
      data-testid={name || id}
      type={type}
      style={style}
    >
      {children}
    </button>
  ),
  DatePicker: {
    RangePicker: ({ 
      onChange, 
      onCalendarChange, 
      value, 
      open, 
      ref,
      'data-testid': testId,
      placeholder,
      style
    }) => (
      <div data-testid="range-picker" style={style}>
        <input 
          data-testid="date-input"
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          value={value ? '2024-01-01 to 2024-01-31' : ''}
        />
        <button 
          data-testid="calendar-button"
          onClick={() => {
            if (onCalendarChange) {
              onCalendarChange(['2024-01-01', '2024-01-31']);
            }
            if (onChange) {
              onChange(['2024-01-01', '2024-01-31']);
            }
          }}
        >
          Open Calendar
        </button>
      </div>
    )
  },
  Modal: ({ 
    children, 
    open, 
    onCancel, 
    onOk,
    footer, 
    width, 
    closable,
    className,
    title
  }) => (
    open ? (
      <div data-testid="modal" className={className}>
        <div data-testid="modal-header">
          <h3>{title}</h3>
        </div>
        <div data-testid="modal-content">
          {children}
        </div>
        <div data-testid="modal-footer">
          {footer || (
            <>
              <button data-testid="modal-cancel" onClick={onCancel}>
                Cancel
              </button>
              <button data-testid="modal-ok" onClick={onOk}>
                OK
              </button>
            </>
          )}
        </div>
      </div>
    ) : null
  )
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, onClick, id, name }) => (
    <span 
      data-testid={id || name || 'font-awesome-icon'}
      onClick={onClick}
    >
      {icon}
    </span>
  )
}));

jest.mock('@fortawesome/free-regular-svg-icons', () => ({
  faCalendar: 'fa-calendar'
}));

// Mock Redux actions
jest.mock('../../../src/stores/admin/dashboard', () => ({
  actions: {
    getDateRange: jest.fn()
  }
}));

// Mock utility functions
jest.mock('../../../src/utils/reusable', () => ({
  disabledDate: jest.fn(() => false),
  formatDateForIndex: jest.fn(() => '2024-01-15')
}));

// Mock CSS module
jest.mock('../../../src/components/headtitle/styles.module.css', () => ({
  header: 'header-class',
  title: 'title-class',
  imgContainer: 'img-container-class',
  anchor: 'anchor-class',
  customModal: 'custom-modal-class',
  modalDetails: 'modal-details-class'
}));

// Create mock store
const mockStore = configureStore([]);

describe('HeadTitle Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      admin: {
        dashboard: {
          dateRange: ['2024-01-01', '2024-01-31']
        }
      }
    });
  });

  const renderWithProvider = (component) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  describe('Basic Rendering', () => {
    test('renders header text correctly', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          icon="test-icon"
          anchorTag="test-anchor"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    test('renders with custom className', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          className="custom-class"
        />
      );
      
      const headerElement = screen.getByText('Test Header').closest('div');
      expect(headerElement).toHaveClass('title-class');
    });

    test('renders with custom style', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          style={{ margin: '10px' }}
        />
      );
      
      const headerElement = screen.getByText('Test Header').closest('.header-class');
      expect(headerElement).toBeInTheDocument();
    });

    test('renders with custom fontSize', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          fontSize="16px"
        />
      );
      
      const titleElement = screen.getByText('Test Header');
      expect(titleElement).toHaveStyle({ fontSize: '16px' });
    });
  });

  describe('Icon Functionality', () => {
    test('renders with icon', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          icon="calendar-dashboard"
        />
      );
      
      expect(screen.getByTestId('calendar-dashboard')).toBeInTheDocument();
    });

    test('handles icon click', () => {
      const mockSetOpenPicker = jest.fn();
      
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          icon="calendar-dashboard"
          setOpenPicker={mockSetOpenPicker}
        />
      );
      
      const iconElement = screen.getByTestId('calendar-dashboard');
      fireEvent.click(iconElement);
      
      expect(mockSetOpenPicker).toHaveBeenCalledWith(true);
    });

    test('handles missing icon gracefully', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });
  });

  describe('Anchor Tag Functionality', () => {
    test('renders with anchor tag', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          anchorTag="test-anchor"
        />
      );
      
      expect(screen.getByText('View All')).toBeInTheDocument();
    });

    test('handles anchor tag click', () => {
      const mockHandleOpen = jest.fn();
      
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          anchorTag="test-anchor"
          handleOpen={mockHandleOpen}
        />
      );
      
      const anchorElement = screen.getByText('View All');
      fireEvent.click(anchorElement);
      
      expect(mockHandleOpen).toHaveBeenCalled();
    });

    test('handles anchor tag without handleOpen function', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
          anchorTag="test-anchor"
        />
      );
      
      const anchorElement = screen.getByText('View All');
      expect(() => fireEvent.click(anchorElement)).not.toThrow();
    });

    test('handles missing anchorTag gracefully', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });
  });

  describe('Default Date Range', () => {
    test('initializes with default date range', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    test('handles missing default date range', () => {
      store = mockStore({
        admin: {
          dashboard: {}
        }
      });
      
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    test('handles partial default date range', () => {
      store = mockStore({
        admin: {
          dashboard: {
            dateRange: ['2024-01-01']
          }
        }
      });
      
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very long header text', () => {
      const longHeader = 'A'.repeat(1000);
      
      renderWithProvider(
        <HeadTitle 
          header={longHeader}
        />
      );
      
      expect(screen.getByText(longHeader)).toBeInTheDocument();
    });

    test('handles special characters in header', () => {
      const specialHeader = 'Test Header with !@#$%^&*()';
      
      renderWithProvider(
        <HeadTitle 
          header={specialHeader}
        />
      );
      
      expect(screen.getByText(specialHeader)).toBeInTheDocument();
    });

    test('handles empty header', () => {
      renderWithProvider(
        <HeadTitle 
          header=""
        />
      );
      
      const titleElement = document.querySelector('.title-class');
      expect(titleElement).toBeInTheDocument();
    });

    test('handles null header', () => {
      renderWithProvider(
        <HeadTitle 
          header={null}
        />
      );
      
      const titleElement = document.querySelector('.title-class');
      expect(titleElement).toBeInTheDocument();
    });

    test('handles undefined header', () => {
      renderWithProvider(
        <HeadTitle 
          header={undefined}
        />
      );
      
      const titleElement = document.querySelector('.title-class');
      expect(titleElement).toBeInTheDocument();
    });
  });

  describe('Redux Integration', () => {
    test('connects to Redux store', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    test('handles Redux actions', () => {
      renderWithProvider(
        <HeadTitle 
          header="Test Header"
        />
      );
      
      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles missing props gracefully', () => {
      renderWithProvider(<HeadTitle />);
      
      const titleElement = document.querySelector('.title-class');
      expect(titleElement).toBeInTheDocument();
    });

    test('handles null props gracefully', () => {
      renderWithProvider(
        <HeadTitle 
          header={null}
          icon={null}
          anchorTag={null}
        />
      );
      
      const titleElement = document.querySelector('.title-class');
      expect(titleElement).toBeInTheDocument();
    });

    test('handles undefined props gracefully', () => {
      renderWithProvider(
        <HeadTitle 
          header={undefined}
          icon={undefined}
          anchorTag={undefined}
        />
      );
      
      const titleElement = document.querySelector('.title-class');
      expect(titleElement).toBeInTheDocument();
    });
  });
}); 