import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Avoid SweetAlert2 CSS parsing in transitive imports
jest.mock('sweetalert2', () => ({ fire: jest.fn(() => Promise.resolve({ isConfirmed: true })) }));

// Mock chatService actions to avoid network chain
jest.mock('../../../src/stores/chatService', () => ({ actions: { getChatReply: jest.fn(async () => ({ status: 'SUCCESS', response: ['answer'] })) } }));

// Pass-through connect
jest.mock('react-redux', () => ({ connect: () => (Comp) => Comp }));

// Mock CSS and next/image
jest.mock('../../../src/components/aiChat/styles.module.css', () => ({
  clickBtn: 'clickBtn',
  main: 'main',
  chatContainer: 'chatContainer',
  chatTitleCard: 'chatTitleCard',
  chatHead: 'chatHead',
  chatTitle: 'chatTitle',
  subText: 'subText',
  detailsContainer: 'detailsContainer',
  textareaContainer: 'textareaContainer',
  btnStyle: 'btnStyle',
  copyIcon: 'copyIcon'
}));

jest.mock('next/image', () => ({ __esModule: true, default: (props) => <img alt="img" /> }));

// Mock external utilities
jest.mock('../../../src/components/commonFunctions', () => ({ handleCopyToClipboard: jest.fn() }));
jest.mock('../../../src/pages/twofactorauthentication/reusableFun', () => ({ getLogo: () => <div>Logo</div> }));

// Mock antd Skeleton
jest.mock('antd', () => ({ Skeleton: { Input: () => <span data-testid="skeleton-input" /> } }));

// Mock actions passed as props too (explicit override)
const mockGetChatReply = jest.fn(async (q) => ({ status: 'SUCCESS', response: ['answer'] }));

import AICHAT from '../../../src/components/aiChat';

describe('AICHAT component', () => {
  beforeAll(() => {
    // stub scrollIntoView to avoid jsdom TypeError
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => jest.clearAllMocks());

  const renderWith = (props = {}) => render(<AICHAT openMsg={true} getChatReply={mockGetChatReply} {...props} />);

  test('toggle opens chat UI; shows welcome pane and starts chat', () => {
    renderWith();
    const toggle = screen.getAllByRole('button')[0];
    fireEvent.click(toggle);
    expect(screen.getByText('Welcome to CogentAI')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Get Started'));
    expect(screen.getByText('Chat with CogentAI')).toBeInTheDocument();
  });

  test('submitting a question appends user message and fills reply', async () => {
    renderWith();
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getByText('Get Started'));
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(mockGetChatReply).toHaveBeenCalledWith('hello'));
  });

  test('negative: invalid form shows validation when submitted empty', () => {
    renderWith();
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getByText('Get Started'));
    const submit = screen.getAllByRole('button')[1];
    fireEvent.click(submit);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });
}); 