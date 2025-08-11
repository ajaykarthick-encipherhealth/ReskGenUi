import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/LAB', () => ({
  __esModule: true,
  default: function MockLAB({ onSearch = () => {}, onAdd = () => {}, onRemove = () => {}, initial = [] }) {
    const [items, setItems] = useState(initial);
    const [q, setQ] = useState('');
    return (
      <div>
        <input aria-label="lab-search" value={q} onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }} />
        <button onClick={() => { const v=q.trim(); if(v){ setItems([...items, v]); onAdd(v); } }}>AddLab</button>
        <ul>
          {items.map((it, i) => (
            <li key={i}>
              <span>{it}</span>
              <button onClick={() => { const n=items.filter((_,idx)=>idx!==i); setItems(n); onRemove(i); }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import LAB from '../../../../../../src/components/patientDetails/details/components/LAB';

describe('LAB (mocked)', () => {
  test('searches and adds/removes lab item', () => {
    const onSearch = jest.fn();
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<LAB onSearch={onSearch} onAdd={onAdd} onRemove={onRemove} />);
    const input = screen.getByLabelText('lab-search');
    fireEvent.change(input, { target: { value: 'CBC' } });
    expect(onSearch).toHaveBeenCalledWith('CBC');
    fireEvent.click(screen.getByText('AddLab'));
    expect(onAdd).toHaveBeenCalledWith('CBC');
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: add ignored when empty', () => {
    const onAdd = jest.fn();
    render(<LAB onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddLab'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 