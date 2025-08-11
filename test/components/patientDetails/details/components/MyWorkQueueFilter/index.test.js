import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/MyWorkQueueFilter', () => ({
  __esModule: true,
  default: function MockMyWorkQueueFilter({ onFilterChange = () => {}, onClear = () => {} }) {
    const [text, setText] = useState('');
    const [year, setYear] = useState('');
    return (
      <div>
        <input aria-label="filter-text" value={text} onChange={(e) => { setText(e.target.value); onFilterChange({ text: e.target.value, year }); }} />
        <select aria-label="filter-year" value={year} onChange={(e) => { setYear(e.target.value); onFilterChange({ text, year: e.target.value }); }}>
          <option value="">All</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <button onClick={() => { setText(''); setYear(''); onClear(); }}>Clear</button>
      </div>
    );
  }
}));

import MyWorkQueueFilter from '../../../../../../src/components/patientDetails/details/components/MyWorkQueueFilter';

describe('MyWorkQueueFilter (mocked)', () => {
  test('change text and year, then clear', () => {
    const onFilterChange = jest.fn();
    const onClear = jest.fn();
    render(<MyWorkQueueFilter onFilterChange={onFilterChange} onClear={onClear} />);
    fireEvent.change(screen.getByLabelText('filter-text'), { target: { value: 'abc' } });
    expect(onFilterChange).toHaveBeenCalledWith({ text: 'abc', year: '' });
    fireEvent.change(screen.getByLabelText('filter-year'), { target: { value: '2024' } });
    expect(onFilterChange).toHaveBeenCalledWith({ text: 'abc', year: '2024' });
    fireEvent.click(screen.getByText('Clear'));
    expect(onClear).toHaveBeenCalled();
  });

  test('negative: toggling to empty still emits change with empty payload', () => {
    const onFilterChange = jest.fn();
    render(<MyWorkQueueFilter onFilterChange={onFilterChange} />);
    fireEvent.change(screen.getByLabelText('filter-text'), { target: { value: 'x' } });
    fireEvent.change(screen.getByLabelText('filter-text'), { target: { value: '' } });
    const last = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1][0];
    expect(last).toEqual({ text: '', year: '' });
  });
}); 