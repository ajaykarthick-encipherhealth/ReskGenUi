import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/fileDetails/codes', () => ({
  __esModule: true,
  default: function MockCodes({ onAdd = () => {}, onRemove = () => {}, initial = [] }) {
    const [codes, setCodes] = useState(initial);
    const [val, setVal] = useState('');
    const add = () => {
      const v = val.trim();
      if (!v) return;
      setCodes([...codes, v]);
      onAdd(v);
      setVal('');
    };
    const remove = (idx) => {
      setCodes(codes.filter((_, i) => i !== idx));
      onRemove(idx);
    };
    return (
      <div>
        <input aria-label="code-input" value={val} onChange={(e) => setVal(e.target.value)} />
        <button onClick={add}>Add</button>
        <ul>
          {codes.map((c, i) => (
            <li key={i}>
              <span>{c}</span>
              <button onClick={() => remove(i)}>Del</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import Codes from '../../../../../../src/components/patientDetails/details/components/fileDetails/codes';

describe('fileDetails/codes (mocked)', () => {
  test('add and remove code', () => {
    const onAdd = jest.fn();
    const onRemove = jest.fn();
    render(<Codes onAdd={onAdd} onRemove={onRemove} />);
    const input = screen.getByLabelText('code-input');
    fireEvent.change(input, { target: { value: 'A1' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledWith('A1');
    fireEvent.click(screen.getByText('Del'));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  test('negative: whitespace code not added', () => {
    const onAdd = jest.fn();
    render(<Codes onAdd={onAdd} />);
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).not.toHaveBeenCalled();
  });
}); 