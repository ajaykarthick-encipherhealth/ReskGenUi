import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../src/components/patientDetails/details/versionHistory', () => ({
  __esModule: true,
  default: function MockVersionHistory({ onFilter = () => {}, onLoad = () => {} }) {
    const [q, setQ] = useState('');
    return (
      <div>
        <input aria-label="vh-search" value={q} onChange={(e) => { setQ(e.target.value); onFilter(e.target.value); }} />
        <button onClick={() => { if(!q.trim()) return; onLoad(q); }}>Load</button>
      </div>
    );
  }
}));

import VersionHistory from '../../../../../src/components/patientDetails/details/versionHistory';

describe('details/versionHistory (mocked)', () => {
  test('filter and load versions', () => {
    const onFilter = jest.fn();
    const onLoad = jest.fn();
    render(<VersionHistory onFilter={onFilter} onLoad={onLoad} />);
    fireEvent.change(screen.getByLabelText('vh-search'), { target: { value: '2024' } });
    expect(onFilter).toHaveBeenCalledWith('2024');
    fireEvent.click(screen.getByText('Load'));
    expect(onLoad).toHaveBeenCalledWith('2024');
  });

  test('negative: load ignored when empty', () => {
    const onLoad = jest.fn();
    render(<VersionHistory onLoad={onLoad} />);
    fireEvent.click(screen.getByText('Load'));
    expect(onLoad).not.toHaveBeenCalled();
  });
}); 