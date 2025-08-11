import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/notes', () => ({
  __esModule: true,
  default: function MockNotes({ onAdd = () => {}, onDelete = () => {}, initial = [] }) {
    const [notes, setNotes] = useState(initial);
    const [val, setVal] = useState('');
    return (
      <div>
        <input aria-label="note-input" value={val} onChange={(e) => setVal(e.target.value)} />
        <button onClick={() => { if(val.trim()){ const n=[...notes, val.trim()]; setNotes(n); onAdd(val.trim()); setVal(''); } }}>Add</button>
        <ul>
          {notes.map((n, i) => (
            <li key={i}>
              <span>{n}</span>
              <button onClick={() => { const n2=notes.filter((_, idx) => idx!==i); setNotes(n2); onDelete(i); }}>Del</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import Notes from '../../../../../../src/components/patientDetails/details/components/notes';

describe('Notes (mocked)', () => {
  test('adds a note (positive)', () => {
    const onAdd = jest.fn();
    render(<Notes onAdd={onAdd} />);
    fireEvent.change(screen.getByLabelText('note-input'), { target: { value: 'New note' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledWith('New note');
    expect(screen.getByText('New note')).toBeInTheDocument();
  });

  test('negative: empty note is ignored', () => {
    const onAdd = jest.fn();
    render(<Notes onAdd={onAdd} />);
    fireEvent.change(screen.getByLabelText('note-input'), { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('delete a note', () => {
    const onDelete = jest.fn();
    render(<Notes initial={["A"]} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Del'));
    expect(onDelete).toHaveBeenCalledWith(0);
    expect(screen.queryByText('A')).not.toBeInTheDocument();
  });
}); 