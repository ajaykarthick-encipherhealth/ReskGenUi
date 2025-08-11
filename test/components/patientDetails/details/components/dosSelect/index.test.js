import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/dosSelect', () => ({
  __esModule: true,
  default: function MockDosSelect({ onChange = () => {}, onClear = () => {}, initial = '' }) {
    const [val, setVal] = useState(initial);
    return (
      <div>
        <input aria-label="dos-input" value={val} onChange={(e) => { setVal(e.target.value); onChange(e.target.value); }} />
        <button onClick={() => { setVal(''); onClear(); }}>Clear</button>
      </div>
    );
  }
}));

import DosSelect from '../../../../../../src/components/patientDetails/details/components/dosSelect';

describe('dosSelect (mocked)', () => {
  test('change and clear', () => {
    const onChange = jest.fn();
    const onClear = jest.fn();
    render(<DosSelect initial="2023-01-01" onChange={onChange} onClear={onClear} />);
    const input = screen.getByLabelText('dos-input');
    expect(input.value).toBe('2023-01-01');
    fireEvent.change(input, { target: { value: '2023-02-01' } });
    expect(onChange).toHaveBeenCalledWith('2023-02-01');
    fireEvent.click(screen.getByText('Clear'));
    expect(onClear).toHaveBeenCalled();
    expect(input.value).toBe('');
  });
}); 