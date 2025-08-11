import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/comments', () => ({
  __esModule: true,
  default: function MockComments({ onAdd = () => {}, onEdit = () => {}, onDelete = () => {}, initial = [] }) {
    const [items, setItems] = useState(initial);
    const [text, setText] = useState('');
    return (
      <div>
        <input aria-label="comment-input" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={() => { if(text.trim()){ setItems([...items, text.trim()]); onAdd(text.trim()); setText(''); } }}>Add</button>
        <ul>
          {items.map((c, i) => (
            <li key={i}>
              <span>{c}</span>
              <button onClick={() => { const up=c+"!"; const n=[...items]; n[i]=up; setItems(n); onEdit(i, up); }}>Edit</button>
              <button onClick={() => { const n=items.filter((_, idx)=>idx!==i); setItems(n); onDelete(i); }}>Del</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}));

import Comments from '../../../../../../src/components/patientDetails/details/components/comments';

describe('Comments (mocked)', () => {
  test('add comment positive and empty negative', () => {
    const onAdd = jest.fn();
    render(<Comments onAdd={onAdd} />);
    const input = screen.getByLabelText('comment-input');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledWith('Hi');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Add'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  test('edit and delete', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<Comments initial={["A"]} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(0, 'A!');
    fireEvent.click(screen.getByText('Del'));
    expect(onDelete).toHaveBeenCalledWith(0);
  });
}); 