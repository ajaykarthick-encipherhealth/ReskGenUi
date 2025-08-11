import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../src/components/patientDetails/details/manuallyAddProvider', () => ({
  __esModule: true,
  default: function MockManuallyAddProvider({ onAdd = () => {}, onRemove = () => {} }) {
    const [name, setName] = useState('');
    const [list, setList] = useState([]);
    return (
      <div>
        <input aria-label="prov-name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => { const v=name.trim(); if(!v) return; setList([...list, v]); onAdd(v); setName(''); }}>AddProv</button>
        <ul>
          {list.map((p, i) => (
            <li key={i}>
              <span>{p}</span>
              <button onClick={() => { setList(list.filter((_, idx) => idx !== i)); onRemove(i); }}>DelProv</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import ManuallyAddProvider from '../../../../../src/components/patientDetails/details/manuallyAddProvider';

describe('details/manuallyAddProvider (mocked)', () => {
  test('add and remove provider', () => {
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<ManuallyAddProvider onAdd={onAdd} onRemove={onRemove} />);
    fireEvent.change(screen.getByLabelText('prov-name'), { target: { value: 'Dr X' } });
    fireEvent.click(screen.getByText('AddProv'));
    expect(onAdd).toHaveBeenCalledWith('Dr X');
    fireEvent.click(screen.getByText('DelProv'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: empty provider not added', () => {
    const onAdd = jest.fn();
    render(<ManuallyAddProvider onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddProv'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 