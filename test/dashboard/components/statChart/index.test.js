import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../../../../src/commonPages/dashboard/component/statChart';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, style }) {
    return <img src={src} alt={alt} style={style} data-testid="next-image" />;
  };
});

describe("StatCard component", () => {
  test("renders with default props", () => {
    render(<StatCard title="Total Users" value={150} />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test("renders with custom styling props", () => {
    render(
      <StatCard 
        title="Revenue"
        value="$50,000"
        bgColor={{ src: 'test-bg.png' }}
        textColor="#FFFFFF"
        borderRadius="12px"
        padding="20px"
      />
    );
    
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  test("renders with different font sizes and weights", () => {
    render(
      <StatCard 
        title="Orders"
        value={75}
        fontSize="24px"
        fontWeight="bold"
        textAlign="center"
      />
    );
    
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  test("renders with custom layout props", () => {
    render(
      <StatCard 
        title="Active Projects"
        value={12}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minWidth="200px"
        height="100px"
      />
    );
    
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
