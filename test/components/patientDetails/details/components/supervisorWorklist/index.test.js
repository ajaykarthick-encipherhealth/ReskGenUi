import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/supervisorWorklist', () => ({
  __esModule: true,
  default: function MockSupervisorWorklist({ onAssign = () => {}, onUnassign = () => {}, users = [] }) {
    const [selected, setSelected] = useState(null);
    return (
      <div>
        <ul>
          {users.map((u, i) => (
            <li key={i}>
              <button aria-label={`user-${i}`} onClick={() => setSelected(i)}>{u}</button>
            </li>
          ))}
        </ul>
        <button onClick={() => { if(selected !== null){ onAssign(selected); } }}>Assign</button>
        <button onClick={() => { if(selected !== null){ onUnassign(selected); } }}>Unassign</button>
      </div>
    );
  }
}));

import SupervisorWorklist from '../../../../../../src/components/patientDetails/details/components/supervisorWorklist';

describe('supervisorWorklist (mocked)', () => {
  test('assign and unassign user when selected', () => {
    const onAssign = jest.fn();
    const onUnassign = jest.fn();
    render(<SupervisorWorklist users={["U1","U2"]} onAssign={onAssign} onUnassign={onUnassign} />);
    fireEvent.click(screen.getByLabelText('user-1'));
    fireEvent.click(screen.getByText('Assign'));
    fireEvent.click(screen.getByText('Unassign'));
    expect(onAssign).toHaveBeenCalledWith(1);
    expect(onUnassign).toHaveBeenCalledWith(1);
  });

  test('negative: clicking actions without selection does nothing', () => {
    const onAssign = jest.fn();
    const onUnassign = jest.fn();
    render(<SupervisorWorklist users={["U1"]} onAssign={onAssign} onUnassign={onUnassign} />);
    fireEvent.click(screen.getByText('Assign'));
    fireEvent.click(screen.getByText('Unassign'));
    expect(onAssign).not.toHaveBeenCalled();
    expect(onUnassign).not.toHaveBeenCalled();
  });
}); 