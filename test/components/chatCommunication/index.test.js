import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Pass-through connect
jest.mock('react-redux', () => ({ connect: () => (Comp) => Comp }));

// Mock store actions module to avoid importing network/SweetAlert side-effects
jest.mock('../../../src/stores/chatService', () => ({ actions: {} }));

// Ensure matchMedia exists for AntD responsive hooks
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
  // Smooth scroll stub used by component
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// Mock CSS module
jest.mock('../../../src/components/chatCommunication/styles.module.css', () => ({
  chatContainer: 'chatContainer',
  tabContainer: 'tabContainer',
  firstdCard: 'firstdCard',
  secondCard: 'secondCard',
  unreadCount: 'unreadCount',
  timeFromNow: 'timeFromNow',
  chatContainer2: 'chatContainer2',
  form_submit_container: 'form_submit_container'
}));

// Mock 3rd party components and libs to minimal outputs
jest.mock('react-bootstrap', () => ({
  Tab: ({ children }) => <div>{children}</div>,
  Nav: ({ children }) => <ul>{children}</ul>
}));

jest.mock('react-toastify', () => ({ ToastContainer: () => <div data-testid="toast" /> , toast: { error: jest.fn() } }));

jest.mock('react-timeago', () => () => <span>timeago</span>);

// Make FA icon clickable to exercise handlers
jest.mock('@fortawesome/react-fontawesome', () => ({ FontAwesomeIcon: ({ onClick }) => <button data-testid="fa" onClick={onClick} /> }));

jest.mock('@ant-design/icons', () => ({ CloseCircleOutlined: (props) => <span data-testid="close-circle" {...props} /> }));

jest.mock('antd', () => ({ Badge: ({ children }) => <span>{children}</span>, Avatar: ({ children }) => <span>{children}</span>, Tooltip: ({ children }) => <span>{children}</span> }));

// Network/url and storage
jest.mock('../../../src/utils/config', () => ({ portalUrl: 'http://test/' }));
jest.mock('../../../src/utils/storages', () => ({ getStorage: jest.fn((k) => (k === 'userId' ? 'user1' : 'token123')) }));

// SockJS and stomp
jest.mock('sockjs-client', () => function SockJS() {});
let clientRef;
jest.mock('stompjs', () => ({
  over: () => {
    clientRef = {
      connect: (h, ok) => ok && ok(),
      subscribe: jest.fn((dest, cb) => { global.__stompSub = { dest, cb }; }),
      send: jest.fn()
    };
    global.__stompClient = clientRef;
    return clientRef;
  }
}));

// Mock actions passed via props
const mockGetChatHistory = jest.fn(async () => []);
const mockGetUsers = jest.fn(async () => [{ userName: 'user2', firstName: 'U2', lastName: 'L2', role: ['R'], profileImageUrl: '' }]);
const mockGetHandleChatHistory = jest.fn(async () => ({ content: [], last: true }));
const mockGetHandleResetReadHistory = jest.fn(async () => ({}));
const mockHandleFilePost = jest.fn(async () => ({ response: { fileUploadedUrl: 'http://f/img.png' } }));
const mockAddUser = jest.fn(async () => ({}));

import ChatCommunication from '../../../src/components/chatCommunication';

