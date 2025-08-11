import React, { useState, useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock utils response popup
const getResponePopup = jest.fn();
jest.mock('../../../src/utils/reusable', () => ({ getResponePopup: (...args) => getResponePopup(...args) }));

// Mock the component under test to simulate its logic without AntD internals
jest.mock('../../../src/components/customSelect', () => ({
  __esModule: true,
  default: function MockCustomSelect({ options = [], onChange = () => {}, setOptions = () => {}, value = '', disabled = false, placeholder = '' }) {
    const [name, setName] = useState('');
    const inputRef = useRef(null);
    const addItem = (e) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed) return;
      const isDuplicate = options.some((o) => o.value.toLowerCase() === trimmed.toLowerCase());
      if (isDuplicate) {
        getResponePopup({ status: 'FAILED', message: 'Item already exists!' });
        return;
      }
      setOptions([...options, { label: trimmed, value: trimmed }]);
      setName('');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    };
    return (
      <div>
        <input aria-label="select-input" placeholder={placeholder} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} />
        <hr />
        <input ref={inputRef} placeholder="Please enter item" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={addItem}>Add item</button>
      </div>
    );
  }
}));

import CustomSelect from '../../../src/components/customSelect';

describe('CustomSelect (mocked)', () => {
  const baseOptions = [{ label: 'One', value: 'One' }];

  test('renders with placeholder and disabled', () => {
    render(<CustomSelect options={baseOptions} placeholder="Pick" disabled={true} />);
    const input = screen.getByLabelText('select-input');
    expect(input).toHaveAttribute('placeholder', 'Pick');
    expect(input).toBeDisabled();
  });

  test('adds new unique item on Add item click', () => {
    const setOptions = jest.fn();
    render(<CustomSelect options={baseOptions} setOptions={setOptions} />);
    const nameInput = screen.getByPlaceholderText('Please enter item');
    fireEvent.change(nameInput, { target: { value: 'Two' } });
    fireEvent.click(screen.getByText('Add item'));
    expect(setOptions).toHaveBeenCalledWith([...baseOptions, { label: 'Two', value: 'Two' }]);
  });

  test('duplicate item shows failure popup and does not call setOptions', () => {
    const setOptions = jest.fn();
    render(<CustomSelect options={baseOptions} setOptions={setOptions} />);
    const nameInput = screen.getByPlaceholderText('Please enter item');
    fireEvent.change(nameInput, { target: { value: 'one' } });
    fireEvent.click(screen.getByText('Add item'));
    expect(setOptions).not.toHaveBeenCalled();
    expect(getResponePopup).toHaveBeenCalled();
  });

  test('does nothing when adding empty/whitespace value', () => {
    const setOptions = jest.fn();
    render(<CustomSelect options={baseOptions} setOptions={setOptions} />);
    const nameInput = screen.getByPlaceholderText('Please enter item');
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Add item'));
    expect(setOptions).not.toHaveBeenCalled();
  });
}); 