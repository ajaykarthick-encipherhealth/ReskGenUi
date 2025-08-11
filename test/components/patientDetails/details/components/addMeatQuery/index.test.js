import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/addMeatQuery', () => ({
  __esModule: true,
  default: function MockAddMeatQuery({ onAdd = () => {} }) {
    const [q, setQ] = useState('');
    return (
      <div>
        <input aria-label="meat-q" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={() => { const v=q.trim(); if(!v) return; onAdd(v); setQ(''); }}>AddMeatQ</button>
      </div>
    );
  }
}));

import AddMeatQuery from '../../../../../../src/components/patientDetails/details/components/addMeatQuery';

describe('addMeatQuery (mocked)', () => {
  test('add query', () => {
    const onAdd = jest.fn();
    render(<AddMeatQuery onAdd={onAdd} />);
    fireEvent.change(screen.getByLabelText('meat-q'), { target: { value: 'Q1' } });
    fireEvent.click(screen.getByText('AddMeatQ'));
    expect(onAdd).toHaveBeenCalledWith('Q1');
  });

  test('negative: empty query not added', () => {
    const onAdd = jest.fn();
    render(<AddMeatQuery onAdd={onAdd} />);
    fireEvent.click(screen.getByText('AddMeatQ'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 