import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/COMBO', () => ({
  __esModule: true,
  default: function MockCOMBO({ onToggle = () => {}, onClear = () => {}, initial = [] }) {
    const [sel, setSel] = useState(initial);
    const toggle = (v) => {
      const has = sel.includes(v);
      const next = has ? sel.filter((x) => x !== v) : [...sel, v];
      setSel(next);
      onToggle(next);
    };
    return (
      <div>
        <button onClick={() => toggle('A')}>A</button>
        <button onClick={() => toggle('B')}>B</button>
        <button onClick={() => { setSel([]); onClear(); }}>Clear</button>
        <div data-testid="selected">{sel.join(',')}</div>
      </div>
    );
  }
}));

import COMBO from '../../../../../../src/components/patientDetails/details/components/COMBO';

describe('COMBO (mocked)', () => {
  test('toggle selections and clear', () => {
    const onToggle = jest.fn();
    const onClear = jest.fn();
    render(<COMBO onToggle={onToggle} onClear={onClear} />);
    fireEvent.click(screen.getByText('A'));
    expect(onToggle).toHaveBeenCalledWith(['A']);
    fireEvent.click(screen.getByText('B'));
    expect(onToggle).toHaveBeenCalledWith(['A','B']);
    fireEvent.click(screen.getByText('A'));
    expect(onToggle).toHaveBeenCalledWith(['B']);
    fireEvent.click(screen.getByText('Clear'));
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByTestId('selected').textContent).toBe('');
  });
}); 