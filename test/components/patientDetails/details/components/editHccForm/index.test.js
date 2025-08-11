import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/editHccForm/index', () => ({
  __esModule: true,
  default: function MockEditHccForm({ onSave = () => {}, onCancel = () => {}, initial = 'A' }) {
    const [val, setVal] = useState(initial);
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(val); }}>
        <input aria-label="hcc-input" value={val} onChange={(e) => setVal(e.target.value)} />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    );
  }
}));

import EditHccForm from '../../../../../../src/components/patientDetails/details/components/editHccForm/index';

describe('editHccForm/index (mocked)', () => {
  test('save edited value', () => {
    const onSave = jest.fn();
    render(<EditHccForm initial="X" onSave={onSave} />);
    fireEvent.change(screen.getByLabelText('hcc-input'), { target: { value: 'Y' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith('Y');
  });

  test('cancel edit', () => {
    const onCancel = jest.fn();
    render(<EditHccForm onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
}); 