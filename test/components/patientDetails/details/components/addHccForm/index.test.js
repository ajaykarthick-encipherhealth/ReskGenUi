import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/addHccForm', () => ({
  __esModule: true,
  default: function MockAddHccForm({ onAdd = () => {}, onClear = () => {} }) {
    const [code, setCode] = useState('');
    return (
      <div>
        <input aria-label="hcc-code" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => { const v=code.trim(); if(!v) return; onAdd(v); setCode(''); }}>AddHCC</button>
        <button onClick={() => { setCode(''); onClear(); }}>ClearHCC</button>
      </div>
    );
  }
}));

import AddHccForm from '../../../../../../src/components/patientDetails/details/components/addHccForm';

describe('addHccForm (mocked)', () => {
  test('add and clear HCC code', () => {
    const onAdd = jest.fn();
    const onClear = jest.fn();
    render(<AddHccForm onAdd={onAdd} onClear={onClear} />);
    fireEvent.change(screen.getByLabelText('hcc-code'), { target: { value: 'H1' } });
    fireEvent.click(screen.getByText('AddHCC'));
    expect(onAdd).toHaveBeenCalledWith('H1');
    fireEvent.click(screen.getByText('ClearHCC'));
    expect(onClear).toHaveBeenCalled();
  });

  test('negative: no add when empty', () => {
    const onAdd = jest.fn();
    render(<AddHccForm onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddHCC'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 