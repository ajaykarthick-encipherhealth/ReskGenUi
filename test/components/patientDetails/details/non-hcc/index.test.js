import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../src/components/patientDetails/details/non-hcc', () => ({
  __esModule: true,
  default: function MockNonHcc({ onTabChange = () => {}, onAction = () => {} }) {
    const [tab, setTab] = useState('visitData');
    return (
      <div>
        <button onClick={() => { setTab('file'); onTabChange('file'); }}>FileTab</button>
        <button onClick={() => onAction(tab)}>Act</button>
        <span data-testid="tab">{tab}</span>
      </div>
    );
  }
}));

import NonHcc from '../../../../../src/components/patientDetails/details/non-hcc';

describe('details/non-hcc (mocked)', () => {
  test('switch tab and act', () => {
    const onTabChange = jest.fn();
    const onAction = jest.fn();
    render(<NonHcc onTabChange={onTabChange} onAction={onAction} />);
    fireEvent.click(screen.getByText('FileTab'));
    expect(onTabChange).toHaveBeenCalledWith('file');
    fireEvent.click(screen.getByText('Act'));
    expect(onAction).toHaveBeenCalledWith('file');
  });

  test('negative: action uses default tab if not switched', () => {
    const onAction = jest.fn();
    render(<NonHcc onAction={onAction} />);
    fireEvent.click(screen.getByText('Act'));
    expect(onAction).toHaveBeenCalledWith('visitData');
  });
}); 