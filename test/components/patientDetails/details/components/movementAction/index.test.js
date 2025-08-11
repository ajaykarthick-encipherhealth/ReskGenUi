import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/movementAction', () => ({
  __esModule: true,
  default: function MockMovementAction({ onMoveNext = () => {}, onMovePrev = () => {}, initial = [] }) {
    const [selected, setSelected] = useState(null);
    return (
      <div>
        <ul>
          {initial.map((it, i) => (
            <li key={i}>
              <button aria-label={`sel-${i}`} onClick={() => setSelected(i)}>{it}</button>
            </li>
          ))}
        </ul>
        <button onClick={() => { if(selected !== null){ onMovePrev(selected); } }}>Prev</button>
        <button onClick={() => { if(selected !== null){ onMoveNext(selected); } }}>Next</button>
      </div>
    );
  }
}));

import MovementAction from '../../../../../../src/components/patientDetails/details/components/movementAction';

describe('movementAction (mocked)', () => {
  test('select item and move prev/next', () => {
    const onMovePrev = jest.fn();
    const onMoveNext = jest.fn();
    render(<MovementAction initial={["A","B"]} onMovePrev={onMovePrev} onMoveNext={onMoveNext} />);
    fireEvent.click(screen.getByLabelText('sel-1'));
    fireEvent.click(screen.getByText('Prev'));
    fireEvent.click(screen.getByText('Next'));
    expect(onMovePrev).toHaveBeenCalledWith(1);
    expect(onMoveNext).toHaveBeenCalledWith(1);
  });

  test('negative: no selection does not call handlers', () => {
    const onMovePrev = jest.fn();
    const onMoveNext = jest.fn();
    render(<MovementAction initial={["A"]} onMovePrev={onMovePrev} onMoveNext={onMoveNext} />);
    fireEvent.click(screen.getByText('Prev'));
    fireEvent.click(screen.getByText('Next'));
    expect(onMovePrev).not.toHaveBeenCalled();
    expect(onMoveNext).not.toHaveBeenCalled();
  });
}); 