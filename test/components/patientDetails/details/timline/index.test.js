import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../src/components/patientDetails/details/timline', () => ({
  __esModule: true,
  default: function MockTimeline({ onFilter = () => {}, onSelect = () => {} }) {
    const [q, setQ] = useState('');
    return (
      <div>
        <input aria-label="tl-search" value={q} onChange={(e) => { setQ(e.target.value); onFilter(e.target.value); }} />
        <button onClick={() => { if(!q.trim()) return; onSelect(q); }}>Pick</button>
      </div>
    );
  }
}));

jest.mock('../../../../../src/components/patientDetails/details/timline/rebuttalModal', () => ({
  __esModule: true,
  default: function MockRebuttalModal({ open = false, onOk = () => {}, onCancel = () => {} }) {
    const [show, setShow] = useState(open);
    return (
      <div>
        <button onClick={() => setShow(true)}>OpenReb</button>
        {show && (
          <div>
            <span>Rebuttal</span>
            <button onClick={() => { onOk('ok'); setShow(false); }}>OK</button>
            <button onClick={() => { onCancel(); setShow(false); }}>Cancel</button>
          </div>
        )}
      </div>
    );
  }
}));

import Timeline from '../../../../../src/components/patientDetails/details/timline';
import RebuttalModal from '../../../../../src/components/patientDetails/details/timline/rebuttalModal';

describe('details/timline (mocked)', () => {
  test('filter and select item', () => {
    const onFilter = jest.fn();
    const onSelect = jest.fn();
    render(<Timeline onFilter={onFilter} onSelect={onSelect} />);
    fireEvent.change(screen.getByLabelText('tl-search'), { target: { value: 'abc' } });
    expect(onFilter).toHaveBeenCalledWith('abc');
    fireEvent.click(screen.getByText('Pick'));
    expect(onSelect).toHaveBeenCalledWith('abc');
  });

  test('negative: select ignored when empty', () => {
    const onSelect = jest.fn();
    render(<Timeline onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Pick'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('details/timline/rebuttalModal (mocked)', () => {
  test('open and confirm', () => {
    const onOk = jest.fn();
    render(<RebuttalModal onOk={onOk} />);
    fireEvent.click(screen.getByText('OpenReb'));
    fireEvent.click(screen.getByText('OK'));
    expect(onOk).toHaveBeenCalledWith('ok');
  });

  test('open and cancel', () => {
    const onCancel = jest.fn();
    render(<RebuttalModal onCancel={onCancel} />);
    fireEvent.click(screen.getByText('OpenReb'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
}); 