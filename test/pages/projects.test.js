import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

// Router and MSAL
const routerPushMock = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ push: routerPushMock, pathname: '/projects' }) }));
jest.mock('@azure/msal-react', () => ({ useMsal: jest.fn(() => ({ accounts: [{}] })) }));

// Images/CSS
jest.mock('../../src/images/logo/login-back.jpg', () => 'login-back.jpg');
jest.mock('../../src/styles/auth.module.css', () => ({ loginContainer: 'loginContainer' }));

// Storage helpers
const setStorageMock = jest.fn();
const removeStorageMock = jest.fn();
jest.mock('../../src/utils/storages', () => ({
  setStorage: (...args) => setStorageMock(...args),
  removeStorage: (...args) => removeStorageMock(...args)
}));

// Utils
const getResponePopup = jest.fn();
jest.mock('../../src/utils/reusable', () => ({
  createIdGens: (s) => `id-${s}`,
  createIdGen: (s) => `id-${s}`,
  getResponePopup: (...args) => getResponePopup(...args)
}));

// Logo helper
jest.mock('../../src/pages/twofactorauthentication/reusableFun', () => ({ getLogoImage: () => <div>Logo</div> }));

// SSO
const ssoLogout = jest.fn();
jest.mock('../../lib/authService', () => ({ ssoLogout: (...args) => ssoLogout(...args) }));

// Avoid Redux connect wiring by making it a passthrough and stub actions module to prevent network imports
jest.mock('react-redux', () => ({ connect: () => (Comp) => Comp }));
jest.mock('../../src/stores/authFlows', () => ({ actions: {} }));

// AntD responsive hooks expect matchMedia
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
});

import SelectProject from '../../src/pages/projects';

const baseProps = {
  // Actions provided via connect
  getAllClientId: jest.fn(async () => ({ status: 'SUCCESS' })),
  getAllClientDetails: jest.fn(async () => ({ status: 'SUCCESS' })),
  getAllProjects: jest.fn(async () => ({ status: 'SUCCESS' })),
  getAllRoles: jest.fn(async () => ({ status: 'SUCCESS' })),
  // State provided via connect
  clientIdData: { orgId: 'ORG1' },
  clientDetails: [{ clientName: 'Client A', clientId: 'CID1' }],
  projectDetails: [{ projectName: 'Project A', id: 'PID1' }],
  allRolesData: { userName: 'user@x.com', userRoles: [{ aliasName: 'QA_ROLE', proxyRole: 'PR1', role: 'QA', roleId: 10, panelList: { accessListForPanel1: [{ title: 'Dashboard' }] } }] },
  clientLoading: false,
  projectLoading: false,
  roleLoading: false,
  id: 'X'
};

describe('Projects page (single file)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    const { useMsal } = require('@azure/msal-react');
    useMsal.mockReturnValue({ accounts: [{}] });
  });

  test('renders skeleton then form', async () => {
    const { container } = render(<SelectProject {...baseProps} />);
    // skeleton visible initially
    expect(container.querySelector('.ant-skeleton-input')).toBeInTheDocument();

    // advance timers to show form
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Your Gateway to CogentAI')).toBeInTheDocument();
    // form with id suffix
    expect(screen.getByTestId('id-loginFormX')).toBeInTheDocument();

    // orgId persisted and client details fetched on effect
    expect(setStorageMock).toHaveBeenCalledWith('orgId', 'ORG1');
    expect(baseProps.getAllClientDetails).toHaveBeenCalled();

    // userId persisted each render effect
    expect(setStorageMock).toHaveBeenCalledWith('userId', 'user@x.com');
  });

  test('clientId USER_DEFINED_ERROR triggers ssoLogout', async () => {
    render(<SelectProject {...baseProps} getAllClientId={jest.fn(async () => ({ status: 'USER_DEFINED_ERROR' }))} />);
    await act(async () => {
      // allow effect and promise to resolve
    });
    // initial effect calls clientIdApi and then logout
    expect(ssoLogout).toHaveBeenCalled();
  });

  test('error paths call getResponePopup for clients/projects/roles', async () => {
    render(
      <SelectProject
        {...baseProps}
        getAllClientDetails={jest.fn(async () => ({ status: 'ERROR' }))}
        getAllProjects={jest.fn(async () => ({ status: 'ERROR' }))}
        getAllRoles={jest.fn(async () => ({ status: 'ERROR' }))}
      />
    );
    // form shown
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('id-loginFormX')).toBeInTheDocument();
    // at least one popup from clientGetApi
    expect(getResponePopup).toHaveBeenCalled();
  });
}); 