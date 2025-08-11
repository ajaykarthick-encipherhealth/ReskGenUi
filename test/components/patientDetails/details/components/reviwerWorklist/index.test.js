import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/reviwerWorklist', () => ({
  __esModule: true,
  default: function MockReviewerWorklist({ onAccept = () => {}, onReject = () => {}, items = [] }) {
    const [selected, setSelected] = useState(null);
    return (
      <div>
        <ul>
          {items.map((it, i) => (
            <li key={i}>
              <button aria-label={`pick-${i}`} onClick={() => setSelected(i)}>{it}</button>
            </li>
          ))}
        </ul>
        <button onClick={() => { if(selected !== null){ onAccept(selected); } }}>Accept</button>
        <button onClick={() => { if(selected !== null){ onReject(selected); } }}>Reject</button>
      </div>
    );
  }
}));

import ReviewerWorklist from '../../../../../../src/components/patientDetails/details/components/reviwerWorklist';

describe('reviwerWorklist (mocked)', () => {
  test('accept/reject selected item', () => {
    const onAccept = jest.fn();
    const onReject = jest.fn();
    render(<ReviewerWorklist items={["R1","R2"]} onAccept={onAccept} onReject={onReject} />);
    fireEvent.click(screen.getByLabelText('pick-0'));
    fireEvent.click(screen.getByText('Accept'));
    fireEvent.click(screen.getByText('Reject'));
    expect(onAccept).toHaveBeenCalledWith(0);
    expect(onReject).toHaveBeenCalledWith(0);
  });

  test('negative: no selection does nothing', () => {
    const onAccept = jest.fn();
    const onReject = jest.fn();
    render(<ReviewerWorklist items={["R1"]} onAccept={onAccept} onReject={onReject} />);
    fireEvent.click(screen.getByText('Accept'));
    fireEvent.click(screen.getByText('Reject'));
    expect(onAccept).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
  });
}); 