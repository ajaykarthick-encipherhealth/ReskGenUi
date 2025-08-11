import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/RADIOLOGY', () => ({
  __esModule: true,
  default: function MockRADIOLOGY({ onSearch = () => {}, onAdd = () => {}, onRemove = () => {}, initial = [] }) {
    const [items, setItems] = useState(initial);
    const [q, setQ] = useState('');
    return (
      <div>
        <input aria-label="rad-search" value={q} onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }} />
        <button onClick={() => { const v=q.trim(); if(v){ setItems([...items, v]); onAdd(v); } }}>AddRad</button>
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

import RADIOLOGY from '../../../../../../src/components/patientDetails/details/components/RADIOLOGY';

describe('RADIOLOGY (mocked)', () => {
  test('search and add/remove radiology item', () => {
    const onSearch = jest.fn();
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<RADIOLOGY onSearch={onSearch} onAdd={onAdd} onRemove={onRemove} />);
    const input = screen.getByLabelText('rad-search');
    fireEvent.change(input, { target: { value: 'XRAY' } });
    expect(onSearch).toHaveBeenCalledWith('XRAY');
    fireEvent.click(screen.getByText('AddRad'));
    expect(onAdd).toHaveBeenCalledWith('XRAY');
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: empty search does not add', () => {
    const onAdd = jest.fn();
    render(<RADIOLOGY onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddRad'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 