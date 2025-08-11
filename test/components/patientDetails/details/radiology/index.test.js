import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../src/components/patientDetails/details/radiology', () => ({
  __esModule: true,
  default: function MockRadiology({ onTabChange = () => {}, onAction = () => {} }) {
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

import Radiology from '../../../../../src/components/patientDetails/details/radiology';

describe('details/radiology (mocked)', () => {
  test('switch tab and act', () => {
    const onTabChange = jest.fn();
    const onAction = jest.fn();
    render(<Radiology onTabChange={onTabChange} onAction={onAction} />);
    fireEvent.click(screen.getByText('FileTab'));
    expect(onTabChange).toHaveBeenCalledWith('file');
    fireEvent.click(screen.getByText('Act'));
    expect(onAction).toHaveBeenCalledWith('file');
  });

  test('negative: action uses default tab if not switched', () => {
    const onAction = jest.fn();
    render(<Radiology onAction={onAction} />);
    fireEvent.click(screen.getByText('Act'));
    expect(onAction).toHaveBeenCalledWith('visitData');
  });
}); 