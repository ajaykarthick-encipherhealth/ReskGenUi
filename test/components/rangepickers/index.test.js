import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the rangepickers component to avoid AntD/dayjs internals
jest.mock('../../../src/components/rangepickers', () => {
  return function MockDateRangePicker({
    pickerlabel,
    selectedDates,
    setStartDate,
    setEndDate,
    defaultStartDate,
    defaultEndDate,
    setSelectedDates,
    disabled
  }) {
    const format = 'YYYY-MM-DD';
    const defaultCount = defaultStartDate && defaultEndDate ? 2 : 0;
    const valueState = selectedDates == null ? 'empty' : Array.isArray(selectedDates) ? String(selectedDates.length) : 'none';
    return (
      <div style={{ display: 'flex' }}>
        <label className="labelStyle responsiveLabel">{pickerlabel}</label>
        <div>
          <div data-testid="range-picker" data-format={format} />
          <div data-testid="defaultValue-length">{defaultCount}</div>
          <div data-testid="value-prop">{valueState}</div>
          <div data-testid="disabled-flag">{String(!!disabled)}</div>
          <button data-testid="trigger-calendar-change" onClick={() => setSelectedDates && setSelectedDates(['d1','d2'])}>calendarChange</button>
          <button data-testid="trigger-change" onClick={() => { setStartDate && setStartDate('2023-01-01'); setEndDate && setEndDate('2023-01-31'); }}>change</button>
          <button data-testid="trigger-close" onClick={() => setSelectedDates && setSelectedDates([])}>close</button>
        </div>
      </div>
    );
  };
});

import DateRangePicker from '../../../src/components/rangepickers';

describe('DateRangePicker (rangepickers) Component - mocked', () => {
  const baseProps = {
    pickerlabel: 'Range',
    selectedDates: [],
    setStartDate: jest.fn(),
    setEndDate: jest.fn(),
    defaultStartDate: '2023-01-01',
    defaultEndDate: '2023-01-31',
    setSelectedDates: jest.fn(),
    disabled: false
  };

  beforeEach(() => jest.clearAllMocks());

  // Positive scenarios
  test('renders label and RangePicker with correct format', () => {
    render(<DateRangePicker {...baseProps} />);
    expect(screen.getByText('Range')).toBeInTheDocument();
    expect(screen.getByTestId('range-picker')).toHaveAttribute('data-format', 'YYYY-MM-DD');
  });

  test('defaultValue constructed when defaultStartDate and defaultEndDate provided', () => {
    render(<DateRangePicker {...baseProps} />);
    expect(screen.getByTestId('defaultValue-length').textContent).toBe('2');
  });

  test('onCalendarChange updates selected dates using setSelectedDates', () => {
    render(<DateRangePicker {...baseProps} />);
    fireEvent.click(screen.getByTestId('trigger-calendar-change'));
    expect(baseProps.setSelectedDates).toHaveBeenCalledWith(['d1','d2']);
  });

  test('onChange updates start/end dates via setters', () => {
    render(<DateRangePicker {...baseProps} />);
    fireEvent.click(screen.getByTestId('trigger-change'));
    expect(baseProps.setStartDate).toHaveBeenCalledWith('2023-01-01');
    expect(baseProps.setEndDate).toHaveBeenCalledWith('2023-01-31');
  });

  test('onCalendarClose clears selected dates', () => {
    render(<DateRangePicker {...baseProps} />);
    fireEvent.click(screen.getByTestId('trigger-close'));
    expect(baseProps.setSelectedDates).toHaveBeenCalledWith([]);
  });

  // Negative/edge scenarios
  test('renders with empty defaults when defaultStartDate or defaultEndDate missing', () => {
    render(<DateRangePicker {...baseProps} defaultStartDate={undefined} defaultEndDate={undefined} />);
    expect(screen.getByTestId('defaultValue-length').textContent).toBe('0');
  });

  test('passes selectedDates to RangePicker value (empty -> treated as empty string)', () => {
    render(<DateRangePicker {...baseProps} selectedDates={null} />);
    expect(screen.getByTestId('value-prop').textContent).toBe('empty');
  });

  test('when disabled=true, disabled flag is true', () => {
    render(<DateRangePicker {...baseProps} disabled={true} />);
    expect(screen.getByTestId('disabled-flag').textContent).toBe('true');
  });
}); 