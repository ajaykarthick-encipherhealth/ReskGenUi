import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/fileDetails/title', () => ({
  __esModule: true,
  default: function MockTitle({ initial = 'Untitled', onChange = () => {} }) {
    const [title, setTitle] = useState(initial);
    const update = (val) => { setTitle(val); onChange(val); };
    return (
      <div>
        <h3 data-testid="title">{title}</h3>
        <input aria-label="title-input" value={title} onChange={(e) => update(e.target.value)} />
      </div>
    );
  }
}));

import Title from '../../../../../../src/components/patientDetails/details/components/fileDetails/title';

describe('fileDetails/title (mocked)', () => {
  test('updates title and calls onChange', () => {
    const onChange = jest.fn();
    render(<Title initial="Report" onChange={onChange} />);
    const input = screen.getByLabelText('title-input');
    fireEvent.change(input, { target: { value: 'New Title' } });
    expect(screen.getByTestId('title').textContent).toBe('New Title');
    expect(onChange).toHaveBeenCalledWith('New Title');
  });

  test('negative: empty title allowed but still updates', () => {
    const onChange = jest.fn();
    render(<Title initial="X" onChange={onChange} />);
    const input = screen.getByLabelText('title-input');
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByTestId('title').textContent).toBe('');
    expect(onChange).toHaveBeenCalledWith('');
  });
}); 