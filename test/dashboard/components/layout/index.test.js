import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../../../src/commonPages/dashboard/component/layout';

// Mock the sub-components
jest.mock('../../../../src/commonPages/dashboard/component/layout/default', () => {
  return function MockDefault(props) {
    return <div data-testid="default-component">Default Component</div>;
  };
});

jest.mock('../../../../src/commonPages/dashboard/component/layout/invalid/Invalid', () => {
  return function MockInvalid(props) {
    return <div data-testid="invalid-component">Invalid Component</div>;
  };
});

jest.mock('../../../../src/commonPages/dashboard/component/layout/workflow', () => {
  return function MockWorkflow(props) {
    return <div data-testid="workflow-component">Workflow Component</div>;
  };
});

jest.mock('../../../../src/commonPages/dashboard/component/layout/workQueue', () => {
  return function MockWorkQueue(props) {
    return <div data-testid="workqueue-component">WorkQueue Component</div>;
  };
});

describe("Layout component", () => {
  test("renders with default props", () => {
    render(<Layout />);
    // When no selectedTab is provided, no component should be rendered
    expect(screen.queryByTestId('default-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workflow-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workqueue-component')).not.toBeInTheDocument();
  });

  test("renders Default component when selectedTab is Default", () => {
    render(<Layout selectedTab="Default" />);
    expect(screen.getByTestId('default-component')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workqueue-component')).not.toBeInTheDocument();
  });

  test("renders Workflow component when selectedTab is Workflows", () => {
    render(<Layout selectedTab="Workflows" />);
    expect(screen.getByTestId('workflow-component')).toBeInTheDocument();
    expect(screen.queryByTestId('default-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workqueue-component')).not.toBeInTheDocument();
  });

  test("renders Invalid component when selectedTab is Invalid", () => {
    render(<Layout selectedTab="Invalid" />);
    expect(screen.getByTestId('invalid-component')).toBeInTheDocument();
    expect(screen.queryByTestId('default-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workflow-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workqueue-component')).not.toBeInTheDocument();
  });

  test("renders WorkQueue component when selectedTab is WorkQueue", () => {
    render(<Layout selectedTab="WorkQueue" />);
    expect(screen.getByTestId('workqueue-component')).toBeInTheDocument();
    expect(screen.queryByTestId('default-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workflow-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-component')).not.toBeInTheDocument();
  });

  test("renders nothing when selectedTab is unknown", () => {
    render(<Layout selectedTab="Unknown" />);
    expect(screen.queryByTestId('default-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workflow-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workqueue-component')).not.toBeInTheDocument();
  });
}); 