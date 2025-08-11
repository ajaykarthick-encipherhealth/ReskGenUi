import React from 'react';
import { render, screen } from '@testing-library/react';
import Widget from '../../../../../src/commonPages/dashboard/component/modal/widget';

// Mock the Layout component
jest.mock('../../../../../src/commonPages/dashboard/component/layout', () => {
  return function MockLayout(props) {
    return (
      <div data-testid="layout">
        <div data-testid="selected-tab">{props.selectedTab}</div>
        <div data-testid="selected-item">{props.selecteItem}</div>
        <div data-testid="selected-role">{props.selectedRole}</div>
      </div>
    );
  };
});

describe("Modal Widget component", () => {
  test("renders with default props", () => {
    render(<Widget />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  test("renders with selectedTab prop", () => {
    render(<Widget selectedTab="Default" />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('selected-tab')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  test("renders with all props", () => {
    const mockProps = {
      selectedTab: "Workflows",
      selecteItem: "test-item",
      setSelectedItem: jest.fn(),
      handleSelect: jest.fn(),
      selectedRole: "admin"
    };

    render(<Widget {...mockProps} />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('test-item')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  test("renders with different selectedTab values", () => {
    const tabs = ["Default", "Workflows", "Invalid", "WorkQueue"];
    
    tabs.forEach(tab => {
      const { unmount } = render(<Widget selectedTab={tab} />);
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByText(tab)).toBeInTheDocument();
      unmount();
    });
  });
}); 