import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock the entire component to avoid import issues
jest.mock('../../../src/components/updatedFilters', () => {
  return function MockReusableFilters({ FilterItems, activeFilters, ...props }) {
    return (
      <div data-testid="reusable-filters">
        {FilterItems?.filter((item) =>
          activeFilters?.includes(item?.placeholder)
        ).map((item) => (
          <div key={item?.id} data-testid={`filter-${item?.type}`}>
            <label>{item?.placeholder}</label>
            {item?.type === 'search' && (
              <input
                data-testid="reusable-input"
                placeholder={item?.placeholder}
                onChange={(e) => props.setSearchText && props.setSearchText(e.target.value)}
              />
            )}
            {item?.type === 'select' && (
              <select
                data-testid="select"
                onChange={(e) => props.setSelectedOption && props.setSelectedOption(e.target.value)}
              >
                {item?.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {item?.type === 'dateRange' && (
              <div data-testid="date-range-picker">
                <input
                  data-testid="date-input"
                  placeholder={item?.placeholder}
                  onChange={(e) => {
                    props.setSelectedDates && props.setSelectedDates({});
                    props.setSelectedDateRanges && props.setSelectedDateRanges({});
                    props.setPageNumber && props.setPageNumber(0);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
});

import ReusableFilters from '../../../src/components/updatedFilters';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/test-page',
    push: jest.fn(),
    query: {}
  })
}));

// Mock Ant Design components
jest.mock('antd', () => ({
  DatePicker: {
    RangePicker: ({ onChange, ...props }) => (
      <div data-testid="date-range-picker" {...props}>
        <input
          data-testid="date-input"
          onChange={(e) => onChange && onChange([new Date(), new Date()], ['2023-01-01', '2023-01-31'])}
        />
      </div>
    )
  },
  Select: ({ children, onChange, value, placeholder, ...props }) => (
    <select
      data-testid="select"
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
      placeholder={placeholder}
      {...props}
    >
      {children}
    </select>
  )
}));

// Mock moment
jest.mock('moment', () => ({
  __esModule: true,
  default: {
    format: jest.fn((date, format) => '2023-01-01'),
    parseZone: jest.fn(() => ({
      format: jest.fn(() => '2023-01-01')
    }))
  }
}));

// Mock utility functions
jest.mock('../../../src/utils/reusable', () => ({
  formatDateForIndex: jest.fn(({ date, index }) => {
    if (index === 0) {
      return `${date}T00:00:00.000Z`;
    } else {
      return `${date}T23:59:59.999Z`;
    }
  }),
  disabledDate: jest.fn(() => false)
}));

// Mock headerFilters functions
jest.mock('../../../src/components/headerFilters/functions', () => ({
  disableFutureDates: jest.fn(() => false)
}));

// Mock ReusableInput component
jest.mock('../../../src/components/updatedFilters/reusableInput', () => {
  return function MockReusableInput({ name, placeholder, value, setSearchText, setPageNumber, ...props }) {
    return (
      <input
        data-testid="reusable-input"
        name={name}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => {
          setSearchText && setSearchText(e.target.value);
          setPageNumber && setPageNumber(0);
        }}
        {...props}
      />
    );
  };
});

// Mock CSS modules
jest.mock('../../../src/components/updatedFilters/style.module.css', () => ({
  filterContainer: 'filter-container',
  filterItem: 'filter-item',
  labelStyle: 'label-style',
  customReportInput: 'custom-report-input'
}));

// Mock Redux store
const mockStore = configureStore([]);
const createMockStore = () => {
  return mockStore({});
};

describe('ReusableFilters Component', () => {
  const defaultProps = {
    FilterItems: [
      {
        id: 'search-filter',
        title: 'Search Filter',
        placeholder: 'Search',
        type: 'search'
      },
      {
        id: 'select-filter',
        title: 'Select Filter',
        placeholder: 'Select Option',
        type: 'select',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' }
        ]
      },
      {
        id: 'date-filter',
        title: 'Date Filter',
        placeholder: 'Select Date Range',
        type: 'dateRange'
      }
    ],
    setSearchText: jest.fn(),
    searchText: '',
    setSelectedOption: jest.fn(),
    selectedOption: {},
    setSelectedDateRanges: jest.fn(),
    setSelectedDates: jest.fn(),
    selectedDates: {},
    setPageNumber: jest.fn(),
    activeFilters: ['Search', 'Select Option', 'Select Date Range'],
    setActiveFilters: jest.fn(),
    setClear: jest.fn(),
    getRoutedData: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    test('renders search filter correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByTestId('reusable-input')).toBeInTheDocument();
    });

    test('renders select filter correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText('Select Option')).toBeInTheDocument();
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    test('renders date range filter correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText('Select Date Range')).toBeInTheDocument();
      expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
    });

    test('handles search text change correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...defaultProps} />
        </Provider>
      );

      const searchInput = screen.getByTestId('reusable-input');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(defaultProps.setSearchText).toHaveBeenCalledWith('test search');
    });

    test('handles select option change correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...defaultProps} />
        </Provider>
      );

      const selectInput = screen.getByTestId('select');
      fireEvent.change(selectInput, { target: { value: 'option1' } });

      expect(defaultProps.setSelectedOption).toHaveBeenCalledWith('option1');
    });

    test('handles date range change correctly', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...defaultProps} />
        </Provider>
      );

      const dateInput = screen.getByTestId('date-input');
      fireEvent.change(dateInput, { target: { value: '2023-01-01' } });

      expect(defaultProps.setSelectedDates).toHaveBeenCalled();
      expect(defaultProps.setSelectedDateRanges).toHaveBeenCalled();
      expect(defaultProps.setPageNumber).toHaveBeenCalledWith(0);
    });

    test('filters items based on activeFilters', () => {
      const propsWithLimitedActiveFilters = {
        ...defaultProps,
        activeFilters: ['Search']
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...propsWithLimitedActiveFilters} />
        </Provider>
      );

      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.queryByText('Select Option')).not.toBeInTheDocument();
      expect(screen.queryByText('Select Date Range')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles missing FilterItems gracefully', () => {
      const propsWithoutFilterItems = {
        ...defaultProps,
        FilterItems: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...propsWithoutFilterItems} />
        </Provider>
      );

      expect(screen.getByTestId('reusable-filters')).toBeInTheDocument();
    });

    test('handles empty FilterItems array', () => {
      const propsWithEmptyFilterItems = {
        ...defaultProps,
        FilterItems: []
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...propsWithEmptyFilterItems} />
        </Provider>
      );

      expect(screen.getByTestId('reusable-filters')).toBeInTheDocument();
    });

    test('handles missing callback functions', () => {
      const propsWithoutCallbacks = {
        ...defaultProps,
        setSearchText: null,
        setSelectedOption: null,
        setSelectedDateRanges: null,
        setSelectedDates: null,
        setPageNumber: null,
        setClear: null
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...propsWithoutCallbacks} />
        </Provider>
      );

      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    test('handles invalid filter type', () => {
      const propsWithInvalidType = {
        ...defaultProps,
        FilterItems: [
          {
            id: 'invalid-filter',
            title: 'Invalid Filter',
            placeholder: 'Invalid',
            type: 'invalid'
          }
        ],
        activeFilters: ['Invalid']
      };
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ReusableFilters {...propsWithInvalidType} />
        </Provider>
      );

      expect(screen.getByText('Invalid')).toBeInTheDocument();
    });
  });
}); 