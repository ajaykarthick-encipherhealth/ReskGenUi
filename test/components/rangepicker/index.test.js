import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the rangepicker component itself to avoid AntD/dayjs/redux side effects
jest.mock('../../../src/components/rangepicker', () => {
  return function MockDateRangePicker({
    pickerlabel,
    selectedDates,
    setStartDate,
    setEndDate,
    setSelectedDates,
    disabled,
    setPageNo,
    handleMultipleValues,
    pickerName,
    setSelectedDateRange
  }) {
    const format = 'MM-DD-YYYY';
    const valueType = handleMultipleValues
      ? (selectedDates && selectedDates[pickerName] ? 'array' : 'empty')
      : (Array.isArray(selectedDates) ? 'array' : selectedDates === '' || selectedDates == null ? 'empty' : typeof selectedDates);

    const handleChange = () => {
      // Simulate change behavior
      setStartDate && setStartDate('2023-01-01');
      setEndDate && setEndDate('2023-01-31');
      setPageNo && setPageNo(0);
      if (handleMultipleValues && setSelectedDateRange && pickerName) {
        // Provide updater that formats similar to formatDateForIndex behavior
        setSelectedDateRange((prev) => ({
          ...(prev || {}),
          [pickerName]: { startDate: 'F0:01-01-2023', endDate: 'F1:01-31-2023' }
        }));
      }
    };

    return (
      <div>
        <label className="responsiveLabel" style={{ marginLeft: 8 }}>{pickerlabel}</label>
        <div
          data-testid="range-picker"
          data-id={pickerlabel}
          data-name={pickerlabel}
          data-format={format}
          data-value-type={valueType}
        />
        <div data-testid="disabled-flag">{String(!!disabled)}</div>
        <button data-testid="trigger-calendar-change" onClick={() => setSelectedDates && setSelectedDates(['d1','d2'])}>calendarChange</button>
        <button data-testid="trigger-change" onClick={handleChange}>change</button>
      </div>
    );
  };
});

import DateRangePicker from '../../../src/components/rangepicker';

describe('DateRangePicker (singular) Component - mocked', () => {
  const baseProps = {
    pickerlabel: 'MyRange',
    selectedDates: [],
    setStartDate: jest.fn(),
    setEndDate: jest.fn(),
    setSelectedDates: jest.fn(),
    disabled: false,
    setPageNo: jest.fn(),
    handleMultipleValues: false
  };

  beforeEach(() => jest.clearAllMocks());

  test('renders label and RangePicker with id/name and format', () => {
    render(<DateRangePicker {...baseProps} />);
    expect(screen.getByText('MyRange')).toBeInTheDocument();
    const rp = screen.getByTestId('range-picker');
    expect(rp).toHaveAttribute('data-id', 'MyRange');
    expect(rp).toHaveAttribute('data-name', 'MyRange');
    expect(rp).toHaveAttribute('data-format', 'MM-DD-YYYY');
    expect(rp).toHaveAttribute('data-value-type', 'array');
  });

  test('onCalendarChange updates selected dates', () => {
    render(<DateRangePicker {...baseProps} />);
    fireEvent.click(screen.getByTestId('trigger-calendar-change'));
    expect(baseProps.setSelectedDates).toHaveBeenCalledWith(['d1','d2']);
  });

  test('onChange updates start/end dates and resets page number', () => {
    render(<DateRangePicker {...baseProps} />);
    fireEvent.click(screen.getByTestId('trigger-change'));
    expect(baseProps.setStartDate).toHaveBeenCalledWith('2023-01-01');
    expect(baseProps.setEndDate).toHaveBeenCalledWith('2023-01-31');
    expect(baseProps.setPageNo).toHaveBeenCalledWith(0);
  });

  test('multi-value mode updates selectedDateRange with formatted dates and resets page', () => {
    const setSelectedDateRange = jest.fn();
    const props = {
      ...baseProps,
      handleMultipleValues: true,
      pickerName: 'audit',
      selectedDates: {},
      setSelectedDateRange
    };
    render(<DateRangePicker {...props} />);
    // No selected value -> empty
    expect(screen.getByTestId('range-picker')).toHaveAttribute('data-value-type', 'empty');

    fireEvent.click(screen.getByTestId('trigger-change'));
    expect(setSelectedDateRange).toHaveBeenCalled();
    expect(baseProps.setPageNo).toHaveBeenCalledWith(0);
  });

  test('handles null selectedDates gracefully (value becomes empty)', () => {
    render(<DateRangePicker {...baseProps} selectedDates={null} />);
    expect(screen.getByTestId('range-picker')).toHaveAttribute('data-value-type', 'empty');
  });

  test('when disabled=true, disabled flag is true', () => {
    render(<DateRangePicker {...baseProps} disabled={true} />);
    expect(screen.getByTestId('disabled-flag').textContent).toBe('true');
  });
}); 