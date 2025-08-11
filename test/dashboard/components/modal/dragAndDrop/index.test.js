import React from 'react';
import { render, screen } from '@testing-library/react';
import DragAndDrap from '../../../../../src/commonPages/dashboard/component/modal/dragAndDrap';

// Mock the Layout component
jest.mock('../../../../../src/commonPages/dashboard/component/layout', () => {
  return function MockLayout(props) {
    return (
      <div data-testid="layout">
        <div data-testid="selected-tab">{props.selectedTab}</div>
        <div data-testid="is-draggable">{props.isDragable ? 'true' : 'false'}</div>
        <div data-testid="dashboard">{JSON.stringify(props.dashboard)}</div>
        <div data-testid="selected-role">{props.selectedRole}</div>
      </div>
    );
  };
});

describe("DragAndDrop component", () => {
  test("renders with default props", () => {
    render(<DragAndDrap />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument(); // isDragable should be true
  });

  test("renders with selectedTab prop", () => {
    render(<DragAndDrap selectedTab="Default" />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('selected-tab')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument(); // isDragable should be true
  });

  test("renders with dashboard and setDashboard props", () => {
    const mockDashboard = { items: ['item1', 'item2'] };
    const mockSetDashboard = jest.fn();

    render(
      <DragAndDrap 
        selectedTab="Workflows"
        dashboard={mockDashboard}
        setDashboard={mockSetDashboard}
        selectedRole="admin"
      />
    );
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument(); // isDragable should be true
    expect(screen.getByText('{"items":["item1","item2"]}')).toBeInTheDocument();
  });

  test("renders with different selectedTab values", () => {
    const tabs = ["Default", "Workflows", "Invalid", "WorkQueue"];
    
    tabs.forEach(tab => {
      const { unmount } = render(<DragAndDrap selectedTab={tab} />);
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByText(tab)).toBeInTheDocument();
      expect(screen.getByText('true')).toBeInTheDocument(); // isDragable should always be true
      unmount();
    });
  });
}); 