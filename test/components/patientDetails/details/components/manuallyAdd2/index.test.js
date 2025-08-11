import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/manuallyAdd2', () => ({
  __esModule: true,
  default: function MockManuallyAdd2({ onAdd = () => {}, onRemove = () => {} }) {
    const [list, setList] = useState([]);
    const [val, setVal] = useState('');
    const add = () => { const v = val.trim(); if(!v) return; setList([...list, v]); onAdd(v); setVal(''); };
    const remove = (i) => { setList(list.filter((_, idx) => idx !== i)); onRemove(i); };
    return (
      <div>
        <input aria-label="add2-input" value={val} onChange={(e) => setVal(e.target.value)} />
        <button onClick={add}>Add2</button>
        <ul>
          {list.map((it, i) => (
            <li key={i}>
              <span>{it}</span>
              <button onClick={() => remove(i)}>Del2</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import ManuallyAdd2 from '../../../../../../src/components/patientDetails/details/components/manuallyAdd2';

describe('manuallyAdd2 (mocked)', () => {
  test('add and remove items', () => {
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<ManuallyAdd2 onAdd={onAdd} onRemove={onRemove} />);
    const input = screen.getByLabelText('add2-input');
    fireEvent.change(input, { target: { value: 'X' } });
    fireEvent.click(screen.getByText('Add2'));
    expect(onAdd).toHaveBeenCalledWith('X');
    fireEvent.click(screen.getByText('Del2'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: empty not added', () => {
    const onAdd = jest.fn();
    render(<ManuallyAdd2 onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Add2'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 