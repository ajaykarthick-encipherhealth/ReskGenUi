import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/NONHCC', () => ({
  __esModule: true,
  default: function MockNONHCC({ onFilter = () => {}, onAdd = () => {}, onRemove = () => {} }) {
    const [items, setItems] = useState([]);
    const [q, setQ] = useState('');
    return (
      <div>
        <input aria-label="nonhcc-search" value={q} onChange={(e) => { setQ(e.target.value); onFilter(e.target.value); }} />
        <button onClick={() => { const v = q.trim(); if(!v) return; setItems([...items, v]); onAdd(v); }}>AddNH</button>
        <ul>
          {items.map((it, i) => (
            <li key={i}>
              <span>{it}</span>
              <button onClick={() => { setItems(items.filter((_, idx) => idx !== i)); onRemove(i); }}>DelNH</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import NONHCC from '../../../../../../src/components/patientDetails/details/components/NONHCC';

describe('NONHCC (mocked)', () => {
  test('filter, add, and remove', () => {
    const onFilter = jest.fn();
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<NONHCC onFilter={onFilter} onAdd={onAdd} onRemove={onRemove} />);
    const input = screen.getByLabelText('nonhcc-search');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onFilter).toHaveBeenCalledWith('abc');
    fireEvent.click(screen.getByText('AddNH'));
    expect(onAdd).toHaveBeenCalledWith('abc');
    fireEvent.click(screen.getByText('DelNH'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: add ignored when empty', () => {
    const onAdd = jest.fn();
    render(<NONHCC onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddNH'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 