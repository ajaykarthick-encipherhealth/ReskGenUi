import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/image
jest.mock('next/image', () => ({ __esModule: true, default: (props) => <img alt="img" /> }));

import Chat from '../../../src/components/chat';

describe('Chat component', () => {
  test('renders hidden when openMsg is false', () => {
    render(<Chat openMsg={false} offMsg={jest.fn()} />);
    const container = document.querySelector('.chatbox');
    expect(container?.className).toContain('d-none');
  });

  test('renders visible and offMsg called on back icon click', () => {
    const offMsg = jest.fn();
    render(<Chat openMsg={true} offMsg={offMsg} />);
    expect(screen.getByText('Chat with Ajith')).toBeInTheDocument();
    // Click the back svg wrapper
    const back = document.querySelector('.cr-pointer');
    fireEvent.click(back);
    expect(offMsg).toHaveBeenCalled();
  });
}); 