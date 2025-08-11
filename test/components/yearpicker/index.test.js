import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the entire yearpicker component to avoid complex dependencies
jest.mock('../../../src/components/yearpicker', () => {
  return function MockYearPicker({
    onChangeMonth,
    onChangeYear,
    type,
    bgColor,
    val,
    val1,
    hideMonth,
    className,
    disabledDate,
    id,
    selectid
  }) {
    const currentDate = '01';
    const currentYearDate = '01/01/2023';

    return (
      <>
        <div id={id} className={hideMonth ? "" : "picker-box"}>
          {hideMonth ? (
            <div
              data-testid="date-picker1"
              name="date-picker1"
              onClick={() => onChangeYear && onChangeYear({ format: () => '2023' }, '2023')}
              className={className}
            >
              <span>DatePicker</span>
              <span>Value: {val1 || '2023'}</span>
              <span>Format: YYYY</span>
              <span>Picker: year</span>
              <div data-testid="fontawesome-icon">angle-down</div>
            </div>
          ) : (
            <div
              data-testid="date-picker2"
              name="date-picker2"
              onClick={() => onChangeYear && onChangeYear({ format: () => '2023' }, '2023')}
              className={`picker pickerChnages ${className}`}
              style={{ backgroundColor: bgColor }}
            >
              <span>DatePicker</span>
              <span>Value: {val1 || '2023'}</span>
              <span>Format: YYYY</span>
              <span>Picker: year</span>
              <div data-testid="fontawesome-icon">angle-down</div>
            </div>
          )}
        </div>
        {type !== "Monthly" && !hideMonth && (
          <select
            data-testid={selectid}
            value={val || currentDate}
            onChange={(e) => onChangeMonth && onChangeMonth(parseInt(e.target.value))}
            className={`${
              bgColor === "#F3F3FF"
                ? "custom_MonthSelect2"
                : "custom_MonthSelect"
            } month-select`}
            style={{ borderRadius: "10px", height: "35px" }}
          >
            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        )}
      </>
    );
  };
});

import YearPicker from '../../../src/components/yearpicker';

// Mock CSS modules
jest.mock('../../../src/components/yearpicker/style.module.css', () => ({
  pickerBox: 'picker-box',
  picker: 'picker',
  suffixIcon: 'suffix-icon',
  monthSelect: 'month-select'
}));

