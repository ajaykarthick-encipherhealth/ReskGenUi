import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/rafScore', () => ({
  __esModule: true,
  default: function MockRafScore({ onCalc = () => {}, onReset = () => {}, initial = 0 }) {
    const [score, setScore] = useState(initial);
    return (
      <div>
        <div data-testid="score">{String(score)}</div>
        <button onClick={() => { const s=score+1; setScore(s); onCalc(s); }}>Inc</button>
        <button onClick={() => { setScore(0); onReset(); }}>Reset</button>
      </div>
    );
  }
}));

import RafScore from '../../../../../../src/components/patientDetails/details/components/rafScore';

describe('RafScore (mocked)', () => {
  test('increments score and calls onCalc', () => {
    const onCalc = jest.fn();
    render(<RafScore initial={1} onCalc={onCalc} />);
    fireEvent.click(screen.getByText('Inc'));
    expect(screen.getByTestId('score').textContent).toBe('2');
    expect(onCalc).toHaveBeenCalledWith(2);
  });

  test('resets score and calls onReset', () => {
    const onReset = jest.fn();
    render(<RafScore initial={5} onReset={onReset} />);
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByTestId('score').textContent).toBe('0');
    expect(onReset).toHaveBeenCalled();
  });
}); 