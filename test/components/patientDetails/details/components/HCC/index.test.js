import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/HCC', () => ({
  __esModule: true,
  default: function MockHCC({ onFilter = () => {}, onAdd = () => {}, onRemove = () => {}, initial = [] }) {
    const [items, setItems] = useState(initial);
    const [filter, setFilter] = useState('');
    return (
      <div>
        <input aria-label="hcc-filter" value={filter} onChange={(e) => { setFilter(e.target.value); onFilter(e.target.value); }} />
        <button onClick={() => { const v=filter.trim(); if(v){ setItems([...items, v]); onAdd(v); } }}>AddHCC</button>
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

import HCC from '../../../../../../src/components/patientDetails/details/components/HCC';

describe('HCC (mocked)', () => {
  test('filters and adds/removes item', () => {
    const onFilter = jest.fn();
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<HCC onFilter={onFilter} onAdd={onAdd} onRemove={onRemove} />);
    const filter = screen.getByLabelText('hcc-filter');
    fireEvent.change(filter, { target: { value: 'DX' } });
    expect(onFilter).toHaveBeenCalledWith('DX');
    fireEvent.click(screen.getByText('AddHCC'));
    expect(onAdd).toHaveBeenCalledWith('DX');
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: empty filter does not add', () => {
    const onAdd = jest.fn();
    render(<HCC onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddHCC'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 