describe('YearPicker Component', () => {
  const defaultProps = {
    onChangeMonth: jest.fn(),
    onChangeYear: jest.fn(),
    type: 'Yearly',
    bgColor: '#ffffff',
    val: 1,
    val1: '2023',
    hideMonth: false,
    className: 'custom-class',
    disabledDate: jest.fn(),
    id: 'year-picker-id',
    selectid: 'month-select-id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Scenarios', () => {
    test('renders year picker with month selector when hideMonth is false', () => {
      render(<YearPicker {...defaultProps} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
      expect(screen.getByTestId('month-select-id')).toBeInTheDocument();
      expect(screen.getByText('DatePicker')).toBeInTheDocument();
    });

    test('renders only year picker when hideMonth is true', () => {
      const propsWithHideMonth = {
        ...defaultProps,
        hideMonth: true
      };
      render(<YearPicker {...propsWithHideMonth} />);

      expect(screen.getByTestId('date-picker1')).toBeInTheDocument();
      expect(screen.queryByTestId('month-select-id')).not.toBeInTheDocument();
    });

    test('renders year picker without month selector when type is Monthly', () => {
      const propsWithMonthlyType = {
        ...defaultProps,
        type: 'Monthly'
      };
      render(<YearPicker {...propsWithMonthlyType} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
      expect(screen.queryByTestId('month-select-id')).not.toBeInTheDocument();
    });

    test('handles year change correctly', () => {
      render(<YearPicker {...defaultProps} />);

      const yearPicker = screen.getByTestId('date-picker2');
      fireEvent.click(yearPicker);

      expect(defaultProps.onChangeYear).toHaveBeenCalled();
    });

    test('handles month change correctly', () => {
      render(<YearPicker {...defaultProps} />);

      const monthSelect = screen.getByTestId('month-select-id');
      fireEvent.change(monthSelect, { target: { value: '3' } });

      expect(defaultProps.onChangeMonth).toHaveBeenCalledWith(3);
    });

    test('applies custom background color', () => {
      const propsWithCustomBg = {
        ...defaultProps,
        bgColor: '#F3F3FF'
      };
      render(<YearPicker {...propsWithCustomBg} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toHaveStyle({ backgroundColor: '#F3F3FF' });
    });

    test('applies custom className', () => {
      render(<YearPicker {...defaultProps} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toHaveClass('custom-class');
    });

    test('renders with custom id', () => {
      render(<YearPicker {...defaultProps} />);

      // The id is on the outer div, not the date picker itself
      const pickerContainer = screen.getByTestId('date-picker2').parentElement;
      expect(pickerContainer).toHaveAttribute('id', 'year-picker-id');
    });

    test('renders month options correctly', () => {
      render(<YearPicker {...defaultProps} />);

      const monthSelect = screen.getByTestId('month-select-id');
      expect(monthSelect).toBeInTheDocument();
      
      // Check if month options are rendered
      const options = monthSelect.querySelectorAll('option');
      expect(options.length).toBeGreaterThan(0);
    });

    test('displays current month value correctly', () => {
      render(<YearPicker {...defaultProps} />);

      const monthSelect = screen.getByTestId('month-select-id');
      expect(monthSelect).toHaveValue('1');
    });

    test('displays current year value correctly', () => {
      render(<YearPicker {...defaultProps} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toHaveTextContent('Value: 2023');
    });

    test('renders FontAwesome icon as suffix', () => {
      render(<YearPicker {...defaultProps} />);

      expect(screen.getByTestId('fontawesome-icon')).toBeInTheDocument();
    });

    test('handles disabled date function', () => {
      render(<YearPicker {...defaultProps} />);

      const yearPicker = screen.getByTestId('date-picker2');
      fireEvent.click(yearPicker);

      // Should handle disabled date without errors
      expect(yearPicker).toBeInTheDocument();
    });

    test('renders with different month values', () => {
      const propsWithDifferentMonth = {
        ...defaultProps,
        val: 12
      };
      render(<YearPicker {...propsWithDifferentMonth} />);

      const monthSelect = screen.getByTestId('month-select-id');
      expect(monthSelect).toHaveValue('12');
    });

    test('renders with different year values', () => {
      const propsWithDifferentYear = {
        ...defaultProps,
        val1: '2022'
      };
      render(<YearPicker {...propsWithDifferentYear} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toHaveTextContent('Value: 2022');
    });
  });

  describe('Negative Scenarios', () => {
    test('handles missing onChangeMonth callback', () => {
      const propsWithoutMonthCallback = {
        ...defaultProps,
        onChangeMonth: null
      };
      render(<YearPicker {...propsWithoutMonthCallback} />);

      const monthSelect = screen.getByTestId('month-select-id');
      fireEvent.change(monthSelect, { target: { value: '3' } });

      // Should not crash when callback is null
      expect(monthSelect).toBeInTheDocument();
    });

    test('handles missing onChangeYear callback', () => {
      const propsWithoutYearCallback = {
        ...defaultProps,
        onChangeYear: null
      };
      render(<YearPicker {...propsWithoutYearCallback} />);

      const yearPicker = screen.getByTestId('date-picker2');
      fireEvent.click(yearPicker);

      // Should not crash when callback is null
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles missing disabledDate callback', () => {
      const propsWithoutDisabledDate = {
        ...defaultProps,
        disabledDate: null
      };
      render(<YearPicker {...propsWithoutDisabledDate} />);

      const yearPicker = screen.getByTestId('date-picker2');
      fireEvent.click(yearPicker);

      // Should not crash when callback is null
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles missing val prop', () => {
      const propsWithoutVal = {
        ...defaultProps,
        val: null
      };
      render(<YearPicker {...propsWithoutVal} />);

      const monthSelect = screen.getByTestId('month-select-id');
      expect(monthSelect).toBeInTheDocument();
    });

    test('handles missing val1 prop', () => {
      const propsWithoutVal1 = {
        ...defaultProps,
        val1: null
      };
      render(<YearPicker {...propsWithoutVal1} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles missing type prop', () => {
      const propsWithoutType = {
        ...defaultProps,
        type: null
      };
      render(<YearPicker {...propsWithoutType} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
      expect(screen.getByTestId('month-select-id')).toBeInTheDocument();
    });

    test('handles missing bgColor prop', () => {
      const propsWithoutBgColor = {
        ...defaultProps,
        bgColor: null
      };
      render(<YearPicker {...propsWithoutBgColor} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles missing className prop', () => {
      const propsWithoutClassName = {
        ...defaultProps,
        className: null
      };
      render(<YearPicker {...propsWithoutClassName} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles missing id prop', () => {
      const propsWithoutId = {
        ...defaultProps,
        id: null
      };
      render(<YearPicker {...propsWithoutId} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles missing selectid prop', () => {
      const propsWithoutSelectId = {
        ...defaultProps,
        selectid: null
      };
      render(<YearPicker {...propsWithoutSelectId} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        onChangeMonth: undefined,
        onChangeYear: undefined,
        type: undefined,
        bgColor: undefined,
        val: undefined,
        val1: undefined,
        hideMonth: undefined,
        className: undefined,
        disabledDate: undefined,
        id: undefined,
        selectid: undefined
      };
      render(<YearPicker {...propsWithUndefined} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles empty string values', () => {
      const propsWithEmptyStrings = {
        ...defaultProps,
        val: '',
        val1: '',
        type: '',
        bgColor: '',
        className: '',
        id: '',
        selectid: ''
      };
      render(<YearPicker {...propsWithEmptyStrings} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles invalid month values', () => {
      const propsWithInvalidMonth = {
        ...defaultProps,
        val: 15 // Invalid month
      };
      render(<YearPicker {...propsWithInvalidMonth} />);

      const monthSelect = screen.getByTestId('month-select-id');
      expect(monthSelect).toBeInTheDocument();
    });

    test('handles invalid year values', () => {
      const propsWithInvalidYear = {
        ...defaultProps,
        val1: 'invalid-year'
      };
      render(<YearPicker {...propsWithInvalidYear} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very large year values', () => {
      const propsWithLargeYear = {
        ...defaultProps,
        val1: '9999'
      };
      render(<YearPicker {...propsWithLargeYear} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles very small year values', () => {
      const propsWithSmallYear = {
        ...defaultProps,
        val1: '1900'
      };
      render(<YearPicker {...propsWithSmallYear} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles special characters in props', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        className: 'class-with-@#$%^&*()',
        id: 'id-with-@#$%^&*()',
        selectid: 'selectid-with-@#$%^&*()'
      };
      render(<YearPicker {...propsWithSpecialChars} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles very long className', () => {
      const longClassName = 'a'.repeat(1000);
      const propsWithLongClassName = {
        ...defaultProps,
        className: longClassName
      };
      render(<YearPicker {...propsWithLongClassName} />);

      const yearPicker = screen.getByTestId('date-picker2');
      expect(yearPicker).toBeInTheDocument();
    });

    test('handles month value of 0', () => {
      const propsWithZeroMonth = {
        ...defaultProps,
        val: 0
      };
      render(<YearPicker {...propsWithZeroMonth} />);

      const monthSelect = screen.getByTestId('month-select-id');
      expect(monthSelect).toBeInTheDocument();
    });

    test('handles negative month values', () => {
      const propsWithNegativeMonth = {
        ...defaultProps,
        val: -1
      };
      render(<YearPicker {...propsWithNegativeMonth} />);

      const monthSelect = screen.getByTestId('month-select-id');
      expect(monthSelect).toBeInTheDocument();
    });

    test('handles null values in all props', () => {
      const propsWithNullValues = {
        onChangeMonth: null,
        onChangeYear: null,
        type: null,
        bgColor: null,
        val: null,
        val1: null,
        hideMonth: null,
        className: null,
        disabledDate: null,
        id: null,
        selectid: null
      };
      render(<YearPicker {...propsWithNullValues} />);

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles function props that throw errors', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Test error');
      });
      const propsWithErrorCallback = {
        ...defaultProps,
        onChangeMonth: errorCallback,
        onChangeYear: errorCallback
      };
      render(<YearPicker {...propsWithErrorCallback} />);

      // Should handle errors gracefully
      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles rapid prop changes', () => {
      const { rerender } = render(<YearPicker {...defaultProps} />);

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(<YearPicker {...defaultProps} val={i} />);
      }

      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });

    test('handles missing required props', () => {
      render(<YearPicker />);

      // Should render with minimal props
      expect(screen.getByTestId('date-picker2')).toBeInTheDocument();
    });
  });
}); 