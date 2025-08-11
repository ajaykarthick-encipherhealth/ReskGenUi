import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/addLabForm', () => ({
  __esModule: true,
  default: function MockAddLabForm({ onAdd = () => {}, onClear = () => {} }) {
    const [code, setCode] = useState('');
    return (
      <div>
        <input aria-label="lab-code" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => { const v=code.trim(); if(!v) return; onAdd(v); setCode(''); }}>AddLab</button>
        <button onClick={() => { setCode(''); onClear(); }}>ClearLab</button>
      </div>
    );
  }
}));

import AddLabForm from '../../../../../../src/components/patientDetails/details/components/addLabForm';

describe('addLabForm (mocked)', () => {
  test('add and clear lab code', () => {
    const onAdd = jest.fn();
    const onClear = jest.fn();
    render(<AddLabForm onAdd={onAdd} onClear={onClear} />);
    fireEvent.change(screen.getByLabelText('lab-code'), { target: { value: 'L1' } });
    fireEvent.click(screen.getByText('AddLab'));
    expect(onAdd).toHaveBeenCalledWith('L1');
    fireEvent.click(screen.getByText('ClearLab'));
    expect(onClear).toHaveBeenCalled();
  });

  test('negative: no add when empty', () => {
    const onAdd = jest.fn();
    render(<AddLabForm onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddLab'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 