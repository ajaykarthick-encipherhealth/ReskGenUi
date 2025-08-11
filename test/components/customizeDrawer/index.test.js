import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Remove Drawer mock to use real AntD rendering; keep RegularButton mock to avoid router deps
jest.mock('../../../src/components/button', () => {
  return function MockButton({ name, onClick, disabled, loading }) {
    return (
      <button data-testid={`btn-${name}`} onClick={onClick} disabled={disabled}>{loading ? 'Loading' : name}</button>
    );
  };
});

// Keep connect passthrough
jest.mock('react-redux', () => ({ connect: () => (Comp) => (props) => <Comp {...props} /> }));

import CustomizableDrawer from '../../../src/components/customizeDrawer';

describe('CustomizableDrawer Component', () => {
  const baseCols = [
    { headerName: 'A', actualField: 'a', active: true, order: 1 },
    { headerName: 'B', actualField: 'b', active: false, order: null },
    { headerName: 'Re try', actualField: 'retry', active: true, order: 2 },
  ];
  const baseProps = {
    open: true,
    onClose: jest.fn(),
    selectedColumns: baseCols,
    setSelectedColumns: jest.fn((updater) => { if (typeof updater === 'function') updater(baseCols); }),
    handleSubmit: jest.fn(),
    handleReset: jest.fn(),
    isResetting: false,
    isSubmitting: false,
    title: 'Table Customize'
  };

  beforeEach(() => jest.clearAllMocks());

  test('renders drawer with title, search and column items excluding "Re try"', () => {
    render(<CustomizableDrawer {...baseProps} />);
    expect(screen.getByText('Table Customize')).toBeInTheDocument();
    // Search input exists
    expect(screen.getAllByPlaceholderText('Search').length).toBeGreaterThan(0);
    // column A visible, Re try excluded
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('Re try')).not.toBeInTheDocument();
  });

  test('Select All and Clear All buttons click handlers invoked', () => {
    render(<CustomizableDrawer {...baseProps} />);
    fireEvent.click(screen.getByTestId('btn-Select All'));
    fireEvent.click(screen.getByTestId('btn-Clear All'));
    expect(baseProps.setSelectedColumns).toHaveBeenCalledTimes(2);
  });

  test('search filters items by headerName without crashing', () => {
    render(<CustomizableDrawer {...baseProps} />);
    const inputs = screen.getAllByPlaceholderText('Search');
    fireEvent.change(inputs[0], { target: { value: 'b' } });
    expect(screen.getByText('Table Customize')).toBeInTheDocument();
  });

  test('footer buttons reflect loading/disabled states and Insert disabled with <2 active columns', () => {
    const props = { ...baseProps, isResetting: true, isSubmitting: true, selectedColumns: [{ headerName: 'OnlyOne', actualField: 'o', active: true, order: 1 }] };
    render(<CustomizableDrawer {...props} />);
    expect(screen.getByTestId('btn-Reset')).toBeDisabled();
    expect(screen.getByTestId('btn-Insert')).toBeDisabled();
  });

  test('Insert builds payload and calls handleSubmit', () => {
    render(<CustomizableDrawer {...baseProps} />);
    fireEvent.click(screen.getByTestId('btn-Insert'));
    expect(baseProps.handleSubmit).toHaveBeenCalled();
  });
}); 