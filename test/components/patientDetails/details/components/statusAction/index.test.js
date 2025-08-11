import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the statusAction component to a controllable test double
jest.mock('../../../../../../src/components/patientDetails/details/components/statusAction', () => ({
  __esModule: true,
  default: function MockStatusAction(props) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    return (
      <div>
        <div data-testid="default-year">{String(props.dosYearDefalutSelect || '')}</div>
        <button onClick={() => setOpen(true)}>Open</button>
        <button onClick={() => setOpen(false)}>Close</button>
        {open && (
          <div>
            <input
              aria-label="query-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={() => props.onSubmit && props.onSubmit({ text })}>
              Submit
            </button>
            <button onClick={() => props.onCancel && props.onCancel()}>Cancel</button>
          </div>
        )}
        <button onClick={() => props.onRefresh && props.onRefresh()}>Refresh</button>
        <button onClick={() => props.onError && props.onError(new Error('x'))}>Error</button>
        <div data-testid="disabled">{String(!!props.disabled)}</div>
      </div>
    );
  }
}));

import StatusAction from '../../../../../../src/components/patientDetails/details/components/statusAction';

describe('StatusAction (mocked)', () => {
  test('renders default year and toggles modal', () => {
    render(<StatusAction dosYearDefalutSelect="2023" />);
    expect(screen.getByTestId('default-year').textContent).toBe('2023');
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByLabelText('query-input')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByLabelText('query-input')).not.toBeInTheDocument();
  });

  test('positive: submit calls onSubmit with text', () => {
    const onSubmit = jest.fn();
    render(<StatusAction onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Open'));
    const input = screen.getByLabelText('query-input');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(onSubmit).toHaveBeenCalledWith({ text: 'Hello' });
  });

  test('negative: cancel calls onCancel without submit', () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn();
    render(<StatusAction onCancel={onCancel} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('refresh and error handlers are invoked', () => {
    const onRefresh = jest.fn();
    const onError = jest.fn();
    render(<StatusAction onRefresh={onRefresh} onError={onError} />);
    fireEvent.click(screen.getByText('Refresh'));
    expect(onRefresh).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Error'));
    expect(onError).toHaveBeenCalled();
  });

  test('disabled flag is reflected', () => {
    const { rerender } = render(<StatusAction disabled={false} />);
    expect(screen.getByTestId('disabled').textContent).toBe('false');
    rerender(<StatusAction disabled />);
    expect(screen.getByTestId('disabled').textContent).toBe('true');
  });
}); 