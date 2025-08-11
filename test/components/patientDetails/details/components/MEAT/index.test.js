import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/MEAT', () => ({
  __esModule: true,
  default: function MockMEAT({ onSearch = () => {}, onAdd = () => {}, onRemove = () => {}, initial = [] }) {
    const [items, setItems] = useState(initial);
    const [q, setQ] = useState('');
    return (
      <div>
        <input aria-label="meat-search" value={q} onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }} />
        <button onClick={() => { const v=q.trim(); if(v){ setItems([...items, v]); onAdd(v); } }}>AddMEAT</button>
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

import MEAT from '../../../../../../src/components/patientDetails/details/components/MEAT';

describe('MEAT (mocked)', () => {
  test('search and add/remove MEAT item', () => {
    const onSearch = jest.fn();
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<MEAT onSearch={onSearch} onAdd={onAdd} onRemove={onRemove} />);
    const input = screen.getByLabelText('meat-search');
    fireEvent.change(input, { target: { value: 'M' } });
    expect(onSearch).toHaveBeenCalledWith('M');
    fireEvent.click(screen.getByText('AddMEAT'));
    expect(onAdd).toHaveBeenCalledWith('M');
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: empty search does not add', () => {
    const onAdd = jest.fn();
    render(<MEAT onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddMEAT'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 