describe('ChatCommunication', () => {
  beforeEach(() => jest.clearAllMocks());

  const renderWith = (props = {}) =>
    render(
      <ChatCommunication
        openMsg={true}
        offMsg={jest.fn()}
        getChatHistory={mockGetChatHistory}
        getUsers={mockGetUsers}
        getHandleChatHistory={mockGetHandleChatHistory}
        getHandleResetReadHistory={mockGetHandleResetReadHistory}
        handleFilePost={mockHandleFilePost}
        addUser={mockAddUser}
        {...props}
      />
    );

  test('renders tabs and close button; clicking close calls offMsg', () => {
    const offMsg = jest.fn();
    renderWith({ offMsg });
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    const close = screen.getByTestId('fa');
    fireEvent.click(close);
    expect(offMsg).toHaveBeenCalled();
  });

  test('negative: when no chat members, shows No Chats', async () => {
    mockGetChatHistory.mockResolvedValueOnce(null);
    renderWith();
    await waitFor(() => expect(screen.getByText('No Chats')).toBeInTheDocument());
  });

  test('typing a message and clicking send renders message bubble', async () => {
    mockGetChatHistory.mockResolvedValueOnce([
      { secondaryUserImageUrl: '', secondaryUser: 'user2', secondaryUserFirstName: 'U2', secondaryUserLastName: 'L2', unreadCount: 0, lastMessage: 'hi', lastMessageTimeStamp: '', lastUpdatedDate: '' }
    ]);
    const { container } = renderWith();
    // Click the member to open chat
    await waitFor(() => expect(screen.getAllByText('U2 L2').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('U2 L2')[0]);
    // Type message
    const input = screen.getAllByPlaceholderText('Type message')[0];
    fireEvent.change(input, { target: { value: 'hello' } });
    // Click the actual submit button
    const submitBtn = container.querySelector('form button[type="submit"]');
    fireEvent.click(submitBtn);
    // Message should be reflected in DOM
    await waitFor(() => expect(screen.getAllByText('hello').length).toBeGreaterThan(0));
  });

  test('file input: invalid extension triggers toast; valid image shows Attachment modal', async () => {
    mockGetChatHistory.mockResolvedValueOnce([
      { secondaryUserImageUrl: '', secondaryUser: 'user2', secondaryUserFirstName: 'U2', secondaryUserLastName: 'L2', unreadCount: 0, lastMessage: 'hi', lastMessageTimeStamp: '', lastUpdatedDate: '' }
    ]);
    const { container } = renderWith();
    await waitFor(() => expect(screen.getAllByText('U2 L2').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('U2 L2')[0]);

    const fileInput = container.querySelectorAll('#fileAdd')[0];
    const badFile = new File(['x'], 'file.exe', { type: 'application/octet-stream' });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    const { toast } = require('react-toastify');
    expect(toast.error).toHaveBeenCalled();

    const goodFile = new File(['x'], 'img.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [goodFile] } });
    await waitFor(() => expect(screen.getAllByText('Attachment').length).toBeGreaterThan(0));
  });

  test('clicking a recent member triggers load history', async () => {
    mockGetChatHistory.mockResolvedValueOnce([
      { secondaryUserImageUrl: '', secondaryUser: 'user2', secondaryUserFirstName: 'U2', secondaryUserLastName: 'L2', unreadCount: 1, lastMessage: 'hi', lastMessageTimeStamp: '', lastUpdatedDate: '' }
    ]);
    renderWith();
    await waitFor(() => expect(screen.getAllByText('U2 L2').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('U2 L2')[0]);
    await waitFor(() => expect(mockGetHandleChatHistory).toHaveBeenCalled());
  });

  test('search filters: members and users lists', async () => {
    mockGetChatHistory.mockResolvedValueOnce([
      { secondaryUserImageUrl: '', secondaryUser: 'alpha', secondaryUserFirstName: 'Alice', secondaryUserLastName: 'A', unreadCount: 0, lastMessage: 'x', lastMessageTimeStamp: '', lastUpdatedDate: '' },
      { secondaryUserImageUrl: '', secondaryUser: 'beta', secondaryUserFirstName: 'Bob', secondaryUserLastName: 'B', unreadCount: 0, lastMessage: 'y', lastMessageTimeStamp: '', lastUpdatedDate: '' }
    ]);
    renderWith();
    await waitFor(() => expect(screen.getByText('Alice A')).toBeInTheDocument());
    const memberSearch = screen.getByPlaceholderText('Search members');
    fireEvent.change(memberSearch, { target: { value: 'Bob' } });
    await waitFor(() => expect(screen.getByText('Bob B')).toBeInTheDocument());

    // Team Members tab content is rendered by our simple mocks; search new user field exists
    const userSearch = screen.getByPlaceholderText('Search a new user');
    fireEvent.change(userSearch, { target: { value: 'U2' } });
    expect(userSearch).toHaveValue('U2');
  });
}); 