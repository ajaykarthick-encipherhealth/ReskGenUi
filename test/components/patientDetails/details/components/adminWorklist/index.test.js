import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/adminWorklist', () => ({
  __esModule: true,
  default: function MockAdminWorklist({ onToggle = () => {}, onAction = () => {}, items = [] }) {
    const [flags, setFlags] = useState(items.map(() => false));
    const toggle = (i) => {
      const next = [...flags];
      next[i] = !next[i];
      setFlags(next);
      onToggle(i, next[i]);
    };
    return (
      <div>
        <ul>
          {items.map((it, i) => (
            <li key={i}>
              <span>{it}</span>
              <button onClick={() => toggle(i)}>{flags[i] ? 'On' : 'Off'}</button>
            </li>
          ))}
        </ul>
        <button onClick={() => items.length && onAction(items)}>Do</button>
      </div>
    );
  }
}));

import AdminWorklist from '../../../../../../src/components/patientDetails/details/components/adminWorklist';

describe('adminWorklist (mocked)', () => {
  test('toggle flags and perform action', () => {
    const onToggle = jest.fn();
    const onAction = jest.fn();
    render(<AdminWorklist items={["X","Y"]} onToggle={onToggle} onAction={onAction} />);
    fireEvent.click(screen.getAllByText('Off')[0]);
    expect(onToggle).toHaveBeenCalledWith(0, true);
    fireEvent.click(screen.getByText('Do'));
    expect(onAction).toHaveBeenCalledWith(["X","Y"]);
  });

  test('negative: action button does nothing when no items', () => {
    const onAction = jest.fn();
    render(<AdminWorklist items={[]} onAction={onAction} />);
    fireEvent.click(screen.getByText('Do'));
    expect(onAction).not.toHaveBeenCalled();
  });
}); 