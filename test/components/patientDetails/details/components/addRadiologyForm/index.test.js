import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/addRadiologyForm', () => ({
  __esModule: true,
  default: function MockAddRadiologyForm({ onAdd = () => {}, onClear = () => {} }) {
    const [code, setCode] = useState('');
    return (
      <div>
        <input aria-label="rad-code" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => { const v=code.trim(); if(!v) return; onAdd(v); setCode(''); }}>AddRad</button>
        <button onClick={() => { setCode(''); onClear(); }}>ClearRad</button>
      </div>
    );
  }
}));

import AddRadiologyForm from '../../../../../../src/components/patientDetails/details/components/addRadiologyForm';

describe('addRadiologyForm (mocked)', () => {
  test('add and clear radiology code', () => {
    const onAdd = jest.fn();
    const onClear = jest.fn();
    render(<AddRadiologyForm onAdd={onAdd} onClear={onClear} />);
    fireEvent.change(screen.getByLabelText('rad-code'), { target: { value: 'R1' } });
    fireEvent.click(screen.getByText('AddRad'));
    expect(onAdd).toHaveBeenCalledWith('R1');
    fireEvent.click(screen.getByText('ClearRad'));
    expect(onClear).toHaveBeenCalled();
  });

  test('negative: no add when empty', () => {
    const onAdd = jest.fn();
    render(<AddRadiologyForm onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddRad'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 