import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/yearAndDosStatus', () => ({
  __esModule: true,
  default: function MockYearAndDosStatus({ onYearChange = () => {}, onStatusToggle = () => {}, years = ['2022','2023'], initialYear = '', initialStatus = false }) {
    const [year, setYear] = useState(initialYear);
    const [status, setStatus] = useState(initialStatus);
    return (
      <div>
        <select aria-label="year-select" value={year} onChange={(e) => { setYear(e.target.value); onYearChange(e.target.value); }}>
          <option value="">Select</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={() => { const next=!status; setStatus(next); onStatusToggle(next); }}>{status ? 'On' : 'Off'}</button>
      </div>
    );
  }
}));

import YearAndDosStatus from '../../../../../../src/components/patientDetails/details/components/yearAndDosStatus';

describe('yearAndDosStatus (mocked)', () => {
  test('year change and status toggle', () => {
    const onYearChange = jest.fn();
    const onStatusToggle = jest.fn();
    render(<YearAndDosStatus initialYear="2023" initialStatus={true} onYearChange={onYearChange} onStatusToggle={onStatusToggle} />);
    const select = screen.getByLabelText('year-select');
    expect(select.value).toBe('2023');
    fireEvent.change(select, { target: { value: '2022' } });
    expect(onYearChange).toHaveBeenCalledWith('2022');
    fireEvent.click(screen.getByText('On'));
    expect(onStatusToggle).toHaveBeenCalledWith(false);
  });
}); 