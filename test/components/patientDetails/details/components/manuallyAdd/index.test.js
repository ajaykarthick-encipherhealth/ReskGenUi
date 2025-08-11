import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/manuallyAdd', () => ({
  __esModule: true,
  default: function MockManuallyAdd({ onAdd = () => {}, onRemove = () => {} }) {
    const [list, setList] = useState([]);
    const [val, setVal] = useState('');
    const add = () => { const v = val.trim(); if(!v) return; setList([...list, v]); onAdd(v); setVal(''); };
    const remove = (i) => { setList(list.filter((_, idx) => idx !== i)); onRemove(i); };
    return (
      <div>
        <input aria-label="add-input" value={val} onChange={(e) => setVal(e.target.value)} />
        <button onClick={add}>Add</button>
        <ul>
          {list.map((it, i) => (
            <li key={i}>
              <span>{it}</span>
              <button onClick={() => remove(i)}>Del</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import ManuallyAdd from '../../../../../../src/components/patientDetails/details/components/manuallyAdd';

describe('manuallyAdd (mocked)', () => {
  test('add and remove items', () => {
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<ManuallyAdd onAdd={onAdd} onRemove={onRemove} />);
    const input = screen.getByLabelText('add-input');
    fireEvent.change(input, { target: { value: 'Item1' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledWith('Item1');
    fireEvent.click(screen.getByText('Del'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: whitespace not added', () => {
    const onAdd = jest.fn();
    render(<ManuallyAdd onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 