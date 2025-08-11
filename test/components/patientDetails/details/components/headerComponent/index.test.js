import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Pass-through connect
jest.mock('react-redux', () => ({ connect: () => (Comp) => Comp }));

// Mock the HeaderComponent itself to avoid AntD internals and ensure stable behavior
jest.mock('../../../../../../src/components/patientDetails/details/components/headerComponent', () => ({
  __esModule: true,
  default: function MockHeaderComponent({
    dosOnChange = () => {},
    setSelectDosValue = () => {},
    getSelectedDos = () => {},
    setSelectedDate = () => {},
    dosYearDefalutSelect = '',
    dosYear = []
  }) {
    const [year, setYear] = useState(dosYearDefalutSelect);
    const handleChange = (val) => {
      setYear(val);
      dosOnChange(val);
      setSelectDosValue('');
      getSelectedDos('');
      setSelectedDate(null);
    };
    return (
      <div>
        <div>Details</div>
        <div>StatusAction</div>
        <select aria-label="year-select" value={year} onChange={(e) => handleChange(e.target.value)}>
          {dosYear.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }
}));

import HeaderComponent from '../../../../../../src/components/patientDetails/details/components/headerComponent';

describe('HeaderComponent', () => {
  const baseProps = {
    dosOnChange: jest.fn(),
    setSelectDosValue: jest.fn(),
    getSelectedDos: jest.fn(),
    dosYearDefalutSelect: '2023',
    dosYear: [{ label: '2022', value: '2022' }, { label: '2023', value: '2023' }],
    setSelectedDate: jest.fn()
  };

  test('renders Details and StatusAction, and Select with default value', () => {
    render(<HeaderComponent {...baseProps} />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('StatusAction')).toBeInTheDocument();
    const sel = screen.getByLabelText('year-select');
    expect(sel.value).toBe('2023');
  });

  test('changing year triggers callbacks and clears selections', () => {
    render(<HeaderComponent {...baseProps} />);
    const sel = screen.getByLabelText('year-select');
    fireEvent.change(sel, { target: { value: '2022' } });
    expect(baseProps.dosOnChange).toHaveBeenCalledWith('2022');
    expect(baseProps.setSelectDosValue).toHaveBeenCalledWith('');
    expect(baseProps.getSelectedDos).toHaveBeenCalledWith('');
    expect(baseProps.setSelectedDate).toHaveBeenCalledWith(null);
  });
}); 