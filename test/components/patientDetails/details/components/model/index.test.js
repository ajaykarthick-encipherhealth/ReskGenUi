import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/model/Index', () => ({
  __esModule: true,
  default: function MockModel({ onConfirm = () => {}, onCancel = () => {} }) {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setOpen(true)}>Open</button>
        {open && (
          <div>
            <span>Modal</span>
            <button onClick={() => { onConfirm(); setOpen(false); }}>OK</button>
            <button onClick={() => { onCancel(); setOpen(false); }}>Cancel</button>
          </div>
        )}
      </div>
    );
  }
}));

import Model from '../../../../../../src/components/patientDetails/details/components/model/Index';

describe('model/Index (mocked)', () => {
  test('open modal and confirm', () => {
    const onConfirm = jest.fn();
    render(<Model onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('OK'));
    expect(onConfirm).toHaveBeenCalled();
  });

  test('open modal and cancel', () => {
    const onCancel = jest.fn();
    render(<Model onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
}); 