import React from 'react';
import { render, screen } from '@testing-library/react';
import Table from '../../../../src/commonPages/dashboard/component/table';

// Mock the antd components
jest.mock('antd', () => ({
  Empty: () => <div data-testid="empty">No Data</div>,
  Progress: ({ percent, format }) => <div data-testid="progress">{format ? format(percent) : `${percent}%`}</div>
}));

// Mock the utility function
jest.mock('../../../../src/utils/reusable', () => ({
  getColorValue: jest.fn(() => '#1890ff')
}));

// Mock the icons
jest.mock('@ant-design/icons', () => ({
  CheckCircleFilled: () => <span data-testid="check-circle-filled">✓</span>,
  CheckCircleOutlined: () => <span data-testid="check-circle-outlined">○</span>
}));

describe("Table component", () => {
  const mockColumns = [
    { title: 'Name', dataIndex: 'name', className: 'name-col' },
    { title: 'Age', dataIndex: 'age', className: 'age-col' },
    { title: 'Progress', dataIndex: 'progress', isProgress: true }
  ];

  const mockItems = [
    { name: 'John Doe', age: 25, progress: 75 },
    { name: 'Jane Smith', age: 30, progress: 100 }
  ];

  test("renders table with title and data", () => {
    render(
      <Table 
        title="Test Table"
        columns={mockColumns}
        items={mockItems}
      />
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  test("renders empty state when no items", () => {
    render(
      <Table 
        columns={mockColumns}
        items={[]}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test("renders progress column correctly", () => {
    render(
      <Table 
        columns={mockColumns}
        items={mockItems}
      />
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});