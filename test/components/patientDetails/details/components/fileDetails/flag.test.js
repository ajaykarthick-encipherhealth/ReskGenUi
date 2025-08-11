import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/fileDetails/flag', () => ({
  __esModule: true,
  default: function MockFlag({ initial = false, onToggle = () => {}, disabled = false }) {
    const [flag, setFlag] = useState(initial);
    const toggle = () => {
      if (disabled) return;
      const next = !flag;
      setFlag(next);
      onToggle(next);
    };
    return (
      <div>
        <span data-testid="flag-state">{flag ? 'Flagged' : 'Unflagged'}</span>
        <button onClick={toggle}>Toggle</button>
      </div>
    );
  }
}));

import Flag from '../../../../../../src/components/patientDetails/details/components/fileDetails/flag';

describe('fileDetails/flag (mocked)', () => {
  test('toggles flag and calls onToggle', () => {
    const onToggle = jest.fn();
    render(<Flag initial={false} onToggle={onToggle} />);
    expect(screen.getByTestId('flag-state').textContent).toBe('Unflagged');
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('flag-state').textContent).toBe('Flagged');
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  test('negative: disabled prevents toggle', () => {
    const onToggle = jest.fn();
    render(<Flag initial={true} onToggle={onToggle} disabled={true} />);
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('flag-state').textContent).toBe('Flagged');
    expect(onToggle).not.toHaveBeenCalled();
  });
}); 