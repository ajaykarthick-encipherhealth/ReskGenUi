import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock CSS module
jest.mock('../../../src/components/subNavBar/style.module.css', () => ({
  tabMainContainer: 'tabMainContainer',
  arrowBtn: 'arrowBtn',
  filterBtn: 'filterBtn',
  tabContainer: 'tabContainer',
  headerContent: 'headerContent',
  headerTitle: 'headerTitle',
  subText: 'subText'
}));

// Mock fontawesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <span data-testid="fa" {...props} />
}));

// Mock utils
jest.mock('../../../src/utils/storages', () => ({
  getStorage: jest.fn((key) => {
    switch (key) {
      case 'userRole':
        return 'admin';
      case 'activeTabTin':
        return 'TAB1';
      case 'userId':
        return 'U1';
      case 'tinNumber':
        return 'T-123';
      case 'project':
        return 'P-9';
      default:
        return null;
    }
  })
}));

jest.mock('../../../src/utils/reusable', () => ({
  createIdGen: (s) => s,
  getAccessTabItems: jest.fn(),
  handleCopyTextInput: jest.fn(),
  reusableEllipses: ({ str }) => <span>{str}</span>
}));

jest.mock('antd', () => ({ Tooltip: ({ title, children }) => <div data-testid="tooltip">{children}</div> }));

// Mock network and helpers
jest.mock('../../../src/stores/tableView/network', () => ({
  getTableView: jest.fn(async () => ({
    response: {
      metaDataDTO: [
        { headerName: 'TIN Name', actualField: 'tinName', active: true },
        { headerName: 'Status', actualField: 'status', active: true }
      ],
      pageResponse: { content: [ { tinName: 'MyTIN', status: 'Active' } ] }
    }
  }))
}));

jest.mock('../../../src/pages/tenantadmin/tin', () => ({ getPageId: jest.fn(() => 'PID') }));

// Make connect a pass-through so we render the inner component
jest.mock('react-redux', () => ({ connect: () => (Comp) => Comp }));

// Mock CardSkeleton used during loading
jest.mock('../../../src/components/skeleton/card', () => ({
  __esModule: true,
  default: ({ height }) => <div data-testid="card-skeleton" style={{ height }} />
}));

import SubNavBar from '../../../src/components/subNavBar';
import { handleCopyTextInput } from '../../../src/utils/reusable';

describe('SubNavBar (real component) coverage', () => {
  test('renders back arrow and rows; copy icon calls handler', async () => {
    const onBack = jest.fn();
    render(<SubNavBar handleBack={onBack} hideBackArrow pageLoad={1} tableLoader={false} />);

    // Back arrow visible
    const back = screen.getByTestId('admin tin backicon');
    fireEvent.click(back);
    expect(onBack).toHaveBeenCalled();

    // Wait for async data render
    await waitFor(() => expect(screen.getByText('TIN NAME')).toBeInTheDocument());
    expect(screen.getByText('STATUS')).toBeInTheDocument();

    // Row content
    expect(screen.getByText('MyTIN')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    // Copy icon present only for TIN Name cell and triggers copy handler
    const copyTargets = screen.getAllByTestId('admin tin copyicon');
    expect(copyTargets.length).toBeGreaterThan(0);
    fireEvent.click(copyTargets[0].querySelector('[data-testid="fa"]') || copyTargets[0]);
    expect(handleCopyTextInput).toHaveBeenCalledWith('MyTIN');
  });

  test('shows skeleton when loading flag true', () => {
    render(<SubNavBar handleBack={() => {}} hideBackArrow pageLoad={0} tableLoader={true} />);
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });
}); 